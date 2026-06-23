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
import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { Readable } from "node:stream";
import { dirname, join } from "node:path";

const API = "https://api.quran.com/api/v4";
const AUDIO_BASE = "https://verses.quran.com/";
const ELEVEN = "https://api.elevenlabs.io/v1";

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

async function main() {
  const args = parseArgs();
  const storyFile = args.story ?? "scripts/stories/gog-and-magog.json";
  const story = JSON.parse(await readFile(storyFile, "utf8"));
  const voice = args.voice ?? story.voiceId ?? "onwK4e9ZLuTAKqWW03F9";
  const model = args.model ?? "eleven_multilingual_v2";
  const recitation = String(story.reciter ?? 3);
  const translation = args.translation ?? "20";
  const theme = args.theme ?? story.look ?? "midnight";
  const GAP = 0.35; // small breath between segments

  const segments: any[] = [];
  let cursor = 0;
  let i = 0;
  for (const seg of story.segments as any[]) {
    if (seg.type === "narration") {
      const text: string = seg.say ?? seg.text;
      const dest = join("public", "story", `n${i}.mp3`);
      const { words, duration } = await tts(text, voice, model, dest);
      console.log(`  narration ${i}: ${duration.toFixed(1)}s (${text.slice(0, 40)}...)`);
      // Optional on-screen Arabic verse (shown, never recited). Pulled from the
      // validated Quran.com source so Arabic is never hand-typed.
      let arabicQuote: string | undefined;
      if (seg.quote) {
        const qv = await getJson<any>(
          `${API}/verses/by_key/${String(seg.quote)}?language=en&fields=text_uthmani`
        );
        arabicQuote = qv.verse?.text_uthmani as string | undefined;
        if (arabicQuote) console.log(`  quote ${seg.quote}: Arabic shown (not recited)`);
      }
      segments.push({
        kind: "narration",
        audioSrc: `story/n${i}.mp3`,
        fromSeconds: Number(cursor.toFixed(2)),
        durationInSeconds: Number((duration + GAP).toFixed(2)),
        words,
        source: seg.caption && /\d|hasan|Muslim|Tirmidhi|Quran/i.test(seg.caption) ? seg.caption : undefined,
        map: seg.map,
        scene: seg.scene,
        kicker: seg.kicker,
        foot: seg.foot,
        highlight: seg.highlight,
        videoSrc: seg.video, // remote Pexels URL — streamed at render (no download)
        arabic: arabicQuote,
      });
      cursor += duration + GAP;
    } else if (seg.type === "ayah") {
      const key = `${seg.surah}:${seg.ayah}`;
      const v = await getJson<any>(
        `${API}/verses/by_key/${key}?language=en&audio=${recitation}&translations=${translation}&fields=text_uthmani`
      );
      const verse = v.verse;
      const arabic = verse.text_uthmani as string;
      const tr = stripHtml(verse.translations?.[0]?.text ?? "");

      // Audio source: a verified free-license clip (seg.audioUrl) when provided,
      // otherwise the Quran.com reciter — the copyrighted default, fine for
      // testing but NOT for monetized >60s. See docs/RECITERS.md. We always keep
      // the validated Uthmani text + translation from Quran.com regardless.
      const custom = typeof seg.audioUrl === "string" && seg.audioUrl.length > 0;
      if (custom && typeof seg.seconds !== "number") {
        throw new Error(`Ayah ${key}: a custom audioUrl requires "seconds" (clip length). See docs/RECITERS.md.`);
      }
      const audioUrl: string = custom ? seg.audioUrl : verse.audio.url;
      const segsArr: number[][] = verse.audio?.segments ?? [];
      const lastEnd = segsArr.length ? segsArr[segsArr.length - 1][segsArr[0].length - 1] / 1000 : 6;
      const duration = custom ? Math.max(1, Number(seg.seconds)) : Math.max(2, lastEnd + 0.6);
      const ext = (custom && audioUrl.match(/\.(ogg|mp3|m4a|wav)(?:\?|$)/i)?.[1]?.toLowerCase()) || "mp3";
      const dest = join("public", "story", `a${i}.${ext}`);
      await download(resolveAudioUrl(audioUrl), dest);
      if (custom) console.log(`  ayah ${key}: free-license audio${seg.audioCredit ? ` — ${seg.audioCredit}` : ""}`);
      console.log(`  ayah ${key}: ${duration.toFixed(1)}s`);
      segments.push({
        kind: "ayah",
        audioSrc: `story/a${i}.${ext}`,
        fromSeconds: Number(cursor.toFixed(2)),
        durationInSeconds: Number((duration + GAP).toFixed(2)),
        arabic,
        translation: tr,
        source: seg.source,
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
    // Founding-list ad end card: on by default, but a story can opt out
    // (e.g. the standalone brand ad, which is itself the CTA).
    showOutro: story.showOutro ?? true,
    ctaHeadline: story.ctaHeadline ?? "Join the founding list",
    ctaSeconds: story.ctaSeconds ?? 4.5,
    cinematic: story.cinematic ?? false,
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
