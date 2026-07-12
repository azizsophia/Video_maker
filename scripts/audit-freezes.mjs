// Freeze / rapid-loop audit (owner directive 2026-07-11). The renderer slows a
// clip to fill its beat but the playback rate floors at 0.5x, so a clip covers
// at most 2x its length. A clip shorter than half its beat runs out and (before
// the loop fix) FREEZES; with the loop fix it repeats. This flags every beat
// whose clip is too short, using each beat's recorded `videoDuration` (the clip
// length the renderer uses) vs the beat's estimated narration length. No network.
//
// Usage: node scripts/audit-freezes.mjs [scripts/stories/a.json ...]
//   No args => audits every scripts/stories/*.json.
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const WPS = 2.4;    // ~144 wpm paced narration
const BUFFER = 1.3; // gap + hold the renderer adds per beat

const files =
  process.argv.length > 2
    ? process.argv.slice(2)
    : (await readdir("scripts/stories"))
        .filter((f) => f.endsWith(".json"))
        .map((f) => path.join("scripts/stories", f));

const flags = [];
for (const file of files) {
  let j;
  try { j = JSON.parse(await readFile(file, "utf8")); } catch { continue; }
  if (!Array.isArray(j.segments)) continue;
  const id = j.id || path.basename(file, ".json");
  for (let i = 0; i < j.segments.length; i++) {
    const s = j.segments[i];
    if (!s.video || s.image || s.title) continue; // stills + title cards excluded
    const words = (s.text || "").trim().split(/\s+/).filter(Boolean).length;
    const beatSec = words / WPS + BUFFER;
    const vd = typeof s.videoDuration === "number" ? s.videoDuration : null;
    if (vd == null) { flags.push({ id, i, vd: "NONE", beatSec: beatSec.toFixed(0), loops: "?", sev: "?" }); continue; }
    const coverage = vd * 2;            // max the 0.5x floor can stretch it
    if (coverage < beatSec - 1.0) {
      const loops = beatSec / vd;
      flags.push({ id, i, vd, beatSec: +beatSec.toFixed(0), loops: +loops.toFixed(1),
                   sev: loops >= 3 ? "HARD" : "soft" });
    }
  }
}
flags.sort((a, b) => (b.loops === "?" ? 99 : b.loops) - (a.loops === "?" ? 99 : a.loops));
console.log("\n=== FREEZE / RAPID-LOOP FLAGS (clip fills < half the beat) ===");
console.log("video".padEnd(20), "beat", "clipSec", "beatSec", "loops", "sev");
for (const f of flags)
  console.log(f.id.padEnd(20), ("b" + f.i).padEnd(4), String(f.vd).padEnd(7), String(f.beatSec).padEnd(7), String(f.loops).padEnd(5), f.sev);
console.log(`\n${flags.length} flagged beats. HARD = clip < 1/3 of beat (re-source a longer clip or use a still); soft = mild loop.`);
