// ── Fixture provider ─────────────────────────────────────────────────────────
// Replays recorded raw replies from a JSON map { caseId: rawReply } so the whole
// suite runs deterministically with NO API key. The shipped fixtures.json holds
// plausible-good replies for the single-turn cases, so `--provider=fixture` runs
// green. For multi/adversarial cases without a fixture, returns a transparent
// placeholder (those batteries are intended to be exercised against --provider=groq).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import type { Provider } from "./groq";

const HERE = dirname(fileURLToPath(import.meta.url));
const FIXTURES_PATH = resolve(HERE, "fixtures.json");

let cache: Record<string, string> | null = null;

function load(): Record<string, string> {
  if (cache) return cache;
  cache = JSON.parse(readFileSync(FIXTURES_PATH, "utf8")) as Record<string, string>;
  return cache;
}

export function hasFixture(caseId: string): boolean {
  return caseId in load();
}

export const fixtureProvider: Provider = {
  id: "fixture",
  async complete(caseId: string) {
    const fixtures = load();
    if (caseId in fixtures) return fixtures[caseId];
    // No fixture recorded: a clean, marker-free placeholder. It won't satisfy
    // case expectations, but it never crashes the run — the report flags it.
    return "(no fixture recorded for this case — run with --provider=groq)";
  },
};
