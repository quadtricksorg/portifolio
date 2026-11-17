"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { scrollToTarget } from "@/components/motion/SmoothScroll";
import { useActiveSection } from "@/lib/useActiveSection";

const SECTION_IDS = ["top", "studio", "services", "work", "why", "process", "about", "contact"] as const;

function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const reduce = useReducedMotion();
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 24,
    () => false,
  );

  // Close the menu when the route changes (state adjusted during render).
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  // Lock page scroll while the menu is open.
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onHome = pathname === "/";
  const activeSection = useActiveSection(SECTION_IDS, onHome, "top");
  // On the homepage the active item follows the section in view; on detail pages it follows the route.
  const activeId = onHome ? activeSection : pathname.startsWith("/services/") ? "services" : pathname.startsWith("/work/") ? "work" : "";
  const isActive = (href: string) => href === `/#${activeId}`;
  /** Same-page section links scroll smoothly and update the hash; other pages navigate normally. */
  const onSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (!onHome || !href.startsWith("/#")) return;
    e.preventDefault();
    const id = href.slice(2);
    scrollToTarget(id === "top" ? 0 : `#${id}`);
    window.history.pushState(null, "", id === "top" ? "/" : `#${id}`);
  };
  // Close the menu on any link tap, including a link to the current page.
  const closeMenu = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
      {/* Floating glass bar (sample-site style). The blur lives on this bar, not on
          <header>, so the fixed mobile menu below is never trapped inside it. */}
      <div className="container-x">
      <div
        className={cn(
          "flex h-14 items-center justify-between rounded-2xl border px-2.5 pl-3 transition-[background-color,border-color,box-shadow] duration-500 lg:h-16 lg:px-3 lg:pl-4",
          open ? "border-border bg-surface-1" : scrolled ? "glass shadow-[0_10px_40px_-20px_rgba(0,0,0,0.5)]" : "border-border bg-transparent",
        )}
      >
        <Link href="/" aria-label="QuadTricks home" className="relative z-50" onClick={(e) => onSectionClick(e, "/#top")}>
          <Logo />
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {site.nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "location" : undefined}
              onClick={(e) => onSectionClick(e, item.href)}
              className={cn(
                "label group relative px-3 py-2 text-fg-muted transition-colors duration-300 hover:text-fg",
                isActive(item.href) && "text-fg",
              )}
            >
              <span className="inline-flex items-center gap-2">
                <span className="text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </span>
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-primary transition-transform duration-500 ease-(--ease-out-expo)",
                  isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <ButtonLink href="/#contact" indicator onClick={(e) => onSectionClick(e, "/#contact")}>
            Start a project
          </ButtonLink>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg transition-colors hover:border-border-strong"
          >
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ease-(--ease-out-expo)",
                  open && "translate-y-[5.5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 ease-(--ease-out-expo)",
                  open && "-translate-y-[5.5px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>
      </div>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
            className="fixed inset-0 top-0 z-40 flex flex-col overflow-y-auto bg-bg pt-20 lg:hidden"
          >
            <nav aria-label="Mobile" className="container-x flex flex-1 flex-col pt-6 pb-8">
              <ul className="flex flex-col">
                {site.nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.05 + i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-border"
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "location" : undefined}
                      onClick={(e) => onSectionClick(e, item.href)}
                      className="flex items-center justify-between py-5 font-display text-[2rem] font-medium tracking-tight text-fg"
                    >
                      <span className="flex items-center gap-3">
                        <span aria-hidden className={cn("tri text-[0.75rem]", !isActive(item.href) && "opacity-0")} />
                        {item.label}
                      </span>
                      <span className="label text-fg-subtle">0{i + 1}</span>
                    </Link>
                    {item.href === "/#services" && (
                      <ul className="grid grid-cols-1 gap-x-6 pb-5 pl-[18px] xs:grid-cols-2">
                        {services.map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={`/services/${s.slug}`}
                              onClick={closeMenu}
                              className="flex items-center gap-2 py-2 text-[0.9375rem] text-fg-muted transition-colors hover:text-fg"
                            >
                              <span className="label text-accent-text">{s.index}</span>
                              {s.shortName}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: reduce ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.35, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="mt-auto flex flex-col gap-4 pt-8"
              >
                <ButtonLink href="/#contact" size="lg" indicator className="w-full" onClick={(e) => onSectionClick(e, "/#contact")}>
                  Start a project
                </ButtonLink>
                <a href={`mailto:${site.contact.email}`} className="text-center text-sm text-fg-muted hover:text-fg">
                  {site.contact.email}
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
