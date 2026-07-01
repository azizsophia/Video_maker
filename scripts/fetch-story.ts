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

// The Uthmani text from Quran.com carries small Qur'anic annotation signs
// (waqf / pause marks, sajdah, rub, end-of-ayah). Our display font does not
// have glyphs for some of them, so they render as empty boxes (tofu). They are
// recitation aids, not part of the verse's letters or harakat, so we drop them
// for a clean on-screen verse. The essential superscript "dagger" alef (U+0670)
// sits below this range and is preserved.
const cleanArabic = (s?: string): string | undefined =>
  s ? s.replace(/[ۖ-ۜ۝۞۩]/g, "").replace(/\s{2,}/g, " ").trim() : s;

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

// Arabic names are VOICED from a light phonetic respelling so ElevenLabs says
// them correctly, while the on-screen caption keeps the proper spelling. The
// respelling is a pure token-for-token swap (no spaces added/removed), so the
// spoken word count always matches the caption word count and the two stay in
// sync. Captions are remapped back to the proper tokens after timing.
const PHONETIC: Record<string, string> = {
  yaqub: "Yaqoob",
  ishaq: "Is-haaq",
  ibrahim: "Ibraheem",
  binyamin: "Bin-yameen",
  "qur'an": "Quraan",
  quran: "Quraan",
  alayhi: "alayhee",
  salam: "salaam",
  khadijah: "Kadeeja",
  jibril: "Jibreel",
  musa: "Moosa",
  aisha: "Aisha",
  makkah: "Makkah",
  waraqah: "Waraka",
  hira: "Heera",
};
const stripEdges = (tok: string): [string, string, string] => {
  const m = tok.match(/^([^A-Za-z']*)(.*?)([^A-Za-z']*)$/s);
  return m ? [m[1], m[2], m[3]] : ["", tok, ""];
};
const phoneticize = (text: string): string =>
  text
    .split(/(\s+)/)
    .map((tok) => {
      if (/^\s+$/.test(tok) || !tok) return tok;
      const [pre, core, post] = stripEdges(tok);
      const repl = PHONETIC[core.toLowerCase()];
      return repl ? pre + repl + post : tok;
    })
    .join("");

async function tts(text: string, voice: string, model: string, dest: string) {
  const key = (process.env.ELEVENLABS_API_KEY || "").trim();
  if (!key) throw new Error("ELEVENLABS_API_KEY is not set.");
  const res = await fetch(`${ELEVEN}/text-to-speech/${voice}/with-timestamps`, {
    method: "POST",
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      model_id: model,
      // Warmer, more emotional read (lower stability + some style); pacing and
      // pauses come from the script punctuation (commas, full stops, ellipses).
      voice_settings: { stability: 0.32, similarity_boost: 0.8, style: 0.55, use_speaker_boost: true },
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
  // Honor the story's own theme (cinematic stories set "ketabi") when no --theme
  // is given. Use || so an empty CLI value falls through to the story default.
  const theme = args.theme || story.theme || story.look || "midnight";
  const GAP = 0.35; // small breath between segments

  const segments: any[] = [];
  let cursor = 0;
  let i = 0;
  for (const seg of story.segments as any[]) {
    if (seg.type === "narration") {
      // Caption keeps the proper spelling; the voice speaks a light phonetic
      // respelling of the Arabic names so they are pronounced correctly.
      const display: string = seg.text ?? seg.say;
      const spoken: string = seg.say ?? phoneticize(display);
      const dest = join("public", "story", `n${i}.mp3`);
      const { words, duration } = await tts(spoken, voice, model, dest);
      // Remap the timed caption words back to the proper spelling (token-for-token).
      const displayTokens = display.trim().split(/\s+/);
      if (displayTokens.length === words.length) {
        for (let k = 0; k < words.length; k++) words[k] = { ...words[k], text: displayTokens[k] };
      } else if (spoken !== display) {
        console.warn(`  caption remap skipped (n${i}): ${displayTokens.length} caption vs ${words.length} spoken tokens`);
      }
      console.log(`  narration ${i}: ${duration.toFixed(1)}s (${display.slice(0, 40)}...)`);
      // Optional on-screen Arabic verse (shown, never recited). Pulled from the
      // validated Quran.com source so Arabic is never hand-typed.
      let arabicQuote: string | undefined;
      if (seg.quote) {
        const qv = await getJson<any>(
          `${API}/verses/by_key/${String(seg.quote)}?language=en&fields=text_uthmani`
        );
        arabicQuote = cleanArabic(qv.verse?.text_uthmani as string | undefined);
        if (arabicQuote) console.log(`  quote ${seg.quote}: Arabic shown (not recited)`);
      }
      // Optional extra hold (seconds) so a beat lingers after the line ends —
      // used to let the title card and the closing reflection breathe.
      const hold = typeof seg.holdSeconds === "number" ? seg.holdSeconds : 0;
      segments.push({
        kind: "narration",
        audioSrc: `story/n${i}.mp3`,
        fromSeconds: Number(cursor.toFixed(2)),
        durationInSeconds: Number((duration + GAP + hold).toFixed(2)),
        words,
        source: seg.caption && /\d|hasan|Muslim|Tirmidhi|Quran/i.test(seg.caption) ? seg.caption : undefined,
        map: seg.map,
        scene: seg.scene,
        kicker: seg.kicker,
        foot: seg.foot,
        highlight: seg.highlight,
        videoSrc: seg.video, // remote Pexels URL — streamed at render (no download)
        videoDuration: typeof seg.videoDuration === "number" ? seg.videoDuration : undefined, // clip seconds → fill-the-beat slowdown
        title: seg.title, // cinematic gold-on-black title card (film open)
        titleSub: seg.titleSub,
        dim: typeof seg.dim === "number" ? seg.dim : undefined, // extra darkening for bright clips
        arabic: arabicQuote,
      });
      cursor += duration + GAP + hold;
    } else if (seg.type === "ayah") {
      const key = `${seg.surah}:${seg.ayah}`;
      const v = await getJson<any>(
        `${API}/verses/by_key/${key}?language=en&audio=${recitation}&translations=${translation}&fields=text_uthmani`
      );
      const verse = v.verse;
      const arabic = cleanArabic(verse.text_uthmani as string) as string;
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
    outroAd: story.outroAd ?? true,
    adSeconds: story.adSeconds ?? 8,
    ctaHeadline: story.ctaHeadline ?? "Join the founding list",
    ctaHandle: story.ctaHandle ?? "",
    ctaSub: story.ctaSub ?? "Early access before the shop opens.",
    ctaComment: story.ctaComment ?? "",
    ctaShowUrl: story.ctaShowUrl ?? true,
    ctaSeconds: story.ctaSeconds ?? 5.5,
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
