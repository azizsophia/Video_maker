# Batch 5 research - source verification notes (2026-07-10)

Method: every citation pulled from api.sunnah.com (v1, X-API-Key) and read in English;
gradings are the ones returned by the API (Bukhari/Muslim = Sahih by definition;
sunan books show grader, usually Al-Albani or Darussalam). Web checks (islamqa.info,
abuaminaelias, simplysalafiyyah) used only for texts not in the API (Nasa'i al-Kubra,
al-Hakim). Muslim numbering on the API needs either "597 a" (url-encoded space) or
"234b" (no space) depending on the hadith; both formats tried for every miss.

## VERIFIED SAHIH (safe to build on)

- Bukhari 6682 + 7563; Muslim 2694 - "Two words light on the tongue, heavy in the
  balance, beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahi
  al-Azim." Grade: Sahih (Bukhari/Muslim). Text confirmed verbatim via API.
- Bukhari 6405; Muslim 2691 - "Whoever says SubhanAllahi wa bihamdihi 100x a day,
  his sins are forgiven even if like the foam of the sea." Sahih. Confirmed.
- Bukhari 6403; Muslim 2691 - la ilaha illallah wahdahu... 100x = 10 slaves freed,
  100 hasanat, 100 sins erased, protection from shaytan that day. Sahih. Confirmed.
- Muslim 597a - 33/33/34 + tahlil after EVERY prayer -> sins forgiven even like
  sea foam. Sahih. Confirmed.
- Muslim 408 - "He who blesses me once, Allah blesses him ten times." Sahih. Confirmed.
- Bukhari 1145 (also Muslim 758) - Lord descends in last third of night: "Is there
  anyone to invoke Me... ask Me... seek My forgiveness..." Sahih. Confirmed (1145 via API).
- Muslim 725a - "The two rak'ahs of dawn are better than this world and what it
  contains." Sahih. Confirmed.
- Muslim 657a - "He who prayed the morning prayer is under the protection (dhimmah)
  of Allah..." Sahih. Confirmed.
- Muslim 656a - Isha in congregation = half the night; Fajr too = whole night. Sahih. Confirmed.
- Muslim 728a - 12 rak'ahs a day -> "a house will be built in Paradise"; Umm Habiba:
  "I have never abandoned them since." Sahih. Confirmed.
- Bukhari 5009; Muslim 807a (also 808) - "Whoever recites the last two verses of
  Surat al-Baqarah at night, they will be sufficient for him." Sahih. Confirmed both.
- Bukhari 5013 (+5014) - Surah al-Ikhlas "equal to one-third of the Qur'an." Sahih. Confirmed.
- Bukhari 4205; Muslim 2704a/c - "Shall I not direct you to a treasure of Paradise:
  la hawla wa la quwwata illa billah." Sahih. Confirmed (Abu Musa, Khaybar journey).
- Bukhari 2736 - 99 names, "whoever knows/enumerates them enters Paradise." Sahih. Confirmed.
- Muslim 2733 (2732b/2732c) - dua for a brother in his absence is answered; the
  commissioned angel says "Ameen, and may you have the same." Sahih. Confirmed via
  sunnah.com search results (API 404s on 2732/2733 suffix formats; hadith text and
  number confirmed at sunnah.com/muslim/48/121 and hadeethenc.com/en/browse/hadith/3219).
- Bukhari 6464 - "the most beloved deed to Allah is the most regular and constant
  even if little." Sahih. Confirmed.
- Muslim 2588 - "Charity does not decrease wealth; Allah increases the one who
  forgives in honor; the one who humbles himself is raised." Sahih. Confirmed.
- Bukhari 247; Muslim 2710a - sleep on wudu, lie on right side, say the tafweed dua;
  (Bukhari 247 continues: if you die that night you die on the fitrah, make them
  your last words). Sahih. Confirmed.
- Bukhari 6320 - dust the bed, "Bismika Rabbi wada'tu janbi..." Sahih. Confirmed.
- Muslim 234a/234b - perfect wudu + 2 rak'ahs -> forgiven (234a); wudu + shahada
  version (234b; the famous "eight gates of Paradise opened" wording is the Umar
  narration of this hadith, Muslim 234 - also Tirmidhi 55 which adds the tawwabin
  line). Sahih. Confirmed via API (234a, 234b).
- Muslim 244 - sins leave with the water of wudu, "with the last drop of water"
  (face/eyes, hands, feet). Sahih. Confirmed.
- Bukhari 935 (also Muslim 852) - the Friday hour: a Muslim who catches it while
  praying and asks Allah, "Allah will definitely meet his demand"; he indicated its
  shortness with his hands. Sahih. Confirmed.
- Bukhari 1154 - whoever wakes at night and says the tahlil + "Allahummaghfir li" -
  forgiven / dua answered; if he does wudu and prays, prayer accepted. Sahih. Confirmed.
- Bukhari 6307 - "By Allah, I seek forgiveness from Allah and turn to Him more than
  seventy times a day." Sahih. Confirmed. (Pair with Qur'an 71:10-12, Nuh: istighfar ->
  rain, wealth, children, gardens, rivers - Qur'anic, no grading needed.)
- Muslim 1631 - "When a man dies his deeds end except three: ongoing charity,
  beneficial knowledge, a righteous child who prays for him." Sahih. Confirmed.
- Muslim 1893a - "One who guides to something good has a reward like that of its
  doer" (tail of the riding-beast story). Sahih. Confirmed. Muslim 2674 - "he who
  calls to guidance has the rewards of all who follow it, nothing diminished." Sahih. Confirmed.
- Bukhari 2320 - whoever plants a tree/sows seeds and a bird, person or animal eats
  from it, it is charity for him. Sahih. Confirmed.
- Muslim 1914 - a man moved a thorny branch from the path; "Allah appreciated it and
  forgave him." Sahih. Confirmed. (Related: Muslim 553 - removing harm from the road
  among the best deeds of the ummah. Sahih. Confirmed.)
- Abu Dawud 5088 - "Bismillahilladhi la yadurru..." 3x evening/morning -> no sudden
  affliction. Grade: SAHIH (Al-Albani, per API). Tirmidhi 3388 same text: Hasan
  (Darussalam). Build on the Abu Dawud sahih grading.
- Abu Dawud 561 - "Give good tidings to those who walk to the mosques in darkness:
  a perfect light on the Day of Judgment." SAHIH (Al-Albani). Tirmidhi 223 same:
  Sahih (Darussalam). Confirmed both. Muslim 666 - each step erases a sin / raises a
  degree. Sahih. Confirmed.
- Abu Dawud 521 - "The supplication made between the adhan and the iqamah is not
  rejected." SAHIH (Al-Albani). Confirmed.
- Abu Dawud 1529 - "Whoever says: I am pleased with Allah as Lord, Islam as religion,
  Muhammad as Messenger - Paradise will be his due." SAHIH (Al-Albani). Confirmed.
  (Note: the "3x morning/evening" variant is a different narration; stick to this base text.)
- Abu Dawud 1522 - Mu'adh dua after every prayer ("help me remember You, thank You,
  worship You well"). SAHIH (Al-Albani). Confirmed. Beautiful but name-bearing (Mu'adh).
- Ayat al-Kursi after every obligatory prayer -> "nothing prevents him from entering
  Paradise except death." An-Nasa'i (al-Kubra / 'Amal al-yawm wa'l-laylah), Ibn Hibban.
  Graded sahih by Ibn Hibban and Al-Albani; islamqa 6092: "isnad meets the conditions
  of al-Bukhari." SAHIH - but TOPIC OVERLAP: "Ayat al-Kursi decoded" already POSTED.
  Ayat al-Kursi before sleep (protection till morning) is in Bukhari 2311 (the
  Abu Hurayrah / thief story) - sahih, confirmed via API. Same overlap caution.

## FLAGGED - weak, disputed, or below the sahih-only bar. Do NOT build on these.

- MARKET DUA (Tirmidhi 3428, 3429: "whoever enters the marketplace and says... a
  million hasanat"): graded DA'IF by Darussalam on both numbers (API). Some older
  gradings called it hasan; the grading is disputed at best. DO NOT USE.
- ISTIGHFAR RELIEF hadith (Abu Dawud 1518: "whoever continually seeks pardon, Allah
  gives him a way out of every distress..."): DA'IF (Al-Albani, per API). DO NOT QUOTE.
  The istighfar topic is still fully buildable on Qur'an 71:10-12 + Bukhari 6307.
- SURAH AL-MULK protection/intercession (Tirmidhi 2891: Hasan per Darussalam;
  Abu Dawud 1400: Hasan per Al-Albani): HASAN, not sahih. The popular "protects from
  the punishment of the grave" wording (Tirmidhi 2890) is likewise hasan and partly
  mawquf. Below this channel's stated sahih-only bar - use only if the owner
  explicitly relaxes the bar to sahih+hasan, and never with "sahih" on the source card.
  Also thematically adjacent to first-night-grave (already delivered).
- SURAH AL-KAHF ON FRIDAY ("light between the two Fridays"): strongest form is
  SAHIH MAWQUF (companion's statement, Abu Sa'id al-Khudri - al-Hakim, al-Bayhaqi;
  Albani graded sahih, Sahih al-Jami 6470); the marfu' attribution is debated (hasan).
  Additionally "Surah Al-Kahf decoded" is ALREADY POSTED - duplicate risk. Skip.
- "Radeetu billah 3x morning and evening -> it is a duty upon Allah to please him"
  (the 3x version, Abu Dawud 5072): grading disputed (Albani declared it da'if in
  later works). Use only the base Abu Dawud 1529 text (sahih) with no "3x" claim.
- Smiling is charity (Tirmidhi 1956): hasan gharib, not pursued.
- Ayat al-Kursi topics: SAHIH but duplicate-adjacent (Ayat al-Kursi decoded POSTED).
  Only proceed if the owner rules the action-framing distinct.

## Duplicate screen done against:
docs/content-calendar.md PRODUCTION STATE (read 2026-07-10) + scripts/stories/ listing.
Relevant existing: sayyid-al-istighfar, yunus (dua of Yunus), seven-shade,
first-night-grave, food-tasbih (food glorifies - distinct from personal tasbih),
greeting-grown-cold, mosque-boast, cave-boulder, thirsty-dog, killed-ninety-nine.
None of the 18 proposed candidates duplicates these; adjacency flags noted above.

## Performance signals (short-form Islamic niche)
- Faceless dark-cinematic + narration + on-screen ayah is the dominant premium format
  (Towards Eternity, MercifulServant style); dhikr/virtue "reminder" content is a
  core high-share category (reposted heavily by aggregator accounts like @muslim).
- Formats that hold attention in this niche: (1) the PROMISE hook ("one sentence
  that outweighs..."), (2) the TONIGHT/NOW hook ("before you sleep tonight, do
  this") - immediately actionable, high save/share rate, (3) the SECRET/MYSTERY
  hook ("there is an hour every Friday..."), (4) the CHALLENGE/STREAK framing
  (Umm Habiba's "I never abandoned them" is a built-in sahih streak line),
  (5) the COUNTERINTUITIVE claim ("charity has never decreased wealth").
- Dhikr-count content ("say this 100x") performs because viewers can complete the
  action during or right after the video - drives comment receipts ("done").
- Sharing mechanics: dua/dhikr shorts get shared AS the good deed itself (Muslim
  1893 logic is literal here: the viewer shares to earn the reward) - the deed-that-
  never-dies topic is self-referential fuel for shares.
- High-save topics: bedtime routines, morning/evening protection adhkar, after-
  prayer routines - viewers save to reuse daily (saves boost distribution on TikTok/IG).
