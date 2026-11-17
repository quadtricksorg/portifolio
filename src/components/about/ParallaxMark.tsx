"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/** Four offset planes of the mark that separate as the section scrolls past. */
export function ParallaxMark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const d = reduce ? 0 : 1;
  const l1 = useTransform(scrollYProgress, [0, 1], [-30 * d, 30 * d]);
  const l2 = useTransform(scrollYProgress, [0, 1], [-14 * d, 14 * d]);
  const l3 = useTransform(scrollYProgress, [0, 1], [14 * d, -14 * d]);
  const tri = useTransform(scrollYProgress, [0, 1], [40 * d, -40 * d]);
  const rot = useTransform(scrollYProgress, [0, 1], [-4 * d, 4 * d]);

  const path = "M66 0H88V62H66V34L28 66V80H62L78 96H18L0 76V52Z";

  return (
    <div ref={ref} className="chamfer relative mx-auto aspect-square w-full max-w-[460px] overflow-hidden border border-border bg-surface-1">
      <div aria-hidden className="grid-lines absolute inset-0 [background-size:25%_100%]" />
      <motion.svg viewBox="-10 -10 130 120" className="absolute inset-[12%] h-[76%] w-[76%]" style={{ rotate: rot }} aria-hidden>
        <motion.path d={path} fill="none" stroke="var(--fg)" strokeOpacity={0.15} strokeWidth={0.6} style={{ x: l1, y: l1 }} />
        <motion.path d={path} fill="none" stroke="var(--fg)" strokeOpacity={0.3} strokeWidth={0.6} style={{ x: l2, y: l2 }} />
        <motion.path d={path} fill="none" stroke="var(--fg)" strokeOpacity={0.5} strokeWidth={0.6} style={{ x: l3, y: l3 }} />
        <path d={path} fill="var(--fg)" />
        <motion.path d="M92 80V96H108Z" fill="var(--accent)" style={{ x: tri, y: tri }} />
      </motion.svg>
      <span className="label absolute bottom-4 left-4 text-fg-subtle">4 founders · 1 studio</span>
    </div>
  );
}
