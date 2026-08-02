// RAG-lite: lexical retrieval over the knowledge base, built from the SAME typed
// data that drives the site (so it never drifts). No embeddings, no model
// download — a tiny TF-IDF index that runs instantly in the browser. Two jobs:
//   1. Power the Tier-3 local engine (providers/local.ts) so the chat can answer
//      from the KB with ZERO network calls when every LLM is down.
//   2. Be cheap enough to ship in the static bundle (a few hundred terms).

import { PROJECTS } from "@/data/projects";
import { EXPERIENCES } from "@/data/experience";
import { SKILLS, ALL_SKILLS } from "@/data/skills";
import { PERSONAL } from "@/data/personal";
import type { ChatAction } from "./protocol";

export type ChunkKind = "project" | "experience" | "skill" | "persona";

export interface KbChunk {
  id: string;
  kind: ChunkKind;
  title: string;
  text: string;
  terms: string[];
  /** The card to surface when this chunk is the answer (validated by protocol). */
  action?: ChatAction;
}

// Small, hand-tuned stopword set — enough to stop "do/you/what/the" from
// dominating the score without an NLP dependency.
const STOPWORDS = new Set(
  `a an and the of to in is it its as at be by do does did for from has have had how i im i'm me my mine we us our you your yours he she they them their this that these those on or so if then than with about into over under can could would should will shall may might must what whats what's when where which who whom whose why your yourself tell give show ask me us know about thing things some any more most much many your you've youve been being am are was were`.split(
    /\s+/
  )
);

/** Lowercase word tokens; keeps tech punctuation (c++, node.js, ai/ml → ai, ml). */
export function tokenize(s: string): string[] {
  return (s.toLowerCase().match(/[a-z0-9][a-z0-9+#.]*/g) ?? [])
    .map((t) => t.replace(/\.+$/g, ""))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function buildChunks(): KbChunk[] {
  const chunks: KbChunk[] = [];

  for (const p of PROJECTS) {
    const text = `${p.title}. ${p.description} ${p.tags.join(" ")}`;
    chunks.push({
      id: `project:${p.id}`,
      kind: "project",
      title: p.title,
      text,
      terms: tokenize(text),
      action: { type: "project", id: p.id },
    });
  }

  for (const e of EXPERIENCES) {
    const text = `${e.role} at ${e.company}. ${e.location}. ${e.description.join(" ")} ${e.technologies.join(" ")}`;
    chunks.push({
      id: `exp:${e.company}`,
      kind: "experience",
      title: `${e.role} ${e.company}`,
      text,
      terms: tokenize(text),
      action: { type: "experience" },
    });
  }

  for (const s of SKILLS) {
    const text = `${s.category}. ${s.items.join(" ")}`;
    chunks.push({
      id: `skill:${s.category}`,
      kind: "skill",
      title: s.category,
      text,
      terms: tokenize(text),
      action: { type: "skills", category: s.category },
    });
  }

  const persona = `${PERSONAL.bio} Based in ${PERSONAL.location}. ${PERSONAL.degree}, ${PERSONAL.university}. ${PERSONAL.interests} ${PERSONAL.lookingFor}`;
  chunks.push({
    id: "persona",
    kind: "persona",
    title: "About Rudra background education",
    text: persona,
    terms: tokenize(persona),
  });

  return chunks;
}

export const CHUNKS: KbChunk[] = buildChunks();

// Document frequency → IDF, computed once over the (small) corpus.
const N = CHUNKS.length;
const DF = new Map<string, number>();
for (const c of CHUNKS) for (const t of new Set(c.terms)) DF.set(t, (DF.get(t) ?? 0) + 1);
function idf(term: string): number {
  const df = DF.get(term);
  return df ? Math.log(1 + N / df) : 0;
}

export interface Scored {
  chunk: KbChunk;
  score: number;
}

/** Rank KB chunks against a free-text query. TF-IDF with a title boost and a
 *  mild length normalization so long project blurbs don't always win. */
export function retrieve(query: string, limit = 3): Scored[] {
  const qTerms = new Set(tokenize(query));
  if (qTerms.size === 0) return [];

  const scored: Scored[] = CHUNKS.map((chunk) => {
    const tf = new Map<string, number>();
    for (const t of chunk.terms) tf.set(t, (tf.get(t) ?? 0) + 1);
    const titleTerms = new Set(tokenize(chunk.title));

    let score = 0;
    for (const t of qTerms) {
      const f = tf.get(t);
      if (!f) continue;
      score += idf(t) * (1 + Math.log(f));
      if (titleTerms.has(t)) score += idf(t) * 1.5;
    }
    return { chunk, score: score / Math.sqrt(chunk.terms.length || 1) };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

// ── Vocabulary helpers for honest-negative routing (Tier 3) ──────────────────
// What Rudra demonstrably knows (skills + the proper nouns in his KB), so the
// local engine can tell "do you know React?" (yes) from "do you know Rust?" (no).
export const KNOWN_TECH = new Set<string>([
  ...ALL_SKILLS.flatMap((s) => tokenize(s)),
  ...CHUNKS.flatMap((c) => c.terms),
  "js",
  "ts",
  "py",
  "wasm",
  "rn",
]);

// Common things he has NOT shipped — so an honest "no" never gets fabricated
// into a "yes". Only consulted when the question is clearly "do you know X".
// NOTE: keys that are also ordinary English words (go, swift, ruby, dart, unity,
// unreal) are deliberately EXCLUDED — "do you know how to go about this" must not
// trigger "I haven't shipped Go". Such a query falls through to retrieval, which
// is the safe degradation. Only unambiguous tech tokens live here.
export const UNKNOWN_TECH: Record<string, string> = {
  rust: "Rust",
  golang: "Go",
  java: "Java",
  kotlin: "Kotlin",
  scala: "Scala",
  rails: "Rails",
  php: "PHP",
  laravel: "Laravel",
  elixir: "Elixir",
  haskell: "Haskell",
  clojure: "Clojure",
  erlang: "Erlang",
  flutter: "Flutter",
  django: "Django",
  solidity: "Solidity",
  kubernetes: "Kubernetes",
  k8s: "Kubernetes",
  terraform: "Terraform",
  pytorch: "PyTorch",
  tensorflow: "TensorFlow",
};

// Companies he HAS worked at (for "your time at Google" honest-negatives).
export const KNOWN_COMPANIES = new Set(["raaz", "gj-map", "gjmap", "gj", "superpe", "super", "bits", "pilani"]);
