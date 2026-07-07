# Batch 4 - Independent READ-IT-ALOUD Pass (2026-07-07)

Independent readability review of the 10 new shorts in scripts/stories/. Reviewer did
not write the scripts. Judged against CLAUDE.md: flowing cadence, no chained-ellipsis
stop-start, grammatical when spoken, no POV jumps, newcomer-clear in one hearing, no
all-caps emphasis in narration, no em/en dashes or emojis, beats ~10-15s (~25-40 words,
flagged above ~45), verbatim word-by-word caption sanity, hook opens a loop, reflective
button, spoken transliterated Arabic opt-in only.

Beat numbers are 1-based positions in the segments array (beat 2 is the title card).
Word counts are narration words; ~150 wpm spoken.

## Batch-wide checks (all 10 scripts)

- All-caps emphasis in narration: NONE found (title/titleSub/cover kickers are display
  fields, exempt). PASS.
- Em dashes / en dashes / emojis: NONE found in narration or captions. PASS.
- Hooks: every script opens a loop in beat 1. PASS.
- Buttons: every closing beat is reflective and sourced; no corny CTA. PASS.
- Spoken Arabic beyond the locked/mapped list: two flags, listed under their scripts
  (sirat-bridge "Abu", skin-witness "Abdullah ibn Mas'ud"). Dabbat al-Ard appears only
  on the title card in beast-that-speaks, never narrated - correct usage.
- Estimated narration runtimes: 119s-163s. cave-boulder is the longest (408 words,
  ~163s) and carries most of the over-long beats.

Severity: FIX = must change before voicing. MINOR = recommended polish. VERIFY = check
against the PHONETIC map / ear-test, no text change needed.

---

## sirat-bridge.json - VERDICT: PASS WITH FIXES (2 fixes, 1 verify)

1. sirat-bridge | beat 4 | "One of the men who learned this teaching, the companion Abu Sa'id, said that word reached him... that the bridge is thinner than a hair, and sharper than a sword." | FIX - nested apposition interrupts subject and verb, and "said that word reached him... that" double-"that" around the ellipsis is a stumble in one hearing. | Rewrite: "The companion Abu Sa'id, one of the men who learned this teaching, said word reached him that the bridge is thinner than a hair... and sharper than a sword."

2. sirat-bridge | beat 7 | "And the Qur'an describes a light on that Day, running ahead of the believers... while the hypocrites are told to turn back and look for light, and a wall is placed between them. Commentators connect that scene to this crossing... light for some, darkness for others." | FIX - 46 words, runs ~18s; the closing tag repeats what the beat already said. | Rewrite (40 words): "And the Qur'an describes a light on that Day, running ahead of the believers... while the hypocrites are told to turn back and look for light... and a wall closes between them. Commentators connect that scene to this crossing."

3. sirat-bridge | beat 4 | "the companion Abu Sa'id" | VERIFY - "Sa'id" is locked, but "Abu" is not on this batch's locked list and Daniel's default is "uh-BOO" (the exact mangling CLAUDE.md warns about). Confirm "Abu" has an MSA respelling in the PHONETIC map and ear-test before render. | No text change.

## sun-from-west.json - VERDICT: PASS WITH FIXES (3 fixes)

1. sun-from-west | beat 7 | "The Day that some of the signs of your Lord will come, no soul will benefit from its faith... as long as it had not believed before, or had earned through its faith some good." | FIX - 46 words, and the inverted translation syntax ("had earned through its faith some good") is not followable in one hearing. The verse is shown on screen (quote 6:158), so the narration can carry a smoother rendering. | Rewrite: "But listen to what the Qur'an says about that exact moment. On the Day some of the signs of your Lord arrive, believing will no longer help a soul... if it had not believed before, or earned some good through its faith."

2. sun-from-west | beat 9 | "A faith that never earned anything... never moved a hand, never gave, never prayed... that soul, too, gains nothing from that morning." | FIX - subject switch mid-sentence: the sentence sets up "a faith" and resolves on "that soul"; ungrammatical when spoken. | Rewrite: "A soul whose faith never earned anything... never moved a hand, never gave, never prayed... that soul, too, gains nothing from that morning."

3. sun-from-west | beat 10 | "And one dawn, mid-sky, mid-sentence... it will not be." | MINOR - "mid-sky" does not fit "dawn" and confuses the image in one hearing. | Rewrite: "And one dawn, mid-plan, mid-sentence... it will not be."

## first-night-grave.json - VERDICT: PASS WITH FIXES (4 fixes)

1. first-night-grave | beat 5 | "The believer answers plainly. I testify that he is the servant of Allah, and His messenger. And then something extraordinary is said. Look at your place in the Fire... Allah has exchanged it for a place in Paradise. And the Prophet said... they will see both." | FIX - 46 words; "And then something extraordinary is said" is a passive filler line that pads the beat. | Rewrite (41 words): "The believer answers plainly. I testify that he is the servant of Allah, and His messenger. Then he is told... look at your place in the Fire... Allah has exchanged it for a place in Paradise. And they will see both."

2. first-night-grave | beat 6 | "A longer account adds three questions. Who is your Lord. What is your religion. Who is this man. And when the believer answers, a caller cries out from heaven... My servant has spoken the truth. So spread for him a bed from Paradise... and open for him a door to Paradise." | FIX - 51 words, runs ~20s. | Rewrite (44 words): "A longer account adds three questions. Who is your Lord. What is your religion. Who is this man. When the believer answers, a caller cries from heaven... My servant has spoken the truth. Spread for him a bed from Paradise... and open him a door to it."

3. first-night-grave | beat 8 | "Only the narrowing... and a blow whose cry is heard by every creature nearby, except humans and jinn." | FIX - grammar when spoken: a blow does not have a cry; the buried person cries out from the blow. Beat is also 49 words. | Rewrite of the full beat (43 words): "But the one who never really believed answers differently. I do not know... I used to say whatever the people used to say. For him, only the narrowing... and a blow that makes him cry out, heard by every creature nearby except humans and jinn."

4. first-night-grave | beat 10 | "the strange mercy of it is that the exam is open book... every answer is being written by the way you live today." | FIX - mixed metaphor: "open book" means you may consult sources during the exam, but the point is that the questions are known in advance and the answers are pre-written by your life. Confusing in one hearing. | Rewrite: "One night. A few questions. And the strange mercy of it is that the questions are known in advance... every answer is being written by the way you live today."

## skin-witness.json - VERDICT: PASS WITH FIXES (3 fixes, 1 verify)

1. skin-witness | beat 6 | "Another verse paints it even more starkly. That Day, We will seal over their mouths... and their hands will speak to Us, and their feet will testify about what they used to earn. The mouth that argued all its life... finally silent. The body, finally honest." | FIX - 46 words, runs ~18s. | Rewrite (41 words): "Another verse paints it even more starkly. That Day, We will seal over their mouths... and their hands will speak to Us, and their feet will testify. The mouth that argued all its life... finally silent. The body, finally honest."

2. skin-witness | beat 7 | "Three men were sitting by the Ka'bah, the sacred house in Makkah... heavy of body, he said, and light of understanding." | FIX - the trailing description floats without an anchor after the ellipsis, and the inserted "he said" interrupts it; a listener loses who "heavy of body" describes. | Rewrite: "Three men were sitting by the Ka'bah, the sacred house in Makkah... men he described as heavy of body, and light of understanding."

3. skin-witness | beat 8 | "Another answered: He hears us if we speak loudly... but not if we whisper." | MINOR - the colon renders verbatim in the word-by-word caption ("answered:") and is inconsistent with the house ellipsis style used everywhere else in the batch. | Rewrite: "Another answered... He hears us if we speak loudly, but not if we whisper."

4. skin-witness | beat 7 | "Abdullah ibn Mas'ud" | VERIFY - spoken name not on this batch's locked list. CLAUDE.md names it among recurring companion names that must carry an MSA respelling in the PHONETIC map; confirm the mapping and include in the names-only ear-test before render. | No text change.

## seven-shade.json - VERDICT: PASS WITH MINOR FIXES (1 fix, 2 minor)

1. seven-shade | beat 6 | "No profit in it, no status. Just love with a pure address." | FIX - "a pure address" (love addressed to Allah) is not decodable in one hearing; reads as a street address on the caption. | Rewrite: "No profit in it, no status. Just love, with no motive but Him."

2. seven-shade | beat 1 | "the sun will be brought close... until it hangs, in the hadith's own words, a mile overhead." | MINOR - the aside "in the hadith's own words" splits the verb from its complement mid-flow. | Rewrite: "the sun will be brought close... until, in the hadith's own words, it hangs a mile overhead."

3. seven-shade | beat 4 | "Youth spent on devotion, not burned and regretted." | MINOR - "burned" as squandered is a slight stumble on first hearing. | Rewrite: "Youth spent on devotion, not wasted and regretted."

## killed-ninety-nine.json - VERDICT: PASS WITH FIXES (2 fixes)

1. killed-ninety-nine | beat 7 | "So the man set out. And halfway down that road... death came for him. He had reached nothing. No new town, no worship, not a single good deed written down... except a direction. And as he died, he turned his chest toward the town he was trying to reach." | FIX - 49 words, and "He had reached nothing" is an odd construction spoken (reached no destination is meant, but "reached nothing" lands as a dead phrase). | Rewrite (44 words): "So the man set out. And halfway down that road... death came for him. No new town, no worship, not one good deed written down... except a direction. As he died, he turned his chest toward the town he was trying to reach."

2. killed-ninety-nine | beat 8 | "Then, above his body, the angels of mercy and the angels of punishment... argued. He came repenting, said one side. He never did a single good thing, said the other. And an angel was sent in human form to judge between them. He said... measure the ground between the two lands." | FIX - 51 words, runs ~20s. | Rewrite (44 words): "Then the angels of mercy and the angels of punishment argued over him. He came repenting, said one side. He never did one good thing, said the other. So an angel in human form was sent to judge... measure the ground between the two lands."

Note: beat 9 is 45 words - borderline but acceptable; keep pacing tight in the read.

## cave-boulder.json - VERDICT: NEEDS REWRITE (6 fixes; heaviest script in the batch)

Runtime note: 408 narration words (~163s spoken), with five beats at or over ~48 words.
The story does not need cutting - it needs redistributing. Recommend trimming per below
and, for beats 7 and 8, considering a split into two beats each (each half is its own
visual moment), which would also restore the ~10-15s beat rhythm.

1. cave-boulder | beat 4 | "The first man spoke of his mother and father, grown old. Every night he brought them milk before anyone else... before his own children. One evening they were asleep, and he would not wake them, and would not serve anyone first. So he stood... the bowl in his hand... until dawn." | FIX - 51 words. "would not serve anyone first" repeats what "before anyone else" already established. | Rewrite (44 words): "The first man spoke of his mother and father, grown old. Every night he brought them milk before anyone else... before his own children. One evening they were asleep, and he would not wake them. So he stood... the bowl in his hand... until dawn."

2. cave-boulder | beat 6 | "The second man had loved his cousin... the deepest love a man can have for a woman, he said. She refused him. Then came a year of famine, and she had nothing. He offered her a hundred and twenty gold coins... for a night. And she, desperate, agreed." | FIX - 48 words. | Rewrite (44 words): "The second man had loved his cousin... the deepest love a man can have for a woman. She refused him. Then came a year of famine, and she had nothing. He offered a hundred and twenty gold coins... for a night. Desperate, she agreed."

3. cave-boulder | beat 7 | "she said... it is not lawful for you to break the seal, except by its right." | FIX - the hadith's euphemism is opaque to a newcomer in one hearing; "break the seal" reads as a riddle on the caption. | Rewrite preserving the meaning: "she said... fear Allah. This is not lawful for you, except by right of marriage."

4. cave-boulder | beat 7 | full beat | FIX - 62 words, the longest beat in the batch (~25s spoken); one clip cannot hold sync across it. | Trimmed rewrite (with item 3 applied, ~50 words): "But when he sat before her, she said... fear Allah. This is not lawful for you, except by right of marriage. And he stood up and walked away from the woman he loved most... and left her the gold. O Allah, if I did that seeking Your face... relieve us. The rock moved again. Still not enough." Still ~20s - preferred fix is splitting after "...left her the gold." into its own beat (refusal clip / dua-and-rock clip), mirroring the structure of beats 4-5.

5. cave-boulder | beat 8 | "the man pointed at the herds filling the valley. All of it is yours. And he drove every animal away, and left nothing." | FIX - 60 words total, and the closing "he" is ambiguous: it reads as the employer driving the animals away, but in the hadith it is the laborer who takes everything. | Rewrite (54 words, ambiguity fixed): "The third man had once hired a laborer who left before taking his wage. So he invested it... for years... until it grew into camels, cows and sheep. When the laborer finally returned, the man pointed at the herds. All of it is yours. And the laborer drove every animal away... and left nothing." Still long; same split recommendation as beat 7 if timing drifts.

6. cave-boulder | beat 10 | "Notice what unlocked the mountain. Not their prayers in public. Three private moments... a bowl held till dawn, a desire refused, a debt honored beyond reason. Somewhere in your past there may be a deed like that. Guard it. One day it may be the only key you have." | FIX - 49 words for a button beat. | Rewrite (45 words): "Notice what unlocked the mountain. Not their prayers in public. Three private moments... a bowl held till dawn, a desire refused, a debt honored beyond reason. You may have a deed like that. Guard it. One day it may be the only key you have."

## beast-that-speaks.json - VERDICT: NEEDS REWRITE (6 fixes, incl. 1 owner-rule violation)

1. beast-that-speaks | beat 9 | "Those details come from reports the hadith scholars graded weak, so this story leaves them out." | FIX - BLOCKING, tone-of-precision rule: "so this story leaves them out" is the narration announcing its own rigor (same family as "we checked" / "this channel"). The grading attribution itself is fine; the self-reference is not. | Rewrite of the full beat (45 words, also fixes the 52-word length): "You may hear vivid descriptions of this creature... what it carries, what it marks. Those details come from reports the hadith scholars graded weak. What the authentic texts give is short... and heavier for it. The earth will speak, because people stopped being certain."

2. beast-that-speaks | beat 3 | "And when the word befalls them, We will bring forth for them a creature from the earth, speaking to them... that the people were, of Our verses, not certain in faith." | FIX - 46 words, and the inverted translation tail ("that the people were, of Our verses, not certain in faith") cannot be parsed in one hearing. The verse is shown on screen (quote 27:82); the narration may carry a smoother rendering. | Rewrite (44 words): "This is not folklore that crept in later. It is a verse of the Qur'an. And when the word befalls them, We will bring forth for them a creature from the earth, speaking to them... because the people were not certain of Our signs."

3. beast-that-speaks | beat 5 | "The Prophet, peace be upon him, listed it among the ten great signs before the Hour. His companions said he came upon them while they were discussing the Hour, and he told them it will not come until ten signs appear... and one of them is the beast." | FIX - 48 words, and the beat tells the same fact twice ("listed it among the ten great signs" then narrates the listing) with "the Hour" repeated. | Rewrite (36 words): "The Prophet, peace be upon him, once came upon his companions while they were discussing the Hour. He told them it will not come until ten great signs appear... and one of them is the beast."

4. beast-that-speaks | beat 7 | "And here is what gives this sign its weight. The Prophet, peace be upon him, named three signs after which faith will no longer benefit a soul that had not believed before..." | FIX - 48 words; the opening announcer line pads it. | Rewrite (39 words): "But the Prophet, peace be upon him, named three signs after which faith will no longer benefit a soul that had not believed before... the sun rising from its setting place, the false messiah... and the beast of the earth."

5. beast-that-speaks | beat 8 | "Whatever a person is on that day, is what they are." | FIX - the comma splits subject from verb (renders as a stray comma in the word-by-word caption) and the line is circular spoken. | Rewrite: "Whatever a person is on that day... is what they remain."

6. beast-that-speaks | beat 6 | "Some of those signs already have their own stories... the false messiah, the return of Isa, the fire, the smoke." | MINOR - "have their own stories" can be heard as channel self-reference (adjacent to the tone-of-precision rule) and is vague. | Rewrite: "Some of those signs are described in detail... the false messiah, the return of Isa, the fire, the smoke."

Correct usage noted: "Dabbat al-Ard" appears only in the titleSub (title card), never in narration - exactly per the spoken-Arabic policy.

## thirsty-dog.json - VERDICT: PASS WITH FIXES (2 fixes)

1. thirsty-dog | beat 7 | "He told a matching story of a man. A traveler, dying of thirst himself, who climbed down a well and drank... and came up to find a dog licking the mud from thirst. He thought... this creature is suffering exactly what I was suffering. So he went back down, filled his shoe, held it in his teeth, and climbed. And Allah thanked him... and forgave him." | FIX - 66 words (~26s), the longest beat in the batch, and "A traveler... who climbed down a well and drank" is a verbless fragment (the "who" strands the clause). | Preferred fix: split into two beats - (a) "He told a matching story. A traveler, dying of thirst, climbed down a well and drank... and came up to find a dog licking the mud from thirst. He thought... this creature is suffering what I was suffering." (b) "So he went back down, filled his shoe, held it in his teeth, and climbed. And Allah thanked him... and forgave him." If the beat count is fixed, single-beat fallback (57 words, still ~22s - noted): same text with "of a man" and "himself" and "exactly" cut and the fragment repaired as in (a).

2. thirsty-dog | beat 8 | "is there a reward for us in the animals?" | MINOR - a small stumble spoken; the sunnah.com rendering is also smoother. | Rewrite: "is there a reward for us in serving the animals?"

## zalzalah.json - VERDICT: PASS WITH FIXES (1 fix, 1 minor)

1. zalzalah | beat 9 | "The Prophet, peace be upon him, was once asked about donkeys... of all things... whether there was revelation about them. He answered that nothing had come down about them except this unique, comprehensive verse. Whoever does good equal to the weight of an atom... shall see it. One verse, he taught, that covers everything." | FIX - 54 words (~21s), and it re-recites the verse the viewer heard in the previous beat, which reads as a skip in the audio. | Rewrite (41 words): "The Prophet, peace be upon him, was once asked whether any revelation had come down about donkeys... of all things. And he answered that nothing had come down about them except one unique, comprehensive verse... the verse you just heard."

2. zalzalah | beat 6 | "The earth, addressed all along... a witness on the stand." | MINOR - "addressed all along" is unclear in one hearing (the verse says the earth is inspired to speak, not spoken to). | Rewrite: "The earth, watching all along... called as a witness to the stand."

---

## Summary

| Script | Verdict | Findings |
|---|---|---|
| sirat-bridge | PASS WITH FIXES | 2 fixes, 1 pronunciation verify |
| sun-from-west | PASS WITH FIXES | 2 fixes, 1 minor |
| first-night-grave | PASS WITH FIXES | 4 fixes |
| skin-witness | PASS WITH FIXES | 2 fixes, 1 minor, 1 pronunciation verify |
| seven-shade | PASS WITH MINOR FIXES | 1 fix, 2 minor |
| killed-ninety-nine | PASS WITH FIXES | 2 fixes |
| cave-boulder | NEEDS REWRITE | 6 fixes (5 over-long beats, 1 ambiguity, 1 newcomer-clarity) |
| beast-that-speaks | NEEDS REWRITE | 5 fixes (1 blocking tone-of-precision violation), 1 minor |
| thirsty-dog | PASS WITH FIXES | 1 fix (recommend beat split), 1 minor |
| zalzalah | PASS WITH FIXES | 1 fix, 1 minor |

Total: 35 findings (24 fixes, 8 minor, 2 pronunciation verifies, 1 of the fixes
blocking under the tone-of-precision rule). Batch-wide: zero all-caps emphasis, zero
em/en dashes, zero emojis; all hooks open loops; all buttons reflective. No script
fails outright; cave-boulder and beast-that-speaks need another writing pass before
voicing.
