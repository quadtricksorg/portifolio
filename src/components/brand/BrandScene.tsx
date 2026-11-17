"use client";

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Emblem } from "@/components/brand/Emblem";
import { cn } from "@/lib/utils";

const mq = "(min-width: 1024px)";
function subscribe(cb: () => void) {
  const m = window.matchMedia(mq);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

/** Orbit rings: two tilted ellipses. They only rotate on large screens. */
export function Orbits({ className, animate = true }: { className?: string; animate?: boolean }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 flex items-center justify-center", className)}>
      <div className={cn("absolute aspect-square w-[150%] max-w-[1800px] -rotate-[14deg]", animate && "motion-safe:lg:animate-orbit")}>
        <svg viewBox="0 0 1000 1000" className="h-full w-full">
          <ellipse cx="500" cy="500" rx="490" ry="190" fill="none" stroke="var(--primary)" strokeOpacity="0.55" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <circle cx="990" cy="500" r="4" fill="var(--primary)" />
        </svg>
      </div>
      <div className={cn("absolute aspect-square w-[110%] max-w-[1400px] rotate-[8deg]", animate && "motion-safe:lg:animate-orbit-rev")}>
        <svg viewBox="0 0 1000 1000" className="h-full w-full">
          <ellipse cx="500" cy="500" rx="480" ry="150" fill="none" stroke="var(--lavender)" strokeOpacity="0.4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="20" cy="500" r="3" fill="var(--lavender)" />
        </svg>
      </div>
    </div>
  );
}

/**
 * Site-wide background scene (homepage): gradient glows, a starfield, orbit
 * rings and the 3D-style emblem, all theme-aware and image-free.
 * Performance: one fixed layer; the emblem is a single static SVG moved with
 * transforms tied to scroll; rotation/twinkle run only on large screens.
 */
export function BrandScene() {
  const reduce = useReducedMotion();
  const desktop = useSyncExternalStore(subscribe, () => window.matchMedia(mq).matches, () => true);
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });
  const still = reduce ? 0 : 1;

  // The emblem drifts between sides as the page scrolls, tilting in 3D.
  const stops = [0, 0.12, 0.3, 0.5, 0.7, 0.88, 1];
  const xs = desktop ? ["20vw", "16vw", "-26vw", "24vw", "-24vw", "18vw", "0vw"] : ["14vw", "14vw", "-18vw", "16vw", "-16vw", "12vw", "0vw"];
  const x = useTransform(p, stops, reduce ? xs.map(() => xs[0]) : xs);
  const y = useTransform(p, stops, desktop ? ["2vh", "6vh", "4vh", "8vh", "2vh", "6vh", "4vh"] : ["26vh", "10vh", "0vh", "4vh", "0vh", "4vh", "0vh"]);
  const rotate = useTransform(p, [0, 1], [0, still * -28]);
  const rotateY = useTransform(p, stops, [-18, -8, 22, -20, 18, -12, 0].map((v) => v * still));
  const rotateX = useTransform(p, [0, 0.5, 1], [8 * still, -6 * still, 4 * still]);
  const scale = useTransform(p, [0, 0.12, 1], desktop ? [1, 0.82, 0.72] : [1, 0.85, 0.8]);
  const opacity = useTransform(p, [0, 0.1, 0.18, 0.95, 1], desktop ? [1, 1, 0.42, 0.42, 0.55] : [0.4, 0.3, 0.16, 0.16, 0.24]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient glows */}
      <div className="orb-primary absolute -bottom-[25%] -left-[20%] h-[80vmax] w-[80vmax]" />
      <div className="orb-cool absolute -right-[20%] -top-[25%] h-[70vmax] w-[70vmax]" />
      {/* Stars */}
      <div className="stars absolute inset-0 opacity-70 motion-safe:lg:animate-twinkle" />
      {/* Orbit rings */}
      <Orbits className="opacity-80" />
      {/* Emblem */}
      <div className="absolute inset-0 flex items-center justify-center [perspective:1400px]">
        <motion.div
          style={{ x, y, rotate, rotateY, rotateX, scale, opacity }}
          className="w-[min(78vw,340px)] will-change-transform sm:w-[min(60vw,460px)] lg:w-[min(42vw,620px)]"
        >
          <Emblem depth={desktop ? 14 : 7} />
        </motion.div>
      </div>
    </div>
  );
}
