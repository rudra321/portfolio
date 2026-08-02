import { PROJECTS } from "@/data/projects";
import { SKILLS } from "@/data/skills";
import { STATS } from "@/data/stats";

// ── SINGLE SOURCE OF TRUTH for the response/UI marker protocol ───────────────
// The model embeds [[ui:<kind> <json?>]] markers and a trailing
// [[next: q | q | q]]. This file derives the regexes, the action union, the
// prompt's marker menu, and the validation sets — so adding a card kind is one
// edit the compiler propagates.

export type ChatAction =
  | { type: "projects" }
  | { type: "project"; id: string }
  | { type: "experience" }
  | { type: "skills"; category?: string }
  | { type: "stat"; value: string; label: string }
  | { type: "contact" }
  | { type: "resume" };

export const TAG_KINDS = [
  "projects",
  "project",
  "experience",
  "skills",
  "stat",
  "contact",
  "resume",
] as const;
export type TagName = (typeof TAG_KINDS)[number];

export const UI_RE = new RegExp(
  `\\[\\[ui:(${TAG_KINDS.join("|")})(?:\\s+(\\{[^]*?\\}))?\\]\\]`,
  "gi"
);
export const NEXT_RE = /\[\[next:([^\]]*)\]\]/i;
// Only a *trailing* incomplete marker (mid-stream) — never nukes interior prose.
// The optional `\]?` also hides a marker that has its first closing bracket but
// not yet the second (e.g. "…}]" mid-stream), so a half-marker never flashes as
// literal text for a frame. A complete "]]" has two brackets left, so `$` can't
// match — complete markers are left for UI_RE/NEXT_RE.
export const PARTIAL_RE = /\[\[(?:ui|next):[^\]]*\]?$/i;

export const PROJECT_IDS = new Set(PROJECTS.map((p) => p.id));
export const STAT_VALUES = new Set(STATS.map((s) => s.value));

// The marker menu injected into the system prompt — generated from the data so
// the model only ever sees valid ids/values/categories.
export function protocolPromptBlock(): string {
  const ids = PROJECTS.map((p) => p.id).join(", ");
  const stats = STATS.map((s) => `${s.value} (${s.label})`).join("; ");
  const cats = SKILLS.map((s) => s.category).join(", ");
  return `Markers (emit silently — never write the word "marker" or describe them):
  [[ui:projects]]                            all featured project cards — "what have you built / your work"
  [[ui:project {"id":"<id>"}]]               ONE project spotlight — when they ask about a specific thing
       valid ids: ${ids}
  [[ui:experience]]                          work history — "where have you worked / your career"
  [[ui:skills]]  or  [[ui:skills {"category":"<cat>"}]]   your stack; valid categories: ${cats}
  [[ui:stat {"value":"<v>","label":"<l>"}]]  one highlighted number
       valid values: ${stats}
  [[ui:contact]]                             hiring / availability / how to reach you
  [[ui:resume]]                              when they ask for a CV / résumé

Marker rules: at most TWO markers per reply, prefer ONE. Each on its own line, with a complete sentence (ending in a period) before it. Never two markers back-to-back. If unsure of a project id, use [[ui:projects]]. Many answers need no marker at all — a short factual or opinion answer should have none.
Card choice: "best at / strongest / your stack / strengths / what do you know" → [[ui:skills]] (NOT projects). [[ui:projects]] / [[ui:project]] is ONLY for things you actually built. Never put a card on a refusal or off-topic decline.`;
}
