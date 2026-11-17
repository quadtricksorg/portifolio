import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-tight select-none " +
  "transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-(--ease-out-expo) " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "pill bg-accent text-accent-fg shadow-[0_8px_30px_-8px_var(--primary)] hover:bg-accent-hover hover:shadow-[0_10px_40px_-6px_var(--primary)]",
  secondary:
    "pill border border-border-strong bg-glass text-fg hover:border-fg",
  ghost: "text-fg hover:text-accent-text px-0",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Show an arrow after the label. */
  indicator?: boolean;
};

type ButtonProps = CommonProps & Omit<ComponentProps<"button">, "className" | "children">;
type LinkProps = CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "className" | "children" | "href">;

function Indicator({ variant }: { variant: Variant }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={cn("h-4 w-4 transition-transform duration-300 ease-(--ease-out-expo) group-hover/btn:translate-x-1", variant === "ghost" && "text-accent-text")}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Button({ variant = "primary", size = "md", className, children, indicator, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], variant !== "ghost" && sizes[size], className)} {...props}>
      {children}
      {indicator && <Indicator variant={variant} />}
    </button>
  );
}

export function ButtonLink({ variant = "primary", size = "md", className, children, indicator, href, ...props }: LinkProps) {
  return (
    <Link href={href} className={cn(base, variants[variant], variant !== "ghost" && sizes[size], className)} {...props}>
      {children}
      {indicator && <Indicator variant={variant} />}
    </Link>
  );
}
