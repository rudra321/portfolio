"use client";

import { motion } from "framer-motion";
import { PERSONAL } from "@/data/personal";
import { GradientBlob } from "@/components/ui/GradientBlob";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";
import { TextReveal } from "@/components/ui/TextReveal";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Gradient blobs */}
      <GradientBlob
        color="cyan"
        size="600px"
        className="-top-40 -right-40 opacity-60"
      />
      <GradientBlob
        color="purple"
        size="500px"
        className="-bottom-40 -left-40 opacity-50"
      />
      <GradientBlob
        color="blue"
        size="300px"
        className="top-1/3 left-1/4 opacity-30"
      />

      <div className="relative z-10 flex max-w-5xl flex-col items-center text-center">
        {/* Greeting */}
        <motion.p
          className="mb-6 font-mono text-sm tracking-widest text-accent-cyan md:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Hi, my name is
        </motion.p>

        {/* Name */}
        <TextReveal
          text={PERSONAL.name}
          element="h1"
          className="text-[10vw] font-bold leading-[0.95] tracking-tight text-foreground md:text-[8vw] lg:text-[6vw]"
          scrollTrigger={false}
          delay={0.4}
        />

        {/* Title */}
        <motion.h2
          className="mt-4 text-xl font-medium text-text-secondary md:text-2xl lg:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          {PERSONAL.title}
        </motion.h2>

        {/* Tagline */}
        <motion.p
          className="mt-6 max-w-xl text-base text-text-secondary/80 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          {PERSONAL.tagline}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="mt-10 flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-full border border-accent-cyan bg-accent-cyan/10 px-8 py-3 font-mono text-sm text-accent-cyan transition-all hover:bg-accent-cyan/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]"
          >
            View My Work
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-full border border-white/10 px-8 py-3 font-mono text-sm text-text-secondary transition-all hover:border-white/20 hover:text-foreground"
          >
            Get In Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10">
        <ScrollIndicator />
      </div>
    </section>
  );
}
