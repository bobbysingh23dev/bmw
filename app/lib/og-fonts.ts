import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Open-licensed fonts (via Fontsource) used by the generated share image and icons.
const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

export async function ogFonts() {
  const [cinzel, vibes, cormorant] = await Promise.all([
    font("cinzel-latin-500-normal.woff"),
    font("great-vibes-latin-400-normal.woff"),
    font("cormorant-garamond-latin-500-italic.woff"),
  ]);
  return [
    { name: "Cinzel", data: cinzel, weight: 500 as const, style: "normal" as const },
    { name: "Great Vibes", data: vibes, weight: 400 as const, style: "normal" as const },
    { name: "Cormorant", data: cormorant, weight: 500 as const, style: "italic" as const },
  ];
}
