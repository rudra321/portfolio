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
      "End-to-end healthcare platform serving 55,000+ users. React Native app, Express/TypeScript API, Supabase database, 10+ Lambda microservices, integrated payment and logistics pipeline with Razorpay, Shopify, and warehouse management systems.",
    tags: ["React Native", "TypeScript", "AWS Lambda", "Supabase", "Redis", "Razorpay"],
    featured: true,
  },
  {
    id: "ai-clinical-engine",
    title: "AI Clinical Assessment Engine",
    description:
      "AI-powered clinical assessment system with weighted scoring, branching logic, and severity analysis. Generates personalized PDF reports and diet charts via Claude and Groq APIs, replacing manual doctor workflows and cutting consultation prep time by 70%.",
    tags: ["Claude API", "Groq", "Node.js", "TypeScript", "PDF Generation"],
    featured: true,
  },
  {
    id: "gis-detection",
    title: "Browser-Based GIS Object Detection",
    description:
      "Compiled C++ inference kernels to WebAssembly and integrated ONNX Runtime with Meta's Segment Anything Model for browser-based object detection on GIS imagery. Reduced detection time by 40% and eliminated server-side processing entirely.",
    tags: ["WebAssembly", "ONNX Runtime", "SAM", "React", "C++"],
    featured: false,
  },
  {
    id: "call-center",
    title: "Real-Time Call Center System",
    description:
      "Real-time call center infrastructure using Socket.io, DynamoDB, and SSE streaming. Connected Tata Tele telephony with Zoho CRM to automate appointment tracking and lead rescheduling across 200,000+ monthly calls.",
    tags: ["Socket.io", "DynamoDB", "SSE", "Zoho CRM", "Node.js"],
    featured: false,
  },
  {
    id: "fraud-dashboard",
    title: "Fraud Detection Dashboard",
    description:
      "Real-time fraud detection dashboard that flagged anomalous transactions before settlement, enabling support agents to intervene immediately. Reduced fraud losses by 50% at SuperPe.",
    tags: ["React", "Node.js", "PostgreSQL", "Real-time"],
    featured: false,
  },
  {
    id: "gis-apps",
    title: "Enterprise GIS Applications",
    description:
      "6 production React applications for government and enterprise GIS teams. Built on ArcGIS SDK with real-time map layers, spatial queries, and custom data visualization dashboards.",
    tags: ["React", "ArcGIS SDK", "Node.js", "SQL", "GIS"],
    featured: false,
  },
];
