import { ImageResponse } from "next/og";

export const alt = "AgentOnStage: AI agent use cases for live events";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0b0d12",
          color: "#e7e9ee",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: 20,
            backgroundColor: "#3ddc84",
            color: "#04140c",
            fontSize: 36,
            fontWeight: 700,
          }}
        >
          GO
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, marginTop: 36 }}>AgentOnStage</div>
        <div style={{ display: "flex", fontSize: 36, color: "#aab", marginTop: 18 }}>AI agent use cases for live events</div>
      </div>
    ),
    { ...size },
  );
}
