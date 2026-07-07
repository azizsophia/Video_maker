# Batch 4 - independent adversarial fact-check (QC gate 1, pass 2)

Run 2026-07-07 by a separate reviewer pass that did not write the scripts.
Checked against the CURRENT script text (after the independent readability
pass of the same date - beat splits in cave-boulder and thirsty-dog, smoother
verse paraphrases, revised seal-phrase line).

Method: every beat of all 10 scripts checked claim by claim against the
verified source table (docs/batch4-sources.md) and the raw fetched sunnah.com
/ quran.com texts in the session scratchpad (b4/*.md): Bukhari 660, 1338,
1369, 2272, 2371, 2466, 3199, 3321, 3467, 3470, 4635, 4817, 6009, 6573;
Muslim 157a, 158, 183a/b, 2244, 2245a, 2766a, 2775, 2864, 2901a; Abu Dawud
4753; Qur'an 6:158, 14:27, 27:82, 36:65, 41:19-22, 57:12-13, 99:1-8 (Saheeh
International, translation 20). Narration paraphrase of a verse was judged
on meaning fidelity, with the on-screen quote citation checked separately.

Severity: MAJOR = must fix before render. MINOR = fix before render (the
accuracy gate allows zero unresolved flags). NOTE = advisory, owner's call.

Confirmed clean across ALL scripts: the ten blocking corrections from the
source table are respected except where flagged below; no weak-narration
content anywhere; no date-setting anywhere; grave angels stay un-named;
"His shade" never "shade of His Throne"; left/right charity hands per
Bukhari 660; cave story rides Bukhari 2272 alone (120 dinars, no rain, no
crying children, three-stage opening, and the revised line "this is not
lawful for you, except by right of marriage" matches 2272's own rendering
of la uhillu laka an tafudda al-khatam illa bi-haqqihi); beast script has
no seal-of-Sulayman / staff / face-marking material; 6:158 keeps its full
second clause in both the paraphrase and the shown verse; skin-witness SI
verbs exact where quoted.

Two earlier drafts' issues were RESOLVED by the readability pass and are
not flags: the cave laborer (not the employer) now drives the herd away
(beat 10), and the beast script no longer praises its own rigor (beat 9 now
states the weak grading matter-of-factly).

---

## 1. sirat-bridge.json - FLAGS (1 major, 2 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 1 (also cover kicker "EVERYONE MUST CROSS" and all three captions) | "Every human being who has ever lived will stand before it... there is no way around it" / "every human being has to cross it" | MAJOR. Contradicted by the cited sources themselves. In Bukhari 6573 and Muslim 183a the worshippers of the sun, moon and false deities, then the Jews and the Christians, fall into the Fire BEFORE the bridge is laid; the bridge is then set up for those who remain (those who worshipped Allah, pious and sinful, with the hypocrites among them). Universal crossing is argued by some commentators from Qur'an 19:71, but that verse is not cited, its reading is debated, and as voiced the claim rides a hadith foot. | Recast beat 1 without the universal claim, e.g. "There is a crossing on the Day of Judgment. A bridge, laid over the fire of Hell... and the road to Paradise runs across it." Change kicker (e.g. "THE FINAL CROSSING") and captions to match. Alternatively cite Qur'an 19:71 with an explicit commentators label - the recast is safer. |
| 6 | "Your speed on that bridge is not luck. It is your life, played back as motion." | MINOR. Footed Muslim 183, but Muslim 183a lists the crossing speeds without stating the deeds link. In the cited texts the deeds link is Bukhari 6573's "these hooks will snatch the people according to their deeds" (speed-by-deeds is explicit only in uncited narrations, e.g. Muslim 195). | Add Sahih al-Bukhari 6573 to the foot, or soften to a clearly reflective line. |
| 10 | "what carries a person over, at the speed of lightning or not at all... is what they did before they arrived" | MINOR. Same issue as beat 6. | Foot as "Sahih al-Bukhari 6573; Sahih Muslim 183" or keep foot and soften to reflection. |

Verified clean: Abu Sa'id attribution for thinner-than-a-hair is exactly
right (beat 4's "said word reached him" mirrors 183b's "balaghani"; never
voiced as the Prophet's words); first-to-cross per Bukhari 6573 only;
hooks / Sa'dan thorns / only-Allah-knows-their-size per 6573; messengers'
plea "O Allah, save. Save." per 6573; escape / lacerated / pushed per
Muslim 183a; 57:12-13 paraphrase faithful and explicitly labeled as the
commentators' connection; honorific present (beats 2-3).

## 2. sun-from-west.json - FLAGS (1 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 8 | "Not because Allah stops accepting people... but because belief at gunpoint is not belief. The test was always about trusting what you could not yet see." | MINOR. A theological explanation of WHY faith is not accepted, stated declaratively under a Sahih Muslim 157 foot; the hadith gives no reason. Could be heard as a sourced claim, and "belief at gunpoint" is a jarring idiom for this channel. | Rephrase as clearly reflective and drop the gun idiom, e.g. "That morning, belief costs nothing... and so it counts for nothing. The test was always about trusting what you could not yet see." |

Verified clean: Bukhari 3199 sequence exact (prostrates beneath the Throne,
asks permission, permitted daily, one day ordered to return whence it came,
rises in the west); Bukhari 4635 "whoever will be living on the surface of
the earth will have faith" correctly paraphrased; the 6:158 narration
paraphrase ("believing will no longer help a soul... if it had not believed
before, or earned some good through its faith") is meaning-faithful and
KEEPS the protected second clause, with the exact SI text shown via the
6:158 quote; beat 9's reading of the second clause is fair; Muslim 157a
supports the closing; no date-setting (beat 10 states the opposite,
correctly); honorific present (beats 3, 6).

## 3. first-night-grave.json - FLAGS (1 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 9 | "The Prophet's companions explained that this verse came down about the questioning of the grave." | MINOR (attribution). In Bukhari 1369 the PROPHET himself makes the link ("he testifies... and that corresponds to Allah's statement (14.27)"); the narration addition says the verse "was revealed concerning the punishment of the grave." Attributing the link to "the companions" understates and slightly misattributes it. | "And the Prophet, peace be upon him, taught that this verse speaks of the grave" - foot unchanged (Qur'an 14:27; Sahih al-Bukhari 1369). |

Verified clean: footsteps, two UN-NAMED angels, sit-up, the ONE question
"What did you use to say about this man, Muhammad?", the Fire-place
exchanged for Paradise, "they will see both" - all per Bukhari 1338 and
footed 1338 alone. The three questions, crier from heaven ("My servant has
spoken the truth"), bed from Paradise, door to Paradise, and grave wide as
far as the eye can see are footed separately to "Sunan Abi Dawud 4753,
graded sahih" - the one-question and three-question narrations are never
merged under one citation. The hypocrite beat correctly foots BOTH sources
because it draws the answer and the blow from 1338 and the narrowing from
4753. The morning-evening seat is not used (so 1379/2866 not required).
14:27 exact SI. Honorific present (beat 1).

## 4. skin-witness.json - FLAGS (1 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 7 | "The Prophet's companion Abdullah ibn Mas'ud told the story." | MINOR (honorific). This is the script's only reference to the Prophet and it carries no "peace be upon him." House rule: honorific at least at first mention per script. | "A companion of the Prophet, peace be upon him - Abdullah ibn Mas'ud - told the story." |

Verified clean: 41:19 ("gathered to the Fire... driven, assembled in
rows"), 41:20, 41:21 ("We were made to speak by Allah... who has made
everything speak" - exact), 41:22 ("but you assumed that Allah does not
know much of what you do" - exact tense) - all exact SI. 36:65 narration
now ends at "their feet will testify" (a truncation, not a drift; the full
SI text with "used to earn" appears in the on-screen quote) - acceptable.
Ka'bah setting correctly cited to Bukhari 4817 (with Muslim 2775); "heavy
of body, and light of understanding" is a fair rendering of 4817's "very
fat bellies but very little intelligence" and is framed as Ibn Mas'ud's
description; the two speakers' lines match 4817; the revelation link is
4817's own text.

## 5. seven-shade.json - PASS

All verified: sun one mile overhead flagged as "in the hadith's own words"
(Muslim 2864 - the sub-narrator's mile ambiguity correctly stays out);
sweat by deeds to knees, waist, and "to the mouth, like a bridle" (2864 -
the Prophet pointed to his mouth); the seven in Bukhari 660's exact order
ending on the weeping rememberer; "no shade but His" (never "Throne");
left-hand/right-hand direction per Bukhari 660; "I am afraid of Allah"
exact; the glosses on each of the seven are clearly reflective and none
contradicts the text; honorific present (beat 3).
NOTE (non-blocking): beat 7's "answers with five words" counts the ENGLISH
translation (the Arabic inni akhafu Allah is three words); harmless as
heard, but "answers with one sentence" would be bulletproof.

## 6. killed-ninety-nine.json - FLAGS (1 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 9 | "So the angels of mercy took him. And in the Prophet's words... he was forgiven." - footed Sahih al-Bukhari 3470 only | MINOR (per-collection attribution). "The angels of mercy took possession of him" is Muslim 2766a's ending; Bukhari 3470 ends "So he was forgiven" without it. A Muslim detail rides a Bukhari-only foot - the splice pattern the source table forbids. | Foot the beat "Sahih al-Bukhari 3470; Sahih Muslim 2766", or cut that sentence and go straight from "by a single hand-span" to "And in the Prophet's words... he was forgiven." |

Verified clean: monk-as-100th and the scholar ("yes. And who could stand
between you and repentance?" - matches the Arabic man yahulu) footed to
Muslim 2766 alone; the evil-land / such-and-such-town instruction per
Muslim; death halfway and the chest-turn footed to both (both collections
carry them - 2766b has the chest detail); the quarrel and the human-form
arbiter footed to both, with the arbiter's "measure the ground" per Muslim;
land-command, one hand-span, "he was forgiven" correctly under Bukhari 3470.
Beat 7's "not one good deed written down... except a direction" tracks the
punishment angels' claim, which beat 8 then attributes properly. Honorific
present (beat 2 and titleSub).

## 7. cave-boulder.json - FLAGS (1 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 1 | "And while they slept... a boulder broke loose" | MINOR (invented detail stated as fact). Bukhari 2272 says they entered the cave at night and the rock rolled down; it does not say they were asleep. | "Three travelers took shelter in a cave for the night. And in the dark... a boulder broke loose from the mountain..." |

NOTE (non-blocking): beat 9's "invested it... for years" - 2272 says the
laborer returned "after some time"; the years are inferred from the growth
into herds. "until it grew into camels, cows and sheep" already carries it.

Verified clean, per the single-spine rule: night shelter, no rain, no
crying children; bowl-in-hand till dawn ("before his own children" is
within 2272's "family (wife, children etc.)"); 120 dinars; famine year; the
woman's revised line "this is not lawful for you, except by right of
marriage" is faithful to 2272 (Arabic: break-the-seal-except-by-its-right;
sunnah.com's own English: "except by legitimate marriage") and correctly
footed to 2272; he leaves her AND the gold; laborer's wage grown into
camels, cows and sheep; the LABORER (beat 10, fixed in the readability
pass) drives every animal away and leaves nothing; rock opens in three
stages and they walk out. The Muslim 2743 foot appears only on the two
framing beats (2 and 12) with no variant details imported. Honorific
present (beat 2 and titleSub).

## 8. beast-that-speaks.json - FLAGS (2 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 7 | "three signs after which faith will no longer benefit a soul that had not believed before" | MINOR (truncated clause). Muslim 158 continues "...or has derived no good from his faith" - the same protected second clause as 6:158. As voiced, a lifelong nominal believer hears himself safe. | "...faith will no longer benefit a soul that had not believed before, or earned no good through its faith..." |
| 6 | "the return of Isa" | MINOR (honorific). House rule gives prophets "alayhi salam"; Isa is named bare. | "the return of the prophet Isa, alayhi salam" (phrase already in the locked PHONETIC set). |

NOTE (non-blocking): beat 3's paraphrase ends "...because the people were
not certain of Our signs", reading the verse's final clause causally, while
the on-screen SI text renders it as the creature's declaration ("[saying]
that the people were, of Our verses, not certain [in faith]"). Both are
classical readings of the Arabic (anna/li-anna) and beat 10 leans on the
causal one; if the owner wants narration and shown text in lockstep, say
"speaking to them... that the people were not certain of Our signs."

Verified clean: 27:82 shown via quote with correct citation; ten-signs
framing and the companions-in-discussion setting per Muslim 2901a, used as
ONE framing beat as required; the sign list in beat 6 (false messiah, Isa,
the fire, the smoke) all within 2901a; the three signs per Muslim 158 (sun
from its setting place, the false messiah, the beast of the earth); no
seal of Sulayman, no staff of Musa, no marking of faces anywhere; the
weak-reports beat (9) now states the grading matter-of-factly with no
self-reference - the tone-rule violation in the earlier draft is resolved;
honorific for the Prophet present (beats 5, 7).

## 9. thirsty-dog.json - FLAGS (1 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 4 | "And a well is deep... she had no bucket, no rope." | MINOR (inference stated as fact). Bukhari 3321 does not say she lacked a bucket or rope; the inference comes from her using her shoe. Stated flatly under a 3321 foot, it sounds like the hadith's wording. | Make it visibly inferential or descriptive: "And a well is deep... there was nothing to draw with. She had nothing to gain, and no one was watching." |

Verified clean: the woman centered on Bukhari 3321 (shoe tied with her
head-cover, drew water, "Allah forgave her because of that"); the
earlier-nation line footed to Bukhari 3467 and consistent with its
"Israeli prostitute" (Bani Israil); hot day, circling the well, tongue
hanging out footed to Muslim 2245; the man's version (traveler, drank
first, "this creature is suffering what I was suffering", shoe held in his
teeth, "Allah thanked him... and forgave him") per Bukhari 6009 / Muslim
2244 across beats 7-8; the reward-in-animals exchange ("is there a reward
for us in serving the animals?" / "in every living being, there is
reward") placed after the MAN's story and footed to Bukhari 2466 / Muslim
2244, never spliced into the woman's hadith - exactly as the source table
requires. Honorific present (beat 1).

## 10. zalzalah.json - PASS

All verified: 99:1-8 narrated in exact SI wording ("its final earthquake",
"discharges its burdens", "what is wrong with it?", "That Day, it will
report its news... because your Lord has inspired it", "an atom's weight of
good/evil... will see it"); no weak virtue material (no earth-testifies
hadith, no half-of-the-Qur'an line) - the testimony idea is carried by
99:4-5 as the source table directed; Bukhari 2371 used correctly: the
donkeys question, "nothing had come down about them except one unique,
comprehensive verse", and "the verse you just heard" correctly points back
to 99:7, which is the verse 2371 itself quotes. Honorific present (beat 9).
Surah number and verse count correct.
NOTE (non-blocking): beat 6's on-screen quote is "99:4" while the narration
voices verses 4 AND 5; if the renderer supports ranges, show 99:4-5 so the
SI text "has inspired [i.e., commanded] it" appears on screen with its
bracketed gloss (the narration cannot voice the bracket, and "inspired it"
alone is SI's main text - acceptable). Same pattern, lower stakes, in
sirat-bridge (quote 57:12 for a 57:12-13 narration).

---

## Verdict summary

| Script | Verdict | Flags |
|---|---|---|
| sirat-bridge | FLAGGED | 1 MAJOR (universal-crossing claim vs the cited hadith) + 2 MINOR |
| sun-from-west | FLAGGED | 1 MINOR |
| first-night-grave | FLAGGED | 1 MINOR |
| skin-witness | FLAGGED | 1 MINOR (missing honorific) |
| seven-shade | PASS | 0 (1 note) |
| killed-ninety-nine | FLAGGED | 1 MINOR |
| cave-boulder | FLAGGED | 1 MINOR (1 note) |
| beast-that-speaks | FLAGGED | 2 MINOR (1 note) |
| thirsty-dog | FLAGGED | 1 MINOR |
| zalzalah | PASS | 0 (1 note) |

Total: 10 flags (1 major, 9 minor) + 5 advisory notes. Per the accuracy QC
gate, no script with an open flag advances to voicing or render; every fix
must be re-checked against this report.
