

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

**Branch:** `claude/video-performance-analysis-1o75wa` (all work here; never push elsewhere).

**Built and working**
- Short-form engine `src/QuranVideo/StoryVideo.tsx` (cinematic mode) + `CineMap`/`StoryMap` (animated, real-lat/lon maps) + `ParallaxAd` outro = the REAL keepsake book opening (cover `public/ad/book-mama.png` → `dedication-mama.jpg` + `photopage-mama.jpg`). Outro CTA: "Join the founding list for early access" + ketabistudio.com.
- Footage search: GitHub Actions `pexels-search.yml` — edit `scripts/pexels-queries.txt` (1 query/line; first line `--photos` for stills), commit+push, read candidates from the run log. Pexels key = repo secret `PEXELS_API_KEY`. Download thumbnails with **curl** (urllib gets 403).
- **Fire of the Hijaz** short: done (map beat 4, red-sky beat 8, lava-field beat 10). Renders via `render-story.yml`.
- Research done: TikTok-safe CTA (PLAYBOOK §8); long-form gap analysis → chose **Euphrates** as the first long-form.

**DONE & RENDERED — Long-form Euphrates documentary (the 16:9 pilot)**
The full pipeline is built, QC'd, and rendered. The clean video exists as a CI
artifact. Publishing pack (titles, description, thumbnails) is in
`docs/euphrates-longform.md`.

- **Script:** `scripts/stories/longform-euphrates.json` — **37 beats, ~1,450 words (~9:02)**, chaptered, accuracy-verified against sunnah.com + the papers: **Sahih Muslim 2894 = "mountain of gold" (jabal) + 99-of-100; Sahih al-Bukhari 7119 = "treasure of gold" (kanz) + take-nothing**; both narrated by Abu Hurayrah. NASA GRACE ~144 km3 lost 2003-2009 (Voss 2013, WRR; ~60% groundwater; 2nd-fastest on Earth). Qur'an 100:8, 102:1, 47:18 shown on screen (never recited; deliberately short verses so the Arabic fits the pull-quote card). an-Nawawi / Ibn Hajar cited. River map beat (`map:"euphrates"`). Each beat's narration is within ~1.8x its clip length so the Ken Burns slow-down never freezes (0 freeze warnings).
- **Format correction shipped:** cinematic engine reflows for landscape via `useVideoConfig()` — `StoryVideoWide` (1920x1080) in `Root.tsx`; `CineCaption`/`CineLabel`/`CineQuote` (Cinematic.tsx), `CineMap` (responsive BOX/SVG/compass/labels), and `ParallaxAd`/OpenBook (side-by-side book + CTA) all re-lay-out for 16:9. Vertical 9:16 `StoryVideo` unchanged (Shorts cut). `render-story.yml` picks the composition from an `orientation` input (default `wide`).
- **Footage QC: COMPLETE (2 rounds, 12 clips swapped).** All footage is now human-free, text-free, no haram subjects, on-topic, HTTP-206 verified. Removed: a wine glass (B01), cannabis (B05 - slug filter matched "gold nugget"), distant people/foot/shadow (B06/B11/B19/B30), a "good luck / CHINA" novelty-coin clip and "$" dollar coins (greed beats - superstition + cheap branding), an unclear hourglass (B08), and two unverifiable Arabic-manuscript clips (B07/B21 - NOT Qur'an, swapped to be safe). Christian-cross cemeteries were rejected for the "graves" beat (wrong symbolism) in favour of neutral ruins. The one hourglass kept is B22 ("they did not set a date" - a clock fits).
- **Rendered:** run #108, commit `b9b8fce`, `story-video` artifact (~9:02, 1920x1080). Link in `docs/euphrates-longform.md`. Render step is ~50-55 min.
- **Publishing pack written:** `docs/euphrates-longform.md` has title options, the full YouTube description (waitlist CTA at the end), chapter timestamps, and the 3 thumbnails (`public/promo/euphrates/`, regen with `scripts/thumbs-euphrates.py`).

**NEXT STEPS (if continuing)**
1. Publish on YouTube: pick a title + thumbnail from `docs/euphrates-longform.md`, paste the description, confirm the chapter timestamps against the actual video (they are script-estimates).
2. Optional **vertical 9:16 Shorts cut** of the same topic: dispatch `render-story.yml` with `story=scripts/stories/longform-euphrates.json`, `orientation=vertical`. (Captions auto-reflow; footage already QC'd.)
3. To re-render after any edit: dispatch `render-story.yml`, `orientation=wide`, theme blank (-> `ketabi`). "failure" badge = ONLY the optional Drive step; the artifact is still produced. Deliver the **artifact link**, not the MP4 (long video).

**Footage QC method (reuse this - it caught the wine/cannabis/coin-text issues thumbnails missed):**
- `ffmpeg -nostdin -ss <t> -i <pexels-url> -frames:v 1 out.jpg` grabs a frame straight from the remote URL (Pexels supports range requests; ~1s each). Sample 2-3 timestamps + sometimes 8 across the full clip to catch people/text that appear mid-clip.
- Build contact sheets with **PIL** (Pillow); ffmpeg `tile` chokes on mixed sizes. Download Pexels thumbnails with **curl** (urllib gets 403).
- Local `remotion still` works if you pass `--ignore-certificate-errors` and `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt` (the sandbox proxy MITMs Google Fonts; CI has open internet so it just works there).

**Rules to keep**
- **Copy style: NO emojis. NO em dashes or en dashes** (plain hyphens only). Applies to captions, titles, descriptions, on-screen text.
- Accuracy: every claim primary-source verified; hadith graded; science cited separately; never call a prophecy "fulfilled" that isn't (the gold has NOT appeared); no date-setting.
- Footage: strict no-faces / no-people / adab. No alcohol, drugs, music instruments, luck/superstition charms, other-faith symbols (crosses etc.), or legible unverifiable text. QC every clip visually (see method above), not by search slug.
- Delivery: long videos -> ARTIFACT LINK; short clips (<=~15s) -> MP4 is fine.
- Thumbnails/covers: ALWAYS use the brand `Cover` template, never ad-hoc PIL text mockups for finals. Long-form (16:9) uses the `CoverWide` composition; vertical feed covers use `CoverCard`. Render a still: `NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt npx remotion still CoverWide out.png --props=<json> --ignore-certificate-errors` (props: title with \n line breaks, kicker, image = a real https poster URL, wordmark). Title in Title Case (Playfair), no emojis/dashes.
- Keep tool outputs SMALL (curl+parse, low-res images, slice big GH-API/log files by char range) - big dumps blow the request-size limit.
