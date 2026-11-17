"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { Photo } from "@/content/media";
import { cn } from "@/lib/utils";

type HeroSlidesProps = {
  slides: Photo[];
  /** Milliseconds each slide stays on screen. */
  interval?: number;
  imgClassName?: string;
};

/**
 * Crossfading background slideshow. Slide 1 is the LCP image (eager, high
 * priority); the others are mounted only after the page is idle so they never
 * compete with first paint. Pauses off-screen, in hidden tabs and for
 * reduced-motion users.
 */
export function HeroSlides({ slides, interval = 6500, imgClassName }: HeroSlidesProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  // Mount the remaining slides once the browser is idle after load.
  useEffect(() => {
    if (reduce) return;
    let idleId: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => {
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) idleId = ric(() => setReady(true), { timeout: 3000 });
      else timer = setTimeout(() => setReady(true), 1500);
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      window.removeEventListener("load", go);
      if (idleId !== undefined) (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idleId);
      if (timer) clearTimeout(timer);
    };
  }, [reduce]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!ready || reduce || !visible) return;
    const id = setInterval(() => {
      if (document.visibilityState === "visible") setActive((i) => (i + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [ready, reduce, visible, interval, slides.length]);

  return (
    <div ref={ref} className="absolute inset-0">
      {slides.map((photo, i) => {
        if (i > 0 && !ready) return null;
        const on = i === active;
        return (
          <div
            key={photo.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1800ms] ease-in-out",
              on ? "opacity-100" : "opacity-0",
            )}
          >
            {/* Restart the slow zoom each time a slide becomes active. */}
            <div key={on ? `on-${active}` : "off"} className={cn("relative h-full w-full", on && "animate-kenburns")}>
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="100vw"
                quality={60}
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "low"}
                className={cn("object-cover", imgClassName)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
