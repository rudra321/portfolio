"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollIndicator() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.a
      href="#browse"
      aria-label="Browse the full portfolio"
      className="flex flex-col items-center gap-3 text-text-secondary transition-colors hover:text-accent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.3em]">scroll</span>
      <span aria-hidden className="relative block h-7 w-px bg-hairline">
        {reducedMotion ? (
          <span className="absolute left-0 top-0 h-1.5 w-px bg-accent" />
        ) : (
          <motion.span
            className="absolute left-0 top-0 h-1.5 w-px bg-accent"
            animate={{ y: [0, 22] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </span>
    </motion.a>
  );
}
