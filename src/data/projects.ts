import { METRICS } from "./stats";

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: "raaz-platform",
    title: "Raaz Healthcare Platform",
    description: `The healthcare platform I built and operate end to end, now past ${METRICS.patients} patients: a React Native app, an Express/TypeScript backend (${METRICS.endpoints}+ endpoints), and Supabase. One order pipeline routes ${METRICS.ordersPerDay}+ daily orders from app, web, and WhatsApp through a shared, forward-only payment state machine across Razorpay, Shopify, Prozo, and Proship — Redis-backed queues buffer the bursts, and every webhook is handled idempotently against a central log so provider redeliveries can't corrupt state.`,
    tags: ["React Native", "TypeScript", "AWS Lambda", "Supabase", "Redis", "Razorpay"],
    featured: true,
  },
  {
    id: "ai-clinical-engine",
    title: "Clinical Assessment Engine",
    description:
      "A deterministic 100-point clinical scoring engine that computes prognosis and a treatment cart from 9 weighted factors (IIEF-5, IELT, etiology, comorbidities), then hands the doctor a pre-filled record — prep drops from 30 minutes to 10-15. All the math is in code; Claude and Groq only format the report and the Hinglish diet plan, after an early version let the LLM add up the scores and it miscounted.",
    tags: ["Claude API", "Groq", "Node.js", "TypeScript", "PDF Generation"],
    featured: true,
  },
  {
    id: "scout",
    title: "Scout — Open-Source Job-Search Agent",
    description:
      "A job-search agent (MIT) I built during my own job hunt and open-sourced: ~6,300 lines of TypeScript, no framework, a hand-rolled CLI and HTTP server. It pulls real openings straight from ATS APIs (Greenhouse, Lever, Ashby), HN 'Who is hiring', and RSS feeds — not job boards — scores them with a zero-dependency heuristic plus an optional LLM pass, and drafts cover letters and cold emails with MX-validated address guessing. Thesis: zero ghost jobs.",
    tags: ["TypeScript", "Anthropic SDK", "CLI", "ATS APIs"],
    githubUrl: "https://github.com/rudra321/find-me-a-job",
    featured: true,
  },
  {
    id: "mood-musica",
    title: "MoodMusica — Map-First Music Discovery",
    description:
      "Tap anywhere on a world map, type a mood, and get an AI-curated color palette and eight real, region-appropriate songs with playable previews (Lagos + 'energetic night out' → Afrobeats). ~3,900 lines of Next.js with a hexagonal architecture (six swappable ports) and an anti-hallucination pipeline: every AI-suggested track is grounded in real Apple charts and verified against the iTunes API before it's shown. Free services only, no Spotify.",
    tags: ["Next.js", "React", "Leaflet", "LLM", "iTunes API"],
    githubUrl: "https://github.com/rudra321/mood-musica",
    featured: false,
  },
  {
    id: "whatsapp-calendar",
    title: "WhatsApp Calendar Assistant",
    description:
      "A WhatsApp bot (~2,350 lines, Bun + Hono) that turns \"meeting with Shivay tomorrow at 2pm\" into a Google Calendar event with a Meet link and conflict detection. Groq parses intent into Zod-validated payloads; a hexagonal architecture with six port interfaces makes swapping providers a one-file change; and it does self-service Google OAuth over a sign-in link the bot sends you.",
    tags: ["TypeScript", "Bun", "Hono", "Groq", "Google Calendar API", "Fly.io"],
    githubUrl: "https://github.com/rudra321/whatsapp-calendar",
    featured: false,
  },
  {
    id: "gis-detection",
    title: "Browser-Based GIS Object Detection",
    description:
      "Compiled C++ inference kernels to WebAssembly and paired ONNX Runtime with Meta's Segment Anything Model to run object detection on GIS imagery directly in the browser. It cut end-to-end detection turnaround ~40% versus the server round-trip and eliminated server-side GPU compute entirely.",
    tags: ["WebAssembly", "ONNX Runtime", "SAM", "React", "C++"],
    featured: false,
  },
  {
    id: "call-center",
    title: "Real-Time Voice-AI Call System",
    description: `Voice-AI outreach on Vapi and Smallest AI handling ${METRICS.callsPerMonth}+ calls a month across an auto-dialer, human agents, and AI bots. Event-triggered from app activity, with a P1-P6 time-priority ladder, transcript summaries forced into a machine-parseable token for deterministic extraction, and automatic CRM follow-up state plus live agent handoff over WebSocket/SSE, bridged into Zoho CRM.`,
    tags: ["Vapi", "Smallest AI", "Socket.io", "DynamoDB", "Zoho CRM"],
    featured: false,
  },
  {
    id: "fraud-dashboard",
    title: "Fraud-Detection Dashboard",
    description:
      "A real-time dashboard that flagged anomalous transactions before settlement so support agents could intervene before money left the account. Fraud losses at SuperPe dropped by roughly half.",
    tags: ["React", "Node.js", "PostgreSQL", "Real-time"],
    featured: false,
  },
  {
    id: "gis-apps",
    title: "Enterprise GIS Applications",
    description:
      "Six production React apps for government and enterprise GIS teams, built on the ArcGIS SDK with the Calcite design system: real-time map layers, spatial queries, and bespoke visualization dashboards.",
    tags: ["React", "ArcGIS SDK", "Node.js", "SQL", "GIS"],
    featured: false,
  },
];
