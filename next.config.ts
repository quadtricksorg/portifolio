import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    // Serve WebP only (source assets are WebP as well).
    formats: ["image/webp"],
    // Allowed `quality` values: 75 default (marquee thumbnails), 90 for UI mockups with small text.
    qualities: [75, 90],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920, 2400],
    // Only the marquee thumbnails (240/380px) use fixed sizes; the default 16-128px
    // entries just lengthened every srcset in the HTML.
    imageSizes: [256, 384],
    // Optimised images are immutable; cache them for a year.
    minimumCacheTTL: 31536000,
  },
  // Single-page site: former top-level pages now live as homepage sections.
  async redirects() {
    return ["work", "services", "about", "process", "contact"].map((id) => ({
      source: `/${id}`,
      destination: `/#${id}`,
      permanent: true,
    }));
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
