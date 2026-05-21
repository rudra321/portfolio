"use client";

import { motion, useSpring } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useCursor } from "@/components/providers/CursorProvider";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect } from "react";

export function CustomCursor() {
  const { x, y } = useMousePosition();
  const { cursorType } = useCursor();
  const isTouchDevice = useMediaQuery("(pointer: coarse)");
  const reducedMotion = useReducedMotion();

  const dotX = useSpring(x, { stiffness: 500, damping: 28 });
  const dotY = useSpring(y, { stiffness: 500, damping: 28 });
  const circleX = useSpring(x, { stiffness: 120, damping: 20 });
  const circleY = useSpring(y, { stiffness: 120, damping: 20 });

  useEffect(() => {
    if (!isTouchDevice && !reducedMotion) {
      document.documentElement.classList.add("custom-cursor");
    }
    return () => {
      document.documentElement.classList.remove("custom-cursor");
    };
  }, [isTouchDevice, reducedMotion]);

  if (isTouchDevice || reducedMotion) return null;

  const isHovering = cursorType !== "default";

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed top-0 left-0 z-[10000] pointer-events-none rounded-full bg-accent"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: isHovering ? 6 : 8,
          height: isHovering ? 6 : 8,
        }}
        transition={{ duration: 0.15 }}
      />
      {/* Circle */}
      <motion.div
        className="fixed top-0 left-0 z-[10000] pointer-events-none rounded-full border"
        style={{
          x: circleX,
          y: circleY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovering ? 56 : 40,
          height: isHovering ? 56 : 40,
          borderColor: isHovering
            ? "rgba(232, 168, 124, 0.65)"
            : "rgba(245, 239, 228, 0.3)",
          backgroundColor: isHovering
            ? "rgba(232, 168, 124, 0.10)"
            : "transparent",
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </>
  );
}
