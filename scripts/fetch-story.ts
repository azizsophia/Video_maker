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
import { mkdir, writeFile, rm } from "node:fs/promises";
import { createWriteStream, existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { Readable } from "node:stream";
import { dirname, join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileP = promisify(execFile);

// Run ffmpeg, falling back to Remotion's bundled binary if system ffmpeg is absent.
async function ffmpegRun(args: string[]): Promise<void> {
  try {
    await execFileP("ffmpeg", args, { maxBuffer: 1 << 27 });
  } catch (e: any) {
    if (e?.code === "ENOENT") {
      await execFileP("npx", ["remotion", "ffmpeg", ...args], { maxBuffer: 1 << 27 });
      return;
    }
    throw e;
  }
}

const PORTRAIT_VF = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30";
const X264 = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p"];

// Pre-crop a downloaded clip to exactly 1080x1920 (center-crop "cover") ONCE,
// so the render composites a tiny already-vertical file instead of re-extracting
// frames from a large landscape source every frame. Caps length and normalises fps.
async function transcodePortrait(src: string, dest: string): Promise<void> {
  await ffmpegRun(["-y", "-i", src, "-t", "12", "-an", "-vf", PORTRAIT_VF, ...X264, dest]);
}

// Stitch the per-beat clips into ONE continuous 1080x1920 background for the whole
// video (each clip looped/trimmed to its beat's duration; black where a beat has no
// footage — those beats render an opaque code scene on top). The render then reads a
// SINGLE video sequentially (OffthreadVideo's fast path) instead of re-opening 10
// separate files per frame — the fix for the 60-90 min footage renders.
async function buildBackground(track: { src: string | null; dur: number }[], dest: string): Promise<void> {
  const { resolve } = await import("node:path");
  const partsDir = join(CACHE_DIR, "bgparts");
  await rm(partsDir, { recursive: true, force: true });
  await mkdir(partsDir, { recursive: true });
  const pieces: string[] = [];
  for (let i = 0; i < track.length; i++) {
    const { src, dur } = track[i];
    if (dur <= 0.04) continue;
    const piece = join(partsDir, `p-${String(i).padStart(3, "0")}.mp4`);
    if (src) {
      await ffmpegRun(["-y", "-stream_loop", "-1", "-i", join("public", src), "-t", dur.toFixed(2), "-an", "-vf", PORTRAIT_VF, ...X264, piece]);
    } else {
      await ffmpegRun(["-y", "-f", "lavfi", "-i", "color=c=black:s=1080x1920:r=30", "-t", dur.toFixed(2), "-an", "-vf", "fps=30", ...X264, piece]);
    }
    pieces.push(piece);
  }
  const listFile = join(partsDir, "concat.txt");
  await writeFile(listFile, pieces.map((p) => `file '${resolve(p)}'`).join("\n"));
  // A one-frame legibility gradient (dark top + bottom, light middle) baked into
  // the footage track. It has to live here, not in the Remotion render, because
  // that render is opaque chroma-green for keying — a gradient over green would
  // not key out cleanly. alpha = 0.18..0.6 via |cos| down the frame.
  const gradPng = join(partsDir, "grad.png");
  await ffmpegRun([
    "-y", "-f", "lavfi", "-i", "color=c=black:s=1080x1920", "-frames:v", "1",
    "-vf", "format=rgba,geq=r=0:g=0:b=0:a='255*(0.18+0.42*abs(cos(PI*Y/H)))'",
    gradPng,
  ]);
  // Concatenate the beats into one clean, continuous track and bake the gradient
  // in, in a single pass.
  await ffmpegRun([
    "-y", "-f", "concat", "-safe", "0", "-i", listFile, "-i", gradPng,
    "-filter_complex", "[0:v]fps=30[v0];[v0][1:v]overlay=format=auto[v]",
    "-map", "[v]", "-an", ...X264, dest,
  ]);
  await rm(partsDir, { recursive: true, force: true });
}

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

// Pronunciation map: ElevenLabs mis-says some short Arabic terms (e.g. "Surah"
// -> "sooRAW", "dua" -> "D-U-A"). We send a phonetic spelling to the voice but
// RESTORE the correct spelling for the on-screen captions, so the audio is
// right AND the text is right. Add words here as you catch them (display
// spelling -> phonetic). Best-guess spellings; tweak one line if still off.
const PRONUNCIATION: Record<string, string> = {
  surah: "soorah",
  surahs: "soorahs",
  dua: "doo-aa",
  duas: "doo-aas",
  khalil: "khaleel",
};
function pronounce(text: string): { tts: string; back: Record<string, string> } {
  const back: Record<string, string> = {};
  const tts = text.replace(/[A-Za-z']+/g, (w) => {
    const ph = PRONUNCIATION[w.toLowerCase()];
    if (!ph) return w;
    const cased = /^[A-Z]/.test(w) ? ph.charAt(0).toUpperCase() + ph.slice(1) : ph;
    back[cased.toLowerCase().replace(/[^a-z]/g, "")] = w; // normalized phonetic -> display word
    return cased;
  });
  return { tts, back };
}
function restoreWord(word: string, back: Record<string, string>): string {
  const m = word.match(/^([^A-Za-z]*)([A-Za-z'-]+)([^A-Za-z]*)$/);
  if (!m) return word;
  const norm = m[2].toLowerCase().replace(/[^a-z]/g, "");
  return back[norm] ? m[1] + back[norm] + m[3] : word;
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

// Pull the authoritative Arabic RECITATION audio for a single verse (Quran.com
// reciter) so it can play while the verse is on screen — fills the silence and
// lets viewers hear the ayah, not just read it. Single verse only; cached.
async function fetchVerseAudio(
  ref: string,
  recitation: string
): Promise<{ src: string; duration: number } | undefined> {
  if (!/^\d+:\d+$/.test(ref)) return undefined; // single ayah only
  const recHash = sha(`rec|${ref}|${recitation}`);
  const mp3 = join(CACHE_DIR, `r-${recHash}.mp3`);
  const meta = join(CACHE_DIR, `r-${recHash}.json`);
  const rel = `story-cache/r-${recHash}.mp3`;
  if (existsSync(mp3) && existsSync(meta)) {
    const { duration } = JSON.parse(await readFile(meta, "utf8"));
    return { src: rel, duration };
  }
  try {
    const v = await getJson<any>(`${API}/verses/by_key/${ref}?language=en&audio=${recitation}`);
    const verse = v.verse;
    if (!verse?.audio?.url) return undefined;
    const segsArr: number[][] = verse.audio?.segments ?? [];
    const lastEnd = segsArr.length ? segsArr[segsArr.length - 1][segsArr[0].length - 1] / 1000 : 6;
    const duration = Math.max(2, lastEnd + 0.5);
    await download(resolveAudioUrl(verse.audio.url), mp3);
    await writeFile(meta, JSON.stringify({ duration }));
    console.log(`  recitation ${ref}: pulled reciter audio ${duration.toFixed(1)}s`);
    return { src: rel, duration };
  } catch (e: any) {
    console.log(`  recitation ${ref}: unavailable (${e.message?.slice(0, 50)})`);
    return undefined;
  }
}

// Real cinematic stock footage from Pexels (free). ANICONIC ONLY — query for
// nature/skies/water/architecture/light, never people.
const PEXELS = "https://api.pexels.com/videos";
async function fetchStock(query: string): Promise<string | undefined> {
  const key = (process.env.PEXELS_API_KEY || "").trim();
  if (!key) {
    console.log(`  stock: PEXELS_API_KEY not set — skipping "${query}" (using code scene)`);
    return undefined;
  }
  // "v3" = portrait-sourced. Requesting portrait clips avoids upscaling a
  // landscape clip ~1.8x to fill 1080x1920 (the main softness culprit).
  const hash = sha(`stock|v3portrait|${query}`);
  const dest = join(CACHE_DIR, `v-${hash}.mp4`);
  const rel = `story-cache/v-${hash}.mp4`;
  if (existsSync(dest)) {
    console.log(`  stock: cached (${query})`);
    return rel;
  }
  try {
    // orientation=portrait + a tall min size so clips fill the 9:16 frame natively.
    const res = await fetch(
      `${PEXELS}/search?query=${encodeURIComponent(query)}&orientation=portrait&size=medium&per_page=40`,
      { headers: { Authorization: key } }
    );
    if (!res.ok) throw new Error(`Pexels ${res.status} (${(await res.text()).slice(0, 80)})`);
    const data: any = await res.json();
    const videos: any[] = data.videos ?? [];
    let best: any;
    for (const v of videos) {
      const files = (v.video_files ?? []).filter((ff: any) => ff.file_type === "video/mp4" && ff.link);
      if (!files.length) continue;
      // Prefer PORTRAIT files at >=1080 wide so there's no upscaling.
      files.sort((a: any, b: any) => {
        const ap = (a.height || 0) > (a.width || 0) ? 0 : 1;
        const bp = (b.height || 0) > (b.width || 0) ? 0 : 1;
        if (ap !== bp) return ap - bp;
        // then the one whose width is closest to (and ideally >=) 1080
        const aw = a.width || 0, bw = b.width || 0;
        const ascore = aw >= 1080 ? aw - 1080 : (1080 - aw) * 3;
        const bscore = bw >= 1080 ? bw - 1080 : (1080 - bw) * 3;
        return ascore - bscore;
      });
      best = files[0];
      break;
    }
    if (!best) {
      console.log(`  stock: 0 results for "${query}" (${videos.length} videos) — using code scene`);
      return undefined;
    }
    const raw = dest.replace(/\.mp4$/, ".raw.mp4");
    await download(best.link, raw);
    // Pre-crop to 1080x1920 so the render stays fast (see transcodePortrait).
    try {
      await transcodePortrait(raw, dest);
      await rm(raw, { force: true });
      console.log(`  stock: downloaded ${best.width}x${best.height} -> cropped 1080x1920 (${query})`);
    } catch (te: any) {
      // If ffmpeg isn't available, fall back to the raw clip (still renders, just slower).
      await rm(dest, { force: true }).catch(() => {});
      const { rename } = await import("node:fs/promises");
      await rename(raw, dest);
      console.log(`  stock: downloaded ${best.width}x${best.height} (uncropped — ffmpeg unavailable: ${te.message?.slice(0, 60)}) (${query})`);
    }
    return rel;
  } catch (e: any) {
    console.log(`  stock: failed for "${query}" (${e.message}) — using code scene`);
    return undefined;
  }
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

  // Footage key diagnostic (never prints the secret itself — only its length).
  // A 13s "0 clips" build with no key length here means the repo secret
  // PEXELS_API_KEY is empty / not reaching the job.
  const wantsStock = (story.segments as any[]).some((s) => s.stock);
  if (wantsStock) {
    const pk = (process.env.PEXELS_API_KEY || "").trim();
    console.log(
      pk
        ? `🎞  PEXELS_API_KEY detected (${pk.length} chars) — will pull stock footage`
        : `🎞  PEXELS_API_KEY is EMPTY/UNSET — every "stock" beat will fall back to a code scene`
    );
  }

  // Atmospheric bed (sound effect, never music) under the whole video.
  let ambientSrc: string | undefined;
  let ambientDuration: number | undefined;
  if (story.sound?.ambient) {
    ambientDuration = Number(story.sound.ambientDuration ?? 22);
    ambientSrc = await cachedSfx(story.sound.ambient, ambientDuration);
  }

  const segments: any[] = [];
  const facts: string[] = []; // verse/hadith fact sheet for pre-publish verification
  const stockLog: { query: string; ok: boolean }[] = []; // Pexels footage audit
  let cursor = 0;
  let i = 0;
  for (const seg of story.segments as any[]) {
    if (seg.pauseBefore) cursor += Number(seg.pauseBefore); // dramatic silence
    const sfxSrc = seg.sfx ? await cachedSfx(seg.sfx, 3) : undefined;
    const stockSrc = seg.stock ? await fetchStock(String(seg.stock)) : undefined;
    if (seg.stock) stockLog.push({ query: String(seg.stock), ok: !!stockSrc });
    if (seg.type === "narration") {
      const text: string = seg.say ?? seg.text;
      // Send phonetic spelling to the voice; restore display spelling for captions.
      const { tts: ttsText, back } = pronounce(text);
      // Cache narration by the SPOKEN text so changed pronunciations regenerate.
      const hash = sha(`${voice}|${model}|${ttsText}`);
      const mp3 = join(CACHE_DIR, `n-${hash}.mp3`);
      const meta = join(CACHE_DIR, `n-${hash}.json`);
      let words: any[];
      let duration: number;
      if (existsSync(mp3) && existsSync(meta)) {
        ({ words, duration } = JSON.parse(await readFile(meta, "utf8")));
        console.log(`  narration ${i}: cached (${text.slice(0, 40)}...)`);
      } else {
        ({ words, duration } = await tts(ttsText, voice, model, mp3));
        words = words.map((w) => ({ ...w, text: restoreWord(w.text, back) }));
        await writeFile(meta, JSON.stringify({ words, duration }));
        console.log(`  narration ${i}: generated ${duration.toFixed(1)}s (${text.slice(0, 40)}...)`);
      }
      let vArabic = seg.arabic || undefined;
      let vTrans = seg.translation || undefined;
      // ACCURACY GUARD: Qur'an Arabic must come from the authoritative source by
      // reference. Hand-typed Arabic is only allowed for hadith (flagged + manually
      // verified). This makes a wrong/garbled/abbreviated verse impossible to ship.
      if (seg.arabic && !seg.verseRef && !seg.hadith) {
        throw new Error(
          `Accuracy guard failed: a segment has hand-typed Arabic but no "verseRef". ` +
          `Use "verseRef" (e.g. "15:9") so the exact text + official translation are pulled ` +
          `from Quran.com, or flag "hadith": true if it is a verified hadith. Got: ${seg.arabic.slice(0, 50)}`
        );
      }
      let rec: { src: string; duration: number } | undefined;
      if (seg.verseRef) {
        const vv = await fetchVerse(String(seg.verseRef), translation);
        vArabic = vv.arabic;
        vTrans = vv.translation;
        facts.push(`Qur'an ${seg.verseRef}  (${seg.source ?? ""})\n  AR: ${vArabic}\n  EN: ${vTrans}`);
        console.log(`  verse ${seg.verseRef}: pulled exact text + official translation from Quran.com`);
        // Recitation audio plays while the verse holds (unless opted out).
        if (seg.recite !== false) rec = await fetchVerseAudio(String(seg.verseRef), recitation);
      } else if (seg.hadith && seg.arabic) {
        facts.push(`HADITH  (${seg.source ?? ""})  [hand-typed, manually verified]\n  AR: ${seg.arabic}\n  EN: ${vTrans ?? ""}`);
      }
      // Hold a verse on screen long enough to READ it AND hear its recitation —
      // the verses are the whole point, they must not fly by or sit silent. If we
      // have reciter audio, hold for its full length; else reading-time based.
      const isVerse = !!(vArabic && (seg.verseRef || seg.hadith));
      const recStart = duration + 0.55; // recitation begins just after the narration line
      const holdAfter = !isVerse
        ? 0
        : rec
          ? rec.duration + 1.1
          : Math.max(3, Math.min(6.5, (vTrans ? vTrans.split(/\s+/).length : 8) * 0.33));
      segments.push({
        kind: "narration",
        audioSrc: `story-cache/n-${hash}.mp3`,
        fromSeconds: Number(cursor.toFixed(2)),
        durationInSeconds: Number((duration + GAP + holdAfter).toFixed(2)),
        words,
        source: seg.source ?? (seg.caption && /\d|hasan|Muslim|Tirmidhi|Quran/i.test(seg.caption) ? seg.caption : undefined),
        sfxSrc,
        hook: seg.hook || undefined,
        scene: seg.scene || undefined,
        arabic: vArabic,
        translation: vTrans,
        title: seg.title || undefined,
        titleSub: seg.titleSub || undefined,
        recSrc: rec?.src,
        recStart: rec ? Number(recStart.toFixed(2)) : undefined,
        data: seg.data || undefined,
        stock: stockSrc,
      });
      cursor += duration + GAP + holdAfter;
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
        stock: stockSrc,
      });
      cursor += duration + GAP;
    }
    i++;
  }

  if (stockLog.length) {
    const ok = stockLog.filter((s) => s.ok).length;
    console.log(
      `\n🎞  STOCK SUMMARY: ${ok}/${stockLog.length} Pexels clips downloaded` +
        (ok === 0
          ? ` — NONE pulled. If the key length printed above, the queries returned nothing or the key was rejected (see the "stock:" lines). If no key length printed, the PEXELS_API_KEY secret is empty.`
          : ``)
    );
  }

  // Stitch ONE continuous footage backdrop for the whole timeline (the fast-render
  // fix). Reconstruct the timeline from the built segments: each beat's cropped
  // clip for its exact duration, black filler for gaps / non-footage beats.
  let backgroundSrc: string | undefined;
  const anyStock = segments.some((s: any) => s.stock);
  if (anyStock) {
    const track: { src: string | null; dur: number }[] = [];
    let t = 0;
    for (const s of segments as any[]) {
      if (s.fromSeconds > t + 0.04) track.push({ src: null, dur: s.fromSeconds - t }); // silent gap
      track.push({ src: s.stock || null, dur: s.durationInSeconds });
      t = s.fromSeconds + s.durationInSeconds;
    }
    const bgHash = sha(`bg|grad2|${track.map((e) => `${e.src ?? "_"}:${e.dur.toFixed(2)}`).join("|")}`);
    const bgDest = join(CACHE_DIR, `bg-${bgHash}.mp4`);
    backgroundSrc = `story-cache/bg-${bgHash}.mp4`;
    if (existsSync(bgDest)) {
      console.log(`  background: cached (${track.length} pieces)`);
    } else {
      console.log(`  background: stitching ${track.length} pieces -> one ${t.toFixed(0)}s track...`);
      try {
        await buildBackground(track, bgDest);
        console.log(`  background: built ${backgroundSrc}`);
      } catch (e: any) {
        backgroundSrc = undefined;
        console.log(`  background: FAILED (${e.message?.slice(0, 80)}) — falling back to code scenes`);
      }
    }
  }

  const props = {
    title: story.title,
    theme,
    reciterName: args.reciterName ?? "Sheikh Abdur-Rahman as-Sudais",
    voiceName: story.voiceName ?? "Daniel",
    websiteUrl: args.website ?? "ketabistudio.com",
    ambientSrc,
    ambientDuration,
    backgroundSrc,
    segments,
  };
  const outFile = args.out ?? "src/data/story-render.json";
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(props, null, 2));

  // Pre-publish fact sheet: exact verses/hadith + every declared on-screen
  // claim + sources, with a review sign-off gate. Reviewed before posting.
  const factsFile = join(dirname(outFile), "story-facts.txt");
  // story.claims: each on-screen factual assertion + its source. Accepts
  // {claim, source} objects or "claim — source" strings.
  const claims = (story.claims as Array<string | { claim: string; source?: string }>) ?? [];
  const claimsBlock = claims.length
    ? claims
        .map((c, i) => {
          const line = typeof c === "string" ? c : `${c.claim}   [source: ${c.source ?? "MISSING"}]`;
          return `  [ ] ${i + 1}. ${line}`;
        })
        .join("\n")
    : "  (none declared — add a top-level \"claims\" array to the story for full coverage)";
  const factsBody =
    `FACT SHEET — ${story.title}\n${"=".repeat(60)}\n\n` +
    `VERSES & HADITH (auto-pulled from Quran.com / verified hadith):\n` +
    (facts.length ? facts.join("\n\n") : "(no Qur'an/hadith quoted)") +
    `\n\nON-SCREEN CLAIMS — REVIEW CHECKLIST:\n${claimsBlock}` +
    `\n\nSOURCES:\n` +
    ((story.sources as string[]) ?? []).map((s) => `- ${s}`).join("\n") +
    (stockLog.length
      ? `\n\nSTOCK FOOTAGE (Pexels) — confirm each is aniconic (no people/faces):\n` +
        stockLog.map((s) => `  [${s.ok ? "OK" : "MISSING"}] ${s.query}`).join("\n") +
        `\n  (${stockLog.filter((s) => s.ok).length}/${stockLog.length} clips pulled; MISSING = fell back to a code scene)`
      : "") +
    `\n\n${"-".repeat(60)}\n` +
    `REVIEW SIGN-OFF (required before posting — sensitive topic):\n` +
    `  [ ] Every verse checked against the Mushaf (reference + text)\n` +
    `  [ ] Every claim above matches its cited source\n` +
    `  [ ] No interpretation presented as fact (tafsir attributed or cut)\n` +
    `  [ ] Reviewed by: ____________________   Date: __________\n` +
    `  [ ] Knowledgeable / scholar check (recommended): ____________________\n`;
  await writeFile(factsFile, factsBody);
  console.log(`\n✅ Story built: ${segments.length} segments, ~${cursor.toFixed(0)}s -> ${outFile}`);
  console.log(`📋 Fact sheet -> ${factsFile}\n${factsBody}`);
}

main().catch((e) => {
  console.error("\n❌ Story build failed:", e.message);
  process.exit(1);
});
