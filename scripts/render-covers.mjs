// Render branded feed covers as PNG stills (1080x1920), locally, using the
// system Chromium. One bundle, many stills. No GitHub Actions needed.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const img = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1080&h=1920`;

// The 10 currently-editable covers (Year of the Elephant and newer).
const COVERS = [
  { out: "01-two-seas",        kicker: "QUR'AN & SCIENCE",   title: "Two Seas\nThat Never Mix",     image: img(6388945) },
  { out: "02-euphrates",       kicker: "PROPHECY",            title: "The Euphrates\nProphecy",       image: img(29603695) },
  { out: "03-romans",          kicker: "PROPHECY FULFILLED",  title: "The Romans\nProphecy",          image: img(18534010) },
  { out: "04-only-woman",      kicker: "IN THE QUR'AN",       title: "The Only Woman\nNamed",         image: img(32171153) },
  { out: "05-ibrahim",         kicker: "THE PROPHETS",        title: "The Story\nof Ibrahim",         image: img(18635120) },
  { out: "06-abu-bakr",        kicker: "THE COMPANIONS",      title: "Abu Bakr\nas-Siddiq",           image: img(9280242) },
  { out: "07-splitting-sea",   kicker: "THE PROPHETS",        title: "The Splitting\nof the Sea",     image: img(12763857) },
  { out: "08-ayat-al-kursi",   kicker: "DECODED",             title: "Ayat\nal-Kursi",                image: img(33630927) },
  { out: "09-al-kahf",         kicker: "DECODED",             title: "Surah\nAl-Kahf",                image: img(28359737) },
  { out: "10-year-elephant",   kicker: "ISLAMIC HISTORY",     title: "The Year\nof the Elephant",     image: img(2867771) },
  { out: "11-al-hijr",         kicker: "AL-HIJR · HEGRA",     title: "Do Not\nEnter Here",            image: img(11215342) },
  { out: "12-iron-stars",      kicker: "QUR'AN & SCIENCE",    title: "Iron From\nthe Stars",          image: img(30616133) },
  { out: "13-fire-hijaz",      kicker: "PROPHECY",            title: "The Fire of\nthe Hijaz",         image: img(17172591) },
];

const outDir = path.resolve("out/covers");
await mkdir(outDir, { recursive: true });

console.log("Bundling…");
const serveUrl = await bundle({ entryPoint: path.resolve("src/cover-index.ts") });

for (const c of COVERS) {
  const inputProps = { title: c.title, kicker: c.kicker, image: c.image, wordmark: "KETABI STUDIO" };
  const composition = await selectComposition({ serveUrl, id: "CoverCard", inputProps });
  const output = path.join(outDir, `${c.out}.png`);
  await renderStill({
    composition,
    serveUrl,
    output,
    inputProps,
    chromiumOptions: { gl: "angle", ignoreCertificateErrors: true },
  });
  console.log("✓", output);
}
console.log("\nDone:", COVERS.length, "covers ->", outDir);
