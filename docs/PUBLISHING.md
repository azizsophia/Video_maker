# Ketabi Studio — Publishing Playbook

How to publish the rendered videos across platforms **without copyright trouble**.

## Visual rules (motion-graphics explainer style)
- **Never a stale background.** Every beat keeps moving and always has on-screen
  text or an animated graphic. No holding a static background under a voiceover.
- **A purposeful visual per beat** — quote cards, mirror/comparison cards, a
  diagram that assembles, a timeline, kinetic typography — not one recycled scene.
- Brand palette: **emerald + cream + gold** (from the Ketabi logo); keywords in gold.
- Code-built motion graphics only (no live footage / AI images). Aniconic.
- Goal: hold retention past the first 3s, and earn shares/saves (the metrics that
  drove the channel's hits).

## Accuracy (non-negotiable: ultra-precise)
- **Be ultra-precise. Never simplify in a way a knowledgeable viewer could pick
  apart.** Accuracy applies to the **visuals too**, not just the narration.
- Prefer the exactly-correct word over the punchier-but-looser one (e.g. the
  Birmingham text is "**identical**" in wording, not "exactly the same" — the
  early manuscript is undotted).
- Example to follow: when comparing an old manuscript to today, show the
  **undotted early script** vs the **dotted modern script** — don't show the
  modern dotted text on both sides.
- Every claim sourced (Qur'an + sound Hadith / cited scholarship). Frame disputed
  i'jaz claims as reflection/possibility, never as proven fact.

### Enforced safeguards (so an error cannot ship)
- **Qur'an Arabic is NEVER hand-typed.** Use `verseRef` (e.g. `"15:9"`); the
  pipeline pulls the exact `text_uthmani` + official translation from Quran.com.
  The build **fails** if a segment has hand-typed Arabic without `verseRef`
  (hadith must be flagged `"hadith": true` and manually verified).
- **Attribution rule:** divine acts belong to **Allah**, never to "the Qur'an
  itself." Say *"Allah promised to protect it"* — never *"the Qur'an guards itself."*
- **Bulletproof claims only.** History, prophecy, preservation. No contestable
  science-i'jaz (e.g. atmosphere ≠ the seven heavens — 67:5 places the stars in
  the lowest heaven).
- Every render emits **`story-facts.txt`** (exact verses + translations + sources).
  Review it before posting.

## The core rule (copyright / Content ID)

Famous reciter recordings (Abdul Basit, Sudais, Shuraim, etc.) are commercially
registered, so YouTube/TikTok Content ID will match them. What matters is *how*
each platform treats that match:

| Format | What happens with a claimed reciter | What to do |
|---|---|---|
| **Long-form YouTube** (horizontal, regular video) | "No impact" claim — not a strike, video stays up, fully viewable | **Publish normally.** Fine. |
| **YouTube Short ≤ 60 seconds** | Always allowed — Shorts music licensing covers claimed audio under 60s | **Always safe.** Use freely, any reciter. |
| **YouTube Short > 60 seconds** | Depends on the *specific recording's* claimant: some pass ("no impact"), some **BLOCK worldwide** (e.g. UMG). Abdul Basit Al-Ikhlas passed (did 1k); Sudais Al-Mulk was blocked (UMG). | **Test it Unlisted first** (check copyright before going public), OR use copyright-free audio for guaranteed safety. |
| **TikTok** | Separate system from YouTube; our short surahs publish & monetize fine | **Post the 60s+ cut here** (TikTok monetization needs 60s+). |

**Platform priority (by our results):** YouTube Shorts (1k) > TikTok (300). Shorts
is the growth engine, so it's worth optimizing for.

### The practical workflow
- **Long-form** lessons → YouTube (any reciter, "no impact" is fine).
- **60s+ vertical** promo/teaser → **TikTok** (and IG/FB Reels), NOT YouTube Shorts.
- **≤ 60s vertical** cut → **YouTube Shorts** (claimed audio is allowed under 60s).
- Reciter stays **consistent** (currently **Sudais**) across everything.

### When to switch to a copyright-free reciter (build "#2")
The case is strongest now that **YouTube Shorts (>60s) is the growth engine** but
carries an unpredictable per-recording block risk with famous reciters. Two paths:
- **Keep the famous voice + test each >60s Short Unlisted** before publishing
  (works, but tedious at scale and risks inconsistent reciters).
- **Copyright-free audio** — guarantees no blocks, so >60s Shorts work reliably
  on the best platform. Trade-off: a lesser-known Creative Commons reciter **and**
  generating word-by-word timing ourselves (forced alignment) — a real project.

≤60s Shorts are always safe, so a quick safety net is to keep a ≤60s cut of every
Short on hand regardless of which path we choose.

## Reciter
Current channel reciter: **Sheikh Abdur-Rahman as-Sudais** (Quran.com id `3`).
Credit on the outro + in every description.

## Caption / description rules
- **YouTube descriptions: no emojis.** Keep it clean and professional.
- Use **<=5 hashtags** (YouTube ignores all hashtags if there are more than 15;
  a tight set ranks better).
- **Front-load keywords** in the first two lines (that's the search/preview snippet).
- Always include: the hook, authentic **sources**, the **reciter credit**, and
  the **ketabistudio.com** link.
- TikTok/Reels captions: short, hook-first, no emojis, a handful of hashtags.
- **Shorts + TikTok caption: 100 characters or less, exactly 5 hashtags.** Punchy,
  hook-first, no emojis. (The longer sourced YouTube description is separate.)

## Audio rules (non-negotiable)
- **No music / instruments.** Story videos use **ambient sound effects only**
  (wind, atmosphere, low rumble for tension) — never melodic/instrumental music.
- **The Qur'an is never AI-synthesized.** Arabic ayahs are always the real
  reciter (Sudais). AI narration (ElevenLabs, voice "Daniel") is used **only for
  the English** story/meaning.
- Story content must be **authentic** — every claim sourced (Qur'an + sound
  hadith), never embellished.
