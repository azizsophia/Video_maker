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
  // Standing founding-offer call to action, appended to each social caption and
  // the long-form description so every post drives to the waitlist.
  const cta = c.cta ?? "Founding members get 15% off the first order. Join the founding list at ketabistudio.com.";
  const withCta = (line) => (line ? `${line}\n${cta}` : line);
  const txt =
    `${story.title ?? "Untitled"} - captions\n` +
    `(no emojis, no dashes; one asset across platforms)\n\n` +
    // TikTok carries the hashtags (with #edutokcontest in the middle).
    block("TikTok", withCta(c.tiktok), true) +
    block("YouTube Shorts", withCta(c.shorts), false) +
    block("Instagram / FB Reels", withCta(c.reels ?? c.shorts), true) +
    (c.youtube ? `== YouTube (long-form description) ==\n${c.youtube}\n\n${cta}\n\n` : "") +
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
  // 16:9 thumbnail for long-form (orientation=wide), else the 9:16 feed cover.
  const wide = (args.orientation ?? "").toLowerCase() === "wide";
  const compId = wide ? "CoverWide" : "CoverCard";
  const inputProps = {
    title: cov.title ?? story.title ?? "",
    kicker: cov.kicker,
    image: cov.image,
    scene: cov.scene,
    wordmark: cov.wordmark ?? "KETABI STUDIO",
  };
  console.log(`Bundling cover (${compId})...`);
  const serveUrl = await bundle({ entryPoint: path.resolve("src/cover-index.ts") });
  const composition = await selectComposition({ serveUrl, id: compId, inputProps });
  const dest = path.join(outDir, "cover.png");
  await renderStill({
    composition,
    serveUrl,
    output: dest,
    inputProps,
    scale: 2, // crisp, retina/4K-friendly cover
    chromiumOptions: { gl: "angle", ignoreCertificateErrors: true },
  });
  console.log("cover ->", dest);
} else {
  console.log("no `cover` block in story; skipping cover.png");
}
