import { story, pillars, values } from "@/content/about";
import { site } from "@/content/site";
import { Label } from "@/components/ui/Label";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { ParallaxMark } from "@/components/about/ParallaxMark";

const tileTones = [
  "bg-[linear-gradient(150deg,#f86a08,#c94a05)] text-ink",
  "bg-graphite text-paper",
  "bg-[linear-gradient(150deg,#ffc56b,#ff9a3d)] text-ink",
  "bg-[linear-gradient(150deg,#5a1e05,#2a0d02)] text-paper",
];

/** About the studio: story, the four disciplines and how we work. */
export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative scroll-mt-20 overflow-hidden">
      <div aria-hidden className="blob-amber pointer-events-none absolute -left-40 top-40 -z-10 h-[40rem] w-[40rem] opacity-25" />
      <div className="container-x section-y">
        {/* Story */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Label indicator>About</Label>
            <h2 id="about-title" className="mt-5 text-h1 text-fg">
              <TextReveal text={story.headline} />
            </h2>
            <p className="mt-6 max-w-[52ch] text-lead text-fg-muted">{story.lead}</p>
            <div className="mt-8 flex flex-col gap-5">
              {story.body.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="max-w-[60ch] text-fg-muted">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <ParallaxMark />
          </div>
        </div>

        {/* The four disciplines */}
        <Stagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
          {pillars.map((p, i) => (
            <StaggerItem key={p.index} className={`chamfer ${tileTones[i]}`}>
              <div className="group flex h-full min-h-[260px] flex-col gap-5 p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="label opacity-70">{p.index}</span>
                  <span
                    aria-hidden
                    className="inline-block h-6 w-6 bg-current opacity-30 transition-all duration-500 [clip-path:polygon(0_0,0_100%,100%_100%)] group-hover:rotate-90 group-hover:opacity-80"
                  />
                </div>
                <h3 className="mt-auto font-display text-[2rem] font-semibold leading-none tracking-tight">{p.title}</h3>
                <p className="opacity-80">{p.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Values */}
        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Label indicator>How we work</Label>
            <p className="mt-5 font-display text-h3 text-fg">What you can expect from us.</p>
            <p className="mt-4 text-fg-muted">
              Based in {site.contact.locations[0].city}, working with clients across {site.markets.primary.join(", ")} and worldwide.
            </p>
          </div>
          <ul className="grid gap-8 sm:grid-cols-2 lg:col-span-8">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={(i % 2) * 0.08} className="border-t border-border-strong pt-6">
                <h3 className="font-display text-[1.375rem] font-medium text-fg">{v.title}</h3>
                <p className="mt-3 text-fg-muted">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
