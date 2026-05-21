"use client";

import { motion } from "framer-motion";
import { SKILLS } from "@/data/skills";
import { fadeInUp } from "@/lib/animations";

export function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden px-6 py-32 md:py-40">
      <span
        aria-hidden
        className="ghost-numeral pointer-events-none absolute -top-2 left-2 select-none text-[clamp(180px,28vw,360px)] md:left-10 md:top-6"
      >
        04
      </span>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.h2
          className="mb-14 font-serif text-3xl italic text-foreground md:text-4xl"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          What I reach for.
        </motion.h2>

        <div className="space-y-12">
          {SKILLS.map((category) => (
            <motion.div
              key={category.category}
              className="grid items-baseline gap-6 border-b border-card-border/60 pb-10 last:border-b-0 md:grid-cols-[200px_1fr] md:gap-10"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="font-serif text-xl italic text-text-secondary">
                {category.category}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-card-border bg-card-bg px-3 py-1.5 font-mono text-xs text-text-secondary transition-colors hover:border-accent/30 hover:text-foreground"
                  >
                    {item}
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
