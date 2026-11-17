/**
 * Site-wide configuration. Values marked TODO are placeholders awaiting
 * client-supplied details and must be replaced before launch.
 */
export const site = {
  name: "QuadTricks",
  tagline: "We build what's next",
  description:
    "QuadTricks is a creative technology studio. We design and build websites, web and mobile applications, brand identities, animated videos and cloud solutions for startups and businesses in India, the UAE and worldwide.",
  url: "https://quadtricks.com", // TODO: confirm final domain
  locale: "en-IN",
  founded: "2025", // TODO: confirm founding year
  markets: {
    primary: ["India", "UAE", "GCC"],
    secondary: ["United States", "Canada", "United Kingdom"],
  },
  contact: {
    email: "info.quadtricks@gmail.com",
    /** `display` is shown to visitors; `number` is digits only, with country code, for tel: and WhatsApp links. */
    phones: [
      { display: "+91 85905 53179", number: "918590553179" },
      { display: "+91 95627 70735", number: "919562770735" },
    ],
    /** Same numbers are on WhatsApp. */
    whatsapp: [
      { display: "+91 85905 53179", number: "918590553179" },
      { display: "+91 95627 70735", number: "919562770735" },
    ],
    /** Reply-time promise shown across the site. TODO: confirm with QuadTricks. */
    responseTime: "within one working day",
    locations: [{ city: "Kochi", country: "India" }],
  },
  /** No social profiles yet. Add URLs here and they appear in the footer automatically. */
  social: {
    linkedin: "" as string,
    instagram: "" as string,
    behance: "" as string,
    github: "" as string,
  },
  support: {
    headline: "1 year of included support",
    detail:
      "Every project includes one year of support for bug fixes and small content changes, such as adding a product or updating text. New features and enhancements are scoped and quoted separately.",
  },
  /** Single-page navigation: each item jumps to a homepage section. */
  nav: [
    { label: "Work", href: "/#work", id: "work" },
    { label: "Services", href: "/#services", id: "services" },
    { label: "Process", href: "/#process", id: "process" },
    { label: "About", href: "/#about", id: "about" },
    { label: "Contact", href: "/#contact", id: "contact" },
  ],
} as const;

export type SiteConfig = typeof site;
