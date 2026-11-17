"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { projects } from "@/content/projects";
import { categoryLabels } from "@/lib/schemas";
import type { Project } from "@/lib/schemas";
import { Label } from "@/components/ui/Label";
import { ButtonLink } from "@/components/ui/Button";
import { TextReveal } from "@/components/motion/TextReveal";

/** Cover art for a showcase card: websites fill the card; apps sit as phones on a tinted stage. */
function Cover({ p, sizes }: { p: Project; sizes: string }) {
  if (p.category === "mobile-apps") {
    return (
      <div className="absolute inset-0 flex items-end justify-center bg-[radial-gradient(circle_at_50%_70%,rgba(252,60,41,0.35),transparent_60%)] pt-[8%]">
        <div className="relative aspect-[9/18] h-[92%] overflow-hidden rounded-t-[1.6rem] border-[6px] border-b-0 border-[#151515] shadow-2xl transition-transform duration-700 ease-(--ease-out-expo) group-hover:-translate-y-2">
          <Image src={p.cover.src} alt={p.cover.alt} fill sizes={sizes} quality={90} className="object-cover object-top" />
        </div>
      </div>
    );
  }
  return (
    <Image
      src={p.cover.src}
      alt={p.cover.alt}
      fill
      sizes={sizes}
      quality={90}
      className="object-cover object-left-top transition-transform duration-[1.2s] ease-(--ease-out-expo) group-hover:scale-[1.04]"
    />
  );
}

function ShowcaseCard({ p, i, total, className }: { p: Project; i: number; total: number; className?: string }) {
  return (
    <Link href={`/work/${p.slug}`} className={`group block ${className ?? ""}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-border bg-graphite lg:aspect-auto lg:h-[min(52svh,500px)]">
        <Cover p={p} sizes="(min-width:1024px) 55vw, 85vw" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,10,10,0.85)_0%,rgba(10,10,10,0)_45%)]" />
        <span className="label absolute left-4 top-4 rounded-sm bg-black/60 px-2 py-1 text-paper lg:backdrop-blur">
          {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
          <div>
            <p className="label text-primary-glow">{categoryLabels[p.category]}</p>
            <h3 className="mt-2 font-display text-[1.5rem] font-semibold leading-tight text-paper sm:text-[2rem]">{p.title}</h3>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-transform duration-500 ease-(--ease-out-expo) group-hover:rotate-[-45deg]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 max-w-[52ch] text-[0.9375rem] text-fg-muted">{p.summary}</p>
    </Link>
  );
}

/**
 * Selected work. Desktop: a sticky stage where vertical scrolling moves the
 * project track horizontally (native scroll is never blocked). Mobile/tablet:
 * a swipeable snap carousel.
 */
export function WorkShowcase() {
  // Single page: show every project here.
  const list = projects;
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      setDistance(desktop ? Math.max(0, track.current.scrollWidth - window.innerWidth) : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const smoothX = useSpring(x, { stiffness: 140, damping: 30, mass: 0.4 });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const header = (
    <div className="container-x flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <Label index="02">Selected work</Label>
        <h2 className="mt-5 max-w-[16ch] font-display text-h2 font-bold text-fg">
          <TextReveal text="Built for what's next." wordClassName="text-chrome pb-[0.08em]" />
        </h2>
      </div>
      <div className="flex flex-col gap-4 lg:items-end">
        <p className="max-w-[40ch] text-fg-muted">{projects.length} websites, web apps and mobile apps designed and built by our team. Open any project for the full case study.</p>
        <ButtonLink href="/#contact" variant="secondary" indicator>
          Start a project
        </ButtonLink>
      </div>
    </div>
  );

  return (
    <section id="work" data-nav-offset="0" aria-label="Selected work" className="relative isolate scroll-mt-0 text-fg">

      {/* Desktop: sticky horizontal track */}
      <div
        ref={outer}
        className="relative hidden lg:block"
        style={{ height: reduce ? "auto" : `calc(100svh + ${distance}px)` }}
      >
        <div className={reduce ? "py-28" : "sticky top-0 flex h-[100svh] flex-col justify-center gap-8 overflow-hidden pt-20"}>
          {header}
          <motion.div
            ref={track}
            style={{ x: reduce ? 0 : smoothX }}
            className={reduce ? "container-x grid grid-cols-2 gap-8" : "flex w-max gap-8 pl-[max(3rem,calc((100vw-1536px)/2+3rem))] pr-[12vw]"}
          >
            {list.map((p, i) => (
              <ShowcaseCard key={p.slug} p={p} i={i} total={list.length} className={reduce ? "" : "w-[min(55vw,820px)] shrink-0"} />
            ))}
            {!reduce && (
              <Link
                href="/#contact"
                className="group flex w-[min(28vw,380px)] shrink-0 flex-col justify-between rounded-[1.5rem] bg-[linear-gradient(150deg,#e0301d,#b32616_60%,#7a1508)] p-8 text-white shadow-[0_20px_60px_-20px_var(--primary)] lg:h-[min(52svh,500px)]"
              >
                <span className="label text-white">Your project</span>
                <span className="font-display text-[2.5rem] font-semibold leading-[1.05]">
                  Want to be next? Let&rsquo;s talk.
                </span>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-accent transition-transform duration-500 group-hover:translate-x-2">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            )}
          </motion.div>
          {!reduce && (
            <div className="container-x">
              <div className="h-px w-full bg-border-strong">
                <motion.div className="h-px bg-accent" style={{ width: bar }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile and tablet: swipe carousel */}
      <div className="py-20 sm:py-24 lg:hidden">
        {header}
        <div
          data-lenis-prevent
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-4 pb-4 [touch-action:pan-x_pan-y] [scrollbar-width:none] sm:gap-6 sm:px-8"
        >
          {list.map((p, i) => (
            <ShowcaseCard key={p.slug} p={p} i={i} total={list.length} className="w-[85vw] max-w-[560px] shrink-0 snap-start" />
          ))}
        </div>
        <p className="container-x mt-3 flex items-center gap-2 text-sm text-fg-subtle">
          <span aria-hidden>←</span> Swipe to see more <span aria-hidden>→</span>
        </p>
      </div>
    </section>
  );
}
