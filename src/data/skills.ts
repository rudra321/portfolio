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
    items: ["AWS Lambda", "S3", "API Gateway", "DynamoDB", "Docker", "Supabase", "Vercel"],
  },
  {
    category: "AI / ML",
    items: ["LLMs (Claude, Groq)", "RAG", "ONNX Runtime", "YOLO", "Segment Anything Model", "WebAssembly"],
  },
];

export const ALL_SKILLS = SKILLS.flatMap((cat) => cat.items);
