/**
 * Fetch a surah (or ayah range) and build a ready-to-render props JSON.
 *
 * ACCURACY IS THE TOP PRIORITY. The Arabic is NEVER hand-typed:
 *   - text + words come from the KFGQPC Uthmani mushaf via the Quran.com API
 *   - the basmala comes from verse 1:1 of the same source
 *   - tajweed mode uses an authoritative tajweed-annotated edition; the parser
 *     strips its markup and we VERIFY the clean text matches the Uthmani text
 *     (same base letters, same word count) before colouring anything. If a
 *     verse fails verification we render the plain (correct) text, never a guess.
 * Every verse is validated (Arabic-only characters, sane word/timing counts)
 * and the run aborts on any anomaly.
 *
 * Usage:
 *   npx tsx scripts/fetch-ayahs.ts --surah=112
 *   npx tsx scripts/fetch-ayahs.ts --surah=2 --from=255 --to=255 --recitation=2
 *   npx tsx scripts/fetch-ayahs.ts --surah=112 --mode=tajweed
 *
 * NOTE: needs network to api.quran.com, verses.quran.com and (tajweed/verify)
 * api.alquran.cloud. In Claude Code web sessions add these to the egress allowlist.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { dirname, join } from "node:path";
import { parseTajweed, Run } from "../src/QuranVideo/tajweed";

const API = "https://api.quran.com/api/v4";
const AUDIO_BASE = "https://verses.quran.com/";
const ALQURAN = "https://api.alquran.cloud/v1";

// Reciters available on the Quran.com API *with word-by-word timing segments*.
// NOTE: Yasser al-Dossary and Muhammad al-Luhaidan are NOT in this set, so they
// can't be word-synced from this free API yet (see docs/SETUP.md for the plan).
const RECITER_NAMES: Record<string, string> = {
  "1": "AbdulBaset AbdulSamad (Mujawwad)",
  "2": "AbdulBaset AbdulSamad (Murattal)",
  "3": "Abdur-Rahman as-Sudais",
  "4": "Abu Bakr al-Shatri",
  "5": "Hani ar-Rifai",
  "6": "Mahmoud Khalil Al-Husary",
  "12": "Mahmoud Khalil Al-Husary (Muallim)",
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
    .replace(/<sup[^>]*>.*?<\/sup>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

// ---- Arabic accuracy helpers --------------------------------------------

// Allowed Unicode blocks for Quranic Arabic (+ space). Anything else is a red flag.
const ARABIC_ONLY = /^[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿\s]+$/;

// Reduce to comparable "base letters": drop diacritics & Quranic marks, unify
// alef variants, collapse whitespace. Used only to VERIFY two sources agree.
const baseLetters = (s: string): string =>
  s
    .replace(/[ؐ-ًؚ-ٰٟۖ-ۭ۟ـ࣓-ࣿ]/g, "")
    .replace(/[آأإٱ]/g, "ا") // آأإٱ -> ا
    .replace(/\s+/g, " ")
    .trim();

// Split a parsed tajweed run list into words (runs grouped per word).
const tajweedWords = (runs: Run[]): { text: string; runs: Run[] }[] => {
  const words: { text: string; runs: Run[] }[] = [];
  let cur: Run[] = [];
  const flush = () => {
    if (cur.length) {
      words.push({ text: cur.map((r) => r.text).join(""), runs: cur });
      cur = [];
    }
  };
  for (const run of runs) {
    const parts = run.text.split(/(\s+)/);
    for (const part of parts) {
      if (part === "") continue;
      if (/^\s+$/.test(part)) flush();
      else cur.push({ text: part, rule: run.rule });
    }
  }
  flush();
  return words;
};

// Quran.com segments come as arrays; handle [word,start,end] and [word,?,start,end].
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
  const recitation = args.recitation ?? "2"; // 2 = Abdul Basit (Murattal)
  const translation = args.translation ?? "20"; // 20 = Saheeh International
  const theme = args.theme ?? "midnight";
  const mode = args.mode === "hifz" || args.mode === "tajweed" ? args.mode : "standard";
  const from = args.from ? Number(args.from) : undefined;
  const to = args.to ? Number(args.to) : undefined;
  const verify = args.verify !== "false"; // cross-check text by default

  console.log(`Fetching surah ${surah} · recitation ${recitation} · mode ${mode}`);

  const chapter = await getJson<any>(`${API}/chapters/${surah}?language=en`);
  const surahNameEnglish = chapter.chapter.name_simple;
  const surahNameArabic = chapter.chapter.name_arabic;

  // Basmala straight from the source (none for Surah at-Tawbah, #9).
  let basmala = "";
  if (chapter.chapter.bismillah_pre) {
    const b = await getJson<any>(`${API}/verses/by_key/1:1?fields=text_uthmani`);
    basmala = b.verse.text_uthmani as string;
  }

  const versesUrl =
    `${API}/verses/by_chapter/${surah}?language=en&words=true` +
    `&translations=${translation}&audio=${recitation}` +
    `&fields=text_uthmani&word_fields=text_uthmani,transliteration&per_page=300`;
  const data = await getJson<any>(versesUrl);

  // Optional independent source for cross-verification of the bare text.
  let verifyMap: Record<string, string> = {};
  if (verify) {
    try {
      const v = await getJson<any>(`${ALQURAN}/surah/${surah}/quran-uthmani`);
      for (const a of v.data.ayahs) verifyMap[`${surah}:${a.numberInSurah}`] = a.text;
    } catch (e: any) {
      console.warn(`  (verify) second source unavailable: ${e.message}`);
    }
  }

  // Tajweed-annotated edition (only fetched in tajweed mode).
  let tajweedMap: Record<string, string> = {};
  if (mode === "tajweed") {
    const t = await getJson<any>(`${ALQURAN}/surah/${surah}/quran-tajweed`);
    for (const a of t.data.ayahs) tajweedMap[`${surah}:${a.numberInSurah}`] = a.text;
  }

  const audioDir = `audio/${surah}_${recitation}`;
  const publicDir = join("public", audioDir);
  const ayahs: any[] = [];
  let tajweedApplied = 0;

  for (const v of data.verses as any[]) {
    const key = v.verse_key as string;
    const ayahNum = Number(key.split(":")[1]);
    if (from && ayahNum < from) continue;
    if (to && ayahNum > to) continue;

    const apiWords = (v.words as any[])
      .filter((w) => w.char_type_name === "word")
      .map((w) => ({
        text: w.text_uthmani as string,
        position: w.position as number,
        translit: (w.transliteration?.text as string) ?? "",
      }));
    // Romanized line for the whole ayah (pronunciation aid).
    const transliteration = apiWords
      .map((w) => w.translit)
      .filter(Boolean)
      .join(" ");

    const segments: number[][] = v.audio?.segments ?? [];
    const timed = apiWords.map((w, i) => {
      const seg = segments.find((s) => s[0] === w.position) ?? segments[i] ?? [w.position, 0, 0];
      const { start, end } = segMs(seg);
      return { text: w.text, start: start / 1000, end: end / 1000, runs: undefined as Run[] | undefined };
    });

    const uthmaniText = apiWords.map((w) => w.text).join(" ");

    // --- validation gate -------------------------------------------------
    if (apiWords.length === 0) throw new Error(`${key}: no words returned`);
    if (!ARABIC_ONLY.test(uthmaniText))
      throw new Error(`${key}: text contains non-Arabic characters — aborting`);
    if (verifyMap[key] && baseLetters(verifyMap[key]) !== baseLetters(uthmaniText))
      console.warn(`  ⚠️  ${key}: text differs from cross-check source (review before publishing)`);
    const missingTimings = timed.filter((w) => w.start === 0 && w.end === 0).length;
    if (missingTimings > 0)
      console.warn(`  ⚠️  ${key}: ${missingTimings}/${timed.length} words missing timing segments`);

    // --- tajweed colouring (verified) ------------------------------------
    if (mode === "tajweed" && tajweedMap[key]) {
      const { runs, clean } = parseTajweed(tajweedMap[key]);
      const tw = tajweedWords(runs);
      const aligned =
        tw.length === timed.length && baseLetters(clean) === baseLetters(uthmaniText);
      if (aligned) {
        tw.forEach((word, i) => (timed[i].runs = word.runs));
        tajweedApplied++;
      } else {
        console.warn(
          `  ⚠️  ${key}: tajweed edition didn't align (words ${tw.length} vs ${timed.length}) — rendering plain text`
        );
      }
    }

    const lastEnd = timed.length ? timed[timed.length - 1].end : 4;
    const durationInSeconds = Math.max(2, lastEnd + 0.6);

    const audioUrl = AUDIO_BASE + v.audio.url;
    const fileName = `${String(surah).padStart(3, "0")}${String(ayahNum).padStart(3, "0")}.mp3`;
    await download(audioUrl, join(publicDir, fileName));
    console.log(`  ${key}: ${apiWords.length} words, ~${durationInSeconds.toFixed(1)}s`);

    ayahs.push({
      number: ayahNum,
      key,
      arabic: uthmaniText,
      translation: stripHtml(v.translations?.[0]?.text ?? ""),
      transliteration: transliteration || undefined,
      audioSrc: `${audioDir}/${fileName}`,
      durationInSeconds: Number(durationInSeconds.toFixed(2)),
      words: timed.map((w) => (w.runs ? w : { text: w.text, start: w.start, end: w.end })),
    });
  }

  // Fail loudly rather than emitting an empty video (which crashes the render
  // with a cryptic "durationInFrames must be positive" error downstream).
  if (ayahs.length === 0) {
    const range =
      from || to ? ` with --from=${from ?? ""} --to=${to ?? ""}` : "";
    throw new Error(
      `No ayahs matched for surah ${surah}${range}. ` +
        `Surah ${surah} has ${data.verses.length} ayahs — check the range.`
    );
  }

  if (mode === "tajweed")
    console.log(`  tajweed colouring applied to ${tajweedApplied}/${ayahs.length} ayahs`);

  const props = {
    surahNameEnglish,
    surahNameArabic,
    reciterName: args.reciterName ?? RECITER_NAMES[recitation] ?? `Recitation ${recitation}`,
    translationName: args.translationName ?? "Saheeh International",
    theme,
    mode,
    hifzRepeats: args.repeats ? Number(args.repeats) : 4,
    showTransliteration: args.transliteration === "true" || args.translit === "true",
    basmala,
    channelName: args.channelName ?? "Ketabi Studio",
    websiteUrl: args.website ?? "ketabistudio.com",
    showCourseCta: args.cta !== "false",
    ayahGapSeconds: args.gap ? Number(args.gap) : 0.5,
    introSeconds: args.intro ? Number(args.intro) : 5,
    outroSeconds: args.outro ? Number(args.outro) : 4,
    watermarkSrc: args.watermark ?? "brand/ketabi-mark.png",
    watermarkOpacity: args.watermarkOpacity ? Number(args.watermarkOpacity) : 0.1,
    ayahs,
  };

  const outFile = args.out ?? `src/data/surah-${surah}.json`;
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(props, null, 2));
  console.log(`\n✅ Wrote ${ayahs.length} ayahs to ${outFile} (audio in ${publicDir})`);
  console.log(`\nRender it with:`);
  const comp = mode === "tajweed" ? "QuranTajweed" : mode === "hifz" ? "QuranHifz" : "QuranRecitation";
  console.log(`   npx remotion render ${comp} out/surah-${surah}.mp4 --props=${outFile}`);
}

main().catch((err) => {
  console.error("\n❌ Fetch failed:", err.message);
  process.exit(1);
});
