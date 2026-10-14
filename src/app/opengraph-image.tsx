import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fdf9f2",
          backgroundImage:
            "radial-gradient(60% 50% at 15% 10%, rgba(227,168,87,0.45) 0%, transparent 60%), radial-gradient(50% 45% at 85% 20%, rgba(193,97,59,0.35) 0%, transparent 60%), radial-gradient(70% 60% at 50% 100%, rgba(214,171,114,0.3) 0%, transparent 60%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "56px 80px",
            borderRadius: 40,
            backgroundColor: "rgba(250,240,224,0.6)",
            border: "1px solid rgba(255,255,255,0.5)",
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontStyle: "italic",
              fontWeight: 600,
              color: "#a14a2b",
              fontFamily: "serif",
            }}
          >
            Wawa
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 36,
              color: "#33261b",
              fontFamily: "sans-serif",
            }}
          >
            Tu sabiduría, su futuro.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
