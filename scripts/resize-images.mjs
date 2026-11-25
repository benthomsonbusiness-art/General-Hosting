import sharp from "sharp";
import { readdir } from "node:fs/promises";

// Pre-sizes source photos and transparent cutouts so next/image works without a runtime optimizer.
// Never upscales: widths above the source width are skipped.
const SRC = "public/images";
const OUT = "public/images/sized";
const WIDTHS = [480, 640, 800, 960, 1280, 1600, 1920, 2560];
const EXT_RE = /\.(jpe?g|png|webp)$/i;

for (const file of (await readdir(SRC)).sort()) {
  if (!EXT_RE.test(file)) continue;
  const name = file.replace(EXT_RE, "");
  const meta = await sharp(`${SRC}/${file}`).metadata();
  const width = meta.width ?? 1280;
  const hasAlpha = Boolean(meta.hasAlpha);
  const widths = [...new Set(WIDTHS.filter((w) => w < width).concat(width))].sort((a, b) => a - b);
  for (const w of widths) {
    await sharp(`${SRC}/${file}`)
      .resize({ width: w, withoutEnlargement: true })
      .webp(hasAlpha ? { quality: 82, alphaQuality: 95 } : { quality: 76 })
      .toFile(`${OUT}/${name}-${w}.webp`);
  }
}