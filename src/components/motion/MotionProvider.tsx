"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

/**
 * Components use the slim `m.*` elements; this provider adds only the features
 * the site uses (animations, variants, exit, hover/tap and in-view). Layout and
 * drag animations are not included, which keeps the client bundle smaller.
 * `strict` makes a stray `motion.*` import fail loudly instead of silently
 * pulling the full bundle back in.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
