import { proxyProvider } from "./providers/proxy";
import { localProvider } from "./providers/local";
import { resilientProvider } from "./providers/resilient";
import type { ChatProvider } from "./types";

// Composition root — the ONE place that decides which provider is live.
//
//   - NEXT_PUBLIC_CHAT_ENDPOINT set  → resilient([proxy, local])
//       Tier 1/2 (Claude → Gemini → Groq) run server-side in the Worker behind
//       `proxy`. If the Worker is unreachable or out of capacity, `local` (the
//       in-browser RAG engine) answers instead — so the chat never hard-fails.
//   - otherwise                      → local only
//       The full experience still works with ZERO setup and zero API keys;
//       deploy the Worker and set the endpoint to light up the LLM tiers.
export function getProvider(): ChatProvider {
  if (process.env.NEXT_PUBLIC_CHAT_ENDPOINT) {
    return resilientProvider([proxyProvider, localProvider]);
  }
  return localProvider;
}
