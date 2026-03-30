"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientBlobProps {
  color?: "cyan" | "purple" | "blue";
  size?: string;
  className?: string;
  animate?: boolean;
}

const colorMap = {
  cyan: "bg-cyan-500/20",
  purple: "bg-purple-500/20",
  blue: "bg-blue-500/15",
};

export function GradientBlob({
  color = "cyan",
  size = "500px",
  className,
  animate = true,
}: GradientBlobProps) {
  if (!animate) {
    return (
      <div
        className={cn(
          "pointer-events-none absolute rounded-full blur-[120px]",
          colorMap[color],
          className
        )}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute rounded-full blur-[120px]",
        colorMap[color],
        className
      )}
      style={{ width: size, height: size }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -25, 15, 0],
        scale: [1, 1.05, 0.95, 1],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
