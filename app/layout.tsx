import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Great_Vibes, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const greatVibes = Great_Vibes({
  variable: "--font-greatvibes",
  subsets: ["latin"],
  weight: "400",
});

const tiro = Tiro_Devanagari_Hindi({
  variable: "--font-tiro",
  subsets: ["devanagari", "latin"],
  weight: "400",
});

const description =
  "॥ श्री राधा रानी की असीम कृपा से ॥ You & your family are cordially invited to the Ring Ceremony of Bobby & Manish — Thursday, 26th November 2026 — arrival 12:00 PM sharp — at Rudra Resort, Lalganj, Raebareli.";

// Absolute base for the share image URL: an explicit site URL, else the Vercel production domain.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Bobby & Manish — Ring Ceremony",
  description,
  openGraph: {
    title: "Bobby & Manish — Ring Ceremony · सगाई",
    description,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bobby & Manish — Ring Ceremony · सगाई",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#2a050b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${cormorant.variable} ${greatVibes.variable} ${tiro.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
