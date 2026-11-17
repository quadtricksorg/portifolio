import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  const staticPages: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/privacy"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/terms"), changeFrequency: "yearly", priority: 0.2 },
  ];
  return [
    ...staticPages,
    ...services.map((s) => ({ url: url(`/services/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...projects.map((p) => ({ url: url(`/work/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
