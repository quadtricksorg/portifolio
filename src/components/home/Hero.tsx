"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { hero } from "@/content/home";
import { heroSlides, photos } from "@/content/media";
import { projects } from "@/content/projects";
import { categoryLabels } from "@/lib/schemas";
import { Label } from "@/components/ui/Label";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";

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
    <span className="relative inline-block overflow-hidden align-bottom pb-[0.08em]">
      <span aria-hidden>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={word}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className={isLast ? "text-gradient inline-block" : "inline-block"}
          >
            {word}
            {isLast && "."}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only">{hero.words[last]}</span>
    </span>
  );
}

/** Three real project covers, stacked and floating; they tilt to the pointer and spread on scroll. */
function ProjectStack({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const reduce = useReducedMotion();
  const picks = ["ridoz-style", "mediplant", "printquote"]
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  // Pointer tilt (desktop only; touch devices just get the scroll motion).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [6, -6]), { stiffness: 120, damping: 20 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-8, 8]), { stiffness: 120, damping: 20 });

  const d = reduce ? 0 : 1;
  const y0 = useTransform(progress, [0, 1], [0, -60 * d]);
  const y1 = useTransform(progress, [0, 1], [0, -160 * d]);
  const y2 = useTransform(progress, [0, 1], [0, 40 * d]);
  const r0 = useTransform(progress, [0, 1], [-4, -10 * d - 4]);
  const r2 = useTransform(progress, [0, 1], [5, 12 * d + 5]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const [site, app, quote] = picks;
  if (!site || !app || !quote) return null;

  const card = "absolute overflow-hidden rounded-lg border border-white/10 bg-surface-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]";

  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave} className="relative mx-auto aspect-[5/4] w-full max-w-[640px] [perspective:1200px]">
      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateX: rx, rotateY: ry }}>
        {/* Website (back, left) */}
        <motion.div style={{ y: y0, rotate: r0 }} className={`${card} left-0 top-[8%] w-[72%]`}>
          <Link href={`/work/${site.slug}`} className="block" aria-label={`${site.title}, ${categoryLabels[site.category]}`}>
            <div className="flex h-5 items-center gap-1 border-b border-white/10 bg-surface-3 px-2 sm:h-6">
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
            <Image src={site.cover.src} alt={site.cover.alt} width={site.cover.width} height={site.cover.height} sizes="(min-width:1024px) 30vw, 70vw" quality={90} loading="eager" className="w-full" />
          </Link>
        </motion.div>
        {/* Quote tool (front, bottom) */}
        <motion.div style={{ y: y2, rotate: r2 }} className={`${card} bottom-[2%] left-[18%] w-[62%]`}>
          <Link href={`/work/${quote.slug}`} className="block" aria-label={`${quote.title}, ${categoryLabels[quote.category]}`}>
            <Image src={quote.cover.src} alt={quote.cover.alt} width={quote.cover.width} height={quote.cover.height} sizes="(min-width:1024px) 26vw, 60vw" quality={90} loading="eager" className="w-full" />
          </Link>
        </motion.div>
        {/* App (front, right) */}
        <motion.div style={{ y: y1 }} className={`${card} right-[2%] top-0 w-[30%] rounded-[1.4rem] border-[5px] border-[#151515]`}>
          <Link href={`/work/${app.slug}`} className="block" aria-label={`${app.title}, ${categoryLabels[app.category]}`}>
            <Image src={app.cover.src} alt={app.cover.alt} width={app.cover.width} height={app.cover.height} sizes="(min-width:1024px) 14vw, 30vw" quality={90} loading="eager" className="w-full" />
          </Link>
        </motion.div>
        {/* Floating brand triangle */}
        <motion.span aria-hidden style={{ y: y1 }} className="tri animate-float absolute -left-3 bottom-[18%] text-[2.5rem] drop-shadow-[0_10px_30px_rgba(248,106,8,0.5)]" />
      </motion.div>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.75], reduce ? [1, 1] : [1, 0]);
  // Entrance runs in CSS so the hero paints immediately (fast LCP); see `animate-rise`.
  const up = (delay: number) => ({ className: "animate-rise", style: { animationDelay: `${delay}s` } });

  return (
    <section ref={ref} id="top" data-theme="dark" className="relative isolate overflow-hidden bg-bg text-fg" aria-labelledby="hero-title">
      <PhotoBackdrop photo={photos.heroRing} slides={heroSlides} priority hero kenburns overlay="hero" parallax={140} imgClassName="object-[70%_50%]" />
      {/* Drifting light (radial gradients only) */}
      <div aria-hidden className="pointer-events-none absolute -z-10 inset-0">
        <div className="blob-orange animate-drift absolute -left-[15%] top-[30%] h-[70vw] max-h-[900px] w-[70vw] max-w-[900px] opacity-40" />
        <div className="blob-amber animate-drift-slow absolute right-[-10%] top-[-10%] h-[50vw] max-h-[700px] w-[50vw] max-w-[700px] opacity-50" />
      </div>
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />

      <div className="container-x grid min-h-[100svh] grid-cols-1 items-center gap-12 pt-28 pb-20 sm:pt-32 lg:grid-cols-12 lg:gap-8 lg:pt-36 lg:pb-24">
        <motion.div className="lg:col-span-6 xl:col-span-6" style={{ y: copyY, opacity: copyOpacity }}>
          <div {...up(0.05)}>
            <Label indicator className="text-fg">
              {hero.eyebrow}
            </Label>
          </div>
          <h1 id="hero-title" style={{ animationDelay: "0.1s" }} className="animate-slide-up mt-6 text-display text-fg">
            <span className="block">{hero.lead}</span>
            <CyclingWord />
          </h1>
          <p style={{ animationDelay: "0.2s" }} className="animate-slide-up mt-8 max-w-[46ch] text-lead text-fg-muted">
            {hero.sub}
          </p>
          <div {...up(0.42)} className="animate-rise mt-10 flex flex-col gap-3 xs:flex-row">
            <ButtonLink href="/#contact" size="lg" indicator>
              Start a project
            </ButtonLink>
            <ButtonLink href="/#work" size="lg" variant="secondary" className="bg-white/5 backdrop-blur-sm">
              See our work
            </ButtonLink>
          </div>
          <ul {...up(0.55)} className="animate-rise mt-12 flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-muted">
            {["Websites", "Web apps", "Mobile apps", "Branding", "Video", "Cloud"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden className="text-accent">✦</span>
                {t}
              </li>
            ))}
          </ul>
        </motion.div>

        <div {...up(0.25)} className="animate-rise lg:col-span-6 xl:col-span-6">
          <ProjectStack progress={scrollYProgress} />
        </div>
      </div>

      {/* Scroll cue */}
      <div {...up(0.9)} className="animate-rise container-x pointer-events-none absolute bottom-6 left-0 right-0 hidden items-center gap-3 lg:flex">
        <span aria-hidden className="relative h-10 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-accent motion-safe:animate-[scroll-cue_1.8s_ease-in-out_infinite]" />
        </span>
        <Label>Scroll to explore</Label>
      </div>
    </section>
  );
}
