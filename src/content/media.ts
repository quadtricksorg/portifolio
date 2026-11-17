/**
 * Brand photography (WebP, warm-graded). Credits: docs/IMAGE-CREDITS.md.
 * Photos are atmosphere only; they never depict QuadTricks staff or clients.
 */
export type Photo = { src: string; alt: string; width: number; height: number };

const p = (file: string, width: number, height: number, alt: string): Photo => ({ src: `/images/${file}.webp`, width, height, alt });

export const photos = {
  heroRing: p("hero-ring", 2400, 1601, "A ring of light painted with sparks in the dark"),
  dunes: p("dunes", 2400, 1600, "Travellers crossing an orange desert dune"),
  deskDevices: p("desk-devices", 1800, 1125, "A dark desk with a monitor, tablet, keyboard and notebook seen from above"),
  deskTopview: p("desk-topview", 1800, 1301, "A tidy studio desk with a computer, speakers and keyboard seen from above"),
  phoneTable: p("phone-table", 1800, 1192, "A smartphone resting on a table in soft light"),
  designFlatlay: p("design-flatlay", 1800, 1350, "Branding and print design pieces laid out on a wooden table"),
  stageLights: p("stage-lights", 1800, 1200, "Beams of stage light sweeping over a crowd"),
  glassTowers: p("glass-towers", 1800, 1200, "Glass office towers seen from below against a pale sky"),
  escalator: p("escalator", 1800, 1200, "Symmetrical escalators leading up through a modern station"),
  cityNight: p("city-night", 2400, 1482, "A city skyline at dusk with lights reflecting on the water"),
  abstractCurves: p("abstract-curves", 1800, 1200, "Abstract curved architectural pattern in black and white"),
  lightTrails: p("light-trails", 2400, 1600, "Long-exposure light trails on a curving road at night"),
  starSwirl: p("star-swirl", 2400, 1600, "Star trails swirling over a night sky"),
  sparkler: p("sparkler", 2400, 1600, "A sparkler burning bright in the dark"),
  spiralGlow: p("spiral-glow", 2400, 1600, "Looking up through a spiral building towards a warm glowing light"),
  starTrails: p("star-trails", 2400, 1237, "Long-exposure star trails streaking over dark hills"),
  cityBokeh: p("city-bokeh", 2400, 1595, "Out-of-focus city lights glowing at dusk"),
} satisfies Record<string, Photo>;

/**
 * Hero slideshow: dark scenes with glowing light, in the style of the main hero image.
 * The first one is the LCP image and loads eagerly; the rest load after the page is idle.
 */
export const heroSlides: Photo[] = [photos.heroRing, photos.starSwirl, photos.sparkler, photos.spiralGlow, photos.starTrails, photos.lightTrails];

/** First-section (hero) photo for each service detail page: same glowing-light style. */
export const serviceHeroPhotos: Record<string, Photo> = {
  "web-design": photos.starSwirl,
  "web-apps": photos.starTrails,
  "mobile-apps": photos.cityBokeh,
  branding: photos.sparkler,
  animation: photos.stageLights,
  cloud: photos.spiralGlow,
};

/** Photo for each service card, keyed by service slug. */
export const servicePhotos: Record<string, Photo> = {
  "web-design": photos.deskDevices,
  "web-apps": photos.deskTopview,
  "mobile-apps": photos.phoneTable,
  branding: photos.designFlatlay,
  animation: photos.stageLights,
  cloud: photos.glassTowers,
};

/**
 * Colour treatment per service card, from the warm brand palette.
 * `tone` decides text colour: "dark" cards use light text, "light" cards use ink text.
 */
export const serviceTones: Record<string, { bg: string; tone: "dark" | "light" }> = {
  "web-design": { bg: "bg-[linear-gradient(135deg,#f86a08_0%,#c94a05_100%)]", tone: "light" },
  "web-apps": { bg: "bg-[linear-gradient(135deg,#1f1b18_0%,#0e0c0b_100%)]", tone: "dark" },
  "mobile-apps": { bg: "bg-[linear-gradient(135deg,#ffc56b_0%,#ff9a3d_100%)]", tone: "light" },
  branding: { bg: "bg-[linear-gradient(135deg,#fbf5ee_0%,#f2e6d9_100%)]", tone: "light" },
  animation: { bg: "bg-[linear-gradient(135deg,#5a1e05_0%,#2a0d02_100%)]", tone: "dark" },
  cloud: { bg: "bg-[linear-gradient(135deg,#2a2522_0%,#151210_100%)]", tone: "dark" },
};
