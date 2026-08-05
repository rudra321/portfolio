"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface CopyEmailProps {
  email: string;
  className?: string;
}

export function CopyEmail({ email, className }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Clipboard API can reject (insecure origin, denied permission). Fall back
      // to selecting the text so the user can copy manually rather than failing
      // silently.
      window.prompt("Copy email:", email);
      return;
    }
    setCopied(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy email ${email} to clipboard`}
      className={cn(
        "group flex flex-wrap items-baseline gap-x-4 gap-y-1 text-left",
        className
      )}
    >
      <span className="font-mono text-[clamp(1.25rem,3.5vw,1.875rem)] text-foreground transition-colors group-hover:text-accent">
        {email}
      </span>
      <span aria-hidden className="font-mono text-[11px] text-accent">
        {copied ? "[copied ✓]" : "[copy]"}
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
