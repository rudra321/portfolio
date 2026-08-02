// ── Eval engine types ────────────────────────────────────────────────────────
// Shared contracts for the verification/eval engine. The engine reuses the
// PRODUCTION chat modules verbatim (prompt, postprocess, protocol, config, data)
// and only adds the eval-specific shapes below.

import type { ChatMessage } from "../types";

/** A behavioral category the judge can assert against (boundary/honesty cases). */
export type Behavior =
  | "defer-to-email" // compensation / start date / private detail → point to email
  | "decline-and-steer" // off-topic ask → wave off in character, steer back to work
  | "refuse" // jailbreak / prompt-extraction → refuse, no leak
  | "honest-negative"; // "do you know X" where X isn't real → admit it, no fabrication

/** What a good answer must (and must not) contain / do for a given prompt. */
export interface Expectation {
  /**
   * Expected card kind in the FINAL reply:
   *  - a string ("projects", "project", "skills", "contact", …) → at least one
   *    marker of that kind must be present
   *  - null → the reply must carry NO card at all
   *  - undefined → don't assert on cards
   */
  tag?: string | null;
  /** Case-insensitive substrings that MUST all appear in the parsed prose. */
  mustInclude?: string[];
  /** Case-insensitive substrings that must NOT appear anywhere in the reply. */
  mustNotInclude?: string[];
  /** Hard cap on prose sentence count (informs concision dimension). */
  maxSentences?: number;
  /** Behavioral assertion for boundary/honesty cases. */
  behavior?: Behavior;
  /**
   * For tag === a string, optionally require a specific project id
   * (e.g. expect a [[ui:project {"id":"raaz-platform"}]]). Pure convenience —
   * grounding still checks it.
   */
  projectId?: string;
  /**
   * "one of" inclusion: at least ONE of these substrings must appear. Useful for
   * cases like "mention Claude OR Groq OR 70%".
   */
  includeOneOf?: string[];
}

/** A single-turn test case. */
export interface EvalCase {
  id: string;
  /** What's being probed, for the report. */
  description: string;
  /** The user's message. */
  prompt: string;
  expect: Expectation;
}

/** A multi-turn test case: prior turns set up context; only the LAST is scored. */
export interface ConversationCase {
  id: string;
  description: string;
  /** Full ordered turns. Each user turn gets a reply; only the last is judged. */
  turns: string[];
  /** Expectation applied to the FINAL assistant reply. */
  expectLast: Expectation;
  /** A topic/keyword that the final reply should still be about (continuity). */
  retainTopic?: string;
}

export type AnyCase = EvalCase | ConversationCase;

export function isConversationCase(c: AnyCase): c is ConversationCase {
  return Array.isArray((c as ConversationCase).turns);
}

/** Names of the scored rubric dimensions. */
export type DimensionName =
  | "grounding"
  | "relevance"
  | "voice"
  | "concision"
  | "followup"
  | "boundary";

/** A judge's score for one rubric dimension. */
export interface DimensionScore {
  dimension: DimensionName;
  score: number; // 0..1
  pass: boolean; // score >= this dimension's threshold
  reason: string;
}

/** A judge's full verdict over all dimensions. */
export interface JudgeVerdict {
  dimensions: DimensionScore[];
  /** Weighted composite over all dimensions, 0..1. */
  composite: number;
  /** True iff hard-gated dimensions passed AND composite >= COMPOSITE_PASS. */
  pass: boolean;
  /** Which judge produced this ("rule" | "llm"). */
  judge: string;
}

/** A deterministic check finding. */
export interface CheckFinding {
  check: string; // "tag-format" | "length" | "banlist"
  ok: boolean;
  detail: string;
}

/** Full result for one case. */
export interface EvalResult {
  id: string;
  description: string;
  kind: "single" | "multi" | "adversarial";
  prompt: string; // last user turn
  raw: string; // raw model reply (final turn)
  /** Deterministic oracle findings. */
  checks: CheckFinding[];
  /** True iff every deterministic check passed (the hard gate). */
  checksPass: boolean;
  /** Judge verdict (only meaningful if checksPass). */
  verdict: JudgeVerdict;
  /** Final pass = checksPass AND verdict.pass. */
  pass: boolean;
  /** Failure reasons, flattened for the report. */
  failures: string[];
}

/** Re-export the conversation message shape used to call providers. */
export type { ChatMessage };
