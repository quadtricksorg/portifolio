/**
 * Visual accents per service. The site uses no background photography: depth
 * comes from colour, gradients and shapes that follow the light/dark theme.
 * Each service gets one accent from the brand palette, used for its card glow,
 * graphic panel and index.
 */
export const serviceAccents: Record<string, { color: string; soft: string }> = {
  "web-design": { color: "var(--primary)", soft: "rgba(252, 60, 41, 0.18)" },
  "web-apps": { color: "var(--lavender)", soft: "rgba(154, 185, 235, 0.2)" },
  "mobile-apps": { color: "var(--primary-glow)", soft: "rgba(255, 137, 59, 0.2)" },
  branding: { color: "var(--gold)", soft: "rgba(246, 175, 0, 0.18)" },
  animation: { color: "var(--primary)", soft: "rgba(252, 60, 41, 0.18)" },
  cloud: { color: "var(--lavender)", soft: "rgba(154, 185, 235, 0.2)" },
};
