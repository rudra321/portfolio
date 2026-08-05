"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { typeset, word, wordStream } from "@/lib/animations";

interface SectionShellProps {
  /** Section anchor id, e.g. "about". */
  id: string;
  /** Rail line 1 — zero-padded question number, e.g. "01". */
  index: string;
  /** Rail line 2 — short slug, e.g. "about". */
  slug: string;
  /** The headline question, e.g. "Who are you?" — the trailing "?" is styled. */
  question: string;
  /** Answer-column content — rendered inside max-w-[42rem]. Omit for
   *  wide-only sections; the wrapper is then skipped entirely. */
  children?: React.ReactNode;
  /** Optional full-width content rendered below the ledger grid, spanning max-w-6xl. */
  wide?: React.ReactNode;
}

/**
 * The section caret: blinks three cycles as the question finishes streaming,
 * then settles at 35%. Reduced motion renders it static at 35% (see below).
 */
const caret: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [1, 0, 1, 0, 1, 0, 0.35],
    transition: {
      duration: 1.6,
      times: [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1],
      ease: "linear",
    },
  },
};

export function SectionShell({
  id,
  index,
  slug,
  question,
  children,
  wide,
}: SectionShellProps) {
  const reducedMotion = useReducedMotion();

  // Split the trailing "?" off so it can carry the serif-italic flourish, and
  // keep the plain question for the accessible name.
  const plain = question.trim();
  const hasMark = plain.endsWith("?");
  const words = (hasMark ? plain.slice(0, -1).trimEnd() : plain).split(/\s+/);

  return (
    <section
      id={id}
      className="relative border-t border-hairline px-6 py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-x-10">
          {/* Left rail — sticky marginalia on desktop, one inline row on mobile. */}
          <div className="self-start lg:sticky lg:top-28 lg:border-r lg:border-hairline lg:pr-6">
            <motion.div
              variants={typeset}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="mb-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 lg:hidden">
                <span className="font-mono text-xs font-medium text-accent">
                  Q.{index}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
                  {slug}
                </span>
                <span className="font-mono text-[11px] tracking-[0.02em] text-text-secondary">
                  source: human
                </span>
              </div>

              <div className="hidden lg:block">
                <p className="font-mono text-xs font-medium text-accent">
                  Q.{index}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary">
                  {slug}
                </p>
                <p className="mt-2 font-mono text-[11px] tracking-[0.02em] text-text-secondary">
                  source: human
                </p>
              </div>
            </motion.div>
          </div>

          {/* Answer column — 42rem matches the chat's max-w-2xl transcript column. */}
          <div>
            {reducedMotion ? (
              // No token stream, no blink: one static text node, caret at rest.
              <h2
                aria-label={plain}
                className="font-sans text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground"
              >
                {words.join(" ")}
                {hasMark ? (
                  <span className="font-serif font-normal italic text-accent">
                    ?
                  </span>
                ) : null}
                <span
                  aria-hidden
                  className="ml-[0.28em] inline-block h-[1em] w-[2px] translate-y-[0.08em] bg-accent opacity-[0.35]"
                />
              </h2>
            ) : (
              <motion.h2
                aria-label={plain}
                className="font-sans text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-foreground"
                variants={wordStream}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
              >
                {words.map((w, i) => (
                  <motion.span
                    key={`${w}-${i}`}
                    variants={word}
                    className="inline-block whitespace-pre"
                  >
                    {w}
                    {i < words.length - 1 ? " " : null}
                    {i === words.length - 1 && hasMark ? (
                      <span className="font-serif font-normal italic text-accent">
                        ?
                      </span>
                    ) : null}
                  </motion.span>
                ))}
                <motion.span
                  aria-hidden
                  variants={caret}
                  className="ml-[0.28em] inline-block h-[1em] w-[2px] translate-y-[0.08em] bg-accent"
                />
              </motion.h2>
            )}

            {children != null ? (
              <div className="mt-8 max-w-[42rem]">{children}</div>
            ) : null}
          </div>
        </div>

        {wide ? <div className="mt-12">{wide}</div> : null}
      </div>
    </section>
  );
}
