/**
 * About page content. The founders prefer not to be named publicly, so the
 * page describes the studio through its four disciplines rather than people.
 */
export const story = {
  headline: "Four disciplines. One studio.",
  lead: "QuadTricks began when four people from different corners of technology and creative work decided they would rather build together than apart.",
  body: [
    "Between us, we cover the whole journey of a digital product: how it looks, how it works, how it is built and where it runs. Most clients used to need several agencies for that. We wanted to be the one team that could do all of it properly.",
    "The name says it plainly. Four people, four skill sets, one way of working: design and engineering at the same table from the first conversation to long after launch.",
  ],
};

/** Capability pillars shown as the "four" in the founding story. */
export const pillars = [
  { index: "01", title: "Design", text: "Brand identity, interface design and the visual systems that hold a product together." },
  { index: "02", title: "Engineering", text: "Websites, web applications and mobile apps, built with modern, maintainable technology." },
  { index: "03", title: "Motion", text: "Animation, promotional video and the micro-interactions that make products feel alive." },
  { index: "04", title: "Cloud", text: "Deployment, hosting and infrastructure that keeps everything fast, secure and online." },
] as const;

export const values = [
  { title: "Honest by default", text: "We tell you plainly what you need, and whether you need it at all. No invented numbers, no borrowed logos." },
  { title: "Craft in the details", text: "Spacing, loading states, error messages, edge cases. The parts most people never notice are where quality lives." },
  { title: "Yours to keep", text: "Code, designs, accounts and files belong to you. We hand everything over and document it." },
  { title: "In it for the long run", text: "A year of included support is how we start, and we are here for whatever comes next." },
] as const;
