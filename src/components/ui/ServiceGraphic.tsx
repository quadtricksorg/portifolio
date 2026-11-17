import { cn } from "@/lib/utils";

type Slug = "web-design" | "web-apps" | "mobile-apps" | "branding" | "animation" | "cloud";

/**
 * Six code-drawn graphics, one per service, in the brand's line-and-plane
 * language. Lines draw on with a stroke-dash animation; the accent element
 * floats gently. Both animations are suppressed by the global reduced-motion rule.
 */
export function ServiceGraphic({ slug, className }: { slug: string; className?: string }) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    vectorEffect: "non-scaling-stroke" as const,
  };
  const draw = "motion-safe:[stroke-dasharray:600] motion-safe:[stroke-dashoffset:600] motion-safe:animate-[dash_1.6s_var(--ease-out-expo)_forwards]";
  const float = "motion-safe:animate-[float-y_4s_ease-in-out_infinite]";

  return (
    <svg viewBox="0 0 240 180" className={cn("h-auto w-full text-fg", className)} aria-hidden>
      {(slug as Slug) === "web-design" && (
        <g>
          <path className={draw} d="M24 20h192v140H24z M24 44h192 M40 32h6 M52 32h6 M64 32h6" {...stroke} />
          <path className={draw} d="M44 70h90 M44 86h60 M44 102h74" {...stroke} />
          <rect className={float} x="44" y="120" width="56" height="18" fill="var(--accent)" />
          <path className={draw} d="M150 70h46v46h-46z" {...stroke} />
        </g>
      )}
      {(slug as Slug) === "web-apps" && (
        <g>
          <path className={draw} d="M20 20h200v140H20z M20 40h200 M72 40v120 M20 100h52" {...stroke} />
          <path className={draw} d="M88 56h52v32H88z M156 56h48v32h-48z M88 104h116v40H88z" {...stroke} />
          <polyline className={float} points="96,136 116,118 134,126 154,108 176,116 196,100" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
          <path className={draw} d="M32 56h28 M32 68h20 M32 80h24" {...stroke} />
        </g>
      )}
      {(slug as Slug) === "mobile-apps" && (
        <g>
          <path className={draw} d="M84 12h72v156H84z M104 20h32" {...stroke} />
          <path className={draw} d="M96 40h48v32H96z M96 84h48v12H96z M96 104h48v12H96z M96 124h48v12H96z" {...stroke} />
          <rect className={float} x="96" y="146" width="48" height="12" fill="var(--accent)" />
          <path className={draw} d="M40 60h28 M40 76h20 M172 100h28 M172 116h20" {...stroke} opacity="0.5" />
        </g>
      )}
      {(slug as Slug) === "branding" && (
        <g>
          <path className={draw} d="M128 28h32v80h-32V72l-50 42v18h50l20 20H68l-24-24V96z" {...stroke} />
          <path className={float} d="M170 132v20h20z" fill="var(--accent)" />
          <path className={draw} d="M24 160h192" {...stroke} opacity="0.4" />
          <circle className={draw} cx="200" cy="36" r="12" {...stroke} opacity="0.5" />
        </g>
      )}
      {(slug as Slug) === "animation" && (
        <g>
          <path className={draw} d="M24 32h192v104H24z" {...stroke} />
          <path className={float} d="M104 60v48l40-24z" fill="var(--accent)" />
          <path className={draw} d="M24 152h24v16H24z M60 152h24v16H60z M96 152h24v16H96z M132 152h24v16h-24z M168 152h24v16h-24z" {...stroke} opacity="0.6" />
          <path className={draw} d="M40 120h40 M90 120h60" {...stroke} opacity="0.5" />
        </g>
      )}
      {(slug as Slug) === "cloud" && (
        <g>
          <path className={draw} d="M36 28h48v28H36z M156 28h48v28h-48z M96 76h48v28H96z M36 124h48v28H36z M156 124h48v28h-48z" {...stroke} />
          <path className={draw} d="M84 42h30l-18 34 M156 42h-30l18 34 M84 138h30l-18-34 M156 138h-30l18-34" {...stroke} opacity="0.5" />
          <rect className={float} x="108" y="88" width="24" height="4" fill="var(--accent)" />
          <circle cx="60" cy="42" r="3" fill="var(--accent)" className="motion-safe:animate-[pulse-soft_2.4s_ease-in-out_infinite]" />
          <circle cx="180" cy="138" r="3" fill="var(--accent)" className="motion-safe:animate-[pulse-soft_2.4s_ease-in-out_infinite_1.2s]" />
        </g>
      )}
    </svg>
  );
}
