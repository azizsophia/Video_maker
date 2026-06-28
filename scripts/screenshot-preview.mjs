// Screenshot each .frame in a local preview HTML to PNG, so we can review a
// visual style WITHOUT a full video render. Outputs to public/preview/.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const HTML = process.env.PREVIEW_HTML || "preview/explainer-preview.html";
const OUT = "public/preview";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto("file://" + resolve(HTML), { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(3000); // let webfonts settle
await mkdir(OUT, { recursive: true });

const frames = await page.$$(".frame");
let i = 1;
for (const f of frames) {
  await f.screenshot({ path: `${OUT}/frame-${i}.png` });
  console.log(`✓ frame-${i}.png`);
  i++;
}
await browser.close();
console.log(`Done: ${i - 1} frame(s).`);
