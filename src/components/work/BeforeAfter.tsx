"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { ImageAsset } from "@/lib/schemas";

/** Accessible before/after comparison: a range input drives the clip position. */
export function BeforeAfter({ before, after, caption }: { before: ImageAsset; after: ImageAsset; caption?: string }) {
  const [pos, setPos] = useState(50);
  const id = useId();

  return (
    <figure>
      <div className="chamfer relative aspect-[16/10] w-full select-none overflow-hidden border border-border bg-surface-2">
        <Image src={after.src} alt={after.alt} fill sizes="(min-width:1024px) 80vw, 100vw" className="object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before.src} alt={before.alt} fill sizes="(min-width:1024px) 80vw, 100vw" className="object-cover" />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-px bg-accent" style={{ left: `${pos}%` }}>
          <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-fg">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M9 6l-6 6 6 6zM15 6l6 6-6 6z" />
            </svg>
          </span>
        </div>
        <span className="label absolute left-4 top-4 bg-bg/80 px-2 py-1 text-fg">Before</span>
        <span className="label absolute right-4 top-4 bg-bg/80 px-2 py-1 text-fg">After</span>
        <label htmlFor={id} className="sr-only">
          Drag to compare before and after
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      {caption && <figcaption className="mt-3 text-sm text-fg-muted">{caption}</figcaption>}
    </figure>
  );
}
