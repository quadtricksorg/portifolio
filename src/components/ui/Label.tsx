import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type LabelProps = ComponentProps<"span"> & {
  /** Prefix with the orange triangle indicator. */
  indicator?: boolean;
  /** Optional index such as "01". Rendered in accent colour. */
  index?: string;
};

/** Small monospace uppercase label used for section eyebrows, indices and tags. */
export function Label({ className, indicator, index, children, ...props }: LabelProps) {
  return (
    <span className={cn("label inline-flex items-center gap-2 text-fg-muted", className)} {...props}>
      {indicator && <span aria-hidden className="tri" />}
      {index && <span className="text-accent-text">{index}</span>}
      {children}
    </span>
  );
}
