"use client";

import { useState } from "react";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";

export function ScrollProgress() {
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Hidden during the chat hero — a near-0% bar there reads as "you've barely
  // started." Reveal once the reader scrolls past the fold into the sections.
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => {
    const fold = typeof window !== "undefined" ? window.innerHeight * 0.9 : 800;
    setShow(v > fold);
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[1.5px] origin-left bg-accent/70"
      style={{ scaleX }}
      initial={{ opacity: 0 }}
      animate={{ opacity: show ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  );
}
