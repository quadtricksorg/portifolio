"use client";

import Link from "next/link";
import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import type { Service } from "@/lib/schemas";
import { serviceAccents } from "@/content/media";
import { SectionHeader } from "@/components/ui/Section";
import { ServiceGraphic } from "@/components/ui/ServiceGraphic";


function StackCard({ s, i, total, progress }: { s: Service; i: number; total: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: local } = useScroll({ target: cardRef, offset: ["start end", "start start"] });
  const artScale = useTransform(local, [0, 1], reduce ? [1, 1] : [0.82, 1]);
  const artRotate = useTransform(local, [0, 1], reduce ? [0, 0] : [-8, 0]);
  // As later cards arrive, earlier cards shrink slightly and dim.
  const target = 1 - (total - i) * 0.035;
  const scale = useTransform(progress, [i / total, 1], reduce ? [1, 1] : [1, target]);
  const dim = useTransform(progress, [i / total, Math.min(1, (i + 1) / total + 0.05)], reduce ? [0, 0] : [0, i === total - 1 ? 0 : 0.4]);
  const accent = serviceAccents[s.slug];

  return (
    <div ref={cardRef} className="sticky top-0 flex h-[100svh] items-start justify-center pt-20 sm:pt-24">
      <m.article
        style={{ scale, top: `${i * 14}px`, ["--card-accent" as string]: accent.color, ["--card-soft" as string]: accent.soft }}
        className="relative grid h-[min(78svh,620px)] w-full origin-top grid-rows-[40%_1fr] overflow-hidden rounded-[1.75rem] border border-border bg-surface-1 shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.5)] md:grid-cols-2 md:grid-rows-1"
      >
        {/* Accent glow wash (theme-aware: the card itself uses surface tokens) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_100%,var(--card-soft),transparent_60%)]" />

        {/* Copy */}
        <div className="relative z-10 order-2 flex min-h-0 flex-col p-6 sm:p-10 md:order-none lg:p-12">
          <span className="label text-fg-subtle">
            <span className="text-(--card-accent)">[{s.index}]</span> / {String(total).padStart(2, "0")}
          </span>
          <h3 className="mt-4 font-display text-[clamp(1.4rem,1.1rem+1.6vw,2.4rem)] font-bold leading-[1.1] tracking-tight text-fg md:mt-auto">{s.name}</h3>
          <p className="mt-4 max-w-[40ch] text-[1.0625rem] text-fg-muted">{s.promise}</p>
          <ul className="mt-6 hidden flex-wrap gap-2 sm:flex">
            {s.deliverables.slice(0, 4).map((d) => (
              <li key={d} className="pill border border-border px-3 py-1.5 text-[0.8125rem] text-fg-muted">
                {d}
              </li>
            ))}
          </ul>
          <Link href={`/services/${s.slug}`} className="group mt-8 inline-flex w-fit items-center gap-3 font-semibold text-fg">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_24px_-8px_var(--primary)] transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
            Explore {s.shortName.toLowerCase()}
          </Link>
        </div>

        {/* Art: gradient stage with the service line drawing */}
        <div className="relative order-1 min-h-0 overflow-hidden border-b border-border md:order-none md:border-b-0 md:border-l">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_45%,var(--card-soft),transparent_70%)]" />
          <div aria-hidden className="stars absolute inset-0 opacity-50" />
          <div aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-(--card-accent) opacity-30" />
          <m.div style={{ scale: artScale, rotate: artRotate }} className="absolute inset-0 flex items-center justify-center p-8">
            <div className="w-[min(70%,320px)] text-fg [&_svg]:text-current">
              <ServiceGraphic slug={s.slug} />
            </div>
          </m.div>
          <span className="label absolute bottom-4 right-4 text-fg-subtle">{s.shortName}</span>
        </div>

        <m.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-20 bg-bg" />
      </m.article>
    </div>
  );
}

export function ServicesStack({ services }: { services: Service[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="services" aria-labelledby="services-title" className="relative">
      <div className="container-x pt-20 sm:pt-28 lg:pt-32">
        <SectionHeader
          eyebrow="Capabilities"
          index="01"
          titleId="services-title"
          title="What we build."
          lead="From your first logo to the cloud your app runs on. Pick one service or the whole set."
        />
      </div>
      <div ref={ref} className="container-x relative pb-10">
        {services.map((s, i) => (
          <StackCard key={s.slug} s={s} i={i} total={services.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
