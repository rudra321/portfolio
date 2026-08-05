export interface SkillCategory {
  category: string;
  items: string[];
}

export const SKILLS: SkillCategory[] = [
  {
    category: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "C/C++", "SQL"],
  },
  {
    category: "Frontend",
    items: ["React", "React Native (Expo)", "Next.js", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "PostgreSQL", "DynamoDB", "MongoDB", "Redis", "Firebase"],
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS Lambda", "S3", "API Gateway", "EventBridge", "CloudWatch", "Docker", "Supabase", "Vercel", "Fly.io"],
  },
  {
    category: "AI / ML",
    items: ["LLMs (Claude, Groq, GPT-4o-mini)", "Voice AI (Vapi, Smallest AI)", "RAG", "ONNX Runtime", "Segment Anything Model", "WebAssembly", "YOLO"],
  },
  {
    category: "Integrations",
    items: ["Razorpay", "Shopify", "Zoho CRM", "Meta CAPI", "Google Ads API", "WhatsApp Cloud API", "Puppeteer"],
  },
];

export const ALL_SKILLS = SKILLS.flatMap((cat) => cat.items);
