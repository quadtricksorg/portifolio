import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { intro } from "@/content/home";

/** Two crossing tickers: a bold orange band and an outlined ink band moving the other way. */
export function TickerBands() {
  const words = intro.marquee;
  return (
    <section aria-label="What we do" className="relative z-10 -mt-10 overflow-hidden py-10 sm:-mt-14 sm:py-14">
      <div className="-mx-4 -rotate-[2.5deg] bg-accent py-3 text-accent-fg shadow-[0_20px_60px_-20px_rgba(248,106,8,0.6)] sm:py-4">
        <VelocityMarquee duration={22}>
          {words.map((w) => (
            <span key={w} className="flex items-center font-display text-[1.5rem] font-semibold uppercase tracking-tight sm:text-[2.25rem]">
              <span className="px-5 sm:px-8">{w}</span>
              <span aria-hidden className="text-[0.7em]">✦</span>
            </span>
          ))}
        </VelocityMarquee>
      </div>
      <div className="-mx-4 -mt-3 rotate-[1.5deg] border-y border-white/10 bg-graphite py-3 sm:py-4">
        <VelocityMarquee duration={26} reverse>
          {["Design", "Engineering", "Motion", "Cloud", "Kochi", "UAE", "GCC", "Worldwide"].map((w) => (
            <span key={w} className="flex items-center font-display text-[1.5rem] font-semibold uppercase tracking-tight sm:text-[2.25rem]">
              <span className="px-5 text-transparent [-webkit-text-stroke:1px_rgba(248,248,248,0.55)] sm:px-8">{w}</span>
              <span aria-hidden className="text-[0.7em] text-accent">✦</span>
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}
