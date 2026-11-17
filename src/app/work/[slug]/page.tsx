import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { categoryLabels } from "@/lib/schemas";
import { PageIntro } from "@/components/ui/PageIntro";
import { ButtonLink } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { TagList } from "@/components/ui/Tag";
import { ProjectFrame } from "@/components/ui/Frames";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Section } from "@/components/ui/Section";
import { CTABand } from "@/components/ui/CTABand";
import { Reveal } from "@/components/motion/Reveal";
import { BeforeAfter } from "@/components/work/BeforeAfter";
import { JsonLd } from "@/components/seo/JsonLd";
import { DetailSkeleton } from "@/components/ui/DetailSkeleton";

/**
 * Cache Components requires at least one static param. While the portfolio is
 * empty we publish a single, honest "coming soon" route instead of a fake project.
 */
const COMING_SOON = "coming-soon";

export function generateStaticParams() {
  return projects.length ? projects.map((p) => ({ slug: p.slug })) : [{ slug: COMING_SOON }];
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: slug === COMING_SOON && !projects.length ? "Case studies coming soon" : "Page not found", robots: { index: false } };
  return {
    title: `${project.title} | Work`,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} | ${site.name}`,
      description: project.summary,
      images: [{ url: project.cover.src, width: project.cover.width, height: project.cover.height, alt: project.cover.alt }],
    },
  };
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-4">
      <dt className="label text-fg-subtle">{label}</dt>
      <dd className="mt-2 text-fg">{children}</dd>
    </div>
  );
}

async function ProjectContent({ params }: { params: PageProps<"/work/[slug]">["params"] }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    if (slug !== COMING_SOON || projects.length) notFound();
    return (
      <PageIntro eyebrow="Work" title="Case studies coming soon." lead="We are preparing our first project write-ups. Ask us for examples in the meantime.">
        <div className="mt-10 flex flex-col gap-3 xs:flex-row">
          <ButtonLink href="/#contact" indicator>
            Ask for examples
          </ButtonLink>
          <ButtonLink href="/#services" variant="secondary">
            Explore services
          </ButtonLink>
        </div>
      </PageIntro>
    );
  }

  const service = services.find((s) => s.category === project.category);
  const i = projects.findIndex((p) => p.slug === project.slug);
  const next = projects.length > 1 ? projects[(i + 1) % projects.length] : undefined;
  const related = projects.filter((p) => p.category === project.category && p.slug !== project.slug).slice(0, 2);
  const f = project.flagship;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          description: project.summary,
          ...(project.year ? { dateCreated: String(project.year) } : {}),
          ...(project.liveUrl ? { url: project.liveUrl } : {}),
          creator: { "@type": "Organization", name: site.name, url: site.url },
          image: new URL(project.cover.src, site.url).toString(),
        }}
      />

      {/* Hero */}
      <section className="container-x pt-28 sm:pt-36 lg:pt-44">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="label flex items-center gap-2 text-fg-subtle">
            <li>
              <Link href="/#work" className="hover:text-fg">
                Work
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-fg-muted">
              {project.title}
            </li>
          </ol>
        </nav>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <Label indicator>
              {categoryLabels[project.category]}
              {project.year ? ` · ${project.year}` : ""}
            </Label>
            <h1 className="mt-5 text-h1 text-fg">{project.title}</h1>
          </div>
          <div className="lg:col-span-4 lg:self-end">
            <p className="max-w-[44ch] text-lead text-fg-muted">{project.summary}</p>
            {project.liveUrl && (
              <ButtonLink href={project.liveUrl} target="_blank" rel="noopener noreferrer" variant="secondary" indicator className="mt-6">
                {project.category === "mobile-apps" ? "Get the app" : "Visit the website"}
              </ButtonLink>
            )}
          </div>
        </div>
        <Reveal className="mt-12 lg:mt-16">
          <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9]">
            <div className="absolute inset-0">
              <ProjectFrame category={project.category} image={project.cover} sizes="100vw" priority />
            </div>
          </div>
          {project.conceptVisuals && (
            <p className="mt-3 text-sm text-fg-subtle">Concept visuals for illustration. Screenshots of the live product will be added soon.</p>
          )}
        </Reveal>
      </section>

      {/* Overview */}
      <Section aria-label="Project overview">
        <div className="grid gap-12 lg:grid-cols-12">
          <dl className="grid grid-cols-2 gap-6 self-start lg:col-span-4 lg:grid-cols-1 lg:sticky lg:top-28">
            <Meta label="Client">{project.client}</Meta>
            {project.year && <Meta label="Year">{project.year}</Meta>}
            <Meta label="Services">{project.services.join(", ")}</Meta>
            {project.tech.length > 0 && (
              <div className="col-span-2 border-t border-border pt-4 lg:col-span-1">
                <dt className="label text-fg-subtle">Technology</dt>
                <dd className="mt-3">
                  <TagList items={project.tech} />
                </dd>
              </div>
            )}
          </dl>
          <div className="flex flex-col gap-14 lg:col-span-8">
            <Reveal>
              <Label index="01">The challenge</Label>
              <p className="mt-4 max-w-[62ch] font-display text-[1.25rem] leading-relaxed text-fg sm:text-[1.5rem]">{project.challenge}</p>
            </Reveal>
            <Reveal>
              <Label index="02">Our solution</Label>
              <p className="mt-4 max-w-[62ch] text-lead text-fg-muted">{project.solution}</p>
            </Reveal>
            {f?.outcome && (
              <Reveal>
                <Label index="03">Outcome</Label>
                <p className="mt-4 max-w-[62ch] border-l-2 border-accent pl-5 text-lead text-fg">{f.outcome}</p>
              </Reveal>
            )}
          </div>
        </div>
      </Section>

      {/* Flagship blocks: rendered only when supplied */}
      {f?.video && (
        <section className="container-x pb-16 lg:pb-24">
          <Reveal>
            <figure>
              <video
                className="chamfer aspect-video w-full border border-border bg-surface-2"
                src={f.video.src}
                poster={f.video.poster}
                controls
                preload="none"
                playsInline
              />
              {f.video.caption && <figcaption className="mt-3 text-sm text-fg-muted">{f.video.caption}</figcaption>}
            </figure>
          </Reveal>
        </section>
      )}

      {f?.beforeAfter && (
        <section className="container-x pb-16 lg:pb-24">
          <Reveal>
            <BeforeAfter {...f.beforeAfter} />
          </Reveal>
        </section>
      )}

      {f?.timeline && (
        <Section tone="surface" aria-label="Project timeline">
          <Label indicator>Timeline</Label>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {f.timeline.map((t, n) => (
              <Reveal as="li" key={t.stage} delay={n * 0.05} className="border-t border-border-strong pt-5">
                <span className="label text-accent-text">{String(n + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-[1.25rem] text-fg">{t.stage}</h3>
                <p className="mt-2 text-fg-muted">{t.detail}</p>
              </Reveal>
            ))}
          </ol>
        </Section>
      )}

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <section className="container-x pb-16 lg:pb-24" aria-label="Gallery">
          <ul className="grid gap-6 sm:grid-cols-2 lg:gap-8">
            {project.gallery.map((img, n) => {
              const wide = project.gallery.length % 2 === 1 && n === 0;
              return (
              <Reveal as="li" key={img.src} className={wide ? "sm:col-span-2" : ""}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes={wide ? "100vw" : "(min-width:600px) 50vw, 100vw"}
                  className="chamfer w-full border border-border bg-surface-2"
                />
              </Reveal>
              );
            })}
          </ul>
        </section>
      )}

      {f?.quote && (
        <Section aria-label="Client testimonial">
          <Reveal>
            <figure className="mx-auto max-w-4xl">
              <span aria-hidden className="tri text-[1.5rem]" />
              <blockquote className="mt-6 font-display text-h3 text-fg">&ldquo;{f.quote.text}&rdquo;</blockquote>
              <figcaption className="mt-6 text-fg-muted">
                <span className="text-fg">{f.quote.author}</span>, {f.quote.role}
              </figcaption>
            </figure>
          </Reveal>
        </Section>
      )}

      {related.length > 0 && (
        <Section tone="surface" aria-labelledby="related-title">
          <Label indicator>More {categoryLabels[project.category].toLowerCase()}</Label>
          <h2 id="related-title" className="sr-only">
            Related projects
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {related.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </Section>
      )}

      {next && (
        <Link href={`/work/${next.slug}`} className="group block border-y border-border">
          <div className="container-x flex items-center justify-between gap-6 py-10 sm:py-14">
            <div>
              <Label className="text-fg-subtle">Next project</Label>
              <p className="mt-3 font-display text-h3 text-fg transition-colors group-hover:text-accent-text">{next.title}</p>
            </div>
            <span aria-hidden className="tri text-[1.5rem] transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-2" />
          </div>
        </Link>
      )}

      <div className="pt-20 lg:pt-28">
        <CTABand
          eyebrow={service?.name ?? "Start a project"}
          title={`Need ${project.category === "branding" ? "a brand" : project.category === "animation" ? "a video" : "something"} like this?`}
          text={`Tell us what you have in mind. We reply ${site.contact.responseTime}.`}
          href={service ? `/services/${service.slug}#enquire` : "/#contact"}
        />
      </div>
    </>
  );
}

/** Params resolve inside Suspense so navigation can start instantly; known slugs are still prerendered. */
export default function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}
