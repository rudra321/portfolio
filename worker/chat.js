// Cloudflare Worker — the portfolio chat's server-side brain.
//
// It holds the API keys (set them as secrets, never in code) and runs a
// 3-provider FAILOVER chain so a capacity problem on one provider never takes
// the chat down:
//
//   Tier 1  Anthropic Claude (Haiku 4.5)  — prompt-cached system prompt
//   Tier 2  Google Gemini (Flash)         — free-tier fallback
//   Tier 3  Groq (Llama 3.3 70B)          — legacy fallback
//
// Whichever provider answers, the Worker normalizes its stream to OpenAI-style
// SSE ("data: {choices:[{delta:{content}}]}" … "data: [DONE]") so the browser
// parser in src/lib/chat/providers/proxy.ts never has to care who served it.
// If every provider is down/rate-limited, the Worker errors and the BROWSER
// falls back to its local engine (src/lib/chat/providers/local.ts) — the chat
// keeps answering with zero network.
//
// Secrets (set with `wrangler secret put <NAME>`), all optional — the Worker
// uses whichever are present, in PROVIDER_ORDER:
//   ANTHROPIC_API_KEY   → Tier 1   (get a key at console.anthropic.com, set a spend cap)
//   GEMINI_API_KEY      → Tier 2   (aistudio.google.com — generous free tier)
//   GROQ_API_KEY        → Tier 3   (console.groq.com)
// Optional vars (wrangler.toml or dashboard):
//   ANTHROPIC_MODEL  (default "claude-haiku-4-5")
//   GEMINI_MODEL     (default "gemini-2.0-flash")
//   GROQ_MODEL       (default "llama-3.3-70b-versatile")
//   PROVIDER_ORDER   (default "anthropic,gemini,groq")
//   ALLOWED_ORIGINS  (comma-separated; omit to reflect any origin)

const ENDPOINTS = {
  anthropic: "https://api.anthropic.com/v1/messages",
  gemini: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
  groq: "https://api.groq.com/openai/v1/chat/completions",
};
const DEFAULT_MODELS = {
  anthropic: "claude-haiku-4-5",
  gemini: "gemini-flash-latest", // alias → current free Flash (thinking model)
  groq: "llama-3.3-70b-versatile",
};
const KEY_ENV = {
  anthropic: "ANTHROPIC_API_KEY",
  gemini: "GEMINI_API_KEY",
  groq: "GROQ_API_KEY",
};

const MAX_TOKENS = 600;
const MAX_MESSAGES = 24;
const MAX_CHARS = 4000; // per visitor-turn (abuse/cost guard)
const MAX_SYSTEM_CHARS = 60000; // our own system prompt (~15k) — generous bound only

// Transient upstream errors worth retrying on the SAME provider before failing
// over (Gemini "high demand" 503s, rate-limit 429s, gateway 5xx). Retries happen
// pre-stream, so there's never a partial reply to discard.
const MAX_ATTEMPTS = 3; // initial + up to 2 retries per provider
const RETRYABLE = new Set([408, 425, 429, 500, 502, 503, 504, 529]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const worker = {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return jsonError("Method not allowed", 405, cors);

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON", 400, cors);
    }

    // The browser sends the system prompt as the first message (role "system");
    // pull it out and map the rest of the conversation to OpenAI/Anthropic roles.
    const raw = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
    let system = "";
    const convo = [];
    for (const m of raw) {
      const text = String(m?.content ?? "");
      if (!text) continue;
      if (m.role === "system") {
        // Server-controlled system prompt (from our own client). It carries the
        // marker grammar + few-shot + the whole knowledge base (~15k chars), so
        // it must NOT be truncated by the per-visitor-turn guard.
        system = system ? `${system}\n\n${text}` : text;
      } else {
        const content = text.slice(0, MAX_CHARS); // visitor-turn abuse/cost guard
        if (content) convo.push({ role: m.role === "model" ? "assistant" : "user", content });
      }
    }
    system = system.slice(0, MAX_SYSTEM_CHARS);
    // Anthropic requires messages[0] to be a user turn, but a sliding history
    // window can begin on an assistant turn — drop any leading non-user messages
    // (otherwise long conversations 400 on Claude and silently lose Tier 1).
    while (convo.length && convo[0].role !== "user") convo.shift();
    if (convo.length === 0) return jsonError("No messages", 400, cors);

    const opts = {
      maxTokens: clampNum(body.max_tokens, MAX_TOKENS, 1, MAX_TOKENS),
      temperature: clampNum(body.temperature, 0.45, 0, 1),
      topP: clampNum(body.top_p, 0.9, 0, 1),
      frequencyPenalty: clampNum(body.frequency_penalty, 0.3, -2, 2),
    };

    const order = (env.PROVIDER_ORDER || "anthropic,gemini,groq")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((p) => ENDPOINTS[p] && env[KEY_ENV[p]]);

    if (order.length === 0) {
      return jsonError("No provider configured (set ANTHROPIC_API_KEY, GEMINI_API_KEY, or GROQ_API_KEY)", 503, cors);
    }

    dbg(env, `request: ${convo.length} msgs, system ${system.length} chars, order [${order.join(", ")}]`);

    let lastDetail = "";
    for (const provider of order) {
      const model = env[`${provider.toUpperCase()}_MODEL`] || DEFAULT_MODELS[provider];
      const req = buildRequest(provider, env, system, convo, opts);

      // Try this provider, retrying transient overload/rate-limit errors a few
      // times with backoff before falling over to the next provider.
      let upstream = null;
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        dbg(env, `trying ${provider} (${model})${attempt > 1 ? ` [retry ${attempt - 1}]` : ""}…`);
        let res;
        try {
          res = await fetch(req.url, { method: "POST", headers: req.headers, body: JSON.stringify(req.body) });
        } catch (e) {
          lastDetail = `${provider}: ${e}`;
          dbg(env, `${provider} fetch failed → next provider`, String(e));
          break; // network error → don't retry, move on
        }
        if (res.ok && res.body) {
          upstream = res;
          break;
        }
        const detail = (await res.text().catch(() => "")).slice(0, 200);
        lastDetail = `${provider} ${res.status}: ${detail}`;
        if (RETRYABLE.has(res.status) && attempt < MAX_ATTEMPTS) {
          const ms = retryDelayMs(res, detail, attempt);
          dbg(env, `${provider} → HTTP ${res.status} (transient), retry in ${ms}ms…`);
          await sleep(ms);
          continue;
        }
        dbg(env, `${provider} → HTTP ${res.status} → next provider`);
        break; // non-retryable, or retries exhausted
      }
      if (!upstream) continue; // this provider is out → next in the chain

      // Normalize to OpenAI-style SSE, then commit ONLY once the provider has
      // emitted its first real content token. A provider that 200s but then errors
      // or yields nothing before any token (overload events, capacity drops) is
      // failed over to the next provider instead of streaming a dead reply.
      const normalized = provider === "anthropic" ? anthropicToOpenAISSE(upstream.body) : upstream.body;
      const committed = await commitOnFirstToken(normalized);
      if (!committed) {
        lastDetail = `${provider}: no content before stream ended/errored`;
        dbg(env, `${provider} produced no content → next`);
        continue;
      }
      dbg(env, `✓ answered by ${provider}`);
      return new Response(committed, {
        headers: {
          ...cors,
          "content-type": "text/event-stream; charset=utf-8",
          "cache-control": "no-cache",
          "x-provider": provider,
        },
      });
    }

    // Every provider failed — the browser will fall back to its local engine.
    dbg(env, `all providers failed → browser uses local engine. ${lastDetail}`);
    return jsonError(`All providers failed. ${lastDetail}`, 502, cors);
  },
};

export default worker;

// ── Per-provider request shaping ─────────────────────────────────────────────
function buildRequest(provider, env, system, convo, opts) {
  const model = env[`${provider.toUpperCase()}_MODEL`] || DEFAULT_MODELS[provider];

  if (provider === "anthropic") {
    return {
      url: ENDPOINTS.anthropic,
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: {
        model,
        max_tokens: opts.maxTokens,
        // System prompt as a cached block → repeat requests bill it at ~0.1x.
        ...(system ? { system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }] } : {}),
        messages: convo,
        temperature: opts.temperature,
        stream: true,
      },
    };
  }

  // Gemini + Groq both speak the OpenAI chat-completions shape (system as a role).
  const messages = system ? [{ role: "system", content: system }, ...convo] : convo;
  const base = {
    model,
    messages,
    max_tokens: opts.maxTokens,
    temperature: opts.temperature,
    top_p: opts.topP,
    stream: true,
  };
  if (provider === "gemini") {
    // gemini-flash-latest is a thinking model — chain-of-thought would burn the
    // max_tokens budget and add latency for what are short portfolio answers.
    // Default thinking OFF; override with GEMINI_REASONING ("low"/"medium"/"high").
    const reasoning = env.GEMINI_REASONING || "none";
    if (reasoning) base.reasoning_effort = reasoning;
  }
  if (provider === "groq") {
    base.frequency_penalty = opts.frequencyPenalty;
    base.stop = ["\nUser:", "\nVisitor:"];
  }
  return {
    url: ENDPOINTS[provider],
    headers: { "content-type": "application/json", authorization: `Bearer ${env[KEY_ENV[provider]]}` },
    body: base,
  };
}

// ── Anthropic SSE → OpenAI-style SSE ─────────────────────────────────────────
// The browser parser only understands OpenAI deltas, so re-emit Claude's events
// in that shape. Keeps proxy.ts provider-agnostic.
function anthropicToOpenAISSE(upstreamBody) {
  const reader = upstreamBody.getReader();
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let closed = false;

  const send = (controller, obj) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
  const done = (controller) => {
    if (closed) return;
    closed = true;
    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
    controller.close();
  };

  return new ReadableStream({
    async pull(controller) {
      const { done: finished, value } = await reader.read();
      if (finished) return done(controller);

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data) continue;

        let evt;
        try {
          evt = JSON.parse(data);
        } catch {
          continue;
        }
        if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
          send(controller, { choices: [{ delta: { content: evt.delta.text } }] });
        } else if (evt.type === "message_stop") {
          return done(controller);
        } else if (evt.type === "error") {
          send(controller, { error: evt.error?.message ?? "Upstream error" });
          return done(controller);
        }
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}

// Peek a normalized OpenAI-SSE stream until its FIRST content delta. If one
// arrives, return a stream that replays the buffered bytes then pipes the rest
// (so the chosen provider streams normally). If the stream ends or errors before
// any content, return null so the caller fails over to the next provider. This is
// what makes the Anthropic→Gemini→Groq chain cover 200-then-error, not just
// connect-time failures.
async function commitOnFirstToken(normalized) {
  const reader = normalized.getReader();
  const decoder = new TextDecoder();
  const buffered = [];
  let textBuf = "";
  let ok = false;
  let failed = false;

  while (!ok && !failed) {
    let chunk;
    try {
      chunk = await reader.read();
    } catch {
      failed = true;
      break;
    }
    if (chunk.done) break;
    buffered.push(chunk.value);
    textBuf += decoder.decode(chunk.value, { stream: true });
    const lines = textBuf.split("\n");
    textBuf = lines.pop() ?? "";
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      let j;
      try {
        j = JSON.parse(data);
      } catch {
        continue; // JSON split across a chunk boundary — keep reading
      }
      if (j.error) {
        failed = true;
        break;
      }
      if (j.choices?.[0]?.delta?.content) {
        ok = true;
        break;
      }
    }
  }

  if (!ok) {
    reader.cancel().catch(() => {});
    return null;
  }

  let i = 0;
  return new ReadableStream({
    async pull(controller) {
      if (i < buffered.length) {
        controller.enqueue(buffered[i++]);
        return;
      }
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      controller.enqueue(value);
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}

// Server-side debug log — appears in `wrangler dev` / `wrangler tail`, never to
// visitors. ON by default while testing; set the DEBUG var to "0" to silence.
function dbg(env, ...args) {
  if (env && env.DEBUG === "0") return;
  console.log("[worker]", ...args);
}

// How long to wait before retrying a transient upstream error: honor a
// Retry-After header or a "try again in Xs" hint, else exponential backoff,
// capped at 5s so a brief spike recovers fast without stalling the visitor.
function retryDelayMs(res, bodyText, attempt) {
  const h = res.headers.get("retry-after");
  if (h) {
    const s = Number(h);
    if (Number.isFinite(s)) return Math.min(s * 1000, 5000);
  }
  const m = bodyText && bodyText.match(/(?:retry|try again) in\s*([\d.]+)\s*s/i);
  if (m) return Math.min(Math.ceil(parseFloat(m[1]) * 1000) + 200, 5000);
  return Math.min(500 * 2 ** (attempt - 1), 4000); // 500ms, 1s, 2s…
}

function clampNum(v, fallback, min, max) {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function corsHeaders(origin, env) {
  const allow = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allowed = allow.length === 0 || allow.includes(origin) ? origin || "*" : allow[0];
  return {
    "access-control-allow-origin": allowed,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    vary: "Origin",
  };
}

function jsonError(message, status, cors) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}
