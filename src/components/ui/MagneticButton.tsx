"use client";

import { motion } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { useCursor } from "@/components/providers/CursorProvider";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticButton({
  children,
  className,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useMagneticHover(ref, strength);
  const { setCursorType } = useCursor();

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x, y }}
      onMouseEnter={() => setCursorType("button")}
      onMouseLeave={() => setCursorType("default")}
    >
      {children}
    </motion.div>
  );
}
