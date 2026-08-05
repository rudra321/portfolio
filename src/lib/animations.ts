import type { Variants } from "framer-motion";

/** Identical to the ease the chat hardcodes — one motion signature site-wide. */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Legacy reveal, kept for compatibility with existing section components. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Default reveal: rails, paragraphs, rows, chips. */
export const typeset: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

/**
 * Stagger container for a section's ledger of children.
 * Pair with viewport={{ once: true, margin: "-80px" }} and keep to ~6 staggered
 * children per section — the rest should render instantly.
 */
export const ledger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

/** Token-streaming container for section questions. */
export const wordStream: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.035 },
  },
};

/** A single streamed token — opacity only, no movement. */
export const word: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.12 },
  },
};
