"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
const FALLBACK = "2026";

/** Current year rendered on the client, keeping the page statically prerenderable. */
export function Year() {
  const year = useSyncExternalStore(noop, () => String(new Date().getFullYear()), () => FALLBACK);
  return <span suppressHydrationWarning>{year}</span>;
}
