# QuadTricks Portfolio Website: Project Blueprint

Status: approved 2026-11-16; all 10 phases built. Content is stored as typed TypeScript modules (src/content) rather than MDX.
Date: 2026-11-16

---

## 1. Company positioning

- Name: QuadTricks
- Tagline: We build what's next
- Positioning: Creative Technology Studio (design and engineering equally strong, in-house)
- Story: four founders from different IT and creative disciplines formed one studio
- Services: Website Design & Development, Web Application Development, Mobile Application Development, Logo Design & Brand Identity, Animation & Promotional Videos (AI-assisted), Cloud Services & Solutions (deployment and hosting)
- Support promise: 1 year of included support for bug fixes and small content changes; new features and enhancements quoted separately
- Competitive advantages: one team end-to-end; design + engineering in-house; cross-market experience (India, GCC, West); 1-year included support
- Tone: confident headlines, approachable body copy, refined execution
- Spelling: British/Indian English

## 2. Target audience and markets

- Primary audience: startups and founders; small and medium businesses
- Secondary audience: established companies and enterprises
- Primary markets: India, UAE (Dubai), GCC
- Secondary markets: US, Canada, UK, worldwide
- Implications: time-zone-friendly contact (WhatsApp, email, booking link), currency-neutral copy, local SEO for India and UAE plus global reach messaging

## 3. Visual direction

- Style: modern, premium, professional. Minimal foundation, editorial scale on headlines and work, polished motion. No neon glows, glassmorphism, gradient washes or stock 3D.
- Theme: dark by default; light theme fully finished; toggle persisted; system preference respected on later visits
- Shape language: 4 to 6px radius; chamfered corner on key surfaces (derived from the logo's angled stroke); orange triangle as active/hover indicator and list marker; hairline borders at low opacity
- Gradient: one only, a faint orange light source behind the hero focal element
- Imagery: real project work first; code-generated geometric graphics (SVG/canvas) in brand language as fallback; one interactive hero element; team photos only if supplied; no stock people or AI illustrations

## 4. Colour palette

Brand (from logo)
- Ink: #0A0A0A
- Orange: #F86A08
- Off-white: #F8F8F8

Dark theme surfaces
- bg: #0A0A0A
- surface-1: #121212
- surface-2: #1A1A1A
- border: rgba(255,255,255,0.08)
- text: #F8F8F8, muted: rgba(248,248,248,0.64)

Light theme surfaces
- bg: #F8F8F8
- surface-1: #FFFFFF
- surface-2: #F0EFEC (warm grey)
- border: rgba(10,10,10,0.08)
- text: #0A0A0A, muted: rgba(10,10,10,0.64)

Accent usage: orange for one CTA per view, indicators, focus rings, small highlights. Never as large fills behind text. Contrast of orange on ink and on off-white to be verified at AA for large text; body text never set in orange.

## 5. Typography

- Headlines: Space Grotesk (variable, self-hosted)
- Body: Inter (variable, self-hosted)
- Labels, indices, tags: JetBrains Mono (variable, self-hosted)
- Scale (fluid, clamp-based): display 56 to 120px, h1 40 to 72px, h2 32 to 48px, h3 24 to 32px, body 16 to 18px, label 12 to 13px mono uppercase with letter-spacing
- Line length capped at about 70 characters for body copy

## 6. Sitemap

```
/                        Home
/about                   About: founders, story, values, team
/process                 Process: brief > design > build > launch > 1-year support
/services                Services overview
/services/web-design     Website Design & Development
/services/web-apps       Web Application Development
/services/mobile-apps    Mobile Application Development
/services/branding       Logo Design & Brand Identity
/services/animation      Animation & Promotional Videos
/services/cloud          Cloud Services & Solutions
/work                    Portfolio with category filters
/work/[slug]             Project detail / case study
/contact                 Contact
/privacy, /terms         Legal
404                      Branded not-found page
```

Reserved for later (no empty pages shipped): Clients, Testimonials, Blog/Insights, Careers.

Navigation
- Desktop: logo, Work, Services (dropdown of six), Process, About, Contact, theme toggle, "Start a project" button
- Mobile: full-screen menu with large type, animated open/close, theme toggle, contact shortcuts

## 7. Homepage wireframe

1. Hero: display headline with cycling service word settling on "what's next"; sub-line; CTAs "Start a project" and "See our work"; interactive geometric element reacting to cursor (desktop) and touch/tilt (mobile); orange light-source gradient; geometry hands off on scroll
2. Intro statement: one bold sentence; marquee strip of services and tech keywords
3. Services: six large interactive panels, staggered reveal, hover expand on desktop, stacked on mobile, each linking to its page
4. Featured Work: 3 to 4 large project panels with parallax imagery; branded "Coming soon" slots until real work exists
5. Why QuadTricks: four advantages as a scroll-pinned sequence on desktop, simple stack on mobile
6. Process: compact horizontal strip with progress indicator, linking to /process
7. Clients / testimonials: reserved, not rendered until content exists
8. CTA: "Have an idea? Let's build what's next" with email, WhatsApp, booking link
9. Footer: sitemap, contact, markets served, socials, theme toggle

## 8. Page-level requirements

About
- Founders' story (four disciplines, one studio), values, team grid (photos if supplied; geometric avatars otherwise), short process echo, CTA

Process
- Scroll-driven stage story: Discover, Design, Build, Launch, Support (1 year). Each stage: what happens, what the client gets, typical duration range phrased honestly. Pinned desktop sequence, vertical stack on mobile.

Services overview
- Six large panels with sticky index on desktop; each panel: name, one-line promise, three deliverables, link

Service detail (one template, six instances)
1. Hero: name, plain-English promise, service-specific geometric graphic, CTA
2. Who it's for: three use cases
3. What you get: deliverables checklist
4. How we work: 4 to 5 stages, 1-year support stated explicitly
5. Technologies: tag strip in mono label style
6. Related work: hidden until projects exist in that category
7. FAQ: 4 to 6 honest answers (timeline, pricing approach, code ownership, support scope)
8. CTA: service-specific enquiry form

Work
- Featured row (best project per category); six filter chips with animated grid transitions; editorial mixed grid pattern (full, half+half, two-thirds+third); category-aware frames: browser (websites, web apps), phone (mobile), square tile (branding), 16:9 with play (video), diagram tile (cloud); hover preview on desktop; scroll reveal on mobile

Project detail
- Default: hero image, title, client, category, year, services, tech tags, summary, Challenge, Solution, gallery, next project, service CTA
- Flagship optional blocks: video, before/after slider, device mockups, process timeline, verified outcome, real client quote
- Template renders only the blocks that exist

Contact
- Short form (name, email, company, service of interest, budget range optional, message), WhatsApp link, email, booking link, office locations (India, Dubai), response-time statement; success, error and loading states

## 9. Portfolio presentation strategy

- Content model per project: title, slug, client, category, year, summary, challenge, solution, outcome (optional, verified), tech[], services[], images[], video (optional), featured (bool), flagship blocks (optional)
- Content stored as typed local files (MDX + frontmatter), validated at build time
- No invented projects, clients, results or testimonials. Empty states are branded and explicit.

## 10. Animation strategy

Principles: purposeful, performant, accessible. Every animation has a reduced-motion fallback (instant state, no transforms). Scroll animations run on transform and opacity only.

- Smooth scrolling: Lenis
- Scroll-driven motion and pinned sequences: GSAP + ScrollTrigger (hero hand-off, Why QuadTricks, Process, service hero graphics)
- Layout and component animation: Motion (Framer Motion) for filter grid layout transitions, mobile menu, modals, page transitions
- Micro-interactions: CSS transitions for hover, focus, button feedback; orange triangle indicator animates on active state
- Hero element: SVG or 2D canvas geometry driven by pointer and device orientation; WebGL only if it fits a strict budget (under 150KB extra, 60fps on mid-range mobile); otherwise canvas
- Text reveal: split-line masks on headlines, triggered once per element
- Marquee: CSS animation, pauses on hover, static under reduced motion
- Touch: all hover reveals have a visible default state on touch devices; swipe for filters and horizontal strips
- Budget: animation libraries code-split per route; no animation blocks first paint

## 11. Technology stack

Options considered
1. Next.js + TypeScript + Tailwind CSS, local typed content, no database (recommended)
   - Pros: best fit for a React-heavy animated site, image optimisation built in, static generation for every page, easy route-level code splitting, simple deployment on Vercel
   - Cons: slightly larger baseline than Astro
2. Astro + React islands
   - Pros: smallest output, excellent for content-heavy sites
   - Cons: scroll-pinned sequences and shared animation state across the page fit React better; more friction for the interaction density chosen
3. Next.js + Sanity CMS
   - Pros: non-developer content editing
   - Cons: extra infrastructure and cost not needed today; content changes fall under the team's own work

Selected stack
- Framework: Next.js (latest stable, App Router), TypeScript strict
- Styling: Tailwind CSS v4 with design tokens as CSS variables; theme via data-theme attribute; no component library (custom components)
- Content: MDX + frontmatter for projects and services, validated with Zod at build time
- Animation: GSAP + ScrollTrigger, Lenis, Motion
- Forms: Next.js route handler + Resend for email notifications; spam protection via honeypot + Cloudflare Turnstile
- Images/video: next/image, AVIF/WebP, lazy loading, poster frames for video, self-hosted short previews
- Fonts: self-hosted variable fonts via next/font
- SEO: per-page metadata, Open Graph images generated per project/service, sitemap.xml, robots.txt, JSON-LD (Organization, Service, CreativeWork), canonical URLs
- Analytics: Vercel Analytics or Plausible (privacy-friendly, no cookie banner needed)
- Hosting: Vercel (preview deployments per change); domain and DNS by the client
- Upgrade path: Sanity or another headless CMS can be added later without changing the page templates

## 12. Responsive design strategy

Breakpoints (mobile-first): 320, 375, 430, 600, 1024, 1440
- 320 to 430: single column; hero geometry simplified and smaller; services and work as vertical stacks; pinned sequences become plain scroll; full-screen menu; sticky bottom "Start a project" bar
- 430 to 600: same as above with larger type and two-up tiles where content allows
- 600 to 1024: two-column grids; horizontal strips swipeable; header with condensed nav
- 1024 to 1440: full 12-column grid; pinned scroll sequences enabled; hover interactions active
- 1440+: max content width 1440 to 1536px; larger display type; wider gutters

Rules: no horizontal overflow; touch targets at least 44px; fluid type via clamp; images sized per breakpoint; tested at every breakpoint before a phase is called complete.

## 13. Required assets

Must have before launch
- Logo as SVG (primary mark; dark and light variants; favicon set)
- Company description (2 to 3 sentences) and founders' names and roles
- Contact details: email, phone, WhatsApp number, office locations (India, Dubai), social links
- Domain name and DNS access
- Booking link if used (for example a calendar tool)

Have or provide later (site works without them)
- Founders' photos (fallback: geometric avatars)
- Project assets per project: screenshots, app screens, logo samples, video files or links, client name, short description, challenge, solution, tech used, permission to publish
- Client logos with permission (fallback: section hidden)
- Testimonials, real and attributable (fallback: section hidden)
- Verified outcomes per project (fallback: outcome block hidden)
- Technology list per service (drafted by the build team; client confirms)
- FAQ answers on pricing approach, timelines, code ownership (drafted by the build team; client confirms)

Nothing in the lists above will be fabricated. Missing items produce branded empty states or hidden sections.

## 14. Development milestones

Phase 1: Project setup and architecture
Phase 2: Design system and reusable components (tokens, themes, typography, buttons, chamfered surfaces, frames, nav, footer)
Phase 3: Homepage
Phase 4: Services overview and six service pages
Phase 5: Work page and project detail template
Phase 6: About, Process, Contact (with form integration), legal, 404
Phase 7: Animations and interactions
Phase 8: Responsive optimisation across all breakpoints
Phase 9: SEO, accessibility and performance (Lighthouse, Core Web Vitals, keyboard, contrast, reduced motion)
Phase 10: Final testing and deployment preparation

Each phase is validated at mobile, tablet, laptop and desktop before the next begins.
