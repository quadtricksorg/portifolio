import { useId } from "react";
import { MARK_PATH, TRIANGLE_PATH } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type EmblemProps = {
  className?: string;
  /** Number of depth layers. Fewer layers on small screens keeps paint cheap. */
  depth?: number;
};

/**
 * Faux-3D QuadTricks emblem, inspired by the sample site's WebGL logo but drawn
 * as a single static SVG: chrome face gradient, stacked depth layers for the
 * extrusion, a bevel highlight and a glowing triangle. It is painted once;
 * any motion is applied by the parent as a GPU transform.
 */
export function Emblem({ className, depth = 12 }: EmblemProps) {
  const id = useId().replace(/:/g, "");
  const layers = Array.from({ length: depth }, (_, i) => depth - i);

  return (
    <svg viewBox="-18 -14 150 136" aria-hidden className={cn("h-auto w-full overflow-visible", className)}>
      <defs>
        <linearGradient id={`face-${id}`} x1="1" y1="0" x2="0.15" y2="1">
          <stop offset="0" stopColor="#c3cdf3" />
          <stop offset="0.42" stopColor="#d99aae" />
          <stop offset="0.78" stopColor="#f0533f" />
          <stop offset="1" stopColor="#fc3c29" />
        </linearGradient>
        <linearGradient id={`side-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--emblem-side-1)" />
          <stop offset="1" stopColor="var(--emblem-side-2)" />
        </linearGradient>
        <linearGradient id={`tri-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff6a4d" />
          <stop offset="1" stopColor="#e3260f" />
        </linearGradient>
        <radialGradient id={`glow-${id}`}>
          <stop offset="0" stopColor="#fc3c29" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fc3c29" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`edge-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="0.6" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Glow pools behind the shape */}
      <ellipse cx="34" cy="70" rx="38" ry="30" fill={`url(#glow-${id})`} />
      <ellipse cx="100" cy="90" rx="26" ry="22" fill={`url(#glow-${id})`} />

      {/* Extrusion: stacked copies offset down-right */}
      {layers.map((i) => (
        <path key={`m${i}`} d={MARK_PATH} transform={`translate(${i * 0.75} ${i * 0.75})`} fill={`url(#side-${id})`} />
      ))}
      {layers.map((i) => (
        <path key={`t${i}`} d={TRIANGLE_PATH} transform={`translate(${i * 0.75} ${i * 0.75})`} fill="#8f1a0c" />
      ))}

      {/* Front faces */}
      <path d={MARK_PATH} fill={`url(#face-${id})`} />
      <path d={MARK_PATH} fill="none" stroke={`url(#edge-${id})`} strokeWidth="0.7" strokeLinejoin="round" />
      <path d={TRIANGLE_PATH} fill={`url(#tri-${id})`} />
      <path d="M92 80 L108 96" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="0.6" />
      {/* Bright bevel along the inner diagonal, as in the sample render */}
      <path d="M66 34 L28 66 V80 H62 L78 96" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.9" strokeLinejoin="round" />
    </svg>
  );
}
