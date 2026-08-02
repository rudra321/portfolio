"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PERSONAL } from "@/data/personal";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { fadeInUp } from "@/lib/animations";

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-32 md:py-44">
      <span
        aria-hidden
        className="ghost-numeral pointer-events-none absolute -top-2 right-2 select-none text-[clamp(180px,28vw,360px)] md:right-10 md:top-6"
      >
        05
      </span>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl italic leading-tight text-foreground md:text-4xl">
              Say <span className="text-accent">hello</span>.
            </h2>
            <p className="mt-8 max-w-md text-[20px] leading-[1.6] text-text-secondary">
              Email is the best way to reach me. I read everything
              and usually reply within a day. Hiring, collaboration,
              or a stray question about compiling C++ to WebAssembly:
              all welcome.
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-text-secondary/50">
              Available from early 2026
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col justify-center gap-4"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <CopyEmail email={PERSONAL.email} />

            <div className="flex flex-col">
              <a
                href={PERSONAL.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-b border-card-border py-4 text-text-secondary transition-colors hover:text-accent"
              >
                <span className="font-serif text-lg italic">GitHub</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href={PERSONAL.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-b border-card-border py-4 text-text-secondary transition-colors hover:text-accent"
              >
                <span className="font-serif text-lg italic">LinkedIn</span>
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <a
                href={PERSONAL.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between border-b border-card-border py-4 text-text-secondary transition-colors hover:text-accent"
              >
                <span className="font-serif text-lg italic">Resume</span>
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
