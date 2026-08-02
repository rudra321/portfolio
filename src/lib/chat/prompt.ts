import { buildKnowledge } from "./knowledge";
import { protocolPromptBlock } from "./protocol";
import { EXAMPLES } from "./examples";
import {
  PERSONA,
  STRUCTURE,
  LENGTH,
  VOICE,
  SELF_ASSESSMENT,
  GROUNDING,
  REFUSAL,
  CONTINUITY,
  RENDERING_INTRO,
  SUGGESTIONS,
  REMEMBER,
} from "./persona";

// The production system prompt — assembled from single-source parts (persona +
// the generated marker menu + few-shot examples + knowledge). Reused verbatim by
// the app providers AND the eval engine.
export function buildSystemPrompt(): string {
  return [
    PERSONA,
    STRUCTURE,
    LENGTH,
    VOICE,
    SELF_ASSESSMENT,
    GROUNDING,
    REFUSAL,
    CONTINUITY,
    RENDERING_INTRO,
    protocolPromptBlock(),
    SUGGESTIONS,
    EXAMPLES,
    REMEMBER,
    `KNOWLEDGE\n${buildKnowledge()}`,
  ].join("\n\n");
}
