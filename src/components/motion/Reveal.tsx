"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Tag = "div" | "section" | "article" | "ul" | "ol" | "li";

const EASE = [0.16, 1, 0.3, 1] as const;

// Static map so components are never created during render.
// All motion HTML components share the same prop surface for our usage.
const MOTION = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
} as unknown as Record<Tag, typeof motion.div>;

type BaseProps = Omit<HTMLMotionProps<"div">, "children"> & { children: ReactNode; as?: Tag };

type RevealProps = BaseProps & {
  /** Seconds. */
  delay?: number;
  /** Pixels to rise from. */
  y?: number;
  once?: boolean;
  /** Viewport margin, e.g. "-10% 0px". */
  margin?: string;
};

/** Fade-and-rise on entering the viewport. Instant under reduced motion. */
export function Reveal({ children, delay = 0, y = 24, once = true, margin = "-10% 0px", as = "div", ...props }: RevealProps) {
  const reduce = useReducedMotion();
  const C = MOTION[as];
  return (
    <C
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: margin as `${number}px` }}
      transition={{ duration: reduce ? 0 : 0.8, delay: reduce ? 0 : delay, ease: EASE }}
      {...props}
    >
      {children}
    </C>
  );
}

type StaggerProps = BaseProps & { gap?: number; once?: boolean };

/** Parent that staggers `StaggerItem` children as they enter the viewport. */
export function Stagger({ children, gap = 0.08, once = true, as = "div", ...props }: StaggerProps) {
  const reduce = useReducedMotion();
  const C = MOTION[as];
  return (
    <C
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once, margin: "-10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : gap } } }}
      {...props}
    >
      {children}
    </C>
  );
}

export function StaggerItem({ children, y = 24, as = "div", ...props }: BaseProps & { y?: number }) {
  const reduce = useReducedMotion();
  const C = MOTION[as];
  return (
    <C
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : y },
        show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.7, ease: EASE } },
      }}
      {...props}
    >
      {children}
    </C>
  );
}
