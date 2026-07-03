# Batch 3 - Independent adversarial fact-check

## Independent fact-check (batch 3)

Checked 2026-07-03 by an independent reviewer that did not write the scripts.
Every bracketed citation in docs/batch3-scripts.md was re-fetched and re-read at
the source (hadithunlocked.com, the sunnah.com mirror with sunnah.com
numbering; api.alquran.cloud Sahih International; quran.com Ibn Kathir tafsir
via the qurancdn API). The pre-writing table (docs/batch3-verification.md) was
treated as a reference only and re-verified; one of its own attribution errors
was caught (see Script 7). Historical and science claims were checked
independently. No emojis and no em or en dashes anywhere in the scripts file
(byte-level scan: zero non-ASCII characters). Ayat are shown, never recited,
in every script. No depicted faces of prophets in any visual line.

### What was independently confirmed correct (no action needed)

- Qur'an 54:1, 21:32, 21:33, 36:40, 96:15-16, 16:69, 51:47: every quoted
  clause matches Sahih International exactly (one bracket issue, Script 15).
- Bukhari 4867 carries the Meccans' demand for a sign; Bukhari 3869 carries
  the Mina eyewitness wording including "Be witnesses" and the piece of the
  moon going toward the mountain. The demand sits on 4867, the eyewitness on
  3869, exactly as scripted; Ibn Mas'ud correctly named as the witness.
- Bukhari 3886 and Muslim 170 carry the al-Hijr / Bayt al-Maqdis description
  wording as quoted (Jabir ibn Abdullah).
- Muslim 8 carries every quoted detail of the Jibril hadith: white clothes,
  no signs of travel, none recognized him, knee to knee, "the one asked knows
  no more than the asker," the exact phrase "barefooted, destitute goat
  herders vying with one another in the construction of magnificent
  buildings," and "He was Jibril. He came to you in order to teach you your
  religion." Narrated by Umar ibn al-Khattab. "Barefoot" correctly sits on
  Muslim 8, not Bukhari 50.
- Bukhari 7320 verbatim, including "We said... the Jews and the Christians?
  He said, Whom else?" - the exchange is inside 7320 itself.
- Bukhari 1411 and 1412 both verbatim as quoted in beats 4 and 5 of Script 5;
  the "Hour" framing correctly sits on 1412 (one hook citation issue below).
- Musnad Ahmad 16957 confirmed as the Tamim al-Dari "night and day / house of
  mud or hair" narration (the table's correction away from 16344 was right).
- Bukhari 5684 confirmed: repeated "let him drink honey," then "Allah has
  said the truth, but your brother's abdomen has told a lie," then he was
  cured. The "Allah has spoken the truth and your brother's stomach has lied"
  line is genuinely in 5684.
- Abu Dawud 449 ("boast about their mosques," Anas) and Nasa'i 689 ("show off
  in building masjids," Anas) both verbatim; Anas ibn Malik was the Prophet's
  servant - correct.
- Bukhari 7061 verbatim ("Time will pass rapidly, good deeds will decrease,
  miserliness will be thrown..."); the year/month/week/day imagery correctly
  sits on Tirmidhi 2332 (verbatim, "the hour is like the flare of the fire"),
  shown as its own graded quote, never run over the Bukhari number.
- Muslim 2897 explicitly names Constantinople ("they... would be conquerors
  of Constantinople"); Muslim 2920 is the city "one side on land, one side in
  the sea," seventy thousand, takbir instead of weapons, interrupted by the
  cry that the Dajjal has come out. The contested "excellent amir" wording is
  correctly absent from the script.
- Ibn Kathir on 21:32 confirmed at the source: "a roof, safe and
  well-guarded... covering the earth like a dome... high and protected from
  anything reaching it." Ibn Kathir on 51:47 confirmed: "We made it vast and
  We brought its roof higher without pillars." Ibn Kathir on Surah 96
  confirms the Abu Jahl prayer-threat context ("If I see Muhammad praying at
  the Ka'bah, I will stomp on his neck," recorded by al-Bukhari).
- Historical/science spot-checks that PASS: Abu Jahl died at Badr (624 CE);
  Constantinople fell in 1453, roughly eight centuries after the first Arab
  siege of 674-678, behind walls that had held for about a thousand years;
  the tallest building on earth (Burj Khalifa, Dubai) does stand on the
  Arabian Peninsula, so "the deserts of Arabia hold the tallest tower ever
  built" is accurate; NASA puts the daily infall of meteoritic material at
  roughly 44-48 tons, so "tons of them, every single day" is safe; honey is
  used in modern licensed wound-care products (medical-grade honey
  dressings); galaxies receding / ongoing expansion is standard cosmology;
  roughly one in four humans is Muslim (about 24-25 percent); Mina is a
  valley just outside Makkah; Makkah to Jerusalem was about a month's caravan
  ride one way.

### Per-script verdicts

- Script 1 (Moon Split): FLAGS (2)
- Script 2 (Test of Jerusalem): FLAGS (6)
- Script 3 (Barefoot Shepherds): FLAGS (2)
- Script 4 (Lizard's Hole): PASS
- Script 5 (Unwanted Charity): FLAGS (1)
- Script 6 (Night and Day): FLAGS (4)
- Script 7 (Greeting Grew Cold): FLAGS (3) - includes the batch's one hard
  citation error
- Script 8 (Protected Ceiling): FLAGS (1)
- Script 9 (Everything Is Swimming): PASS
- Script 10 (Forelock That Lied): FLAGS (2)
- Script 11 (Verse of Honey): FLAGS (1)
- Script 12 (Mosques Become Trophies): FLAGS (2)
- Script 13 (When Time Speeds Up): FLAGS (1)
- Script 14 (City on Land and Sea): FLAGS (2)
- Script 15 (And He Is Its Expander): FLAGS (1)

### Flags

Severity key: [HARD] factual/citation error, blocks as-is. [MED] fidelity or
sourcing gap. [MINOR] house-rule compliance (honorific, gloss, wording).

1. [MINOR] Script 1 beat 5: "Abdullah ibn Mas'ud" introduced without the
   companion honorific -> "Abdullah ibn Mas'ud, may Allah be pleased with
   him, was standing there."
2. [MINOR] Script 1 beat 5: "Mina" unglossed for newcomers (each video stands
   alone) -> "We were with the Prophet at Mina, a valley just outside Makkah,
   he said..."
3. [MED] Script 2 beat 1: "So they began asking questions. And he answered"
   is cited to [Sahih al-Bukhari 3886], but 3886 contains no interrogation -
   only that he described the city to them while looking at it. The
   question-and-answer scene is longer seerah material. -> "So they demanded
   he describe it. And he did... looking at something they could not see."
4. [MED] Script 2 beat 3: "A month's caravan ride, there and back... in a
   night?" contradicts beat 1 ("a city a month's ride away" - one way). The
   round trip is two months. -> "Two months of caravan riding, there and
   back... in a night?"
5. [MED] Script 2 beat 4: "Merchants of Makkah had traded through Jerusalem
   for generations... Their own caravans had camped under its walls" is
   unsourced embellishment. The Quraysh caravan road ran north into Sham; the
   sourced point (seerah) is that some of them had themselves seen Jerusalem.
   -> "Merchants of Makkah had ridden the caravan roads north into Sham for
   generations... and some among them had seen Jerusalem with their own eyes.
   If this man had never been there... the details would break him."
6. [MED] Script 2 beat 6: "Question after question... answer after answer"
   sits under [Sahih Muslim 170], which says only "I narrated to them its
   signs while I was looking at it" - no questioning. -> "Sign after sign...
   detail after detail... from a man staring past them at something only he
   could see."
7. [MED] Script 2 beat 7: "the record of what happened next is not that the
   details failed... it is that the questions ran out" asserts a "record" of
   an exam that the cited hadiths do not carry. -> "...is not that the
   details failed. It is that the description held."
8. [MINOR] Script 2 beat 5: "the Ka'bah" unglossed in this script (Script 10
   glosses it; each video stands alone) -> "beside the Ka'bah, the ancient
   cube-shaped sanctuary at the heart of Makkah."
9. [MINOR] Script 3 beat 3: "Umar ibn al-Khattab" introduced without the
   companion honorific -> "The companion Umar ibn al-Khattab, may Allah be
   pleased with him, was watching..."
10. [MED] Script 3 beat 6: "stakes the claim that THEY... would one day
    compete over the tallest silhouettes on earth" - Muslim 8 says "vying...
    in the construction of magnificent buildings," not the tallest on earth.
    Keep the tallest-tower observation in beat 7 (that is the verified fact);
    keep beat 6 inside the wording. -> "...and stakes the claim that THEY,
    not Rome, not Persia... would one day vie with one another over
    magnificent towers."
11. [MED] Script 5 beat 1: the hook's imagery ("a man will carry his charity
    through the streets... and come home still holding it") is Bukhari 1411's
    wording (the charity-wanderer), but the hook is cited [Sahih al-Bukhari
    1412], which carries the worry/no-acceptor framing instead. The hook makes
    no "Hour" claim, so 1411 is the right number. -> cite the hook as
    [Sahih al-Bukhari 1411] (or [1411 and 1412]); beats 4 and 5 stay as they
    are.
12. [MINOR] Script 6 beat 5: "the companion Tamim al-Dari" introduced without
    the honorific -> "the companion Tamim al-Dari, may Allah be pleased with
    him."
13. [MINOR] Script 6 beat 5: "hadith" and "al-Albani" are undefined /
    unintroduced for a newcomer -> "...recorded in the Musnad of Imam Ahmad,
    one of Islam's great early collections of the Prophet's recorded words...
    and graded authentic. Al-Albani, a modern master of hadith verification,
    placed it third in his celebrated collection of sound narrations."
14. [MED] Script 6 beat 6: "Today there are Muslims in every country on
    earth" is an unverifiable absolute (e.g. Vatican City). -> "Today there
    are Muslims in nearly every country on earth."
15. [MINOR] Script 6 beat 7: "Every empire of that age bet against this
    sentence" - Abyssinia (Aksum) sheltered the early Muslims and is also
    gone; the absolute overreaches. -> "The great empires that bet against
    this sentence... are gone, every one."
16. [HARD] Script 7 beat 5: the trade / severed-family-ties / false-testimony
    list is NOT in Musnad Ahmad 3848. Verified at the source: Ahmad 3848
    carries ONLY the greeting sign. The fuller list is Musnad Ahmad 3870
    (verified wording: "Before the Hour there will be greeting only
    particular people, the spread of trade until a woman helps her husband in
    trade, the severing of kinship ties, false testimony, concealment of
    truthful testimony, and the prevalence of the pen" - Ibn Mas'ud, the
    wording al-Albani graded sahih in as-Silsilah as-Sahihah no. 647). The
    pre-writing table itself blurred the two numbers; the script inherited
    the error. -> beat 5 on-screen citation becomes [Musnad Ahmad 3870] and
    the narration opens "A fuller narration from the same companion, graded
    sound, lists what grows alongside it..." Beat 4 stays on [Musnad Ahmad
    3848], which is exactly the greeting sign.
17. [MINOR] Script 7 beat 5: "Abdullah ibn Mas'ud" introduced without the
    honorific -> "carried by Abdullah ibn Mas'ud, may Allah be pleased with
    him."
18. [MINOR] Script 7 beat 3: "taught his companions to spread the greeting...
    to those you know, and those you do not" paraphrases a specific hadith
    (Sahih al-Bukhari 12) with no on-screen source -> tag beat 3 [Sahih
    al-Bukhari 12].
19. [MED] Script 8 beat 6: "fields that bend away radiation that would
    sterilize the ground" overclaims. The magnetosphere deflects charged
    particles (solar wind); the atmosphere does most radiation shielding;
    "sterilize the ground" is not supportable. -> "...harmless streaks of
    light... and invisible fields that turn away the storms of charged
    particles the sun throws at us."
20. [MINOR] Script 10 beat 3: the trampling threat is a specific narrated
    incident delivered with no on-screen source (Ibn Kathir on Surah 96
    records it via al-Bukhari; Sahih Muslim 2797 carries it directly) -> tag
    beat 3 [Sahih Muslim 2797] (or [Tafsir Ibn Kathir]).
21. [MED] Script 10 beat 7: "exactly the humiliation the verses had promised"
    overbinds - the verses promise seizure by the forelock (tafsir: at the
    Fire), not death in battle; Badr is a fitting end, not the verses' stated
    scene. -> "He died at Badr, the first great battle, at the hands of the
    people he had tortured... a humiliation as public as his boast."
22. [MINOR] Script 11 beat 6: "the one pantry food that never spoils" - salt,
    sugar and other staples also keep indefinitely; "the one" is inaccurate.
    -> "...the pantry food found still edible in tombs thousands of years
    old, still earning its verse."
23. [MED] Script 12 beat 6: "the Prophet, peace be upon him, promised a house
    in Paradise for it" is a specific sahih hadith (verified: Sahih
    al-Bukhari 450, from Uthman ibn Affan: "Whoever built a mosque... Allah
    would build for him a similar place in Paradise"; also Sahih Muslim 533)
    but carries no on-screen source -> tag beat 6 [Sahih al-Bukhari 450].
24. [MINOR] Script 12 beat 4: "his servant Anas ibn Malik" introduced without
    the honorific -> "his servant Anas ibn Malik, may Allah be pleased with
    him."
25. [MED] Script 13 beat 7: "the same tradition says one thing weighs the
    moments back down... remembrance of Allah" asserts a text that does not
    exist - no narration says remembrance slows time. -> reword as open
    reflection: "You cannot slow the river. But believers have always
    answered hurrying time the same way... remembrance of Allah. Slow
    minutes... are still for sale. Barely anyone is buying."
26. [MED] Script 14 beat 7: "One precision, always." announces the channel's
    own care - a tone-rule violation (corrections must be matter-of-fact,
    never self-referential). -> delete the sentence; open the beat directly:
    "The fuller end-times description is its own promise, still ahead."
27. [MED] Script 14 beat 8: "history bent until the promise was kept" claims
    fulfillment of the Muslim 2897 promise in 1453 - but in Muslim 2897 the
    conquest of Constantinople sits inside the same end-times sequence (the
    conquerors are interrupted by the cry that the Dajjal has come out), so
    the fulfillment claim the table forbids is smuggled into the close. ->
    "A landlocked people were promised the queen of the seas... and for
    eight hundred years, men who believed it kept sailing at her walls,
    until the city opened. When a claim holds hearts for eight centuries...
    the question is no longer whether he meant it. It is who told him."
28. [MINOR] Script 15 beat 4: the on-screen Sahih International quote drops
    the translator's bracket - the table caveat requires brackets kept intact
    on screen. -> show "And the heaven We constructed with strength, and
    indeed, We are [its] expander." (Script 9's trimming of 21:33 to the
    unbracketed clause is compliant and passes.)

### Summary

- Scripts fully passing: 2 of 15 (Scripts 4 and 9).
- Total flags: 28 - 1 HARD (Script 7's Ahmad 3848/3870 misattribution, an
  error inherited from the pre-writing table itself), 13 MED, 14 MINOR.
- Recurring pattern worth fixing batch-wide: no script in the batch uses the
  companion honorific "may Allah be pleased with him" anywhere (byte-scan:
  the phrase is absent from the file), and two scripts leave a place or term
  unglossed that another script glosses - each video must stand alone.
- Nothing renders until every flag above is resolved and the owner approves
  the corrected scripts.
