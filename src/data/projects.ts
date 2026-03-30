export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: "project-1",
    title: "CloudSync",
    description:
      "A real-time collaborative workspace with end-to-end encryption. Built with WebSockets, React, and a custom CRDT-based sync engine for seamless multi-user editing.",
    tags: ["React", "Node.js", "WebSocket", "PostgreSQL"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    featured: true,
  },
  {
    id: "project-2",
    title: "Nexus AI",
    description:
      "An AI-powered code review tool that integrates with GitHub. Analyzes pull requests for bugs, security vulnerabilities, and performance issues using LLMs.",
    tags: ["Python", "FastAPI", "OpenAI", "GitHub API"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    featured: true,
  },
  {
    id: "project-3",
    title: "PixelForge",
    description:
      "A browser-based image editor with layer support, filters, and export capabilities. Built entirely with Canvas API and Web Workers for non-blocking operations.",
    tags: ["TypeScript", "Canvas API", "Web Workers", "Zustand"],
    githubUrl: "https://github.com",
    featured: false,
  },
  {
    id: "project-4",
    title: "DevMetrics",
    description:
      "A developer analytics dashboard that tracks coding activity, language usage, and productivity patterns across repositories with beautiful data visualizations.",
    tags: ["Next.js", "D3.js", "Prisma", "tRPC"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    featured: false,
  },
  {
    id: "project-5",
    title: "Volt",
    description:
      "A minimal, blazing-fast CLI task runner written in Rust. Supports parallel execution, dependency graphs, and incremental builds for monorepo workflows.",
    tags: ["Rust", "CLI", "Tokio", "Serde"],
    githubUrl: "https://github.com",
    featured: false,
  },
  {
    id: "project-6",
    title: "Aether UI",
    description:
      "An open-source component library with 50+ accessible, themeable React components. Built with Radix primitives and Tailwind CSS with full dark mode support.",
    tags: ["React", "Tailwind CSS", "Radix UI", "Storybook"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
    featured: false,
  },
];
