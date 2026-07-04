

> 📌 **START HERE → [docs/PLAYBOOK.md](docs/PLAYBOOK.md)** — the full production
> playbook: every rule (visuals, accuracy, captions, posting), the story-script
> format, the cover-image process, the rendering workflow, the vetted list of
> future video ideas, and the waitlist ad. Read it first so nothing is lost.

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

## Roadmap

- [x] **M1 — Quran recitation template** (word-by-word synced, real reciters)
- [x] **Hifz memorization mode** (progressive word blanking)
- [x] **Tajweed color-coding** (letters colored by rule, with legend)
- [ ] **Word-by-word meaning layer** (transliteration + literal meaning per word)
- [ ] **3D audio-reactive scenes** (`@remotion/three`, verse-meaning environments)
- [ ] **M2 — Story / prophets template**: script → ElevenLabs British narrator +
      Pexels stock visuals + captions (the InVideo replacement)
- [ ] **M3 — Phone web app**: Next.js on Vercel + Supabase; paste a script,
      pick a template, tap render, get the MP4 in your Drive
- [ ] **M4 — Auto-publish** helpers for YouTube / TikTok

See `docs/SETUP.md` to get the live pipeline running.

---

## Session handoff — where we left off (read this first)

**Last updated: 2026-07-04.** Also read `CLAUDE.md` (the non-negotiable owner
rules + pre-ship QC gate) and `docs/content-calendar.md` (schedule, posted list,
app footer) before continuing the channel.

**Branch:** `claude/fingerprints-ridge-visuals-6qbs6x` (all work here; never push
elsewhere without explicit owner permission). GitHub is scoped to
`azizsophia/video_maker` only.

### Current state (Ketabi Studio — Islamic shorts channel)

Production has shifted to **large batches of short-form** (TikTok/Reels/Shorts) as
the growth engine; long-form is occasional, made only when asked (CLAUDE.md).
Every short copies the **Khadijah cadence** template (`scripts/stories/khadijah.json`):
hook beat -> gold-on-black title card (deep serious read) -> sourced narrative
beats (~10-15s, one literal clip each) -> reflective sourced button.

**Batch 3 (15 shorts) — shipped, then re-worked.** After the owner reviewed them
1x1 she caught footage misses (a tourist-on-camel, a modern car) and bad Arabic
pronunciation. Actions taken:
- **Scrapped** (owner call, files git-rm'd): `lizards-hole`, `unwanted-charity`,
  `constantinople`.
- **Dense footage re-QC** of the rest (see `docs/batch3-footage-reqc.md`); ~37
  clips re-sourced.
- **6 shorts re-rendered 2026-07-04** with tightened footage + read-aloud/cadence
  fixes + phonetic fixes: `jerusalem-test`, `shepherds-towers`, `forelock`,
  `verse-of-honey`, `expander`, `mosque-boast`. All passed still-QC. Artifact
  links (expire 2026-07-18; re-render is cheap — narration is cached):
  - jerusalem-test: run 28718399458 / artifact 8085173174
  - shepherds-towers: run 28718400300 / artifact 8085170686
  - forelock: run 28718400902 / artifact 8085183776
  - verse-of-honey: run 28718528758 / artifact 8085208057
  - expander: run 28718529370 / artifact 8085195505
  - mosque-boast: run 28719309711 / artifact 8085400898  (beat 2 tourist clip ->
    clean stone arcade Pexels 34999752; beat 1 had a legible "BAZAAR" shop sign ->
    clean grand-dome Pexels 30682382)
- **moon-split** re-rendered (repetition fix). Mina pronunciation locked to
  **"Mee-nah"** (owner delegated the call; plain "Meena" risked the English
  girl-name ending, strict "mih-NAA" she found distracting — "Mee-nah" is the
  clear community reading). Final re-render dispatched 2026-07-04.

**Phonetic audit (2026-07-04).** An independent research pass checked 23 spoken
names against authoritative MSA sources (Wikipedia IPA, quran.com, sunnah.com,
Forvo). Only one change needed and applied: **Ibn Kathir -> "Ka-theer"** (in
`expander`). Everything else as-fed was correct, including the deliberate qaf->k
convention. **New QC rule added to CLAUDE.md:** every spoken name must be
researched against authoritative sources BEFORE it clears; the owner's ear-test
is the final check, NOT the verification ("sounds fine" is not proof).

**Still scheduled from batch 3, NOT yet footage-re-QC'd** (do before their post
dates): `greeting-grown-cold`, `time-speeds-up`, `night-and-day`, `yasbahun`
(07-11 .. 07-16). `mosque-boast` is done.

**Long-form available to post:** `scripts/stories/longform-ad-duha.json` (Surah
ad-Duha, 11 beats, 16:9) — re-sourced footage + cover, rendered. Yusuf long-form
already posted.

**App promo (standalone marketing video):** `AppPromo` composition
(`src/QuranVideo/AppPromo.tsx`, 9:16) built from 6 marketing slides
(`public/promo/*.png`) with a Daniel voiceover assembled locally
(`scripts/fetch-promo.ts`, `scripts/assemble-promo.mjs`, `render-promo.yml`).
Delivered as an mp4 file. NOTE: `render-promo.yml` is only on this branch, so it
is NOT dispatchable from the API until merged to the default branch.

### The pipeline (how to make a short)

1. **Footage search** — edit `scripts/pexels-queries.txt` (1 query/line; first
   non-comment line may be `--portrait` for 9:16 video or `--photos` for stills),
   commit+push -> triggers `pexels-search.yml`; read candidates from the run log
   (JSON lines `{q,id,dur,w,h,link,image}`). Pexels key = repo secret
   `PEXELS_API_KEY`.
2. **Footage eye-QC (MANDATORY, multi-frame)** — grab >=6 frames spread across
   each clip (~8/25/42/58/75/92%) and VIEW them; a single mid-clip frame misses
   things (that is exactly how the tourist-camel and the BAZAAR sign slipped
   through). Reject any clip that in ANY frame shows: on-screen text/signage/
   watermark/logo/plate (scrutinize distant backgrounds), a person as subject,
   tourists, modern objects out of period, other-faith symbols, alcohol,
   instruments, CGI, or brightness too high for the dark grade. One distinct clip
   per beat; unique repo-wide (grep `scripts/stories/*.json` for the id).
3. **Wire the JSON** (`scripts/stories/<id>.json`), build a contact sheet, get
   owner sign-off, then render.
4. **Render** — dispatch `render-story.yml` with `story=scripts/stories/<id>.json`,
   `orientation=vertical` (9:16 short) or `wide` (16:9 long-form), `scale=1`
   (1080p daily cadence; identical on phones, half the minutes). The "failure"
   badge is ONLY the optional Drive-upload step; the `story-video` artifact
   (`out/story.mp4` + `out/cover.png` + `out/captions.txt`) is still produced.
5. **Still-QC the render** — pull the artifact, grab 6 frames, confirm: title card
   readable, every ayah shows its citation, no glyph-box tofu on Arabic, captions
   readable + no ALL-CAPS shouting, ad outro clean.

### Tooling notes (this remote environment)

- **No system ffmpeg/ffprobe.** Use the bundled one:
  `/home/user/Video_maker/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg`
  (decodes h264, grabs frames: `ffmpeg -ss <sec> -i <file> -frames:v 1 out.png`;
  no volumedetect). Durations/tracks via `@remotion/media-parser`.
- **GH Actions MCP list calls are huge** — they error but save to a file; parse
  that file with python (slice by char range) instead of reading it raw.
- **Pull an artifact:** `actions_get download_workflow_run_artifact` returns a
  short-lived signed URL; `curl` it immediately, `unzip` (each zip has an `out/`
  folder — extract to a per-video dir so they don't overwrite each other).
- **Voice test:** dispatch `tts-test.yml` (inputs text/stability/style/seed);
  the mp3 comes back base64 in the log AND as the `tts-names-test` artifact.
- **Offload image-heavy QC to subagents** (they return a text verdict so the
  frames stay out of the main context). Keep each subagent to <=5 beats / a
  montage strip — ~90 images / 32MB overflows a subagent ("Request too large").

### Voice / narration facts

- Daniel `onwK4e9ZLuTAKqWW03F9`, `eleven_multilingual_v2`, seed **71421**,
  default `{stability:0.32, style:0.55, similarity_boost:0.8}`; title-card override
  `{0.72, 0.1, 0.85}` (deep serious read). Keys = repo secrets
  `ELEVENLABS_API_KEY` (5-concurrent request limit).
- **Narration is cached** in `public/story-cache` (key = sha1 of text+voice+model+
  settings+seed), persisted by the cache step in `render-story.yml`. A re-render
  bills ~zero ElevenLabs characters for unchanged lines; only new/edited text is
  regenerated — so changing one name's respelling re-voices only the affected
  lines.
- **PHONETIC map** in `scripts/fetch-story.ts` maps token -> TTS respelling while
  on-screen text keeps proper spelling. The qaf (ق) is deliberately respelled "k"
  (Daniel cannot voice a uvular qaf). Every new name is added here and cleared by
  research + a names-only ear-test before the batch renders.

### Rules to keep (see CLAUDE.md for the full list)

- **Copy: NO emojis, NO em/en dashes** (plain hyphens only). NO ALL-CAPS emphasis
  words in narration (the word-by-word caption renders them as shouting); only
  genuine acronyms stay capitalized.
- Accuracy is BLOCKING: pre-writing source table + independent adversarial
  claim-by-claim fact-check; every claim shown on screen with its source; no
  Israiliyyat / weak narrations / date-setting; report committed to `docs/`.
- Footage: strict no-faces (distant silhouettes/backs/hands/crowds ok) / adab; the
  multi-frame eye-QC + owner contact-sheet sign-off gate above.
- Delivery: `docs/PLAYBOOK.md` / CLAUDE.md say deliver the **artifact link**, not
  the mp4, for the daily cadence. (For an owner review cycle, large mp4 files
  sometimes fail to open on mobile — provide the artifact link as the reliable
  path.)
- Covers use the brand `Cover` templates: `CoverCard` (9:16 shorts) / `CoverWide`
  (16:9 long-form). Never ad-hoc PIL text mockups for finals.
- Do NOT put the model id in commits/PRs/code/artifacts — chat replies only.
