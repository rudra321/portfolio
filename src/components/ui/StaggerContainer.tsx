"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  threshold?: number;
}

export function StaggerContainer({
  children,
  className,
  delay = 0.1,
  threshold = 0.1,
}: StaggerContainerProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: delay,
            delayChildren: 0.1,
          },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
    >
      {children}
    </motion.div>
  );
}
