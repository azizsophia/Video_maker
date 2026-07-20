# Ketabi Studio — standing rules for every video (non-negotiable)

These are owner instructions. Apply them to ALL videos, every time, without being
asked. This file is the durable memory for this repo.

## PRE-SHIP QC CHECKLIST (owner directive 2026-07-03: every batch, no exceptions)
Run this whole gate on EVERY batch before contact sheets go to the owner and
again before final delivery. Do not rely on the owner to catch these - she has;
that is the point of the gate. Nothing ships with an open item.
0. DUPLICATE CHECK (owner directive 2026-07-05, BLOCKING, comes FIRST): before
   proposing, planning, or producing ANY video, read the PRODUCTION STATE
   section of docs/content-calendar.md (posted / delivered / scheduled /
   scrapped / in production) AND scan scripts/stories/ for an existing script
   on the topic. Never propose or remake a topic that is already posted or
   delivered (ad-Duha was re-proposed the day after it was posted - that is
   the failure this rule exists to prevent). Whenever a video is produced,
   delivered, posted, or scrapped, update that PRODUCTION STATE section in the
   SAME work session - the tracker being stale is itself a QC failure.
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
   map, cross-checked by an INDEPENDENT pronunciation audit that RESEARCHES each
   name against authoritative sources (Wikipedia IPA, Quran.com/corpus, sunnah.com,
   Forvo, transliteration guides; report to docs/) BEFORE it clears - the owner is
   not a native Arabic speaker, so a names-only ear-test is a final check, NOT the
   verification; "sounds fine" is not proof. Confirm the respelling gives the right
   vowel and stress, not just an approximate. No name on Daniel's default English
   reading.
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
6b. NO-FREEZE / clip-length (owner directive 2026-07-11, BLOCKING - freezes
   shipped across many videos and the owner had to catch them): every beat's
   clip must be long enough to fill the beat. A clip shorter than its narration
   holds on its last frame and FREEZES. The engine now LOOPS short clips
   (Cinematic CinematicBg) so nothing hard-freezes, but a clip that has to loop
   more than ~twice reads as an obvious repeat. So: run scripts/audit-freezes.mjs
   (probes each clip's real duration vs its beat's narration length) and for any
   beat flagged, source a LONGER clip (aim clip >= beat length) or use a still
   image (imageSrc - Ken Burns, never freezes). QC the MOTION, not just a frame.
6c. CROSS-VIDEO VISUAL VARIETY (owner directive 2026-07-11, BLOCKING): no
   generic "wallpaper" motif - ocean/sea, sunset, drifting clouds, starfield,
   dunes - may recur across videos, even as a different clip id. The owner
   reviews the slate together and a repeated ocean/sunset reads as lazy
   (skin-witness, cave-boulder and the sun-from-west cover all showed sea).
   Keep a repo-wide motif tally; when a beat wants "ambient", pick something
   distinct from what neighbouring videos already use. Literal-to-the-line
   always beats another sea.
7. RENDER-OUTPUT QC on stills: title cards readable (deep-read voice), every
   ayah shows its citation on-screen, captions carry the launch CTA + hashtags,
   the ad outro plays clean at the tail, no glyph-box tofu on Arabic.
8. Deliver with day-labeled covers + captions + contact sheets + artifact links.

## Length + end card (owner directives 2026-07-16, non-negotiable)
- EVERY video is ~61 seconds (just over 1:00). This is deliberate: TikTok's
  Creator Rewards / monetization needs >60s, and the owner wants every post to
  qualify. Target 61-63s total including the end card. Reach it with REAL content
  (more beats, a fuller story), never dead-air holds - padding kills retention
  (the account's avg watch time collapsed to ~6s; length must be filled, not
  stretched).
- NO product / waitlist / "join the founding list" ad at the end. The owner
  believes the waitlist end card suppresses reach (plausible: TikTok dampens
  off-platform promo CTAs), and pulled it. The ONLY end card is the lightweight
  WEBSITE card: brand mark + a short line + the ketabistudio.com button
  (showOutro true, outroAd false, ctaShowUrl true, no ParallaxAd, no waitlist
  copy). Captions also drop the waitlist line. CTA copy (owner 2026-07-17):
  end card headline "Visit our gift shop" + the ketabistudio.com button; captions
  "Visit our gift shop at ketabistudio.com".
- VISUALS trend toward STORY over stock (owner note 2026-07-16): the owner grew
  this account to 70k on faceless AI videos (InVideo AI) and the decline is
  market saturation + the "reads as AI" reach penalty, not the format itself.
  She now generates gen-AI VIDEO clips in ElevenLabs Studio (Sora/Veo/Kling -
  Studio only, no API, so SHE generates + sends them like she does images). Drop
  them in as the moving background (videoSrc) and compose the branded verse
  cards / speaker labels / voices / cover around them. A moving story visual is
  preferred over a single still where a clip is available.

## AURA dreamscape format (owner-approved 2026-07-17, the main-channel look)
- Ketabi Studio main channel = surreal gen-AI DREAMSCAPES (fal.ai Kling, ~$0.35/5s
  clip) as the moving background: luminous otherworldly gardens, rivers of light,
  glowing skies - a Jannah / beauty-of-creation dream world. NOT realistic stock
  b-roll (reads as AI slop), NOT characters (owner rejected claymation/anime).
  Reference: the owner's glowing-purple-garden image. Deep British Voice B reads a
  reflection / Qur'an translation over it; glowing word-by-word captions (theme
  "aura"); Arabic shown on the ayah cards; website-only end card; 61s.
- Workflow: fal key is the owner's (kept out of the repo - env var only). Generate
  Kling clips (aspect_ratio 9:16, duration 5), 6-frame eye-QC each (no text/faces/
  haram), download + commit under public/main/genai/, wire as per-beat videoSrc.
  Keep prompts PEOPLE-FREE (dodges uncanny AI faces AND any depiction/adab issue).
- RENDER SCALE for gen-AI VIDEO backgrounds = scale 1, NOT 2. The clips are 720p,
  so scale 2 just upscales them 3x (soft) for no gain and triples render time (a
  scale-2 video-bg render ran >24min and was cancelled). scale 1 (1080) is the
  right call; the glowing captions are still legible. (scale 2 stays only for the
  still-image aura/kids videos where the type is the hero.)

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

## Kids channel voices (owner locked 2026-07-16, non-negotiable)
- shop.ketabi dialogue videos use EXACTLY these voices: Mama = Lily
  (pFZP5JQG7iQjIQuC4Bku), child = 6fZce9LFNG3iEITDfqZZ. Settings as in
  scripts/stories/see-allah.json (Mama stability 0.42 style 0.46, child
  stability 0.40 style 0.45, speed 0.92). Do not swap voices without a new
  owner-approved ear test.

## Topic selection (owner directive 2026-07-07, non-negotiable)
- Pick shorts topics for VIEW POTENTIAL, backed by research into what performs
  in the Islamic short-form niche - not by what is merely interesting or obscure.
- Keep the NAME-LOAD light. A slate full of hard-to-pronounce Arabic names
  (Uwais al-Qarni, Julaybib...) was rejected 2026-07-07. Prefer topics whose
  hook is a question, mystery, place, sign, or story-shape rather than an
  unfamiliar name; an unfamiliar name must earn its place with an exceptional
  hook, and never more than 1-2 name-heavy topics per batch.

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
  istighfar) - all ear-tested and approved 2026-07-01. 99-Names series adds
  (ear-tested + owner-approved 2026-07-19/20): Aws -> "aus" (House without the H,
  hard hissed S), as-Sami' -> "as sa MEE" (the All-Hearing), Khawla -> "Khawla".
  Spoken transliterated
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
- CRISPNESS / the owner posts the MASTER, not the chat preview (owner note
  2026-07-16, BLOCKING for delivery): the chat file transfer has a hard ~25MB
  cap, so any mp4 sent inline is downscaled + low-bitrate = SOFT. The owner
  reposts whatever I hand her, so an inline preview ships a soft video. RULE:
  the file the owner actually posts must be the full-quality master. Deliver the
  master via a downloadable link (the GitHub Actions artifact, or the Drive
  upload once fixed) - not the compressed chat mp4. If a chat preview is sent
  for a quick look, LABEL it "preview only, soft - post the master link", and
  always encode previews at full 1080 width (never 960) so text stays legible.
- AURA format renders at scale 2 (owner note 2026-07-16): the glowing word-by-
  word captions are the hero and are the softest thing at scale 1, so the
  aesthetic Qur'an-translation shorts (theme "aura") render at scale=2 for
  supersampled, razor-sharp caption edges (the b-roll is source-limited, but the
  type carries the look). Prefer the highest-res source clip available (seek a
  1440 or 2160 vertical rendition; 1080 only if that is all Pexels offers).
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
