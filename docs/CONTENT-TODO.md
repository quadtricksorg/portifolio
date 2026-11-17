# Content and asset checklist

What is still open before and after launch. Nothing on the site is fabricated; missing items are hidden or clearly labelled.

## Decided (2026-11-17)

- Logo: the redrawn vector version is approved for use.
- Founders: not named and no photos. The About page describes the studio through its four disciplines.
- Contact: info.quadtricks@gmail.com; phone and WhatsApp +91 85905 53179 and +91 95627 70735; studio in Kochi, India. No booking link, no social profiles for now.
- Pricing: not published anywhere on the site. Timelines are described only as fast delivery, as soon as possible.
- Reply-time promise "within one working day" confirmed. PrintQuote spelling and Web Apps category confirmed.
- Contact form email: Gmail SMTP with an app password, stored in `.env.local` (not committed).

## Before launch

- [ ] Final domain (currently `https://quadtricks.com` in `src/content/site.ts`). Used for canonical URLs, sitemap and social cards.
- [ ] Add `SMTP_USER` and `SMTP_PASS` to the hosting provider's environment variables.
- [ ] Live links for each project (`liveUrl` in `src/content/projects.ts`, marked TODO). The visit button appears automatically once set.
- [ ] Review and approve privacy policy and terms text (`src/app/privacy`, `src/app/terms`).
- [ ] Review service FAQ copy in `src/content/services.ts` (revision rounds for animation, technology lists per service).

## When available

- [ ] Real screenshots to replace the concept visuals in `public/work/<slug>/`, then set `conceptVisuals: false` for that project.
- [ ] Project years and technologies (optional fields; hidden until set).
- [ ] Client logos and testimonials, with permission. Sections can be added once supplied.
- [ ] Social profile links, if you create them.
