"use client";

import { useMotionValue, type MotionValue } from "framer-motion";
import { useEffect } from "react";

export function useMousePosition(): { x: MotionValue<number>; y: MotionValue<number> } {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return { x, y };
}
