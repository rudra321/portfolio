"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientBlobProps {
  color?: "amber" | "purple" | "ember";
  size?: string;
  className?: string;
  animate?: boolean;
}

const colorMap = {
  amber: "bg-[#E8A87C]/15",
  purple: "bg-[#7C3AED]/12",
  ember: "bg-[#B85C38]/14",
};

export function GradientBlob({
  color = "amber",
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
