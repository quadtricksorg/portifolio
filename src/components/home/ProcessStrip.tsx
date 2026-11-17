"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { processStages } from "@/content/process";
import { SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

function Stage({ s, i, total, progress }: { s: (typeof processStages)[number]; i: number; total: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const at = (i + 0.5) / total;
  // Floor of 0.85 keeps the card text at AA contrast while it is still "unlit".
  const lit = useTransform(progress, [at - 0.12, at], reduce ? [1, 1] : [0.85, 1]);
  const y = useTransform(progress, [at - 0.15, at], reduce ? [0, 0] : [24, 0]);
  return (
    <m.li
      style={{ opacity: lit, y }}
      className="glass relative flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col gap-4 rounded-[1.5rem] p-6 sm:w-[44vw] lg:w-auto lg:max-w-none lg:p-7"
    >
      <span aria-hidden className="absolute -top-[calc(2.5rem+6px)] left-7 hidden h-3 w-3 rounded-full border-2 border-primary bg-bg shadow-[0_0_10px_var(--primary)] lg:block" />
      <span className="label text-accent-text">Phase {s.index}</span>
      <h3 className="font-display text-[1.375rem] font-bold text-fg">{s.name}</h3>
      <p className="text-[0.9375rem] text-fg-muted">{s.short}</p>
      <ul className="mt-auto flex flex-col gap-1.5 pt-2">
        {s.youGet.map((g) => (
          <li key={g} className="flex items-center gap-2 text-sm text-fg-muted">
            <span aria-hidden className="tri text-[0.5rem]" />
            {g}
          </li>
        ))}
      </ul>
    </m.li>
  );
}

export function ProcessStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const line = useTransform(scrollYProgress, [0, 1], reduce ? ["100%", "100%"] : ["0%", "100%"]);

  return (
    <section id="process" aria-labelledby="process-title" className="relative isolate overflow-hidden py-20 text-fg sm:py-28 lg:py-36">
      <div aria-hidden className="orb-primary pointer-events-none absolute -left-40 bottom-0 -z-10 h-[40rem] w-[40rem]" />
      <div className="container-x">
        <SectionHeader
          eyebrow="Process"
          index="03"
          titleId="process-title"
          title="From signal to launch."
          lead="From the first conversation to a year after launch, you always know what happens next."
          aside={
            <ButtonLink href="/#contact" variant="secondary" indicator>
              Start with discovery
            </ButtonLink>
          }
        />
      </div>

      <div ref={ref} className="relative mt-14 lg:mt-20 lg:pt-10">
        <div aria-hidden className="container-x absolute inset-x-0 top-0 hidden lg:block">
          <div className="h-px w-full bg-border-strong">
            <m.div className="h-px bg-[linear-gradient(90deg,var(--accent),var(--amber))]" style={{ width: line }} />
          </div>
        </div>
        <ol
          aria-label="Process stages"
          className="container-x flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain pb-4 [touch-action:pan-x_pan-y] [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:gap-8 lg:overflow-visible lg:pb-0"
        >
          {processStages.map((s, i) => (
            <Stage key={s.index} s={s} i={i} total={processStages.length} progress={scrollYProgress} />
          ))}
        </ol>
      </div>
    </section>
  );
}
