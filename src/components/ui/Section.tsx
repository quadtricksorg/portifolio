import type { ComponentProps, ReactNode } from "react";
import { Label } from "@/components/ui/Label";
import { TextReveal } from "@/components/motion/TextReveal";
import { cn } from "@/lib/utils";

type SectionProps = ComponentProps<"section"> & {
  /** Remove the horizontal container so children can go full-bleed. */
  bleed?: boolean;
  /** Surface tone. */
  tone?: "bg" | "surface";
};

export function Section({ className, bleed, tone = "bg", children, ...props }: SectionProps) {
  return (
    <section
      className={cn("section-y relative", tone === "surface" && "bg-surface-1", !bleed && "container-x", className)}
      {...props}
    >
      {children}
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow: string;
  index?: string;
  /** Plain strings get a masked word reveal; nodes render as given. */
  title: ReactNode;
  titleId?: string;
  lead?: ReactNode;
  /** Right-aligned slot on large screens, e.g. a link button. */
  aside?: ReactNode;
  className?: string;
  /** Heading level; defaults to h2. */
  as?: "h1" | "h2" | "h3";
};

export function SectionHeader({ eyebrow, index, title, titleId, lead, aside, className, as: Tag = "h2" }: SectionHeaderProps) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-12 lg:gap-12", className)}>
      <div className="lg:col-span-7">
        <Label indicator index={index}>
          {eyebrow}
        </Label>
        <Tag id={titleId} className="mt-5 text-h2 text-fg">
          {typeof title === "string" ? <TextReveal text={title} /> : title}
        </Tag>
      </div>
      {(lead || aside) && (
        <div className="flex flex-col gap-6 lg:col-span-5 lg:items-start lg:justify-end">
          {lead && <p className="max-w-[46ch] text-lead text-fg-muted">{lead}</p>}
          {aside}
        </div>
      )}
    </div>
  );
}
