import sharp from "sharp";
import { readdir } from "node:fs/promises";

// Pre-sizes the source photos so next/image works without a runtime optimizer.
// Never upscales: widths above the source width are skipped.
const SRC = "public/images";
const OUT = "public/images/sized";
const WIDTHS = [480, 640, 800, 960, 1280];

for (const file of await readdir(SRC)) {
  if (!file.endsWith(".jpg")) continue;
  const name = file.replace(/\.jpg$/, "");
  const { width } = await sharp(`${SRC}/${file}`).metadata();
  const widths = new Set(WIDTHS.filter((w) => w < width).concat(width));
  for (const w of widths) {
    await sharp(`${SRC}/${file}`).resize({ width: w, withoutEnlargement: true }).webp({ quality: 70 }).toFile(`${OUT}/${name}-${w}.webp`);
  }
}