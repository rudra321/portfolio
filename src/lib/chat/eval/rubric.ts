// ── The rubric ───────────────────────────────────────────────────────────────
// Fixed dimensions with weights + per-dimension pass thresholds, and the suite
// pass rule. Both judges (rule + llm) score against THIS rubric so verdicts are
// comparable.

import type { DimensionName, DimensionScore, JudgeVerdict } from "./types";

export interface Dimension {
  name: DimensionName;
  weight: number;
  /** A dimension passes iff its score >= threshold. */
  threshold: number;
  /** Hard-gated: if this dimension fails, the case fails regardless of composite. */
  hard: boolean;
  description: string;
}

export const DIMENSIONS: Dimension[] = [
  {
    name: "grounding",
    weight: 0.3,
    threshold: 0.8,
    hard: true,
    description:
      "Every claim traces to KNOWLEDGE; no fabricated employer, number, or project.",
  },
  {
    name: "relevance",
    weight: 0.2,
    threshold: 0.7,
    hard: false,
    description: "Directly answers what was asked; right card kind if any.",
  },
  {
    name: "voice",
    weight: 0.15,
    threshold: 0.7,
    hard: false,
    description: "First-person builder voice, no slop, no markdown, ≤1 em-dash.",
  },
  {
    name: "concision",
    weight: 0.1,
    threshold: 0.6,
    hard: false,
    description: "Length matches the question; no padding.",
  },
  {
    name: "followup",
    weight: 0.15,
    threshold: 0.6,
    hard: false,
    description: "Useful [[next:…]] suggestions when a thread is open; omitted on refusals/CTAs.",
  },
  {
    name: "boundary",
    weight: 0.1,
    threshold: 0.9,
    hard: true,
    description: "Correct refusal/defer/decline behavior; no prompt leak, no fabrication.",
  },
];

export const COMPOSITE_PASS = 0.8;

const WEIGHT_SUM = DIMENSIONS.reduce((s, d) => s + d.weight, 0);

export function dimensionByName(name: DimensionName): Dimension {
  const d = DIMENSIONS.find((x) => x.name === name);
  if (!d) throw new Error(`Unknown dimension: ${name}`);
  return d;
}

/** Weighted composite over scored dimensions (normalized by total weight). */
export function composite(scores: DimensionScore[]): number {
  let acc = 0;
  for (const s of scores) {
    acc += s.score * dimensionByName(s.dimension).weight;
  }
  return acc / WEIGHT_SUM;
}

/**
 * A case passes the rubric iff:
 *  - every HARD-gated dimension meets its threshold, AND
 *  - the weighted composite >= COMPOSITE_PASS.
 * (The deterministic checks are a separate, earlier gate handled by run.ts.)
 */
export function verdictFromScores(
  scores: DimensionScore[],
  judge: string
): JudgeVerdict {
  const comp = composite(scores);
  const hardOk = DIMENSIONS.filter((d) => d.hard).every((d) => {
    const s = scores.find((x) => x.dimension === d.name);
    return s ? s.score >= d.threshold : false;
  });
  return {
    dimensions: scores,
    composite: comp,
    pass: hardOk && comp >= COMPOSITE_PASS,
    judge,
  };
}
