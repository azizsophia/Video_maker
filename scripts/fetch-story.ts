/**
 * Build a story video's props: AI English narration (ElevenLabs, with word
 * timestamps for captions) + the REAL reciter's ayahs (Quran.com). The Qur'an
 * is never synthesized — only the English narration.
 *
 * Env:  ELEVENLABS_API_KEY
 * Usage:
 *   npx tsx scripts/fetch-story.ts --story=scripts/stories/gog-and-magog.json \
 *       --out=src/data/story-render.json [--voice <id>] [--theme midnight]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream, existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { Readable } from "node:stream";
import { dirname, join } from "node:path";

const API = "https://api.quran.com/api/v4";
const AUDIO_BASE = "https://verses.quran.com/";
const ELEVEN = "https://api.elevenlabs.io/v1";
const CACHE_DIR = join("public", "story-cache"); // persisted across runs to avoid re-spending credits

const sha = (s: string): string => createHash("sha1").update(s).digest("hex").slice(0, 16);

type Args = Record<string, string>;
const parseArgs = (): Args => {
  const out: Args = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
};

const stripHtml = (s: string): string =>
  s.replace(/<sup[^>]*>.*?<\/sup>/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  return (await res.json()) as T;
}

async function download(url: string, dest: string): Promise<void> {
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Download failed ${url} -> ${res.status}`);
  await new Promise<void>((resolve, reject) => {
    const file = createWriteStream(dest);
    Readable.fromWeb(res.body as any).pipe(file).on("finish", () => resolve()).on("error", reject);
  });
}

const resolveAudioUrl = (raw: string): string =>
  /^https?:\/\//.test(raw) ? raw : raw.startsWith("//") ? "https:" + raw : AUDIO_BASE + raw.replace(/^\/+/, "");

// Group ElevenLabs character alignment into spoken words with timings.
function groupWords(align: any): { text: string; start: number; end: number }[] {
  const chars: string[] = align?.characters ?? [];
  const st: number[] = align?.character_start_times_seconds ?? [];
  const en: number[] = align?.character_end_times_seconds ?? [];
  const words: { text: string; start: number; end: number }[] = [];
  let cur = "";
  let start: number | null = null;
  let end = 0;
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (/\s/.test(c)) {
      if (cur) words.push({ text: cur, start: start ?? 0, end });
      cur = "";
      start = null;
    } else {
      if (start === null) start = st[i] ?? end;
      cur += c;
      end = en[i] ?? end;
    }
  }
  if (cur) words.push({ text: cur, start: start ?? 0, end });
  return words;
}

async function tts(text: string, voice: string, model: string, dest: string) {
  const key = (process.env.ELEVENLABS_API_KEY || "").trim();
  if (!key) throw new Error("ELEVENLABS_API_KEY is not set.");
  const res = await fetch(`${ELEVEN}/text-to-speech/${voice}/with-timestamps`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      model_id: model,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.0, use_speaker_boost: true },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data: any = await res.json();
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(data.audio_base64, "base64"));
  const words = groupWords(data.alignment);
  const duration = words.length ? words[words.length - 1].end : 0;
  return { words, duration };
}

// Generate a SOUND EFFECT (never music) via ElevenLabs sound-generation.
async function sfxGen(prompt: string, duration: number, dest: string) {
  const key = (process.env.ELEVENLABS_API_KEY || "").trim();
  const res = await fetch(`${ELEVEN}/sound-generation`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({ text: prompt, duration_seconds: duration, prompt_influence: 0.45 }),
  });
  if (!res.ok) throw new Error(`ElevenLabs SFX ${res.status}: ${(await res.text()).slice(0, 200)}`);
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

async function cachedSfx(prompt: string, duration: number): Promise<string> {
  const hash = sha(`sfx|${prompt}|${duration}`);
  const mp3 = join(CACHE_DIR, `s-${hash}.mp3`);
  if (existsSync(mp3)) {
    console.log(`  sfx: cached (${prompt.slice(0, 32)}...)`);
  } else {
    await sfxGen(prompt, duration, mp3);
    console.log(`  sfx: generated (${prompt.slice(0, 32)}...)`);
  }
  return `story-cache/s-${hash}.mp3`;
}

// Pull the EXACT Qur'an text + official translation straight from Quran.com by
// reference (e.g. "36:38" or "105:3-4"). Guarantees correct Arabic + translation.
async function fetchVerse(ref: string, translationId: string): Promise<{ arabic: string; translation: string }> {
  const [sura, part] = ref.split(":");
  const [start, end] = part.includes("-")
    ? part.split("-").map((n) => parseInt(n, 10))
    : [parseInt(part, 10), parseInt(part, 10)];
  const ar: string[] = [];
  const tr: string[] = [];
  for (let a = start; a <= end; a++) {
    const v = await getJson<any>(
      `${API}/verses/by_key/${sura}:${a}?language=en&translations=${translationId}&fields=text_uthmani`
    );
    ar.push(v.verse.text_uthmani as string);
    tr.push(stripHtml(v.verse.translations?.[0]?.text ?? ""));
  }
  return { arabic: ar.join(" "), translation: tr.join(" ") };
}

async function main() {
  const args = parseArgs();
  const storyFile = args.story ?? "scripts/stories/gog-and-magog.json";
  const story = JSON.parse(await readFile(storyFile, "utf8"));
  const voice = args.voice ?? story.voiceId ?? "onwK4e9ZLuTAKqWW03F9";
  const model = args.model ?? "eleven_multilingual_v2";
  const recitation = String(story.reciter ?? 3);
  const translation = args.translation ?? "20";
  const theme = args.theme ?? story.look ?? "midnight";
  const GAP = args.gap ? Number(args.gap) : Number(story.gap ?? 0.35); // breath between segments (small = continuous flow)

  await mkdir(CACHE_DIR, { recursive: true });

  // Atmospheric bed (sound effect, never music) under the whole video.
  let ambientSrc: string | undefined;
  let ambientDuration: number | undefined;
  if (story.sound?.ambient) {
    ambientDuration = Number(story.sound.ambientDuration ?? 22);
    ambientSrc = await cachedSfx(story.sound.ambient, ambientDuration);
  }

  const segments: any[] = [];
  let cursor = 0;
  let i = 0;
  for (const seg of story.segments as any[]) {
    if (seg.pauseBefore) cursor += Number(seg.pauseBefore); // dramatic silence
    const sfxSrc = seg.sfx ? await cachedSfx(seg.sfx, 3) : undefined;
    if (seg.type === "narration") {
      const text: string = seg.say ?? seg.text;
      // Cache narration by content so visual-only re-renders never re-spend credits.
      const hash = sha(`${voice}|${model}|${text}`);
      const mp3 = join(CACHE_DIR, `n-${hash}.mp3`);
      const meta = join(CACHE_DIR, `n-${hash}.json`);
      let words: any[];
      let duration: number;
      if (existsSync(mp3) && existsSync(meta)) {
        ({ words, duration } = JSON.parse(await readFile(meta, "utf8")));
        console.log(`  narration ${i}: cached (${text.slice(0, 40)}...)`);
      } else {
        ({ words, duration } = await tts(text, voice, model, mp3));
        await writeFile(meta, JSON.stringify({ words, duration }));
        console.log(`  narration ${i}: generated ${duration.toFixed(1)}s (${text.slice(0, 40)}...)`);
      }
      let vArabic = seg.arabic || undefined;
      let vTrans = seg.translation || undefined;
      if (seg.verseRef) {
        const vv = await fetchVerse(String(seg.verseRef), translation);
        vArabic = vv.arabic;
        vTrans = vv.translation;
        console.log(`  verse ${seg.verseRef}: pulled exact text + official translation from Quran.com`);
      }
      segments.push({
        kind: "narration",
        audioSrc: `story-cache/n-${hash}.mp3`,
        fromSeconds: Number(cursor.toFixed(2)),
        durationInSeconds: Number((duration + GAP).toFixed(2)),
        words,
        source: seg.source ?? (seg.caption && /\d|hasan|Muslim|Tirmidhi|Quran/i.test(seg.caption) ? seg.caption : undefined),
        sfxSrc,
        hook: seg.hook || undefined,
        scene: seg.scene || undefined,
        arabic: vArabic,
        translation: vTrans,
      });
      cursor += duration + GAP;
    } else if (seg.type === "ayah") {
      const key = `${seg.surah}:${seg.ayah}`;
      const hash = sha(`ayah|${key}|${recitation}|${translation}`);
      const mp3 = join(CACHE_DIR, `a-${hash}.mp3`);
      const meta = join(CACHE_DIR, `a-${hash}.json`);
      let arabic: string;
      let tr: string;
      let duration: number;
      if (existsSync(mp3) && existsSync(meta)) {
        ({ arabic, tr, duration } = JSON.parse(await readFile(meta, "utf8")));
        console.log(`  ayah ${key}: cached`);
      } else {
        const v = await getJson<any>(
          `${API}/verses/by_key/${key}?language=en&audio=${recitation}&translations=${translation}&fields=text_uthmani`
        );
        const verse = v.verse;
        arabic = verse.text_uthmani as string;
        tr = stripHtml(verse.translations?.[0]?.text ?? "");
        const segsArr: number[][] = verse.audio?.segments ?? [];
        const lastEnd = segsArr.length ? segsArr[segsArr.length - 1][segsArr[0].length - 1] / 1000 : 6;
        duration = Math.max(2, lastEnd + 0.6);
        await download(resolveAudioUrl(verse.audio.url), mp3);
        await writeFile(meta, JSON.stringify({ arabic, tr, duration }));
        console.log(`  ayah ${key}: fetched ${duration.toFixed(1)}s`);
      }
      segments.push({
        kind: "ayah",
        audioSrc: `story-cache/a-${hash}.mp3`,
        fromSeconds: Number(cursor.toFixed(2)),
        durationInSeconds: Number((duration + GAP).toFixed(2)),
        arabic,
        translation: tr,
        source: seg.source,
        sfxSrc,
        ember: seg.ember || undefined,
        scene: seg.scene || undefined,
      });
      cursor += duration + GAP;
    }
    i++;
  }

  const props = {
    title: story.title,
    theme,
    reciterName: args.reciterName ?? "Sheikh Abdur-Rahman as-Sudais",
    voiceName: story.voiceName ?? "Daniel",
    websiteUrl: args.website ?? "ketabistudio.com",
    ambientSrc,
    ambientDuration,
    segments,
  };
  const outFile = args.out ?? "src/data/story-render.json";
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(props, null, 2));
  console.log(`\n✅ Story built: ${segments.length} segments, ~${cursor.toFixed(0)}s -> ${outFile}`);
}

main().catch((e) => {
  console.error("\n❌ Story build failed:", e.message);
  process.exit(1);
});
