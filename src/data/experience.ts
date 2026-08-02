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
    role: "Lead Engineer",
    period: "Jan 2025 - Present",
    location: "Bangalore, India",
    description: [
      "Effectively the only engineer on the platform: ~105k lines of first-party TypeScript across a production backend (204 HTTP endpoints, 41 services, 71 SQL migrations) and a React Native app, all designed, shipped, and operated solo. It now serves 55,000+ registered patients and 35,000+ monthly active users.",
      "Built the order pipeline that routes 120+ daily orders from app, web, and WhatsApp through one shared payment and order state machine spanning Razorpay, Shopify, Prozo (warehouse), and Proship (last-mile). Webhooks arrive out of order, so payment status only moves forward and a late 'failed' can never overwrite a 'captured'; every handler is idempotent against a central webhook-log table with DB unique constraints, so provider redeliveries are safe.",
      "Built a deterministic 100-point clinical scoring engine (9 weighted factors including IIEF-5 and IELT, etiology, and comorbidities) that computes prognosis and a treatment cart, then hands the doctor a pre-filled record. It cut per-patient prep from 30 minutes to 10-15. All scoring lives in code; Claude and Groq only format the report and diet plan, after an earlier version let the LLM do the arithmetic and got it wrong.",
      "Built voice-AI outreach on Vapi and Smallest AI that handles 200,000+ calls a month across an auto-dialer, human agents, and AI bots. It is event-triggered from app activity, with a time-based P1-P6 priority ladder, transcript summarization forced into a machine-parseable token, and automatic CRM follow-up state and live agent handoff over WebSocket/SSE.",
      "Built server-side ad attribution (Meta CAPI, Google offline conversions) threading each click through to payment with pixel deduplication and DB-level idempotency, improving measured paid-ad attribution by 46%. Also built the bidirectional Zoho CRM sync, the appointment system, the notification system, and the e-commerce layer.",
    ],
    technologies: ["React Native", "TypeScript", "AWS Lambda", "Supabase", "Zoho CRM", "Claude API"],
  },
  {
    company: "GJ-Map Solutions",
    role: "Software Engineer",
    period: "May 2024 - Oct 2024",
    location: "Udaipur, India",
    description: [
      "Moved GIS object detection into the browser by compiling C++ inference kernels to WebAssembly and pairing ONNX Runtime with Meta's Segment Anything Model. It cut end-to-end detection turnaround by ~40% versus the server round-trip and removed the server-side GPU dependency entirely.",
      "Shipped six production React apps for government and enterprise GIS teams on the ArcGIS SDK with the Calcite design system: real-time map layers, spatial queries, and custom visualization dashboards.",
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
      "Built a fraud-detection dashboard in React that flagged anomalous transactions in real time so support could intervene before settlement. Fraud losses dropped by roughly half.",
      "Built user onboarding and payment checkout in React Native, with geolocation-based service gating, across a flow that handled 50,000+ transactions a day.",
    ],
    technologies: ["React", "React Native", "Node.js", "PostgreSQL"],
  },
];
