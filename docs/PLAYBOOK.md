# Ketabi Studio — Production Playbook

This is the master playbook for the short-form Islamic videos (TikTok / Reels /
YouTube Shorts). It captures **every rule, decision, and lesson** so nothing is
ever lost. If you only read one doc, read this one.

> Mission: videos that (1) earn ajr and please Allah, (2) make a little money,
> (3) promote the business at **ketabistudio.com** — and are **always
> Islam-respectful and 100% accurate with on-screen sources.** That last point
> is non-negotiable.

---

## 1. What works (the proven formula)

- **Two winning lanes:** (a) **Qur'an + science**, (b) **Qur'an / authentic
  hadith + a fulfilled prophecy.** The audience likes science + Qur'an.
- **Prophecy is the strongest lane.** Biggest hits: the **Euphrates gold
  prophecy (45K+)**, the **Romans / Ar-Rum prophecy**, **Al-Hijr**.
- **The hook is everything.** The first 1–2 seconds decide retention. Our slumps
  were a *retention* problem, not a shadowban (For You traffic was healthy at
  66–88%). A strong first line = the difference between 300 and 45K views.
- **Frame it as reflection, not proof.** Present as *"look how beautifully this
  aligns, reflect on it"* — **never** *"scientific proof the Qur'an is a
  miracle."* Even sympathetic academics call the "scientific miracle" (i'jaz /
  Bucailleism) genre post-hoc; that framing is exactly what critics attack.
  Reflective framing keeps us honest and dodges the debunkers.

---

## 2. The rules (all of them)

### Accuracy (non-negotiable)
- 100% accurate. **On-screen source on every claim** (verse ref, hadith
  collection + grade, or the scientific term).
- Qur'an: Arabic shown on screen, **never recited / never synthesized.** The
  voice speaks the **English only.**
- Prophecies: only **authentic** sources (sahih / hasan). Be honest about the
  fulfillment. **Avoid sectarian-sensitive ones** (e.g. 'Ammar / the
  "transgressing party" at Siffin) — they start fights in the comments.
- **Avoid the debunked "miracle" claims** critics love: embryology / *alaq*; the
  forelock = lying-brain / prefrontal cortex (96:16); "everything in pairs" =
  antimatter (51:49); *yukawwir* (39:5) presented as if classical scholars knew
  the Earth was a sphere. (See the vetted list in §6.)

### Visuals
- **Every video ≥ 1 minute** (contest or not).
- **Every beat gets its OWN distinct clip. NEVER reuse a clip within a video.**
- **No humans — no faces, no bodies, ever.** Verify every clip by downloading its
  thumbnail *and* remembering the thumbnail can hide a person who appears
  mid-clip (a frisbee guy once slipped through). Avoid foundry/worker, crowd,
  and "tap to open / person holding" clips.
- **No clip should freeze.** A clip shorter than its narration line used to
  freeze on its last frame. The engine now **slows each clip to fill its beat**
  (`videoDuration` per segment → `playbackRate`) and runs a **continuous Ken
  Burns pan + zoom** so motion never stops. Still prefer clips ≥ ~8s.
- **Captions: always legible, always in the TikTok safe zone.** Dark pill behind
  the text; keep it clear of the **top** search bar and the **bottom**
  username/buttons. (kicker ~top 300, foot ~bottom 860, caption paddingBottom
  ~600.)
- **Premium brand look:** cinematic dark green + gold (`ketabi` theme) or
  institutional ivory/green/gold (`atlas`). No "90s-era" particle scenes. No
  shapes that read as a Star of David. No guilt-tripping tone.
- The Qur'an quote beat's kicker must sit **above** the verse, never overlapping
  it (fixed — the kicker is now part of the centered column).

### Voice / audio
- AI English narration only — **ElevenLabs "Daniel"**, `voiceId
  onwK4e9ZLuTAKqWW03F9`.
- Reciters: commercial use is **prohibited** for nearly all famous reciters. Only
  use your own recording or a verified CC0 source. Never put a copyrighted
  recitation on a monetized video. (See `docs/RECITERS.md`.)

### Captions & hashtags (the post itself)
- **TikTok: max 5 hashtags.** Use `#history` for the history contest; otherwise
  `#quran #islam #science` etc.
- **YouTube title: under 100 characters.**
- **No em dashes** (house style).
- Lead with the **hook** in the first line.

### Posting cadence
- **One strong post a day.** Don't drop a second video while the first is still
  climbing — it splits distribution and cools the winner.
- **Time-sensitive content on its day** (e.g. Ashura that morning).
- **Vary the visuals** day to day (don't run three ocean videos in a row).
- Mix the proven prophecy lane with the science lane.

---

## 3. How a video is built (the script format)

Stories live in `scripts/stories/*.json`. Example shape:

```jsonc
{
  "id": "science-iron-from-stars",
  "title": "…",               // long title (used for YouTube etc.)
  "theme": "ketabi",          // dark green/gold cinematic
  "cinematic": true,           // full-bleed Pexels footage mode
  "voiceId": "onwK4e9ZLuTAKqWW03F9",
  "voiceName": "Daniel (ElevenLabs)",
  "segments": [
    {
      "type": "narration",
      "video": "https://videos.pexels.com/video-files/…/….mp4", // DISTINCT per beat
      "videoDuration": 10,      // clip length in seconds → fills the beat, no freeze
      "foot": "Qur'an · Surah Al-Hadid 57:25", // on-screen source (optional)
      "kicker": "AS THE QUR'AN SAYS",            // small gold eyebrow (optional)
      "text": "The English Daniel speaks."
    },
    {
      "type": "narration",
      "quote": "57:25",         // pulls Arabic+English from Quran.com, SHOWN not recited
      "kicker": "AS THE QUR'AN SAYS",
      "video": "…",
      "text": "And We sent down iron, in which is great strength…"
    }
  ],
  "sources": [ "full citation 1", "full citation 2 — incl. accuracy notes" ]
}
```

- Aim for ~10–12 narration beats ≈ 60–75s.
- The **founding-list outro card** is auto-appended (`showOutro` defaults true):
  "Join the founding list" + ketabistudio.com. A story can opt out with
  `"showOutro": false`.
- Build/validate locally is hard (needs the ElevenLabs key) — render via Actions
  (§5). Always **verify every clip URL returns 206/200** before triggering.

### Pexels footage
- Free, commercial-OK, **no attribution required.** Streamed at render via
  `OffthreadVideo` (no key needed in CI).
- The **Pexels API key is only for searching** and lives as the GitHub secret
  `PEXELS_API_KEY` (never in the repo). To find clips/photos: edit
  `scripts/pexels-queries.txt` (one query per line; a first line `--photos`
  switches to still-photo mode for covers), commit, and push — the **Pexels
  Search** workflow logs candidate `{id, link, image}` for each. Then verify each
  pick is human-free (open the `image` thumbnail) and that the clip URL returns
  HTTP 206 before using it. **Still rotate the key** — it was shared in plaintext
  once.
- **One distinct NEW clip per beat — never reuse a clip across the library.** The
  Fire of the Hijaz cut was sourced this way (11 clips, all thumbnail-checked).

---

## 4. Cover images (the feed look)

The TikTok grid is the storefront. One consistent cover style = a feed that
reads as one premium brand. (We replaced the old cyan/red-box covers.)

- Generator: `src/QuranVideo/Cover.tsx` + `scripts/render-covers.mjs`. Renders
  **locally** (no Actions, no keys) with the system Chromium.
- Every cover: **"KETABI STUDIO" wordmark** on top, a **gold kicker**, a short
  **Playfair serif title** (cream/gold), a gold flourish, the green/gold grade,
  a thin inset gold frame, over a **full-bleed, human-free photo**.
- **Title sits in the vertical center band** — TikTok's profile grid crops ~270px
  off the top and bottom, so a bottom title gets clipped. Keep titles **3–4
  words.**
- To add one: append an entry to the `COVERS` array in `render-covers.mjs`
  (`out`, `kicker`, short `title` with `\n`, `image` via `img(<pexels photo id>)`),
  then run `node scripts/render-covers.mjs`. Verify the photo is human-free first.

---

## 5. Rendering & publishing

- **Videos** render via GitHub Actions `render-story.yml` (workflow_dispatch;
  inputs: story path + theme). It has the `ELEVENLABS_API_KEY` secret.
- **Actions needs the repo PUBLIC** for free minutes. Private + out of minutes =
  the job **fails in ~2 seconds with no logs.** Workflow: flip **public**, render
  the batch, then flip **private** again. Covers and the ad render **locally**, so
  they never need this.
- Download the result from the run page → Artifacts → **`story-video`.** A
  **"failure"** label is usually just the Google-Drive upload step — the video
  artifact uploads *before* that, so it's still there.
- **The voiced waitlist ad** renders via `render-ad.yml` (registered on `main`).
  Trigger it against the feature branch; artifact = `ketabi-waitlist-ad`.

---

## 6. Future video ideas (vetted & ranked)

Both lists were produced by deep research with adversarial fact-checking. Verdicts:
**SOLID** (post freely), **DEFENSIBLE** (frame carefully), **AVOID**.

### Science (lesser-known Qur'an + science)
**Build next:**
- **Deep-sea darkness, "waves above waves" (24:40)** — DEFENSIBLE, strongest hook.
  Below ~200m is pitch black; *internal waves* roll between density layers. You
  own great ocean footage. Frame: "matches what we now see," not "they meant
  oceanography."
- **Honey as a healing substance (16:69)** — SOLID, totally safe tone.
  Broad-spectrum antibacterial; used on wounds in hospitals.
- **Plants created in pairs, male & female (36:36, 13:3)** — DEFENSIBLE. Botanical
  sex understood only from the 1600s; lean on "and of what they do not know."

**Tier 2 (careful framing):** milk from "between blood & digested food" (16:66);
night *wrapped/coiled* — *yukawwir* (39:5); universe from "smoke" (41:11).

**AVOID:** forelock = lying / prefrontal cortex (96:16, research killed it);
"everything in pairs" = antimatter (51:49); pain receptors in skin (4:56 — a Hell
verse, off-brand tone).

### Prophecy (lesser-known, fulfilled)
**Build next:**
- **Fire of the Hijaz → the 1256 CE volcano (Bukhari/Muslim)** — SOLID, huge hook.
  ✅ BUILT: `scripts/stories/prophecy-fire-of-hijaz.json` (cinematic, ~70s, 11
  distinct human-free clips) + cover `13-fire-hijaz`. A predicted fire from the
  Hijaz; the Harrat Rahat eruption near Medina in 1256, documented, its glow seen
  far north. Closest thing to the Euphrates format. Render via `render-story.yml`.
- **Barefoot shepherds competing to build tall towers (Sahih Muslim)** —
  DEFENSIBLE. The destitute Bedouin land now holds the tallest tower on Earth.
  Use aerial cityscapes with **no people.**
- **Arabia turns green again (Sahih Muslim) + paleoclimate** — DEFENSIBLE, the
  science+prophecy crossover. Science shows Arabia *was* green; the hadith points
  to a future return. Never say "fulfilled" (it's future) — say the science proves
  it *was* green.

**Tier 2:** Umm Haram & the Cyprus sea expedition (Bukhari, touching); Al-Hasan
reconciling two factions (Bukhari).

**AVOID:** 'Ammar killed by the "transgressing party" (authentic but sectarian).

### Already posted / covered — do NOT repeat
Euphrates gold, Romans (Ar-Rum), Constantinople, Two Seas, Splitting of the Sea,
Iron from the stars, Al-Hijr / Hegra, the Only Woman named in the Qur'an (Maryam),
Prophet Ibrahim, Abu Bakr as-Siddiq, Ayat al-Kursi, Surah Al-Kahf, Year of the
Elephant, the Sun racing through space, the Dead Sea / Romans prophecy.

---

## 7. The waitlist ad

- **Run the hard product ad as a TikTok Spark Ad, not as an organic post.** The
  ParallaxAd is an explicit product pitch; TikTok's organic ranking suppresses
  pitches like this (and your audience scrolls past them). Promote it through the
  TikTok Ads Manager (Spark Ads boost a real post) so it reaches a *targeted*
  audience instead of dragging down your educational reach. Keep the organic feed
  for the story videos; let their soft end card (§9) do the funnelling.
- `src/QuranVideo/ParallaxAd.tsx` — a 3D parallax ad, rendered **locally**.
  Current version: the two personalized **keepsake books**, one **opening on its
  spine** to reveal an inner photo page; headline **"Your photos, a keepsake
  forever"** + **"hardcover books made from your own photos"**; gold **"Join the
  waitlist"** button + ketabistudio.com. 8 seconds. Silent posts fine (feeds
  autoplay muted).
- Short CTA voiceover (optional, via `render-ad.yml`):
  *"Your photos, in a hardcover keepsake to treasure forever. Join the waitlist
  at ketabi studio dot com."*
- Brand kit (from the ad asset pack): Forest `#2E4A3A`, Forest-deep `#233A2D`,
  Cream `#F6F4EF`, Gold `#C9A84C`, Gold-deep `#A87426`, Sand `#EEE2CD`, Ink
  `#282622`. Display: Fraunces / Playfair. Body: Plus Jakarta Sans / Jost.
  Editorial: Cormorant. Arabic: Amiri. Voice: warm, calm, lowercase, never shouty.
- Products: digital animated card **$3.99** ( **$6.99** with a voice note);
  hardcover keepsake books printed to order.

---

## 8. Conversion funnel — waitlist signups WITHOUT the shadowban

The problem: nobody signs up, and TikTok throttles anything that looks like an
ad. TikTok's ranking demotes (a) content that pushes viewers **off-platform**
(a visible URL, "link in bio, go now") and (b) anything that **reads as an ad**
(product screenshot + a "buy/join" button). The old end card was both. So the
fix is to make the ask an **on-platform action the algorithm rewards**, and move
the actual link to where it doesn't cost reach.

**The end card (now built into every story; `src/QuranVideo/StoryVideo.tsx`).**
Story-JSON fields drive it, no code edits needed:
- `ctaHeadline` — the primary ask. Lead with **follow**, not "join": e.g.
  *"Follow for more signs like this"*. Following is on-platform = algorithm-safe.
- `ctaHandle` — your @handle (shown big, in gold).
- `ctaSub` — one soft brand line (e.g. *"Sourced Islamic stories, every day."*).
- `ctaComment` — OPTIONAL and **off by default** (leave it out). It puts a
  *Comment "WORD" and I'll send it* line on the card. It works mechanically
  (comments boost reach, the reply carries the link) but reads corny on a calm
  spiritual video, so we don't use it on-card. Drive the same behaviour from the
  caption/pinned comment instead (below). Only set it if you ever want the
  on-card prompt back.
- `ctaShowUrl` — keep **false** for organic. Only flip it on for content you're
  promoting as a paid Spark Ad, where off-platform links are expected.

**Where the link actually lives (off the video):**
1. **Bio link** — `ketabistudio.com` waitlist, always.
2. **Pinned comment** — first thing you post on every video: a warm one-liner +
   "the link's in my bio 🤍". Pinning it keeps it at the top.
3. **DM / comment reply** — when someone comments the keyword, reply with the
   link. This is the highest-intent path and TikTok loves the engagement.

**Give people a REASON to sign up.** "Join the waitlist" is weak. Offer a real,
deliverable lead magnet — e.g. *early access + a small founding-member discount*,
or a free printable (a dua card / a "family keepsake" template). Put the offer in
the caption and the DM reply. Decide the offer, then keep it consistent.

**Caption template (lead with the hook, ≤5 hashtags, no em dashes):**
> The Prophet ﷺ named a fire that would light up Arabia. 600 years later, in
> 1256, the ground tore open outside Medina. Full sources in the video. Follow
> for more, the founding-list link is in my bio. #islam #prophecy #quran
> #history #fyp

**Pinned comment template:**
> Sources are in the video. If you want the keepsake we're building for families,
> the founding-list link is in my bio 🤍

> Rule of thumb: **the video earns the reach, the comment/bio earns the signup.**
> Never make the video itself the billboard.

---

## 9. Security / housekeeping

- **Rotate the Pexels API key** (it was pasted in chat once). It now lives only as
  the `PEXELS_API_KEY` GitHub secret — never commit it.
- Keep the repo **private** when you're not rendering (public exposes the docs).
  Quick API-search jobs (Pexels Search) are seconds and fine on free minutes;
  only the long video renders need the public-minutes dance.
- Active development branch: `claude/video-performance-analysis-1o75wa`.
