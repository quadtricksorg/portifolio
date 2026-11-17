"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { EmblemScene } from "./emblem-scene";

/** Orbit rings: two tilted ellipses (SVG). Used inside panels, and as the pre-WebGL fallback. */
export function Orbits({ className, animate = true }: { className?: string; animate?: boolean }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 flex items-center justify-center", className)}>
      <div className={cn("absolute aspect-square w-[150%] max-w-[1800px] -rotate-[14deg]", animate && "motion-safe:lg:animate-orbit")}>
        <svg viewBox="0 0 1000 1000" className="h-full w-full">
          <ellipse cx="500" cy="500" rx="490" ry="190" fill="none" stroke="var(--primary)" strokeOpacity="0.55" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <circle cx="990" cy="500" r="4" fill="var(--primary)" />
        </svg>
      </div>
      <div className={cn("absolute aspect-square w-[110%] max-w-[1400px] rotate-[8deg]", animate && "motion-safe:lg:animate-orbit-rev")}>
        <svg viewBox="0 0 1000 1000" className="h-full w-full">
          <ellipse cx="500" cy="500" rx="480" ry="150" fill="none" stroke="var(--lavender)" strokeOpacity="0.4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <circle cx="20" cy="500" r="3" fill="var(--lavender)" />
        </svg>
      </div>
    </div>
  );
}

/**
 * True when WebGL would run on a real GPU. Software renderers (SwiftShader,
 * llvmpipe, Microsoft Basic Render) draw on the CPU and would stall the page every
 * frame, so those devices keep the CSS fallback and never download three.js.
 */
function hasHardwareWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
      c.getContext("webgl", { failIfMajorPerformanceCaveat: true })) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const name = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|software|basic render/i.test(name);
  } catch {
    return false;
  }
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Site-wide "solar system" background: the 3D chrome emblem, orbit rings and
 * sparkles from the original QuadTricks sample, rendered with three.js.
 *
 * Loading: the page paints first with a static CSS fallback (theme colour,
 * stars, rings). The WebGL scene is fetched when the browser is idle and fades
 * in over it, so it never delays the headline. See emblem-scene.ts for the
 * per-device quality settings.
 */
export function BrandScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  // Once the 3D scene has faded in, the CSS fallback is unmounted so it is never painted underneath.
  const [live, setLive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const w = window as IdleWindow;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    let observer: MutationObserver | undefined;

    const start = () => {
      if (!hasHardwareWebGL()) return;
      import("./emblem-scene")
        .then(({ createEmblemScene }) => {
          if (cancelled) return;
          const canvas = document.createElement("canvas");
          canvas.className = "absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000 ease-out";
          host.prepend(canvas);
          let scene: EmblemScene;
          try {
            scene = createEmblemScene({
              canvas,
              reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
              onReady: () => {
                canvas.classList.replace("opacity-0", "opacity-100");
                window.setTimeout(() => !cancelled && setLive(true), 1100);
              },
            });
          } catch {
            // No WebGL: keep the CSS fallback.
            canvas.remove();
            return;
          }
          observer = new MutationObserver(() => scene.setTheme());
          observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
          dispose = () => {
            scene.dispose();
            canvas.remove();
            setLive(false);
          };
        })
        .catch(() => {
          /* network error: the fallback stays */
        });
    };

    const id = w.requestIdleCallback ? w.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 400);
    return () => {
      cancelled = true;
      if (w.cancelIdleCallback) w.cancelIdleCallback(id);
      else window.clearTimeout(id);
      observer?.disconnect();
      dispose?.();
    };
  }, []);

  return (
    // will-change + contain: its own compositor layer, so scrolling content above never repaints it.
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden bg-bg [contain:strict] will-change-transform"
    >
      {/* Fallback, visible until the canvas fades in over it. */}
      {!live && (
        <>
          <div className="stars absolute inset-0 opacity-60" />
          <Orbits animate={false} className="opacity-60" />
        </>
      )}
      <div ref={hostRef} className="absolute inset-0" />
      {/* Vignette (the sample's post effect, done in CSS). */}
      <div className="vignette absolute inset-0" />
    </div>
  );
}
