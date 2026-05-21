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
    <section id="projects" className="relative overflow-hidden px-6 py-32 md:py-44">
      <GradientBlob
        color="amber"
        size="440px"
        className="top-[18%] -right-[14%] opacity-25"
      />

      <span
        aria-hidden
        className="ghost-numeral pointer-events-none absolute -top-2 right-2 select-none text-[clamp(180px,28vw,360px)] md:right-10 md:top-6"
      >
        03
      </span>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.h2
          className="mb-14 font-serif text-3xl italic text-foreground md:text-4xl"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Selected work.
        </motion.h2>

        {/* Featured - asymmetric editorial cards with big serial numerals */}
        <div className="space-y-10">
          {featured.map((project, idx) => (
            <motion.div
              key={project.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <TiltCard className="p-8 md:p-12" tiltDegree={3}>
                <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-10">
                  {/* Big serif numeral */}
                  <div className="md:pr-6 md:border-r md:border-card-border">
                    <p className="font-serif text-5xl italic text-accent/80 md:text-6xl">
                      {String(idx + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        {project.title}
                      </h3>
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/link mt-1 flex shrink-0 items-baseline gap-1 font-serif text-base italic text-text-secondary transition-colors hover:text-accent"
                        >
                          visit
                          <ArrowUpRight
                            size={14}
                            className="transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                          />
                        </a>
                      )}
                    </div>
                    <p className="max-w-2xl text-[20px] leading-[1.6] text-text-secondary">
                      {project.description}
                    </p>
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-text-secondary/55">
                      {project.tags.join("  ·  ")}
                    </p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Other - quieter grid, deliberately not glass */}
        <div className="mt-20">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-text-secondary/40">
            More
          </p>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-card-border bg-card-border md:grid-cols-2">
            {other.map((project) => (
              <motion.div
                key={project.id}
                className="group relative bg-background p-6 transition-colors hover:bg-accent/[0.03] md:p-8"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-lg italic leading-tight tracking-tight">
                    {project.title}
                  </h3>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary/40 transition-colors group-hover:text-accent"
                      aria-label={`${project.title} source`}
                    >
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
                <p className="mt-3 text-[17px] leading-[1.55] text-text-secondary/85">
                  {project.description}
                </p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-text-secondary/40">
                  {project.tags.join("  ·  ")}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
