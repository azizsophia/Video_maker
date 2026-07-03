/**
 * Build the AppPromo reel's props: a warm Daniel voiceover (ElevenLabs,
 * seed-locked) for each beat, paced so every line lands on its slide. Mirrors
 * the TTS + sha1-cache path in fetch-story.ts (public/story-cache is persisted
 * by the render workflow, so a re-render bills ZERO characters for unchanged
 * lines). No Qur'an audio, no music.
 *
 * Env:  ELEVENLABS_API_KEY
 * Usage:
 *   npx tsx scripts/fetch-promo.ts --spec=scripts/promo/app-promo.json \
 *       --out=src/data/promo-render.json
 */
import { copyFile, mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";

const ELEVEN = "https://api.elevenlabs.io/v1";
const MODEL = "eleven_multilingual_v2";
const DEFAULT_VOICE_SETTINGS = {
  stability: 0.32,
  similarity_boost: 0.8,
  style: 0.55,
  use_speaker_boost: true,
};
const DEFAULT_VOICE_SEED = 71421;

// Silence tail after each line so the voice finishes before the crossfade.
const PAD = 0.55;
const OUTRO_PAD = 0.95;

type Args = Record<string, string>;
function parseArgs(): Args {
  const out: Args = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function lastEnd(alignment: any): number {
  const ends: number[] = alignment?.character_end_times_seconds ?? [];
  return ends.length ? ends[ends.length - 1] : 0;
}

async function tts(
  text: string,
  voice: string,
  settings: Record<string, unknown>,
  seed: number,
  dest: string
): Promise<number> {
  const merged = { ...DEFAULT_VOICE_SETTINGS, ...settings };
  const cacheKey = createHash("sha1")
    .update(JSON.stringify({ text, voice, model: MODEL, settings: merged, seed }))
    .digest("hex");
  const cachedMp3 = join("public", "story-cache", `${cacheKey}.mp3`);
  const cachedMeta = join("public", "story-cache", `${cacheKey}.json`);
  try {
    const meta = JSON.parse(await readFile(cachedMeta, "utf8"));
    await mkdir(dirname(dest), { recursive: true });
    await copyFile(cachedMp3, dest);
    console.log(`  (voice cache hit ${cacheKey.slice(0, 8)})`);
    return meta.duration;
  } catch {
    /* miss -> generate */
  }
  const apiKey = (process.env.ELEVENLABS_API_KEY || "").trim();
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not set.");
  const res = await fetch(`${ELEVEN}/text-to-speech/${voice}/with-timestamps`, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: merged, seed }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data: any = await res.json();
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(data.audio_base64, "base64"));
  const duration = lastEnd(data.alignment);
  try {
    await mkdir(dirname(cachedMp3), { recursive: true });
    await copyFile(dest, cachedMp3);
    await writeFile(cachedMeta, JSON.stringify({ duration }));
  } catch {
    /* cache write is best-effort */
  }
  return duration;
}

async function main() {
  const args = parseArgs();
  const specFile = args.spec ?? "scripts/promo/app-promo.json";
  const outFile = args.out ?? "src/data/promo-render.json";
  const spec = JSON.parse(await readFile(specFile, "utf8"));

  const voice = spec.voiceId ?? "onwK4e9ZLuTAKqWW03F9";
  const seed = spec.voiceSeed ?? DEFAULT_VOICE_SEED;
  const settings = spec.voiceSettings ?? {};

  console.log("Voicing intro...");
  const introDur = await tts(spec.intro.text, voice, settings, seed, "public/promo-audio/intro.mp3");

  const slides: string[] = [];
  const slideAudio: string[] = [];
  const slideDurations: number[] = [];
  for (let i = 0; i < spec.slides.length; i++) {
    const s = spec.slides[i];
    console.log(`Voicing slide ${i + 1}...`);
    const dest = `public/promo-audio/s${i + 1}.mp3`;
    const dur = await tts(s.text, voice, settings, seed, dest);
    slides.push(s.src);
    slideAudio.push(`promo-audio/s${i + 1}.mp3`);
    slideDurations.push(Number((dur + PAD).toFixed(2)));
  }

  console.log("Voicing outro...");
  const outroDur = await tts(spec.outro.text, voice, settings, seed, "public/promo-audio/outro.mp3");

  const props = {
    slides,
    slideAudio,
    slideDurations,
    introAudio: "promo-audio/intro.mp3",
    introSeconds: Number((introDur + PAD).toFixed(2)),
    outroAudio: "promo-audio/outro.mp3",
    outroSeconds: Number((outroDur + OUTRO_PAD).toFixed(2)),
    slideSeconds: 2.7,
    crossfadeFrames: spec.crossfadeFrames ?? 9,
  };
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(props, null, 2));
  const total =
    props.introSeconds +
    slideDurations.reduce((a, b) => a + b, 0) +
    props.outroSeconds -
    (props.crossfadeFrames / 30) * (slideDurations.length + 1);
  console.log(`\n✅ Promo voiced -> ${outFile}  (~${total.toFixed(1)}s)`);
}

main().catch((e) => {
  console.error("\n❌ Promo build failed:", e.message);
  process.exit(1);
});
