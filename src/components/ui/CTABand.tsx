import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Reveal } from "@/components/motion/Reveal";

type CTABandProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  href?: string;
  cta?: string;
};

/** Mid-page call to action used at the end of inner pages, above the footer. */
export function CTABand({ eyebrow = "Next step", title, text, href = "/#contact", cta = "Start a project" }: CTABandProps) {
  return (
    <section className="container-x pb-20 lg:pb-28">
      <Reveal>
        <div className="chamfer-br relative overflow-hidden bg-accent px-6 py-12 text-accent-fg sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-15">
            <path d="M60 0H100V100H20Z" fill="currentColor" />
          </svg>
          <div className="relative grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <Label className="text-accent-fg/70">{eyebrow}</Label>
              <h2 className="mt-4 text-h2 text-accent-fg">{title}</h2>
              {text && <p className="mt-4 max-w-[54ch] text-lead text-accent-fg/80">{text}</p>}
            </div>
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <ButtonLink
                href={href}
                size="lg"
                className="bg-ink text-paper hover:bg-ink/85 [&_.tri]:bg-accent"
                indicator
              >
                {cta}
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
