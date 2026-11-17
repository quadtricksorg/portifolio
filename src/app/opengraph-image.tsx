import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card for every page without its own image. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#f8f8f8",
          padding: 80,
          position: "relative",
        }}
      >
        {/* Large outlined mark on the right; the image renderer does not support soft radial gradients. */}
        <svg width="560" height="510" viewBox="-6 -6 122 112" style={{ position: "absolute", right: -40, top: 40 }}>
          <path d="M66 0H88V62H66V34L28 66V80H62L78 96H18L0 76V52Z" fill="none" stroke="rgba(248,248,248,0.08)" strokeWidth="0.6" />
          <path d="M72 -6H94V56H72V28L34 60V74H68L84 90H24L6 70V46Z" fill="none" stroke="rgba(248,248,248,0.14)" strokeWidth="0.6" />
          <path d="M92 80V96H108Z" fill="rgba(248,106,8,0.9)" />
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="66" height="60" viewBox="0 0 110 100">
            <path d="M66 0H88V62H66V34L28 66V80H62L78 96H18L0 76V52Z" fill="#f8f8f8" />
            <path d="M92 80V96H108Z" fill="#f86a08" />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: -1 }}>{site.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#f86a08", textTransform: "uppercase" }}>Creative Technology Studio</div>
          <div style={{ fontSize: 104, fontWeight: 600, letterSpacing: -4, lineHeight: 1, marginTop: 20 }}>{`${site.tagline}.`}</div>
          <div style={{ fontSize: 28, color: "rgba(248,248,248,0.64)", marginTop: 28 }}>
            Websites · Web & mobile apps · Branding · Animation · Cloud
          </div>
        </div>
      </div>
    ),
    size,
  );
}
