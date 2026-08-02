// ── Reporting ────────────────────────────────────────────────────────────────
// A readable console table + a machine-readable JSON writer. No deps.

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { DIMENSIONS } from "./rubric";
import type { EvalResult } from "./types";

// <repo>/src/lib/chat/eval/report.ts → eval→chat→lib→src→repo is 4 dirs up.
const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(HERE, "..", "..", "..", "..");
const RESULTS_DIR = resolve(REPO_ROOT, "eval", "results");
const RESULTS_FILE = resolve(RESULTS_DIR, "latest.json");

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

export interface SuiteSummary {
  provider: string;
  judge: string;
  total: number;
  passed: number;
  passRate: number;
  byKind: Record<string, { total: number; passed: number }>;
  results: EvalResult[];
  timestamp: string;
}

function pad(s: string, n: number): string {
  if (s.length > n) return s.slice(0, n - 1) + "…";
  return s + " ".repeat(n - s.length);
}

export function buildSummary(
  results: EvalResult[],
  provider: string,
  judge: string
): SuiteSummary {
  const passed = results.filter((r) => r.pass).length;
  const byKind: Record<string, { total: number; passed: number }> = {};
  for (const r of results) {
    byKind[r.kind] ??= { total: 0, passed: 0 };
    byKind[r.kind].total += 1;
    if (r.pass) byKind[r.kind].passed += 1;
  }
  return {
    provider,
    judge,
    total: results.length,
    passed,
    passRate: results.length ? passed / results.length : 0,
    byKind,
    results,
    timestamp: new Date().toISOString(),
  };
}

export function printReport(summary: SuiteSummary): void {
  const { results } = summary;

  console.log(
    `\n${BOLD}Portfolio chat eval${RESET}  ${DIM}provider=${summary.provider} judge=${summary.judge}${RESET}\n`
  );

  // Header
  const dimCols = DIMENSIONS.map((d) => pad(d.name.slice(0, 4), 5)).join(" ");
  console.log(
    `${DIM}${pad("case", 20)} ${pad("kind", 6)} ${pad("res", 5)} ${dimCols} ${pad("comp", 6)}${RESET}`
  );
  console.log(DIM + "-".repeat(20 + 1 + 6 + 1 + 5 + 1 + dimCols.length + 1 + 6) + RESET);

  for (const r of results) {
    const resMark = r.pass ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
    const dimCells = DIMENSIONS.map((d) => {
      const sc = r.verdict.dimensions.find((x) => x.dimension === d.name);
      if (!sc) return pad("-", 5);
      const v = sc.score.toFixed(2); // "1.00" / "0.87"
      const color = sc.pass ? GREEN : RED;
      return color + pad(v, 5) + RESET;
    }).join(" ");
    const comp = r.verdict.composite.toFixed(2);
    console.log(
      `${pad(r.id, 20)} ${pad(r.kind, 6)} ${resMark}  ${dimCells} ${pad(comp, 6)}`
    );
    if (!r.pass) {
      // Show the first couple of failure reasons indented.
      for (const f of r.failures.slice(0, 3)) {
        console.log(`  ${YELLOW}↳ ${f}${RESET}`);
      }
    }
  }

  // Footer
  console.log("");
  for (const [kind, agg] of Object.entries(summary.byKind)) {
    console.log(`${DIM}${pad(kind, 12)}${RESET} ${agg.passed}/${agg.total}`);
  }
  const rate = (summary.passRate * 100).toFixed(1);
  const rateColor = summary.passRate >= 0.9 ? GREEN : summary.passRate >= 0.7 ? YELLOW : RED;
  console.log(
    `\n${BOLD}Pass rate: ${rateColor}${summary.passed}/${summary.total} (${rate}%)${RESET}\n`
  );
}

export function writeResults(summary: SuiteSummary): string {
  mkdirSync(RESULTS_DIR, { recursive: true });
  writeFileSync(RESULTS_FILE, JSON.stringify(summary, null, 2) + "\n", "utf8");
  return RESULTS_FILE;
}
