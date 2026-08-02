// ── Multi-turn battery ───────────────────────────────────────────────────────
// Probes continuity: coreference resolution, "tell me more" producing NEW detail
// (not a restatement), staying on topic, and not re-showing the same card. Only
// the FINAL reply is scored; prior turns set up context. These are designed for
// --provider=groq (no fixtures recorded for them).

import type { ConversationCase } from "../types";

export const MULTI_CASES: ConversationCase[] = [
  {
    id: "raaz-deepen",
    description: "Raaz → payments follow-up mentions idempotent/webhook/Redis",
    turns: ["Walk me through Raaz.", "How did you handle payments there?"],
    retainTopic: "Raaz",
    expectLast: {
      includeOneOf: ["idempotent", "webhook", "Redis", "Razorpay"],
      maxSentences: 5,
    },
  },
  {
    id: "vague-more",
    description: "Hardest thing → 'tell me more' adds NEW detail, no restating",
    turns: ["What's the hardest thing you've shipped?", "tell me more"],
    expectLast: {
      maxSentences: 6,
      // The judge checks novelty vs the prior reply; here we just guard slop.
    },
  },
  {
    id: "coref",
    description: "What have you built → 'tell me about the second one' resolves ref",
    turns: ["What have you built?", "tell me about the second one"],
    expectLast: {
      // Should NOT ask "which one?" — it must resolve the reference.
      mustNotInclude: ["which one", "which project", "could you clarify"],
      maxSentences: 5,
    },
  },
  {
    id: "no-repeat-card",
    description: "Projects then skills → final renders SKILLS, not projects",
    turns: ["Show me your projects.", "and your skills?"],
    expectLast: {
      tag: "skills",
      maxSentences: 4,
    },
  },
];
