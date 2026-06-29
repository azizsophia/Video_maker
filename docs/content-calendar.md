# Content system, schedule, and production status

Daily posting: one vertical short (posted to YouTube Shorts + TikTok + Reels, same
asset, different captions) and one long-form (YouTube 16:9). Build a backlog
ahead, then post daily from it.

Copy rules everywhere: NO emojis, NO em/en dashes (plain hyphens only).

## Weekly theme rotations (offset so short and long never share a theme on the same day)

| Day | Short / TikTok | Long-form |
|---|---|---|
| Mon | Signs of the Hour | Prophecy |
| Tue | Qur'an and creation (science) | Prophet stories |
| Wed | Surah or ayah decoded | Companions (deep) |
| Thu | Companions | Islamic history |
| Fri | Prophets and Seerah | Tafsir / Surah deep-dive (Jumu'ah) |
| Sat | Islamic history and places | Qur'an and creation (deep) |
| Sun | Duas, adhkar and worship | The Hereafter and the heart |

(2026-06-29 is a Monday; that Monday slot is already posted: Green Arabia short,
Euphrates long.)

## Already POSTED (do not remake)

Year of the Elephant; Surah Al-Kahf decoded; Ayat al-Kursi decoded; The Splitting
of the Sea; Abu Bakr as-Siddiq; The Story of Ibrahim; The Only Woman Named in the
Qur'an (Maryam); Hegra / Al-Hijr; Euphrates (short + long); Fire of the Hijaz;
Green Arabia; Constantinople; Lowest land on Earth (Ar-Rum).

## App footer for long-form descriptions (standing advert)

ABOUT KETABI STUDIO
Ketabi Studio makes Qur'an and Sunnah grounded videos for people who want depth without exaggeration. Every claim is sourced.

Visit ketabistudio.com and join the founding waitlist for early access.

Download our free app, your Islamic companion: track your daily adhkar, check in on your ibadah and intentions, and keep a Qur'an journal to build your own tafsir and reflect with mood based journaling.
App Store (Ketabi): https://apps.apple.com/us/app/ketabi/id6768112231
Google Play (Ketabi Studio): https://play.google.com/store/apps/details?id=com.ketabi.myapp

## In-progress batch (Tuesday)

- SHORT - Fingerprints (`scripts/stories/fingerprints.json`): DONE + footage wired
  (abstract ink/gold-dust/galaxy, human-free by construction), ~1.4 min, validated.
  TODO: render (StoryVideo vertical, orientation=vertical), then CoverCard cover +
  TikTok/Shorts captions.
- LONG-FORM - Story of Yusuf (`scripts/stories/longform-yusuf.json`): script written
  (~4.6 min) but NEEDS EXPANSION to ~9 min (add the banquet 12:31, the two
  prisoners' dreams 12:36-42, the cup in Binyamin's bag 12:70, Yaqub's grief 12:84;
  enrich each beat). Then footage (desert/well/Egypt/Nile/prison-stone/grain/
  night-sky/cloth - needs real visual frame-grab QC), render StoryVideoWide,
  CoverWide cover + long-form description with the app footer.

## KNOWN LIMITATION (important)

Image previews fail once a chat gets very long ("Request too large"), which blocks
frame-by-frame footage QC. For any video needing REAL-WORLD footage (people/text
risk), do the footage sourcing + QC early in a FRESH chat. Abstract-only footage
(ink, dust, galaxy, smoke) is safe without eyeballing and can be wired anytime.

## Per-video production checklist

1. Script in `scripts/stories/` (sourced; verses shown not recited; no date-setting).
2. Footage: Pexels search workflow -> frame-grab QC (human-free, text-free, no
   haram/other-faith symbols) -> wire video + videoDuration (beat <= ~1.8x clip).
3. Render via `render-story.yml` (orientation vertical|wide). "failure" badge =
   only the optional Drive step; artifact still produced; share the artifact link.
4. Covers: `CoverCard` (9:16) + `CoverWide` (16:9) brand template, never PIL.
5. Captions: TikTok (one line + 5 hashtags, #edutokcontest in middle), YouTube
   Shorts (one line), long-form description + app footer. No emojis/dashes.
