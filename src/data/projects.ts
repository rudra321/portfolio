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
    description:
      "Healthcare platform used by 55,000+ patients. A React Native app, an Express/TypeScript API on Lambda, and a Supabase database. The same codebase handles payments through Razorpay, orders through Shopify, and warehouse handoff to Prozo and Proship.",
    tags: ["React Native", "TypeScript", "AWS Lambda", "Supabase", "Redis", "Razorpay"],
    featured: true,
  },
  {
    id: "ai-clinical-engine",
    title: "Clinical Assessment Engine",
    description:
      "An assessment engine with weighted scoring, branching logic, and severity analysis. It generates PDF reports and diet plans through Claude and Groq, replaces a manual doctor workflow, and cut consultation prep time by 70%.",
    tags: ["Claude API", "Groq", "Node.js", "TypeScript", "PDF Generation"],
    featured: true,
  },
  {
    id: "whatsapp-calendar",
    title: "WhatsApp Calendar Assistant",
    description:
      "A WhatsApp bot that turns natural-language messages into Google Calendar events. Text \"meeting with Shivay tomorrow at 2pm\" and it creates the event, detects conflicts, adds a Meet link, and replies in plain English. Built on Bun and Hono with Groq for intent parsing, a hexagonal architecture so swapping providers is a one-file change, and self-service Google OAuth via a sign-in link the bot sends you.",
    tags: ["TypeScript", "Bun", "Hono", "Groq", "Google Calendar API", "Fly.io"],
    githubUrl: "https://github.com/rudra321/whatsapp-calendar",
    featured: false,
  },
  {
    id: "gis-detection",
    title: "Browser-Based GIS Object Detection",
    description:
      "Compiled C++ inference kernels to WebAssembly and paired ONNX Runtime with Meta's Segment Anything Model to run object detection on GIS imagery directly in the browser. It's 40% faster than the previous pipeline, with no server-side inference at all.",
    tags: ["WebAssembly", "ONNX Runtime", "SAM", "React", "C++"],
    featured: false,
  },
  {
    id: "call-center",
    title: "Real-Time Call-Center System",
    description:
      "Real-time call-center infrastructure on Socket.io, DynamoDB, and SSE. It bridges Tata Tele telephony with Zoho CRM so appointment tracking and lead rescheduling happen automatically across 200,000+ calls a month.",
    tags: ["Socket.io", "DynamoDB", "SSE", "Zoho CRM", "Node.js"],
    featured: false,
  },
  {
    id: "fraud-dashboard",
    title: "Fraud-Detection Dashboard",
    description:
      "A real-time dashboard that flagged anomalous transactions before settlement so support agents could intervene before money left the account. Fraud losses at SuperPe dropped by half.",
    tags: ["React", "Node.js", "PostgreSQL", "Real-time"],
    featured: false,
  },
  {
    id: "gis-apps",
    title: "Enterprise GIS Applications",
    description:
      "Six production React apps for government and enterprise GIS teams, built on the ArcGIS SDK with real-time map layers, spatial queries, and bespoke visualization dashboards.",
    tags: ["React", "ArcGIS SDK", "Node.js", "SQL", "GIS"],
    featured: false,
  },
];
