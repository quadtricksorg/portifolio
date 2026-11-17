"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { intro } from "@/content/home";
import { photos } from "@/content/media";
import { site } from "@/content/site";
import { Label } from "@/components/ui/Label";

function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  // Starts at 0.62 so every word keeps AA contrast while it lights up.
  const opacity = useTransform(progress, [start, start + 1 / total], [0.62, 1]);
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{" "}
    </motion.span>
  );
}

/** Studio statement: words light up as you scroll; the photo unmasks and settles. */
export function Studio() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  const words = intro.statement.split(" ");

  const clip = useTransform(scrollYProgress, [0, 0.6], reduce ? ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"] : ["inset(18% 12% 18% 12%)", "inset(0% 0% 0% 0%)"]);
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1.25, 1]);
  const tri = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);

  return (
    <section ref={ref} id="studio" aria-label="About the studio" className="relative overflow-hidden">
      <div aria-hidden className="blob-orange pointer-events-none absolute -right-[20%] top-0 -z-10 h-[60vw] w-[60vw] opacity-20" />
      <div className="container-x grid items-center gap-12 pt-8 pb-20 sm:pt-10 sm:pb-24 lg:grid-cols-12 lg:gap-16 lg:pt-12 lg:pb-32">
        <div className="lg:col-span-7">
          <Label indicator>The studio</Label>
          <p className="mt-6 font-display text-[clamp(1.75rem,1.2rem+2.4vw,3.25rem)] font-medium leading-[1.15] tracking-tight text-fg">
            {reduce ? intro.statement : words.map((w, i) => <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} />)}
          </p>
          <div className="mt-10 grid max-w-xl grid-cols-2 gap-6 border-t border-border pt-8 sm:grid-cols-3">
            {[
              ["4", "Founders, four disciplines"],
              ["6", "Services under one roof"],
              ["1 yr", "Support included"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-[2.25rem] font-semibold leading-none text-accent-text">{n}</p>
                <p className="mt-2 text-sm text-fg-muted">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <motion.div style={{ clipPath: clip }} className="chamfer relative aspect-[4/5] overflow-hidden">
            <motion.div style={{ scale }} className="absolute inset-0">
              <Image src={photos.dunes.src} alt={photos.dunes.alt} fill sizes="(min-width:1024px) 40vw, 100vw" quality={60} className="object-cover object-[60%_50%]" />
            </motion.div>
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,10,10,0.75),transparent_55%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-paper">
              <p className="label text-paper/70">Based in {site.contact.locations[0].city}</p>
              <p className="mt-2 font-display text-[1.5rem] font-medium leading-tight">Building for India, the UAE, the GCC and beyond.</p>
            </div>
          </motion.div>
          <motion.span aria-hidden style={{ y: tri }} className="tri absolute -bottom-6 -left-6 text-[4rem] opacity-90" />
          <motion.div aria-hidden style={{ y: tri }} className="absolute -right-4 -top-6 h-24 w-24 rounded-full border border-accent/50" />
        </div>
      </div>
    </section>
  );
}
