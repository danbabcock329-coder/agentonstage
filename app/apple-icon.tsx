import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b0d12",
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            backgroundColor: "#3ddc84",
            color: "#04140c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          GO
        </div>
      </div>
    ),
    { ...size },
  );
}
