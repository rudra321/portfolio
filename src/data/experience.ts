import { METRICS } from "./stats";

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  technologies: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    company: "Raaz",
    role: "Software Engineer",
    period: "Jan 2025 - Present",
    location: "Bangalore, India",
    description: [
      `Primary engineer on the platform: the Express/TypeScript backend, the patient app, the assessment funnel, the browser-calling core of the rep console, and the satellite services around them (payments and fulfillment, appointments, notifications, analytics ETL), built and operated across two platform generations in eighteen months, alongside the engineers who own the doctor dashboards and call-center tooling. The patient base has grown past ${METRICS.patients} registered, with ${METRICS.mau}+ monthly active.`,
      `Built the order pipeline that routes ${METRICS.ordersPerDay}+ daily orders from app, web, and WhatsApp into one payment-status state machine that every channel's webhooks funnel into: Razorpay, Shopify, Shopflo, COD. Fulfillment runs through Prozo's warehouse and last-mile network; payment status only moves forward, so a late 'failed' can never overwrite a 'captured'. Idempotency is enforced at the database with a central webhook log and per-stream unique constraints, and cron reconcilers sweep for drift: a paid order missing its CRM deal gets found and repaired automatically.`,
      "A points-based clinical engine on validated instruments (IIEF-5, IELT bands) scores eight weighted root causes, stages ED/PE severity, and assigns a RED/AMBER/GREEN risk lane; a pure-function cart engine then drafts the first-month treatment plan, diffs doctor-corrected runs against the assessment draft, and pre-fills the doctor's record. It cut per-patient prep from 30 minutes to 10-15. All the math is in code; Claude and Groq only turn computed results into the doctor-facing report and patient copy, after an earlier version let the LLM do the arithmetic and it got the totals wrong.",
      `Worked across three telephony generations in eighteen months: operated and extended the Knowlarity-era call-ops platform (Vapi and Smallest AI bot calls, outcomes auto-assigned to idle agents on a live console) and the Tata SmartFlo auto-dialer with its drain-aware campaign rescheduler, then built today's Plivo WebRTC browser softphone with per-agent SIP endpoints, a four-phase dial-state machine built from a measured ringback failure, and a call ledger reconciled against provider CDRs. It has handled ${METRICS.callsPerMonth}+ calls a month at peak, with follow-up state derived, not accumulated, into Zoho CRM throughout.`,
      "Built server-side ad attribution (Meta CAPI, Google offline conversions) threading each click through to payment with pixel deduplication and DB-level idempotency, improving measured paid-ad attribution by 46%. Also built the bidirectional Zoho CRM sync, the appointment system, the notification system, and the e-commerce layer.",
    ],
    technologies: ["React Native", "TypeScript", "Express", "Supabase", "AWS", "Zoho CRM", "Claude API"],
  },
  {
    company: "GJ-Map Solutions",
    role: "Software Engineer",
    period: "May 2024 - Oct 2024",
    location: "Udaipur, India",
    description: [
      "Built six production React apps on the ArcGIS SDK with the Calcite design system for government and enterprise GIS teams working with heavy multi-temporal satellite imagery. The apps put years of imagery of the same land side by side so development becomes visible: roads appearing and extending, cropland shifting, construction filling in over time.",
      "As one part of that, moved object detection into the browser: compiled C++ inference kernels to WebAssembly and paired ONNX Runtime with Meta's Segment Anything Model, cutting detection turnaround by ~40% versus the server round-trip and removing the server-side GPU dependency entirely.",
      "Built the company's Node.js and SQL backend from scratch, including the geospatial ingestion, validation, and email-based submission-tracking pipelines that fed every map, plus the company website.",
    ],
    technologies: ["React", "WebAssembly", "ONNX Runtime", "Node.js", "ArcGIS SDK", "SQL"],
  },
  {
    company: "SuperPe",
    role: "Software Engineering Intern",
    period: "Jul 2022 - Dec 2022",
    location: "Bangalore, India",
    description: [
      "Built a fraud-detection dashboard in React that flagged anomalous transactions in real time so support could intervene before settlement.",
      "Built user onboarding and payment checkout in React Native, with geolocation-based service gating, in the payments checkout flow.",
    ],
    technologies: ["React", "React Native", "Node.js", "PostgreSQL"],
  },
];
