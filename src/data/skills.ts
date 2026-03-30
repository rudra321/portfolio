export interface SkillCategory {
  category: string;
  items: string[];
}

export const SKILLS: SkillCategory[] = [
  {
    category: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Rust", "Go", "SQL"],
  },
  {
    category: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "Three.js", "GSAP"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "FastAPI", "GraphQL", "tRPC", "Prisma"],
  },
  {
    category: "Database",
    items: ["PostgreSQL", "MongoDB", "Redis", "Supabase", "PlanetScale"],
  },
  {
    category: "DevOps & Tools",
    items: ["Docker", "AWS", "Vercel", "GitHub Actions", "Terraform", "Linux"],
  },
  {
    category: "Design",
    items: ["Figma", "Responsive Design", "UI/UX", "Accessibility", "Motion Design"],
  },
];

export const ALL_SKILLS = SKILLS.flatMap((cat) => cat.items);
