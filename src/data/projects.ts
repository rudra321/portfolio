import { METRICS } from "./stats";

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  /** Built for an employer, or my own project. */
  origin: "work" | "personal";
  /** The employer the system was built at — set for `origin: "work"` only. */
  org?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "raaz-platform",
    title: "Raaz Healthcare Platform",
    description: `The healthcare platform I built and operate end to end, now past ${METRICS.patients} patients: a React Native app, an Express/TypeScript backend, and Supabase. One pipeline routes ${METRICS.ordersPerDay}+ daily orders from app, web, and WhatsApp into a forward-only payment state machine. Webhooks from Razorpay, Shopify, and the warehouse are idempotent against a central log with database unique constraints, and cron reconcilers auto-repair anything that drifts, so provider redeliveries can't corrupt state.`,
    tags: ["React Native", "TypeScript", "Express", "Supabase", "PostgreSQL", "Razorpay"],
    featured: true,
    origin: "work",
    org: "Raaz",
  },
  {
    id: "ai-clinical-engine",
    title: "Clinical Assessment Engine",
    description:
      "A points-based clinical engine on validated instruments (IIEF-5, PEDT): eight weighted root-cause scores, ED/PE severity staging, and a RED/AMBER/GREEN risk lane feed a pure-function cart engine that drafts the first-month treatment plan and diffs doctor-corrected runs against the assessment draft; prep drops from 30 minutes to 10-15. All the math is in code; Claude and Groq only format the report and patient copy, after an early version let the LLM add up the scores and it miscounted.",
    tags: ["Claude API", "Groq", "Node.js", "TypeScript", "PDF Generation"],
    featured: true,
    origin: "work",
    org: "Raaz",
  },
  {
    id: "scout",
    title: "Scout — Open-Source Job-Search Agent",
    description:
      "A job-search agent (MIT) I built during my own job hunt and open-sourced: ~6,300 lines of TypeScript, no framework, a hand-rolled CLI and HTTP server. It pulls real openings straight from ATS APIs (Greenhouse, Lever, Ashby), HN 'Who is hiring', and RSS feeds, not job boards. It scores them with a zero-dependency heuristic plus an optional LLM pass, and drafts cover letters and cold emails with MX-validated address guessing. Thesis: zero ghost jobs.",
    tags: ["TypeScript", "Anthropic SDK", "CLI", "ATS APIs"],
    githubUrl: "https://github.com/rudra321/find-me-a-job",
    featured: true,
    origin: "personal",
  },
  {
    id: "mood-musica",
    title: "MoodMusica — Map-First Music Discovery",
    description:
      "Tap anywhere on a world map, type a mood, and get an AI-curated color palette and eight real, region-appropriate songs with playable previews (Lagos + 'energetic night out' → Afrobeats). ~3,900 lines of Next.js with a hexagonal architecture (six swappable ports) and an anti-hallucination pipeline: every AI-suggested track is grounded in real Apple charts and verified against the iTunes API before it's shown. Free services only, no Spotify.",
    tags: ["Next.js", "React", "Leaflet", "LLM", "iTunes API"],
    githubUrl: "https://github.com/rudra321/mood-musica",
    liveUrl: "https://mood-musica.onrender.com/",
    featured: false,
    origin: "personal",
  },
  {
    id: "whatsapp-calendar",
    title: "WhatsApp Calendar — Chat-to-Calendar Assistant",
    description:
      "A WhatsApp bot (~2,350 lines, Bun + Hono) that turns \"meeting with Shivay tomorrow at 2pm\" into a Google Calendar event with a Meet link and conflict detection. Groq parses intent into Zod-validated payloads; a hexagonal architecture with six port interfaces makes swapping providers a one-file change; and it does self-service Google OAuth over a sign-in link the bot sends you.",
    tags: ["TypeScript", "Bun", "Hono", "Groq", "Google Calendar API", "Fly.io"],
    githubUrl: "https://github.com/rudra321/whatsapp-calendar",
    featured: false,
    origin: "personal",
  },
  {
    id: "gis-detection",
    title: "Browser-Based GIS Object Detection",
    description:
      "Compiled C++ inference kernels to WebAssembly and paired ONNX Runtime with Meta's Segment Anything Model to run object detection on GIS imagery directly in the browser. It cut end-to-end detection turnaround ~40% versus the server round-trip and eliminated server-side GPU compute entirely.",
    tags: ["WebAssembly", "ONNX Runtime", "SAM", "React", "C++"],
    featured: false,
    origin: "work",
    org: "GJ-Map",
  },
  {
    id: "call-center",
    title: "Voice Outreach Stack",
    description:
      "Voice outreach spanning three telephony generations: a Knowlarity-era call-ops platform (Express + DynamoDB + socket.io console) pooling Vapi and Smallest AI bot calls and auto-assigning outcomes to idle agents, a Tata SmartFlo auto-dialer with a drain-aware campaign rescheduler and clock-decay priority ladder, and today a Plivo WebRTC browser softphone where the browser is the SIP endpoint. Transcript summaries from gpt-4o-mini are pinned to an enum-terminated format, and follow-up state lands in Zoho CRM.",
    tags: ["Plivo", "Tata SmartFlo", "Vapi", "Smallest AI", "Zoho CRM"],
    featured: false,
    origin: "work",
    org: "Raaz",
  },
  {
    id: "fraud-dashboard",
    title: "Fraud-Detection Dashboard",
    description:
      "A real-time dashboard that flagged anomalous transactions before settlement so support agents could intervene before money left the account. Fraud losses at SuperPe dropped by roughly half.",
    tags: ["React", "Node.js", "PostgreSQL", "Real-time"],
    featured: false,
    origin: "work",
    org: "SuperPe",
  },
  {
    id: "gis-apps",
    title: "Enterprise GIS Applications",
    description:
      "Six production React apps for government and enterprise GIS teams, built on the ArcGIS SDK with the Calcite design system: real-time map layers, spatial queries, and bespoke visualization dashboards.",
    tags: ["React", "ArcGIS SDK", "Node.js", "SQL", "GIS"],
    featured: false,
    origin: "work",
    org: "GJ-Map",
  },
];
