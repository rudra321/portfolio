"use client";

import { useState } from "react";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollProgress() {
  const { scrollY, scrollYProgress } = useScroll();
  const reducedMotion = useReducedMotion();
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  // Reduced motion: track scroll exactly, with no independent settling motion.
  const scaleX = reducedMotion ? scrollYProgress : springProgress;

  // Hidden during the chat hero — a near-0% bar there reads as "you've barely
  // started." Reveal once the reader scrolls past the fold into the sections.
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => {
    const fold = typeof window !== "undefined" ? window.innerHeight * 0.9 : 800;
    setShow(v > fold);
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[100] h-px origin-left bg-accent"
      style={{ scaleX }}
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  );
}
