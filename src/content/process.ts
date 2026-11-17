export const processStages = [
  {
    index: "01",
    name: "Discover",
    short: "We learn your business and agree the scope.",
    detail:
      "A conversation about your business, audience and goals. We ask the questions that matter, review anything you already have, and agree what the first release should include.",
    youGet: ["A written scope", "A project plan", "A quote"],
  },
  {
    index: "02",
    name: "Design",
    short: "You see it before we build it.",
    detail:
      "Wireframes first, then full visual design in your brand, for every screen size that matters. You review and approve, so nothing is built that you have not seen.",
    youGet: ["Wireframes", "Visual designs", "A clickable prototype where useful"],
  },
  {
    index: "03",
    name: "Build",
    short: "Development in the open, with regular check-ins.",
    detail:
      "We develop in short iterations and share working versions as we go. Content, integrations and testing on real devices happen alongside, not at the end.",
    youGet: ["Working previews", "Device testing", "Progress updates"],
  },
  {
    index: "04",
    name: "Launch",
    short: "We deploy, hand over and document everything.",
    detail:
      "We deploy to your domain or app stores, set up analytics and monitoring, and hand over every account, repository and document. It is yours.",
    youGet: ["Deployment", "Full ownership", "Documentation"],
  },
  {
    index: "05",
    name: "Support",
    short: "One year of included support.",
    detail:
      "For a year after launch we fix bugs and make small content changes, such as updating text or adding a product. New features and enhancements are scoped and quoted separately.",
    youGet: ["Bug fixes for 12 months", "Small content changes", "Clear quotes for anything new"],
  },
] as const;
