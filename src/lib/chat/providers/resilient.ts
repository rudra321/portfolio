import type { ChatProvider, ChatMessage } from "../types";
import { clog } from "../debug";

// ── The reliability spine ────────────────────────────────────────────────────
// Wraps an ordered chain of providers. It tries each in turn and transparently
// falls through to the next ONLY if the current one fails before emitting a
// single token. Once any text has streamed to the screen we can't restart mid
// answer, so a later failure surfaces as an error (the UI offers Retry).
//
// In production the chain is [proxy → local]: if the Worker (Claude → Gemini →
// Groq, server-side) is unreachable or rate-limited, the browser answers from the
// local KB instead. The visitor never sees "couldn't reach the AI" for a capacity
// problem — the conversation simply continues, fully offline if it has to.
export function resilientProvider(chain: ChatProvider[]): ChatProvider {
  const live = chain.filter(Boolean);
  return {
    id: `resilient(${live.map((p) => p.id).join("→")})`,
    async *streamReply(messages: ChatMessage[], signal: AbortSignal) {
      clog("resilient", `chain: ${live.map((p) => p.id).join(" → ")}`);
      let lastErr: unknown;

      for (let i = 0; i < live.length; i++) {
        if (signal.aborted) return;
        const provider = live[i];
        const isLast = i === live.length - 1;
        let yielded = false;

        clog("resilient", `trying ${provider.id} (${i + 1}/${live.length})`);
        try {
          for await (const delta of provider.streamReply(messages, signal)) {
            if (delta && !yielded) clog("resilient", `✓ answered by ${provider.id}`);
            if (delta) yielded = true;
            yield delta;
          }
          if (yielded || signal.aborted) return; // clean, non-empty success
          // Clean finish but produced nothing → treat as a soft miss and fall
          // through to the next provider (unless this was the last one).
          if (isLast) return;
          clog("resilient", `${provider.id} produced nothing → next provider`);
        } catch (err) {
          if (signal.aborted) return; // user pressed Stop — not a failure
          lastErr = err;
          if (yielded || isLast) {
            clog("resilient", `${provider.id} failed (mid-stream or last in chain)`, err);
            throw err; // can't recover; let the UI handle it
          }
          clog("resilient", `${provider.id} failed before first token → next provider`, err);
          // else: silently advance to the next provider in the chain
        }
      }

      if (lastErr) throw lastErr;
    },
  };
}
