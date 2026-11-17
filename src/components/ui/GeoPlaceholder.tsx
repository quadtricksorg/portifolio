import type { Category } from "@/lib/schemas";

/**
 * Code-generated geometric fills in the brand language. Used where a
 * real project image does not exist yet. Deterministic per category.
 */
export function GeoPlaceholder({ category }: { category: Category }) {
  return (
    <div className="relative h-full w-full bg-surface-2 text-fg">
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden>
        <defs>
          <pattern id={`grid-${category}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="var(--border)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill={`url(#grid-${category})`} />
        {category === "web-apps" && (
          <g>
            <rect x="32" y="32" width="80" height="236" fill="currentColor" opacity="0.08" />
            <rect x="128" y="32" width="112" height="70" fill="currentColor" opacity="0.14" />
            <rect x="256" y="32" width="112" height="70" fill="currentColor" opacity="0.14" />
            <rect x="128" y="118" width="240" height="150" fill="currentColor" opacity="0.08" />
            <polyline points="144,240 190,200 236,214 282,160 328,176 356,140" fill="none" stroke="var(--accent)" strokeWidth="3" />
            <rect x="44" y="48" width="56" height="8" fill="currentColor" opacity="0.5" />
            <rect x="44" y="68" width="40" height="8" fill="currentColor" opacity="0.3" />
            <rect x="44" y="88" width="48" height="8" fill="currentColor" opacity="0.3" />
          </g>
        )}
        {category === "mobile-apps" && (
          <g>
            <rect x="40" y="30" width="320" height="56" fill="currentColor" opacity="0.1" />
            <rect x="40" y="100" width="150" height="90" fill="currentColor" opacity="0.14" />
            <rect x="210" y="100" width="150" height="90" fill="var(--accent)" opacity="0.9" />
            <rect x="40" y="204" width="320" height="40" fill="currentColor" opacity="0.1" />
            <rect x="40" y="258" width="320" height="40" fill="currentColor" opacity="0.1" />
            <circle cx="70" cy="58" r="12" fill="currentColor" opacity="0.6" />
          </g>
        )}
        {category === "branding" && (
          <g>
            <path d="M200 70h50v120h-50V140l-70 60v28h70l30 32H120l-36-36V190z" fill="currentColor" />
            <path d="M262 232v30h30z" fill="var(--accent)" />
          </g>
        )}
        {category === "animation" && (
          <g>
            <rect x="20" y="60" width="360" height="180" fill="currentColor" opacity="0.08" />
            <path d="M170 110v80l70-40z" fill="var(--accent)" />
            <g opacity="0.35">
              <rect x="40" y="252" width="40" height="24" fill="currentColor" />
              <rect x="92" y="252" width="40" height="24" fill="currentColor" />
              <rect x="144" y="252" width="40" height="24" fill="currentColor" />
              <rect x="196" y="252" width="40" height="24" fill="currentColor" />
              <rect x="248" y="252" width="40" height="24" fill="currentColor" />
            </g>
          </g>
        )}
        {category === "cloud" && (
          <g fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="60" y="60" width="80" height="48" opacity="0.7" />
            <rect x="260" y="60" width="80" height="48" opacity="0.7" />
            <rect x="160" y="140" width="80" height="48" stroke="var(--accent)" strokeWidth="3" />
            <rect x="60" y="220" width="80" height="48" opacity="0.7" />
            <rect x="260" y="220" width="80" height="48" opacity="0.7" />
            <path d="M140 84h60l-20 56M300 108l-60 32M140 244h60l-20-56M300 220l-60-32" opacity="0.5" />
          </g>
        )}
      </svg>
    </div>
  );
}
