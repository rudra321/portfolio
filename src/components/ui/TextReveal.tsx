"use client";

import { useRef, useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap-setup";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TextRevealProps {
  text: string;
  element?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  scrollTrigger?: boolean;
}

export function TextReveal({
  text,
  element: Element = "p",
  className,
  delay = 0,
  scrollTrigger = true,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const words = containerRef.current.querySelectorAll(".word-wrap .word");

    const ctx = gsap.context(() => {
      gsap.set(words, { y: "100%", opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: scrollTrigger
          ? {
              trigger: containerRef.current,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none none",
            }
          : undefined,
        delay,
      });

      tl.to(words, {
        y: "0%",
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.04,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [text, delay, scrollTrigger, reducedMotion]);

  const words = text.split(" ");

  return (
    <div ref={containerRef}>
      <Element className={cn("flex flex-wrap gap-x-[0.3em]", className)}>
        {words.map((word, i) => (
          <span key={i} className="word-wrap inline-block overflow-hidden">
            <span className="word inline-block">{word}</span>
          </span>
        ))}
      </Element>
    </div>
  );
}
