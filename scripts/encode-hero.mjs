/**
 * Prepares a hero clip for scroll scrubbing.
 *
 * A normal H.264 export only carries a keyframe every few seconds, so every
 * `video.currentTime = x` has to decode forward from the previous keyframe.
 * On the original Reliance Express clip that cost up to 1.8s per seek, which
 * makes scroll scrubbing impossible. Re-encoding all-intra (`-g 1`: every
 * frame is a keyframe) drops seeks to ~4ms for roughly the same file size.
 *
 * Usage:  node scripts/encode-hero.mjs <source-video>
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";

import ffmpeg from "ffmpeg-static";

const source = process.argv[2];
if (!source) {
  console.error("usage: node scripts/encode-hero.mjs <source-video>");
  process.exit(1);
}

const outDir = path.join(process.cwd(), "public", "video");
mkdirSync(outDir, { recursive: true });

const VARIANTS = [
  { file: "hero-scrub.mp4", width: 1600, crf: 24 },
  { file: "hero-scrub-sm.mp4", width: 1024, crf: 26 },
];

const mb = (file) => (statSync(file).size / 1048576).toFixed(2);

for (const { file, width, crf } of VARIANTS) {
  const out = path.join(outDir, file);
  execFileSync(
    ffmpeg,
    [
      "-y", "-v", "error",
      "-i", source,
      "-an",
      "-vf", `scale=${width}:-2`,
      "-c:v", "libx264",
      "-preset", "slow",
      "-crf", String(crf),
      // Every frame a keyframe. This is what makes scrubbing viable.
      "-g", "1", "-keyint_min", "1", "-sc_threshold", "0",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      out,
    ],
    { stdio: "inherit" },
  );
  console.log(`${file.padEnd(22)} ${mb(out).padStart(6)} MB`);
}

const poster = path.join(outDir, "hero-poster.jpg");
execFileSync(
  ffmpeg,
  ["-y", "-v", "error", "-ss", "0.2", "-i", source, "-frames:v", "1",
   "-vf", "scale=1600:-2", "-q:v", "6", poster],
  { stdio: "inherit" },
);
console.log(`${"hero-poster.jpg".padEnd(22)} ${mb(poster).padStart(6)} MB`);
