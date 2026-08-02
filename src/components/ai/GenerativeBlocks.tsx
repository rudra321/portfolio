"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { EXPERIENCES } from "@/data/experience";
import { SKILLS } from "@/data/skills";
import { PERSONAL } from "@/data/personal";
import type { ChatAction } from "@/lib/chat/actions";

// Renders the real UI for the model's [[ui:*]] markers — the "generative UI".
// Shares the site's card grammar so chat cards and the sections feel like one
// system. Titles are <p> (transient chat content, kept out of the heading flow).

const card =
  "rounded-2xl border border-card-border bg-card-bg p-5 transition-colors duration-300 hover:border-accent/25 hover:bg-accent/[0.03]";
const chip =
  "rounded-md border border-card-border bg-card-bg px-2.5 py-1 font-mono text-[11px] text-text-secondary transition-colors hover:border-accent/30 hover:text-foreground";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export function GenerativeBlocks({ actions }: { actions: ChatAction[] }) {
  if (actions.length === 0) return null;
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="mt-3 space-y-4"
    >
      {actions.map((action, i) => (
        <motion.div key={`${action.type}-${i}`} variants={item}>
          <Block action={action} />
        </motion.div>
      ))}
    </motion.div>
  );
}

// Single-action renderer, used by the segment-ordered chat rendering.
export function GenerativeBlock({ action }: { action: ChatAction }) {
  return <Block action={action} />;
}

function Block({ action }: { action: ChatAction }) {
  switch (action.type) {
    case "projects":
      return <ProjectsBlock />;
    case "project":
      return <ProjectsBlock id={action.id} />;
    case "experience":
      return <ExperienceBlock />;
    case "skills":
      return <SkillsBlock category={action.category} />;
    case "stat":
      return <StatBlock value={action.value} label={action.label} />;
    case "contact":
      return <ContactBlock />;
    case "resume":
      return <ResumeBlock />;
    default:
      return null;
  }
}

function ProjectsBlock({ id }: { id?: string }) {
  const matched = id
    ? PROJECTS.filter((p) => p.id === id)
    : PROJECTS.filter((p) => p.featured);
  const projects = matched.length > 0 ? matched : PROJECTS.slice(0, 3);

  return (
    <div className="grid gap-2.5">
      {projects.map((p) => {
        const link = p.liveUrl ?? p.githubUrl;
        const label = p.liveUrl ? "Visit" : "GitHub";
        return (
          <div key={p.id} className={`group ${card}`}>
            <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
              <p className="min-w-0 break-words font-serif text-[17px] italic leading-tight text-foreground">
                {p.title}
              </p>
              {link ? (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-text-secondary transition-colors hover:text-accent"
                >
                  {label}
                  <ArrowUpRight
                    size={12}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              ) : (
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-text-secondary/55">
                  In production
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
              {p.description}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {p.tags.slice(0, 5).map((t) => (
                <span key={t} className={chip}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ExperienceBlock() {
  return (
    <div className="grid gap-2.5">
      {EXPERIENCES.map((e) => (
        <div key={e.company} className={card}>
          <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
            <p className="text-sm font-semibold tracking-tight text-foreground">
              {e.role}
              <span className="font-serif font-normal italic text-accent"> · {e.company}</span>
            </p>
            <span className="shrink-0 font-mono text-[11px] text-text-secondary/80">
              {e.period}
            </span>
          </div>
          <ul className="mt-2 space-y-1.5">
            {e.description.slice(0, 2).map((d, i) => (
              <li
                key={i}
                className="relative pl-4 text-sm leading-relaxed text-text-secondary before:absolute before:left-0 before:top-[0.65em] before:h-px before:w-2 before:bg-text-secondary/40"
              >
                {d}
              </li>
            ))}
          </ul>
          <p className="mt-2.5 font-mono text-[11px] text-text-secondary/80">
            {e.technologies.join("  ·  ")}
          </p>
        </div>
      ))}
    </div>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className={card}>
      <p className="font-serif text-3xl italic leading-none text-accent">{value}</p>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary/80">
        {label}
      </p>
    </div>
  );
}

function SkillsBlock({ category }: { category?: string }) {
  const filtered = category ? SKILLS.filter((s) => s.category === category) : SKILLS;
  const list = filtered.length > 0 ? filtered : SKILLS;
  return (
    <div className={card}>
      <div className="space-y-3">
        {list.map((s) => (
          <div key={s.category}>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary/80">
              {s.category}
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {s.items.map((it) => (
                <span key={it} className={chip}>
                  {it}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between border-b border-card-border py-2.5 text-sm text-text-secondary transition-colors last:border-b-0 hover:text-accent"
    >
      <span className="font-serif italic">{label}</span>
      <ArrowUpRight
        size={14}
        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
      />
      <span className="sr-only"> (opens in new tab)</span>
    </a>
  );
}

function ContactBlock() {
  return (
    <div className={card}>
      <a
        href={`mailto:${PERSONAL.email}`}
        className="block font-mono text-sm text-accent transition-opacity hover:opacity-80"
      >
        {PERSONAL.email}
      </a>
      <div className="mt-1.5">
        <ContactLink href={PERSONAL.socials.github} label="GitHub" />
        <ContactLink href={PERSONAL.socials.linkedin} label="LinkedIn" />
        <ContactLink href={PERSONAL.resumeUrl} label="Résumé" />
      </div>
    </div>
  );
}

function ResumeBlock() {
  return (
    <div className={card}>
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-secondary/80">
        Résumé
      </p>
      <a
        href={PERSONAL.resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        View résumé
        <ArrowUpRight size={15} />
        <span className="sr-only"> (opens in new tab)</span>
      </a>
    </div>
  );
}
