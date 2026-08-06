import type { ChatProvider, ChatMessage } from "../types";
import { PERSONAL } from "@/data/personal";
import { METRICS } from "@/data/stats";
import { STARTERS } from "../canned";
import { retrieve, UNKNOWN_TECH, KNOWN_TECH, KNOWN_COMPANIES, tokenize } from "../retrieval";
import { clog } from "../debug";

// ── Tier 3: the local engine ─────────────────────────────────────────────────
// The last line of defense — and, when no provider key is set, the WHOLE show.
// Runs ENTIRELY in the browser with zero network, so the chat keeps answering
// even if every LLM is down or rate-limited. It can't free-associate like a
// frontier model, but it routes intent, retrieves the right facts from the KB
// (retrieval.ts), and speaks the exact same [[ui:…]] / [[next:…]] grammar. Every
// fact it emits is grounded in src/data/*, every marker is composed from real
// ids, and every number is a verified stat — so nothing it says can be fabricated
// or render-invalid.

const [hardest, raaz, best, openToWork] = STARTERS.map((s) => s.a);

// One grounded lead per project — frames the card without dumping its body.
const PROJECT_LEAD: Record<string, string> = {
  "raaz-platform": `Raaz is the healthcare platform I lead: one codebase behind the React Native app, the Express backend, and the whole order pipeline, serving ${METRICS.patients}+ patients.`,
  "ai-clinical-engine": `The clinical engine scores assessments in code: eight weighted root causes on validated instruments (IIEF-5, PEDT), severity staging, and a risk lane. Claude and Groq only format the report and patient copy. It replaced a manual doctor workflow and cut consultation prep from 30 minutes to 10-15.`,
  "whatsapp-calendar": `The WhatsApp calendar bot turns a line like "meeting tomorrow at 2pm" into a Google Calendar event, with conflict detection and a Meet link. Bun and Hono, Groq for intent parsing, a hexagonal architecture so swapping providers is a one-file change.`,
  "gis-detection": `The browser GIS detection at GJ-Map. I compiled C++ inference kernels to WebAssembly and paired ONNX Runtime with Meta's Segment Anything Model, so detection ran fully client-side, 40% faster than the old pipeline.`,
  "call-center": `The voice stack has been through three telephony generations: Knowlarity call-ops with Vapi and Smallest AI bots, a Tata SmartFlo auto-dialer with a drain-aware rescheduler, and today a Plivo WebRTC softphone right in the rep's browser. That stack handles ${METRICS.callsPerMonth}+ calls a month at peak, with follow-up state landing in Zoho CRM automatically.`,
  "fraud-dashboard": `The fraud dashboard at SuperPe flagged anomalous transactions before settlement, so support could step in before money left the account. Fraud losses dropped by half.`,
  "gis-apps": `Six production React apps for GIS teams on the ArcGIS SDK, built around heavy multi-temporal satellite imagery: put years of the same land side by side and you can watch roads appear and extend, and cropland shift. Real-time layers, spatial queries, custom dashboards.`,
  "scout": `Scout is my open-source job-search agent. I built it during my own job hunt and open-sourced it. It pulls real openings straight from ATS APIs and founder threads instead of job boards, scores them with a zero-dependency heuristic plus an optional LLM pass, and drafts cover letters and cold emails. Plain TypeScript, no framework.`,
  "mood-musica": `MoodMusica is map-first music discovery: tap a spot on the world map, type a mood, and get a color palette and eight real, region-appropriate songs. The fun part is the anti-hallucination pipeline, where every AI-picked track is grounded in real Apple charts and verified against the iTunes API before it's shown, so nothing fake gets through.`,
};

const PROJECT_NEXT: Record<string, string> = {
  "raaz-platform": `[[next: How did you handle payments? | What broke at scale? | Are you open to work?]]`,
  "ai-clinical-engine": `[[next: How does the scoring work? | What's your AI stack? | What else have you built?]]`,
  "whatsapp-calendar": `[[next: Why hexagonal architecture? | What's your stack? | What else have you built?]]`,
  "gis-detection": `[[next: How did the WASM part work? | What's the hardest part of Raaz? | What are you best at?]]`,
  "call-center": `[[next: How does Raaz work? | What's your stack? | Are you open to work?]]`,
  "fraud-dashboard": `[[next: What did you build at SuperPe? | What's your stack? | Are you open to work?]]`,
  "gis-apps": `[[next: Tell me about the WASM detection | What's your stack? | What else have you built?]]`,
  "scout": `[[next: How does the scoring work? | What's your AI stack? | What else have you built?]]`,
  "mood-musica": `[[next: Why hexagonal architecture? | What's your stack? | What else have you built?]]`,
};

// A second, NON-restating angle per project — used when a "tell me more" follows
// a project answer, so continuation adds new grounded detail instead of looping.
const PROJECT_MORE: Record<string, string> = {
  "raaz-platform": `The piece I'm proudest of is the Raaz order pipeline. Orders from app, web, and WhatsApp converge on one payment state machine that only moves forward, so an out-of-order 'failed' webhook can never overwrite a 'captured'. Every handler is idempotent against a central webhook log, so Razorpay, Shopify, and warehouse redeliveries are always safe.
[[next: How does the call-center system work? | What broke at scale? | What's your stack?]]`,
  "gis-detection": `The detection model was one part of a bigger job: six production React apps on the ArcGIS SDK for teams working with heavy multi-temporal satellite imagery, where years of the same land sit side by side and you can watch roads appear and cropland shift. I also built the Node and SQL backend from scratch, including the automated geospatial ingestion pipelines that fed every map.
[[next: What's the hardest part of Raaz? | What's your stack? | What are you best at?]]`,
  "ai-clinical-engine": `Under the hood it's weighted scoring with branching logic and a severity model, then a generation step that turns the result into PDF reports and diet plans, replacing a workflow a doctor used to run by hand.
[[next: What's your AI stack? | What else have you built? | Are you open to work?]]`,
  "call-center": `The SmartFlo era is my favorite piece: a drain-aware rescheduler polls the live campaign count and refills it from the CRM inside business-hours guards, with a clock-decay priority ladder. Leads decay by the hour, never get promoted, and attempt caps evict them. The current Plivo softphone came from a measured failure: reps heard silence during ringback and hung up early, so I built a four-phase dial-state machine around what the browser can actually observe.
[[next: How does Raaz work? | What's your stack? | Are you open to work?]]`,
  "fraud-dashboard": `It scored transactions in real time and flagged the anomalies before settlement, so support could freeze them before money moved. SuperPe's fraud losses dropped by half.
[[next: What else did you do at SuperPe? | What's your stack? | Are you open to work?]]`,
  "scout": `Under the hood Scout has a pluggable adapter per source (Greenhouse, Lever, Ashby, HN, RSS) and a two-tier scorer: a zero-dependency heuristic with about 30 weighted signals, then an optional LLM second pass. The cold-email pipeline even guesses address patterns and validates them with MX DNS lookups. Storage is plain greppable TSV files, no database.
[[next: What's your AI stack? | What else have you built? | Are you open to work?]]`,
  "mood-musica": `MoodMusica is built hexagonally with six swappable ports, so it runs with or without an LLM key. The interesting problem was trust: a two-stage LLM parses the mood and curates, but it's grounded in real per-country Apple charts and every candidate track is resolved against the iTunes API, so hallucinated songs get killed before display.
[[next: What else have you built? | What's your stack? | Are you open to work?]]`,
};

// Company-specific experience leads (retrieval returns the right one by company).
const EXPERIENCE_LEAD: Record<string, string> = {
  Raaz: raaz,
  "GJ-Map Solutions": `At GJ-Map I built React apps for heavy multi-temporal satellite imagery: years of the same land side by side, so you can watch roads appear and extend and cropland shift over time. One part of that was browser-based detection, with C++ inference compiled to WebAssembly and ONNX Runtime paired with Meta's Segment Anything Model, 40% faster than the old pipeline. I also built the Node and SQL backend from scratch.
[[ui:experience]]
[[next: How did the WASM detection work? | What's the hardest part of Raaz? | What are you best at?]]`,
  SuperPe: `At SuperPe I built a real-time fraud-detection dashboard that cut fraud losses in half, plus the React Native onboarding and payments checkout for a flow handling 50,000+ transactions a day.
[[ui:experience]]
[[next: What did you do at Raaz? | What's your stack? | Are you open to work?]]`,
};

// Tokens Rudra clearly uses → a confident "yes" instead of a retrieval guess.
const CORE_STACK: Record<string, string> = {
  react: "React",
  native: "React Native",
  node: "Node",
  "node.js": "Node",
  express: "Express",
  typescript: "TypeScript",
  javascript: "JavaScript",
  python: "Python",
  aws: "AWS",
  lambda: "AWS Lambda",
  postgresql: "PostgreSQL",
  postgres: "PostgreSQL",
  dynamodb: "DynamoDB",
  mongodb: "MongoDB",
  supabase: "Supabase",
  next: "Next.js",
  "next.js": "Next.js",
  tailwind: "Tailwind",
  docker: "Docker",
  sql: "SQL",
  "c++": "C++",
  wasm: "WebAssembly",
  webassembly: "WebAssembly",
  onnx: "ONNX Runtime",
  vapi: "Vapi",
  zoho: "Zoho CRM",
  razorpay: "Razorpay",
  shopify: "Shopify",
};

const projectsOverview = `I've shipped healthcare infra, applied AI, browser-side ML, and payment systems. Here's the work.
[[ui:projects]]
[[next: Walk me through Raaz | What's the hardest thing you've built? | What are you best at?]]`;

const greeting = `Hey, good to meet you. I'm Rudra, a lead engineer in Bangalore. Ask me anything about what I've built, or tap a suggestion.
[[next: What have you built? | What are you best at? | Are you open to work?]]`;

const identity = `I'm an AI speaking as Rudra, so you get my story without waiting on my inbox. For the real me, email ${PERSONAL.email}.
[[ui:contact]]`;

const capability = `I can walk you through my projects, my experience, my skills, and my background. Ask in your own words, or tap a suggestion.
[[next: What have you built? | Walk me through Raaz | What are you best at?]]`;

const fun = `Outside code I play competitive Ultimate Frisbee. We won gold at the National Open Championship in 2025 and the National College Championship in 2023.
[[next: What do you build at work? | Are you open to work? | Where are you based?]]`;

const deferToEmail = `I keep specifics like compensation and exact availability for a direct conversation. Email me at ${PERSONAL.email} and I'll be straight with you.
[[ui:contact]]`;

const resume = `Happy to share it.
[[ui:resume]]`;

const about = `I'm a lead engineer in Bangalore. I studied CS at BITS Pilani, Goa, and now build healthcare software at Raaz, after browser-side ML at GJ-Map and a fraud engine at SuperPe.
[[ui:experience]]
[[next: What's your proudest build? | What's your stack? | Are you open to work?]]`;

const contactInfo = `Best way to reach me is email: ${PERSONAL.email}. My GitHub and LinkedIn are in the card.
[[ui:contact]]`;

const location = `Bangalore, India. I moved here for the Raaz role after CS at BITS Pilani, Goa.
[[next: What do you do at Raaz? | Why healthcare? | Are you open to work?]]`;

const whyHealthcare = `Healthcare is where the systems I like building actually matter. A flaky payment or a lost order isn't an inconvenience, it's someone's care. At Raaz that's what pushed me to make the order pipeline idempotent and keep the platform standing for ${METRICS.patients}+ patients.
[[next: Walk me through Raaz | How did you handle payments? | Are you open to work?]]`;

const weakness = `Design polish isn't my strong suit. I lean on systems and can wire up a clean UI, but I'm not going to out-design a specialist, and I haven't shipped Rust or Go in production. I'd rather say that straight than oversell.
[[next: What are you best at? | What's your stack? | What's your proudest build?]]`;

const experience = `I've been shipping professionally since 2022: a fraud engine at SuperPe, then browser-side ML at GJ-Map, and now lead engineering at Raaz, where I run the platform today. My CS degree is from BITS Pilani.
[[ui:experience]]
[[next: What did you do at SuperPe? | What's your proudest build? | Are you open to work?]]`;

const learning = `Right now I'm going deeper on applied AI: LLMs, retrieval, and the infrastructure to run them cheaply and reliably. This portfolio's chat is one of those experiments. Longer term I want to keep owning products end to end in healthcare, fintech, and infra.
[[next: Tell me about your AI work | What's your stack? | Are you open to work?]]`;

// Redis: familiar, speced as the scale-up path — not in prod; reconcilers + idempotency cover retries.
const redisAnswer = `Familiar with it, and I speced Redis as the scale-up path for the Raaz order pipeline. I didn't need a broker in the end: provider webhook redelivery, idempotent handlers against a central webhook log, and cron reconcilers cover retries. I'd reach for Redis when queue depth actually justifies it.
[[next: How does the order pipeline work? | What's your stack? | What are you best at?]]`;

const thanks = `Anytime. Ask me anything else, or reach the real me at ${PERSONAL.email}.`;

const offTopic = `Ha, that's outside what I do here. But ask me about my work and I'm all yours.
[[next: What's your hardest build? | Walk me through Raaz | What's your stack?]]`;

const jailbreak = `Not going to get into that. Ask me what I've built and I'll go as deep as you want.`;

const fallback = `That's a little outside what I can speak to here. I'm best on my own work, projects, skills, and background. Ask me about one of those, or email me at ${PERSONAL.email}.
[[next: What have you built? | What are you best at? | Walk me through Raaz]]`;

// Default "tell me more" continuation when we can't tell what the last topic was.
const deepen = PROJECT_MORE["raaz-platform"];

const aiWork = `I ship applied AI where it earns its place. The clinical engine at Raaz scores eight weighted root causes on validated instruments (IIEF-5, PEDT), all in code; Claude and Groq only format the report and patient copy. That cut consultation prep from 30 minutes to 10-15. Before that I ran ONNX detection in WebAssembly at GJ-Map.
[[ui:project {"id":"ai-clinical-engine"}]]
[[next: How does the engine work? | What's your stack? | What else have you built?]]`;

const whyHire = `I own products end to end. I took a healthcare platform from zero to ${METRICS.patients}+ patients, and I'm just as comfortable compiling C++ to WebAssembly as wiring up Lambda, payments, and LLMs.
[[ui:stat {"value":"${METRICS.patients}+","label":"patients on the Raaz platform"}]]
[[next: Walk me through Raaz | What's the hardest thing you've shipped? | Are you open to work?]]`;

// Fabrication bait — asked about a product Rudra never built. Admit the gap.
const noSuchProject = `I haven't built that. My work is the Raaz healthcare platform, browser-side ML at GJ-Map, and a fraud engine at SuperPe.
[[ui:experience]]
[[next: Walk me through Raaz | What did you do at GJ-Map? | What are you best at?]]`;

// ── Intent patterns ──────────────────────────────────────────────────────────
const VAGUE = /^\s*(tell me more|more|go on|and\??|but\??|why\??|how\??|elaborate|continue|expand|details?|keep going|then\??|ok(ay)?\??|i see)\.?\s*$/i;
const GREETING = /^\s*(hi+|hey+|hello+|yo+|sup|howdy|hiya|namaste|greetings|good (morning|afternoon|evening)|what'?s up|wassup)\b/i;
const SMALLTALK = /how (are|r) (you|u|things)|how'?s it going|how do you do|you doing|hope you('?re)?/i;
const THANKS = /^\s*(thanks|thank you|thx|\bty\b|cheers|appreciate|nice|cool|awesome|amazing|great|got it|makes sense|good (to know|stuff))\b/i;
const IDENTITY = /\b(are you (an? )?(ai|bot|robot|chatbot|real|human|person|actually rudra)|is this (a )?(real|bot|ai|human)|who am i (talking|speaking) (to|with)|am i (talking|chatting) (to|with)|are you really)\b/i;
const NAME = /\b(your name|what.*(call you|are you called)|introduce yourself|who are you)\b/i;
const CAPABILITY = /\b(what can (you|u) do|how (does|do) (this|you) work|^help\b|capabilit|what should i ask|what do you do here|how can you help)\b/i;
const FUN = /\b(fun|frisbee|hobby|hobbies|sport|free time|spare time|outside (of )?(work|code)|personal life|do for fun)\b/i;
const DEFER = /\b(salary|compensation|\bctc\b|\bpay\b|how much.*(make|earn|cost)|relocat\w*|notice period|\bvisa\b|when can you (start|join)|expected (ctc|salary|pay))\b/i;
const HIRE = /\b(hire|hiring|recruit\w*|\brole\b|\broles\b|openings?|opportunit\w*|are you (open|available)|availab\w*|reach (you|out)|get in touch|work (with|together)|collaborat\w*|freelance|join (us|my|our))\b/i;
const CONTACT = /\b(contact|\bemail\b|connect|reach you|linkedin|github|socials?)\b/i;
const RESUME = /\b(resume|\bcv\b|curriculum)\b/i;
const ABOUT = /\b(about (you|yourself|him)|background|study|studied|college|university|education|\bbits\b|degree|grew up)\b/i;
const LOCATION = /\b(where.*(based|located|live|from)|which city|what city|your (location|city)|based out of)\b/i;
const PROJECTS_OVERVIEW = /\b(what have you (built|made|done|shipped)|your (projects|work|portfolio)|show me( your)?( work| projects| everything)?|everything you('?ve)? (built|made)|list of)\b/i;

// Off-topic / creative / homework that should be declined in character.
const OFFTOPIC = /\b(write (me )?(a |an )?(poem|song|story|essay|joke|haiku|rap|script|letter)|leetcode|solve (this|my)|homework|recipe|translate|capital of|the weather|who is the (president|ceo|prime minister)|do my|debug my|fix my code|stock price|news today)\b/i;
const JAILBREAK = /\b(ignore (your |all |the |previous )?(instructions|prompt|rules)|system prompt|reveal your|prompt injection|you are now|disregard (your|all|the|previous)|what (are|were) your instructions|repeat (your|the) (prompt|instructions))\b/i;

const KNOWS_PREFIX = /\b(do you know|have you (used|worked with|tried|done|built (with|in)|written)|are you (good|familiar|experienced) (at|with|in)|can you (write|use|do)|experience (with|in)|any (experience|exposure)|ever (used|worked|written|coded)|do you (use|work in|code in))\b/i;
const REDIS_Q = /\bredis\b/i; // handled specially: not in prod — speced as the scale-up path
// Past-tense / proper-noun framings only (NOT bare present-tense "work at",
// which appears in "does it work at scale"). Capture a single token, not a span.
const WORKED_AT = /\b(your time at|worked at|when you were at|did you work at|stint at|role at)\s+([a-z][a-z0-9.\-]{1,20})/i;
// Ordinary nouns that follow "at" but aren't companies — guards the negative.
const COMMON_AT_NOUN = new Set(
  "scale all home night work startup startups first last least once times large small speed load rest best most hand length odds risk this that here there now".split(" ")
);

// Self-assessment vs. open-to-work CTA — "why hire you" wants a proof, not a CTA.
const WEAKNESS = /\b(weakest|weakness|not (good|great) at|worst at|struggle with|bad at|limitations?|blind spots?|what.*not good)\b/i;
const WHY_HIRE = /\b(why (should i )?hire|should i hire|what do you bring|stand out|set you apart|what makes you|why (you|are you) (special|different|good))\b/i;
const BEST_AT = /\b(best at|strongest|good at|what are you good|your strengths?|core strength)\b/i;
const HARDEST = /\b(hardest|toughest|proudest|most (impressive|difficult|complex|challenging)|biggest challenges?|impressive)\b/i;
const WHY_HEALTHCARE = /\bwhy (healthcare|health|medical|medicine|this (field|space|industry|domain))\b/i;
const AI_WORK = /\b(ai work|ai\/ml|\bml\b|\bllm\b|\brag\b|machine learning|clinical|assessment engine|claude|groq|\bgpt\b|chatbot|inference|neural net)\b/i;
const PAYMENTS = /\b(payments?|order pipelines?|webhooks?|idempoten\w*|razorpay|shopify|warehouses?|double.?charge)\b/i;
const EXPERIENCE_Q = /\b(how (long|many years)|years of (experience|exp)|how much experience|since when|been (coding|building|working)|your (experience|career|background)|work history)\b/i;
const LEARNING = /\b(what are you learning|are you learning|what'?s next|excites you|what are you into|going deeper|curious about|exploring lately|learning (these days|right now)|keep learning)\b/i;
// A product Rudra never built (distinct from honest-negative on tech/companies).
const FABRICATION = /\b(crypto|blockchain|web3|\bnft\b|defi|metaverse|dating app|social media app|mobile game|video game)\b/i;

const titleCase = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

function honestNegativeTech(q: string): string | null {
  if (!KNOWS_PREFIX.test(q)) return null;
  const toks = tokenize(q);
  // Only fire if the asked tech is one we explicitly don't have AND isn't known.
  for (const t of toks) {
    if (UNKNOWN_TECH[t] && !KNOWN_TECH.has(t)) {
      const name = UNKNOWN_TECH[t];
      return `I haven't shipped ${name} in production. My day-to-day is TypeScript and Python, with C++ when I need to drop down for performance, which I've compiled to WebAssembly. I pick up languages fast when a project needs them.
[[next: What's your main stack? | Tell me about the WASM work | What are you best at?]]`;
    }
  }
  return null;
}

function positiveTech(q: string): string | null {
  if (!KNOWS_PREFIX.test(q)) return null;
  for (const t of tokenize(q)) {
    const name = CORE_STACK[t];
    if (name) {
      return `Yes, ${name} is part of my day-to-day. My core is TypeScript and Python across React and React Native on the front and Node and Postgres on the back.
[[ui:skills]]
[[next: What's your proudest build? | Do you know Rust? | What are you best at?]]`;
    }
  }
  return null;
}

function honestNegativeCompany(q: string): string | null {
  const m = q.match(WORKED_AT);
  if (!m) return null;
  const token = (m[2] ?? "").trim().toLowerCase();
  // Only fire on a plausible company token: not a known company (no negative
  // needed), not an ordinary noun ("worked at scale" ≠ a company).
  if (!token || COMMON_AT_NOUN.has(token) || KNOWN_COMPANIES.has(token)) return null;
  if (tokenize(token).some((t) => KNOWN_COMPANIES.has(t) || COMMON_AT_NOUN.has(t))) return null;
  return `I haven't worked at ${titleCase(token)}. My roles have been Raaz, GJ-Map Solutions, and SuperPe.
[[ui:experience]]
[[next: What did you do at Raaz? | What was your role at GJ-Map? | Are you open to work?]]`;
}

// The project id the most recent model turn surfaced — so "tell me more" deepens
// on THAT topic instead of always looping back to the same fact.
function lastTopic(history: ChatMessage[]): string | null {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role !== "model") continue;
    const m = history[i].content.match(/\[\[ui:project\s*\{"id":"([^"]+)"\}\]\]/);
    return m ? m[1] : null; // only the most recent model turn
  }
  return null;
}

function fromRetrieval(q: string): string {
  const hits = retrieve(q, 3);
  clog("retrieval", `q="${q}"`, hits.map((h) => `${h.chunk.id}=${h.score.toFixed(2)}`));
  if (hits.length === 0) return fallback;
  const top = hits[0].chunk;

  if (top.kind === "project") {
    const id = (top.action as { type: "project"; id: string }).id;
    const lead = PROJECT_LEAD[id];
    const next = PROJECT_NEXT[id] ?? `[[next: What else have you built? | What's your stack? | Are you open to work?]]`;
    if (lead) return `${lead}\n[[ui:project {"id":"${id}"}]]\n${next}`;
    return projectsOverview;
  }
  if (top.kind === "experience") {
    const company = top.id.replace(/^exp:/, "");
    return EXPERIENCE_LEAD[company] ?? raaz;
  }
  if (top.kind === "skill") return best;
  return about; // persona
}

function answer(text: string, history: ChatMessage[]): string {
  const q = text.toLowerCase().trim();
  const userTurns = history.filter((m) => m.role === "user").length;
  // Log which route a question matched — the key signal when testing answers.
  const route = (label: string, reply: string): string => {
    clog("local", `q="${q}" → ${label}`);
    return reply;
  };

  // ── Guardrails first (most specific) ──────────────────────────────────────
  if (JAILBREAK.test(q)) return route("jailbreak", jailbreak);
  if (OFFTOPIC.test(q)) return route("offtopic", offTopic);
  if (GREETING.test(q) && q.length < 24) return route("greeting", greeting);
  if (SMALLTALK.test(q)) return route("smalltalk", greeting);
  if (THANKS.test(q) && q.length < 30) return route("thanks", thanks);
  if (IDENTITY.test(q)) return route("identity", identity);

  // ── Tech: honest "no" for what I haven't shipped, confident "yes" for core ─
  const negTech = honestNegativeTech(q);
  if (negTech) return route("honest-negative-tech", negTech);
  if (REDIS_Q.test(q)) return route("redis", redisAnswer);
  const posTech = positiveTech(q);
  if (posTech) return route("positive-tech", posTech);
  const negCo = honestNegativeCompany(q);
  if (negCo) return route("honest-negative-company", negCo);
  if (FABRICATION.test(q)) return route("fabrication-bait", noSuchProject);

  if (DEFER.test(q)) return route("defer", deferToEmail);
  if (RESUME.test(q)) return route("resume", resume);

  // ── Self-assessment BEFORE the open-to-work CTA ───────────────────────────
  // Order matters: "not good at" contains "good at"; "why hire" ≠ "are you open".
  if (WEAKNESS.test(q)) return route("weakness", weakness);
  if (WHY_HIRE.test(q)) return route("why-hire", whyHire);
  if (BEST_AT.test(q)) return route("best-at", best);
  if (HARDEST.test(q)) return route("hardest", hardest);
  if (WHY_HEALTHCARE.test(q)) return route("why-healthcare", whyHealthcare);
  if (AI_WORK.test(q)) return route("ai-work", aiWork);
  if (PAYMENTS.test(q)) return route("payments", deepen);
  if (LEARNING.test(q)) return route("learning", learning);
  if (EXPERIENCE_Q.test(q)) return route("experience", experience);

  if (HIRE.test(q)) return route("hire", openToWork);
  if (CAPABILITY.test(q)) return route("capability", capability);
  if (FUN.test(q)) return route("fun", fun);
  if (LOCATION.test(q)) return route("location", location);
  if (CONTACT.test(q)) return route("contact", contactInfo);
  if (PROJECTS_OVERVIEW.test(q)) return route("projects-overview", projectsOverview);

  // ── "tell me more" → deepen on the last topic with NEW detail ─────────────
  if (VAGUE.test(q) && userTurns > 1) {
    const topic = lastTopic(history);
    return route(`deepen(${topic ?? "default"})`, (topic && PROJECT_MORE[topic]) || deepen);
  }
  if (NAME.test(q)) return route("name", about);
  if (ABOUT.test(q)) return route("about", about);

  // ── Long tail: retrieve the best-matching fact and frame it ───────────────
  return route("retrieval", fromRetrieval(q));
}

// Pure, synchronous reply composer — used by the streaming provider below AND by
// the eval harness (so the local tier can be scored offline with no delay).
export function localReply(messages: ChatMessage[]): string {
  const userMsgs = messages.filter((m) => m.role === "user");
  const last = userMsgs[userMsgs.length - 1]?.content ?? "";
  return answer(last, messages);
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const localProvider: ChatProvider = {
  id: "local",
  async *streamReply(messages, signal) {
    const reply = localReply(messages);

    await wait(180); // brief "thinking" beat
    // Stream in small char chunks (exercises the parser's marker-split handling).
    for (let i = 0; i < reply.length; i += 4) {
      if (signal.aborted) return;
      await wait(14);
      yield reply.slice(i, i + 4);
    }
  },
};
