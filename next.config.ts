import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Serve WebP only (source assets are WebP as well).
    formats: ["image/webp"],
    // Allowed `quality` values: 60 for large photographic backgrounds, 75 default, 90 for UI mockups with text.
    qualities: [60, 75, 90],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920, 2400],
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
