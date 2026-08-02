// ── Single-turn battery ──────────────────────────────────────────────────────
// Probes the core behaviors: grounded answers, the right card kind, honesty on
// gaps, deferral on comp, identity, voice/slop. Expectations are deliberately
// loose where the model has freedom and strict where correctness is binary.

import type { EvalCase } from "../types";

export const SINGLE_CASES: EvalCase[] = [
  {
    id: "best-built",
    description: "Most impressive build → grounded project card, ≤5 sentences",
    prompt: "What's the most impressive thing you've built?",
    expect: {
      tag: "project", // a single spotlight is ideal; "projects" grid also acceptable in judge
      // Subjective superlative → accept ANY grounded flagship + a real metric.
      includeOneOf: [
        "Raaz", "GIS", "WebAssembly", "WASM", "clinical", "fraud", "SuperPe",
        "GJ-Map", "40%", "55,000", "70%", "200,000",
      ],
      maxSentences: 5,
    },
  },
  {
    id: "walk-raaz",
    description: "Deep dive on Raaz → 3-5 sentences, grounded, spotlight card",
    prompt: "Walk me through Raaz.",
    expect: {
      tag: "project",
      projectId: "raaz-platform",
      mustInclude: ["Raaz"],
      includeOneOf: ["React Native", "Lambda", "Supabase", "55,000"],
      maxSentences: 5,
    },
  },
  {
    id: "rust",
    description: "Do you know Rust → honest-negative, no fabrication, no card",
    prompt: "Do you know Rust?",
    expect: {
      behavior: "honest-negative",
      tag: null,
      // Must admit the gap, not fabricate. These phrasings only appear in a
      // FABRICATED answer (the honest "I haven't shipped Rust in production"
      // intentionally is NOT forbidden — that's the correct response).
      mustNotInclude: ["years of Rust", "Rust at Raaz", "built in Rust", "Rust services"],
    },
  },
  {
    id: "based",
    description: "Where are you based → Bangalore, ≤2 sentences, no card",
    prompt: "Where are you based?",
    expect: {
      mustInclude: ["Bangalore"],
      maxSentences: 2,
      tag: null,
    },
  },
  {
    id: "salary",
    description: "Expected CTC → defer to email, contact card",
    prompt: "What's your expected CTC?",
    expect: {
      behavior: "defer-to-email",
      tag: "contact",
      mustInclude: ["rudrap5201@gmail.com"],
    },
  },
  {
    id: "best-at",
    description: "What are you best at → skills card",
    prompt: "What are you best at?",
    expect: {
      tag: "skills",
      maxSentences: 4,
    },
  },
  {
    id: "ai-work",
    description: "AI work → grounded, mentions Claude / Groq / 70%",
    prompt: "Tell me about your AI work.",
    expect: {
      includeOneOf: ["Claude", "Groq", "70%"],
      maxSentences: 5,
    },
  },
  {
    id: "bot-identity",
    description: "Are you actually Rudra → own it, point to email",
    prompt: "Are you actually Rudra?",
    expect: {
      mustInclude: ["rudrap5201@gmail.com"],
      maxSentences: 4,
    },
  },
  {
    id: "greeting",
    description: "hey → short, friendly, no fabrication",
    prompt: "hey",
    expect: {
      maxSentences: 3,
      // No fabricated employer.
      mustNotInclude: ["Google", "Meta", "Amazon"],
    },
  },
  {
    id: "slop-probe",
    description: "Why should I hire you → persuasive but banlist-clean",
    prompt: "Why should I hire you?",
    expect: {
      maxSentences: 5,
      mustInclude: ["55,000"],
    },
  },
  {
    id: "why-healthcare",
    description: "Why healthcare → grounded motivation, no fabrication",
    prompt: "Why healthcare?",
    expect: {
      includeOneOf: ["Raaz", "55,000", "patients", "order pipeline", "care"],
      maxSentences: 4,
    },
  },
  {
    id: "know-react",
    description: "Do you use React → confident yes + skills card",
    prompt: "Do you use React?",
    expect: {
      tag: "skills",
      mustInclude: ["React"],
      maxSentences: 4,
    },
  },
  {
    id: "superpe",
    description: "What did you do at SuperPe → grounded, mentions fraud / metric",
    prompt: "What did you do at SuperPe?",
    expect: {
      includeOneOf: ["fraud", "SuperPe", "transactions", "half", "50,000"],
      maxSentences: 5,
    },
  },
  {
    id: "weakness",
    description: "What are you weakest at → honest, no fabricated employer",
    prompt: "What are you weakest at?",
    expect: {
      maxSentences: 4,
      mustNotInclude: ["Google", "Meta", "Amazon"],
    },
  },
];
