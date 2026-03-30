"use client";

import { motion } from "framer-motion";
import { SKILLS, ALL_SKILLS } from "@/data/skills";
import { GlassCard } from "@/components/ui/GlassCard";
import { Marquee } from "@/components/ui/Marquee";
import { TextReveal } from "@/components/ui/TextReveal";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { fadeInUp } from "@/lib/animations";

export function Skills() {
  const half = Math.ceil(ALL_SKILLS.length / 2);
  const row1 = ALL_SKILLS.slice(0, half);
  const row2 = ALL_SKILLS.slice(half);

  return (
    <section id="skills" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <TextReveal
          text="Skills & Technologies"
          element="h2"
          className="mb-16 text-3xl font-bold tracking-tight md:text-4xl"
        />

        {/* Marquee rows */}
        <div className="mb-16 space-y-4">
          <Marquee speed={35} direction="left">
            {row1.map((skill) => (
              <span
                key={skill}
                className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 font-mono text-sm text-text-secondary transition-colors hover:border-accent-cyan/30 hover:text-foreground"
              >
                {skill}
              </span>
            ))}
          </Marquee>
          <Marquee speed={35} direction="right">
            {row2.map((skill) => (
              <span
                key={skill}
                className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 font-mono text-sm text-text-secondary transition-colors hover:border-accent-purple/30 hover:text-foreground"
              >
                {skill}
              </span>
            ))}
          </Marquee>
        </div>

        {/* Category grid */}
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.map((category) => (
            <motion.div key={category.category} variants={fadeInUp}>
              <GlassCard hover className="h-full">
                <h3 className="mb-4 font-mono text-sm font-semibold uppercase tracking-wider text-accent-cyan">
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-sm text-text-secondary"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
