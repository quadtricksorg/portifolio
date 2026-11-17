import { site } from "@/content/site";
import { photos } from "@/content/media";
import { whatsappLink } from "@/lib/utils";
import { Label } from "@/components/ui/Label";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { Reveal } from "@/components/motion/Reveal";

/** Contact: every channel plus the enquiry form, over the night-city photo. */
export function ContactSection() {
  const channels = [
    { key: "email", label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}`, external: false },
    ...site.contact.whatsapp.map((w) => ({
      key: `wa-${w.number}`,
      label: "WhatsApp",
      value: w.display,
      href: whatsappLink(w.number, "Hi QuadTricks, I'd like to discuss a project."),
      external: true,
    })),
    ...site.contact.phones.map((p) => ({ key: `tel-${p.number}`, label: "Phone", value: p.display, href: `tel:+${p.number}`, external: false })),
  ];

  return (
    <section id="contact" data-nav-offset="0" data-theme="dark" aria-labelledby="contact-title" className="relative isolate scroll-mt-0 overflow-hidden bg-bg text-fg">
      <PhotoBackdrop photo={photos.cityNight} overlay="full" parallax={120} imgClassName="object-[50%_60%]" />
      <div aria-hidden className="blob-orange animate-drift pointer-events-none absolute -left-[15%] top-1/4 -z-10 h-[50rem] w-[50rem] opacity-40" />
      <div className="container-x py-24 sm:py-28 lg:py-36">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Label indicator className="text-fg">
              Contact
            </Label>
            <h2 id="contact-title" className="mt-5 font-display text-[clamp(2.75rem,1.6rem+5vw,6rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-fg">
              Let&rsquo;s build <span className="text-gradient">what&rsquo;s next.</span>
            </h2>
            <p className="mt-6 max-w-[42ch] text-lead text-fg-muted">
              Tell us about your project. We reply {site.contact.responseTime}, wherever you are.
            </p>

            <Reveal className="mt-10">
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {channels.map((c) => (
                  <li key={c.key}>
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center justify-between gap-4 py-4"
                    >
                      <span className="min-w-0">
                        <span className="label block text-fg-subtle">{c.label}</span>
                        <span className="mt-1 block font-display text-[1.125rem] text-fg transition-colors [overflow-wrap:anywhere] group-hover:text-accent-text sm:text-[1.25rem]">
                          {c.value}
                        </span>
                      </span>
                      <span aria-hidden className="tri shrink-0 text-[0.8rem] opacity-40 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-fg-muted">
                Studio in {site.contact.locations.map((l) => `${l.city}, ${l.country}`).join(" · ")}. Working with clients in {site.markets.primary.join(", ")} and worldwide.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <div className="chamfer border border-white/10 bg-surface-1/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:p-10">
                <h3 className="font-display text-h3 text-fg">Project enquiry</h3>
                <p className="mt-2 text-fg-muted">All fields except company are required.</p>
                <EnquiryForm className="mt-8" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
