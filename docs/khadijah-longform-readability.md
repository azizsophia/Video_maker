# Read-It-Aloud Pass: longform-khadijah.json

VERDICT: 10 findings (7 prose fixes recommended before voicing, 3 minor/optional). No blocking structural failure; runtime bar passed.

- Script: /home/user/Video_maker/scripts/stories/longform-khadijah.json (32 beats)
- Reviewer: independent pass; did not write the script. Prose-only findings; no fact, name, date, number, citation, or quoted-verse meaning altered by any proposal.
- Narration word count: 1,472 words
- Estimated runtime: 1472 / 140 wpm = 10.5 minutes - PASSES the 8-minute long-form minimum with margin.
- All-caps check: no all-caps emphasis words in any narration text. "KHADIJAH" (title-card field) and "THE FIRST BELIEVER" (cover kicker) are display fields, not narration captions - allowed per the Khadijah template.
- Emoji / dash check: no emojis, no em or en dashes anywhere in narration, footers, or captions. Clean.
- POV check: no third-person-to-first-person narrator slips. All first-person lines are marked dialogue (he said / she said / Jibril said), which is allowed.
- Tofu risk: narration contains no Arabic script. The two `quote` beats (96:1, 108:1) pull Arabic from Quran.com at render time - the standard render-output QC still must confirm no glyph boxes on those two ayat.

## Findings by beat

### Beat 3 - chained-ellipsis nested aside (blocking-level cadence failure)
Line: "Caravans of camels came and went... to Sham... greater Syria... in the north, to Yemen in the south... carrying spice, cloth and silver."
Why it fails: five ellipses in one beat, and "to Sham... greater Syria... in the north" is exactly the banned pattern - a definition wedged mid-sentence between ellipses, producing a halting stop-start rhythm ("the shortest surah... that is, chapter..." failure mode). Hard to follow in one hearing.
Proposed rewrite (same meaning, same sources, same length):
"Caravans of camels came and went... north to Sham, the region of greater Syria, and south to Yemen, carrying spice, cloth and silver. And in this city of merchants, where men held the wealth and men held the power... one of the most successful merchants was a woman."

### Beat 9 - ambiguous antecedent on one hearing (minor)
Line: "would call him abtar. Cut off. A man whose name would die with him."
Why it fails: newcomer-clarity. On one hearing, "A man whose name would die with him" can attach to the mocker ("a man of Makkah") rather than serve as the definition of abtar aimed at her husband.
Proposed rewrite: "would call him abtar... cut off. A man with no sons. A man whose name would die with him."
(One extra four-word fragment locks the meaning; beat stays ~10-15s.)

### Beat 12 - ambiguous pronoun (minor)
Line: "the silence of the cave broke. An angel filled it."
Why it fails: grammatical-when-spoken / one-hearing clarity. "It" grammatically points at "the silence"; the intended image is the cave.
Proposed rewrite: "the silence of the cave broke. An angel filled the small space."
(Or simply "An angel filled the cave." - same length.)

### Beat 16 - stumble at the pause: "by Allah, Allah" (recommended fix)
Line: "Never... by Allah, Allah will never disgrace you."
Why it fails: read aloud, the pause lands before "by Allah" and then "Allah, Allah" butt together - the TTS will read it like a stutter. The hadith wording is preserved by moving the breath, not the words.
Proposed rewrite: "Never, by Allah... Allah will never disgrace you."

### Beat 19 - cadence: four ellipses, speech-tag interruption (minor / optional)
Line: "This, he said... is the same angel that Allah sent down to Musa... to Moses."
Why it fails: borderline chained-ellipsis; "This, he said... is" splits a five-word clause around an interpolation, and the beat already carries two earlier ellipses. Followable, but the densest pause-cluster in the script after beat 3.
Proposed rewrite: "He answered at once. This, he said, is the same angel that Allah sent down to Musa... to Moses."
(Speech tag kept, set off by commas instead of an ellipsis; the Musa/Moses apposition is fine and stays.)

### Beat 23 - nested aside interrupting subject and verb (recommended fix)
Line: "Her fortune... the caravans, the silver, the ease... was spent down to nothing for this message."
Why it fails: an ellipsis-bracketed list interrupts the thought between subject ("Her fortune") and verb ("was spent") - the banned interrupting-nested-aside pattern. The listener holds the subject for nine words.
Proposed rewrite: "Her fortune was spent down to nothing for this message... the caravans, the silver, the ease. All of it."

### Beat 24 - chained ellipses at the tail (recommended fix)
Line: "...a house in Paradise, built of hollowed pearl... where there is no noise... and no weariness."
Why it fails: two ellipses in the final nine words create the stop-start rhythm; the quote's gravity survives on commas.
Proposed rewrite: "And give her glad tidings of a house in Paradise, built of hollowed pearl... where there is no noise, and no weariness."
(Beat has five ellipses total; this trim brings the worst cluster in line while keeping the dramatic pause before the description.)

### Beat 26 - muddled apposition: "the scholars... the seerah" (recommended fix)
Line: "The scholars who recorded his life... the seerah... gave that year a name."
Why it fails: two rules. (1) Interrupting nested aside between subject and verb. (2) Newcomer accuracy of the definition as heard: the apposition equates "the seerah" with "the scholars," but the seerah is the record, not the people. A newcomer learns the term wrong on first use.
Proposed rewrite: "The scholars who wrote the story of his life, a record called the seerah, gave that year a name. Aam al-Huzn. The Year of Sorrow."

### Beat 28 - newcomer gap: Madinah appears with no bridge (recommended fix)
Line: "Years later in Madinah, married again... he would slaughter a sheep, and quietly send portions to Khadijah's old friends."
Why it fails: newcomer-clear / causal connection. The story buries Khadijah in Makkah, then jumps to Madinah without ever saying he left. Waraqah's warning ("Your people will drive you out," beat 20) sets this up and is never paid off - one clause closes both gaps.
Proposed rewrite: "Years later... after his people had driven him out, just as Waraqah warned, he lived in the city of Madinah, married again. He would slaughter a sheep, and quietly send portions to Khadijah's old friends."
(Adds ~9 words; beat stays inside ~15s.)

### Beat 30 - tense wobble mid-quote (minor)
Line: "The best of the women of her time was Maryam, the mother of Isa... Mary, the mother of Jesus... and the best of the women of her time is Khadijah."
Why it fails: grammatical-when-spoken - the was/is switch inside one parallel sentence sounds like a narrator error on first hearing. Normalizing the tense changes no meaning of the hadith (Sahih al-Bukhari 3432).
Proposed rewrite: "The best of the women of her time was Maryam, the mother of Isa... Mary, the mother of Jesus. And the best of the women of her time was Khadijah."

## Spoken transliterated Arabic - not on the approved ear-tested list

The locked list covers: Khadijah, Aisha, Waraqah, Jibril, Musa, Read ("reed"), Isa, Qasim, Sham, wahy, istighfar, plus the rest of the week-batch set. Quraysh has an established respelling ("Koo-raysh") per the qaf rule. The following spoken terms/names in this script are NOT on the locked list and must get MSA respellings in the PHONETIC map plus the independent pronunciation audit and a names-only ear-test before render:

- Beat 4: Khuwaylid; at-Tahirah
- Beat 5: al-Amin; Muhammad (recurring - confirm it is already in the map, do not assume)
- Beat 6: Maysarah
- Beat 8: Zaynab, Ruqayyah, Umm Kulthum, Fatimah, Abdullah
- Beat 9: abtar
- Beat 10: Hira
- Beat 12: Ramadan
- Beat 26: Abu Talib; Aam al-Huzn; seerah
- Beat 30: Maryam
- Recurring place names throughout: Makkah, Ka'bah, Madinah, Allah (mandated for the map per CLAUDE.md; confirm entries exist rather than assuming)

Segment-end rule check: no spoken Arabic sits flush at the end of any segment (beat 26's "Aam al-Huzn" is followed by its English translation; beat 31 ends on the English honorific). No trailing-ellipsis guard needed.

## What passes cleanly

Beats 0-2, 5-8, 10-11, 13-15, 17-18, 20-22, 25, 27, 29, 31 read fluently in one hearing: hooks front-loaded, every person introduced at first appearance (Khadijah, Muhammad, Maysarah, Jibril, Waraqah, Abu Talib, Aisha), every Arabic term translated on first use except the beat-26 seerah muddle noted above, causal connectors throughout (so, then, but, and with that, now return), and the title beat carries the deep-read voiceSettings override per the template. The reflective close (beat 31) lands without a corny CTA.

## Summary

| Beat | Severity | Issue |
|---|---|---|
| 3 | High | Chained-ellipsis nested aside (Sham definition) |
| 9 | Minor | Ambiguous "A man whose name would die with him" |
| 12 | Minor | Ambiguous "filled it" |
| 16 | Recommended | "by Allah, Allah" stutter at the pause |
| 19 | Optional | Dense pause cluster, split clause |
| 23 | Recommended | Aside interrupts subject/verb |
| 24 | Recommended | Chained ellipses at quote tail |
| 26 | Recommended | seerah apposition heard wrong + aside |
| 28 | Recommended | Makkah-to-Madinah jump unexplained |
| 30 | Minor | was/is tense wobble in hadith line |

Word count 1,472; estimated runtime 10.5 minutes (>= 8:00 required) - length bar PASSED.
