"use client";

import { motion } from "framer-motion";
import { SectionShell } from "@/components/layout/SectionShell";
import { EXPERIENCES } from "@/data/experience";
import { ledger, typeset } from "@/lib/animations";

export function Experience() {
  return (
    <SectionShell
      id="experience"
      index="02"
      slug="experience"
      question="Where have I worked?"
    >
      {/* Run-log entries — no rail, no dots, no magic numbers. */}
      <motion.div
        variants={ledger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {EXPERIENCES.map((exp) => (
          <motion.article
            key={exp.company}
            className="border-t border-hairline pb-10 pt-8"
            variants={typeset}
          >
            <p className="font-mono text-[11px] tracking-[0.02em] text-text-secondary">
              {exp.period} · {exp.location}
            </p>

            <h3 className="mt-2 font-sans text-xl font-semibold text-foreground">
              {exp.role}
              <span className="font-serif font-normal italic text-accent">
                {" "}
                — {exp.company}
              </span>
            </h3>

            <ul className="mt-4 space-y-2.5">
              {exp.description.map((point, j) => (
                <li
                  key={j}
                  className="relative pl-5 text-[15px] leading-[1.75] text-text-secondary before:absolute before:left-0 before:top-[0.72em] before:h-px before:w-2.5 before:bg-accent"
                >
                  {point}
                </li>
              ))}
            </ul>

            <ul className="mt-5 flex flex-wrap gap-1.5">
              {exp.technologies.map((tech) => (
                <li
                  key={tech}
                  className="rounded-md border border-card-border px-2.5 py-1 font-mono text-[11px] text-text-secondary"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </motion.div>
    </SectionShell>
  );
}
