"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { hero } from "@/content/home";
import { ButtonLink } from "@/components/ui/Button";

const EASE = [0.16, 1, 0.3, 1] as const;

function CyclingWord() {
  const reduce = useReducedMotion();
  const last = hero.words.length - 1;
  const [i, setI] = useState(reduce ? last : 0);

  useEffect(() => {
    if (reduce || i >= last) return;
    const id = setTimeout(() => setI((v) => Math.min(v + 1, last)), i === 0 ? 1400 : 950);
    return () => clearTimeout(id);
  }, [i, last, reduce]);

  const word = hero.words[i];
  const isLast = i === last;

  return (
    <span className="relative inline-block overflow-hidden pb-[0.1em] align-bottom">
      <span aria-hidden>
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={word}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="inline-block text-accent-text"
          >
            {word}
            {isLast && <span className="text-fg">.</span>}
          </m.span>
        </AnimatePresence>
      </span>
      <span className="sr-only">{hero.words[last]}</span>
    </span>
  );
}

/**
 * Hero in the style of the sample site: large chrome headline on the left,
 * the 3D emblem (rendered by the page-wide BrandScene) on the right. On small
 * screens the emblem sits behind the copy, so a soft scrim keeps text readable.
 * Entrances are CSS so the headline paints immediately (fast LCP).
 */
export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], reduce ? [1, 1] : [1, 0]);
  const up = (delay: number) => ({ className: "animate-rise", style: { animationDelay: `${delay}s` } });

  return (
    <section ref={ref} id="top" className="relative isolate" aria-labelledby="hero-title">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(95%_42%_at_30%_56%,color-mix(in_srgb,var(--bg)_82%,transparent)_30%,transparent_80%)] lg:hidden"
      />
      <div className="container-x flex min-h-[100svh] flex-col justify-center pt-28 pb-24 sm:pt-32 lg:pt-36">
        <m.div className="max-w-[46rem]" style={{ y: copyY, opacity: copyOpacity }}>
          <div {...up(0.05)}>
            <span className="label inline-flex items-center gap-2 text-fg-muted">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
              Software · Web · Mobile · Brand · Video · Cloud
            </span>
          </div>
          <h1 id="hero-title" style={{ animationDelay: "0.1s" }} className="animate-slide-up mt-6 font-display text-display font-bold text-fg">
            <span className="text-chrome block">{hero.lead}</span>
            <CyclingWord />
          </h1>
          <p style={{ animationDelay: "0.2s" }} className="animate-slide-up mt-7 max-w-[44ch] text-lead text-fg-muted">
            {hero.sub}
          </p>
          <div {...up(0.42)} className="animate-rise mt-10 flex flex-col gap-3 xs:flex-row">
            <ButtonLink href="/#contact" size="lg" indicator>
              Start a project
            </ButtonLink>
            <ButtonLink href="/#work" size="lg" variant="secondary">
              Explore our work
            </ButtonLink>
          </div>
        </m.div>
      </div>

      {/* Scroll cue */}
      <div {...up(0.9)} className="animate-rise container-x pointer-events-none absolute bottom-8 left-0 right-0 flex items-center gap-3">
        <span aria-hidden className="relative h-10 w-px overflow-hidden bg-border-strong">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-primary motion-safe:animate-[scroll-cue_1.8s_ease-in-out_infinite]" />
        </span>
        <span className="label text-fg-subtle">Scroll to explore</span>
      </div>
    </section>
  );
}
