import { ImageResponse } from "next/og";
import { COUPLE, DATE_LONG, VENUE } from "./lib/invite";
import { ogFonts } from "./lib/og-fonts";

export const alt = `Ring Ceremony of ${COUPLE.bride} & ${COUPLE.groom} — ${DATE_LONG}, ${VENUE.name}, ${VENUE.locality}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GOLD = "#e8c877";
const GOLD_PALE = "#f5e3b3";

function Rings() {
  return (
    <svg width="150" height="96" viewBox="0 0 150 96">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbe7a8" />
          <stop offset=".5" stopColor="#d4a548" />
          <stop offset="1" stopColor="#8a6420" />
        </linearGradient>
      </defs>
      <circle cx="58" cy="60" r="30" fill="none" stroke="url(#g)" strokeWidth="8" />
      <circle cx="92" cy="60" r="30" fill="none" stroke="url(#g)" strokeWidth="8" />
      <path d="M92 30 L82 18 L87 8 H97 L102 18Z" fill="#fff3f6" stroke="#c9506a" strokeWidth="2" strokeLinejoin="round" />
      <path d="M82 18 H102" stroke="#c9506a" strokeWidth="1.5" />
    </svg>
  );
}

function Flourish({ flip = false }: { flip?: boolean }) {
  return (
    <svg width="110" height="16" viewBox="70 0 110 16">
      <g transform={flip ? "translate(250 0) scale(-1 1)" : ""}>
        <path d="M0 8 H150" stroke={GOLD} strokeWidth="1.5" />
        <path d="M160 2 L168 8 L160 14 L152 8Z" fill={GOLD} />
        <circle cx="176" cy="8" r="3" fill={GOLD} />
      </g>
    </svg>
  );
}

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at 50% 30%, #8e1b2e 0%, #4a0a14 55%, #22040a 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 22,
            right: 22,
            bottom: 22,
            border: `3px solid ${GOLD}`,
            borderRadius: 18,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 34,
            left: 34,
            right: 34,
            bottom: 34,
            border: "1px solid rgba(232,200,119,.5)",
            borderRadius: 12,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "Cinzel", fontSize: 22, letterSpacing: 8, color: GOLD_PALE, display: "flex" }}>
            YOU &amp; YOUR FAMILY ARE CORDIALLY INVITED
          </div>
          <div style={{ display: "flex", marginTop: 18 }}>
            <Rings />
          </div>
          <div style={{ fontFamily: "Cinzel", fontSize: 50, letterSpacing: 6, color: GOLD, marginTop: 6, display: "flex" }}>
            RING CEREMONY
          </div>
          <div
            style={{
              fontFamily: "Great Vibes",
              fontSize: 132,
              color: GOLD,
              lineHeight: 1.15,
              marginTop: -4,
              display: "flex",
              textShadow: "0 4px 18px rgba(0,0,0,.45)",
            }}
          >
            {COUPLE.bride} &amp; {COUPLE.groom}
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 4 }}>
            <Flourish />
            <div style={{ fontFamily: "Cinzel", fontSize: 25, letterSpacing: 2, color: "#fff3d6", margin: "0 22px", display: "flex" }}>
              {DATE_LONG} · 12:00 PM Sharp
            </div>
            <Flourish flip />
          </div>
          <div style={{ fontFamily: "Cormorant", fontStyle: "italic", fontSize: 32, color: GOLD_PALE, marginTop: 10, display: "flex" }}>
            {VENUE.name}, {VENUE.locality}, {VENUE.state}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
