import { serviceSchema, type Service } from "@/lib/schemas";

/**
 * Service content. Drafted by the build team. Pricing is intentionally not
 * published (it varies by service and is handled directly with clients);
 * timelines are described only as fast delivery. Wording on scope
 * and scope is to be confirmed by QuadTricks before launch (see docs/CONTENT-TODO.md).
 */
const raw = [
  {
    slug: "web-design",
    category: "web-apps",
    index: "01",
    name: "Website Design & Development",
    shortName: "Websites",
    promise: "A website that looks like your business means it, and works on every screen.",
    description:
      "We design and build marketing websites, landing pages and company sites from scratch. Every site is designed around your content and goals, built on modern frameworks, and optimised for speed, search and mobile.",
    useCases: [
      { title: "Launch a new business", detail: "A first website that makes you look established from day one." },
      { title: "Replace an outdated site", detail: "Move off a slow template to a fast, custom-designed site you own." },
      { title: "Convert more visitors", detail: "Landing pages and service pages built around clear calls to action." },
    ],
    deliverables: [
      "Custom design for mobile, tablet and desktop",
      "Development on a modern, fast framework",
      "Search-engine-ready structure and metadata",
      "Contact forms and enquiry routing",
      "Analytics setup",
      "Deployment and hosting handover",
    ],
    process: [
      { stage: "Discover", detail: "We learn your business, audience and goals, then agree the pages and content." },
      { stage: "Design", detail: "Wireframes, then full visual design in your brand. You review and approve." },
      { stage: "Build", detail: "We develop the site, connect forms and analytics, and test on real devices." },
      { stage: "Launch", detail: "We deploy to your domain and hand over access and documentation." },
      { stage: "Support", detail: "One year of included support for fixes and small content updates." },
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "Headless CMS"],
    faq: [
      { q: "How long does a website take?", a: "We move fast and deliver your website as soon as possible. Once we understand what you need, we get started straight away." },
      { q: "Do I own the website?", a: "Yes. The design, code and content are yours. We hand over full access at launch." },
      { q: "Can I update content myself?", a: "If you want to edit content yourself, we can connect a content management system. Otherwise, small updates are covered by your included support." },
      { q: "What does the one-year support cover?", a: "Bug fixes and small content changes, such as updating text, images or adding a product. New features or pages are quoted separately." },
    ],
    seo: {
      title: "Website Design & Development",
      description: "Custom website design and development for startups and businesses in India, Dubai and worldwide. Fast, mobile-first and built to generate enquiries.",
    },
  },
  {
    slug: "web-apps",
    category: "web-apps",
    index: "02",
    name: "Web Application Development",
    shortName: "Web Apps",
    promise: "Software your team and customers use every day, built to grow with you.",
    description:
      "From customer portals and dashboards to internal tools and SaaS products, we build web applications that are secure, maintainable and pleasant to use. Design and engineering happen together, so the product works as well as it looks.",
    useCases: [
      { title: "Launch a SaaS product", detail: "Take an idea from concept to a working product customers can sign up for." },
      { title: "Replace spreadsheets and manual work", detail: "Internal tools that remove repetitive admin and reduce errors." },
      { title: "Give customers a portal", detail: "Booking, ordering, tracking or account areas connected to your business." },
    ],
    deliverables: [
      "Product discovery and feature scoping",
      "UX and UI design of every screen",
      "Frontend and backend development",
      "Authentication, roles and permissions",
      "Database design and API integration",
      "Testing, deployment and documentation",
    ],
    process: [
      { stage: "Discover", detail: "We map the users, workflows and features, and agree a first release scope." },
      { stage: "Design", detail: "We design every screen and flow so you can see the product before it is built." },
      { stage: "Build", detail: "We develop in short iterations and share working versions as we go." },
      { stage: "Launch", detail: "We deploy to the cloud, set up monitoring and hand over the source code." },
      { stage: "Support", detail: "One year of included support for bug fixes. New features are scoped separately." },
    ],
    tech: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "REST & GraphQL APIs", "AWS"],
    faq: [
      { q: "How quickly can you deliver?", a: "We move fast and deliver your application as soon as possible. Once we understand what you need, we get started straight away. A focused first release gets you live sooner." },
      { q: "Can you build an MVP first?", a: "Yes. We recommend a focused first release that proves the idea, then adding features based on real use." },
      { q: "Who owns the code?", a: "You do. The repository and infrastructure are handed over to you at launch." },
      { q: "How do you handle security?", a: "We follow standard practices: encrypted connections, hashed credentials, role-based access and regular dependency updates." },
      { q: "Will it work on mobile?", a: "Every web application we build is responsive. If you need an installable app, see our mobile app service." },
      { q: "What happens after launch?", a: "Bug fixes are covered for one year. Enhancements and new features are quoted as separate work." },
    ],
    seo: {
      title: "Web Application Development",
      description: "Custom web applications, SaaS products, dashboards and internal tools designed and developed by QuadTricks for startups and businesses.",
    },
  },
  {
    slug: "mobile-apps",
    category: "mobile-apps",
    index: "03",
    name: "Mobile Application Development",
    shortName: "Mobile Apps",
    promise: "iOS and Android apps your customers will keep on their home screen.",
    description:
      "We design and develop mobile apps for iOS and Android, from consumer apps to business tools. Cross-platform development lets us ship to both platforms from one codebase without compromising on quality or performance.",
    useCases: [
      { title: "Reach customers on their phones", detail: "Ordering, booking, loyalty or content apps for your customers." },
      { title: "Equip your team in the field", detail: "Apps for staff who work away from a desk: inspections, deliveries, sales." },
      { title: "Launch an app-first startup", detail: "A polished MVP for the App Store and Google Play." },
    ],
    deliverables: [
      "App concept and feature scoping",
      "UX and UI design following platform guidelines",
      "Cross-platform development for iOS and Android",
      "Backend, APIs and push notifications",
      "App Store and Google Play submission",
      "Analytics and crash reporting",
    ],
    process: [
      { stage: "Discover", detail: "We define the users, core features and the first release." },
      { stage: "Design", detail: "Screen-by-screen designs and a clickable prototype you can test." },
      { stage: "Build", detail: "Development with regular test builds on your own devices." },
      { stage: "Launch", detail: "Store submissions, release and handover of all accounts and code." },
      { stage: "Support", detail: "One year of included support for bug fixes and small updates." },
    ],
    tech: ["React Native", "Expo", "Flutter", "Swift", "Kotlin", "Firebase", "Node.js"],
    faq: [
      { q: "Native or cross-platform?", a: "For most apps, cross-platform gives you both stores from one codebase. We recommend native when an app depends heavily on device-specific features." },
      { q: "How quickly can you deliver?", a: "We move fast and deliver your app as soon as possible. Once we understand what you need, we get started straight away." },
      { q: "Do you handle App Store submission?", a: "Yes. We prepare the listings, screenshots and builds, and manage the review process with you." },
      { q: "Do I need a backend?", a: "Most apps do. We build or connect the backend as part of the project." },
      { q: "Can you update an existing app?", a: "Yes, after a short review of the current codebase to confirm what is involved." },
      { q: "What does support include?", a: "Bug fixes and small changes for one year. New features are quoted separately." },
    ],
    seo: {
      title: "Mobile App Development",
      description: "iOS and Android app design and development for startups and businesses in India, the UAE and worldwide.",
    },
  },
  {
    slug: "branding",
    category: "branding",
    index: "04",
    name: "Logo Design & Brand Identity",
    shortName: "Branding",
    promise: "A logo and identity that make your business recognisable and credible.",
    description:
      "We design logos and complete brand identities: colour, typography, visual language and the rules for using them. Whether you are starting out or refreshing an existing brand, you get an identity that works everywhere, from your app icon to your signage.",
    useCases: [
      { title: "Launch with a real brand", detail: "A logo and identity ready for your website, app, social media and print." },
      { title: "Refresh a dated look", detail: "Modernise an existing brand while keeping what customers recognise." },
      { title: "Unify your digital products", detail: "One consistent identity across website, app and marketing." },
    ],
    deliverables: [
      "Logo concepts and refinement rounds",
      "Final logo in all formats (SVG, PNG, PDF)",
      "Colour palette and typography system",
      "Brand guidelines document",
      "Social media and app icon versions",
      "Business card and stationery templates",
    ],
    process: [
      { stage: "Discover", detail: "We learn your business, audience and competitors, and agree the direction." },
      { stage: "Concepts", detail: "We present distinct logo directions with reasoning behind each." },
      { stage: "Refine", detail: "We develop the chosen direction and build the full identity around it." },
      { stage: "Deliver", detail: "All files, formats and guidelines handed over, ready to use." },
    ],
    tech: ["Adobe Illustrator", "Figma", "Adobe Photoshop", "Brand guideline systems"],
    faq: [
      { q: "How quickly can you deliver?", a: "We move fast and deliver your logo and identity as soon as possible. Once we understand what you need, we get started straight away." },
      { q: "How many logo concepts do I get?", a: "We present a small number of strong, distinct directions rather than many weak ones, and refine the one you choose." },
      { q: "Do I own the logo?", a: "Yes. Full rights and all source files are transferred to you on completion." },
      { q: "Can you work with my existing brand?", a: "Yes. We can refresh or extend an existing identity instead of starting over." },
      { q: "What is in the brand guidelines?", a: "Logo usage, clear space, colours, typography, imagery style and examples, so anyone can apply the brand consistently." },
    ],
    seo: {
      title: "Logo Design & Brand Identity",
      description: "Professional logo design and brand identity for startups and businesses. Logos, colour systems, typography and brand guidelines by QuadTricks.",
    },
  },
  {
    slug: "animation",
    category: "animation",
    index: "05",
    name: "Animation & Promotional Videos",
    shortName: "Animation",
    promise: "Short videos that explain your product and get people to act.",
    description:
      "We produce explainer videos, product promos, social media clips and logo animations. We combine motion design with AI-assisted production tools to deliver polished video fast, with a human directing every frame.",
    useCases: [
      { title: "Explain a product in 60 seconds", detail: "Explainer videos for your website, pitch deck or app store listing." },
      { title: "Promote on social media", detail: "Short, vertical clips designed for Instagram, LinkedIn and YouTube." },
      { title: "Bring your brand to life", detail: "Logo animations and motion graphics for intros, ads and presentations." },
    ],
    deliverables: [
      "Script and storyboard",
      "Voice-over and music",
      "Motion design and animation",
      "Formats for web, social and presentations",
      "Subtitles and captions",
      "Source files on request",
    ],
    process: [
      { stage: "Brief", detail: "We agree the message, audience, length and style." },
      { stage: "Script & storyboard", detail: "You approve the words and the visual plan before animation starts." },
      { stage: "Produce", detail: "We animate, add voice and music, and share a draft for feedback." },
      { stage: "Deliver", detail: "Final video in every format you need, with one round of revisions included." },
    ],
    tech: ["Adobe After Effects", "Adobe Premiere Pro", "Blender", "AI-assisted voice and visuals", "Figma"],
    faq: [
      { q: "How quickly can you deliver?", a: "We move fast and deliver your video as soon as possible. Once we understand what you need, we get started straight away. AI-assisted production helps us move quickly without cutting corners." },
      { q: "What does AI-assisted mean?", a: "We use AI tools for parts of production such as voice-over drafts, visual elements and faster iteration. Direction, design, editing and quality control are done by our team." },
      { q: "How long is a typical video?", a: "Most explainer and promo videos are between 30 and 90 seconds. Social clips are shorter. We advise on length during the brief." },
      { q: "Can you use my existing footage or screenshots?", a: "Yes. App screens, product photos and existing footage can all be used." },
      { q: "How many revisions are included?", a: "Script and storyboard are approved before animation, which keeps changes small. One round of revisions on the final video is included." },
    ],
    seo: {
      title: "Animation & Promotional Videos",
      description: "Explainer videos, product promos, social clips and logo animations produced by QuadTricks with motion design and AI-assisted tools.",
    },
  },
  {
    slug: "cloud",
    category: "cloud",
    index: "06",
    name: "Cloud Services & Solutions",
    shortName: "Cloud",
    promise: "Reliable hosting and deployment, so your product stays online and fast.",
    description:
      "We deploy and host websites and applications on modern cloud platforms, set up the pipelines that ship updates safely, and keep an eye on performance and cost. Whether we built your product or someone else did, we can run it properly.",
    useCases: [
      { title: "Host a new product", detail: "Infrastructure set up correctly from the start, sized for your actual traffic." },
      { title: "Fix an unreliable setup", detail: "Move off a struggling server to a stable, monitored environment." },
      { title: "Ship updates safely", detail: "Automated deployments with testing, so releases stop being stressful." },
    ],
    deliverables: [
      "Cloud architecture and setup",
      "Deployment pipelines (CI/CD)",
      "Domains, SSL and DNS",
      "Databases, storage and backups",
      "Monitoring, alerts and uptime checks",
      "Cost review and optimisation",
    ],
    process: [
      { stage: "Assess", detail: "We review your application, traffic and requirements." },
      { stage: "Design", detail: "We propose an architecture with clear running costs." },
      { stage: "Deploy", detail: "We set up the environment, pipelines, backups and monitoring." },
      { stage: "Hand over", detail: "Documentation and access are yours. We can keep managing it if you prefer." },
    ],
    tech: ["AWS", "Google Cloud", "Vercel", "Docker", "GitHub Actions", "Cloudflare", "PostgreSQL"],
    faq: [
      { q: "Which cloud provider do you use?", a: "We choose based on your needs. We commonly work with AWS, Google Cloud, Vercel and Cloudflare." },
      { q: "Can you host something you did not build?", a: "Yes, after a short assessment of the application." },
      { q: "Who owns the cloud accounts?", a: "Cloud accounts are set up in your name, so you keep full ownership and control." },
      { q: "How quickly can you set it up?", a: "We move fast and deliver your setup as soon as possible. Once we understand what you need, we get started straight away." },
      { q: "Do you offer ongoing management?", a: "Yes. Ongoing management and monitoring are available after launch." },
      { q: "What about backups and security?", a: "Backups, encryption and access control are part of every setup we deliver." },
    ],
    seo: {
      title: "Cloud Services & Solutions",
      description: "Cloud deployment, hosting, CI/CD and infrastructure management for websites and applications, by QuadTricks.",
    },
  },
] satisfies ReadonlyArray<unknown>;

export const services: Service[] = raw.map((s) => serviceSchema.parse(s));

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
