import { cn } from "@/lib/utils";

/** Logo mark geometry (110 x 100 box): the angular "4" and the triangle. */
export const MARK_PATH = "M66 0H88V62H66V34L28 66V80H62L78 96H18L0 76V52Z";
export const TRIANGLE_PATH = "M92 80V96H108Z";

/** Bare mark, coloured by `currentColor` with a red-orange triangle. */
export function LogoMark({ className, title = "QuadTricks" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 110 100" role={title ? "img" : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : true} className={cn("h-8 w-auto", className)}>
      <path d={MARK_PATH} fill="currentColor" />
      <path d={TRIANGLE_PATH} fill="var(--primary)" />
    </svg>
  );
}

type LogoProps = {
  className?: string;
  /** Show the wordmark next to the badge. */
  withWordmark?: boolean;
  title?: string;
};

/**
 * Brand lockup from the sample site: the mark inside a circular badge plus an
 * uppercase wordmark. The badge inverts with the theme (light badge on dark).
 */
export function Logo({ className, withWordmark = true, title = "QuadTricks" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-3 text-fg", className)}>
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fg shadow-[0_0_0_1px_var(--border),0_6px_20px_-6px_var(--glow)]">
        <svg viewBox="0 0 110 100" role="img" aria-label={title} className="h-[15px] w-auto translate-x-[1px] text-bg">
          <path d={MARK_PATH} fill="currentColor" />
          <path d={TRIANGLE_PATH} fill="var(--primary)" />
        </svg>
      </span>
      {withWordmark && <span className="font-display text-[0.95rem] font-bold uppercase tracking-[-0.01em]">QuadTricks</span>}
    </span>
  );
}
