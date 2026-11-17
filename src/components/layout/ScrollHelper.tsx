"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { cn } from "@/lib/utils";

/** Homepage sections, in order. Ids must exist on the page. */
const HOME_SECTIONS = [
  { id: "top", label: "Home" },
  { id: "studio", label: "Studio" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "why", label: "Why us" },
  { id: "process", label: "Process" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  window.addEventListener("resize", cb);
  return () => {
    window.removeEventListener("scroll", cb);
    window.removeEventListener("resize", cb);
  };
}

/**
 * Always-available scroll navigation:
 *  - every page: a floating button with scroll progress that returns to the top
 *  - homepage: a section list (mobile sheet) and side dots (desktop) to jump anywhere
 */
export function ScrollHelper() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [openPath, setOpenPath] = useState(pathname);
  const shown = useSyncExternalStore(subscribeScroll, () => window.scrollY > window.innerHeight * 0.6, () => false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  if (openPath !== pathname) {
    setOpenPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!isHome) return;
    const els = HOME_SECTIONS.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    if (id === "top") scrollToTarget(0);
    else scrollToTarget(`#${id}`);
    if (isHome) window.history.replaceState(null, "", id === "top" ? "/" : `#${id}`);
  };

  return (
    <>
      {/* Desktop section dots (homepage) */}
      {isHome && (
        <nav aria-label="Page sections" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
          <ul className="flex flex-col items-end gap-3">
            {HOME_SECTIONS.map((s) => {
              const on = s.id === active;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    aria-current={on ? "true" : undefined}
                    className="group flex items-center gap-3 py-1"
                  >
                    <span
                      className={cn(
                        "label rounded-sm bg-bg/80 px-2 py-1 text-fg opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
                      )}
                    >
                      {s.label}
                    </span>
                    <span
                      className={cn(
                        "block h-2 rounded-full transition-all duration-500 ease-(--ease-out-expo)",
                        on ? "w-6 bg-accent" : "w-2 bg-fg-subtle group-hover:bg-fg",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Floating controls */}
      <AnimatePresence>
        {shown && (
          <m.div
            key="controls"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 z-40 flex items-end gap-2 sm:bottom-6 sm:right-6"
          >
            {isHome && (
              <div className="relative xl:hidden">
                <AnimatePresence>
                  {open && (
                    <m.ul
                      key="sheet"
                      initial={reduce ? false : { opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      id="section-sheet"
                      className="absolute bottom-14 right-0 w-52 origin-bottom-right overflow-hidden rounded-md border border-border bg-surface-1/95 p-1.5 shadow-2xl backdrop-blur"
                    >
                      {HOME_SECTIONS.map((s) => (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => go(s.id)}
                            className={cn(
                              "flex h-11 w-full items-center gap-3 rounded-sm px-3 text-left text-[0.9375rem] transition-colors",
                              s.id === active ? "bg-surface-3 text-fg" : "text-fg-muted hover:bg-surface-2 hover:text-fg",
                            )}
                          >
                            <span aria-hidden className={cn("tri text-[0.55rem]", s.id !== active && "opacity-0")} />
                            {s.label}
                          </button>
                        </li>
                      ))}
                    </m.ul>
                  )}
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                  aria-expanded={open}
                  aria-controls="section-sheet"
                  className="flex h-12 items-center gap-2 rounded-full border border-border-strong bg-surface-1/90 px-4 text-sm font-medium text-fg shadow-lg backdrop-blur"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M4 7h16M4 12h10M4 17h13" />
                  </svg>
                  Sections
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => go("top")}
              aria-label="Back to top"
              className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-fg shadow-lg shadow-accent/20 transition-transform duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
                <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
                <m.circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="2" style={{ pathLength: progress }} />
              </svg>
              <svg viewBox="0 0 24 24" className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
