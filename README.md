

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
| `src/QuranVideo/` | The Remotion compositions: Quran recitation, story, and the viral short |
| `src/QuranVideo/ShortVideo.tsx` | The **viral short** format: full-bleed stock B-roll + big karaoke captions |
| `scripts/build-short.ts` | Builds a short end-to-end: Kokoro narration + matched Pexels B-roll + real ayahs |
| `scripts/kokoro_tts.py` | Free, open-source narration (Kokoro) with word-level timings for captions |
| `scripts/shorts/*.json` | The sourced scripts (e.g. `3 Kinds of People Allah Loves`) |
| `src/data/sample-al-ikhlas.json` | A bundled sample (Surah Al-Ikhlas) so the engine runs out of the box |
| `scripts/fetch-ayahs.ts` | Pulls any surah/ayah range + real reciter audio + word timings from the free Quran.com API |
| `.github/workflows/render-*.yml` | One-tap rendering you can trigger from your phone |
| `docs/SETUP.md` | API keys, network allowlist, Kokoro + Pexels + Drive setup |

Built with [Remotion](https://remotion.dev) (React → MP4). Data from the free
[Quran.com API v4](https://api-docs.quran.com/).

---

## Viral shorts (the scroll-stopper format)

A fast-cut, feed-native format built to actually convert: a hard hook in the
first two seconds, **full-bleed stock B-roll that changes every line**, and
**big word-by-word "karaoke" captions** locked to the voice. The pilot is
**`3 Kinds of People Allah Loves`** (`scripts/shorts/three-people-allah-loves.json`).

Everything in it is **free and open-source**:

- **Voice** — [Kokoro](https://github.com/hexgrad/kokoro), an Apache-2.0 TTS
  model. No API key, no per-character cost. Default voice is `bm_george`
  (British male); swap it for American/female voices in one flag.
- **Backgrounds** — matched [Pexels](https://www.pexels.com/api/) clips (free
  key). Each line gets a portrait clip from its own search terms, and anything
  showing **people/faces/hands is filtered out** — no human depictions.
- **Sources** — every point is an explicit Qur'anic statement of Allah's love
  (*inna Allāha yuḥibb…*), and the on-screen ayah is pulled live from the
  Quran.com Uthmani text, **never hand-typed**.

```bash
# one-time
pip install -r scripts/requirements-kokoro.txt      # + espeak-ng, see docs/SETUP.md
export PEXELS_API_KEY=your_free_key                  # optional (falls back to coded bg)

npm run build:short     # Kokoro narration + Pexels B-roll + ayahs -> render props
npm run render:short     # -> out/short.mp4
```

Preview the layout live in `npm run dev` as the **`ViralShort`** composition
(the bundled `sample-short.json` runs with no audio/key so you can see it
immediately).

To make a **new topic**, copy the pilot script, rewrite the `say` lines and
`query` terms (keep them people-free), cite the sources, and run the same two
commands. See `docs/SETUP.md → 2b` for the Kokoro voices and the Pexels key.

---

## Render from your phone

1. Open the **GitHub app** → this repo → **Actions** tab.
2. Choose your workflow → **Run workflow**:
   - **"Render Viral Short"** — the new scroll-stopper format (Kokoro + Pexels).
     Pick the script, theme, and Kokoro voice. Add a free `PEXELS_API_KEY`
     secret first for stock backgrounds (see `docs/SETUP.md → 2b`).
   - **"Render Quran Video"** — word-by-word recitation. Fill in surah,
     (optional) ayah range, reciter, translation, theme, orientation.
3. When the run finishes, open it and download the MP4 from **Artifacts**
   (or have it land in your Drive — see below).

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
- [x] **Viral short template**: script → free Kokoro narration + matched Pexels
      B-roll + big karaoke captions (the scroll-stopper, no ElevenLabs needed)
- [ ] **M2 — Story / prophets template**: script → ElevenLabs British narrator +
      Pexels stock visuals + captions (the InVideo replacement)
- [ ] **M3 — Phone web app**: Next.js on Vercel + Supabase; paste a script,
      pick a template, tap render, get the MP4 in your Drive
- [ ] **M4 — Auto-publish** helpers for YouTube / TikTok

See `docs/SETUP.md` to get the live pipeline running.
