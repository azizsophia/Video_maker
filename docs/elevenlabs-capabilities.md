# ElevenLabs capability review - adoption memo for the narration pipeline

Researched 2026-07-10 against elevenlabs.io/docs, help.elevenlabs.io, and the
ElevenLabs pricing pages. Scope: what the current ElevenLabs product surface
offers that could make our narration stronger, and what it would cost to adopt.
This memo recommends; it changes no pipeline code.

## What we run today (verified in the code)

- Endpoint: `POST /v1/text-to-speech/{voice}/with-timestamps` (both
  `scripts/tts.py` line 47 and `scripts/fetch-story.ts` line 312).
- Model: `eleven_multilingual_v2` (default in both files).
- Voice: Daniel, `onwK4e9ZLuTAKqWW03F9`.
- Per-segment `voice_settings`: `{stability: 0.32, similarity_boost: 0.8,
  style: 0.55, use_speaker_boost: true}` default, overridable per beat (the
  title card uses a steadier 0.72 / 0.1 / 0.85 read).
- Seed-locked: `seed: 71421` (`DEFAULT_VOICE_SEED`), per-story `voiceSeed`.
- Captions: the response's `alignment` (per-character
  `character_start_times_seconds` / `character_end_times_seconds`) is grouped
  into words by `groupWords()` in fetch-story.ts for the word-by-word captions,
  then remapped token-for-token to the proper on-screen spelling.
- Pronunciation: the hand-maintained `PHONETIC` respelling map (~140 entries)
  swaps tokens in the SPOKEN text only.
- Caching: sha1 of {text, voice, model, settings, seed} in
  `public/story-cache`; a cache hit bills zero characters.
- Each beat is synthesized as an independent request (no cross-segment
  conditioning), so segment-to-segment tone jumps are possible.

## 1. Eleven v3 (`eleven_v3`) - audio tags and emotional direction

Status: GA. v3 launched in alpha in June 2025 and left alpha in early 2026;
the current models page (elevenlabs.io/docs/overview/models) lists it with no
alpha caveat as "our latest and most advanced speech synthesis model",
70+ languages, 5,000-character limit per request (vs 10,000 for
multilingual v2).

What it offers:
- Audio tags in square brackets steer delivery inline: `[whispers]`,
  `[sighs]`, `[excited]`, `[tired]`, `[pause]`, accents, even multi-speaker
  performance. This is genuine emotional direction, well beyond what our
  comma/ellipsis pacing plus stability/style knobs can do. (Docs:
  elevenlabs.io/blog/v3-audiotags; help center "How do audio tags work with
  Eleven v3".)
- v3 does NOT support SSML break tags; pauses come from tags, punctuation
  (ellipses) and text structure - so our punctuation-driven pacing carries
  over conceptually.
- Native IPA support "across 70+ languages" and pronunciation-dictionary
  phoneme tags (see section 2) - the strongest pronunciation story of any
  model.
- A companion Text to Dialogue API (`/v1/text-to-dialogue`, and
  `/v1/text-to-dialogue/.../with-timestamps`) exists for multi-speaker work;
  not needed for our single-narrator format.

Timestamps: timestamp endpoints for v3 now exist. ElevenLabs documents
`text-to-speech/convert-with-timestamps`, `stream-with-timestamps`, and
dialogue `convert-with-timestamps` (v3 is the dialogue default), and
resellers (fal.ai, WaveSpeed) sell "Eleven v3 Timing" products that return
per-character alignment. So the hard blocker from the alpha period (no
timestamps on v3) appears lifted. MUST still be probed live with our key
before any migration - the TTS with-timestamps reference does not explicitly
enumerate model compatibility.

Seeds: the `seed` parameter is documented on the convert endpoints (0 to
4294967295, "best effort... determinism is not guaranteed") including the
dialogue endpoint that defaults to v3. Note determinism was already only
best-effort on v2; our cache makes this mostly moot for re-renders.

Voice compatibility: v3 works with library voices like Daniel and with IVC
voices; ElevenLabs recommends more expressive/varied source material for v3
and PVC voices were historically not fully optimized for it. Daniel is a
default library voice, so expect it to work, but the READ WILL CHANGE - same
text, same settings, different model means different audio. Every cached
line would regenerate and every locked pronunciation and the title-card read
would need a re-ear-test.

Voice settings caveat: v3's stability behaves as three presets - Creative
(expressive, "prone to hallucinations"), Natural, Robust ("similar to v2") -
rather than a smooth dial. Community reports say the API accepts only
0.0 / 0.5 / 1.0 for v3. Our tuned 0.32 default and 0.72 title read do not
map 1:1. `style` is documented for v2+ and v3; `speed` support on v3 should
be probed.

Migration risks (why not now):
- Whole-catalog voice drift: every cached segment invalidates; the channel's
  established sound changes mid-catalog.
- Hallucination risk at low stability ("Creative... prone to hallucinations")
  is a QC hazard for a pipeline with a blocking accuracy gate.
- Request stitching is explicitly NOT available for v3 (docs: "Request
  stitching is not available for the `eleven_v3` model") - so adopting v3
  forecloses the section-4 fix for tone jumps.
- Caption timing: our `groupWords()` assumes the returned `characters` array
  mirrors the input text. Audio tags in the text must NOT appear in caption
  words; we would have to strip tags and rely on `normalized_alignment`, or
  filter tag spans - new code, new failure modes for the token-for-token
  caption remap.
- 5,000-char per-request cap is fine (our beats are far shorter).

Verdict: TRIAL, do not migrate. Run a two-line probe (hook + title card) on
v3 with tags and timestamps, ear-test against the current Daniel read, and
keep it on the shelf until stitching or fine-grained stability arrives.

## 2. Pronunciation dictionaries (PLS) - replacing the PHONETIC map

Docs: elevenlabs.io/docs/eleven-api/guides/how-to/text-to-speech/pronunciation-dictionaries
and the pronunciation-dictionaries API group (`POST
/v1/pronunciation-dictionaries/add-from-file`, `add-from-rules`, plus
version/list/remove endpoints).

How it works:
- Upload an XML PLS lexicon (`<grapheme>` = written form, `<phoneme>` or
  `<alias>` = how to say it). Supported phoneme alphabets: IPA and CMU
  Arpabet. Case-sensitive graphemes.
- Reference it per request via `pronunciation_dictionary_locators`
  (`pronunciation_dictionary_id` + `version_id`), up to 3 dictionaries per
  request, on the same `/with-timestamps` endpoint we already call. No extra
  credit cost is documented for applying dictionaries.

The critical model split:
- PHONEME tags (IPA/CMU, true stress control) work ONLY with
  `eleven_flash_v2` and `eleven_v3`. "Multilingual v2 doesn't support phoneme
  tags"; other models "skip dictionary phoneme tags and use the default
  pronunciation".
- ALIAS tags (text-for-text substitution) work on ALL models, including our
  `eleven_multilingual_v2`.

What this means for us:
- On our current model, a dictionary buys us exactly what the PHONETIC map
  already does (alias substitution), minus one big thing: our map remaps the
  timed caption words BACK to the proper spelling token-for-token. A
  server-side alias breaks that: the alignment would come back for the alias
  text (see `normalized_alignment` in the response) and our
  caption-vs-spoken token match would need rework for no pronunciation gain.
- True IPA with correct stress (kha-DEE-jah, qu-RAYSH with a real qaf) needs
  v3 (or flash_v2, a quality downgrade). So the dictionary question is
  coupled to the v3 question.
- A dictionary IS worth building as durable, versioned infrastructure the
  day we trial v3: one `ketabi-names.pls` holding the whole locked map, IPA
  per name, applied via locators, ends the per-script respelling fragility
  (the "am"/"said" poisoning problem disappears because graphemes are exact,
  case-sensitive tokens, and the spoken text stays identical to the caption
  text - no remap step at all).

Verdict: SKIP for the current v2 pipeline (alias-only, breaks caption
remap, no quality gain). ADOPT as part of any v3 trial - it is the correct
long-term replacement for the PHONETIC map and removes a whole class of QC
work.

## 3. Sound effects API - licensed ambient beds (no music)

Docs: `POST /v1/sound-generation`
(elevenlabs.io/docs/api-reference/text-to-sound-effects/convert), model
`eleven_text_to_sound_v2`.

- Prompted generation: "desert wind at night, distant, soft", "campfire
  crackle, low", "stone room tone". These are ambience, not music, so they
  sit inside the no-music rule - but ambience under narration is a mix
  change the owner has not approved; treat it as opt-in per video after a
  sample.
- Parameters: `text`, `duration_seconds` 0.5-30, `loop: true` for smoothly
  looping beds (v2 sound model only), `prompt_influence` 0-1,
  `output_format` (mp3/pcm/etc; 192kbps mp3 needs Creator tier+).
- Cost (help center "How much does it cost to generate sound effects"): 200
  credits per generation when the model picks the duration; 40 credits per
  second when you set `duration_seconds`. A 10s loopable bed = 400 credits,
  reusable forever - generate once per ambience type, keep a small licensed
  library in the repo. Paid plans carry the commercial license for generated
  audio (Free tier does not).
- Remotion fit: trivial. A looping bed is just another `<Audio>` track at
  low volume (say 0.08-0.15) under the narration; no pipeline change, just
  an optional `ambience` field per story/segment and a static file.

Verdict: TRIAL. Generate 3-4 beds (desert night wind, fire crackle, cave/
room tone, dawn birds-free breeze), send the owner one short with and
without the bed, adopt if she approves. Low cost, fully reversible, no
narration risk.

## 4. Pacing, stitching, normalization (all on our current model)

- `voice_settings.speed`: 1.0 default, <1 slower, >1 faster - documented on
  the convert endpoints we already use. A per-segment `speed` (e.g. 0.95 on
  the title card, 1.0 elsewhere) is a one-line addition to the settings
  object and flows through the cache key automatically. Cheapest win in this
  memo. Note: changing speed changes timing, so cached lines regenerate; do
  it at a batch boundary.
- Request stitching (docs: .../text-to-speech/request-stitching): pass
  `previous_text`/`next_text` (the neighbouring script text) or
  `previous_request_ids`/`next_request_ids` (up to 3 IDs, "no older than two
  hours") so each segment is generated knowing its context - directly
  targets our per-beat tone jumps. Works on multilingual v2; explicitly NOT
  on v3. Easiest form for us: send `previous_text` = previous beat's spoken
  text and `next_text` = next beat's, since request IDs interact awkwardly
  with our cache (a cached hit has no fresh request ID, and IDs expire).
  Conditioning text is not documented as billed; verify the character-cost
  response header on a probe. Cache note: previous/next text must join the
  cache key, so editing one beat regenerates its neighbours too - that is
  the point (the neighbours' prosody depends on it), but it slightly weakens
  the zero-cost re-render guarantee. Seed interaction: same seed + same
  params still reproduces; adding context changes params, hence a one-time
  full regeneration per story.
- `apply_text_normalization` ("auto"/"on"/"off"): we can pin "on" so numbers
  and dates ("610 AD", "23 years") are always spelled out consistently -
  multilingual v2 is explicitly the better normalizer (the models page
  recommends v2 "for phone numbers and other cases where number
  normalization is important"). Low value day-to-day (we mostly write
  numbers out already per the read-aloud rule) but a free safety net.

Verdict: ADOPT `previous_text`/`next_text` stitching and consider per-segment
`speed`; pin `apply_text_normalization: "on"`. All are additive JSON fields
on the exact endpoint we call today, no caption impact (alignment still
covers only `text`).

## 5. Quota and pricing realities

Credits (1 credit = 1 character for standard TTS):
- `eleven_multilingual_v2`: 1 credit/char. `eleven_v3`: standard 1
  credit/char now that it is GA (the alpha-era 80% UI discount has lapsed).
  `eleven_flash_v2_5` / turbo: ~0.5 credit/char on API - half price, but a
  clear expressiveness downgrade for narration; keep for tests at most.
- Timestamps cost nothing extra (`/with-timestamps` bills like plain TTS).
  Pronunciation dictionaries: no documented per-use credit cost. Seeds:
  free. Stitching conditioning: not documented as billed (verify header).
- Sound effects: 200 credits/generation or 40 credits/second when duration
  is set. Eleven Music (which we will never use): ~900 credits/minute.
- All products draw from ONE shared monthly credit pool.

Plans (elevenlabs.io/pricing, 2026): Free $0 / 10k credits (NO commercial
license - never ship on it); Starter ~$5-6 / 30k; Creator $22 / ~100-121k
credits, 192kbps output, usage-based overage available; Pro $99 / ~500-600k;
Scale $299 / 1.8M. Annual billing = ~2 months free. Credits reset monthly
(no rollover).

Our math: a 60-90s short is roughly 1,400-2,200 characters; an 8-minute
long-form ~7,500+. A daily-shorts month is ~50-70k credits of narration
before caching - Creator tier territory; the story-cache is what keeps
re-renders free, so protect it (any new request field must go into the cache
key, as the code already does by hashing the whole settings object).

When quota runs out mid-batch: (1) enable usage-based overage on Creator+,
(2) upgrade tier for the month, (3) push non-urgent regenerations to the
next cycle - the cache means only NEW text costs anything. Do not fall back
to Flash for shipped narration.

## 6. Other surface worth knowing

- Voice remixing (`POST /v1/text-to-voice/remix`,
  docs/overview/capabilities/voice-remixing): derive a modified voice from
  an existing one (pacing, delivery, accent) at Low/Medium/High/Max remix
  strength. Could one day make a "deeper Daniel" as a permanent title-card
  voice instead of a settings override - but a second voice ID doubles the
  ear-test surface. Skip unless the title read ever stops satisfying.
- Output formats: we currently take default mp3 from the JSON
  (`audio_base64`). `output_format=mp3_44100_192` (Creator+) is a free
  quality bump worth requesting; PCM 44.1kHz needs Pro.
- `language_code` (ISO 639-1): can pin the model to English so stray Arabic
  transliterations never flip the language detection mid-line - cheap
  insurance for multilingual v2, add alongside stitching.
- Stream-with-timestamps exists if render time ever matters; irrelevant at
  our batch cadence.

## Adoption table

| Feature | What it gives us | Effort in our stack | Risk | Recommendation |
|---|---|---|---|---|
| Stitching via `previous_text`/`next_text` (v2) | Consistent prosody across beats; fixes tone jumps between per-beat requests | Small: 2 extra JSON fields in `tts()` + include in cache key; neighbours regenerate on edit | Low; one-time full regen per story; verify conditioning is unbilled | ADOPT NOW |
| `apply_text_normalization: "on"` + `language_code: "en"` | Deterministic number/date reading; no language flips on transliterations | Trivial: 2 fields | Minimal | ADOPT NOW |
| `output_format=mp3_44100_192` | Higher-bitrate narration for the premium bar | Trivial: query param (Creator+) | None | ADOPT NOW |
| Per-segment `voice_settings.speed` | Real pacing control (slower title card, tighter hook) beyond punctuation | Trivial: passes through existing settings merge + cache key | Cached lines regenerate when first used | ADOPT (use sparingly, ear-test) |
| Sound-effects ambience beds (`/v1/sound-generation`, `loop: true`) | Licensed wind/fire/room-tone under narration; premium feel without music | Small: generate once (~400 credits/bed), commit files, optional low-volume `<Audio>` track in Remotion | Owner approval needed (mix change); keep volume low; no-music rule intact (ambience is not music) | TRIAL (A/B one short past the owner) |
| eleven_v3 audio tags (`[whispers]`, `[pause]`, emotional direction) | Far richer emotional delivery than stability/style knobs | Large: model swap, tag-stripping for captions, full pronunciation + title-read re-ear-test, whole cache invalidates | High: voice drift across catalog, Creative-mode hallucinations, NO request stitching on v3, coarse stability (0/0.5/1), timestamps-on-v3 must be probed live | TRIAL only (2-line probe); do not migrate yet |
| Pronunciation dictionary - phoneme/IPA rules | Exact MSA pronunciation incl. stress; retires the fragile PHONETIC map and the caption remap | Medium: build `ketabi-names.pls` from the map, upload once, pass locators | Phoneme tags need v3/flash_v2 - useless on multilingual v2 | ADOPT WITH v3 (build the PLS when the v3 trial starts) |
| Pronunciation dictionary - alias rules (works on v2) | Same substitutions we already do, server-side | Medium, and it breaks our caption token remap (alignment returns alias text) | Regression risk for zero pronunciation gain | SKIP on v2 |
| Text to Dialogue API | Multi-speaker scenes | N/A for single narrator | - | SKIP |
| Voice remixing | A permanent "deep Daniel" variant | Small API-wise, big QC surface (second voice) | Ear-test burden, catalog consistency | SKIP for now |
| Flash v2.5 (0.5 credit/char) | Half-price characters | Trivial | Expressiveness downgrade | SKIP for shipped audio |

## Suggested probe order (one sitting, a few hundred credits)

1. Re-run one existing beat with `previous_text`/`next_text` + normalization
   + 192kbps and confirm identical caption behaviour and the character-cost
   header; ear-test the joint against the current cut.
2. Generate 3 ambience beds and cut one contact-sheet-approved short both
   ways for the owner.
3. v3 probe: hook line + title card on Daniel with `[whispers]`-class tags
   via `/with-timestamps`, `model_id: eleven_v3` - confirms timestamps,
   seed acceptance, and stability value handling in one request pair.

Key references: docs/overview/models; api-reference/text-to-speech/
convert-with-timestamps; eleven-api/guides/how-to/text-to-speech/
request-stitching; eleven-api/guides/how-to/text-to-speech/
pronunciation-dictionaries; api-reference/text-to-sound-effects/convert;
blog/v3-audiotags; help.elevenlabs.io sound-effects cost article;
elevenlabs.io/pricing.
