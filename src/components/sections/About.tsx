"use client";

import { motion } from "framer-motion";
import { PERSONAL } from "@/data/personal";
import { ALL_SKILLS } from "@/data/skills";
import { Marquee } from "@/components/ui/Marquee";
import { fadeInUp } from "@/lib/animations";

export function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:py-40">
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <motion.div
          className="mb-16 flex items-center gap-4"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="font-mono text-sm text-accent-cyan">01</span>
          <span className="h-px w-12 bg-white/20" />
          <span className="font-mono text-sm uppercase tracking-widest text-text-secondary">
            About
          </span>
        </motion.div>

        {/* Two-column layout: text left, bento right */}
        <div className="grid gap-16 lg:grid-cols-5">
          {/* Left — big text */}
          <motion.div
            className="lg:col-span-3"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-2xl font-medium leading-snug tracking-tight text-foreground md:text-3xl lg:text-4xl">
              I build things end-to-end.
              <span className="text-text-secondary">
                {" "}From React Native apps to serverless backends
                to AI engines that replace manual workflows.
              </span>
            </p>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-text-secondary/80">
              CS grad from BITS Pilani, currently a Product Engineer at Raaz
              where I lead the full stack for a healthcare platform
              serving 55,000+ users. Before that, I shipped browser-based ML
              at GJ-Map and fraud detection systems at SuperPe.
            </p>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary/80">
              Outside of code — I play competitive Ultimate Frisbee.
              <span className="text-accent-cyan"> Gold medalist</span> at the
              National Open Championship Series 2025 and National College
              Championship 2023.
            </p>
          </motion.div>

          {/* Right — detail cards, intentionally different styles */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            {/* Education */}
            <motion.div
              className="rounded-xl border border-white/[0.06] p-5"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary/50">
                Education
              </p>
              <p className="mt-2 text-base font-medium">{PERSONAL.degree}</p>
              <p className="text-sm text-text-secondary">
                {PERSONAL.university}, {PERSONAL.campus}
              </p>
              <p className="text-sm text-text-secondary/60">{PERSONAL.gradYear}</p>
            </motion.div>

            {/* Location + Status — side by side */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                className="rounded-xl bg-white/[0.03] p-5"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary/50">
                  Based in
                </p>
                <p className="mt-2 text-base font-medium">{PERSONAL.location}</p>
              </motion.div>

              <motion.div
                className="rounded-xl bg-white/[0.03] p-5"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-text-secondary/50">
                  Experience
                </p>
                <p className="mt-2 text-base font-medium">3+ years</p>
              </motion.div>
            </div>

            {/* Fun fact card — personality */}
            <motion.div
              className="rounded-xl border border-accent-purple/10 bg-accent-purple/[0.03] p-5"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <p className="text-sm leading-relaxed text-text-secondary">
                &ldquo;Ship fast, fix faster&rdquo; — I care more about getting things
                into users&apos; hands than writing perfect abstractions.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Tech marquee — full bleed, no card wrapper */}
        <motion.div
          className="mt-20 -mx-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Marquee speed={25}>
            {ALL_SKILLS.map((skill) => (
              <span
                key={skill}
                className="whitespace-nowrap px-4 font-mono text-sm text-text-secondary/40"
              >
                {skill}
              </span>
            ))}
          </Marquee>
        </motion.div>
      </div>
    </section>
  );
}
