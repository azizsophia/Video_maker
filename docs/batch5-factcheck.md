# Batch 5 - independent adversarial fact-check (2026-07-10)

Reviewer: independent pass, did NOT write these scripts. Standard applied: every
claim traceable to the hadith number in its `foot`; sahih-only; exact collection +
number + speaker; Qur'an wording faithful to Saheeh International; honorific
"peace be upon him" at first mention of the Prophet; no self-praise; no date-setting.

Method: cross-checked every claim against docs/batch5-research.md (the pre-verified
source table). Items not fully pinned by that table were re-verified live:
Bukhari 1145 (order/wording of the three questions), Muslim 657 (dhimmah wording +
whether it is time-bound), Muslim 656 (Isha/Fajr congregation reward wording),
Muslim 2733 (angel "and for you the same"). api.sunnah.com returns 403 to WebFetch
here; used WebSearch + islamqa.info + hadeethenc + abuaminaelias for the live checks.

---

## Summary table

| # | Script | Verdict |
|---|--------|---------|
| 1 | night-call.json | PASS |
| 2 | ocean-of-sins.json | PASS |
| 3 | light-heavy.json | PASS |
| 4 | last-night.json | PASS |
| 5 | angel-ameen.json | PASS |
| 6 | friday-hour.json | PASS |
| 7 | fajr-protection.json | 2 FLAGS (both wording-precision on Muslim 657 / 656) |
| 8 | two-verses.json | PASS |
| 9 | three-deeds.json | PASS |
| 10 | moving-branch.json | PASS |

Total flags: 2, both in fajr-protection.json. No fabrications, no weak-narration
builds, no misattributions of collection/number, no honorific misses, no self-praise,
no date-setting. Both flags are wording-precision (a time clause and a linking word)
and are fixable with a light edit; neither changes which hadith is cited or the
magnitude of the reward.

---

## 1. night-call.json - VERDICT: PASS
- Bukhari 1145 confirmed live. Order of the three questions in the hadith is
  (1) "Who is calling upon Me that I may answer him," (2) "Who is asking of Me that
  I may give him," (3) "Who is seeking My forgiveness that I may forgive him."
  Script beats 4/5/6 reproduce that exact order and sense. Correct.
- "descends to the lowest heaven ... in a manner that befits Him" - the tanzih
  qualifier ("in a manner that befits Him") is a sound, standard adab addition, not
  a claim; keeps the descent free of anthropomorphism. Good.
- Honorific present at first mention of the Prophet (beat 2). No self-reference.

## 2. ocean-of-sins.json - VERDICT: PASS
- Bukhari 6405 + Muslim 2691 = the "SubhanAllahi wa bihamdih 100x -> sins forgiven
  even if like the foam of the sea" hadith. Confirmed in research table (lines 16-17).
- Dhikr transliteration "Subhaan Allahi wa bihamdih" is the CORRECT phrase for
  6405/2691 (the wa-bihamdih / foam hadith). Not swapped. Correct.
- Beat 6 foot "meaning of the dhikr" - honestly labels the gloss ("far above every
  flaw ... joined to His praise") as meaning, not as hadith text. Good.
- Honorific present (beat 3).

## 3. light-heavy.json - VERDICT: PASS
- Bukhari 6682 + Muslim 2694 = "two words light on the tongue, heavy on the scale,
  beloved to ar-Rahman: SubhanAllahi wa bihamdih, SubhanAllah al-Azim." Confirmed
  (research lines 12-14).
- BOTH phrases present and in the correct pairing: beat 4 "Subhaan Allahi wa bihamdih"
  and beat 5 "Subhaan Allah al-Azeem," both footed to Bukhari 6682, which contains
  both. The two dhikr are NOT swapped between the 6405 and 6682 scripts. Correct.
- "beloved to the Most Merciful" / "called them a treasure" both in the hadith. Good.
- Honorific present (beat 2).

## 4. last-night.json - VERDICT: PASS
- Bukhari 247 = wudu before sleep, lie on the right side, the tafweed dua, "if you
  die you die upon the fitrah," "make them your last words." Confirmed (research 45-47).
- Tafweed dua paraphrase ("I submit my soul to You ... turn my face to You ...
  entrust my affair to You ... out of hope in You and fear of You") is faithful to
  the Bara' ibn Azib wording (aslamtu nafsi / wajjahtu wajhi / fawwadtu amri /
  raghbatan wa rahbatan). Correct.
- "dust off your bed before you lie down" is the Abu Hurayrah sunnah (Bukhari 6320);
  beats 2 and 4 dual-cite 247 + 6320, so the dusting instruction is sourced to the
  right hadith. Correct separation.
- Honorific present at first Prophet mention (beat 1).

## 5. angel-ameen.json - VERDICT: PASS
- Muslim 2733 = the dua for a Muslim brother in his absence is answered; at his head
  an appointed angel says "Ameen, and for you the same (wa laka bi-mithl)." Confirmed
  (research 39-40; re-checked, matches hadeethenc 3219).
- Script's "the angel says: Ameen. And may you have the same" is a faithful rendering.
  The condition ("in his absence") is stated correctly and not overstated. Correct.
- Honorific present (beat 3).

## 6. friday-hour.json - VERDICT: PASS
- Bukhari 935 + Muslim 852 = the Friday hour; "if a Muslim is standing in prayer and
  asks Allah for something, Allah will give it to him"; the Prophet "indicated its
  shortness with his hand." Confirmed (research 55-57). Script beats 3-4 match,
  including the hand gesture for shortness. Correct.
- CRITICAL adab check on beat 7: the "last hour before sunset" timing is footed
  "seerah / the scholars, on the strongest reported time" and narrated as
  "the scholars pointed to the strongest window" - i.e. explicitly framed as
  scholarly opinion, NOT put in the Prophet's mouth. This is the honest framing the
  brief required. PASS on that point.
- "asking Allah for something good" - the word "good" is a harmless clarifying add
  over the bare "yas'alu Allaha shay'an"; does not change the meaning. Acceptable.
- Honorific present (beat 2).

## 7. fajr-protection.json - VERDICT: 2 FLAGS (fixable, wording-precision)

| beat | claim | problem | fix |
|------|-------|---------|-----|
| beat 3 (seg 19) + cover/caption/title premise | Direct quote: "The Prophet ... said: whoever prays the dawn prayer is under the protection of Allah **for the rest of that day**." Footed Sahih Muslim 657. | The literal Muslim 657 (Jundub) wording is only "Whoever prays Fajr is under the protection (dhimmah) of Allah, so do not fall short in Allah's right." The time-bound clause "for the rest of that day / until evening" is NOT in Muslim 657 - it is a **separate al-Tabarani narration** (grading contested) and a scholarly reading of dhimmah. As written, a time clause that is not in the cited hadith is embedded inside what reads as the verbatim Muslim 657 quote. | End the Muslim-657 direct quote at "...under the protection of Allah." Carry the "whole day / until sunset" idea in the surrounding narration as the *meaning* of being in Allah's dhimmah (or note it is reinforced by a further narration), not as Muslim 657's own words. The video's premise still stands - protection through the day is the accepted sense of the hadith - it just should not be quoted as Muslim 657's text. |
| beat 6 (seg 22) | "whoever prays the night prayer in congregation ... half the night. And whoever prays the dawn prayer **too** ... the whole night through." Footed Sahih Muslim 656. | Muslim 656 (Uthman) literally reads: "He who prayed Isha in congregation, it is as if he prayed half the night; and he who prayed Fajr in congregation, it is as if he prayed **the whole night**" - i.e. Fajr in congregation *on its own* equals the whole night. The word "too" nudges the viewer toward a cumulative "Isha PLUS Fajr = whole night" reading, which is the wording of **Tirmidhi 221**, not Muslim 656. Minor, because the cumulative reading has its own sahih basis and the reward magnitude is stated correctly. | Optional but cleaner: drop "too" - "and whoever prays the dawn prayer in congregation, it is as if he prayed the whole night" - so the sentence matches Muslim 656's literal wording. |

Notes: honorifics present (beats 2, 3, 6); no self-praise; the reward magnitude and
the hadith numbers are correct; the flags are precision-of-wording only.

## 8. two-verses.json - VERDICT: PASS
- Bukhari 5009 + Muslim 807 = "whoever recites the last two verses of al-Baqarah at
  night, they will suffice him." Confirmed (research 31-32). The deliberate
  unfinished hook ("enough for what?") is faithful to the hadith, which does leave
  "suffice" open. Correct.
- quote "2:285" paraphrase ("The Messenger has believed ... and the believers. Each
  believes in Allah, His angels, His books, and His messengers") is faithful to
  Saheeh International 2:285. Reference correct.
- quote "2:286" paraphrases across beats 5-6 ("do not hold us to account if we forget
  or err ... do not burden us beyond what we can bear ... Pardon us. Forgive us. Have
  mercy on us. You are our protector, so give us victory") track Saheeh International
  2:286 closely and in order. Reference correct. Qur'an is shown (`quote`), not
  recited, per the standing rule.
- beat 7 "the scholars offered several answers ... The Prophet left it open" is footed
  "seerah / the scholars, on the meaning of 'suffice'" and narrated as scholarly
  interpretation, not as prophetic text. Honest framing. PASS.

## 9. three-deeds.json - VERDICT: PASS
- Muslim 1631 = "when a man dies his deeds end except three: ongoing charity (sadaqah
  jariyah), beneficial knowledge, a righteous child who prays for him." Confirmed
  (research 64). All three named exactly and in order. Correct.
- beat 7 "the fourth door": Muslim 1893 = "whoever guides to good has a reward like
  the one who does it." Confirmed (research 65-66). Footed to Muslim 1893, framed as
  a related principle, not folded into the "three." Correct.
- "well that still gives water / tree that still gives fruit" are standard, accurate
  illustrations of sadaqah jariyah, not extra claims. Honorific present (beat 2).

## 10. moving-branch.json - VERDICT: PASS
- Muslim 1914 = a man moved a thorny branch from the road; "Allah appreciated
  (thanked) it from him and forgave him." Confirmed (research 70-72). Script beats
  1/3/6 match, including "thorny branch" and the exact "appreciated it ... and
  forgave him." Correct.
- beat 7: Muslim 553 = removing harm from the road is among the best/good deeds of
  the ummah. Confirmed (research 71-72). Footed to Muslim 553, correctly distinct
  from the 1914 story. Correct.
- "He weighs the heart that did it" (beat 6) is reflective framing, not a sourced
  claim - acceptable as commentary. Honorific present at first mention (beat 1).

---

## Cross-cutting checks (all 10)
- HONORIFICS: "peace be upon him" appears at the first mention of the Prophet in
  every script. PASS.
- NO SELF-PRAISE / no "we checked" / no channel self-reference in any narration. PASS.
- NO DATE-SETTING. PASS.
- DHIKR NOT SWAPPED: 6405/2691 script uses "Subhaan Allahi wa bihamdih"; 6682/2694
  script uses both "Subhaan Allahi wa bihamdih" and "Subhaan Allah al-Azeem." Correct
  pairing in both. PASS.
- SCHOLARLY-OPINION LABELING: friday-hour (last hour), two-verses (meaning of
  suffice), and the dhikr-meaning glosses are all footed as scholars'/meaning, never
  as hadith text. PASS.
- QUR'AN shown not recited (two-verses uses `quote`). PASS.

## Recommendation
Nine scripts clear the accuracy gate as-is. fajr-protection.json should get the
beat-3 edit (do not quote "for the rest of that day" as Muslim 657's words; carry
the whole-day meaning as the sense of dhimmah / a supporting narration) and,
preferably, the beat-6 "too" tweak, then re-check the single edited line. No other
script requires changes.
