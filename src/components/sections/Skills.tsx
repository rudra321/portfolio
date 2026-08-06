"use client";

import { motion } from "framer-motion";
import { SectionShell } from "@/components/layout/SectionShell";
import { SKILLS } from "@/data/skills";
import { ledger, typeset } from "@/lib/animations";

export function Skills() {
  return (
    <SectionShell
      id="skills"
      index="04"
      slug="skills"
      question="What do I work with?"
      wide={
        <motion.div
          variants={ledger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {SKILLS.map((category) => (
            <motion.div
              key={category.category}
              variants={typeset}
              className="grid gap-y-3 border-t border-hairline py-5 last:border-b lg:grid-cols-[220px_1fr] lg:gap-x-10"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
                {category.category}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-card-border bg-transparent px-2.5 py-1 font-mono text-xs text-text-secondary transition-colors hover:border-accent/40 hover:text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      }
    >
      {null}
    </SectionShell>
  );
}
