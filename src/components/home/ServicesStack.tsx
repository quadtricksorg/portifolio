"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { services } from "@/content/services";
import { servicePhotos, serviceTones } from "@/content/media";
import { SectionHeader } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { ServiceGraphic } from "@/components/ui/ServiceGraphic";
import { cn } from "@/lib/utils";

type Service = (typeof services)[number];

function StackCard({ s, i, total, progress }: { s: Service; i: number; total: number; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  // Image parallax inside the card while it is on screen.
  const { scrollYProgress: local } = useScroll({ target: cardRef, offset: ["start end", "start start"] });
  const imgScale = useTransform(local, [0, 1], reduce ? [1, 1] : [1.3, 1]);
  // As later cards arrive, earlier cards shrink slightly and dim.
  const target = 1 - (total - i) * 0.035;
  const scale = useTransform(progress, [i / total, 1], reduce ? [1, 1] : [1, target]);
  const dim = useTransform(progress, [i / total, Math.min(1, (i + 1) / total + 0.05)], reduce ? [0, 0] : [0, i === total - 1 ? 0 : 0.35]);

  const tone = serviceTones[s.slug];
  const dark = tone.tone === "dark";
  const photo = servicePhotos[s.slug];

  return (
    <div ref={cardRef} className="sticky top-0 flex h-[100svh] items-start justify-center pt-20 sm:pt-24">
      <motion.article
        style={{ scale, top: `${i * 14}px` }}
        className={cn(
          "chamfer relative grid w-full origin-top grid-rows-[38%_1fr] overflow-hidden shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.6)] md:grid-cols-2 md:grid-rows-1",
          "h-[min(78svh,640px)]",
          tone.bg,
          dark ? "text-paper" : "text-ink",
        )}
      >
        {/* Copy */}
        <div className="relative z-10 order-2 flex min-h-0 flex-col p-6 sm:p-10 md:order-none lg:p-12">
          <div className="flex items-center justify-between">
            <span className={cn("label", dark ? "text-amber" : "text-ink/70")}>
              {s.index} / {String(total).padStart(2, "0")}
            </span>
            <div className="hidden w-20 opacity-80 sm:block sm:w-24 [&_svg]:text-current">
              <ServiceGraphic slug={s.slug} />
            </div>
          </div>
          <h3 className="mt-4 font-display text-[clamp(1.6rem,1.3rem+2vw,3rem)] md:mt-auto font-semibold leading-[1.05] tracking-tight">{s.name}</h3>
          <p className={cn("mt-4 max-w-[40ch] text-[1.0625rem]", dark ? "text-paper/75" : "text-ink/75")}>{s.promise}</p>
          <ul className="mt-6 hidden flex-wrap gap-2 sm:flex">
            {s.deliverables.slice(0, 4).map((d) => (
              <li
                key={d}
                className={cn("rounded-full border px-3 py-1.5 text-[0.8125rem]", dark ? "border-white/15 text-paper/80" : "border-ink/15 text-ink/80")}
              >
                {d}
              </li>
            ))}
          </ul>
          <Link
            href={`/services/${s.slug}`}
            className={cn(
              "group mt-8 inline-flex w-fit items-center gap-3 font-display text-[1.0625rem] font-semibold",
              dark ? "text-paper" : "text-ink",
            )}
          >
            <span className={cn("flex h-11 w-11 items-center justify-center rounded-full transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1", dark ? "bg-accent text-ink" : "bg-ink text-paper")}>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
            Explore {s.shortName.toLowerCase()}
          </Link>
        </div>

        {/* Photo */}
        <div className="relative order-1 min-h-0 overflow-hidden md:order-none">
          <motion.div style={{ scale: imgScale }} className="absolute inset-0">
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width:768px) 50vw, 100vw" quality={60} className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.25),transparent_50%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,0.25),transparent_40%)]" />
        </div>

        <motion.div aria-hidden style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-20 bg-black" />
      </motion.article>
    </div>
  );
}

export function ServicesStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="services" aria-labelledby="services-title" className="relative">
      <div className="container-x pt-20 sm:pt-28 lg:pt-32">
        <SectionHeader
          eyebrow="Services"
          titleId="services-title"
          title="Everything a digital product needs, from one studio."
          lead="From your first logo to the cloud your app runs on. Pick one service or the whole set."
          aside={
            <ButtonLink href="/#services" variant="secondary" indicator>
              All services
            </ButtonLink>
          }
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
