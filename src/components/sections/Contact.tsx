"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PERSONAL } from "@/data/personal";
import { GradientBlob } from "@/components/ui/GradientBlob";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TextReveal } from "@/components/ui/TextReveal";
import { fadeInUp } from "@/lib/animations";

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialLinks = [
  { icon: GithubIcon, href: PERSONAL.socials.github, label: "GitHub" },
  { icon: LinkedinIcon, href: PERSONAL.socials.linkedin, label: "LinkedIn" },
  { icon: XIcon, href: PERSONAL.socials.twitter, label: "Twitter" },
];

export function Contact() {
  return (
    <section id="contact" className="relative px-6 py-32">
      <GradientBlob
        color="cyan"
        size="400px"
        className="top-0 right-1/4 opacity-30"
      />
      <GradientBlob
        color="purple"
        size="350px"
        className="bottom-0 left-1/4 opacity-20"
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.p
          className="mb-4 font-mono text-sm tracking-widest text-accent-cyan"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          What&apos;s Next?
        </motion.p>

        <TextReveal
          text="Let's Work Together"
          element="h2"
          className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
        />

        <motion.p
          className="mt-6 max-w-lg text-base text-text-secondary md:text-lg"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          I&apos;m currently open to new opportunities. Whether you have a project
          in mind or just want to say hello, my inbox is always open.
        </motion.p>

        <motion.div
          className="mt-10"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <CopyEmail email={PERSONAL.email} />
        </motion.div>

        <motion.div
          className="mt-8 flex items-center gap-6"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {socialLinks.map((social) => (
            <MagneticButton key={social.label} strength={0.25}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-text-secondary transition-all hover:border-accent-cyan/30 hover:text-foreground"
                aria-label={social.label}
              >
                <social.icon size={18} />
                <span className="font-mono text-xs">{social.label}</span>
                <ArrowUpRight
                  size={14}
                  className="opacity-0 transition-all group-hover:opacity-100"
                />
              </a>
            </MagneticButton>
          ))}
        </motion.div>

        {/* Resume button */}
        <motion.div
          className="mt-8"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <MagneticButton strength={0.2}>
            <a
              href={PERSONAL.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-accent-cyan bg-accent-cyan/10 px-8 py-3 font-mono text-sm text-accent-cyan transition-all hover:bg-accent-cyan/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
            >
              Download Resume
              <ArrowUpRight size={16} />
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
