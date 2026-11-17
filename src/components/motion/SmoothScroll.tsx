"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

let lenis: Lenis | null = null;

/** Header clearance for section jumps. Sections can override with data-nav-offset (e.g. "0" for full-bleed sections). */
const HEADER_OFFSET = 88;

/** Scroll smoothly (or instantly) to a y position or element; works with or without Lenis. */
export function scrollToTarget(target: number | string | HTMLElement, immediate = false) {
  const el = typeof target === "number" ? null : typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (typeof target !== "number" && !el) return;
  const offset = el ? Number(el.dataset.navOffset ?? HEADER_OFFSET) : 0;
  if (lenis) {
    // Lenis already honours CSS scroll-margin-top (set per section), so no extra offset here.
    lenis.scrollTo(el ?? (target as number), { immediate, force: true });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = immediate || reduce ? "auto" : "smooth";
  const top = el ? el.getBoundingClientRect().top + window.scrollY - offset : (target as number);
  window.scrollTo({ top, behavior });
}

/**
 * Lenis smooth wheel scrolling on desktop. Disabled for reduced-motion users and
 * touch devices, where native scrolling is faster and more familiar.
 * Scroll position is never locked: Lenis is only an easing layer over native scroll.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const popRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    lenis = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      smoothWheel: true,
      // Nested scroll areas (menus, horizontal carousels) keep native scrolling.
      prevent: (node) => node.closest("[data-lenis-prevent]") !== null,
    });

    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Any same-page link to a #section glides there (with or without Lenis) and
  // records the hash, so every section stays reachable and shareable.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      window.history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Remember Back/Forward navigations so their scroll position is restored, not reset.
  useEffect(() => {
    const onPop = () => {
      popRef.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (popRef.current) {
      popRef.current = false;
      lenis?.resize();
      return;
    }
    lenis?.resize();
    if (!window.location.hash) {
      lenis?.scrollTo(0, { immediate: true, force: true });
      return;
    }
    // Arriving at /#section: jump there, then correct once images and sticky
    // sections have settled so the section lands exactly under the header.
    const jump = () => {
      const el = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (el) scrollToTarget(el, true);
    };
    const raf = requestAnimationFrame(jump);
    const t1 = setTimeout(jump, 350);
    const t2 = setTimeout(jump, 1200);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
