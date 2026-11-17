"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Moves its child vertically against the scroll for a subtle depth effect.
 * The wrapper defines the visible box (give it a size via className); the
 * child is over-sized by `amount` on each side so edges never show.
 */
export function Parallax({ children, amount = 32, className }: { children: ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-amount, amount]);

  return (
    <div ref={ref} className={cn("overflow-hidden", !/\b(absolute|fixed|sticky)\b/.test(className ?? "") && "relative", className)}>
      <motion.div style={{ y, top: -amount, bottom: -amount }} className="absolute inset-x-0">
        {children}
      </motion.div>
    </div>
  );
}
