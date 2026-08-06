import { METRICS } from "@/data/stats";

export const NAV_LINKS = [
  { label: "Ask", href: "#hero" },
  { label: "Work", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export const SITE_METADATA = {
  title: "Rudra Pratap Singh Chouhan | Software Engineer",
  description: `Software Engineer at Raaz. Healthcare software for ${METRICS.patients}+ patients and counting. Previously GJ-Map, SuperPe. BITS Pilani CS '23.`,
  url: "https://rudra321.github.io/portfolio",
  // Origin only — basePath (/portfolio) is appended automatically by Next for
  // file-based metadata such as the generated opengraph-image.
  origin: "https://rudra321.github.io",
};
