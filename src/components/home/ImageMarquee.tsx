import Image from "next/image";
import Link from "next/link";
import { projects } from "@/content/projects";
import { VelocityMarquee } from "@/components/motion/VelocityMarquee";

/** Two rows of real project screens drifting in opposite directions, faster as you scroll. */
export function ImageMarquee() {
  // Landscape screens only (covers of websites/web apps plus every gallery image).
  const shots = projects.flatMap((p) => [
    ...(p.category === "mobile-apps" ? [] : [{ img: p.cover, slug: p.slug, title: p.title }]),
    ...p.gallery.map((g) => ({ img: g, slug: p.slug, title: p.title })),
  ]);
  const half = Math.ceil(shots.length / 2);
  const rows = [shots.slice(0, half), shots.slice(half)];

  return (
    <section aria-label="More of our work" className="relative overflow-hidden py-16 sm:py-24">
      <div className="flex flex-col gap-4 sm:gap-6 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        {rows.map((row, r) => (
          <VelocityMarquee key={r} duration={34} reverse={r === 1} copies={2} className={r === 1 ? "-ml-24" : ""}>
            {row.map((s, i) => (
              <Link
                key={`${s.img.src}-${i}`}
                href={`/work/${s.slug}`}
                tabIndex={-1}
                className="group relative mx-2 block w-[240px] shrink-0 overflow-hidden rounded-md border border-border bg-surface-2 sm:mx-3 sm:w-[380px]"
              >
                <Image
                  src={s.img.src}
                  alt=""
                  width={s.img.width}
                  height={s.img.height}
                  sizes="(min-width:640px) 380px, 240px"
                  quality={75}
                  className="aspect-[16/10] w-full object-cover object-left-top transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-105"
                />
                <span className="label absolute bottom-2 left-2 rounded-sm bg-black/60 px-2 py-1 text-paper opacity-0 transition-opacity group-hover:opacity-100">
                  {s.title}
                </span>
              </Link>
            ))}
          </VelocityMarquee>
        ))}
      </div>
    </section>
  );
}
