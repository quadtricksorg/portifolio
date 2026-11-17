"use client";

import { motion, useReducedMotion } from "framer-motion";

type TextRevealProps = {
  text: string;
  className?: string;
  /** Seconds before the first word. */
  delay?: number;
  /**
   * Above the fold: animate with CSS from first paint (no JS wait, good for LCP).
   * Otherwise the words reveal when scrolled into view.
   */
  immediate?: boolean;
};

const STAGGER = 0.045;

/**
 * Masked word-by-word headline reveal. The full string stays readable to
 * screen readers; the animated words are hidden from assistive tech.
 */
export function TextReveal({ text, className, delay = 0, immediate }: TextRevealProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  if (immediate) {
    // CSS-only; the global reduced-motion rule makes it instant.
    return (
      <span className={className}>
        <span className="sr-only">{text}</span>
        <span aria-hidden>
          {words.map((w, i) => (
            <span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
              <span className="animate-word-up inline-block" style={{ animationDelay: `${delay + i * STAGGER}s` }}>
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            </span>
          ))}
        </span>
      </span>
    );
  }

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: STAGGER, delayChildren: delay } } }}
      >
        {words.map((w, i) => (
          <span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: "105%" }, show: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
            >
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </span>
  );
}
