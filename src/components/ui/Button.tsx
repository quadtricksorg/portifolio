import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 font-display font-medium tracking-tight select-none " +
  "transition-[background-color,color,border-color,transform] duration-300 ease-(--ease-out-expo) " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "chamfer bg-accent text-accent-fg hover:bg-accent-hover",
  secondary:
    "chamfer border border-border-strong bg-transparent text-fg hover:border-fg hover:bg-surface-2",
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
  /** Show the orange triangle indicator after the label. */
  indicator?: boolean;
};

type ButtonProps = CommonProps & Omit<ComponentProps<"button">, "className" | "children">;
type LinkProps = CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "className" | "children" | "href">;

function Indicator({ variant }: { variant: Variant }) {
  return (
    <span
      aria-hidden
      className={cn(
        "tri text-[0.75em] transition-transform duration-300 ease-(--ease-out-expo) group-hover/btn:translate-x-0.5",
        variant === "primary" && "bg-accent-fg",
      )}
    />
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
