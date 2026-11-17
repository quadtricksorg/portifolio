import Link from "next/link";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { Logo } from "@/components/ui/Logo";
import { Label } from "@/components/ui/Label";
import { whatsappLink } from "@/lib/utils";
import { Year } from "@/components/ui/Year";

const socials = [
  { key: "linkedin", label: "LinkedIn", href: site.social.linkedin },
  { key: "instagram", label: "Instagram", href: site.social.instagram },
  { key: "behance", label: "Behance", href: site.social.behance },
  { key: "github", label: "GitHub", href: site.social.github },
].filter((s) => s.href);

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-1">
      <div className="container-x">
        {/* Link columns */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:py-16">
          <div className="sm:col-span-2 lg:col-span-4">
            <Logo />
            <p className="mt-4 max-w-[36ch] text-sm text-fg-muted">{site.tagline}. A creative technology studio founded by four people from different corners of tech and design.</p>
          </div>

          <div className="lg:col-span-3">
            <Label className="text-fg-subtle">Services</Label>
            <ul className="mt-4 flex flex-col gap-2.5">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-sm text-fg-muted transition-colors hover:text-fg">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <Label className="text-fg-subtle">Studio</Label>
            <ul className="mt-4 flex flex-col gap-2.5">
              {site.nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <Label className="text-fg-subtle">Where we work</Label>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-fg-muted">
              {site.contact.locations.map((l) => (
                <li key={l.city}>
                  {l.city}, {l.country}
                </li>
              ))}
              <li className="pt-1 text-fg-subtle">
                Serving {site.markets.primary.join(", ")} and clients worldwide.
              </li>
            </ul>
            <ul className="mt-6 flex flex-col gap-2.5 text-sm">
              <li>
                <a href={`mailto:${site.contact.email}`} className="text-fg-muted transition-colors [overflow-wrap:anywhere] hover:text-fg">
                  {site.contact.email}
                </a>
              </li>
              {site.contact.whatsapp.map((w) => (
                <li key={w.number}>
                  <a
                    href={whatsappLink(w.number, "Hi QuadTricks, I'd like to discuss a project.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-fg-muted transition-colors hover:text-fg"
                  >
                    WhatsApp {w.display}
                  </a>
                </li>
              ))}
            </ul>
            {socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
                {socials.map((s) => (
                  <li key={s.key}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-fg-muted transition-colors hover:text-fg">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3 border-t border-border py-6 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; <Year /> {site.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-fg">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-fg">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
