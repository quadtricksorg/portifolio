import type { ReactNode } from "react";
import { Label } from "@/components/ui/Label";
import { TextReveal } from "@/components/motion/TextReveal";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  index?: string;
  className?: string;
  children?: ReactNode;
};

/** Standard opening block for inner pages (legal, coming soon). Clears the fixed header. */
export function PageIntro({ eyebrow, title, lead, index, className, children }: PageIntroProps) {
  return (
    <section className={cn("container-x pt-32 pb-12 sm:pt-36 sm:pb-16 lg:pt-44 lg:pb-20", className)}>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <Label indicator index={index}>
            {eyebrow}
          </Label>
          <h1 className="mt-5 font-display text-h1 font-bold text-fg">
            {typeof title === "string" ? <TextReveal text={title} immediate delay={0.1} wordClassName="text-chrome pb-[0.08em]" /> : title}
          </h1>
        </div>
        {lead && (
          <div className="lg:col-span-4 lg:self-end">
            <p className="max-w-[44ch] text-lead text-fg-muted">{lead}</p>
          </div>
        )}
      </div>
      {children}
    </section>
  );
}
