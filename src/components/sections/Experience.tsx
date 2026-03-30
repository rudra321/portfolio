"use client";

import { motion } from "framer-motion";
import { EXPERIENCES } from "@/data/experience";
import { GlassCard } from "@/components/ui/GlassCard";
import { TextReveal } from "@/components/ui/TextReveal";
import { fadeInUp } from "@/lib/animations";

export function Experience() {
  return (
    <section id="experience" className="relative px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <TextReveal
          text="Experience"
          element="h2"
          className="mb-16 text-3xl font-bold tracking-tight md:text-4xl"
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/50 via-accent-purple/30 to-transparent md:left-1/2 md:-translate-x-px" />

          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.company}
              className={`relative mb-12 flex flex-col md:flex-row ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-8 z-10 md:left-1/2 md:-translate-x-1/2">
                <div className="flex h-3 w-3 items-center justify-center">
                  <span className="absolute h-3 w-3 rounded-full bg-accent-cyan/20" />
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                </div>
              </div>

              {/* Content */}
              <div
                className={`w-full pl-8 md:w-1/2 md:pl-0 ${
                  i % 2 === 0 ? "md:pr-12" : "md:pl-12"
                }`}
              >
                <GlassCard hover>
                  <p className="font-mono text-xs text-accent-cyan">
                    {exp.period}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{exp.role}</h3>
                  <p className="text-sm text-accent-purple">{exp.company}</p>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {exp.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
