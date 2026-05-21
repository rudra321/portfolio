"use client";

import { motion } from "framer-motion";
import { EXPERIENCES } from "@/data/experience";
import { fadeInUp } from "@/lib/animations";

export function Experience() {
  return (
    <section id="experience" className="relative overflow-hidden px-6 py-32 md:py-44">
      <span
        aria-hidden
        className="ghost-numeral pointer-events-none absolute -top-2 left-2 select-none text-[clamp(180px,28vw,360px)] md:left-10 md:top-6"
      >
        02
      </span>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.h2
          className="mb-14 font-serif text-3xl italic text-foreground md:text-4xl"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          Where I&apos;ve worked.
        </motion.h2>

        {/* Timeline container — rail and dots aligned at x=6px from container's left */}
        <div className="relative md:pl-9">
          {/* Rail — vertical line at left:5px width:2px, so its center is at x=6 */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[5px] top-[2.25rem] bottom-[2.25rem] hidden w-[2px] bg-card-border md:block"
          />

          {EXPERIENCES.map((exp, i) => (
            <motion.div
              key={exp.company}
              className={`group relative grid py-9 md:grid-cols-[160px_1fr] md:gap-10 lg:grid-cols-[200px_1fr] ${
                i > 0 ? "border-t border-card-border/70" : ""
              }`}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {/* Dot — left:-35px from item-left (which sits at x=36 after pl-9),
                  so dot center lands at x=6, exactly on the rail center */}
              <span
                aria-hidden
                className="absolute left-[-35px] top-[2.375rem] hidden h-[10px] w-[10px] rounded-full bg-accent ring-[3px] ring-background md:block"
              />

              {/* Left column — period + location */}
              <div className="mb-3 md:mb-0">
                <p className="font-mono text-xs uppercase tracking-[0.15em] text-text-secondary/70">
                  {exp.period}
                </p>
                <p className="mt-1.5 text-xs text-text-secondary/45">
                  {exp.location}
                </p>
              </div>

              {/* Right column — role + bullets */}
              <div>
                <h3 className="text-lg leading-tight">
                  <span className="font-semibold tracking-tight text-foreground">
                    {exp.role}
                  </span>
                  <span className="text-text-secondary/40"> · </span>
                  <span className="font-serif italic text-text-secondary">
                    {exp.company}
                  </span>
                </h3>

                <ul className="mt-5 space-y-3">
                  {exp.description.map((point, j) => (
                    <li
                      key={j}
                      className="relative pl-5 text-[18px] leading-[1.6] text-text-secondary before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-text-secondary/35"
                    >
                      {point}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.12em] text-text-secondary/45">
                  {exp.technologies.join("  ·  ")}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
