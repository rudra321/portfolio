"use client";

import { motion } from "framer-motion";
import { PERSONAL } from "@/data/personal";
import { GradientBlob } from "@/components/ui/GradientBlob";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-24 md:justify-center md:pb-0"
    >
      <GradientBlob
        color="purple"
        size="500px"
        className="-top-60 right-[-10%] opacity-40"
      />
      <GradientBlob
        color="cyan"
        size="350px"
        className="bottom-[10%] left-[-5%] opacity-25"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Role tag */}
        <motion.div
          className="mb-6 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="h-px w-8 bg-accent-cyan" />
          <span className="font-mono text-sm tracking-wider text-accent-cyan">
            {PERSONAL.title}
          </span>
        </motion.div>

        {/* Name — big, left-aligned, broken across lines */}
        <div className="overflow-hidden">
          <motion.h1
            className="text-[12vw] font-bold leading-[0.9] tracking-tighter text-foreground sm:text-[10vw] md:text-[8vw] lg:text-[6.5vw]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Rudra Pratap
          </motion.h1>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            className="text-[12vw] font-bold leading-[0.9] tracking-tighter text-foreground/20 sm:text-[10vw] md:text-[8vw] lg:text-[6.5vw]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            Singh Chouhan
          </motion.h1>
        </div>

        {/* Tagline — offset to the right */}
        <motion.p
          className="mt-8 max-w-md text-base leading-relaxed text-text-secondary md:ml-auto md:mr-0 md:text-right md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          Building products that scale — healthcare platforms,
          real-time systems, and AI-powered workflows.
          Currently at <span className="text-foreground">Raaz</span>.
        </motion.p>

        {/* Minimal info row */}
        <motion.div
          className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs tracking-wider text-text-secondary/60 md:mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <span>BITS Pilani &apos;23</span>
          <span className="hidden h-px w-4 bg-white/20 sm:block" />
          <span>Bangalore, India</span>
          <span className="hidden h-px w-4 bg-white/20 sm:block" />
          <a
            href={PERSONAL.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            github.com/rudra321
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-10">
        <ScrollIndicator />
      </div>
    </section>
  );
}
