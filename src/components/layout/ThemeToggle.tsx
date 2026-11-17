"use client";

import { useCallback, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";
const STORAGE_KEY = "qt-theme";

function readTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" ? "light" : "dark";
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  const observer = new MutationObserver(cb);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => {
    listeners.delete(cb);
    observer.disconnect();
  };
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}

export function ThemeToggle({ className }: { className?: string }) {
  // Server snapshot is "dark" (site default); the inline script in layout.tsx
  // sets the real attribute before paint, so the client snapshot matches the DOM.
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  const toggle = useCallback(() => applyTheme(next), [next]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg-muted",
        "transition-colors duration-300 hover:border-border-strong hover:text-fg",
        className,
      )}
    >
      {/* Sun */}
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-500 ease-(--ease-out-expo)",
          theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0",
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Moon */}
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "absolute h-[18px] w-[18px] transition-all duration-500 ease-(--ease-out-expo)",
          theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0",
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    </button>
  );
}

/** Inline script executed before paint. Keep in sync with STORAGE_KEY. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})()`;
