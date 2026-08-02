// ── Deterministic oracles ────────────────────────────────────────────────────
// PURE checks (no LLM, no network). Each runs on the PRODUCTION normalizeReply()
// output plus the raw reply, so format/length/voice violations are caught the
// same way the UI would render them. These form the HARD gate: a case can't pass
// the rubric if any of these fail.

import { normalizeReply, type ParsedReply } from "../postprocess";
import { TAG_KINDS, PROJECT_IDS } from "../protocol";
import type { CheckFinding } from "./types";

// The banned-phrase list — the SAME phrases the persona forbids. Kept here as the
// machine-checkable mirror of VOICE's "Banned phrases" line.
export const BANNED_PHRASES = [
  "i'm passionate about",
  "leverage",
  "utiliz",
  "robust",
  "seamless",
  "cutting-edge",
  "it's worth noting",
  "at the end of the day",
  "that said",
  "delv",
  "in today's world",
  "not only",
  "a testament to",
] as const;

const VALID_KINDS = new Set<string>(TAG_KINDS);

/** Count sentences in prose. Terminal . ! ? groups; trims trailing fragments. */
export function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  // Split on sentence-ending punctuation followed by whitespace or end.
  const parts = trimmed
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => /[A-Za-z0-9]/.test(s)); // drop pure-punctuation fragments
  return parts.length || 1;
}

/** TAG / FORMAT oracle — runs on parsed segments + raw body. */
export function checkTagFormat(raw: string, parsed: ParsedReply): CheckFinding {
  const problems: string[] = [];

  // ≤ 2 markers total (matched [[ui:…]] occurrences in the raw body).
  const markerMatches = raw.match(/\[\[ui:/gi) ?? [];
  if (markerMatches.length > 2) {
    problems.push(`${markerMatches.length} markers (max 2)`);
  }

  // All emitted card kinds must be valid, with valid project ids.
  for (const a of parsed.actions) {
    if (!VALID_KINDS.has(a.type)) problems.push(`invalid kind "${a.type}"`);
    if (a.type === "project" && !PROJECT_IDS.has(a.id)) {
      problems.push(`invalid project id "${a.id}"`);
    }
  }

  // Each marker must be on its own line in the raw reply: no text glued to a
  // [[ui:…]] marker on the same line (a lead-in must be on the PRECEDING line).
  const lines = raw.split("\n");
  for (const line of lines) {
    const t = line.trim();
    const uiMatches = t.match(/\[\[ui:[^\]]*\]\]/gi) ?? [];
    if (uiMatches.length === 0) continue;
    if (uiMatches.length > 1) {
      problems.push("two markers on one line");
    }
    // The marker should be the WHOLE trimmed line (prose belongs on its own line).
    const stripped = t.replace(/\[\[ui:[^\]]*\]\]/gi, "").trim();
    if (stripped.length > 0) {
      problems.push("prose on same line as marker");
    }
  }

  // No leaked literal "[[" in the PARSED prose (a malformed/garbled marker that
  // survived into the rendered bubble).
  if (parsed.text.includes("[[")) {
    problems.push('leaked "[[" in prose');
  }

  // No markdown: bold/italic (**), headings (leading #), or "- " bullet lines.
  if (/\*\*/.test(parsed.text)) problems.push("markdown bold (**)");
  for (const line of parsed.text.split("\n")) {
    const t = line.trim();
    if (/^#{1,6}\s/.test(t)) problems.push("markdown heading (#)");
    if (/^[-*]\s+/.test(t)) problems.push("markdown bullet (- )");
  }

  return {
    check: "tag-format",
    ok: problems.length === 0,
    detail: problems.length ? problems.join("; ") : "ok",
  };
}

/** LENGTH oracle — sentence count + em-dash count on parsed prose. */
export function checkLength(parsed: ParsedReply): CheckFinding {
  const problems: string[] = [];
  const warnings: string[] = [];

  const sentences = countSentences(parsed.text);
  if (sentences > 6) problems.push(`${sentences} sentences (hard cap 6)`);
  else if (sentences > 4) warnings.push(`${sentences} sentences (warn >4)`);

  // ≤ 1 em-dash per reply.
  const emDashes = (parsed.text.match(/—/g) ?? []).length;
  if (emDashes > 1) problems.push(`${emDashes} em-dashes (max 1)`);

  const detailParts = [...problems];
  if (warnings.length) detailParts.push(`warn: ${warnings.join(", ")}`);

  return {
    check: "length",
    ok: problems.length === 0,
    detail: detailParts.length ? detailParts.join("; ") : "ok",
  };
}

/** BANLIST oracle — forbidden AI-slop phrases anywhere in the parsed prose. */
export function checkBanlist(parsed: ParsedReply): CheckFinding {
  const hay = parsed.text.toLowerCase();
  const hits = BANNED_PHRASES.filter((p) => hay.includes(p));
  return {
    check: "banlist",
    ok: hits.length === 0,
    detail: hits.length ? `banned: ${hits.join(", ")}` : "ok",
  };
}

/** Run every deterministic oracle on a raw reply. Parses via PRODUCTION code. */
export function runChecks(raw: string): {
  parsed: ParsedReply;
  findings: CheckFinding[];
  pass: boolean;
} {
  const parsed = normalizeReply(raw);
  const findings = [
    checkTagFormat(raw, parsed),
    checkLength(parsed),
    checkBanlist(parsed),
  ];
  return { parsed, findings, pass: findings.every((f) => f.ok) };
}
