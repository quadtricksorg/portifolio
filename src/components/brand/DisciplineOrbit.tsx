import { Orbits } from "@/components/brand/BrandScene";
import { cn } from "@/lib/utils";

const disciplines = ["Design", "Engineering", "Motion", "Cloud"];

/**
 * The four founders' disciplines circling a glowing brand triangle.
 * Rotation is a single CSS animation on large screens only (labels counter-rotate
 * to stay upright); phones get the same composition, static.
 */
export function DisciplineOrbit({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-square overflow-hidden", className)}>
      <div aria-hidden className="orb-primary absolute -bottom-1/4 -left-1/4 h-full w-full" />
      <div aria-hidden className="orb-cool absolute -right-1/4 -top-1/4 h-full w-full" />
      <div aria-hidden className="stars absolute inset-0 opacity-50" />
      <Orbits animate={false} className="scale-[0.8] opacity-60" />

      {/* Centre: glowing triangle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div aria-hidden className="orb-primary absolute h-1/2 w-1/2" />
        <span aria-hidden className="relative block h-[22%] w-[22%] bg-[linear-gradient(135deg,#ff6a4d,#e3260f)] shadow-[0_0_60px_var(--primary)] [clip-path:polygon(0_0,0_100%,100%_100%)]" />
      </div>

      {/* Ring of discipline labels */}
      <div className="absolute inset-[14%] motion-safe:lg:animate-[orbit_50s_linear_infinite]">
        <div aria-hidden className="absolute inset-0 rounded-full border border-dashed border-border-strong" />
        {disciplines.map((d, i) => {
          const pos = ["left-1/2 top-0 -translate-x-1/2 -translate-y-1/2", "right-0 top-1/2 translate-x-1/2 -translate-y-1/2", "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2", "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"][i];
          return (
            <div key={d} className={cn("absolute", pos)}>
              <span className="glass pill block whitespace-nowrap px-3 py-1.5 text-[0.8125rem] font-semibold text-fg shadow-lg motion-safe:lg:animate-[orbit_50s_linear_infinite_reverse]">
                <span className="mr-1.5 text-accent-text">0{i + 1}</span>
                {d}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
