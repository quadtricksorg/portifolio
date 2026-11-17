import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, getService } from "@/content/services";
import { getProjectsByCategory } from "@/content/projects";
import { site } from "@/content/site";
import { Label } from "@/components/ui/Label";
import { ButtonLink } from "@/components/ui/Button";
import { ServiceGraphic } from "@/components/ui/ServiceGraphic";
import { Section, SectionHeader } from "@/components/ui/Section";
import { TagList } from "@/components/ui/Tag";
import { FAQ } from "@/components/ui/FAQ";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { DetailSkeleton } from "@/components/ui/DetailSkeleton";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.seo.title,
    description: service.seo.description,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: `${service.seo.title} | ${site.name}`, description: service.seo.description },
  };
}

async function ServiceContent({ params }: { params: PageProps<"/services/[slug]">["params"] }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = getProjectsByCategory(service.category).slice(0, 2);
  const i = services.findIndex((s) => s.slug === service.slug);
  const next = services[(i + 1) % services.length];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.description,
          serviceType: service.name,
          provider: { "@type": "Organization", name: site.name, url: site.url },
          areaServed: ["India", "United Arab Emirates", "GCC", "Worldwide"],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      {/* 1. Hero */}
      <section className="relative isolate overflow-hidden text-fg">
        <div aria-hidden className="orb-primary pointer-events-none absolute -left-[15%] bottom-0 -z-10 h-[50vw] max-h-[700px] w-[50vw] max-w-[700px]" />
        <div className="container-x flex min-h-[86svh] flex-col justify-end pt-28 pb-14 sm:pt-36 sm:pb-20 lg:pb-24">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="label flex items-center gap-2 text-fg-muted">
            <li>
              <Link href="/#services" className="hover:text-fg">
                Services
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-fg-muted">
              {service.shortName}
            </li>
          </ol>
        </nav>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Label indicator index={service.index} className="text-fg">
              {service.name}
            </Label>
            <h1 className="text-chrome mt-5 font-display text-h1 font-bold">{service.promise}</h1>
            <p className="mt-6 max-w-[56ch] text-lead text-fg-muted">{service.description}</p>
            <div className="mt-10 flex flex-col gap-3 xs:flex-row">
              <ButtonLink href="#enquire" size="lg" indicator>
                Discuss your project
              </ButtonLink>
              <ButtonLink href="/#work" size="lg" variant="secondary">
                See our work
              </ButtonLink>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="glass mx-auto hidden max-w-[420px] rounded-[2rem] p-8 sm:p-12 lg:block">
              <ServiceGraphic slug={service.slug} />
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* 2. Who it's for */}
      <Section tone="surface" aria-labelledby="who-title">
        <SectionHeader eyebrow="Who it's for" titleId="who-title" title="Is this right for you?" />
        <Stagger className="mt-12 grid gap-px border border-border bg-border md:grid-cols-3">
          {service.useCases.map((u, n) => (
            <StaggerItem key={u.title} className="bg-surface-1">
              <div className="flex h-full flex-col gap-4 p-6 sm:p-8">
                <span className="label text-accent-text">{String(n + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-[1.375rem] font-medium text-fg">{u.title}</h3>
                <p className="text-fg-muted">{u.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* 3. What you get + 5. Technologies */}
      <Section aria-labelledby="get-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Label indicator>What you get</Label>
            <h2 id="get-title" className="mt-5 text-h2 text-fg">
              Deliverables, clearly listed.
            </h2>
            <div className="mt-10">
              <Label className="text-fg-subtle">Technologies we use</Label>
              <TagList items={service.tech} className="mt-4" />
            </div>
          </div>
          <Stagger as="ul" className="divide-y divide-border border-y border-border lg:col-span-7" gap={0.05}>
            {service.deliverables.map((d, n) => (
              <StaggerItem as="li" key={d} y={12} className="flex items-center gap-5 py-5">
                <span className="label w-6 text-fg-subtle">{String(n + 1).padStart(2, "0")}</span>
                <span className="font-display text-[1.125rem] text-fg sm:text-[1.25rem]">{d}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* 4. How we work */}
      <Section tone="surface" aria-labelledby="how-title">
        <SectionHeader
          eyebrow="How we work"
          titleId="how-title" title="From brief to launch."
          aside={
            <ButtonLink href="/#process" variant="secondary" indicator>
              Our full process
            </ButtonLink>
          }
        />
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:gap-0" style={{ ["--n" as string]: service.process.length }}>
          {service.process.map((p, n) => (
            <Reveal as="li" key={p.stage} delay={n * 0.06} className="relative flex h-full flex-col gap-3 border-t border-border-strong pt-6 lg:pr-8">
              <span aria-hidden className="tri absolute -top-[5px] left-0 text-[0.6rem]" />
              <span className="label text-accent-text">{String(n + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-[1.25rem] font-medium text-fg">{p.stage}</h3>
              <p className="text-[0.9375rem] text-fg-muted">{p.detail}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-12">
          <p className="max-w-[70ch] border-l-2 border-accent pl-5 text-fg-muted">
            <strong className="font-medium text-fg">{site.support.headline}.</strong> {site.support.detail}
          </p>
        </Reveal>
      </Section>

      {/* 6. Related work: only when real projects exist */}
      {related.length > 0 && (
        <Section aria-labelledby="related-title">
          <SectionHeader
            eyebrow="Related work"
            title={<span id="related-title">{service.shortName} we have built.</span>}
            aside={
              <ButtonLink href="/#work" variant="secondary" indicator>
                More {service.shortName.toLowerCase()}
              </ButtonLink>
            }
          />
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {related.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </Section>
      )}

      {/* 7. FAQ */}
      <Section aria-labelledby="faq-title">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Label indicator>FAQ</Label>
            <h2 id="faq-title" className="mt-5 text-h2 text-fg">
              Honest answers.
            </h2>
          </div>
          <div className="lg:col-span-8">
            <FAQ items={service.faq} />
          </div>
        </div>
      </Section>

      {/* 8. Enquiry */}
      <Section tone="surface" id="enquire" aria-labelledby="enquire-title" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Label indicator>Start here</Label>
            <h2 id="enquire-title" className="mt-5 text-h2 text-fg">
              Tell us about your project.
            </h2>
            <p className="mt-5 max-w-[42ch] text-fg-muted">A few details are enough. We reply {site.contact.responseTime} with next steps.</p>
          </div>
          <div className="lg:col-span-7">
            <EnquiryForm defaultService={service.slug} compact />
          </div>
        </div>
      </Section>

      {/* Next service */}
      <Link href={`/services/${next.slug}`} className="group block border-t border-border">
        <div className="container-x flex items-center justify-between gap-6 py-10 sm:py-14">
          <div>
            <Label className="text-fg-subtle">Next service</Label>
            <p className="mt-3 font-display text-h3 text-fg transition-colors group-hover:text-accent-text">{next.name}</p>
          </div>
          <span aria-hidden className="tri text-[1.5rem] transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-2" />
        </div>
      </Link>
    </>
  );
}

/** Params resolve inside Suspense so navigation can start instantly; known slugs are still prerendered. */
export default function ServicePage({ params }: PageProps<"/services/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ServiceContent params={params} />
    </Suspense>
  );
}
