import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "raw.vives — Visual Archive by Alex Vicente";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#080808",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#f1f0eb",
        padding: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontSize: "104px",
            fontWeight: "400",
            margin: 0,
            letterSpacing: "-5px",
          }}
        >
          raw.vives
        </h1>
        <div
          style={{
            width: "80px",
            height: "1px",
            background: "#cfc6b5",
            marginTop: "28px",
          }}
        />
        <p
          style={{
            fontSize: "20px",
            marginTop: "30px",
            textTransform: "uppercase",
            letterSpacing: "7px",
            color: "#b7b5ae",
          }}
        >
          Visual Archive by Alex Vicente
        </p>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
