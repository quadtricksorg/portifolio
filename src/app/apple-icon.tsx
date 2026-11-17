import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a" }}>
        <svg width="120" height="109" viewBox="0 0 110 100">
          <path d="M66 0H88V62H66V34L28 66V80H62L78 96H18L0 76V52Z" fill="#f8f8f8" />
          <path d="M92 80V96H108Z" fill="#f86a08" />
        </svg>
      </div>
    ),
    size,
  );
}
