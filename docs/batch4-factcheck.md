# Batch 4 - independent adversarial fact-check (QC gate 1, pass 2)

Run 2026-07-07 by a separate reviewer pass that did not write the scripts.
Method: every beat of all 10 scripts checked claim by claim against the
verified source table (docs/batch4-sources.md) and the raw fetched sunnah.com
/ quran.com texts in the session scratchpad (b4/*.md): Bukhari 660, 1338,
1369, 2272, 2371, 2466, 3199, 3321, 3467, 3470, 4635, 4817, 6009, 6573;
Muslim 157a, 158, 183a/b, 2244, 2245a, 2766a, 2775, 2864, 2901a; Abu Dawud
4753; Qur'an 6:158, 14:27, 27:82, 36:65, 41:19-22, 57:12-13, 99:1-8 (Saheeh
International, translation 20).

Severity: MAJOR = must fix before render (accuracy gate). MINOR = fix before
render (the gate allows zero unresolved flags). NOTE = advisory, owner's
call.

Confirmed clean across ALL scripts: the ten blocking corrections from the
source table (a)-(j) are respected except where flagged below; no weak
narration content appears anywhere; no date-setting anywhere; angels stay
un-named; "His shade" never "shade of His Throne"; Bukhari 660 hand
direction correct; cave story rides Bukhari 2272 alone (120 dinars, no rain,
no crying children, seal-phrase per 2272, three-stage opening); beast script
contains no seal-of-Sulayman / staff / face-marking material; 6:158 keeps
its full second clause; all SI verb choices in skin-witness are exact.

---

## 1. sirat-bridge.json - FLAGS (1 major, 2 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 1 (also cover kicker "EVERYONE MUST CROSS" and all three captions) | "Every human being who has ever lived will stand before it... there is no way around it" / "every human being has to cross it" | MAJOR. Contradicted by the cited sources themselves. In Bukhari 6573 and Muslim 183a the worshippers of the sun, moon and false deities, then the Jews and the Christians, fall into the Fire BEFORE the bridge is laid; the bridge is then set up for those who remain (those who worshipped Allah, pious and sinful, with the hypocrites among them). Universal crossing is argued from Qur'an 19:71 by some commentators, but that verse is not cited, its reading is debated, and the claim as voiced is attributed to the hadith. | Recast beat 1 without the universal claim, e.g. "There is a crossing on the Day of Judgment. A bridge, laid over the fire of Hell, and the path to Paradise runs across it." Change cover kicker (e.g. "THE FINAL CROSSING") and captions to match. Alternatively cite Qur'an 19:71 with an explicit "commentators understand this of the bridge" label - but the simpler recast is safer. |
| 6 | "Your speed on that bridge is not luck. It is your life, played back as motion." | MINOR. Footed Muslim 183, but Muslim 183a lists the speeds without stating the deeds link. The deeds link in the cited texts is Bukhari 6573's "these hooks will snatch the people according to their deeds" (it is explicit for speed in Muslim 195 / Bukhari 7439, not cited). | Either add Sahih al-Bukhari 6573 to the foot (deeds link) or soften to a clearly reflective line ("as if a life were played back as motion"). |
| 10 | "what carries a person over, at the speed of lightning or not at all... is what they did before they arrived" | MINOR. Same issue as beat 6 - deeds-determine-crossing is Bukhari 6573's wording (hooks by deeds), not Muslim 183's speeds passage. | Foot as "Sahih al-Bukhari 6573; Sahih Muslim 183" or keep foot and soften to reflection. |

Verified clean: Abu Sa'id attribution for thinner-than-a-hair is exactly right
(beat 4 "word reached him" mirrors 183b's "balaghani"; never voiced as the
Prophet's words); hooks/Sa'dan/only-Allah-knows-size per 6573; messengers'
plea per 6573; escape/lacerated/pushed per 183a; 57:12-13 labeled as the
commentators' connection; honorific present (beat 2).

## 2. sun-from-west.json - FLAGS (1 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 8 | "Not because Allah stops accepting people... but because belief at gunpoint is not belief. The test was always about trusting what you could not yet see." | MINOR. A theological explanation of WHY faith is not accepted, stated declaratively under a Sahih Muslim 157 foot; the hadith gives no reason. Could be heard as a sourced claim. "Belief at gunpoint" is also a jarring idiom for this channel. | Rephrase as clearly reflective and drop the gun idiom, e.g. "That morning, belief costs nothing, and so it counts for nothing. The test was always about trusting what you could not yet see." Keep the foot on the preceding factual sentence only, or foot the reflection to 6:158. |

Verified clean: Bukhari 3199 sun-prostrates sequence exact (asks permission,
permitted daily, one day ordered to return whence it came, rises in the
west); Bukhari 4635 "whoever will be living on the surface of the earth will
have faith" correctly paraphrased; 6:158 quoted with the full clause "or had
earned through its faith some good" and the second-clause beat (9) is a fair
reading; Muslim 157a supports the closing; no date-setting (beat 10 says the
opposite, correctly); honorific present (beats 3, 6).

## 3. first-night-grave.json - FLAGS (1 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 9 | "The Prophet's companions explained that this verse came down about the questioning of the grave." | MINOR (attribution). In Bukhari 1369 the PROPHET himself makes the link ("he testifies... and that corresponds to Allah's statement (14.27)"); the narration addition says the verse "was revealed concerning the punishment of the grave." Attributing the link to "the companions" understates and slightly misattributes it. | "And the Prophet, peace be upon him, taught that this verse speaks of the grave" - foot unchanged (Qur'an 14:27; Sahih al-Bukhari 1369). |

Verified clean: footsteps, two UN-NAMED angels, sit-up, the one question
"What did you use to say about this man, Muhammad?", the Fire-place exchanged
for Paradise, "will see both" - all exact to Bukhari 1338 and footed 1338
alone. The three questions, crier from heaven ("My servant has spoken the
truth"), bed from Paradise, door to Paradise, grave wide as far as the eye
can see, and the compression are footed separately to Sunan Abi Dawud 4753
"graded sahih" - the one-question and three-question narrations are never
merged under one citation. Hypocrite's answer and the blow heard by all but
humans and jinn are 1338's wording under a 1338 foot. Morning-evening seat
is not used (so 1379/2866 not required). 14:27 is exact SI. Honorific
present (beat 1).

## 4. skin-witness.json - FLAGS (1 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 7 | "The Prophet's companion Abdullah ibn Mas'ud told the story." | MINOR (honorific). This is the script's only reference to the Prophet and it carries no "peace be upon him." House rule: honorific at least at first mention per script. | "A companion of the Prophet, peace be upon him - Abdullah ibn Mas'ud - told the story." |

Verified clean: 41:19 ("gathered to the Fire... assembled in rows"), 41:20,
41:21 ("We were made to speak by Allah, who has made everything speak" -
exact), 41:22 ("but you assumed that Allah does not know much of what you
do" - exact tense), 36:65 (ends "used to earn", not "commit") - all exact
Saheeh International. Ka'bah setting correctly cited to Bukhari 4817 (with
Muslim 2775); "heavy of body... and light of understanding" is a fair
rendering of 4817's "very fat bellies but very little intelligence" and is
attributed to Ibn Mas'ud's telling; the two speakers' lines match 4817. The
sabab an-nuzul link is 4817's own text ("Then Allah revealed...").

## 5. seven-shade.json - PASS

All verified: sun one mile overhead flagged as "in the hadith's own words"
(Muslim 2864, correct - the sub-narrator's mile ambiguity stays out of the
script, as the source table required); sweat by deeds to knees, waist, and
"to the mouth, like a bridle" (2864 - the Prophet pointed to his mouth);
the seven in Bukhari 660's exact order ending on the weeping rememberer;
"no shade but His" (never "Throne"); left-hand/right-hand direction quoted
per Bukhari 660; "I am afraid of Allah" exact; honorific present (beat 3).
NOTE (non-blocking): beat 5's "answers with five words" counts the ENGLISH
translation (the Arabic "inni akhafu Allah" is three words); harmless as
heard, but "answers with one sentence" would be bulletproof.

## 6. killed-ninety-nine.json - FLAGS (1 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 9 | "So the angels of mercy took him. And in the Prophet's words... he was forgiven." - footed Sahih al-Bukhari 3470 only | MINOR (per-collection attribution). "The angels of mercy took possession of him" is Muslim 2766a's ending; Bukhari 3470 ends "So he was forgiven" without it. The beat mixes a Muslim detail under a Bukhari-only foot - exactly the splice pattern the source table forbids. | Foot the beat "Sahih al-Bukhari 3470; Sahih Muslim 2766", or cut the sentence and go straight from "by a single hand-span" to "And in the Prophet's words... he was forgiven." |

Verified clean: monk-as-100th and the scholar ("Yes; and who could stand
between you and repentance?" - matches the Arabic "man yahulu") correctly
footed to Muslim 2766 alone; the evil-land / such-and-such-town instruction
per Muslim; death halfway footed to both (correct - both have it);
chest-turn footed Bukhari 3470 with Muslim (2766b has it - acceptable);
quarrel and human-form arbiter footed to both with the arbiter's "measure
the ground" per Muslim; land-command, one hand-span, "he was forgiven"
correctly Bukhari-only. Honorific present (beat 2 and titleSub). Beat 7's
"not a single good deed written down... except a direction" tracks the
punishment angels' claim, which beat 8 then attributes properly - acceptable
as story voice.

## 7. cave-boulder.json - FLAGS (2 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 1 | "And while they slept... a boulder broke loose" | MINOR (invented detail stated as fact). Bukhari 2272 says they entered the cave at night and the rock rolled down; it does not say they were asleep. | "Three travelers took shelter in a cave for the night. And in the dark... a boulder broke loose..." |
| 8 | "the man pointed at the herds filling the valley. All of it is yours. And he drove every animal away, and left nothing." | MINOR (pronoun flips the actor). In 2272 the LABORER "took all the herd and drove them away and left nothing." As written, "he" reads as the employer driving the animals. A listener hears the wrong man performing the hadith's closing action. | "All of it is yours. And the laborer took every animal, drove the herd away... and left nothing." |

NOTE (non-blocking): beat 8's "invested it... for years" - 2272 says the
laborer returned "after some time"; the years are inferred from the growth
into herds. "until it had grown into camels, cows, sheep" already carries it;
consider dropping "for years."

Verified clean, per the single-spine rule: night shelter, no rain, no crying
children; bowl-in-hand till dawn (and "before his own children" is within
2272's "family (wife, children etc.)"); 120 dinars; famine year; her words
given as the 2272 seal-phrase ("it is not lawful for you to break the seal,
except by its right" - matches the Arabic on the 2272 page, as the source
table directed); he leaves her AND the gold; laborer's wage grown into
camels, cows, sheep; rock opens in three stages and they walk out. The
Muslim 2743 foot appears only on the two framing beats (2 and 10), with no
variant details imported. Honorific present (beat 2 and titleSub).

## 8. beast-that-speaks.json - FLAGS (3 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 9 | "...reports the hadith scholars graded weak, so this story leaves them out." | MINOR but blocking under the owner's tone rule. "So this story leaves them out" is self-referential precision - the narration announcing its own rigor, the exact pattern banned 2026-07-02 (no "we checked", no "this channel"). The factual content (weak gradings, Tirmidhi 3187 da'if) is correct; the framing is the problem. | Deliver it matter-of-factly with no self-reference: "You may hear vivid descriptions of this creature... what it carries, what it marks. The hadith scholars graded those reports weak. What is certain is short... and heavier for it. The earth will speak, because people stopped being certain." |
| 7 | "three signs after which faith will no longer benefit a soul that had not believed before" | MINOR (truncated clause). Muslim 158 continues "...or has derived no good from his faith" - the same second clause the gate protects in 6:158. As voiced, a lifelong nominal believer hears himself safe. | "...faith will no longer benefit a soul that had not believed before, or earned no good through its faith..." |
| 6 | "the return of Isa" | MINOR (honorific). House rule gives prophets "alayhi salam"; Isa is named bare. | "the return of the prophet Isa, alayhi salam" (the phrase is already in the locked PHONETIC set). |

Verified clean: 27:82 quoted exactly per SI (brackets naturally dropped in
speech); ten-signs framing and the companions-in-discussion setting per
Muslim 2901a, used as ONE framing beat as the table required; the three
signs named per Muslim 158 (sun from its setting place, the false messiah,
the beast); no seal of Sulayman, no staff of Musa, no marking of faces
anywhere; honorific for the Prophet present (beats 5, 7).

## 9. thirsty-dog.json - FLAGS (1 minor)

| Beat | Claim | Problem | Proposed fix |
|---|---|---|---|
| 4 | "And a well is deep... she had no bucket, no rope." | MINOR (inference stated as fact). Bukhari 3321 does not say she lacked a bucket or rope; the inference comes from her using her shoe. Stated flatly under a 3321 foot, it sounds like the hadith's wording. | Make it visibly inferential or descriptive: "And a well is deep... there was nothing to draw with. She had nothing to gain, and no one was watching." |

Verified clean: the woman centered on Bukhari 3321 (shoe tied with her
head-cover, drew water, "So, Allah forgave her because of that"); the
earlier-nation line footed to Bukhari 3467 and consistent with its "Israeli
prostitute" (Bani Israil); hot day, circling the well, tongue hanging out
footed to Muslim 2245; the man's version (traveler, drank first, "This dog
is suffering from thirst as I did", shoe held in his teeth, "Allah thanked
him... and forgave him") per Bukhari 6009 / Muslim 2244; the
reward-in-animals exchange placed after the MAN's story and footed to
Bukhari 2466 / Muslim 2244, never spliced into the woman's hadith - exactly
as the source table required; "in every living being, there is reward"
matches. Honorific present (beat 1).

## 10. zalzalah.json - PASS

All verified: 99:1-8 narrated in exact SI wording ("its final earthquake",
"discharges its burdens", "What is wrong with it?", "That Day, it will
report its news", "Because your Lord has inspired it", "an atom's weight of
good/evil... will see it"); no weak virtue material (no earth-testifies
hadith, no half-of-the-Qur'an line) - the testimony idea is carried by
99:4-5 as the source table directed; Bukhari 2371 used correctly: the
donkeys question, "nothing had come down about them except this unique,
comprehensive verse", quoting 2371's own rendering of 99:7. Honorific
present (beat 9). Surah number and verse count correct.
NOTE (non-blocking): beat 6's on-screen quote is "99:4" while the narration
voices verses 4 AND 5; if the renderer supports ranges, show 99:4-5 so the
SI text "has inspired [i.e., commanded] it" appears on screen with its
bracketed gloss (the narration itself cannot voice the bracket and "inspired
it" alone is SI's main text - acceptable). Same pattern, lower stakes, in
sirat-bridge (quote 57:12 for a 57:12-13 narration).

---

## Verdict summary

| Script | Verdict | Flags |
|---|---|---|
| sirat-bridge | FLAGGED | 1 MAJOR (universal-crossing claim vs cited hadith) + 2 MINOR |
| sun-from-west | FLAGGED | 1 MINOR |
| first-night-grave | FLAGGED | 1 MINOR |
| skin-witness | FLAGGED | 1 MINOR (missing honorific) |
| seven-shade | PASS | 0 (1 note) |
| killed-ninety-nine | FLAGGED | 1 MINOR |
| cave-boulder | FLAGGED | 2 MINOR (1 note) |
| beast-that-speaks | FLAGGED | 3 MINOR (one blocking under the tone rule) |
| thirsty-dog | FLAGGED | 1 MINOR |
| zalzalah | PASS | 0 (1 note) |

Total: 12 flags (1 major, 11 minor) + 3 advisory notes. Per the accuracy QC
gate, no script with an open flag advances to voicing or render; every fix
must be re-checked against this report.

---

## Fix log (same session, 2026-07-07)

All 12 flags resolved and re-linted:
- sirat-bridge: hook recast without the universal-crossing claim ("a crossing
  on the Day of Judgment... the path to Paradise runs across it"); cover
  kicker now THE FINAL CROSSING; all three captions recast; deeds-link beats
  (6, 10) now footed "Sahih al-Bukhari 6573; Sahih Muslim 183".
- sun-from-west: beat 8 rephrased as pure reflection, gun idiom dropped,
  footed to Qur'an 6:158.
- first-night-grave: the 14:27 link attributed to the Prophet, peace be upon
  him, per Bukhari 1369.
- skin-witness: honorific added at first mention.
- seven-shade: advisory note applied ("answers with one sentence").
- killed-ninety-nine: beat 9 footed to both collections (angels-of-mercy
  ending is Muslim's).
- cave-boulder: "while they slept" -> "in the dark" (2272 does not say
  asleep); "for years" -> "in time" (2272 says after some time). The
  actor-flip flag was already fixed in the readability pass (the laborer
  drives the herd).
- beast-that-speaks: Muslim 158's second clause restored ("or earned no good
  through its faith"); "the prophet Isa, alayhi salam"; the tone-rule flag
  was already fixed in the readability pass (no self-reference remains).
- thirsty-dog: bucket/rope inference softened to "there was nothing to draw
  with".
- zalzalah + sirat quote-range note: left single-ayah on-screen quotes
  (renderer standard); narration and foots carry the ranges.
