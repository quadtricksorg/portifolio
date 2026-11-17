"use client";

import { useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { advantages } from "@/content/home";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const icons = [
  // One team: four squares forming one
  <svg key="a" viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="6" y="6" width="16" height="16" rx="3" /><rect x="26" y="6" width="16" height="16" rx="3" /><rect x="6" y="26" width="16" height="16" rx="3" /><rect x="26" y="26" width="16" height="16" rx="3" fill="currentColor" /></svg>,
  // Design + engineering: brackets with a stroke through
  <svg key="b" viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M14 14 6 24l8 10M34 14l8 10-8 10" /><path d="M28 10 20 38" /></svg>,
  // Markets: globe
  <svg key="c" viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="24" cy="24" r="17" /><path d="M7 24h34M24 7c6 6 6 28 0 34M24 7c-6 6-6 28 0 34" /></svg>,
  // Support: shield with tick
  <svg key="d" viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M24 6 39 12v11c0 9-6 16-15 19-9-3-15-10-15-19V12z" /><path d="m17 24 5 5 9-10" /></svg>,
];

/** Bento of the four advantages: glass, gradients and shapes. No pinning, no photos. */
export function WhyUs() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const d = reduce ? 0 : 1;
  const yA = useTransform(scrollYProgress, [0, 1], [30 * d, -30 * d]);
  const yB = useTransform(scrollYProgress, [0, 1], [60 * d, -60 * d]);
  const spin = useTransform(scrollYProgress, [0, 1], [0, 140 * d]);

  const tiles = [
    { className: "bg-[linear-gradient(150deg,#e0301d,#b32616_60%,#7a1508)] text-white shadow-[0_30px_80px_-30px_var(--primary)] lg:col-span-7 lg:row-span-2", text: "text-white", y: yA, big: true },
    { className: "glass text-fg lg:col-span-5", text: "text-fg-muted", y: yB, tint: "bg-[radial-gradient(120%_100%_at_100%_0%,var(--glow-cool),transparent_60%)]" },
    { className: "glass overflow-hidden text-fg lg:col-span-5", text: "text-fg-muted", y: yB, rings: true },
    { className: "glass text-fg lg:col-span-12", text: "text-fg-muted", y: yA, wide: true, tint: "bg-[radial-gradient(80%_120%_at_0%_100%,var(--glow),transparent_60%)]" },
  ];

  return (
    <section ref={ref} id="why" aria-labelledby="why-title" className="relative overflow-hidden">
      <m.div aria-hidden style={{ rotate: spin }} className="pointer-events-none absolute -right-40 top-20 -z-10 h-[32rem] w-[32rem] rounded-full border border-dashed border-primary/30" />
      <div className="container-x section-y">
        <SectionHeader eyebrow="Why QuadTricks" index="04" titleId="why-title" title="Senior minds. Startup speed." lead="Four reasons to work with us. No invented numbers, no borrowed logos." />
        <div className="mt-12 grid gap-4 sm:gap-5 lg:mt-16 lg:grid-cols-12">
          {advantages.map((a, i) => {
            const t = tiles[i];
            return (
              <Reveal key={a.index} delay={i * 0.08} className={cn("relative isolate rounded-[1.75rem]", t.className)}>
                {t.tint && <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 rounded-[1.75rem]", t.tint)} />}
                {t.rings && (
                  <m.div aria-hidden style={{ rotate: spin }} className="pointer-events-none absolute -right-16 -top-16 -z-10 h-64 w-64">
                    <svg viewBox="0 0 200 200" className="h-full w-full">
                      <ellipse cx="100" cy="100" rx="96" ry="40" fill="none" stroke="var(--primary)" strokeOpacity="0.55" />
                      <ellipse cx="100" cy="100" rx="70" ry="70" fill="none" stroke="var(--lavender)" strokeOpacity="0.45" strokeDasharray="3 5" />
                      <circle cx="196" cy="100" r="3" fill="var(--primary)" />
                    </svg>
                  </m.div>
                )}
                <m.div
                  style={{ y: t.y }}
                  className={cn("relative flex h-full flex-col gap-5 p-7 sm:p-9", t.big && "lg:min-h-[460px]", t.wide && "lg:flex-row lg:items-center lg:gap-12")}
                >
                  <div className={cn("flex items-center justify-between", t.wide && "lg:flex-col lg:items-start lg:gap-4")}>
                    <span className={cn("opacity-90", !t.big && "text-accent-text")}>{icons[i]}</span>
                    <span className="label opacity-70">[{a.index}]</span>
                  </div>
                  <h3
                    className={cn(
                      "font-display font-bold leading-[1.1] tracking-tight",
                      t.big ? "mt-auto text-[clamp(1.75rem,1.2rem+2.4vw,3.25rem)]" : "text-[1.375rem]",
                      t.wide && "lg:max-w-[18ch] lg:text-[1.75rem]",
                    )}
                  >
                    {a.title}
                  </h3>
                  <p className={cn("max-w-[46ch] text-[1.0625rem]", t.text)}>{a.text}</p>
                  {t.big && (
                    <span aria-hidden className="pointer-events-none absolute right-6 top-6 h-28 w-28 bg-white opacity-20 [clip-path:polygon(0_0,0_100%,100%_100%)] sm:h-40 sm:w-40" />
                  )}
                </m.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
