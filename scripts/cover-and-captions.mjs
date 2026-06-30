// Emit the per-video deliverables that ship alongside the MP4 in the render
// artifact: a branded cover still (out/cover.png) and the platform captions
// (out/captions.txt). Both are driven by the story JSON, so every render that
// defines `cover` / `captions` produces them automatically.
//
//   node scripts/cover-and-captions.mjs --story=scripts/stories/fingerprints.json [--out=out]
//
// Copy rule everywhere: no emojis, no em/en dashes (plain hyphens only).
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const m = a.match(/^--([^=]+)=(.*)$/);
    return m ? [m[1], m[2]] : [a.replace(/^--/, ""), "true"];
  })
);

const storyFile = args.story;
if (!storyFile) {
  console.error("Usage: node scripts/cover-and-captions.mjs --story=<path> [--out=out]");
  process.exit(1);
}
const outDir = path.resolve(args.out ?? "out");
await mkdir(outDir, { recursive: true });

const story = JSON.parse(await readFile(storyFile, "utf8"));

// ── Captions -> out/captions.txt ──────────────────────────────────────────────
const c = story.captions;
if (c) {
  const tags = Array.isArray(c.hashtags) ? c.hashtags.join(" ") : "";
  const block = (label, line, withTags) =>
    line ? `== ${label} ==\n${line}${withTags && tags ? `\n${tags}` : ""}\n\n` : "";
  const txt =
    `${story.title ?? "Untitled"} - captions\n` +
    `(no emojis, no dashes; one asset across platforms)\n\n` +
    // TikTok carries the hashtags (with #edutokcontest in the middle).
    block("TikTok", c.tiktok, true) +
    block("YouTube Shorts", c.shorts, false) +
    block("Instagram / FB Reels", c.reels ?? c.shorts, true) +
    (c.youtube ? `== YouTube (long-form description) ==\n${c.youtube}\n\n` : "") +
    (tags ? `Hashtags: ${tags}\n` : "");
  const dest = path.join(outDir, "captions.txt");
  await writeFile(dest, txt);
  console.log("captions ->", dest);
} else {
  console.log("no `captions` block in story; skipping captions.txt");
}

// ── Cover -> out/cover.png (branded CoverCard still, 1080x1920) ────────────────
const cov = story.cover;
if (cov) {
  const inputProps = {
    title: cov.title ?? story.title ?? "",
    kicker: cov.kicker,
    image: cov.image,
    scene: cov.scene,
    wordmark: cov.wordmark ?? "KETABI STUDIO",
  };
  console.log("Bundling cover...");
  const serveUrl = await bundle({ entryPoint: path.resolve("src/cover-index.ts") });
  const composition = await selectComposition({ serveUrl, id: "CoverCard", inputProps });
  const dest = path.join(outDir, "cover.png");
  await renderStill({
    composition,
    serveUrl,
    output: dest,
    inputProps,
    chromiumOptions: { gl: "angle", ignoreCertificateErrors: true },
  });
  console.log("cover ->", dest);
} else {
  console.log("no `cover` block in story; skipping cover.png");
}
