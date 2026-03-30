"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { TiltCard } from "@/components/ui/TiltCard";
import { GradientBlob } from "@/components/ui/GradientBlob";
import { fadeInUp } from "@/lib/animations";

export function Projects() {
  const featured = PROJECTS.filter((p) => p.featured);
  const other = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative px-6 py-24 md:py-40">
      <GradientBlob
        color="purple"
        size="400px"
        className="top-[20%] -right-[10%] opacity-20"
      />

      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <motion.div
          className="mb-16 flex items-center gap-4"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="font-mono text-sm text-accent-cyan">03</span>
          <span className="h-px w-12 bg-white/20" />
          <span className="font-mono text-sm uppercase tracking-widest text-text-secondary">
            Projects
          </span>
        </motion.div>

        {/* Featured projects — large editorial cards */}
        <div className="space-y-8">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <TiltCard className="p-8 md:p-12" tiltDegree={4}>
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl">
                    <p className="mb-3 font-mono text-xs text-text-secondary/40">
                      Featured Project
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-text-secondary">
                      {project.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs text-accent-cyan/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex shrink-0 items-center gap-1 text-sm text-text-secondary transition-colors hover:text-foreground"
                    >
                      View
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  )}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Other projects — compact grid */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] md:grid-cols-2">
          {other.map((project) => (
            <motion.div
              key={project.id}
              className="group relative border-b border-r border-white/[0.04] p-6 transition-colors last:border-b-0 hover:bg-white/[0.02] md:p-8 md:[&:nth-last-child(-n+2)]:border-b-0"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-base font-semibold tracking-tight">
                  {project.title}
                </h3>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary/40 transition-colors hover:text-foreground"
                    aria-label={`${project.title} source`}
                  >
                    <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary/70">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[11px] text-text-secondary/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
