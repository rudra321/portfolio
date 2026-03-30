"use client";

import { motion } from "framer-motion";
import { EXPERIENCES } from "@/data/experience";
import { fadeInUp } from "@/lib/animations";

export function Experience() {
  return (
    <section id="experience" className="relative px-6 py-24 md:py-40">
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <motion.div
          className="mb-16 flex items-center gap-4"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="font-mono text-sm text-accent-cyan">02</span>
          <span className="h-px w-12 bg-white/20" />
          <span className="font-mono text-sm uppercase tracking-widest text-text-secondary">
            Experience
          </span>
        </motion.div>

        <div className="space-y-0">
          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.company}
              className="group relative grid border-t border-white/[0.06] py-10 first:border-t-0 first:pt-0 md:grid-cols-[200px_1fr] md:gap-12 lg:grid-cols-[240px_1fr]"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {/* Left column — company + period */}
              <div className="mb-3 md:mb-0">
                <p className="font-mono text-xs text-text-secondary/50">
                  {exp.period}
                </p>
                <p className="mt-1 text-sm font-medium text-text-secondary">
                  {exp.company}
                </p>
                <p className="text-xs text-text-secondary/40">{exp.location}</p>
              </div>

              {/* Right column — role + details */}
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {exp.role}
                  <span className="text-accent-cyan"> @ {exp.company}</span>
                </h3>

                <ul className="mt-4 space-y-3">
                  {exp.description.map((point, j) => (
                    <li
                      key={j}
                      className="relative pl-5 text-sm leading-relaxed text-text-secondary before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-text-secondary/30"
                    >
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs text-text-secondary/50"
                    >
                      {tech}{i < EXPERIENCES.length || tech !== exp.technologies[exp.technologies.length - 1] ? " ·" : ""}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
