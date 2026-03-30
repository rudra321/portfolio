"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      {[0, 1].map((i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 items-center gap-8",
            direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          style={{
            animationDuration: `${speed}s`,
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
