"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type Item = { q: string; a: string };

export function FAQ({ items, className }: { items: readonly Item[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <ul className={cn("divide-y divide-border border-y border-border", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const id = `faq-${i}`;
        return (
          <li key={item.q}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : i)}
              className="group flex w-full items-start justify-between gap-6 py-5 text-left"
            >
              <span className="flex items-start gap-4">
                <span className="label mt-1.5 shrink-0 text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-[1.125rem] font-medium text-fg transition-colors group-hover:text-accent-text sm:text-[1.25rem]">
                  {item.q}
                </span>
              </span>
              <span
                aria-hidden
                className={cn(
                  "relative mt-2 block h-4 w-4 shrink-0 text-fg-muted transition-transform duration-500 ease-(--ease-out-expo)",
                  isOpen && "rotate-45",
                )}
              >
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={id}
                  key="content"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[62ch] pb-6 pl-9 text-fg-muted">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
