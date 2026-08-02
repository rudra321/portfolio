// Assembles the grounding context from the SAME typed data that drives the site,
// so the assistant's knowledge stays in sync automatically — no second source.

import { PERSONAL } from "@/data/personal";
import { EXPERIENCES } from "@/data/experience";
import { PROJECTS } from "@/data/projects";
import { SKILLS } from "@/data/skills";

export function buildKnowledge(): string {
  const profile = [
    `Name: ${PERSONAL.name}`,
    `Role: ${PERSONAL.title}`,
    `Location: ${PERSONAL.location}`,
    `Education: ${PERSONAL.degree}, ${PERSONAL.university} (${PERSONAL.campus}), ${PERSONAL.gradYear}`,
    `Email: ${PERSONAL.email}`,
    `GitHub: ${PERSONAL.socials.github}`,
    `LinkedIn: ${PERSONAL.socials.linkedin}`,
    `Interests: ${PERSONAL.interests}`,
    `Open to: ${PERSONAL.lookingFor}`,
  ].join("\n");

  const experience = EXPERIENCES.map((e) =>
    [
      `${e.role} @ ${e.company} (${e.period}, ${e.location})`,
      ...e.description.map((d) => `  - ${d}`),
      `  Tech: ${e.technologies.join(", ")}`,
    ].join("\n")
  ).join("\n\n");

  const projects = PROJECTS.map((p) =>
    [
      `[${p.id}] ${p.title}${p.featured ? " (featured)" : ""}`,
      `  ${p.description}`,
      `  Tags: ${p.tags.join(", ")}`,
      ...(p.githubUrl ? [`  GitHub: ${p.githubUrl}`] : []),
    ].join("\n")
  ).join("\n\n");

  const skills = SKILLS.map((s) => `${s.category}: ${s.items.join(", ")}`).join("\n");

  return [
    `## Profile\n${profile}`,
    `## Experience\n${experience}`,
    `## Projects\n${projects}`,
    `## Skills\n${skills}`,
  ].join("\n\n");
}
