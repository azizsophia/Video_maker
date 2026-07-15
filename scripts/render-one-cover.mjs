// Render ONE story's branded cover as a PNG still, locally, no GitHub/ElevenLabs
// needed. Covers are stills (Cover composition) so they cost nothing to redo.
//
// Usage: node scripts/render-one-cover.mjs scripts/stories/<id>.json [out.png]
//   Reads the story's `cover` block (title, kicker, image). `image` may be a
//   remote URL or a local /public path (e.g. "covers/sun-from-west.jpg").
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";

// Remotion needs the headless-shell binary (old headless was removed from chrome).
const CHROME = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const storyPath = process.argv[2];
if (!storyPath) {
  console.error("Usage: node scripts/render-one-cover.mjs scripts/stories/<id>.json [out.png]");
  process.exit(1);
}
const story = JSON.parse(await readFile(path.resolve(storyPath), "utf8"));
const cover = story.cover || {};
const inputProps = {
  title: cover.title || story.title,
  kicker: cover.kicker || "",
  image: cover.image,
  scene: cover.scene,
  wordmark: cover.wordmark || "KETABI STUDIO",
  warm: cover.warm || false,
};
const out = path.resolve(process.argv[3] || `out/${story.id}-cover.png`);
await mkdir(path.dirname(out), { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/cover-index.ts") });
const composition = await selectComposition({ serveUrl, id: "CoverCard", inputProps });
await renderStill({
  composition, serveUrl, output: out, inputProps,
  browserExecutable: CHROME,
  chromiumOptions: { gl: "angle", ignoreCertificateErrors: true },
});
console.log("OK", out);
