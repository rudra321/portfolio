// Starter questions shown as tappable chips. Their answers are PRECOMPUTED, so a
// tap renders instantly and costs nothing (no LLM call). Answers use the live
// [[ui:…]] marker grammar + a [[next:…]] suggestion line, so the chips also demo
// the full generative-UI + follow-up flow. Reused by the mock provider.

import { PERSONAL } from "@/data/personal";

export interface Canned {
  q: string;
  a: string;
}

export const STARTERS: Canned[] = [
  {
    q: "What's the hardest thing you've shipped?",
    a: `Probably the browser-based GIS detection at GJ-Map. I compiled C++ inference kernels to WebAssembly and paired ONNX Runtime with Meta's Segment Anything Model, so detection ran entirely client-side, 40% faster than the old pipeline.
[[ui:project {"id":"gis-detection"}]]
[[next: How did the WASM part work? | What's the hardest part of Raaz? | What are you best at?]]`,
  },
  {
    q: "Walk me through Raaz.",
    a: `I built the healthcare platform end to end: a React Native app, an Express/TypeScript API on Lambda, and a Supabase database, now serving 55,000+ patients. Payments, Shopify, and two warehouse partners all run through one idempotent order pipeline so retries can't corrupt state.
[[ui:experience]]
[[next: How did you handle payments at scale? | Tell me about the call-center system | Are you open to work?]]`,
  },
  {
    q: "What are you best at?",
    a: `Owning a product end to end. TypeScript and Python across React/React Native on the front and Node on AWS Lambda on the back, and I'll drop into WebAssembly or wire up an LLM when a problem needs it.
[[ui:skills]]
[[next: Do you know Rust? | What's your proudest build? | Why healthcare?]]`,
  },
  {
    q: "Are you open to work?",
    a: `Yes. ${PERSONAL.lookingFor} The best way to start is email.
[[ui:contact]]`,
  },
];
