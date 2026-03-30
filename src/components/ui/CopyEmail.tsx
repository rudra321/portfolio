"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyEmailProps {
  email: string;
  className?: string;
}

export function CopyEmail({ email, className }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 font-mono text-sm text-text-secondary transition-all hover:border-accent-cyan/30 hover:text-foreground",
        className
      )}
    >
      <span>{email}</span>
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Check size={16} className="text-accent-cyan" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Copy size={16} className="opacity-50 transition-opacity group-hover:opacity-100" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
