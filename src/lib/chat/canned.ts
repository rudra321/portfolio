// Starter questions shown as tappable chips. Their answers are PRECOMPUTED, so a
// tap renders instantly and costs nothing (no LLM call). Answers use the live
// [[ui:…]] marker grammar + a [[next:…]] suggestion line, so the chips also demo
// the full generative-UI + follow-up flow. Reused by the mock provider.

import { PERSONAL } from "@/data/personal";
import { METRICS } from "@/data/stats";

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
    a: `I built the healthcare platform end to end: a React Native app, an Express/TypeScript API on Lambda, and a Supabase database, now past ${METRICS.patients} patients. Payments, Shopify orders, a warehouse, and a last-mile carrier all run through one idempotent order pipeline with Redis-backed queues, so retries can't corrupt state.
[[ui:experience]]
[[next: How did you handle payments at scale? | Tell me about the call-center system | Are you open to work?]]`,
  },
  {
    q: "What are you best at?",
    a: `Taking a system end to end and keeping it standing. Raaz runs payments, orders, and warehouse handoff for ${METRICS.patients}+ patients through one pipeline with idempotent webhooks and a forward-only payment state machine, so a retry can't double-charge. Day to day that's TypeScript and Python: React Native on the front, Node on Lambda on the back, with WebAssembly when a problem needs it.
[[ui:skills]]
[[next: Do you know Rust? | What's your proudest build? | Why healthcare?]]`,
  },
  {
    q: "Are you open to work?",
    a: `Yes. ${PERSONAL.lookingFor} The best way to start is email.
[[ui:contact]]`,
  },
];
