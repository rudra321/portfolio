"use client";

import { motion } from "framer-motion";
import { MapPin, GraduationCap, Briefcase, Sparkles } from "lucide-react";
import { PERSONAL } from "@/data/personal";
import { ALL_SKILLS } from "@/data/skills";
import { GlassCard } from "@/components/ui/GlassCard";
import { Marquee } from "@/components/ui/Marquee";
import { TextReveal } from "@/components/ui/TextReveal";
import { StaggerContainer } from "@/components/ui/StaggerContainer";
import { fadeInUp } from "@/lib/animations";

export function About() {
  return (
    <section id="about" className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <TextReveal
          text="About Me"
          element="h2"
          className="mb-16 text-3xl font-bold tracking-tight md:text-4xl"
        />

        <StaggerContainer className="grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* Bio - spans 2 cols */}
          <motion.div variants={fadeInUp} className="md:col-span-2 lg:col-span-2">
            <GlassCard className="h-full" hover>
              <p className="text-base leading-relaxed text-text-secondary md:text-lg">
                {PERSONAL.bio}
              </p>
            </GlassCard>
          </motion.div>

          {/* Location */}
          <motion.div variants={fadeInUp}>
            <GlassCard className="flex h-full flex-col items-start justify-between" hover>
              <MapPin size={24} className="text-accent-cyan" />
              <div className="mt-4">
                <p className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                  Location
                </p>
                <p className="mt-1 text-lg font-semibold">{PERSONAL.location}</p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Status */}
          <motion.div variants={fadeInUp}>
            <GlassCard className="flex h-full flex-col items-start justify-between" hover>
              <Sparkles size={24} className="text-accent-purple" />
              <div className="mt-4">
                <p className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                  Status
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                  </span>
                  <p className="text-sm font-medium">{PERSONAL.status}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Tech Stack Marquee - spans full width */}
          <motion.div
            variants={fadeInUp}
            className="md:col-span-3 lg:col-span-4"
          >
            <GlassCard className="overflow-hidden py-5" hover>
              <p className="mb-3 px-6 font-mono text-xs uppercase tracking-wider text-text-secondary">
                Tech Stack
              </p>
              <Marquee speed={25}>
                {ALL_SKILLS.map((skill) => (
                  <span
                    key={skill}
                    className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 font-mono text-sm text-text-secondary"
                  >
                    {skill}
                  </span>
                ))}
              </Marquee>
            </GlassCard>
          </motion.div>

          {/* Education */}
          <motion.div variants={fadeInUp} className="md:col-span-2">
            <GlassCard className="flex h-full flex-col items-start justify-between" hover>
              <GraduationCap size={24} className="text-accent-cyan" />
              <div className="mt-4">
                <p className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                  Education
                </p>
                <p className="mt-1 text-lg font-semibold">{PERSONAL.degree}</p>
                <p className="text-sm text-text-secondary">
                  {PERSONAL.university} &middot; {PERSONAL.gradYear}
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* Experience CTA */}
          <motion.div variants={fadeInUp} className="md:col-span-1 lg:col-span-2">
            <GlassCard className="flex h-full flex-col items-start justify-between" hover>
              <Briefcase size={24} className="text-accent-purple" />
              <div className="mt-4">
                <p className="font-mono text-xs uppercase tracking-wider text-text-secondary">
                  Experience
                </p>
                <p className="mt-1 text-lg font-semibold">3+ Years</p>
                <p className="text-sm text-text-secondary">
                  Building web applications
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </StaggerContainer>
      </div>
    </section>
  );
}
