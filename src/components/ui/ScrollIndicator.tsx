"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  return (
    <motion.a
      href="#browse"
      className="flex flex-col items-center gap-2 text-text-secondary transition-colors hover:text-accent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <span className="font-mono text-[11px] uppercase tracking-widest">
        Browse the full portfolio
      </span>
      <motion.span
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown size={18} />
      </motion.span>
    </motion.a>
  );
}
