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
      "Led development of a healthcare platform end-to-end: React Native app (Expo), Express/TypeScript API, Supabase database, and 10+ Lambda microservices, serving 55,000+ users.",
      "Integrated Razorpay, Shopify, Prozo WMS, and Proship into a unified order pipeline with idempotent webhook handlers and Redis-backed queues.",
      "Designed a real-time call center system using Socket.io, DynamoDB, and SSE streaming; connected Tata Tele telephony with Zoho CRM to automate tracking across 200,000+ monthly calls.",
      "Developed an AI-powered clinical assessment engine via Claude and Groq APIs, cutting consultation prep time by 70%.",
      "Increased lead capture by 10% and user retention by 25% with a notification system using smart scheduling, behavioral nudges, and cohort-based targeting.",
    ],
    technologies: ["React Native", "TypeScript", "AWS Lambda", "Supabase", "Redis", "Claude API"],
  },
  {
    company: "GJ-Map Solutions",
    role: "Software Engineer",
    period: "May 2024 - Oct 2024",
    location: "Udaipur, India",
    description: [
      "Built a browser-based object detection system for GIS imagery by compiling C++ inference kernels to WebAssembly and integrating ONNX Runtime with Meta's Segment Anything Model, reducing detection time by 40%.",
      "Delivered 6 production React applications used by government and enterprise GIS teams, built on ArcGIS SDK with real-time map layers and spatial queries.",
      "Designed and built the company's Node.js + SQL backend from scratch, including automated geospatial data ingestion pipelines.",
    ],
    technologies: ["React", "WebAssembly", "ONNX Runtime", "Node.js", "ArcGIS SDK", "SQL"],
  },
  {
    company: "SuperPe",
    role: "Software Engineering Intern",
    period: "Jul 2022 - Dec 2022",
    location: "Bangalore, India",
    description: [
      "Built a fraud detection dashboard in React that flagged anomalous transactions in real time, reducing fraud losses by 50%.",
      "Developed user onboarding and payment checkout flows in React Native, including Geolocation-based service gating, serving 50,000+ daily transactions.",
    ],
    technologies: ["React", "React Native", "Node.js", "PostgreSQL"],
  },
];
