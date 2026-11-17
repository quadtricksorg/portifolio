import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type LabelProps = ComponentProps<"span"> & {
  /** Prefix with a glowing dot. */
  indicator?: boolean;
  /** Optional index such as "01", rendered as [01] in accent colour (sample-site style). */
  index?: string;
};

/** Small monospace uppercase label used for section eyebrows, indices and tags. */
export function Label({ className, indicator, index, children, ...props }: LabelProps) {
  return (
    <span className={cn("label inline-flex items-center gap-2 text-fg-muted", className)} {...props}>
      {indicator && !index && <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />}
      {index && <span className="text-accent-text">[{index}]</span>}
      {children}
    </span>
  );
}
