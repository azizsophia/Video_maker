# Ketabi Studio 🎬

A **code-driven video engine** for Islamic content — your own replacement for
InVideo, built so every visual is programmable, reusable, and free to render.

This repo's **first milestone** is the signature feature: **Quran recitation
videos with word-by-word highlighting synced to a real reciter's audio.** Real
Arabic text lights up in perfect time with the recitation, with translation and
a fully code-generated animated backdrop. No stock clips, no generic AI — every
frame is drawn by code.

> Phone-first: you can render videos straight from the **GitHub mobile app**
> (no laptop needed) — see [Render from your phone](#render-from-your-phone).

---

## What's inside

| Path | What it is |
|---|---|
| `src/QuranVideo/` | The Remotion composition: background, ayah view, word-by-word highlighting, themes |
| `src/data/sample-al-ikhlas.json` | A bundled sample (Surah Al-Ikhlas) so the engine runs out of the box |
| `scripts/fetch-ayahs.ts` | Pulls any surah/ayah range + real reciter audio + word timings from the free Quran.com API |
| `.github/workflows/render-quran.yml` | One-tap rendering you can trigger from your phone |
| `docs/SETUP.md` | API keys, network allowlist, Drive + ElevenLabs setup |

Built with [Remotion](https://remotion.dev) (React → MP4). Data from the free
[Quran.com API v4](https://api-docs.quran.com/).

---

## Render from your phone

1. Open the **GitHub app** → this repo → **Actions** tab.
2. Choose **"Render Quran Video"** → **Run workflow**.
3. Fill in: surah, (optional) ayah range, reciter, translation, theme, orientation.
4. When the run finishes, open it and download the MP4 from **Artifacts**.

Reciter ids: `2` AbdulBaset (Murattal) · `1` AbdulBaset (Mujawwad) · `3` Sudais · `6` Husary.
Translation ids: `20` Saheeh International · `131` The Clear Quran.

> Luhaidan & Dossary aren't on the free word-timing API yet — see
> `docs/SETUP.md` for how we can add them via forced alignment.

(Optional auto-upload to Google Drive is wired in `docs/SETUP.md`.)

---

## Run it on a computer

```bash
npm install

# Preview live in the browser (Remotion Studio)
npm run dev

# Pull a real passage + reciter audio, then render (Ayat al-Kursi by Abdul Basit)
npm run fetch -- --surah=2 --from=255 --to=255 --recitation=2 --theme=midnight
npx remotion render QuranRecitation out/ayat-al-kursi.mp4 --props=src/data/surah-2.json
```

Vertical (`QuranRecitation`, 1080×1920) is for Shorts/TikTok/Reels.
`QuranRecitationWide` (1920×1080) is for standard YouTube.

> **Heads up on network:** rendering downloads a headless Chrome from
> `remotion.media`, and `fetch` calls `api.quran.com` / `verses.quran.com`.
> In Claude Code web sessions these hosts must be added to the egress
> allowlist — see `docs/SETUP.md`. Normal machines and GitHub Actions have
> open internet, so it just works there.

---

## Arabic accuracy

Quranic text is **never hand-typed**. Every render's Arabic comes from the
KFGQPC Uthmani mushaf via the Quran.com API (the basmala too). The fetcher
**validates every verse** — Arabic-only characters, sane word/timing counts —
and cross-checks the text against a second authoritative source, aborting on
any anomaly. In tajweed mode the colour markup is stripped and the clean text
is verified to match the Uthmani text (same base letters and word count) before
any colour is applied; if a verse doesn't verify, it renders as plain, correct
text with no colouring. The bundled `sample-al-ikhlas.json` is a non-publishable
preview placeholder only.

## Tajweed mode

Letters are coloured by their authoritative tajweed rule (madd, ghunnah,
qalqalah, ikhfaa…), with a legend of the rules that appear. Turn it on with
`--mode=tajweed`; preview as the `QuranTajweed` composition.

## Hifz (memorization) mode

A format that doesn't exist as a shareable video anywhere else: each ayah
repeats while words progressively blank out, so the viewer recites the gaps
from memory (first pass full, final pass blank). Turn it on with `mode`:

```bash
npm run fetch -- --surah=112 --recitation=2 --mode=hifz --repeats=4
npx remotion render QuranRecitation out/al-ikhlas-hifz.mp4 --props=src/data/surah-112.json
```

Preview it live as the `QuranHifz` composition in `npm run dev`.

## AI-narrated Story engine (Decoded · Meet the Sahaba · Cinematic Stories)

A second, complete pipeline: **AI English narration (ElevenLabs, deep British
voice) + real auto-pulled ayahs + fully code-drawn animated scenes.** No stock
clips, no music (ambient sound effects only), and **no faces/people/animals
ever** (aniconic by rule). Copyright-free because the narration is synthesized
and no famous reciter audio is used.

### How to make one
1. Pick verified facts from `scripts/facts/surahs.json` (the sourced library).
2. Write a story script: `scripts/stories/<name>.json` (see shape below).
3. **Declare a `claims` array** — every on-screen fact + its source.
4. Preview any new graphic as a still **before** rendering (see below).
5. Trigger **Actions → "Render Story Video"** (inputs: `story`, `theme`,
   `orientation`). Output: MP4 in **Artifacts** + auto-upload to Google Drive.
6. **Review `story-facts.txt`** from the artifact (claims + sign-off) before posting.

```bash
# local: build narration+ayahs (needs ELEVENLABS_API_KEY) then render
npx tsx scripts/fetch-story.ts --story=scripts/stories/decoded-4-ar-rahman.json --theme=emerald --out=src/data/story-render.json
npx remotion render StoryVideo out/story.mp4 --props=src/data/story-render.json \
  --image-format=jpeg --jpeg-quality=100 --crf=16 --concurrency=$(nproc)
```

Render recipe (settled): **native 1080×1920, JPEG quality 100, CRF 16** — crisp
and fast. Upscaling (1.5×/4K) only slowed renders since TikTok/Shorts re-encode
to ~1080p anyway. `StoryVideo` = vertical; `StoryVideoWide` = 16:9.

### Series and their scene kits
| Series | Scene kit | Look | Closing ad |
|---|---|---|---|
| **Decoded** (per-surah breakdown) | `decoded.tsx` (generic, data-driven) + bespoke e.g. `rahman.tsx` | emerald/cosmic, calm | **app ad** (`app-showcase`) |
| **Meet the Sahaba** (companions) | `sahaba.tsx` (name/dossier/journey/poll/virtues) | sand/parchment, calm | **books ad** (`shop-waitlist`) |
| **Cinematic Story** (Quran narratives) | `sea.tsx` (parting of the sea), etc. | midnight, dramatic | **books ad** |
| History / Science / Afterlife | `birmingham/constantinople/elephant/isnad/scienceScenes/explainer/alkahf` | varies | varies |

**Standing rule:** Decoded → **app ad**; Storytelling (Sahaba + Stories) →
**books ad** (`cta.tsx`, the "Something beautiful is coming / Join the founding
list" card with real product covers from `public/shop/`).

### Real cinematic footage (Pexels)
Any beat can specify a `"stock": "<keywords>"` field. The build queries the free
**Pexels** video API, downloads a portrait clip, caches it, and `StoryVideo`
composites it as a moving backdrop (slow Ken-Burns + a legibility gradient) with
the calligraphy/captions on top. **Aniconic only** — query for nature, skies,
water, light, architecture; **never people/faces/sacred figures.** Needs a free
`PEXELS_API_KEY` repo secret (pexels.com/api). With no key, the beat falls back
to its code-drawn `scene`.

### Scene system
`src/QuranVideo/scenes.tsx` maps a `scene` name → a React component. Data-driven
scenes read `segment.data`. Names listed in `FULL_VISUAL_SCENES`
(`explainer.tsx`) draw their own text, so narration captions are suppressed over
them. Add a kit: export a `Record<string, FC>` and spread it into `SCENES`.

### Story file shape
```jsonc
{
  "id": "...", "title": "...", "look": "emerald", "gap": 0.12,
  "voiceId": "jfIS2w2yJi0grJZPyEsk", "voiceName": "Oliver Silk (ElevenLabs)",
  "sound": { "ambient": "calm ... no music, no melody", "ambientDuration": 22 },
  "segments": [
    { "type":"narration", "hook":true, "scene":"emerald", "text":"...", "caption":"..." },
    { "type":"narration", "scene":"decoded-name", "data": { ... }, "text":"..." },
    { "type":"narration", "scene":"emerald", "verseRef":"55:13", "source":"Surah Ar-Rahman · 55:13", "text":"..." },
    { "type":"narration", "scene":"...", "hadith":true, "arabic":"...", "translation":"...", "source":"Sahih ...", "text":"..." }
  ],
  "claims": [ { "claim":"...", "source":"..." } ],
  "sources": [ "..." ]
}
```

### Preview a graphic before rendering (no credits, ~1 min)
The render runner has a Playwright headless-shell. Render a single frame:
```bash
CH=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell  # or any chrome-headless-shell
npx remotion still StoryVideo out/frame.png --props=<props-with-one-scene>.json --frame=90 --browser-executable=$CH
```
Use a tiny props file with a silent stub audio (`public/story-cache/silent.mp3`,
made via `npx remotion ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 1 silent.mp3`).

## Accuracy (sensitive topic — non-negotiable)
See **`docs/ACCURACY.md`** for the full 5-layer protocol. In short:
- **Quran is never hand-typed.** Use `verseRef`; the build **fails** on hand-typed
  Arabic without it (the accuracy guard in `fetch-story.ts`). Text + official
  translation are auto-pulled from Quran.com.
- **Hadith**: flagged `"hadith": true`, verified, graded, on the fact sheet;
  authentic only (contested virtue-hadith are cut).
- **Claims manifest + sign-off**: every render emits `story-facts.txt` listing
  each claim + source and a review sign-off block. Reviewed before posting.
- **Facts library**: `scripts/facts/surahs.json` is the sourced source-of-truth.
- **Pronunciation map** (`fetch-story.ts`): sends a phonetic spelling to the
  voice (e.g. "Surah"→"soorah", "dua"→"doo-aa") but restores the correct
  spelling for captions. Add words there as you catch them.

## Conventions
- **Aniconism**: no faces, people, or animals; no Star-of-David/hexagram motifs.
- **No music**: ambient sound effects only (Islamic reasons).
- **Captions**: ≤100 characters + exactly 5 hashtags, no emojis (`*.captions.md`
  kits per video have TikTok caption + YouTube title/description + pinned comment).
- **Tone**: calm/reflective for Decoded & Sahaba; cinematic/dramatic for Stories.

## Roadmap

- [x] **M1 — Quran recitation template** (word-by-word synced, real reciters)
- [x] **Hifz memorization mode** (progressive word blanking)
- [x] **Tajweed color-coding** (letters colored by rule, with legend)
- [ ] **Word-by-word meaning layer** (transliteration + literal meaning per word)
- [ ] **3D audio-reactive scenes** (`@remotion/three`, verse-meaning environments)
- [x] **M2 — Story engine**: script → ElevenLabs British narrator + auto-pulled
      ayahs + code-drawn aniconic scenes + captions (the InVideo replacement)
- [x] **Decoded** series (per-surah breakdown, data-driven + bespoke graphics)
- [x] **Meet the Sahaba** series (aniconic dossier/journey kit)
- [x] **Cinematic Story** series (bespoke animated scenes, e.g. parting of the sea)
- [x] **Shop ad** end-card (`shop-waitlist`) + accuracy system (claims + facts library)
- [ ] **Hadith auto-pull** from sunnah.com (replace hand-typed hadith Arabic)
- [ ] **Per-surah facts library** filled for all 114 (currently seeded)
- [ ] **M3 — Phone web app**: Next.js on Vercel + Supabase; paste a script,
      pick a template, tap render, get the MP4 in your Drive
- [ ] **M4 — Auto-publish** helpers for YouTube / TikTok

See `docs/SETUP.md` to get the live pipeline running.
