import { ImageResponse } from "next/og";
import { COUPLE } from "./invite";
import { ogFonts } from "./og-fonts";

/** The B&M wax-seal monogram, rendered as a square PNG for favicons. */
export async function monogramIcon(px: number) {
  const fonts = await ogFonts();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "radial-gradient(circle at 38% 30%, #a52a40, #6b0f1e 60%, #3d0812)",
          border: `${Math.max(2, px * 0.05)}px solid #e8c877`,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Great Vibes",
            fontSize: px * 0.25,
            color: "#f5d98a",
            marginTop: px * 0.04,
            // the script M's tail overhangs to the right; nudge left to look centred
            marginRight: px * 0.16,
          }}
        >
          {COUPLE.bride[0]}&amp;{COUPLE.groom[0]}
        </div>
      </div>
    ),
    { width: px, height: px, fonts },
  );
}
