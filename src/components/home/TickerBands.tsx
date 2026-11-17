import { VelocityMarquee } from "@/components/motion/VelocityMarquee";
import { intro } from "@/content/home";

/** Two crossing tickers: a red-orange band and a glass band moving the other way. */
export function TickerBands() {
  const words = intro.marquee;
  return (
    <section aria-label="What we do" className="relative z-10 overflow-hidden py-8 sm:py-12">
      <div className="-mx-4 -rotate-[2deg] bg-[linear-gradient(90deg,var(--accent),var(--primary-glow))] py-3 text-white shadow-[0_20px_60px_-20px_var(--primary)] sm:py-4">
        <VelocityMarquee duration={24} copies={2}>
          {words.map((w) => (
            <span key={w} className="flex items-center font-display text-[1.125rem] font-bold uppercase tracking-tight sm:text-[1.75rem]">
              <span className="px-5 sm:px-8">{w}</span>
              <span aria-hidden className="text-[0.7em] opacity-80">✦</span>
            </span>
          ))}
        </VelocityMarquee>
      </div>
      <div className="glass -mx-4 -mt-2 rotate-[1.5deg] py-3 sm:py-4">
        <VelocityMarquee duration={28} reverse copies={2}>
          {["Design", "Engineering", "Motion", "Cloud", "Kochi", "UAE", "GCC", "Worldwide"].map((w) => (
            <span key={w} className="flex items-center font-display text-[1.125rem] font-bold uppercase tracking-tight sm:text-[1.75rem]">
              <span className="text-chrome px-5 sm:px-8">{w}</span>
              <span aria-hidden className="text-[0.7em] text-accent-text">✦</span>
            </span>
          ))}
        </VelocityMarquee>
      </div>
    </section>
  );
}
