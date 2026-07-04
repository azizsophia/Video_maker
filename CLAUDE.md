# Ketabi Studio — standing rules for every video (non-negotiable)

These are owner instructions. Apply them to ALL videos, every time, without being
asked. This file is the durable memory for this repo.

## PRE-SHIP QC CHECKLIST (owner directive 2026-07-03: every batch, no exceptions)
Run this whole gate on EVERY batch before contact sheets go to the owner and
again before final delivery. Do not rely on the owner to catch these - she has;
that is the point of the gate. Nothing ships with an open item.
1. ACCURACY (blocking): pre-writing source table + independent adversarial
   claim-by-claim fact-check by a separate pass; every flag fixed or cut;
   report committed to docs/. (See Accuracy & adab.)
2. READ IT ALOUD: an independent readability pass on every script - flowing
   cadence, no chained-ellipsis stop-start, grammatical when spoken, no
   point-of-view jumps, no interrupting nested asides, newcomer-clear. Fix every
   stumble. (The Challenge short was pulled for failing this.)
3. NO ALL-CAPS emphasis words in narration (they read as shouting in the
   caption); only genuine acronyms stay capitalized.
4. PRONUNCIATION: every spoken name/term is MSA-looked-up and in the PHONETIC
   map, cross-checked by an INDEPENDENT pronunciation audit against authoritative
   sources (report to docs/), then cleared by a names-only ear-test. No name on
   Daniel's default English reading.
5. SPOKEN ARABIC is opt-in: default is SHOW the Arabic on screen (title card or
   ayah) and SPEAK the English; only voice a transliterated term once ear-tested.
6. FOOTAGE eye-QC (MULTI-FRAME, non-negotiable): every clip viewed by grabbing
   AT LEAST 6 frames spread across the whole clip (approx 8/25/42/58/75/92%),
   NEVER a single mid-clip frame - a car, tourist, face, logo or watermark can
   appear only briefly and a one-frame check misses it (this exact failure
   shipped a tourist-on-camel and a modern car in batch 3). Reject any clip that
   in ANY frame shows: on-screen text/watermarks/brand logos (e.g. "DAMAC",
   license plates), a person as the subject (distant silhouettes/backs/hands/
   anonymous crowds are fine), tourists or tourism cues, modern objects out of
   period (cars, roads, power/utility lines, solar panels, satellite dishes,
   plastic), other-faith symbols (cross/church/temple/idol), alcohol (incl.
   honey/amber liquid that reads as a glass of wine/whisky) or instruments, a
   CGI look, or brightness too high for the dark cinematic grade. Also literal
   to the line, ONE distinct clip per beat, unique repo-wide. Then the render is
   GATED on owner sign-off of a per-short CONTACT SHEET - do NOT batch-render
   without it (skipping this gate is what let batch 3 go out unvetted).
7. RENDER-OUTPUT QC on stills: title cards readable (deep-read voice), every
   ayah shows its citation on-screen, captions carry the launch CTA + hashtags,
   the ad outro plays clean at the tail, no glyph-box tofu on Arabic.
8. Deliver with day-labeled covers + captions + contact sheets + artifact links.

## The quality bar
- ONLY show the owner work once it is a genuine PREMIUM, LUXURY, cinematic
  experience. No half-baked or first-pass drafts. Self-QC to that bar first.
- For any non-trivial video, gate the expensive render behind sign-off: send the
  rewritten script and a footage CONTACT SHEET (a visual grid of the actual,
  vetted clip chosen for every beat) and only render after approval.
- TIMING IS PART OF THE BAR. Each beat's visual must land WITH the words it
  illustrates, never seconds ahead of them. Front-load every beat so it opens on
  the image that matches its clip; keep beats tight (~10-15s) so one clip never
  drifts out of sync with the narration. Before shipping, watch the cut in your
  head beat by beat (image vs line vs caption vs music) and if ANYTHING feels off
  (sync, pacing, a too-bright clip, a glyph box on an ayah, an abrupt cut), FIX
  IT before delivering. Do not ship something you sense is off and wait to be
  told. These videos must be professional and premium, every time.

## Visuals — the #1 rule: they must MATCH the scene, literally
- Every beat's footage must literally depict what is being said (a well shows a
  well, a wolf shows a wolf, a goblet shows a goblet). Never generic "wallpaper".
- ONE distinct clip per beat. NEVER reuse a clip within a video or across videos
  (retire clips already used elsewhere, e.g. the Euphrates clips).
- QC EVERY clip by eye (frame-grab / thumbnail) before use. Reject anything with:
  on-screen text or watermarks; a depicted face of a prophet as the subject
  (silhouettes, hands, crowds, backs are fine); other-faith symbols (crosses,
  crucifixes, churches, idols, Diwali/puja lamps, temples of other religions);
  alcohol or musical instruments as the subject; anything immodest or haram.
- Code-generated visuals are a fallback, not the default (the owner finds the
  generated "dunes" etc. weak). The premium animated MAP is the accepted
  exception. A cinematic gold-on-black title card is encouraged for long-form.
- Always source via the Pexels search workflow, build the contact sheet, and keep
  a per-beat shot list.

## Writing rules learned the hard way (owner feedback 2026-07-02, non-negotiable)
- LONG-FORM MEANS LONG. Minimum ~8 minutes of narration: roughly 1,300+ words
  across 25+ beats in chapters. Before ANY long-form render, compute the
  estimated runtime (narration words / 140 wpm) and expand the script if it is
  under 8 minutes. The 3-4 minute "long-forms" of the first week batch were
  rejected for this; never repeat.
- WRITE FOR SOMEONE NEW TO ISLAM. Every video must be self-contained: open with
  who/where/when context BEFORE events; introduce every person the first time
  they appear (who they are, why they matter); translate or define every Arabic
  term on first use (istighfar, wahy, seerah...); connect beats causally (so,
  because, meanwhile) instead of jumping event to event. The Khadijah script's
  "but to understand why... you have to go back" bridge is the model. The owner
  pulled Sumayya, Yunus, and Sayyid al-Istighfar from the schedule for lacking
  this; a script that assumes prior knowledge fails review.

## Story cadence — the STANDARD cut (copy the Khadijah template every time)
- Use `scripts/stories/khadijah.json` as the structural template for all
  short-form stories. Same rhythm, same feel:
  1. Open on a HOOK beat (one striking, sourced line that opens a loop).
  2. Beat ~2 is a CINEMATIC GOLD-ON-BLACK TITLE CARD: the name drops in gold
     (`title`), captions are suppressed, an honorific rides underneath
     (`titleSub`, e.g. "may Allah be pleased with her") over a slow dark clip.
  3. Then the sourced narrative beats, each ~10-15s, front-loaded, one distinct
     literal clip per beat, every claim with its `foot` source, ayat shown via
     `quote` (never recited).
  4. Close on a reflective, sourced button (no corny "share this" CTA).
- Cinematic mode ON (`"cinematic": true`, theme `ketabi`). Vertical 9:16 for
  shorts (render StoryVideo), 16:9 for long-form (StoryVideoWide).
- The TITLE CARD line is read DEEP and SERIOUS, then the voice returns to the
  regular warm, emotional, paced tone. Achieve this with a per-segment
  `voiceSettings` override on the title beat (steadier + less exaggerated, e.g.
  `{ "stability": 0.72, "style": 0.1, "similarity_boost": 0.85 }`); every other
  beat keeps the emotional default.

## Accuracy & adab
- Authentic sources only. Every claim shown ON SCREEN with its source (Qur'an by
  verse; hadith by collection, e.g. Sahih al-Bukhari / Sahih Muslim; seerah noted
  as seerah). NO Israiliyyat, NO weak narrations, no embellishment.
- VERIFY BEFORE WRITING: every citation in a batch is checked against sunnah.com
  / quran.com (exact number, wording, grading) BEFORE scripts are written, and
  the finished scripts get an independent claim-by-claim fact-check pass before
  the owner sees them. Wrong-numbered or weak narrations are corrected or cut,
  never shipped.
- ACCURACY QC GATE (owner directive 2026-07-03, BLOCKING): no script advances to
  voicing or render until it has passed ALL of: (1) the pre-writing source table
  (exact number, wording, grading verified against primary sources); (2) an
  INDEPENDENT adversarial claim-by-claim fact-check of the finished script by a
  separate reviewer pass that did not write it, covering every date, name,
  number, attribution, and paraphrase against the cited source; (3) every
  flagged item fixed or the claim cut, with the fix re-checked. A script with
  even one unresolved flag does NOT render. The verification report for each
  batch is committed to docs/ so the trail is auditable.
- The Qur'an is shown (Arabic from Quran.com), never recited by AI or synthesized.
- TONE OF PRECISION (owner rule 2026-07-02): corrections and careful attributions
  are delivered matter-of-factly, never self-referentially. The narration NEVER
  says "honesty beat", "we checked", "this channel", "ours included", or praises
  its own rigor. Show the precision; do not announce it. Professional, premium,
  never cocky.
- Honorifics: prophets get "alayhi salam"; the Prophet Muhammad gets "peace be
  upon him". No depiction of the prophets.

## Voice & copy
- Narration must be natural, warm, emotional, and paced (write pauses with commas,
  full stops, ellipses; ElevenLabs settings tuned for emotion). Send a short voice
  test before a full render when the voice or tone changed.
- PRONOUNCE EVERY NAME IN MSA (owner rule 2026-07-03, non-negotiable): before
  ANY render, every proper name and Arabic term spoken in the script is looked
  up for its Modern Standard Arabic pronunciation and given an MSA-correct
  respelling in the `PHONETIC` map. A name is NEVER left to Daniel's default
  English reading - that is exactly what mangles a name (Ali becomes "AL-eye",
  Anas becomes "AY-nas", Abu becomes "uh-BOO", a qaf becomes a hard "kw") and
  makes a viewer swipe away in the first seconds. This applies to recurring
  companion/place names too (Abu Bakr, Umar, Uthman, Ali, Abdullah ibn Mas'ud,
  Anas ibn Malik, Quraysh, Ka'bah, Madinah...), not just the exotic ones. The
  qaf ( q) is respelled "k" for the English TTS (Quraysh -> "Koo-raysh",
  Qustantiniyyah -> "Kus-tan-tee-nee-yah") since Daniel cannot voice a uvular
  qaf; that is the deliberate, consistent choice across the whole map. Every
  new batch's names are added to the map and cleared by a names-only ear-test
  BEFORE the batch renders.
- Arabic pronunciation must be correct: voice from a phonetic script (the
  `PHONETIC` map in `scripts/fetch-story.ts`) while the on-screen text keeps
  proper spelling. Send a names-only voice test to confirm. Locked so far:
  Khadijah -> "Kadeeja", Aisha -> "Aisha", Waraqah -> "Warahkah", Jibril ->
  "Jibreel", Musa -> "Moosa", Read (the command Iqra) -> "reed" (never "red"),
  plus the full week-batch set in the PHONETIC map (Dajjal, Ayyub, Salman
  al-Farisi, Suraqah, Yunus, Sulayman, Hajar, Ismail, Ammar, Yasir, Isa, Nuh,
  Sham, ad-Duha, al-Kawthar, Qasim, Quba, Nasibin, Ammuriyyah, Thawr, wahy,
  istighfar) - all ear-tested and approved 2026-07-01. Spoken transliterated
  Arabic (e.g. the dua of Yunus) is approved BUT must never sit flush at the
  end of a segment: keep a trailing ellipsis after it so the tail never clips.
- The voice is SEED-LOCKED (`DEFAULT_VOICE_SEED` in fetch-story, per-story via
  `voiceSeed`). This makes ElevenLabs reproducible: the same text + settings +
  seed returns the same audio, so re-rendering to fix ONE line no longer re-rolls
  and mispronounces the others. Keep it locked; only change a segment on purpose.
- `scripts/tts.py` and the `tts-test` workflow accept `stability`, `style`, and
  `seed` so a voice test can EXACTLY mirror the render segment before spending a
  full render (e.g. testing the deep title read, or a name's spelling).
- Narration is CACHED (`public/story-cache`, persisted by actions/cache keyed per
  story): a re-render bills ZERO ElevenLabs characters for unchanged lines; only
  new or edited text is generated. Keep the cache step in render-story.yml.
- NO emojis. NO em or en dashes (plain hyphens only). This applies to scripts,
  captions, descriptions, and covers.
- NO ALL-CAPS emphasis words in narration (owner rule 2026-07-03). The word-by-
  word caption renders text verbatim, so a capitalized word (LORD, THAT, MANY,
  HEARD) reads on screen like random shouting. Emphasis comes from the gold
  spoken-word highlight and pacing, never from caps. Only genuine acronyms
  (NASA, UNESCO) stay capitalized. Proper nouns keep normal title case.
- READABLE, FLOWING CADENCE (owner rule 2026-07-03): write for the ear. Do not
  chain ellipses into a halting stop-start rhythm; use a pause only where a
  speaker would truly breathe. No mid-sentence parenthetical asides that
  interrupt the thought ("the shortest surah... that is, chapter... in the..."),
  no point-of-view jumps (a third-person sentence must not switch to "mine"),
  and every sentence must be grammatical read aloud. Read each script out loud
  in your head before shipping; if a line is hard to follow in one hearing,
  rewrite it. (The Challenge short was pulled for exactly this.)
- SPOKEN ARABIC IS OPT-IN, NOT DEFAULT: an English TTS mangles transliterated
  Arabic words (lawaqih, laqaha). Prefer to SHOW the Arabic on screen (title
  card or the ayah quote) and SPEAK the English translation. Only voice a
  transliterated Arabic term when it has been ear-tested and approved.

## Packaging (every finished video)
- Cover (CoverCard 9:16 for shorts, CoverWide 16:9 for long-form).
- captions.txt: TikTok / Shorts / Reels + long-form YouTube description with the
  app footer, and the LAUNCH CTA (July 2026, keepsake + children's book):
  "Our keepsake and children's book launch this month. Join the waitlist at
  ketabistudio.com for 15% off your first order." The built-in ParallaxAd end
  card carries the same launch line. After launch, update both to a buy CTA.
- Render at scale 1 (1080p) for the daily cadence - it looks identical on phones
  and halves render minutes; reserve scale 2 / 4K for special releases. Deliver
  the artifact link, not the mp4 in chat. The "failure" badge on render-story is
  usually just the optional Drive upload; the artifact is still produced.
- STRATEGY (owner directive 2026-07-02): after the current batch, production
  shifts to LARGE BATCHES OF SHORTS (TikTok / Reels / Shorts) as the engine of
  channel growth; long-form becomes occasional, made only when specifically
  requested. Shorts keep the full bar: Khadijah cadence, newcomer-first
  writing, two-pass verification, eye-QCed literal footage, launch end card.
- Batch output while long-form is active: 1 short + 1 long-form per the
  content-calendar pillars. Batch
  the week: ALL scripts in one review message, ALL contact sheets in one message,
  then render the batch, so the owner schedules everything in one sitting
  (YouTube native, TikTok web, Meta Business Suite).

## Process
- See docs/content-calendar.md (schedule, pillars, posted list, app footer) and
  docs/yusuf-script.md (the storytelling + shot-list format to follow).
