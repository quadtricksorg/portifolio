import type { Metadata } from "next";
import { site } from "@/content/site";

type SocialImage = { url: string; width: number; height: number; alt: string };

/** The generated brand card (src/app/opengraph-image.tsx). */
const DEFAULT_IMAGE: SocialImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` };

type PageSeo = {
  /** Page title; the root layout appends "| QuadTricks". Omit on the homepage. */
  title?: string;
  description: string;
  /** Path from the site root, e.g. "/services/web-apps". Becomes the canonical URL. */
  path: string;
  /** Share image; defaults to the brand card. */
  image?: SocialImage;
  /** Hide from search engines (e.g. unpublished placeholders). */
  noindex?: boolean;
};

/**
 * Complete, consistent metadata for a page: canonical URL, Open Graph and
 * Twitter cards. Page-level `openGraph` replaces the layout's object entirely,
 * so every field is set here rather than relying on inheritance.
 */
export function pageMetadata({ title, description, path, image = DEFAULT_IMAGE, noindex }: PageSeo): Metadata {
  const socialTitle = title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_IN",
      url: path,
      title: socialTitle,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [image.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/** schema.org BreadcrumbList for detail pages. */
export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
  };
}
