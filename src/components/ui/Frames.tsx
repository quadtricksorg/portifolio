import Image from "next/image";
import type { ReactNode } from "react";
import type { Category, ImageAsset } from "@/lib/schemas";
import { GeoPlaceholder } from "@/components/ui/GeoPlaceholder";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------
   Category-aware frames. Each gives a project type a presentation that
   suits its medium, so mixed media sit together in one grid.
   ------------------------------------------------------------------ */

function Media({ image, alt, sizes, priority }: { image?: ImageAsset; alt?: string; sizes: string; priority?: boolean }) {
  if (!image) return null;
  return (
    <Image
      src={image.src}
      alt={alt ?? image.alt}
      width={image.width}
      height={image.height}
      sizes={sizes}
      quality={90}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className="h-full w-full object-cover object-left-top transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.03]"
    />
  );
}

export function BrowserFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("chamfer flex h-full w-full flex-col overflow-hidden border border-border bg-surface-2", className)}>
      <div className="flex h-8 shrink-0 items-center gap-1.5 border-b border-border px-3">
        <span className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="ml-3 h-3 flex-1 rounded-sm bg-surface-3" />
      </div>
      <div className="relative flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative flex h-full w-full items-end justify-center", className)}>
      {/* Height-driven so the phone scales with its tile; width is capped for very wide tiles. */}
      <div className="relative aspect-[9/18] h-full max-h-[44rem] max-w-full overflow-hidden rounded-t-[1.75rem] border border-b-0 border-border bg-surface-2 p-1.5 pb-0">
        <div className="absolute left-1/2 top-3 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-surface-3" />
        <div className="relative h-full w-full overflow-hidden rounded-t-[1.35rem] bg-surface-3">{children}</div>
      </div>
    </div>
  );
}

export function TileFrame({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("chamfer relative h-full w-full overflow-hidden border border-border bg-surface-2", className)}>{children}</div>;
}

export function VideoFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("chamfer relative h-full w-full overflow-hidden border border-border bg-surface-2", className)}>
      {children}
      <span className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-fg transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </div>
  );
}

type ProjectFrameProps = {
  category: Category;
  image?: ImageAsset;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Picks the frame for a category and renders the cover image or a branded placeholder. */
export function ProjectFrame({ category, image, alt, className, sizes = "(min-width: 1024px) 50vw, 100vw", priority }: ProjectFrameProps) {
  const content = image ? <Media image={image} alt={alt} sizes={sizes} priority={priority} /> : <GeoPlaceholder category={category} />;

  switch (category) {
    case "web-apps":
      return (
        <BrowserFrame className={className}>
          {content}
        </BrowserFrame>
      );
    case "mobile-apps":
      return (
        <div className={cn("chamfer grid-lines relative h-full w-full overflow-hidden border border-border bg-surface-1 px-6 pt-[6%] [background-size:calc(100%/8)_100%]", className)}>
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent_70%)]" />
          <PhoneFrame>{content}</PhoneFrame>
        </div>
      );
    case "animation":
      return <VideoFrame className={className}>{content}</VideoFrame>;
    case "branding":
    case "cloud":
    default:
      return <TileFrame className={className}>{content}</TileFrame>;
  }
}
