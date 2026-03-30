"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PERSONAL } from "@/data/personal";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { fadeInUp } from "@/lib/animations";

export function Contact() {
  return (
    <section id="contact" className="relative px-6 py-24 md:py-40">
      <div className="mx-auto max-w-6xl">
        {/* Section label */}
        <motion.div
          className="mb-16 flex items-center gap-4"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="font-mono text-sm text-accent-cyan">05</span>
          <span className="h-px w-12 bg-white/20" />
          <span className="font-mono text-sm uppercase tracking-widest text-text-secondary">
            Contact
          </span>
        </motion.div>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left — message */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Got something
              <br />
              <span className="text-text-secondary/40">in mind?</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-text-secondary/70">
              I&apos;m always interested in hearing about new projects and opportunities.
              Drop me a line or find me on the usual platforms.
            </p>
          </motion.div>

          {/* Right — links */}
          <motion.div
            className="flex flex-col justify-center gap-6"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <CopyEmail email={PERSONAL.email} />

            <div className="flex flex-col gap-3">
              <a
                href={PERSONAL.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-b border-white/[0.06] py-3 text-text-secondary transition-colors hover:text-foreground"
              >
                <span className="text-sm">GitHub</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href={PERSONAL.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-b border-white/[0.06] py-3 text-text-secondary transition-colors hover:text-foreground"
              >
                <span className="text-sm">LinkedIn</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href={PERSONAL.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-b border-white/[0.06] py-3 text-text-secondary transition-colors hover:text-foreground"
              >
                <span className="text-sm">Resume</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
