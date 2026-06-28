# Ketabi Studio 🎬

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
