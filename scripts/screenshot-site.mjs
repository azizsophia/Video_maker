// Capture clean, retina screenshots of ketabistudio.com for use in video
// outros/CTAs. Runs in CI (open internet). Saves PNGs to public/promo/.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.SITE_URL || "https://ketabistudio.com";
const OUT = "public/promo";

// Pages worth capturing. Extra pages are best-effort (skipped on failure).
const TARGETS = [
  { url: BASE, name: "site-home" },
  { url: `${BASE}/shop`, name: "site-shop", optional: true },
  { url: `${BASE}/kids-corner`, name: "site-kids", optional: true },
];

async function shoot(page, target) {
  await page.goto(target.url, { waitUntil: "networkidle", timeout: 60000 });
  // let fonts/images/animations settle
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `${OUT}/${target.name}.png` }); // above-the-fold (1080x1920)
  await page.screenshot({ path: `${OUT}/${target.name}-tall.png`, fullPage: true });
  console.log(`✓ ${target.name} <- ${target.url}`);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1080, height: 1920 },
  deviceScaleFactor: 2, // retina-crisp
});
const page = await ctx.newPage();
await mkdir(OUT, { recursive: true });

let captured = 0;
for (const target of TARGETS) {
  try {
    await shoot(page, target);
    captured++;
  } catch (e) {
    if (target.optional) console.log(`· skipped ${target.name} (${e.message.slice(0, 60)})`);
    else throw e;
  }
}
await browser.close();
console.log(`\nDone: ${captured} page(s) captured to ${OUT}/`);
