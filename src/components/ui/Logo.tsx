import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  /** Show the wordmark next to the mark. */
  withWordmark?: boolean;
  title?: string;
};

/**
 * QuadTricks mark: an angular "4"/"Q" form with the orange triangle.
 * Vector reconstruction of the supplied logo; replace the path with the
 * official SVG when available (docs/brand/logo-source.webp is the reference).
 */
export function LogoMark({ className, title = "QuadTricks" }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 110 100"
      role="img"
      aria-label={title}
      className={cn("h-8 w-auto", className)}
    >
      <path
        d="M66 0H88V62H66V34L28 66V80H62L78 96H18L0 76V52Z"
        fill="currentColor"
        strokeLinejoin="round"
      />
      <path d="M92 80V96H108Z" fill="var(--accent)" />
    </svg>
  );
}

export function Logo({ className, withWordmark = true, title = "QuadTricks" }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-fg", className)}>
      <LogoMark title={title} />
      {withWordmark && (
        <span className="font-display text-[1.125rem] font-medium tracking-tight">
          Quad<span className="text-fg-muted">Tricks</span>
        </span>
      )}
    </span>
  );
}
