import Link from "next/link";
import type { Project } from "@/lib/schemas";
import { categoryLabels } from "@/lib/schemas";
import { ProjectFrame } from "@/components/ui/Frames";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  /** Aspect ratio class for the frame area. */
  aspect?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Heading level for the title; use h2 when cards sit directly under the page h1. */
  headingAs?: "h2" | "h3";
};

export function ProjectCard({ project, aspect = "aspect-[4/3]", className, sizes, priority, headingAs: H = "h3" }: ProjectCardProps) {
  return (
    <Link href={`/work/${project.slug}`} className={cn("group block", className)}>
      <div className={cn("relative w-full overflow-hidden", aspect)}>
        <div className="absolute inset-0">
          <ProjectFrame category={project.category} image={project.cover} alt={`${project.title} cover`} sizes={sizes} priority={priority} />
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <H className="font-display text-[1.25rem] font-medium text-fg transition-colors group-hover:text-accent-text">{project.title}</H>
          <p className="mt-1 line-clamp-2 max-w-[48ch] text-sm text-fg-muted">
            {project.client !== project.title ? project.client : project.summary}
          </p>
        </div>
        <Label className="shrink-0 pt-1.5">
          {categoryLabels[project.category]}
          {project.year ? ` · ${project.year}` : ""}
        </Label>
      </div>
    </Link>
  );
}
