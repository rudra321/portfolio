"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl",
        hover &&
          "transition-all duration-300 hover:border-accent-cyan/30 hover:bg-white/[0.06] hover:shadow-[0_0_30px_rgba(34,211,238,0.05)]",
        className
      )}
    >
      {children}
    </div>
  );
}
