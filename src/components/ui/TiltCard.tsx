"use client";

import { motion, useMotionTemplate } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useTiltEffect } from "@/hooks/useTiltEffect";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltDegree?: number;
}

export function TiltCard({ children, className, tiltDegree = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { rotateX, rotateY, spotlightX, spotlightY } = useTiltEffect(ref, tiltDegree);

  const spotlightBg = useMotionTemplate`radial-gradient(circle at ${spotlightX}% ${spotlightY}%, rgba(34,211,238,0.08) 0%, transparent 60%)`;

  if (reducedMotion) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl transition-colors duration-300 hover:border-accent-cyan/20",
        className
      )}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-10"
        style={{ background: spotlightBg }}
      />
      <div style={{ transform: "translateZ(0)" }}>{children}</div>
    </motion.div>
  );
}
