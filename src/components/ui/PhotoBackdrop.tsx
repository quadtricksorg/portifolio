"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { Photo } from "@/content/media";
import { cn } from "@/lib/utils";
import { HeroSlides } from "@/components/ui/HeroSlides";

type Overlay = "hero" | "left" | "bottom" | "full" | "none";

type PhotoBackdropProps = {
  photo: Photo;
  /** Optional crossfading slideshow (first slide should be `photo`). */
  slides?: Photo[];
  /** Above-the-fold: load eagerly with high fetch priority. */
  priority?: boolean;
  /** Parallax travel in px (0 disables). */
  parallax?: number;
  /** Slow zoom-out on first paint. */
  kenburns?: boolean;
  overlay?: Overlay;
  /** Use when the backdrop sits at the very top of the page (hero). */
  hero?: boolean;
  className?: string;
  imgClassName?: string;
  sizes?: string;
};

const overlays: Record<Overlay, string> = {
  hero: "bg-[linear-gradient(90deg,var(--bg)_0%,color-mix(in_srgb,var(--bg)_82%,transparent)_38%,color-mix(in_srgb,var(--bg)_30%,transparent)_75%,transparent_100%)]",
  left: "bg-[linear-gradient(90deg,var(--bg)_0%,color-mix(in_srgb,var(--bg)_70%,transparent)_50%,color-mix(in_srgb,var(--bg)_25%,transparent)_100%)]",
  bottom: "bg-[linear-gradient(0deg,var(--bg)_0%,color-mix(in_srgb,var(--bg)_55%,transparent)_45%,color-mix(in_srgb,var(--bg)_20%,transparent)_100%)]",
  full: "bg-[color-mix(in_srgb,var(--bg)_62%,transparent)]",
  none: "",
};

/**
 * Full-bleed background photo with optional parallax and slow zoom.
 * Only transform/opacity animate, and the image is served as responsive WebP.
 */
export function PhotoBackdrop({
  photo,
  slides,
  priority,
  parallax = 80,
  kenburns,
  overlay = "full",
  hero,
  className,
  imgClassName,
  sizes = "100vw",
}: PhotoBackdropProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: hero ? ["start start", "end start"] : ["start end", "end start"] });
  const travel = reduce ? 0 : parallax;
  const y = useTransform(scrollYProgress, [0, 1], hero ? [0, travel] : [-travel, travel]);

  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <motion.div className="absolute inset-x-0" style={{ y, top: -travel, bottom: -travel }}>
        {slides && slides.length > 1 ? (
          <HeroSlides slides={slides} imgClassName={imgClassName} />
        ) : (
        <div className={cn("relative h-full w-full", kenburns && "animate-kenburns")}>
          <Image
            src={photo.src}
            alt=""
            fill
            sizes={sizes}
            quality={60}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            className={cn("object-cover", imgClassName)}
          />
        </div>
        )}
      </motion.div>
      {overlay !== "none" && <div className={cn("absolute inset-0", overlays[overlay])} />}
      <div className="grain" />
    </div>
  );
}
