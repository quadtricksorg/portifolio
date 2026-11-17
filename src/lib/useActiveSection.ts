"use client";

import { useEffect, useState } from "react";

/**
 * Returns the id of the section currently in the middle of the viewport.
 * Pass `enabled=false` on pages that do not contain the sections.
 */
export function useActiveSection(ids: readonly string[], enabled = true, fallback = ids[0]) {
  const [active, setActive] = useState(fallback);

  useEffect(() => {
    if (!enabled) return;
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids, enabled]);

  return active;
}
