/**
 * Derives every brand asset from the single source logo.
 *
 * The source is a 1777x885 PNG with an alpha channel: a road-swoosh mark with
 * a gold arrow, plus a BLACK "Reliance Express" wordmark. The black wordmark
 * is unreadable over the dark hero video, so a white silhouette is generated
 * for the transparent header state.
 *
 * Usage:  npm run build:brand
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import sharp from "sharp";

const SRC = path.join(process.cwd(), "assets", "logo.png");
const PUBLIC = path.join(process.cwd(), "public", "brand");
const APP = path.join(process.cwd(), "app");

/** Icons sit on white: the wordmark is black and would vanish on dark. */
const ICON_BG = { r: 255, g: 255, b: 255, alpha: 1 };

mkdirSync(PUBLIC, { recursive: true });

/**
 * Flattens artwork to a single colour, keeping the alpha channel as the
 * shape. Alpha below `floor` is discarded so the original drop shadow does
 * not survive as a haze, while the edge ramp above it keeps anti-aliasing.
 */
async function monochrome(input, { r, g, b }, floor = 0.5) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255;
    const lifted = a <= floor ? 0 : (a - floor) / (1 - floor);
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = Math.round(Math.min(1, lifted) * 255);
  }
  return sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

/** Centres artwork on a square of `size`, leaving `pad` fraction of margin. */
async function square(input, size, background, pad = 0.06) {
  const inner = Math.round(size * (1 - pad * 2));
  const art = await sharp(input)
    .resize({ width: inner, height: inner, fit: "inside" })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: art, gravity: "center" }])
    // Icons are served raw (no next/image in front of them), and the artwork
    // is only a handful of hues, so a palette PNG cuts the weight sharply.
    .png({ palette: true, quality: 90, compressionLevel: 9 })
    .toBuffer();
}

const write = (file, buf) => {
  writeFileSync(file, buf);
  console.log(
    `${path.relative(process.cwd(), file).padEnd(30)} ${(buf.length / 1024)
      .toFixed(1)
      .padStart(7)} KB`,
  );
};

// Full-colour lockup, trimmed of transparent padding. Kept at full
// resolution for the icons below; the web copies are capped, since the
// header shows it ~53px tall and the footer ~38px.
const lockup = await sharp(SRC).png().trim({ threshold: 10 }).toBuffer();
const web = await sharp(lockup).resize({ width: 700 }).png().toBuffer();

// 1. What the header and footer load, via next/image.
write(path.join(PUBLIC, "logo.png"), web);

// 2. White silhouette of the same lockup, for the header over the video.
write(
  path.join(PUBLIC, "logo-light.png"),
  await monochrome(web, { r: 255, g: 255, b: 255 }),
);

// 3. Browser tab + home screen icons: the full lockup, letterboxed on white.
//    Next.js picks these up from `app/` via the icon / apple-icon conventions.
write(path.join(APP, "icon.png"), await square(lockup, 512, ICON_BG));
write(path.join(APP, "apple-icon.png"), await square(lockup, 180, ICON_BG));
