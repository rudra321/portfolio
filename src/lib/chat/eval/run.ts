// ── Eval orchestrator (CLI entry) ────────────────────────────────────────────
// Usage:
//   npm run eval                       # fixture provider + rule judge (no key)
//   npm run eval -- --provider=groq    # hit Groq directly (needs GROQ_API_KEY)
//   npm run eval -- --judge=llm        # LLM-as-judge (needs GROQ_API_KEY)
//   npm run eval:ci                    # fixture + rule + --ci (exit≠0 if <90%)
//
// Flow per case: build messages → provider.complete → normalizeReply (PROD) →
// deterministic checks (HARD gate) → judge dimensions → composite + pass.
// The deterministic checks gate the rubric: if any check fails, grounding and
// boundary are floored so the case cannot pass, and the failure is reported.

import { runChecks } from "./checks";
import { ruleJudge } from "./judges/rule";
import { llmJudge } from "./judges/llm";
import { fixtureProvider, hasFixture } from "./providers/fixture";
import { groqProvider, type Provider } from "./providers/groq";
import { localEvalProvider } from "./providers/local";
import { buildSummary, printReport, writeResults } from "./report";
import { SINGLE_CASES } from "./cases/single";
import { MULTI_CASES } from "./cases/multi";
import { ADVERSARIAL_CASES } from "./cases/adversarial";
import {
  isConversationCase,
  type AnyCase,
  type ChatMessage,
  type EvalResult,
  type Expectation,
  type JudgeVerdict,
} from "./types";

interface Args {
  provider: "groq" | "fixture" | "local";
  judge: "rule" | "llm";
  ci: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { provider: "fixture", judge: "rule", ci: false };
  for (const a of argv) {
    if (a.startsWith("--provider=")) {
      const v = a.split("=")[1];
      if (v === "groq" || v === "fixture" || v === "local") args.provider = v;
      else throw new Error(`Unknown provider "${v}" (use groq|fixture|local)`);
    } else if (a.startsWith("--judge=")) {
      const v = a.split("=")[1];
      if (v === "rule" || v === "llm") args.judge = v;
      else throw new Error(`Unknown judge "${v}" (use rule|llm)`);
    } else if (a === "--ci") {
      args.ci = true;
    }
  }
  return args;
}

function pickProvider(name: Args["provider"]): Provider {
  if (name === "groq") return groqProvider;
  if (name === "local") return localEvalProvider;
  return fixtureProvider;
}

/** Build the windowed conversation turns for a case (multi = all turns). */
function turnsFor(c: AnyCase): { prompts: string[]; expect: Expectation; retainTopic?: string } {
  if (isConversationCase(c)) {
    return { prompts: c.turns, expect: c.expectLast, retainTopic: c.retainTopic };
  }
  return { prompts: [c.prompt], expect: c.expect };
}

function kindOf(c: AnyCase): EvalResult["kind"] {
  if (isConversationCase(c)) return "multi";
  if (ADVERSARIAL_IDS.has(c.id)) return "adversarial";
  return "single";
}

const ADVERSARIAL_IDS = new Set(ADVERSARIAL_CASES.map((c) => c.id));

/**
 * Drive a conversation: for multi-turn cases we replay each user turn through the
 * provider, threading the model's reply back as a "model" message. With the
 * fixture provider only the last turn's fixture (if any) is meaningful; with groq
 * the full conversation gives real continuity. Returns the FINAL raw reply.
 */
async function runConversation(
  provider: Provider,
  caseId: string,
  prompts: string[]
): Promise<string> {
  const history: ChatMessage[] = [];
  let last = "";
  for (let i = 0; i < prompts.length; i++) {
    history.push({ role: "user", content: prompts[i] });
    // For multi-turn fixture runs, only the final turn is keyed by caseId.
    const turnId = i === prompts.length - 1 ? caseId : `${caseId}__turn${i}`;
    last = await provider.complete(turnId, history);
    history.push({ role: "model", content: last });
  }
  return last;
}

/** Floor the hard-gated dimensions so a checks-failure can't pass the rubric. */
function applyCheckGate(verdict: JudgeVerdict): JudgeVerdict {
  const dims = verdict.dimensions.map((d) =>
    d.dimension === "grounding" || d.dimension === "boundary"
      ? { ...d, score: 0, pass: false, reason: `${d.reason} (failed deterministic checks)` }
      : d
  );
  return { ...verdict, dimensions: dims, pass: false };
}

async function judgeOne(
  args: Args,
  parsed: ReturnType<typeof runChecks>["parsed"],
  expect: Expectation,
  findings: ReturnType<typeof runChecks>["findings"],
  lastPrompt: string
): Promise<JudgeVerdict> {
  if (args.judge === "llm") {
    return llmJudge(parsed, expect, lastPrompt);
  }
  return ruleJudge(parsed, expect, findings);
}

async function evaluate(c: AnyCase, provider: Provider, args: Args): Promise<EvalResult> {
  const { prompts, expect } = turnsFor(c);
  const lastPrompt = prompts[prompts.length - 1];
  const kind = kindOf(c);

  let raw = "";
  let error: string | null = null;
  try {
    raw = await runConversation(provider, c.id, prompts);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  const { parsed, findings, pass: checksPass } = runChecks(raw);

  let verdict = await judgeOne(args, parsed, expect, findings, lastPrompt);
  if (!checksPass) verdict = applyCheckGate(verdict);

  const failures: string[] = [];
  if (error) failures.push(`provider error: ${error}`);
  for (const f of findings) if (!f.ok) failures.push(`check[${f.check}]: ${f.detail}`);
  for (const d of verdict.dimensions) {
    if (!d.pass) failures.push(`${d.dimension} ${d.score.toFixed(2)}: ${d.reason}`);
  }
  if (verdict.composite < 0.8 && checksPass) {
    failures.push(`composite ${verdict.composite.toFixed(2)} < 0.80`);
  }

  const pass = checksPass && verdict.pass && !error;

  return {
    id: c.id,
    description: c.description,
    kind,
    prompt: lastPrompt,
    raw,
    checks: findings,
    checksPass,
    verdict,
    pass,
    failures,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const provider = pickProvider(args.provider);

  const allCases: AnyCase[] = [...SINGLE_CASES, ...MULTI_CASES, ...ADVERSARIAL_CASES];

  // With the fixture provider, only the single-turn cases have recorded outputs;
  // the multi/adversarial batteries are meant for --provider=groq. We SKIP cases
  // with no fixture rather than fail them, so a fixture run scores only what it
  // can actually exercise (and `eval:ci` stays green offline). Run --provider=groq
  // for full coverage.
  let cases = allCases;
  if (args.provider === "fixture") {
    const skipped = allCases.filter((c) => !hasFixture(c.id));
    cases = allCases.filter((c) => hasFixture(c.id));
    if (skipped.length) {
      console.log(
        `\x1b[2m(fixture mode: skipping ${skipped.length} multi/adversarial cases with no recorded reply — run --provider=groq for those: ${skipped
          .map((c) => c.id)
          .join(", ")})\x1b[0m`
      );
    }
  }

  const results: EvalResult[] = [];
  for (const c of cases) {
    // Sequential: provider calls may hit a rate-limited API; order keeps the
    // console readable and the JSON deterministic.
    results.push(await evaluate(c, provider, args));
  }

  const summary = buildSummary(results, args.provider, args.judge);
  printReport(summary);
  const file = writeResults(summary);
  console.log(`\x1b[2mWrote ${file}\x1b[0m`);

  if (args.ci && summary.passRate < 0.9) {
    console.error(
      `\x1b[31mCI gate: pass rate ${(summary.passRate * 100).toFixed(1)}% < 90%\x1b[0m`
    );
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(`\x1b[31mEval crashed:\x1b[0m`, e);
  process.exit(1);
});
