"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { advantages } from "@/content/home";
import { photos } from "@/content/media";
import { SectionHeader } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

const icons = [
  // One team: four squares forming one
  <svg key="a" viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><rect x="6" y="6" width="16" height="16" /><rect x="26" y="6" width="16" height="16" /><rect x="6" y="26" width="16" height="16" /><rect x="26" y="26" width="16" height="16" fill="currentColor" /></svg>,
  // Design + engineering: brackets with a stroke through
  <svg key="b" viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M14 14 6 24l8 10M34 14l8 10-8 10" /><path d="M28 10 20 38" /></svg>,
  // Markets: globe
  <svg key="c" viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><circle cx="24" cy="24" r="17" /><path d="M7 24h34M24 7c6 6 6 28 0 34M24 7c-6 6-6 28 0 34" /></svg>,
  // Support: shield with tick
  <svg key="d" viewBox="0 0 48 48" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden><path d="M24 6 39 12v11c0 9-6 16-15 19-9-3-15-10-15-19V12z" /><path d="m17 24 5 5 9-10" /></svg>,
];

/** Bento of the four advantages: colour, photo and shape, with depth on scroll. No pinning. */
export function WhyUs() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const d = reduce ? 0 : 1;
  const yA = useTransform(scrollYProgress, [0, 1], [30 * d, -30 * d]);
  const yB = useTransform(scrollYProgress, [0, 1], [60 * d, -60 * d]);
  const spin = useTransform(scrollYProgress, [0, 1], [0, 120 * d]);

  const tiles = [
    { className: "bg-[linear-gradient(140deg,#f86a08,#c94a05)] text-ink lg:col-span-7 lg:row-span-2", text: "text-ink/80", y: yA, big: true },
    { className: "bg-graphite text-paper lg:col-span-5", text: "text-paper/70", y: yB },
    { className: "isolate overflow-hidden bg-graphite text-paper lg:col-span-5", text: "text-paper/80", y: yB, photo: true },
    { className: "bg-[linear-gradient(140deg,#fbf5ee,#f2e6d9)] text-ink lg:col-span-12", text: "text-ink/75", y: yA, wide: true },
  ];

  return (
    <section ref={ref} id="why" aria-labelledby="why-title" className="relative overflow-hidden">
      <motion.div
        aria-hidden
        style={{ rotate: spin }}
        className="pointer-events-none absolute -right-40 top-20 -z-10 h-[32rem] w-[32rem] rounded-full border border-dashed border-accent/30"
      />
      <div className="container-x section-y">
        <SectionHeader eyebrow="Why QuadTricks" titleId="why-title" title="Four reasons to work with us." lead="No invented numbers, no borrowed logos. Just the way we work." />
        <div className="mt-12 grid gap-4 sm:gap-5 lg:mt-16 lg:grid-cols-12">
          {advantages.map((a, i) => {
            const t = tiles[i];
            return (
              <Reveal key={a.index} delay={i * 0.08} className={cn("chamfer relative", t.className)}>
                {t.photo && (
                  <>
                    <motion.div style={{ y: t.y, scale: 1.25 }} className="absolute inset-0 -z-10">
                      <Image src={photos.abstractCurves.src} alt="" fill sizes="(min-width:1024px) 40vw, 100vw" quality={60} className="object-cover" />
                    </motion.div>
                    <div className="absolute inset-0 -z-10 bg-[linear-gradient(160deg,rgba(10,10,10,0.25),rgba(10,10,10,0.9))]" />
                  </>
                )}
                <motion.div
                  style={{ y: t.photo ? 0 : t.y }}
                  className={cn("relative flex h-full flex-col gap-5 p-7 sm:p-9", t.big && "lg:min-h-[480px]", t.wide && "lg:flex-row lg:items-center lg:gap-12")}
                >
                  <div className={cn("flex items-center justify-between", t.wide && "lg:flex-col lg:items-start lg:gap-4")}>
                    <span className="opacity-90">{icons[i]}</span>
                    <span className="label opacity-70">{a.index}</span>
                  </div>
                  <h3
                    className={cn(
                      "font-display font-semibold leading-[1.05] tracking-tight",
                      t.big ? "mt-auto text-[clamp(2rem,1.4rem+2.6vw,3.75rem)]" : "text-[1.75rem]",
                      t.wide && "lg:max-w-[16ch] lg:text-[2.25rem]",
                    )}
                  >
                    {a.title}
                  </h3>
                  <p className={cn("max-w-[46ch] text-[1.0625rem]", t.text)}>{a.text}</p>
                  {t.big && (
                    <span aria-hidden className="pointer-events-none absolute right-6 top-6 h-28 w-28 opacity-25 [clip-path:polygon(0_0,0_100%,100%_100%)] bg-ink sm:h-40 sm:w-40" />
                  )}
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
