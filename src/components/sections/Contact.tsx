"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { PERSONAL } from "@/data/personal";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { SectionShell } from "@/components/layout/SectionShell";
import { ledger, typeset } from "@/lib/animations";

const LINKS = [
  { label: "github", href: PERSONAL.socials.github },
  { label: "linkedin", href: PERSONAL.socials.linkedin },
  { label: "resume", href: PERSONAL.resumeUrl },
];

export function Contact() {
  return (
    <SectionShell
      id="contact"
      index="05"
      slug="contact"
      question="How do we talk?"
    >
      <motion.div
        variants={ledger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.p
          variants={typeset}
          className="max-w-lg font-serif text-[22px] font-normal italic leading-[1.55] text-foreground/90"
        >
          Email is the best way to reach me. I read everything and usually reply
          within a day. Hiring, collaboration, or a stray question about
          compiling C++ to WebAssembly: all welcome.
        </motion.p>

        <motion.p
          variants={typeset}
          className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary"
        >
          Open to new roles
        </motion.p>

        <motion.div variants={typeset} className="mt-10">
          <CopyEmail email={PERSONAL.email} />
        </motion.div>

        <motion.div
          variants={typeset}
          className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-[0.14em]"
        >
          {LINKS.map((link, i) => (
            <Fragment key={link.label}>
              {i > 0 ? (
                <span aria-hidden className="text-accent">
                  ·
                </span>
              ) : null}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors hover:text-accent"
              >
                {link.label} <span aria-hidden>↗</span>
                <span className="sr-only">(opens in new tab)</span>
              </a>
            </Fragment>
          ))}
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}
