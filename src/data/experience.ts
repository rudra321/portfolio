export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    company: "TechCorp",
    role: "Senior Frontend Engineer",
    period: "Jan 2024 - Present",
    description:
      "Leading the frontend architecture for a SaaS platform serving 50K+ users. Implemented micro-frontend architecture, reducing bundle size by 40% and improving page load times by 60%.",
    technologies: ["React", "TypeScript", "Next.js", "GraphQL", "AWS"],
  },
  {
    company: "StartupX",
    role: "Full-Stack Developer",
    period: "Jun 2022 - Dec 2023",
    description:
      "Built core product features end-to-end, including real-time collaboration, payment integration, and an analytics dashboard. Grew the engineering team from 3 to 12.",
    technologies: ["Node.js", "React", "PostgreSQL", "Redis", "Docker"],
  },
  {
    company: "Digital Agency Co.",
    role: "Frontend Developer",
    period: "Aug 2021 - May 2022",
    description:
      "Developed high-performance, responsive web applications for enterprise clients. Specialized in animation-heavy marketing sites and interactive data visualizations.",
    technologies: ["JavaScript", "GSAP", "Three.js", "Tailwind CSS"],
  },
  {
    company: "Open Source",
    role: "Contributor",
    period: "2020 - Present",
    description:
      "Active contributor to several open-source projects. Maintained a popular React component library with 2K+ GitHub stars. Regular speaker at local developer meetups.",
    technologies: ["React", "TypeScript", "Rust", "Python"],
  },
];
