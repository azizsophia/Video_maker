/**
 * Fetch a surah (or ayah range) from the free Quran.com API v4 and build a
 * ready-to-render props JSON for the QuranRecitation composition.
 *
 * It pulls:
 *   - Uthmani Arabic text, split into words
 *   - a translation (default: Saheeh International)
 *   - per-word audio timing "segments" from a real reciter
 *   - the per-ayah audio files (downloaded into /public/audio)
 *
 * Usage:
 *   npx tsx scripts/fetch-ayahs.ts --surah=112
 *   npx tsx scripts/fetch-ayahs.ts --surah=2 --from=255 --to=255 --recitation=7 --theme=emerald
 *
 * NOTE: requires network access to api.quran.com and verses.quran.com.
 * In Claude Code web sessions these hosts must be added to the egress allowlist.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { dirname, join } from "node:path";

const API = "https://api.quran.com/api/v4";
const AUDIO_BASE = "https://verses.quran.com/";

// Common reciters (Quran.com recitation ids). 7 = Mishary al-Afasy (Murattal).
const RECITER_NAMES: Record<string, string> = {
  "1": "AbdulBaset AbdulSamad (Mujawwad)",
  "2": "AbdulBaset AbdulSamad (Murattal)",
  "3": "Abdur-Rahman as-Sudais",
  "4": "Abu Bakr al-Shatri",
  "5": "Hani ar-Rifai",
  "6": "Mahmoud Khalil Al-Husary",
  "7": "Mishary Rashid Alafasy",
  "9": "Mishary Alafasy (Mujawwad)",
};

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
  s
    .replace(/<sup[^>]*>.*?<\/sup>/g, "") // drop footnote markers
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

// Quran.com segments come as arrays; handle both [word,start,end] and
// [word,?,start,end] millisecond formats.
const segMs = (seg: number[]): { start: number; end: number } => {
  if (seg.length >= 4) return { start: seg[seg.length - 2], end: seg[seg.length - 1] };
  return { start: seg[1], end: seg[2] };
};

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

async function download(url: string, dest: string): Promise<void> {
  await mkdir(dirname(dest), { recursive: true });
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Download failed ${url} -> ${res.status}`);
  await new Promise<void>((resolve, reject) => {
    const file = createWriteStream(dest);
    Readable.fromWeb(res.body as any)
      .pipe(file)
      .on("finish", () => resolve())
      .on("error", reject);
  });
}

async function main() {
  const args = parseArgs();
  const surah = Number(args.surah ?? "112");
  const recitation = args.recitation ?? "7";
  const translation = args.translation ?? "20"; // 20 = Saheeh International
  const theme = args.theme ?? "midnight";
  const from = args.from ? Number(args.from) : undefined;
  const to = args.to ? Number(args.to) : undefined;

  console.log(`Fetching surah ${surah} (recitation ${recitation}, translation ${translation})...`);

  const chapter = await getJson<any>(`${API}/chapters/${surah}?language=en`);
  const surahNameEnglish = chapter.chapter.name_simple;
  const surahNameArabic = chapter.chapter.name_arabic;

  const versesUrl =
    `${API}/verses/by_chapter/${surah}?language=en&words=true` +
    `&translations=${translation}&audio=${recitation}` +
    `&fields=text_uthmani&word_fields=text_uthmani&per_page=300`;
  const data = await getJson<any>(versesUrl);

  const audioDir = `audio/${surah}_${recitation}`;
  const publicDir = join("public", audioDir);

  const ayahs = [];
  for (const v of data.verses as any[]) {
    const ayahNum = Number(v.verse_key.split(":")[1]);
    if (from && ayahNum < from) continue;
    if (to && ayahNum > to) continue;

    const words = (v.words as any[])
      .filter((w) => w.char_type_name === "word")
      .map((w) => ({ text: w.text_uthmani as string, position: w.position as number }));

    const segments: number[][] = v.audio?.segments ?? [];
    const timedWords = words.map((w, i) => {
      // Segments are keyed by word position (1-based). Match by position, else index.
      const seg =
        segments.find((s) => s[0] === w.position) ?? segments[i] ?? [w.position, 0, 0];
      const { start, end } = segMs(seg);
      return { text: w.text, start: start / 1000, end: end / 1000 };
    });

    const lastEnd = timedWords.length ? timedWords[timedWords.length - 1].end : 4;
    const durationInSeconds = Math.max(2, lastEnd + 0.6);

    // Download the per-ayah audio file.
    const audioUrl = AUDIO_BASE + v.audio.url;
    const fileName = `${String(surah).padStart(3, "0")}${String(ayahNum).padStart(3, "0")}.mp3`;
    const localPath = join(publicDir, fileName);
    console.log(`  ${v.verse_key}: ${words.length} words, ~${durationInSeconds.toFixed(1)}s`);
    await download(audioUrl, localPath);

    ayahs.push({
      number: ayahNum,
      key: v.verse_key,
      arabic: words.map((w) => w.text).join(" "),
      translation: stripHtml(v.translations?.[0]?.text ?? ""),
      audioSrc: `${audioDir}/${fileName}`,
      durationInSeconds: Number(durationInSeconds.toFixed(2)),
      words: timedWords,
    });
  }

  const props = {
    surahNameEnglish,
    surahNameArabic,
    reciterName: args.reciterName ?? RECITER_NAMES[recitation] ?? `Recitation ${recitation}`,
    translationName: args.translationName ?? "Saheeh International",
    theme,
    ayahGapSeconds: args.gap ? Number(args.gap) : 0.5,
    ayahs,
  };

  const outFile = args.out ?? `src/data/surah-${surah}.json`;
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(props, null, 2));
  console.log(`\n✅ Wrote ${ayahs.length} ayahs to ${outFile}`);
  console.log(`   Audio in ${publicDir}`);
  console.log(`\nRender it with:`);
  console.log(`   npx remotion render QuranRecitation out/surah-${surah}.mp4 --props=${outFile}`);
}

main().catch((err) => {
  console.error("\n❌ Fetch failed:", err.message);
  process.exit(1);
});
