// ── Groq provider (eval-only, server-side) ───────────────────────────────────
// Calls Groq's OpenAI-compatible endpoint DIRECTLY from Node. The browser can't
// (Groq sends no CORS headers) — but the eval runs server-side, so there's no
// CORS problem and no Worker hop needed. NON-streaming (stream:false): the eval
// only needs the final assistant string.
//
// REUSES the production system prompt (buildSystemPrompt) and the production
// sampling knobs (CHAT_CONFIG). It never reimplements any persona/prompt logic.

import { buildSystemPrompt } from "../../prompt";
import { CHAT_CONFIG } from "../../config";
import type { ChatMessage } from "../../types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface Provider {
  readonly id: string;
  /** Given the conversation turns (user/model), return the assistant reply. */
  complete(caseId: string, turns: ChatMessage[]): Promise<string>;
}

/** Map the production ChatRole ("model") to the OpenAI/Groq role ("assistant"). */
function toApiRole(role: ChatMessage["role"]): "user" | "assistant" {
  return role === "model" ? "assistant" : "user";
}

export const groqProvider: Provider = {
  id: "groq",
  async complete(_caseId, turns) {
    const key = process.env.GROQ_API_KEY;
    if (!key) {
      throw new Error(
        "GROQ_API_KEY is not set. Export it to use --provider=groq, or run with --provider=fixture (no key needed)."
      );
    }

    // Window to the production history budget, then prepend the system prompt.
    const windowed = turns.slice(-CHAT_CONFIG.maxHistoryMessages);
    const messages = [
      { role: "system" as const, content: buildSystemPrompt() },
      ...windowed.map((m) => ({ role: toApiRole(m.role), content: m.content })),
    ];

    const payload = JSON.stringify({
      model: CHAT_CONFIG.model,
      messages,
      temperature: CHAT_CONFIG.temperature,
      top_p: CHAT_CONFIG.topP,
      frequency_penalty: CHAT_CONFIG.frequencyPenalty,
      max_tokens: CHAT_CONFIG.maxOutputTokens,
      stream: false,
    });

    // Free-tier Groq enforces a tokens-per-minute cap; self-throttle by honoring
    // 429 "try again in Xs" (and back off on transient 5xx) instead of failing.
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let res!: Response;
    let lastDetail = "";
    for (let attempt = 0; attempt < 8; attempt++) {
      res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
        body: payload,
      });
      if (res.status !== 429 && res.status < 500) break;
      lastDetail = await res.text().catch(() => "");
      const m = lastDetail.match(/try again in ([\d.]+)s/i);
      const waitMs = m ? Math.ceil(parseFloat(m[1]) * 1000) + 600 : (attempt + 1) * 8000;
      await sleep(Math.min(waitMs, 30000));
    }

    if (!res.ok) {
      const detail = res.bodyUsed ? lastDetail : await res.text().catch(() => "");
      throw new Error(`Groq error ${res.status}: ${detail.slice(0, 300)}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = json.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      throw new Error("Groq returned no assistant content");
    }
    return content;
  },
};
