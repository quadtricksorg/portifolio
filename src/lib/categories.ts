/**
 * Portfolio categories. Kept free of zod so client components can import the
 * labels without pulling the validation library into the browser bundle.
 */
export const CATEGORIES = [
  // Websites and web apps are presented together as one category.
  "web-apps",
  "mobile-apps",
  "branding",
  "animation",
  "cloud",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const categoryLabels: Record<Category, string> = {
  "web-apps": "Web Applications",
  "mobile-apps": "Mobile Apps",
  branding: "Branding",
  animation: "Animation",
  cloud: "Cloud",
};
