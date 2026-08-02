import { buildSystemPrompt } from "../prompt";
import { CHAT_CONFIG, CHAT_ENDPOINT } from "../config";
import { clog } from "../debug";
import type { ChatProvider } from "../types";

const ENDPOINT = CHAT_ENDPOINT;

// Streams from our own Worker (which holds the provider keys). The system prompt
// is added here so the persona/guardrails live in one place; the Worker tries
// its provider chain (Claude → Gemini → Groq) and returns OpenAI-style SSE.
export const proxyProvider: ChatProvider = {
  id: "proxy",
  async *streamReply(messages, signal) {
    if (!ENDPOINT) throw new Error("NEXT_PUBLIC_CHAT_ENDPOINT is not set");

    const payload = [
      { role: "system" as const, content: buildSystemPrompt() },
      ...messages,
    ];

    clog("proxy", `POST ${ENDPOINT} (${payload.length} msgs)`);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: payload,
        model: CHAT_CONFIG.model,
        temperature: CHAT_CONFIG.temperature,
        top_p: CHAT_CONFIG.topP,
        frequency_penalty: CHAT_CONFIG.frequencyPenalty,
        max_tokens: CHAT_CONFIG.maxOutputTokens,
      }),
      signal,
    });

    clog("proxy", `← ${res.status}`, `served by: ${res.headers.get("x-provider") ?? "?"}`);
    if (!res.ok || !res.body) {
      throw new Error(`Chat endpoint returned ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let first = true;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") {
            clog("proxy", "stream done");
            return;
          }

          let json: {
            error?: unknown;
            choices?: { delta?: { content?: string } }[];
          };
          try {
            json = JSON.parse(data);
          } catch {
            continue; // partial line / keepalive
          }
          if (json.error) {
            const msg =
              typeof json.error === "string"
                ? json.error
                : (json.error as { message?: string })?.message ?? "Upstream error";
            clog("proxy", "upstream error", msg);
            throw new Error(msg);
          }
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            if (first) {
              clog("proxy", "first token");
              first = false;
            }
            yield delta;
          }
        }
      }
    } finally {
      // Release the stream on abort, early return ([DONE]), or throw.
      reader.cancel().catch(() => {});
    }
  },
};
