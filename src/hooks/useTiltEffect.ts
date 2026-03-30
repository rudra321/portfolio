"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useEffect, type RefObject } from "react";

const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };

export function useTiltEffect(ref: RefObject<HTMLElement | null>, maxTilt = 10) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);

  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      rotateX.set(-percentY * maxTilt);
      rotateY.set(percentX * maxTilt);
      spotlightX.set(((e.clientX - rect.left) / rect.width) * 100);
      spotlightY.set(((e.clientY - rect.top) / rect.height) * 100);
    };

    const handleMouseLeave = () => {
      rotateX.set(0);
      rotateY.set(0);
      spotlightX.set(50);
      spotlightY.set(50);
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [ref, maxTilt, rotateX, rotateY, spotlightX, spotlightY]);

  return { rotateX: smoothRotateX, rotateY: smoothRotateY, spotlightX, spotlightY };
}
