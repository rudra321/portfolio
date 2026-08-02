import { proxyProvider } from "./providers/proxy";
import { localProvider } from "./providers/local";
import { resilientProvider } from "./providers/resilient";
import { CHAT_ENDPOINT } from "./config";
import type { ChatProvider } from "./types";

// Composition root — the ONE place that decides which provider is live.
//
//   - CHAT_ENDPOINT set (default: the production Worker) → resilient([proxy, local])
//       Tier 1/2 (Claude → Gemini → Groq) run server-side in the Worker behind
//       `proxy`. If the Worker is unreachable or out of capacity, `local` (the
//       in-browser RAG engine) answers instead — so the chat never hard-fails.
//   - otherwise → local only
export function getProvider(): ChatProvider {
  if (CHAT_ENDPOINT) {
    return resilientProvider([proxyProvider, localProvider]);
  }
  return localProvider;
}
