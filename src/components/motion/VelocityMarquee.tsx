"use client";

import type { ReactNode } from "react";
import { m, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { cn } from "@/lib/utils";

type VelocityMarqueeProps = {
  children: ReactNode;
  /** Seconds for one full loop of a single copy. Lower is faster. */
  duration?: number;
  /** Move right instead of left. */
  reverse?: boolean;
  className?: string;
  /** Copies of the content in the track (must cover ~2x the viewport). */
  copies?: number;
};

/**
 * Infinite marquee. The loop is a pure CSS animation (runs on the compositor,
 * no per-frame JavaScript). Scroll velocity adds a springy skew, computed only
 * while the page is scrolling. Static under reduced motion.
 */
export function VelocityMarquee({ children, duration = 40, reverse, className, copies = 4 }: VelocityMarqueeProps) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 40, stiffness: 300 });
  const skew = useTransform(smooth, [-2500, 0, 2500], reduce ? [0, 0, 0] : [7, 0, -7]);

  return (
    <m.div style={{ skewX: skew }} className={cn("group/marquee flex overflow-hidden whitespace-nowrap", className)}>
      <div
        className="flex shrink-0 flex-nowrap will-change-transform motion-safe:animate-[marquee-half_var(--marquee-d)_linear_infinite] group-hover/marquee:[animation-play-state:paused]"
        style={{
          ["--marquee-d" as string]: `${duration * copies}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {Array.from({ length: copies * 2 }, (_, i) => (
          <div key={i} aria-hidden={i > 0 || undefined} className="flex shrink-0 flex-nowrap">
            {children}
          </div>
        ))}
      </div>
    </m.div>
  );
}
