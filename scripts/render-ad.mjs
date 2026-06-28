// Render the parallax waitlist ad to MP4 locally (system headless shell).
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { mkdir } from "node:fs/promises";
import path from "node:path";

await mkdir(path.resolve("out"), { recursive: true });
console.log("Bundling…");
const serveUrl = await bundle({ entryPoint: path.resolve("src/ad-index.ts") });
const composition = await selectComposition({ serveUrl, id: "ParallaxAd" });
const output = path.resolve("out/ketabi-waitlist-ad.mp4");
await renderMedia({
  composition,
  serveUrl,
  codec: "h264",
  output,
  chromiumOptions: { gl: "angle", ignoreCertificateErrors: true },
  crf: 20,
  onProgress: ({ progress }) => { if (Math.round(progress * 100) % 25 === 0) process.stdout.write(` ${Math.round(progress*100)}%`); },
});
const { statSync } = await import("node:fs");
try {
  const s = statSync(output);
  console.log("\n✓", output, s.size, "bytes");
} catch (e) {
  console.log("\n✗ output missing after render:", e.message);
}
