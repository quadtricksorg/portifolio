import type { ReactNode } from "react";
import type { Photo } from "@/content/media";
import { Label } from "@/components/ui/Label";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { TextReveal } from "@/components/motion/TextReveal";
import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  index?: string;
  className?: string;
  children?: ReactNode;
  /** Optional background photo: renders a dark, cinematic header. */
  photo?: Photo;
};

/** Standard opening block for inner pages. Clears the fixed header. */
export function PageIntro({ eyebrow, title, lead, index, className, children, photo }: PageIntroProps) {
  const heading = (
    <h1 className="mt-5 text-h1 text-fg">{typeof title === "string" ? <TextReveal text={title} immediate delay={0.1} /> : title}</h1>
  );

  if (photo) {
    return (
      <section data-theme="dark" className={cn("relative isolate overflow-hidden bg-bg text-fg", className)}>
        <PhotoBackdrop photo={photo} priority hero kenburns overlay="bottom" parallax={120} />
        <div aria-hidden className="blob-orange animate-drift pointer-events-none absolute -left-[20%] top-1/4 -z-10 h-[60vw] max-h-[760px] w-[60vw] max-w-[760px] opacity-35" />
        <div className="container-x flex min-h-[72svh] flex-col justify-end pt-32 pb-14 sm:min-h-[78svh] sm:pb-20 lg:pb-24">
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-8">
              <Label indicator index={index} className="text-fg">
                {eyebrow}
              </Label>
              {heading}
            </div>
            {lead && (
              <div className="lg:col-span-4 lg:self-end">
                <p className="max-w-[44ch] text-lead text-fg-muted">{lead}</p>
              </div>
            )}
          </div>
          {children}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("container-x pt-28 pb-12 sm:pt-36 sm:pb-16 lg:pt-44 lg:pb-20", className)}>
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <Label indicator index={index}>
            {eyebrow}
          </Label>
          {heading}
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
