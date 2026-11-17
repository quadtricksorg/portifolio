"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { intro } from "@/content/home";
import { site } from "@/content/site";
import { Label } from "@/components/ui/Label";
import { DisciplineOrbit } from "@/components/brand/DisciplineOrbit";

function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  // Starts at 0.62 so every word keeps AA contrast while it lights up.
  const opacity = useTransform(progress, [start, start + 1 / total], [0.62, 1]);
  return (
    <m.span style={{ opacity }} className="inline">
      {word}{" "}
    </m.span>
  );
}

/** Studio statement: words light up as you scroll beside a glass emblem panel. */
export function Studio() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const words = intro.statement.split(" ");

  return (
    <section ref={ref} id="studio" aria-label="About the studio" className="relative">
      <div className="container-x grid items-center gap-12 pt-8 pb-20 sm:pt-10 sm:pb-24 lg:grid-cols-12 lg:gap-16 lg:pt-12 lg:pb-32">
        <div className="lg:col-span-7">
          <Label index="00">The studio</Label>
          <p className="mt-6 font-display text-[clamp(1.5rem,1.1rem+2vw,2.75rem)] font-semibold leading-[1.2] tracking-tight text-fg">
            {reduce ? intro.statement : words.map((w, i) => <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} />)}
          </p>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 sm:gap-4">
            {[
              ["4", "Founders, four disciplines"],
              ["6", "Services under one roof"],
              ["1 yr", "Support included"],
            ].map(([n, l]) => (
              <div key={l} className="glass rounded-2xl p-4">
                <p className="font-display text-[1.6rem] font-bold leading-none text-accent-text sm:text-[2.25rem]">{n}</p>
                <p className="mt-2 text-[0.8125rem] leading-snug text-fg-muted">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="glass relative overflow-hidden rounded-[2rem]">
            <DisciplineOrbit className="w-full" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="label text-fg-subtle">Based in {site.contact.locations[0].city}</p>
              <p className="mt-2 font-display text-[1.0625rem] font-semibold leading-snug text-fg sm:text-[1.125rem]">Building for India, the UAE, the GCC and beyond.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
