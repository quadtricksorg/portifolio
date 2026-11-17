import { Label } from "@/components/ui/Label";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[70svh] flex-col justify-center pt-28 pb-16">
      <Label indicator index="404">
        Page not found
      </Label>
      <h1 className="mt-6 max-w-[16ch] text-h1 text-fg">This page doesn&rsquo;t exist yet.</h1>
      <p className="mt-6 max-w-[44ch] text-lead text-fg-muted">
        The link may be outdated, or the page may have moved. Let&rsquo;s get you somewhere useful.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" indicator>
          Back to home
        </ButtonLink>
        <ButtonLink href="/#work" variant="secondary">
          See our work
        </ButtonLink>
      </div>
    </section>
  );
}
