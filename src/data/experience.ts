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
    role: "Product Engineer",
    period: "Jan 2025 - Present",
    location: "Bangalore, India",
    description: [
      "Built the healthcare platform end-to-end: a React Native (Expo) app, an Express/TypeScript API, a Supabase database, and 10+ Lambda services. The platform now serves 55,000+ patients.",
      "Wired Razorpay, Shopify, Prozo WMS, and Proship into a single order pipeline, with idempotent webhook handlers and Redis-backed queues so retries can't corrupt state.",
      "Built a real-time call-center system on Socket.io, DynamoDB, and SSE, and connected Tata Tele telephony to Zoho CRM so call logging and lead routing run themselves. It handles 200,000+ calls a month.",
      "Built a clinical assessment engine on Claude and Groq that replaced a manual triage workflow and cut consultation prep time by 70%.",
      "Built a notification system with scheduled drips and cohort targeting; lead capture went up 10% and retention 25%.",
    ],
    technologies: ["React Native", "TypeScript", "AWS Lambda", "Supabase", "Redis", "Claude API"],
  },
  {
    company: "GJ-Map Solutions",
    role: "Software Engineer",
    period: "May 2024 - Oct 2024",
    location: "Udaipur, India",
    description: [
      "Built a browser-based object-detection system for GIS imagery by compiling C++ inference kernels to WebAssembly and pairing ONNX Runtime with Meta's Segment Anything Model. Detection time dropped by 40%.",
      "Shipped six production React apps for government and enterprise GIS teams, built on the ArcGIS SDK with real-time map layers and spatial queries.",
      "Built the company's Node.js + SQL backend from scratch, including the automated geospatial ingestion pipelines that fed every map.",
    ],
    technologies: ["React", "WebAssembly", "ONNX Runtime", "Node.js", "ArcGIS SDK", "SQL"],
  },
  {
    company: "SuperPe",
    role: "Software Engineering Intern",
    period: "Jul 2022 - Dec 2022",
    location: "Bangalore, India",
    description: [
      "Built a fraud-detection dashboard in React that flagged anomalous transactions in real time. Fraud losses dropped by half.",
      "Built user onboarding and payment checkout in React Native, with geolocation-based service gating, across a flow that handled 50,000+ transactions a day.",
    ],
    technologies: ["React", "React Native", "Node.js", "PostgreSQL"],
  },
];
