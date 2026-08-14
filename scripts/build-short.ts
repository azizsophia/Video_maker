/**
 * Build a fast-cut short's props end-to-end:
 *   1. Kokoro (free, open-source) narrates every beat  -> WAV + word timings
 *   2. Pexels supplies a matched portrait B-roll clip per beat (no people)
 *   3. Quran.com supplies real Arabic + translation for any "ayah" beat
 * ...then it lays the beats out on a timeline and writes the props JSON that
 * the `ViralShort` Remotion composition renders.
 *
 * Env:  PEXELS_API_KEY   (free from https://www.pexels.com/api/ — optional:
 *                         without it the code-generated backdrop is used)
 * Deps: python3 + scripts/requirements-kokoro.txt (for the narration step)
 *
 * Usage:
 *   npx tsx scripts/build-short.ts \
 *     --script=scripts/shorts/three-people-allah-loves.json \
 *     --out=src/data/short-render.json [--theme emerald] [--voice bm_george]
 *     [--skip-tts]   # reuse existing WAVs (fast re-layout, no model reload)
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createWriteStream, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { Readable } from "node:stream";
import { dirname, join } from "node:path";

const QURAN_API = "https://api.quran.com/api/v4";
const AUDIO_BASE = "https://verses.quran.com/";
const PEXELS_API = "https://api.pexels.com/videos/search";

type Args = Record<string, string>;
const parseArgs = (): Args => {
  const out: Args = {};
  for (const a of process.argv.slice(2)) {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    if (m) out[m[1]] = m[2] ?? "true";
  }
  return out;
};

const stripHtml = (s: string): string =>
  s.replace(/<sup[^>]*>.*?<\/sup>/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

// Words we don't want in a background clip (keeps humans out of frame).
const PEOPLE = /people|person|\bman\b|\bmen\b|woman|women|girl|\bboy\b|kid|child|children|baby|face|portrait|selfie|crowd|hand|finger|model|dancer|athlete|worker/i;

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json", ...headers } });
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

// --- Pexels: pick one matched portrait clip (no people) for a beat ----------
type PexFile = { link: string; width: number; height: number; file_type: string; quality: string };
type PexVideo = { id: number; url: string; duration: number; video_files: PexFile[] };

function pickPortraitFile(v: PexVideo): PexFile | null {
  const portrait = v.video_files.filter(
    (f) => f.file_type === "video/mp4" && f.height > f.width && f.width >= 700
  );
  if (!portrait.length) return null;
  // Prefer the smallest file that's at least 1080 wide; else the largest one.
  const atLeast1080 = portrait
    .filter((f) => f.width >= 1080)
    .sort((a, b) => a.width - b.width);
  return atLeast1080[0] ?? portrait.sort((a, b) => b.width - a.width)[0];
}

async function fetchBroll(
  queries: string[],
  key: string,
  minDuration: number,
  dest: string
): Promise<boolean> {
  for (const q of queries) {
    try {
      const data = await getJson<{ videos: PexVideo[] }>(
        `${PEXELS_API}?query=${encodeURIComponent(q)}&orientation=portrait&size=medium&per_page=8`,
        { Authorization: key }
      );
      const clean = (data.videos ?? []).filter((v) => !PEOPLE.test(v.url));
      // Prefer a clip long enough to cover the beat; fall back to any clean one.
      const ordered = [
        ...clean.filter((v) => v.duration >= minDuration),
        ...clean.filter((v) => v.duration < minDuration),
      ];
      for (const v of ordered) {
        const file = pickPortraitFile(v);
        if (file) {
          await download(file.link, dest);
          console.log(`    b-roll "${q}" -> pexels #${v.id} (${file.width}x${file.height}, ${v.duration}s)`);
          return true;
        }
      }
    } catch (e: any) {
      console.warn(`    b-roll query "${q}" failed: ${e.message}`);
    }
  }
  return false;
}

async function fetchAyah(verse: string, translation: string, reciter?: string) {
  const audioParam = reciter ? `&audio=${reciter}` : "";
  const v = await getJson<any>(
    `${QURAN_API}/verses/by_key/${verse}?language=en${audioParam}&translations=${translation}&fields=text_uthmani`
  );
  const verseObj = v.verse;
  const arabic = verseObj?.text_uthmani as string;
  const tr = stripHtml(verseObj?.translations?.[0]?.text ?? "");
  if (!arabic) throw new Error(`no Arabic returned for ${verse}`);
  let audioUrl: string | undefined;
  let audioDur: number | undefined;
  if (reciter && verseObj?.audio?.url) {
    audioUrl = resolveAudioUrl(verseObj.audio.url);
    const segs: number[][] = verseObj.audio.segments ?? [];
    audioDur = segs.length ? segs[segs.length - 1][segs[0].length - 1] / 1000 + 0.6 : undefined;
  }
  return { arabic, translation: tr, audioUrl, audioDur };
}

// Wrap known hard-to-pronounce words with misaki IPA overrides so Kokoro says
// them correctly (e.g. "Allah", "Quran") while the on-screen caption keeps the
// normal spelling. Format: [Word](/ipa/).
function applyPronounce(text: string, dict: Record<string, string>): string {
  let out = text;
  for (const [word, ipa] of Object.entries(dict)) {
    const esc = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`\\b${esc}\\b`, "g"), `[${word}](/${ipa}/)`);
  }
  return out;
}

async function main() {
  const args = parseArgs();
  const scriptFile = args.script ?? "scripts/shorts/three-people-allah-loves.json";
  const script = JSON.parse(await readFile(scriptFile, "utf8"));
  const theme = args.theme ?? script.theme ?? "emerald";
  const voice = args.voice ?? script.voice ?? "bm_george";
  const lang = args.lang ?? script.lang_code ?? "b";
  const translation = args.translation ?? script.translation ?? "20";
  const pexKey = (process.env.PEXELS_API_KEY || "").trim();
  const PAD = 0.45; // breathing room after each line
  const GAP = 0.0; // beats are contiguous (each has its own background)
  const pronounce: Record<string, string> = script.pronounce ?? {};
  const defaultReciter = String(script.reciter ?? 2); // 2 = AbdulBasit (Murattal)

  const beats: any[] = script.beats;
  const isRecite = (b: any) => b.kind === "ayah" && (b.recite || b.reciter);

  // 1) Narrate every beat that has spoken text, in one Kokoro run. -----------
  const manifest = {
    voice,
    lang_code: lang,
    speed: Number(script.speed ?? 1.0),
    index: "build/tts-index.json",
    segments: beats
      .map((b, i) => ({ b, i }))
      .filter(({ b }) => b.say)
      .map(({ b, i }) => ({
        id: `${i}-${b.kind}`,
        text: applyPronounce(b.say as string, pronounce),
        out: join("public", "short", `${i}.wav`),
        timestamps: join("build", `${i}.json`),
      })),
  };
  await mkdir("build", { recursive: true });
  await writeFile("build/tts-manifest.json", JSON.stringify(manifest, null, 2));

  if (!args["skip-tts"]) {
    console.log(`\n🎙️  Kokoro narration (voice=${voice}, lang=${lang})…`);
    const py = spawnSync("python3", ["scripts/kokoro_tts.py", "--manifest", "build/tts-manifest.json"], {
      stdio: "inherit",
    });
    if (py.status !== 0) {
      throw new Error(
        "Kokoro narration failed. Install it with:\n" +
          "  pip install -r scripts/requirements-kokoro.txt\n" +
          "  (and the espeak-ng system package)\n" +
          "or pass --skip-tts to reuse existing WAVs."
      );
    }
  }

  // 2) Lay out the timeline + attach visuals/ayahs. --------------------------
  console.log("\n🎬 Assembling beats…");
  const outBeats: any[] = [];
  let cursor = 0;
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i];
    const hasAudio = Boolean(b.say);
    let words: any[] = [];
    let narrationDur = 0;
    if (hasAudio) {
      const ts = JSON.parse(await readFile(join("build", `${i}.json`), "utf8"));
      words = ts.words ?? [];
      narrationDur = ts.duration ?? (words.length ? words[words.length - 1].end : 2);
    }
    const hold = Number(b.hold ?? 0);
    let durationInSeconds = Number((Math.max(narrationDur, 1.2) + hold + PAD).toFixed(2));

    const beat: any = {
      kind: b.kind,
      audioSrc: hasAudio ? `short/${i}.wav` : "",
      fromSeconds: Number(cursor.toFixed(2)),
      words,
      badge: b.badge,
      kicker: b.kicker,
      translit: b.translit,
      source: b.source,
    };

    // Real ayah: Arabic (+ translation) from Quran.com. Optionally a real
    // reciter (opt-in via `recite`/`reciter` — off by default for copyright).
    if (b.kind === "ayah" && b.verse) {
      try {
        const reciter = isRecite(b) ? String(b.reciter ?? defaultReciter) : undefined;
        const { arabic, translation: tr, audioUrl, audioDur } = await fetchAyah(
          b.verse,
          translation,
          reciter
        );
        beat.arabic = arabic;
        // Show the exact words the narrator speaks (keeps audio ↔ text in sync);
        // fall back to the API translation if this beat isn't narrated.
        beat.translation = b.displayText ?? b.say ?? tr;
        if (audioUrl) {
          const dest = join("public", "short", `ayah-${i}.mp3`);
          await download(audioUrl, dest);
          beat.audioSrc = `short/ayah-${i}.mp3`;
          durationInSeconds = Number(((audioDur ?? 8) + hold + PAD).toFixed(2));
        }
        console.log(
          `    ayah ${b.verse}: ${arabic.length} chars${reciter ? ` + reciter ${reciter}` : " (narrated meaning)"}`
        );
      } catch (e: any) {
        console.warn(`    ayah ${b.verse} fetch failed (${e.message}); showing caption instead`);
        beat.kind = "cta"; // graceful fallback
      }
    }

    beat.durationInSeconds = durationInSeconds;

    // Matched B-roll (uses the final duration to prefer a long-enough clip).
    // Reuse an already-downloaded clip so re-runs keep the same visuals.
    if (Array.isArray(b.query) && b.query.length) {
      const dest = join("public", "short", "broll", `${i}.mp4`);
      if (existsSync(dest)) {
        beat.videoSrc = `short/broll/${i}.mp4`;
        console.log(`    b-roll ${i}: reusing existing clip`);
      } else if (pexKey) {
        const ok = await fetchBroll(b.query, pexKey, durationInSeconds, dest);
        if (ok) beat.videoSrc = `short/broll/${i}.mp4`;
      }
    }
    if (!pexKey && Array.isArray(b.query)) {
      if (i === 0) console.warn("    (no PEXELS_API_KEY — using the code-generated backdrop)");
    }

    outBeats.push(beat);
    cursor += durationInSeconds + GAP;
  }

  const props = {
    title: script.title,
    theme,
    voiceName: script.voiceName ?? `Kokoro · ${voice}`,
    handle: script.handle ?? "@ketabi",
    websiteUrl: script.websiteUrl ?? "",
    progressBar: script.progressBar ?? true,
    beats: outBeats,
  };
  const outFile = args.out ?? "src/data/short-render.json";
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(props, null, 2));
  console.log(
    `\n✅ Short built: ${outBeats.length} beats, ~${cursor.toFixed(0)}s -> ${outFile}` +
      (pexKey ? "" : "\n   (add PEXELS_API_KEY to get matched stock backgrounds)")
  );
}

main().catch((e) => {
  console.error("\n❌ Short build failed:", e.message);
  process.exit(1);
});
