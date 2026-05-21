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
        color="ember"
        size="560px"
        className="-top-72 right-[-12%] opacity-40"
      />
      <GradientBlob
        color="purple"
        size="380px"
        className="bottom-[6%] left-[-8%] opacity-25"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* Currently - restrained, no bar, no pulse */}
        <motion.div
          className="mb-10 inline-flex items-baseline gap-2 font-mono text-xs text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-text-secondary/50">currently</span>
          <span className="text-foreground">{PERSONAL.title}</span>
          <span className="text-text-secondary/50">at</span>
          <span className="text-foreground">Raaz</span>
        </motion.div>

        {/* Name - big, asymmetric, second line italicized */}
        <div className="overflow-hidden pb-[0.05em]">
          <motion.h1
            className="pb-[0.2em] text-[12vw] font-bold leading-[0.92] tracking-[-0.04em] text-foreground sm:text-[10vw] md:text-[8vw] lg:text-[6.8vw]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            Rudra Pratap
          </motion.h1>
        </div>
        <div className="overflow-hidden pb-[0.05em]">
          <motion.h1
            className="pb-[0.22em] font-serif text-[12vw] font-normal italic leading-[0.92] tracking-[-0.02em] text-foreground/30 sm:text-[10vw] md:text-[8vw] lg:text-[6.8vw]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            Singh Chouhan.
          </motion.h1>
        </div>

        {/* Tagline - asymmetric right, serif emphasis on the noun */}
        <motion.p
          className="mt-10 max-w-xl text-lg leading-[1.6] text-text-secondary md:ml-auto md:mr-0 md:text-right md:text-[22px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.05 }}
        >
          I build <span className="font-serif italic text-foreground">healthcare software</span> used
          by 55,000+ patients. Mostly TypeScript and Lambda, with the
          occasional detour into WebAssembly when the math gets heavy.
        </motion.p>

        {/* Bottom row - pipe separators, no hairline dashes */}
        <motion.div
          className="mt-14 flex flex-wrap items-baseline gap-x-5 gap-y-2 font-mono text-xs tracking-wide text-text-secondary/60 md:mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.35 }}
        >
          <span>BITS Pilani &apos;23</span>
          <span className="text-text-secondary/30">/</span>
          <span>Bangalore</span>
          <span className="text-text-secondary/30">/</span>
          <a
            href={PERSONAL.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
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
