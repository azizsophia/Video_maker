# Batch 5 - READ-IT-ALOUD pass (independent)

Reviewer: independent pass, did not write these scripts. Judged fresh against
CLAUDE.md (flowing cadence, grammatical-when-spoken, newcomer-clear, no all-caps
in narration, no emojis, no em/en dashes, ~10-15s beats, verbatim-caption sanity,
loop-opening hook, reflective/actionable button, clear dhikr/dua/sunnah payoff,
spoken transliterated-Arabic never flush at a segment end).

Scope note: title / titleSub / cover.title / cover.kicker are DISPLAY fields and
are exempt from the all-caps rule (checked, all clean). Caption fields (tiktok /
shorts / reels) are display copy, not narration (checked, all clean).

Calibration note on the colon check: the task names "a colon" as an example to
flag on the verbatim word-by-word caption. However the APPROVED gold-standard
template (scripts/stories/khadijah.json, beat 11) itself narrates
"said: when Khadijah comes..." and the renderer (StoryVideo.tsx / Cinematic.tsx)
prints each aligned token verbatim, colon attached to its word ("said:"). The
"said:" / "says:" quotation colon is therefore an accepted, shipped pattern and
is NOT flagged in the beats below. Only an unusual or awkward colon would be
raised.

Spoken transliterated-Arabic flush-end audit (the specific ask):
- "Subhaan Allahi wa bihamdih" and "Subhaan Allah al-Azeem" were traced at every
  occurrence.
- Every occurrence in light-heavy.json is followed in-segment by its English
  gloss or more narration (never flush). PASS.
- ocean-of-sins.json beat 8 ("...wa bihamdih... one.") and beat 6 (each phrase
  carries a trailing ellipsis) are NOT flush. PASS.
- ocean-of-sins.json beat 2 IS flush (the transliteration is the last thing in
  the segment). FLAGGED below. This is the one real flush-end violation in the
  batch.

Findings total: 1 blocking (flush-end), 3 minor. 9 of 10 scripts pass clean; 1
needs a one-line fix before render.

---

## night-call.json - VERDICT: PASS (1 minor note)

Hook opens the loop cleanly ("a question is asked from above ... almost no one is
awake to answer it"). Cadence flows, no chained ellipses (the three question
beats each carry a single internal pause, not a stop-start chain). fitrah-free;
every term plain. Button is actionable and non-corny ("set an alarm tonight ...
Be the one who answers"). Payoff crystal clear: wake in the last third, pray two
units, whisper a dua. No beat over ~40 words. No all-caps in narration.

| script | beat | offending line (verbatim) | rule | proposed rewrite |
|---|---|---|---|---|
| night-call | 4 | "An open line, and the caller is Allah Himself." | Newcomer clarity in one hearing - the hadith invites the servant to call, so a first-time listener may read "caller" as the servant, not Allah; the inversion can land as a stumble. LOW severity, does not block. | "An open line, and the One reaching out is Allah Himself." |

---

## ocean-of-sins.json - VERDICT: REVISE (1 blocking)

Strong hook and a genuinely actionable payoff (say it 100x in a day). The problem
is the title beat: the spoken transliteration sits flush at the very end of the
segment, so the ElevenLabs tail can clip the final word - exactly the failure the
standing rule about a trailing ellipsis/word exists to prevent.

| script | beat | offending line (verbatim) | rule | proposed rewrite |
|---|---|---|---|---|
| ocean-of-sins | 2 | "The words are: Subhaan Allahi wa bihamdih." | Spoken transliterated Arabic must never sit FLUSH at the end of a segment (needs a trailing word/ellipsis so the TTS tail does not clip). BLOCKING. | "The words are these. Subhaan Allahi wa bihamdih... just four of them." (adds an English tail after the phrase; also drops the "The words are:" colon) |

Note (not a separate flag): beat 2 is the caption-suppressed title card, so the
"The words are:" colon does not render on screen; the rewrite removes it anyway
as a bonus. beat 6 and beat 8 handle the same phrase correctly (trailing ellipsis
before continuing), so no change needed there.

---

## light-heavy.json - VERDICT: PASS

Hook opens the loop ("so light ... heavier than mountains"). Both dhikr phrases
appear with the Arabic followed IN-SEGMENT by its English gloss (beats 4-5) and
the button (beat 8) trails each phrase with more narration - no flush end
anywhere. Cadence clean, no chained ellipses, no all-caps in narration. Button is
reflective and actionable ("Two lines, under your breath, all day"). Payoff clear.
No beat over ~40 words. No stumbles.

---

## last-night.json - VERDICT: PASS

Hook opens a strong loop (lie down "as if they might not" wake). "small death",
wudu, and fitrah are each defined at first use - newcomer-clear. Beats connect
causally (First ... Then ... And here is the promise ... Then he added). The dua
is spoken as English translation (not transliterated), so no flush concern. Button
is concrete: wudu, right side, dua as your last words. No beat over ~45 words. No
all-caps, no colons of concern. Clean.

---

## angel-ameen.json - VERDICT: PASS (1 minor note)

Hook opens the loop ("a guaranteed Ameen ... from an angel"). Condition ("in his
absence") is stated and then unpacked. Button is actionable ("Bring one person to
mind ... Ask Allah to give them what you would want for yourself"). Payoff clear.

| script | beat | offending line (verbatim) | rule | proposed rewrite |
|---|---|---|---|---|
| angel-ameen | 6 | "the angel says: Ameen. And may you have the same." | Sentence is split across beats 5-6, so beat 6 opens lowercase and mid-thought. Reads fine aloud (beat 5 ends on a trailing ellipsis that bridges), but as a standalone caption line it starts mid-sentence. LOW severity, does not block. | Optional: fold the subject in so the beat stands on its own - "And the angel says, Ameen. And may you have the same." (the "says:" quotation colon itself matches the accepted khadijah "said:" pattern and is not the flag) |

---

## friday-hour.json - VERDICT: PASS

Hook opens the loop ("one hour ... He will not refuse ... most people let it
pass"). Friday is contextualized for a newcomer ("the greatest day of the week ...
the day of the Friday prayer"). The hidden-timing point is explained by analogy to
Laylat al-Qadr. Button is concrete and actionable ("this Friday ... In that last
hour ... bring the thing you have been asking for"). No beat over ~35 words. No
all-caps, no chained ellipses. Clean.

---

## fajr-protection.json - VERDICT: PASS (1 minor note)

Hook opens the loop ("a contract you can sign before the sun even rises"). Fajr
named and defined. Button is concrete ("set the alarm tonight ... Get up, make
wudu, and pray it"). Payoff clear.

| script | beat | offending line (verbatim) | rule | proposed rewrite |
|---|---|---|---|---|
| fajr-protection | 6 | "whoever prays the night prayer in congregation, it is as if he prayed half the night." | Newcomer clarity - "the night prayer" is not named (it is Isha); a first-time viewer may not know which prayer is meant. Understandable from context, so LOW severity, does not block. | "whoever prays the night prayer, Isha, in congregation, it is as if he prayed half the night." |

---

## two-verses.json - VERDICT: PASS

Hook opens a deliberate loop and names it ("He did not finish the sentence. Enough
for what?"), paid off in beat 7. al-Baqarah introduced as "the longest chapter".
The ayat are SHOWN via quote (2:285 / 2:286) with spoken English translation, never
recited in Arabic - consistent with the template; no flush/transliteration concern.
Button is actionable ("before you close your eyes, read these two verses"). No beat
over ~40 words. Clean.

---

## three-deeds.json - VERDICT: PASS

Hook opens the loop ("your book of deeds closes ... Except for three things"). The
three are laid out in clean parallel (The first ... The second ... The third),
each a single internal pause, not a chained stop-start. sadaqah jariyah is rendered
in plain English ("an ongoing charity ... keeps giving"). The bonus "fourth door"
is causally introduced. Button is reflective AND actionable ("What have I planted
... plant one thing this week"). Longest beat (beat 8) is ~43 words, under the flag
line. Clean.

---

## moving-branch.json - VERDICT: PASS

Hook opens the loop ("forgiven all of his sins ... for one small thing"). The story
front-loads its result then retells it in full - the loop-then-tell shape, matches
the template. Newcomer-clear throughout. Button is vivid and actionable, extending
the lesson to the viewer's day ("The glass on the pavement. The bag someone
dropped. The branch across the path. Move it, for the strangers behind you"). No
beat over ~40 words. No all-caps, no chained ellipses. Clean.

---

## Summary of required action before render
- ocean-of-sins beat 2: apply the flush-end fix (BLOCKING).
- night-call beat 4, angel-ameen beat 6, fajr-protection beat 6: optional LOW
  polish, not gating.
