import {
  UI_RE,
  NEXT_RE,
  PARTIAL_RE,
  PROJECT_IDS,
  STAT_VALUES,
  type ChatAction,
} from "./protocol";
import { SKILLS } from "@/data/skills";
import { STATS } from "@/data/stats";

// Canonical stat labels keyed by value — the model's label is overridden so a
// stat card always reads the verified wording ("patients", never "users").
const STAT_LABEL = new Map(STATS.map((s) => [s.value, s.label]));

// ── THE response contract ────────────────────────────────────────────────────
// normalizeReply(raw) parses a model reply into ordered prose/card segments,
// suggested follow-ups, and a flat action list — defensively (a malformed marker
// drops only itself, never blanks the bubble). Used by the UI, the providers'
// announce path, and the eval engine — one parser, no copies.

const SKILL_CATS = new Map(SKILLS.map((s) => [s.category.toLowerCase(), s.category]));
const CAT_ALIASES: Record<string, string> = {
  frontend: "Frontend",
  front: "Frontend",
  backend: "Backend",
  back: "Backend",
  devops: "Cloud & DevOps",
  cloud: "Cloud & DevOps",
  ai: "AI / ML",
  ml: "AI / ML",
  "ai/ml": "AI / ML",
  language: "Languages",
  languages: "Languages",
};
const MAX_CARDS = 3;

export type Segment =
  | { type: "prose"; text: string }
  | { type: "card"; action: ChatAction };

export interface ParsedReply {
  segments: Segment[];
  next: string[];
  actions: ChatAction[];
  text: string; // plain prose only (for screen-reader announce)
}

export function actionKey(a: ChatAction): string {
  return JSON.stringify(a);
}

function toAction(kind: string, argRaw?: string): ChatAction | null {
  const k = kind.toLowerCase();
  let args: Record<string, unknown> = {};
  if (argRaw) {
    try {
      args = JSON.parse(argRaw);
    } catch {
      return null; // malformed JSON → drop this marker only
    }
  }
  switch (k) {
    case "projects":
      return { type: "projects" };
    case "experience":
      return { type: "experience" };
    case "contact":
      return { type: "contact" };
    case "resume":
      return { type: "resume" };
    case "project":
      return typeof args.id === "string" && PROJECT_IDS.has(args.id)
        ? { type: "project", id: args.id }
        : { type: "projects" }; // unknown id → safe fallback to the grid
    case "skills": {
      const raw = typeof args.category === "string" ? args.category.toLowerCase().trim() : "";
      const cat = SKILL_CATS.get(raw) ?? CAT_ALIASES[raw];
      return cat ? { type: "skills", category: cat } : { type: "skills" };
    }
    case "stat":
      return typeof args.value === "string" && STAT_VALUES.has(args.value)
        ? {
            type: "stat",
            value: args.value,
            label: STAT_LABEL.get(args.value) ?? (typeof args.label === "string" ? args.label : ""),
          }
        : null; // unknown stat → drop
    default:
      return null;
  }
}

const tidy = (s: string) =>
  s.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

export function normalizeReply(raw: string): ParsedReply {
  // 1. Pull out [[next:…]] first.
  let next: string[] = [];
  let body = raw.replace(NEXT_RE, (_m, inner: string) => {
    next = inner.split("|").map((s) => s.trim()).filter(Boolean).slice(0, 3);
    return "";
  });

  // 2. Strip a trailing, not-yet-complete marker (streaming).
  body = body.replace(PARTIAL_RE, "");

  // 3. Walk markers in document order → interleaved prose/card segments.
  const segments: Segment[] = [];
  const actions: ChatAction[] = [];
  let lastIndex = 0;
  let cards = 0;

  for (const m of body.matchAll(UI_RE)) {
    const offset = m.index ?? 0;
    const prose = tidy(body.slice(lastIndex, offset));
    if (prose) segments.push({ type: "prose", text: prose });
    lastIndex = offset + m[0].length;

    const action = toAction(m[1], m[2]);
    if (action && cards < MAX_CARDS) {
      segments.push({ type: "card", action });
      actions.push(action);
      cards += 1;
    }
  }
  const tail = tidy(body.slice(lastIndex));
  if (tail) segments.push({ type: "prose", text: tail });

  const text = segments
    .filter((s): s is Extract<Segment, { type: "prose" }> => s.type === "prose")
    .map((s) => s.text)
    .join("\n\n")
    .trim();

  // Follow-up hygiene: hard 6-word cap, max 3, and none after a contact/resume CTA.
  next = next.filter((q) => q.split(/\s+/).filter(Boolean).length <= 6).slice(0, 3);
  if (actions.some((a) => a.type === "contact" || a.type === "resume")) next = [];

  return { segments, next, actions, text };
}
