# Verified Free-License Recitation Audio (for a *monetized* channel)

> **Why this doc exists:** "free Quran audio" gets thrown around loosely. Three
> different things get conflated, and only the third one actually protects you:
>
> 1. **Free to download** (most sites) — says nothing about your right to reuse.
> 2. **Licensed for commercial reuse** (CC0 / CC-BY / explicit permission) — the
>    legal right to put it in a monetized video.
> 3. **Clear of YouTube/TikTok Content ID** — whether an automated system will
>    *claim* it anyway. Content ID is automated and does **not** read licenses,
>    so even legally-free audio can draw a claim you then have to dispute.
>
> Everything below is verified from the **primary source page**, with the URL.
> The Qur'anic **text** is public domain; a reciter's **performance** is a
> separate copyrighted work — that's the thing we're licensing here.

Last verified: **June 2026.**

---

## Ruled OUT for commercial use (verified from source)

| Source | Stated terms | Verdict |
|---|---|---|
| **EveryAyah / VerseByVerseQuran** | Audio + timings are **CC-BY-NC** (non-commercial) | ❌ Not for a monetized channel |
| **mp3quran.net** | Personal/educational only; commercial use prohibited without written permission; holds cooperation agreements with the reciters (Shuraim, Maher al-Muaiqly) | ❌ |
| **QuranicAudio.com** | "you may not use these files for commercial purposes as many of these files have rules and regulations that prevent their sale" | ❌ |
| **Famous reciters via the Quran.com API** (Sudais id 3, Abdul Basit, etc.) | Commercially registered recordings | ⚠️ Content-ID claimed; OK for long-form/≤60s Shorts only (see `docs/PUBLISHING.md`), **not** safe for monetized >60s |

Sources: [everyayah disclaimer](https://everyayah.com/data/timings_files/000_disclaimer.txt) ·
[quran_android #434 (CC-BY-NC)](https://github.com/quran/quran_android/issues/434) ·
[QuranicAudio terms](https://quranicaudio.com/) · [mp3quran.net](https://www.mp3quran.net/eng/)

---

## ✅ The recommended path (tiered, best first)

### Tier A — Record our own short ayah clips  ⭐ primary recommendation
Our strategy only quotes **short ayahs (≈3–8s)** inside stories, so we don't
need a famous full-mushaf reciter at all.

- **Copyright:** 100% ours. No claim possible. No attribution owed.
- **Content ID:** zero risk.
- **Quality control:** record clean tajweed once; reuse forever.
- **Adab:** the Qur'an is recited by a real human (never AI) — fully compliant.
- **Cost:** a phone mic + a quiet room. Optionally improve later.

This is the only option that is *guaranteed* safe on every platform at every
length. Use it as the default; the tiers below are backups / variety.

### Tier B — Wikimedia Commons, per-file CC0 / Public Domain
Legally the cleanest third-party audio.

- **Verified example:** a **CC0 1.0 (public domain)** recitation of Al-Fatiha —
  "copy, modify, distribute and perform the work, **even for commercial
  purposes**, all without asking permission," no attribution required.
  ([file page](https://commons.wikimedia.org/wiki/File:AlF%C4%81tihatulKit%C4%81b.ogg),
  [category](https://commons.wikimedia.org/wiki/Category:Qur%27an_recitation))
- **Pros:** commercial-safe, low Content-ID risk (individual non-commercial
  uploads), real human reciter.
- **Cons:** coverage is **patchy** (not a full mushaf by one voice), reciter is
  often an amateur volunteer, audio quality varies. **Verify each file's license
  box individually** — Commons also hosts CC-BY-SA and NC files in the same
  category.

### Tier C — "Copyright-Free Quran" (CFQ) custom permission
A creator-focused library that explicitly permits monetized use.

- **Terms (verified):** monetized YouTube use **allowed** if you (1) credit the
  reciter and (2) add `Collected From: https://sites.google.com/view/copyrightfreequran`
  in the description. ([source](https://sites.google.com/view/copyrightfreequran))
- **Reciters:** Omar Hisham Al Arabi, Mahmud Huzaifa, Ismail Annuri, and ~7 more.
- **Cons / cautions:**
  - It's a **custom permission, not a standard CC license**, and CFQ is an
    aggregator — it is **not** the Content-ID rights registrant. Popular voices
    (e.g. Omar Hisham) are widely reused and **can still be auto-claimed**.
    → **Always test each clip Unlisted before publishing** (per `docs/PUBLISHING.md`).
  - The site noted its development is **offline** — availability may lapse.
  - Attribution is mandatory under their terms.

### Not recommended
- **Pixabay "Quran" audio:** results are mostly **melodic / nasheed**, which
  violates our no-music rule, and the clips are rarely clean full recitation.
  Skip.

---

## Decision

**Default = Tier A (our own short clips).** It's the only path that is fully ajr-
compliant, copyright-proof, *and* free of Content-ID risk at any length — and our
format only needs short ayahs, so it's low effort. Keep **Tier B (Wikimedia CC0)**
as a verified backup for variety, and treat **Tier C (CFQ)** as a quality option
that still requires attribution + an Unlisted copyright test per clip.

For full word-by-word videos later, pair a Tier A/B source with **forced
alignment** to generate our own timings (see `docs/SETUP.md`).

---

## How to use a free-license clip in a story (pipeline)

The story builder (`scripts/fetch-story.ts`) now accepts a custom audio source on
any `ayah` segment, so we keep Quran.com's **validated Uthmani text + translation**
(text is public domain and accuracy-checked) while sourcing the **audio** from a
free-license file:

```jsonc
{
  "type": "ayah",
  "surah": 10,
  "ayah": 92,
  "source": "Surah Yunus 10:92",
  "audioUrl": "https://upload.wikimedia.org/.../File.ogg", // or a local public/ path
  "seconds": 7,            // clip length (required with custom audio)
  "audioCredit": "Reciter name — CC0, Wikimedia Commons"  // logged for our records
}
```

If `audioUrl` is omitted, the segment falls back to the Quran.com reciter (the
copyrighted default — fine for testing, **not** for monetized >60s).

**Per-clip log rule:** for every free-license clip we publish, record the
reciter, the source URL, and the exact license in the story file's `sources[]`.
That's both good adab (crediting the reciter) and our paper trail if a claim is
ever disputed.
