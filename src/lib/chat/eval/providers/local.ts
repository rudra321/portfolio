// ── Local-engine provider (eval-only) ────────────────────────────────────────
// Scores the Tier-3 in-browser engine (src/lib/chat/providers/local.ts) against
// the SAME rubric as the LLM tiers — fully offline, no API key, deterministic.
// Proves the failover floor produces grounded, marker-valid, banlist-clean
// replies. Runs all batteries (single / multi / adversarial).

import { localReply } from "../../providers/local";
import type { ChatMessage } from "../../types";
import type { Provider } from "./groq";

export const localEvalProvider: Provider = {
  id: "local",
  async complete(_caseId: string, turns: ChatMessage[]) {
    return localReply(turns);
  },
};
