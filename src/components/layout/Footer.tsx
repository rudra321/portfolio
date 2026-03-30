"use client";

import { PERSONAL } from "@/data/personal";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-mono text-sm text-text-secondary">
          &copy; {new Date().getFullYear()} {PERSONAL.name}
        </p>
        <p className="font-mono text-xs text-text-secondary/50">
          Built with Next.js & Framer Motion
        </p>
      </div>
    </footer>
  );
}
