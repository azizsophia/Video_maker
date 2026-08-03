# Creator Rewards eligibility — why we keep getting disqualified, and the fix

Owner directive, 2026-08-03. This is about **TikTok Creator Rewards Program (CRP)
monetization eligibility** — a *separate gate* from reach (docs/STRATEGY.md,
docs/main-channel-format-research-2026-07-16.md) and from copyright
(docs/PUBLISHING.md). A video can reach fine, be 4K-cinematic, be 100% accurate,
pass copyright — and still be disqualified from CRP as "unoriginal / low
quality." That is what has happened to the last several posts.

**Urgent:** CRP enforcement escalates — content removal → posting restriction →
**permanent removal from the program on the 4th violation.** We have already
been flagged repeatedly. Treat the next disqualification as potentially
terminal for monetization. Stop shipping the flagged signature *now*; do not
tune-and-repost it.

## The one thing to internalize

CRP's originality check is a **category judgment, not a quality score.** It asks
one question: *did a human meaningfully create this, or did tools produce it?*
Production polish (4K, cinematic grade, premium captions) does not move that
needle. Our house style — **faceless + AI/TTS voice + licensed-stock or gen-AI
visuals** — is, choice for choice, on the wrong side of that line. There is no
tweak-sized fix; the program is *designed* to exclude that signature.

## Why our current output trips it (mapped to our real pipeline)

| What we ship today | CRP rule it trips |
|---|---|
| **Pexels stock b-roll** (`videoSrc` / `OffthreadVideo`, `CinematicBg`) as the substance of every beat | "Imported or copied from another source without new creative editing." Stock lives on thousands of accounts and is fingerprinted. 4K/cinematic is irrelevant — reused stock is unoriginal by definition. |
| **Reusing the same clips across our own videos** (the overnight-wave "footage wall" — a drained dark-aura Pexels pool) | Duplicated/repetitive content — the same unoriginality signal, now self-inflicted across our own catalogue. |
| **ElevenLabs TTS (Voice B) + stock/AI visuals + template word-by-word captions** | The "fully AI-produced" bucket — explicitly ineligible. This is the exact pattern our own 07-16 research doc quotes YouTube's policy naming ("generic/unoriginal templates… repetitive narration with minimal variation"); TikTok CRP mirrors it. |
| **Gen-AI Kling/Sora "aura" dreamscape backgrounds** (`theme: "aura"`, `videoSrc` under `public/main/genai/`) | Makes eligibility **worse**: now the *visuals* are AI-generated too → AI-voice + AI-visuals = the most-disqualified category, and it also trips TikTok's AI-content disclosure system. Premium-looking, wrong lever for CRP. |

Note this is the SAME root cause as the reach stall our 07-16 doc diagnosed
("perceived-AI" trust penalty). Reach and monetization are punishing us for the
same thing from two directions.

## The fix we're committing to: owner-generated art/footage

**Decision (owner, 2026-08-03): retire licensed stock and gen-AI video as the
default visual substance. The visual layer becomes owner-created — unique art
you make (the kids-channel `shop.ketabi` pipeline) or footage you shoot
yourself.** This kills the single strongest "unoriginal" signal, and it's the
same direction our 07-16 format research already pointed (unique owner art, not
Pexels b-roll).

What this means in the pipeline:
- **Default per-beat visual = owner art/footage** (`imageSrc` Ken-Burns of your
  own artwork, or `videoSrc` of footage you filmed), NOT `CinematicBg` over a
  Pexels clip and NOT a Kling `aura` clip.
- **Stock/gen-AI is demoted to a rare, transformative accent** — a small
  component inside an owner-built frame, never the substance of the video. When
  used at all, it must be genuinely transformed (composited into your art,
  heavily graded/overlaid), not shown raw.
- The **branded Remotion layer stays our moat**: verse/Name cards, citations,
  word-by-word captions, the noor/ketabi/atlas brand look, speaker labels. That
  layer is original authorship and helps — it just can't carry a stock/AI base
  by itself.

## Honest limits of the art-only fix (read this)

Owner art removes the biggest flag, but **audio is still 100% synthetic** (TTS).
CRP weighs the whole production. Art-only will *substantially reduce* risk but
may not *fully* clear it while the voice is AI. To close the gap:
- **Disclose AI** with TikTok's AI-content toggle on anything AI-assisted (voice,
  any residual gen-AI visual). Undisclosed synthetic content is treated worse.
- **Strongest version, when you're ready:** record one real human voice element
  (even just the cold-open line / the "asker" in the dialogue format). That is
  the change that definitively flips *AI-as-producer → AI-as-tool*. Not required
  for this pass — flagged as the next lever if art-only still gets flagged.
- **Monitor:** post a small test batch in the new owner-art format and watch the
  CRP eligibility status per video before scaling. Do not batch-produce 12 again
  until one clears.

## Pre-publish CRP gate (add to the CLAUDE.md QC checklist)

A video may go to a monetized account only if it can answer **yes** to 1–3:

- [ ] Is the **primary visual** owner-created art/footage (not raw Pexels, not a
      raw Kling/Sora clip)?
- [ ] Is every clip **unique repo-wide** (no reuse across our own videos)?
- [ ] If any stock or gen-AI appears, is it a small **transformed** accent, not
      the substance?
- [ ] Is **AI disclosure** set for any AI-assisted element?
- [ ] Is it **>60s** and otherwise CRP-eligible (personal account, region,
      follower/view thresholds — see below)?

## Baseline CRP eligibility (so effort isn't wasted)

Personal account (not business), 18+, eligible region, clean guidelines record;
**10,000+ followers**, **100,000+ valid views / 30 days**; video **>1 minute**
and **1,000+ For You views**; no Duets/Stitches/Photo Mode.

## Sources (2026 CRP rules)

- How to fix the CRP "unoriginal content" flag (2026): https://socialboostdigital.com/blog/tiktok-creator-rewards-unoriginal-content-flag
- TikTok's AI monetization restrictions & creator income: https://storrito.com/resources/what-tiktoks-ai-monetization-restrictions-signal-for-creator-income/
- CRP 2026 requirements & payouts: https://shortsfast.com/blog/tiktok-creator-rewards-2026-requirements/
- Our own reach diagnosis (same root cause): docs/main-channel-format-research-2026-07-16.md
