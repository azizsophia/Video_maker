// Local assembler: reads the voiced mp3s in public/promo-audio/, measures each
// duration with @remotion/media-parser, and writes src/data/promo-render.json
// for the AppPromo composition. Used when the VO is generated out-of-band (via
// the tts-test workflow) rather than by fetch-promo.ts.
import { parseMedia } from "@remotion/media-parser";
import { nodeReader } from "@remotion/media-parser/node";
import { writeFile } from "node:fs/promises";

const PAD = 0.55;
const OUTRO_PAD = 0.95;

const slideSrcs = [
  "promo/1_hook.png",
  "promo/2_checkin.png",
  "promo/3_adhkar.png",
  "promo/4_garden.png",
  "promo/5_journal.png",
];

async function dur(path) {
  const { durationInSeconds } = await parseMedia({
    src: path,
    reader: nodeReader,
    fields: { durationInSeconds: true },
  });
  return durationInSeconds ?? 0;
}

const introDur = await dur("public/promo-audio/intro.mp3");
const outroDur = await dur("public/promo-audio/outro.mp3");
const slideAudio = [];
const slideDurations = [];
for (let i = 0; i < slideSrcs.length; i++) {
  const d = await dur(`public/promo-audio/s${i + 1}.mp3`);
  slideAudio.push(`promo-audio/s${i + 1}.mp3`);
  slideDurations.push(Number((d + PAD).toFixed(2)));
}

const props = {
  slides: slideSrcs,
  slideAudio,
  slideDurations,
  introAudio: "promo-audio/intro.mp3",
  introSeconds: Number((introDur + PAD).toFixed(2)),
  outroAudio: "promo-audio/outro.mp3",
  outroSeconds: Number((outroDur + OUTRO_PAD).toFixed(2)),
  slideSeconds: 2.7,
  crossfadeFrames: 9,
};
await writeFile("src/data/promo-render.json", JSON.stringify(props, null, 2));
const total =
  props.introSeconds +
  slideDurations.reduce((a, b) => a + b, 0) +
  props.outroSeconds -
  (9 / 30) * (slideDurations.length + 1);
console.log("intro", props.introSeconds, "slides", slideDurations, "outro", props.outroSeconds);
console.log(`Wrote src/data/promo-render.json (~${total.toFixed(1)}s)`);
