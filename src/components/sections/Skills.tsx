"use client";

import { motion } from "framer-motion";
import { SKILLS } from "@/data/skills";
import { fadeInUp } from "@/lib/animations";

export function Skills() {
  return (
    <section id="skills" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <motion.div
          className="mb-16 flex items-center gap-4"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="font-mono text-sm text-accent-cyan">04</span>
          <span className="h-px w-12 bg-white/20" />
          <span className="font-mono text-sm uppercase tracking-widest text-text-secondary">
            Stack
          </span>
        </motion.div>

        {/* Horizontal category rows */}
        <div className="space-y-10">
          {SKILLS.map((category) => (
            <motion.div
              key={category.category}
              className="grid items-baseline gap-4 md:grid-cols-[160px_1fr]"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="font-mono text-xs uppercase tracking-widest text-text-secondary/40">
                {category.category}
              </p>
              <div className="flex flex-wrap gap-3">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-lg border border-white/[0.06] px-4 py-2 text-sm text-text-secondary transition-colors hover:border-white/[0.15] hover:text-foreground"
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
