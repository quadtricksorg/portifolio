"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { processStages } from "@/content/process";
import { photos } from "@/content/media";
import { SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";

function Stage({ s, i, total, progress }: { s: (typeof processStages)[number]; i: number; total: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const at = (i + 0.5) / total;
  const lit = useTransform(progress, [at - 0.12, at], reduce ? [1, 1] : [0.6, 1]);
  const y = useTransform(progress, [at - 0.15, at], reduce ? [0, 0] : [24, 0]);
  return (
    <motion.li
      style={{ opacity: lit, y }}
      className="relative flex w-[78vw] max-w-[320px] shrink-0 snap-start flex-col gap-4 rounded-md border border-white/10 bg-black/35 p-6 backdrop-blur-sm sm:w-[44vw] lg:w-auto lg:max-w-none lg:border-0 lg:bg-transparent lg:p-0 lg:pt-10 lg:backdrop-blur-none"
    >
      <span aria-hidden className="absolute left-0 top-0 hidden h-3 w-3 -translate-y-1/2 rotate-45 border-2 border-accent bg-bg lg:block" />
      <span className="font-display text-[3.5rem] font-semibold leading-none text-accent">{s.index}</span>
      <h3 className="font-display text-[1.5rem] font-medium text-fg">{s.name}</h3>
      <p className="text-[0.9375rem] text-fg-muted">{s.short}</p>
      <ul className="mt-auto flex flex-col gap-1.5 pt-2">
        {s.youGet.map((g) => (
          <li key={g} className="flex items-center gap-2 text-sm text-fg-muted">
            <span aria-hidden className="tri text-[0.5rem]" />
            {g}
          </li>
        ))}
      </ul>
    </motion.li>
  );
}

export function ProcessStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const line = useTransform(scrollYProgress, [0, 1], reduce ? ["100%", "100%"] : ["0%", "100%"]);

  return (
    <section id="process" data-nav-offset="0" data-theme="dark" aria-labelledby="process-title" className="relative isolate overflow-hidden bg-bg py-20 text-fg sm:py-28 lg:py-36">
      <PhotoBackdrop photo={photos.escalator} overlay="full" parallax={100} />
      <div aria-hidden className="blob-ember animate-drift pointer-events-none absolute -left-40 bottom-0 -z-10 h-[40rem] w-[40rem] opacity-50" />
      <div className="container-x">
        <SectionHeader
          eyebrow="How we work"
          titleId="process-title"
          title="Five stages. No surprises."
          lead="From the first conversation to a year after launch, you always know what happens next."
          aside={
            <ButtonLink href="/#process" variant="secondary" indicator className="bg-white/5 backdrop-blur-sm">
              Our process
            </ButtonLink>
          }
        />
      </div>

      <div ref={ref} className="relative mt-14 lg:mt-20">
        <div aria-hidden className="container-x absolute inset-x-0 top-0 hidden lg:block">
          <div className="h-px w-full bg-white/15">
            <motion.div className="h-px bg-[linear-gradient(90deg,var(--accent),var(--amber))]" style={{ width: line }} />
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
