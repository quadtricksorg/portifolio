// Generates the concept mockup visuals in public/work/<slug>/ for the six portfolio projects.
// Usage: node scripts/generate-concept-visuals.mjs public/work
// Text uses Windows fonts (Segoe UI, Georgia, Nirmala UI for Malayalam); run on Windows for identical output.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = process.argv[2];
const SANS = "Segoe UI, Arial, sans-serif";
const ML = "Nirmala UI, sans-serif";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const r = (x, y, w, h, fill, rx = 0, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const t = (x, y, s, size, fill, weight = 400, anchor = "start", family = SANS, extra = "") =>
  `<text x="${x}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(s)}</text>`;
const c = (x, y, rad, fill, extra = "") => `<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}" ${extra}/>`;
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`;
const bar = (x, y, w, fill, h = 14, rx = 7) => r(x, y, w, h, fill, rx);

async function png(svgStr, file) {
  // Output WebP (the site serves WebP only); flat UI art stays crisp at high quality.
  await sharp(Buffer.from(svgStr)).webp({ quality: 90, effort: 6 }).toFile(file.replace(/.png$/, ".webp"));
}
async function buf(svgStr) {
  return sharp(Buffer.from(svgStr)).png().toBuffer();
}

/* ---------------- Item illustrations ---------------- */
const folded = (x, y, w, h, base, band) =>
  // A folded garment: soft rectangle with a waistband and a fold line.
  r(x, y, w, h, base, 18) + r(x, y, w, h * 0.16, band, 18) + r(x, y + h * 0.1, w, h * 0.06, band) +
  `<path d="M${x + w * 0.5} ${y + h * 0.22} V${y + h * 0.92}" stroke="${band}" stroke-opacity="0.35" stroke-width="3"/>`;

const printItem = (x, y, w, h, a, b, i) => {
  const kinds = [
    // business cards
    () => `<g transform="rotate(-8 ${x + w / 2} ${y + h / 2})">${r(x + w * 0.12, y + h * 0.25, w * 0.6, h * 0.36, "#fff", 8, `stroke="${a}" stroke-opacity="0.2"`)}</g>` +
      r(x + w * 0.22, y + h * 0.35, w * 0.6, h * 0.36, "#fff", 8, `stroke="${a}" stroke-opacity="0.25"`) + bar(x + w * 0.28, y + h * 0.44, w * 0.26, a, 10, 5) + bar(x + w * 0.28, y + h * 0.56, w * 0.4, b, 8, 4),
    // flyer
    () => r(x + w * 0.3, y + h * 0.12, w * 0.4, h * 0.76, "#fff", 6, `stroke="${a}" stroke-opacity="0.25"`) + r(x + w * 0.34, y + h * 0.18, w * 0.32, h * 0.3, b, 4) + bar(x + w * 0.34, y + h * 0.56, w * 0.26, a, 10, 5) + bar(x + w * 0.34, y + h * 0.66, w * 0.3, a, 8, 4, ) ,
    // banner roll-up
    () => r(x + w * 0.4, y + h * 0.08, w * 0.2, h * 0.8, a, 4) + r(x + w * 0.42, y + h * 0.12, w * 0.16, h * 0.3, b, 2) + r(x + w * 0.32, y + h * 0.86, w * 0.36, h * 0.05, a, 3),
    // stickers
    () => c(x + w * 0.4, y + h * 0.45, h * 0.2, b) + c(x + w * 0.6, y + h * 0.55, h * 0.16, a) + c(x + w * 0.48, y + h * 0.68, h * 0.1, "#fff", `stroke="${a}" stroke-width="3"`),
  ];
  return kinds[i % kinds.length]();
};

const furniture = (x, y, w, h, wood, fabric, i) => {
  const kinds = [
    // sofa
    () => r(x + w * 0.12, y + h * 0.38, w * 0.76, h * 0.22, fabric, 18) + r(x + w * 0.08, y + h * 0.5, w * 0.84, h * 0.2, fabric, 16) +
      r(x + w * 0.05, y + h * 0.44, w * 0.12, h * 0.28, fabric, 14) + r(x + w * 0.83, y + h * 0.44, w * 0.12, h * 0.28, fabric, 14) +
      r(x + w * 0.14, y + h * 0.7, w * 0.04, h * 0.1, wood, 2) + r(x + w * 0.82, y + h * 0.7, w * 0.04, h * 0.1, wood, 2),
    // armchair
    () => r(x + w * 0.3, y + h * 0.25, w * 0.4, h * 0.35, fabric, 22) + r(x + w * 0.24, y + h * 0.5, w * 0.52, h * 0.18, fabric, 14) +
      r(x + w * 0.3, y + h * 0.68, w * 0.04, h * 0.14, wood, 2) + r(x + w * 0.66, y + h * 0.68, w * 0.04, h * 0.14, wood, 2),
    // dining table
    () => r(x + w * 0.15, y + h * 0.4, w * 0.7, h * 0.07, wood, 4) + r(x + w * 0.22, y + h * 0.47, w * 0.04, h * 0.33, wood, 2) + r(x + w * 0.74, y + h * 0.47, w * 0.04, h * 0.33, wood, 2) +
      c(x + w * 0.5, y + h * 0.34, h * 0.06, fabric),
    // bed
    () => r(x + w * 0.1, y + h * 0.28, w * 0.1, h * 0.45, wood, 6) + r(x + w * 0.18, y + h * 0.48, w * 0.72, h * 0.18, fabric, 10) + r(x + w * 0.22, y + h * 0.42, w * 0.18, h * 0.1, "#fff", 8) +
      r(x + w * 0.18, y + h * 0.64, w * 0.72, h * 0.06, wood, 4),
  ];
  return kinds[i % kinds.length]();
};

const leaf = (cx, cy, s, fill, vein, rot = 0) =>
  `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})"><path d="M0 -60 C 38 -40 40 30 0 60 C -40 30 -38 -40 0 -60 Z" fill="${fill}"/><path d="M0 -50 V 56 M0 -10 L 18 -26 M0 10 L -18 -6 M0 28 L 16 14" stroke="${vein}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;

/* ---------------- Website builders (1600 x 1000) ---------------- */
function siteNav(th, links) {
  // Right-aligned links with spacing based on approximate text width.
  const widths = links.map((l) => l.length * 10.5);
  let x = 1520 - widths.reduce((a, b) => a + b, 0) - 48 * (links.length - 1);
  const items = links.map((l, i) => { const s = t(x, 58, l, 20, th.ink, 500); x += widths[i] + 48; return s; }).join("");
  return r(0, 0, 1600, 100, th.bg) + th.logo(80, 50) + items + `<line x1="0" y1="100" x2="1600" y2="100" stroke="${th.ink}" stroke-opacity="0.08"/>`;
}

function catalogue(th, title, chips, item) {
  let b = r(0, 0, 1600, 1000, th.bg) + siteNav(th, th.links);
  b += t(80, 190, title, 48, th.ink, 700);
  let cx = 80;
  chips.forEach((ch, i) => {
    const w = ch.length * 11 + 44;
    b += r(cx, 225, w, 44, i === 0 ? th.ink : "transparent", 22, i === 0 ? "" : `stroke="${th.ink}" stroke-opacity="0.2"`) + t(cx + w / 2, 254, ch, 18, i === 0 ? th.bg : th.ink, 500, "middle");
    cx += w + 12;
  });
  for (let i = 0; i < 8; i++) {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 80 + col * 365, y = 310 + row * 345;
    b += r(x, y, 345, 250, th.card, 16) + item(x, y, 345, 250, i) + bar(x, y + 272, 200, th.ink) + bar(x, y + 298, 120, th.muted, 12, 6);
  }
  return svg(1600, 1000, b);
}

function contactPage(th, heading, sub, fields, side) {
  let b = r(0, 0, 1600, 1000, th.bg) + siteNav(th, th.links);
  b += t(80, 210, heading, 56, th.ink, 700) + t(80, 260, sub, 24, th.muted, 400);
  fields.forEach((f, i) => {
    const y = 320 + i * 104;
    b += t(80, y, f, 18, th.ink, 600) + r(80, y + 14, 700, 60, th.card, 10, `stroke="${th.ink}" stroke-opacity="0.12"`);
  });
  const by = 320 + fields.length * 104 + 10;
  b += r(80, by, 240, 64, th.accent, 32) + t(200, by + 41, "Send enquiry", 22, th.onAccent, 600, "middle");
  b += side;
  return svg(1600, 1000, b);
}

/* ---------------- Phone screen builders (900 x 1800) ---------------- */
const statusBar = (fg) => t(70, 70, "9:41", 30, fg, 600) + r(740, 50, 90, 26, fg, 8, 'fill-opacity="0.8"');
function screen(bg, body) {
  return svg(900, 1800, r(0, 0, 900, 1800, bg) + body);
}

async function phonesShowcase(bg, screens, file, deco = "") {
  // Three phones side by side on a 1600x1000 canvas.
  const pw = 330, ph = 660, gap = 70;
  const startX = (1600 - (pw * 3 + gap * 2)) / 2;
  const frames = [0, 1, 2].map((i) => {
    const x = startX + i * (pw + gap), y = 170 + (i === 1 ? -40 : 0);
    return r(x - 12, y - 12, pw + 24, ph + 24, "#111", 52) + r(x - 10, y - 10, pw + 20, ph + 20, "#1d1d1f", 50);
  }).join("");
  const base = await buf(svg(1600, 1000, r(0, 0, 1600, 1000, bg) + deco + frames));
  const comps = [];
  for (let i = 0; i < 3; i++) {
    const x = Math.round(startX + i * (pw + gap)), y = 170 + (i === 1 ? -40 : 0);
    const mask = Buffer.from(svg(pw, ph, r(0, 0, pw, ph, "#fff", 42)));
    const shot = await sharp(screens[i]).resize(pw, ph).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();
    comps.push({ input: shot, left: x, top: y });
  }
  await sharp(base).composite(comps).webp({ quality: 90, effort: 6 }).toFile(file.replace(/.png$/, ".webp"));
}

/* ======================================================================
   1. Ridoz Style: innerwear retail and wholesale website
   ====================================================================== */
async function ridoz(dir) {
  const th = {
    bg: "#f7efea", ink: "#22161c", muted: "#8a7a80", card: "#efe2db", accent: "#b4486f", onAccent: "#fff",
    links: ["Shop", "Wholesale", "About", "Contact"],
    logo: (x, y) => t(x, y + 10, "RIDOZ", 34, "#22161c", 800, "start", SANS, 'letter-spacing="6"') + t(x + 140, y + 10, "STYLE", 34, "#b4486f", 300, "start", SANS, 'letter-spacing="6"'),
  };
  const fold = (x, y, w, h, i) => {
    const pal = [["#e8c9c9", "#b4486f"], ["#2f2a33", "#c99aa9"], ["#d9dfe8", "#4b5d7a"], ["#f2e3c9", "#9b7a46"]][i % 4];
    return folded(x + w * 0.2, y + h * 0.18, w * 0.6, h * 0.64, pal[0], pal[1]);
  };
  // Cover: hero
  let b = r(0, 0, 1600, 1000, th.bg) + siteNav(th, th.links);
  b += t(80, 260, "NEW SEASON ESSENTIALS", 18, th.accent, 600, "start", SANS, 'letter-spacing="4"');
  b += t(80, 350, "Comfort you", 84, th.ink, 700) + t(80, 445, "wear every day.", 84, th.ink, 700);
  b += t(80, 510, "Innerwear for retail shoppers and wholesale buyers.", 26, th.muted);
  b += r(80, 560, 210, 64, th.ink, 32) + t(185, 600, "Shop now", 22, th.bg, 600, "middle");
  b += r(310, 560, 270, 64, "transparent", 32, `stroke="${th.ink}" stroke-width="2"`) + t(445, 600, "Wholesale enquiry", 22, th.ink, 600, "middle");
  b += r(860, 150, 660, 640, "#ead9d1", 28) + c(1190, 470, 250, "#e2cbc1");
  b += folded(940, 330, 230, 260, "#2f2a33", "#c99aa9") + folded(1140, 280, 260, 300, "#e8c9c9", "#b4486f") + folded(1060, 520, 280, 200, "#d9dfe8", "#4b5d7a");
  ["Bestsellers", "New arrivals", "Essentials", "Bulk packs"].forEach((l, i) => {
    const x = 80 + i * 370;
    b += r(x, 840, 350, 110, th.card, 16) + t(x + 28, 905, l, 26, th.ink, 600) + t(x + 320, 905, "→", 26, th.accent, 600, "end");
  });
  await png(svg(1600, 1000, b), join(dir, "cover.png"));
  await png(catalogue(th, "Shop the range", ["All", "Men", "Women", "Kids", "Packs"], fold), join(dir, "catalogue.png"));
  const side = r(880, 160, 640, 760, th.card, 24) + t(920, 230, "Buying in bulk?", 36, th.ink, 700) +
    t(920, 280, "Tell us what you need and we will", 22, th.muted) + t(920, 312, "get back to you with a wholesale offer.", 22, th.muted) +
    folded(980, 380, 200, 230, "#e8c9c9", "#b4486f") + folded(1200, 420, 220, 200, "#2f2a33", "#c99aa9") + folded(1060, 640, 260, 200, "#d9dfe8", "#4b5d7a");
  await png(contactPage(th, "Wholesale enquiry", "For retailers, distributors and bulk orders.", ["Business name", "Email or phone", "Products and quantities"], side), join(dir, "wholesale.png"));
}

/* ======================================================================
   2. PrintQuote: quotation website for printing shops in the GCC
   ====================================================================== */
async function printquote(dir) {
  const th = {
    bg: "#f4f7fb", ink: "#0f1f3a", muted: "#6b7a90", card: "#ffffff", accent: "#14a3c7", onAccent: "#fff",
    links: ["How it works", "Products", "For shops", "Contact"],
    logo: (x, y) => r(x, y - 22, 44, 44, "#14a3c7", 10) + t(x + 22, y + 8, "P", 26, "#fff", 800, "middle") + t(x + 60, y + 10, "PrintQuote", 32, "#0f1f3a", 700),
  };
  const field = (x, y, label, value, w = 330) => t(x, y, label, 17, th.muted, 600) + r(x, y + 12, w, 58, "#fff", 10, `stroke="${th.ink}" stroke-opacity="0.12"`) + t(x + 20, y + 50, value, 21, th.ink, 500) + t(x + w - 24, y + 50, "▾", 18, th.muted, 400, "end");
  // Cover: quote builder
  let b = r(0, 0, 1600, 1000, th.bg) + siteNav(th, th.links);
  b += t(80, 200, "Get a print quote", 56, th.ink, 700) + t(80, 248, "Choose a product and options. Your quote is ready to share.", 24, th.muted);
  b += r(80, 290, 860, 640, "#fff", 20, `stroke="${th.ink}" stroke-opacity="0.08"`);
  b += field(120, 340, "PRODUCT", "Business cards") + field(490, 340, "SIZE", "85 × 55 mm");
  b += field(120, 460, "PAPER", "350 gsm matt") + field(490, 460, "QUANTITY", "500");
  b += field(120, 580, "PRINTING", "Double sided, full colour") + field(490, 580, "FINISH", "Rounded corners");
  b += t(120, 720, "DELIVERY", 17, th.muted, 600);
  ["Pickup", "Same city", "GCC wide"].forEach((o, i) => { const x = 120 + i * 230; b += r(x, 735, 210, 58, i === 1 ? th.ink : "#fff", 29, i === 1 ? "" : `stroke="${th.ink}" stroke-opacity="0.15"`) + t(x + 105, 772, o, 20, i === 1 ? "#fff" : th.ink, 600, "middle"); });
  b += r(120, 830, 300, 64, th.accent, 32) + t(270, 870, "Generate quote", 22, "#fff", 700, "middle");
  // summary card
  b += r(990, 290, 530, 640, th.ink, 20) + t(1030, 350, "Quote summary", 30, "#fff", 700) + t(1030, 385, "Quotation QT-0001", 18, "#8fa3c2");
  ["Business cards", "350 gsm matt", "Double sided", "Rounded corners", "Same city delivery"].forEach((l, i) => {
    const y = 450 + i * 62;
    b += t(1030, y, l, 21, "#dbe4f3") + bar(1380, y - 14, 100, "#2b4166", 16, 8) + `<line x1="1030" y1="${y + 22}" x2="1480" y2="${y + 22}" stroke="#ffffff" stroke-opacity="0.08"/>`;
  });
  b += t(1030, 820, "Total", 24, "#8fa3c2", 600) + bar(1300, 798, 180, th.accent, 28, 14);
  b += r(1030, 860, 210, 50, "transparent", 25, 'stroke="#ffffff" stroke-opacity="0.3"') + t(1135, 892, "Download PDF", 18, "#fff", 600, "middle");
  b += r(1260, 860, 220, 50, "#25d366", 25) + t(1370, 892, "Share on WhatsApp", 18, "#0f1f3a", 700, "middle");
  await png(svg(1600, 1000, b), join(dir, "cover.png"));
  await png(catalogue(th, "Products", ["All", "Cards", "Flyers", "Banners", "Stickers"], (x, y, w, h, i) => printItem(x, y, w, h, th.ink, th.accent, i)), join(dir, "products.png"));
  // shops dashboard
  let d = r(0, 0, 1600, 1000, th.bg) + siteNav(th, th.links);
  d += t(80, 200, "Your quotations", 48, th.ink, 700) + r(1280, 160, 240, 60, th.accent, 30) + t(1400, 198, "New quote", 22, "#fff", 700, "middle");
  ["Sent", "Viewed", "Accepted", "Drafts"].forEach((l, i) => { const x = 80 + i * 365; d += r(x, 250, 345, 140, "#fff", 16, `stroke="${th.ink}" stroke-opacity="0.08"`) + t(x + 30, 300, l, 22, th.muted, 600) + bar(x + 30, 330, 120, i === 2 ? th.accent : th.ink, 28, 8); });
  d += r(80, 420, 1440, 520, "#fff", 16, `stroke="${th.ink}" stroke-opacity="0.08"`);
  ["Customer", "Product", "Quantity", "Status"].forEach((h, i) => (d += t(120 + i * 360, 475, h.toUpperCase(), 16, th.muted, 700)));
  for (let i = 0; i < 6; i++) {
    const y = 520 + i * 68;
    d += `<line x1="100" y1="${y - 26}" x2="1500" y2="${y - 26}" stroke="${th.ink}" stroke-opacity="0.06"/>` + bar(120, y, 220, th.ink, 14) + bar(480, y, 180, th.muted, 14) + bar(840, y, 80, th.muted, 14);
    const st = [["Accepted", "#dff6ec", "#1a8a5a"], ["Viewed", "#e3f3fa", "#14a3c7"], ["Sent", "#eef1f6", "#6b7a90"]][i % 3];
    d += r(1200, y - 14, 130, 40, st[1], 20) + t(1265, y + 13, st[0], 17, st[2], 700, "middle");
  }
  await png(svg(1600, 1000, d), join(dir, "dashboard.png"));
}

/* ======================================================================
   3. Noor Al Rida: furniture shop website (UAE)
   ====================================================================== */
async function noor(dir) {
  const th = {
    bg: "#f3ece2", ink: "#2c2219", muted: "#857563", card: "#e9dfd1", accent: "#6b7a4f", onAccent: "#fff",
    links: ["Living", "Dining", "Bedroom", "Visit us"],
    logo: (x, y) => t(x, y + 10, "Noor Al Rida", 34, "#2c2219", 600, "start", "Georgia, serif") + t(x + 248, y + 10, "FURNITURE", 14, "#6b7a4f", 700, "start", SANS, 'letter-spacing="3"'),
  };
  const wood = "#8a5a3b", fabrics = ["#b9a68a", "#6b7a4f", "#c7b9a6", "#a0705a"];
  let b = r(0, 0, 1600, 1000, th.bg) + siteNav(th, th.links);
  b += r(0, 100, 1600, 900, "#ece2d4");
  b += t(80, 300, "Furniture for the", 76, th.ink, 600, "start", "Georgia, serif") + t(80, 390, "way you live.", 76, th.ink, 600, "start", "Georgia, serif");
  b += t(80, 455, "Living, dining and bedroom furniture, in the UAE.", 26, th.muted);
  b += r(80, 510, 240, 64, th.ink, 6) + t(200, 550, "Explore the range", 21, "#f3ece2", 600, "middle");
  b += r(340, 510, 200, 64, "transparent", 6, `stroke="${th.ink}" stroke-width="2"`) + t(440, 550, "Visit the shop", 21, th.ink, 600, "middle");
  // room scene
  b += r(780, 150, 760, 600, "#e3d6c4", 8) + r(1240, 200, 220, 260, "#f7f1e8", 4, `stroke="${wood}" stroke-width="6"`) + c(1350, 290, 50, "#d9c7ae");
  b += r(780, 640, 760, 110, "#d6c5ae", 0);
  b += furniture(820, 300, 600, 420, wood, "#6b7a4f", 0);
  b += `<path d="M1450 640 v-170 M1450 470 c-30-40-50-60-20-90 M1450 470 c30-40 50-60 20-90 M1450 520 c-40-20-60-30-50-60" stroke="#6b7a4f" stroke-width="6" fill="none"/>` + r(1420, 620, 60, 40, wood, 4);
  [["Living room", 0], ["Dining", 2], ["Bedroom", 3], ["Office", 1]].forEach(([l, k], i) => { const x = 80 + i * 370; b += r(x, 800, 350, 150, th.card, 6) + furniture(x + 200, 810, 140, 130, wood, fabrics[i], k) + t(x + 28, 885, l, 26, th.ink, 600, "start", "Georgia, serif"); });
  await png(svg(1600, 1000, b), join(dir, "cover.png"));
  await png(catalogue(th, "Living room", ["All", "Sofas", "Armchairs", "Tables", "Beds"], (x, y, w, h, i) => furniture(x, y, w, h, wood, fabrics[i % 4], i)), join(dir, "catalogue.png"));
  const side = r(880, 160, 640, 760, th.card, 8) + t(920, 230, "Visit our showroom", 36, th.ink, 600, "start", "Georgia, serif") + t(920, 280, "See and feel the pieces in person.", 22, th.muted) +
    r(920, 330, 560, 330, "#dccdb8", 6) + `<path d="M920 500 Q1100 430 1200 520 T1480 470" stroke="#f3ece2" stroke-width="18" fill="none"/>` + `<path d="M1040 330 V660 M1300 330 V660" stroke="#f3ece2" stroke-width="10"/>` +
    `<path d="M1190 430 c0-30 40-30 40 0 c0 30-20 40-20 60 c0-20-20-30-20-60z" fill="${th.accent}"/>` + c(1210, 432, 8, "#f3ece2") +
    t(920, 720, "Opening hours", 20, th.ink, 700) + bar(920, 740, 260, th.muted, 12, 6) + bar(920, 770, 200, th.muted, 12, 6);
  await png(contactPage(th, "Get in touch", "Ask about a piece, delivery or a custom order.", ["Your name", "Phone or email", "What are you looking for?"], side), join(dir, "contact.png"));
}

/* ======================================================================
   4. MediPlant: medicinal plants learning app (UAE students)
   ====================================================================== */
async function mediplant(dir) {
  const G = "#1f6f4a", M = "#e7f4ec", D = "#123a28", Y = "#f2c14e";
  const plants = [["Sidr", "Ziziphus spina-christi"], ["Ghaf", "Prosopis cineraria"], ["Aloe vera", "Aloe barbadensis"], ["Harmal", "Rhazya stricta"]];
  // Home
  let h = statusBar(D) + t(70, 170, "Hello, learner", 36, "#5d7f6c", 500) + t(70, 230, "Discover plants", 56, D, 800);
  h += r(70, 280, 760, 90, "#fff", 45) + c(130, 325, 18, "none", `stroke="${G}" stroke-width="5"`) + t(170, 337, "Search plants or benefits", 30, "#8aa595");
  h += r(70, 410, 760, 420, G, 40) + t(120, 480, "PLANT OF THE DAY", 22, "#bfe3cf", 700, "start", SANS, 'letter-spacing="3"') + t(120, 550, "Sidr", 64, "#fff", 800) + t(120, 600, "Ziziphus spina-christi", 28, "#cfe9db", 400, "start", SANS, 'font-style="italic"');
  h += r(120, 650, 220, 70, Y, 35) + t(230, 696, "Learn more", 26, D, 700, "middle");
  h += leaf(640, 600, 2.2, "#4fae7d", "#1f6f4a", 20) + leaf(560, 680, 1.4, "#7fcfa2", "#1f6f4a", -30);
  h += t(70, 900, "Categories", 36, D, 800);
  ["Skin care", "Digestion", "Immunity"].forEach((cname, i) => { const x = 70 + i * 260; h += r(x, 930, 240, 110, "#fff", 28) + t(x + 120, 995, cname, 26, D, 600, "middle"); });
  h += t(70, 1120, "Native to the UAE", 36, D, 800);
  plants.slice(1).forEach(([n, l], i) => { const y = 1150 + i * 170; h += r(70, y, 760, 150, "#fff", 30) + r(90, y + 20, 110, 110, M, 24) + leaf(145, y + 75, 0.8, "#4fae7d", G, 15) + t(230, y + 70, n, 34, D, 700) + t(230, y + 112, l, 24, "#7a9586", 400, "start", SANS, 'font-style="italic"') + t(790, y + 88, "›", 50, G, 400, "end"); });
  h += r(0, 1690, 900, 110, "#fff") + ["Home", "Learn", "Quiz", "Saved"].map((l, i) => t(112 + i * 225, 1760, l, 24, i === 0 ? G : "#9ab0a3", 700, "middle")).join("");
  const home = screen(M, h);
  // Detail
  let d = statusBar("#fff") + r(0, 0, 900, 760, G) + statusBar("#fff") + t(70, 170, "‹  Back", 30, "#cfe9db", 600);
  d += leaf(450, 440, 4, "#4fae7d", "#cfe9db", 10) + leaf(300, 520, 2, "#7fcfa2", "#cfe9db", -35) + leaf(620, 540, 1.8, "#7fcfa2", "#cfe9db", 40);
  d += r(0, 720, 900, 1080, "#fff", 50) + t(70, 830, "Sidr", 64, D, 800) + t(70, 880, "Ziziphus spina-christi", 28, "#7a9586", 400, "start", SANS, 'font-style="italic"');
  ["Overview", "Benefits", "Where it grows"].forEach((tab, i) => { const x = 70 + i * 250; d += r(x, 930, 230, 70, i === 1 ? G : M, 35) + t(x + 115, 975, tab, 24, i === 1 ? "#fff" : G, 700, "middle"); });
  for (let i = 0; i < 4; i++) { const y = 1060 + i * 130; d += r(70, y, 760, 110, M, 26) + c(130, y + 55, 26, i % 2 ? Y : "#4fae7d") + bar(180, y + 36, 420, D, 16, 8) + bar(180, y + 66, 300, "#9ab0a3", 14, 7); }
  d += r(70, 1600, 760, 100, D, 50) + t(450, 1663, "Take the quiz", 32, "#fff", 700, "middle");
  const detail = screen("#fff", d);
  // Quiz
  let q = statusBar(D) + t(70, 170, "Quiz", 56, D, 800) + t(830, 170, "3 / 10", 30, G, 700, "end") + r(70, 210, 760, 16, "#cde7d8", 8) + r(70, 210, 228, 16, G, 8);
  q += r(70, 280, 760, 520, "#fff", 40) + leaf(450, 470, 2.4, "#4fae7d", G, 0) + t(450, 690, "Which plant is the national", 34, D, 700, "middle") + t(450, 740, "tree of the UAE?", 34, D, 700, "middle");
  ["Sidr", "Ghaf", "Date palm", "Neem"].forEach((o, i) => { const y = 860 + i * 150; const ok = i === 1; q += r(70, y, 760, 120, ok ? "#d8f1e3" : "#fff", 30, ok ? `stroke="${G}" stroke-width="4"` : "") + c(140, y + 60, 24, ok ? G : "none", ok ? "" : `stroke="#9ab0a3" stroke-width="4"`) + t(190, y + 72, o, 34, D, 600); });
  q += r(70, 1500, 760, 110, G, 55) + t(450, 1568, "Next question", 32, "#fff", 700, "middle");
  const quiz = screen(M, q);

  await png(home, join(dir, "cover.png"));
  await phonesShowcase("#dcefe4", [await buf(detail), await buf(home), await buf(quiz)], join(dir, "screens.png"),
    leaf(150, 820, 3, "#c4e6d2", "#dcefe4", -20) + leaf(1460, 220, 2.6, "#c4e6d2", "#dcefe4", 30));
}

/* ======================================================================
   5. RestaurantMenu: QR code menu app
   ====================================================================== */
async function restaurant(dir) {
  const BG = "#161412", A = "#f2a541", W = "#f6efe6", Mu = "#a59d93", Cd = "#24201c";
  const qr = (x, y, s) => {
    let g = r(x, y, s, s, "#fff", 18);
    const n = 9, cell = (s - 40) / n;
    const seed = [1,0,1,1,0,1,0,0,1, 0,1,1,0,1,0,1,1,0, 1,1,0,1,0,0,1,0,1, 0,0,1,1,1,0,1,1,0, 1,0,1,0,1,1,0,0,1, 1,1,0,0,1,0,1,0,1, 0,1,1,1,0,1,0,1,0, 1,0,0,1,1,0,1,1,1, 0,1,1,0,1,1,0,1,0];
    seed.forEach((v, i) => { if (v) g += r(x + 20 + (i % n) * cell, y + 20 + Math.floor(i / n) * cell, cell - 2, cell - 2, BG, 2); });
    [[0, 0], [n - 3, 0], [0, n - 3]].forEach(([cx, cy]) => { g += r(x + 20 + cx * cell, y + 20 + cy * cell, cell * 3 - 2, cell * 3 - 2, BG, 6) + r(x + 20 + cx * cell + cell * 0.6, y + 20 + cy * cell + cell * 0.6, cell * 1.8 - 2, cell * 1.8 - 2, "#fff", 4) + r(x + 20 + cx * cell + cell, y + 20 + cy * cell + cell, cell - 2, cell - 2, BG, 2); });
    return g;
  };
  const dish = (cx, cy, rad, sauce) => c(cx, cy, rad, "#efe6d8") + c(cx, cy, rad * 0.72, sauce) + c(cx - rad * 0.2, cy - rad * 0.15, rad * 0.18, "#7fb069") + c(cx + rad * 0.25, cy + rad * 0.1, rad * 0.14, "#e4572e");
  // Scan
  let s = statusBar(W) + t(450, 190, "Scan to see the menu", 44, W, 800, "middle") + t(450, 245, "Point your camera at the table QR code", 28, Mu, 400, "middle");
  s += r(150, 420, 600, 600, "#2a2622", 40) + qr(250, 520, 400);
  const corner = (x, y, dx, dy) => `<path d="M${x} ${y + dy * 90} V${y} H${x + dx * 90}" stroke="${A}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  s += corner(150, 420, 1, 1) + corner(750, 420, -1, 1) + `<path d="M150 930 V1020 H240 M750 930 V1020 H660" stroke="${A}" stroke-width="12" fill="none" stroke-linecap="round"/>` + r(170, 760, 560, 6, A, 3, 'opacity="0.8"');
  s += r(150, 1130, 600, 110, Cd, 55) + t(450, 1198, "Or enter table code", 30, W, 600, "middle");
  s += c(450, 1500, 80, A) + c(450, 1500, 62, BG) + c(450, 1500, 48, A);
  const scan = screen(BG, s);
  // Menu
  let m = statusBar(W) + t(70, 170, "Table 12", 28, A, 700) + t(70, 235, "Today's menu", 56, W, 800);
  ["Starters", "Mains", "Desserts", "Drinks"].forEach((ch, i) => { const w = ch.length * 17 + 60, x = 70 + [0, 190, 350, 540][i]; m += r(x, 280, w, 72, i === 1 ? A : Cd, 36) + t(x + w / 2, 327, ch, 26, i === 1 ? BG : W, 700, "middle"); });
  const sauces = ["#c0392b", "#d68910", "#8e5a2b", "#a93226", "#b9770e"];
  for (let i = 0; i < 5; i++) { const y = 400 + i * 230; m += r(70, y, 760, 200, Cd, 32) + dish(175, y + 100, 75, sauces[i]) + bar(290, y + 60, 300, W, 20, 10) + bar(290, y + 100, 420, Mu, 14, 7) + bar(290, y + 128, 340, Mu, 14, 7) + bar(290, y + 160, 110, A, 18, 9) + c(770, y + 160, 26, A) + t(770, y + 171, "+", 34, BG, 700, "middle"); }
  m += r(70, 1600, 760, 110, A, 55) + t(450, 1668, "View order (2 items)", 32, BG, 800, "middle");
  const menu = screen(BG, m);
  // Item detail
  let it = r(0, 0, 900, 820, "#2a2622") + dish(450, 440, 270, "#c0392b") + statusBar(W) + c(110, 160, 40, "rgba(0,0,0,0.4)") + t(110, 172, "‹", 40, W, 700, "middle");
  it += r(0, 780, 900, 1020, BG, 50) + t(70, 890, "Chef's special", 26, A, 700) + t(70, 960, "Grilled chicken platter", 48, W, 800);
  it += bar(70, 1010, 700, Mu, 16, 8) + bar(70, 1045, 640, Mu, 16, 8) + bar(70, 1080, 420, Mu, 16, 8);
  ["Mild", "Medium", "Spicy"].forEach((o, i) => { const x = 70 + i * 250; it += r(x, 1150, 230, 80, i === 1 ? A : Cd, 40) + t(x + 115, 1202, o, 28, i === 1 ? BG : W, 700, "middle"); });
  it += r(70, 1290, 760, 130, Cd, 30) + t(110, 1368, "Add a note for the kitchen", 28, Mu);
  it += r(70, 1600, 260, 110, Cd, 55) + t(140, 1668, "−", 40, W, 700, "middle") + t(200, 1668, "1", 34, W, 700, "middle") + t(260, 1668, "+", 40, W, 700, "middle") + r(360, 1600, 470, 110, A, 55) + t(595, 1668, "Add to order", 32, BG, 800, "middle");
  const item = screen(BG, it);

  await png(menu, join(dir, "cover.png"));
  await phonesShowcase("#221e1a", [await buf(scan), await buf(menu), await buf(item)], join(dir, "screens.png"),
    c(160, 160, 220, "#2b2621") + c(1480, 880, 260, "#2b2621"));
}

/* ======================================================================
   6. EasyBasket: bilingual (English/Malayalam) visual shopping list app
   ====================================================================== */
async function easybasket(dir) {
  const BG = "#fff8ec", T = "#0e9f8e", Y = "#ffd166", D = "#1d3557", Mu = "#7d8597";
  const icon = {
    milk: (x, y) => `<path d="M${x - 40} ${y - 30} l20 -40 h40 l20 40 v90 h-80z" fill="#fff" stroke="${D}" stroke-width="5"/>` + r(x - 40, y + 10, 80, 30, "#5fa8d3"),
    rice: (x, y) => `<path d="M${x - 50} ${y - 50} h100 l-10 110 h-80z" fill="#f4e3c1" stroke="${D}" stroke-width="5"/>` + r(x - 30, y - 10, 60, 30, "#e9c46a"),
    bread: (x, y) => `<path d="M${x - 55} ${y + 50} v-60 a55 40 0 0 1 110 0 v60z" fill="#e0a458" stroke="${D}" stroke-width="5"/>` + `<path d="M${x - 25} ${y - 5} l10 15 M${x + 5} ${y - 10} l10 15" stroke="${D}" stroke-width="4"/>`,
    eggs: (x, y) => `<ellipse cx="${x - 22}" cy="${y + 10}" rx="28" ry="38" fill="#fff" stroke="${D}" stroke-width="5"/><ellipse cx="${x + 26}" cy="${y + 4}" rx="28" ry="38" fill="#fdf0d5" stroke="${D}" stroke-width="5"/>`,
    apple: (x, y) => c(x, y + 10, 50, "#e63946", `stroke="${D}" stroke-width="5"`) + `<path d="M${x} ${y - 40} q5 -20 20 -25" stroke="${D}" stroke-width="5" fill="none"/>` + leaf(x + 20, y - 50, 0.3, "#2a9d8f", "#2a9d8f", 50),
    pencil: (x, y) => `<g transform="rotate(-35 ${x} ${y})">${r(x - 70, y - 14, 120, 28, Y, 4, `stroke="${D}" stroke-width="5"`)}<path d="M${x + 50} ${y - 14} l30 14 l-30 14z" fill="#f4e3c1" stroke="${D}" stroke-width="5"/>${r(x - 82, y - 14, 14, 28, "#e76f51", 3)}</g>`,
    notebook: (x, y) => r(x - 45, y - 55, 90, 115, "#457b9d", 8, `stroke="${D}" stroke-width="5"`) + r(x - 25, y - 30, 50, 14, "#fff", 4) + [0, 1, 2, 3, 4].map((k) => c(x - 45, y - 40 + k * 24, 6, "#fff", `stroke="${D}" stroke-width="3"`)).join(""),
    soap: (x, y) => r(x - 55, y - 30, 110, 70, "#a8dadc", 30, `stroke="${D}" stroke-width="5"`) + c(x + 40, y - 45, 12, "#fff", `stroke="${D}" stroke-width="3"`) + c(x + 58, y - 62, 8, "#fff", `stroke="${D}" stroke-width="3"`),
  };
  const items = [["milk", "Milk", "പാൽ"], ["rice", "Rice", "അരി"], ["bread", "Bread", "ബ്രെഡ്"], ["eggs", "Eggs", "മുട്ട"], ["apple", "Apple", "ആപ്പിൾ"], ["soap", "Soap", "സോപ്പ്"], ["pencil", "Pencil", "പെൻസിൽ"], ["notebook", "Notebook", "നോട്ട്ബുക്ക്"]];
  const toggle = (x, y, ml) => r(x, y, 300, 70, "#fff", 35, `stroke="${D}" stroke-opacity="0.1"`) + r(ml ? x + 120 : x + 6, y + 6, ml ? 174 : 110, 58, T, 29) + t(x + 61, y + 46, "EN", 26, ml ? D : "#fff", 800, "middle") + t(x + 207, y + 46, "മലയാളം", 26, ml ? "#fff" : D, 700, "middle", ML);
  // Grid of items (cover)
  let g = statusBar(D) + t(70, 180, "EasyBasket", 52, D, 800) + toggle(530, 130, false);
  g += t(70, 260, "Tap a picture to add it", 30, Mu, 500);
  items.forEach(([k, en, ml], i) => {
    const col = i % 2, row = Math.floor(i / 2), x = 70 + col * 390, y = 300 + row * 330;
    const added = i === 0 || i === 3 || i === 6;
    g += r(x, y, 370, 305, "#fff", 36, added ? `stroke="${T}" stroke-width="6"` : `stroke="${D}" stroke-opacity="0.08"`) + icon[k](x + 185, y + 120) + t(x + 185, y + 235, en, 32, D, 700, "middle") + t(x + 185, y + 278, ml, 28, Mu, 500, "middle", ML);
    if (added) g += c(x + 320, y + 50, 30, T) + `<path d="M${x + 306} ${y + 50} l10 10 l18 -20" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  });
  g += r(70, 1640, 760, 110, T, 55) + t(450, 1708, "View my list  ·  3 items", 32, "#fff", 800, "middle");
  const grid = screen(BG, g);
  // Categories (Malayalam)
  let cat = statusBar(D) + t(70, 180, "വിഭാഗങ്ങൾ", 52, D, 700, "start", ML) + toggle(530, 130, true) + t(70, 260, "Categories", 30, Mu, 500);
  [["പലചരക്ക്", "Groceries", "rice", "#ffe8cc"], ["പഴങ്ങൾ", "Fruits", "apple", "#ffd6d6"], ["പാലുൽപ്പന്നങ്ങൾ", "Dairy", "milk", "#d8eefe"], ["സ്റ്റേഷനറി", "Stationery", "notebook", "#e2e8f7"], ["വീട്ടുസാധനങ്ങൾ", "Household", "soap", "#d9f2ef"]].forEach(([ml, en, k, col], i) => {
    const y = 310 + i * 260;
    cat += r(70, y, 760, 230, col, 40) + icon[k](190, y + 115) + t(320, y + 105, ml, 40, D, 700, "start", ML) + t(320, y + 160, en, 30, Mu, 500) + t(790, y + 135, "›", 60, D, 400, "end");
  });
  const categories = screen(BG, cat);
  // List
  let l = statusBar(D) + t(70, 180, "My list", 52, D, 800) + t(830, 180, "Share", 30, T, 700, "end") + t(70, 250, "Saturday shopping", 30, Mu, 500);
  [["milk", "Milk", "പാൽ", "2 packets", true], ["eggs", "Eggs", "മുട്ട", "1 tray", true], ["rice", "Rice", "അരി", "5 kg", false], ["bread", "Bread", "ബ്രെഡ്", "1", false], ["pencil", "Pencil", "പെൻസിൽ", "4", false], ["notebook", "Notebook", "നോട്ട്ബുക്ക്", "2", false]].forEach(([k, en, ml, qty, done], i) => {
    const y = 300 + i * 205;
    l += r(70, y, 760, 180, "#fff", 34, `stroke="${D}" stroke-opacity="0.08"`) + `<g transform="translate(${170} ${y + 90}) scale(0.7) translate(${-170} ${-(y + 90)})">${icon[k](170, y + 90)}</g>`;
    l += t(270, y + 80, en, 34, done ? Mu : D, 700, "start", SANS, done ? 'text-decoration="line-through"' : "") + t(270, y + 128, ml, 28, Mu, 500, "start", ML) + t(640, y + 100, qty, 28, D, 600, "end");
    l += c(740, y + 90, 34, done ? T : "#fff", done ? "" : `stroke="${D}" stroke-opacity="0.25" stroke-width="4"`) + (done ? `<path d="M724 ${y + 90} l12 12 l22 -24" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round"/>` : "");
  });
  l += r(70, 1580, 760, 120, Y, 60) + t(450, 1655, "+ Add item  ·  സാധനം ചേർക്കുക", 30, D, 800, "middle", `${ML}`);
  const list = screen(BG, l);

  await png(grid, join(dir, "cover.png"));
  await phonesShowcase("#ffefd2", [await buf(categories), await buf(grid), await buf(list)], join(dir, "screens.png"),
    c(140, 860, 200, "#ffe2ad") + c(1470, 160, 220, "#d7f0ec"));
}

const jobs = { "ridoz-style": ridoz, printquote, "noor-al-rida": noor, mediplant, "restaurant-menu": restaurant, easybasket };
for (const [slug, fn] of Object.entries(jobs)) {
  const dir = join(OUT, slug);
  mkdirSync(dir, { recursive: true });
  await fn(dir);
  console.log("done", slug);
}
