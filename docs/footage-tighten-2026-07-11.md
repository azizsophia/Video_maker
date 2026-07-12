# Footage tighten-up — owner review 2026-07-11

Owner flagged: freezing across many videos, and repeated ocean/sunset "wallpaper"
(skin-witness + cave-boulder, plus the sun-from-west cover). Two systemic fixes
landed, plus a per-beat swap list.

## Systemic (done, committed)
- ENGINE: `Cinematic` loops short clips (no end-of-clip FREEZE in any video) +
  supports still-image beat backgrounds. So no hard freeze on any re-render.
- QC RULE: CLAUDE.md items 6b (no-freeze / clip-length) + 6c (cross-video visual
  variety). New tool `scripts/audit-freezes.mjs` flags every beat whose clip is
  shorter than half its beat (freeze / rapid-loop). Report:
  `docs/freeze-audit-2026-07-11.txt`.

## HARD rapid-loop beats (clip loops 3x+ — re-source a LONGER clip or use a still)
- expander b4 (5s/23s), expander b6 (4s/17s)
- moon-split b2 (5s/17s)
- forelock b2 (8s/26s)
- verse-of-honey b4 (10s/31s)
- jerusalem-test b0 (7s/21s)
(soft loopers ~2-2.5x, acceptable with the loop fix: jerusalem-test b3/b4,
skin-witness b6, cave-boulder b11, killed-ninety-nine b2, verse-of-honey b3,
forelock b4.)

## Ocean / sunset repetition — per-beat swaps (need Pexels access to source)
- skin-witness b8 (35072027 = ocean): replace with a literal "revelation from the
  sky" shot (light breaking through dark cloud), NOT water.
- skin-witness b9 (34762874 = sunset+figure): replace; sun motif already on
  sun-from-west. Prefer a dark skin/close reflective shot literal to "your skin
  did not hear".
- cave-boulder b1 (34722463 = bright rocky hilltop WITH a distant person, title
  beat): replace with a dark cave-mouth / boulder-sealing-a-cave clip (literal).
- cave-boulder b4 (37665785) / b7 (35569733): blue water-like abstracts that read
  "ocean"; vary at least one to a dry cave/stone motif.

## Cross-video motif tally (keep balanced — do NOT stack these)
- sea/ocean: sun-from-west (cover+b0, intentional), skin-witness b8, cave-boulder
  b4/b7. -> trim to just sun-from-west.
- sunset/low-sun: sun-from-west, skin-witness b9, friday-hour, fajr-protection.
  -> spread out; no two adjacent-in-schedule videos should both open on a sunset.

## Blocker
Footage swaps need the Pexels search workflow (GitHub connection currently
dropped) + re-renders need the ElevenLabs top-up (July-4 caches expired). All
swaps above are queued to run the moment those are back.
