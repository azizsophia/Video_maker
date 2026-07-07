# Independent MSA Pronunciation Audit - PHONETIC map

Auditor pass: independent second opinion on the `PHONETIC` respelling map
(119 entries) fed to the English TTS voice ("Daniel"). Each respelling was
judged on whether an English TTS reading it lands acceptably close to the
correct Modern Standard Arabic (MSA) pronunciation, verified against
Quran.com / corpus.quran.com, Wiktionary, and Wikipedia / Encyclopaedia
Iranica. Studio conventions (qaf -> "k", doubled long vowels, hyphen syllable
breaks, "Read" -> "reed") are treated as deliberate and not flagged.

## Summary count

- OK: 107
- MINOR: 11
- FLAG: 1

Owner-ear-locked entries (`Khadijah -> Kadeeja`, `Waraqah -> Warahkah`,
`Aisha`, `Quraysh -> Koo-raysh`, `Ka'bah -> Kaaba`) are counted OK and were
NOT overridden; notes appear at the bottom.

---

## FLAG (1) - genuinely wrong / cannot confirm correct

### `laqaha  ->  la-kaha`
- **Issue:** The respelling `la-kaha` reads "la-ka-ha", three short light
  syllables, with no long vowel and no gemination. This is only correct if the
  script word is the form-I verb `laqaḥa` (لَقَحَ, "was pollinated"). The much
  more likely intended word, given the "fertilizing winds / pollination" theme
  that sits next to `lawaqih` (لواقح, 15:22), is the **form-II transitive**
  `laqqaḥa` (لَقَّحَ, "pollinated / fertilized"), which is **geminated**:
  laq-QA-ḥa. `la-kaha` drops that doubling and the stress entirely, so if the
  word is `laqqaḥa` the TTS will under-pronounce it.
- **Correct MSA:** `laqqaḥa` = /laqˈqaħa/ (doubled q, ḥ = pharyngeal h);
  `laqaḥa` = /laˈqaħa/. Root ل-ق-ح "to pollinate/fertilize."
  Source: Qur'an 15:22 context, corpus.quran.com/wordbyword.jsp?chapter=15&verse=22
  ; Lane's Lexicon root l-q-ḥ.
- **Recommended respelling:** confirm the exact word in the script first. If it
  is `laqqaḥa` (form II, the pollinating verb) use **`lak-ka-ha`** (qaf->k per
  convention, gemination restored). If it is genuinely `laqaḥa` (form I), the
  current `la-kaha` is acceptable. Do not ship until the source word is pinned.

---

## MINOR (11) - acceptable but imperfect; ideal tweak given

| key | current | correct MSA (source) | recommended |
|-----|---------|----------------------|-------------|
| `hira` | `Heera` | Ḥirāʾ = /ħiˈraːʔ/, SHORT i, LONG aa, stress on 2nd syllable (the cave of Hira). `Heera` inverts it (long ee first, short a second) and can read like the name "Hira". | `Hi-raa` |
| `suraqah` | `Surahkah` | Surāqah = su-RAA-qah, long aa in the middle syllable. `Surahkah` reads "sur-ah-kah" and loses that long aa. | `Su-raa-kah` |
| `musaylima` | `Moosaylimah` | Musaylimah = mu-SAY-li-mah, SHORT first u. `Moosaylimah` over-lengthens it to "moo". | `Mu-saylimah` |
| `musi'un` | `moo-see-oon` | lamūsiʿūn (51:47) = mū (long) - si (SHORT kasra) - ʿūn; corpus.quran.com 51:47. `moo-see-oon` wrongly lengthens the middle to "see" and shifts stress there. | `moo-si-oon` |
| `nasiyah` | `naa-see-yah` | nāṣiyah (96:16) = /ˈnaː.sˤi.ja/, LONG stressed "naa" + SHORT i + ya; Wiktionary (ناصية). `naa-see-yah` lengthens the middle and shifts stress off "naa". | `naa-si-yah` |
| `kuwwirat` | `koowirat` | kuwwirat (81:1) = form II passive, SHORT u + DOUBLED w: kuw-wi-rat; corpus.quran.com 81:1. `koowirat` over-lengthens the first vowel and softens the gemination. | `kuw-wi-rat` |
| `wahy` | `wahee` | waḥy (وحي) = /waħj/, one syllable ending in -y. `wahee` turns it into two syllables "wa-hee". Tolerable (an English TTS would otherwise read "wahy" as "way"), but it is not two syllables in MSA. | keep, or `wah-y`; note it is monosyllabic |
| `umar` | `Oomar` | ʿUmar (عُمَر) = SHORT u ("uh"), not long "oo". `Oomar` = "OO-mar". The long "oo" is off, but the choice deliberately avoids the English mis-read "YOO-mar", so it is a defensible trade. | keep (aware trade-off); truest is a short "u" |
| `al-mustasim` | `al-Musta-sim` | al-Mustaʿṣim (المستعصم) = mus-taʿ-ṣim, stress on the heavy "taʿṣ" (mus-taʿ-SIM); emphatic ṣ, and an ayn that no English TTS can voice. `al-Musta-sim` is fine as an approximation; only the internal ayn is lost (unavoidable). | keep; optionally `al-Musta-sim` stays, aware stress is on the 3rd syllable |
| `hulagu` | `Hoolaagoo` | Arabic sources write هولاكو = **Hūlākū** (with a KAF/k: hoo-LAA-koo); Mongol/English common form is "Hulagu" with g. en.wikipedia.org/wiki/Hulagu_Khan ; iranicaonline.org/articles/hulagu-khan. `Hoolaagoo` (with g) matches the widely-recognized English pronunciation and is defensible; strict Arabic would use k. | keep `Hoolaagoo` for recognizability, OR `Hoolaakoo` for strict Arabic (choose one and be consistent) |
| `juvayni` | `Joovaynee` | Persian Juvayni / Joveynī (جوینی) has a SHORT first vowel (ju/jo), not long "joo"; en.wikipedia.org/wiki/Ata-Malik_Juvayni. `Joovaynee` over-lengthens the first syllable. | `Ju-vaynee` |

---

## Notes on specific items the brief asked about

- **`lawaqih -> lawaakih`**: VERIFIED OK. lawāqiḥ (15:22) = la-WAA-qiḥ;
  `lawaakih` (qaf->k, ḥ->h per convention) reproduces it well.
  Source: corpus.quran.com/wordbyword.jsp?chapter=15&verse=22.
- **`mastigure -> masti-gyoor`**: OK. "Mastigure" is the **English** word for
  the dabb / spiny-tailed lizard (genus Uromastyx), not an Arabic word, so MSA
  rules do not apply. Merriam-Webster gives /ˈmas-tə-ˌgyu̇r/ ("MAS-tuh-gyoor");
  `masti-gyoor` matches. Source: merriam-webster.com/dictionary/mastigure.
- **`yasbahun -> yas-ba-hoon`**: OK. yasbaḥūn (يسبحون, "they swim") =
  yas-ba-ḤOON; the ḥ rendered as "h" per convention. Reads correctly.
- **`ghazan -> Ghaazaan`**: OK. Ghāzān (غازان) has a genuine long ā in the
  first syllable; `Ghaazaan` is correct. gh->g is the accepted approximation.
- **`ain -> Ayn`**: OK. ʿAyn (as in ʿAyn Jālūt) = "eye-n" /ʕajn/; English "Ayn"
  (cf. Ayn Rand) is read as the same diphthong. The ayn itself cannot be voiced.
- **`ka'bah`, `khuza'a`, `ash-shi'ra`, `mas'ud`, `ismail`, `muawiya`,
  `ammar`, `isa`, `uthman`**: all contain an ayn (ع) that no English TTS can
  produce; the current respellings are the reasonable best-effort approximations
  and are left OK. Same for the ghayn (غ) in `ghulam` (g), which is unavoidable.

## Owner-ear-locked entries (noted, NOT overridden)

- `khadijah -> Kadeeja`: uses "K" for the khaa (خ), losing the fricative, but
  this is the owner's ear-tuned lock. Left as-is.
- `waraqah -> Warahkah`: standard MSA is Waraqah (qaf->k = "Waraka") with no
  internal "h"; the owner added the "h" deliberately by ear. Left as-is.
- `aisha -> Aisha`, `quraysh -> Koo-raysh`, `ka'bah -> Kaaba`: owner-locked in
  CLAUDE.md. Left as-is.

## OK (107) - keys

yaqub, ishaq, ibrahim, binyamin, qur'an, quran, alayhi, salam, khadijah,
jibril, musa, aisha, makkah, waraqah, dajjal, ayyub, salman, al-farisi,
yunus, sulayman, hajar, ismail, ammar, yasir, isa, nuh, sham, ad-duha, duha,
al-kawthar, kawthar, al-istighfar, istighfar, qasim, quba, nasibin,
ammuriyyah, thawr, yamama, hanifa, tamim, wahshi, hamza, uthman, siffin,
muawiya, al-ansi, sajah, tulayha, nahavand, qadian, ghulam, an-nawawi,
al-qurtubi, berke, ghazan, khwarazm, qutuz, ain, jalut, thabit, khuza'a,
ash-shi'ra, at-takwir, takwir, an-nur, lawaqih, tasbih, subhanallah, hafiz,
huffaz, al-amin, dajjaloon, yasbahun, qustantiniyyah, al-maqdis, al-hijr,
an-nahl, an-najm, al-dari, jahl, badr, zakat, mina, ya-sin, mastigure,
bismillah, quraysh, ka'bah, kaba, abu, bakr, ali, siddiq, abdullah, mas'ud,
masud, anas, malik, khattab, banu, harj, masjid, madinah, hurayra,
al-khudri, read

## Batch 4 additions - independent audit (2026-07-07)

Independent audit of the 4 new "Batch 4" PHONETIC entries in
`scripts/fetch-story.ts` (auditor did not write them), plus confirmation of two
existing entries flagged by the readability pass. Studio conventions (qaf->k,
doubled letters for long vowels, hyphen syllable breaks, emphatics/ayn as
best-effort plain consonants) are deliberate and not flagged.

- **`sa'id -> Sa-eed`**: OK. Saʿīd (سَعِيد) = /sa.ʕiːd/, short a then LONG ii,
  stress on the second syllable: sa-EED. "Sa-eed" gives Daniel exactly that
  (suh-EED); the ayn (ع) cannot be voiced by an English TTS and is dropped per
  the map's standing best-effort convention (same as mas'ud, ismail, isa).
  Source: en.wiktionary.org/wiki/سعيد (IPA /sa.ʕiːd/).
- **`sirat -> Si-raat` / `as-sirat -> as-Si-raat`**: OK. aṣ-Ṣirāṭ (الصِّرَاط)
  = /sˤi.raːtˤ/: short i, LONG aa, stress si-RAAT. The doubled "aa" in "raat"
  gives the long vowel and pulls the stress to the second syllable, which is
  correct. The ṣad (ص) and ṭa (ط) are emphatics no English TTS can produce;
  plain "s"/"t" is the accepted studio approximation (consistent with the
  earlier audit's ruling on ka'bah/khuza'a-class items). Note: on-screen text
  keeps the proper "as-Sirat" spelling; only the voice uses the respelling.
  Sources: en.wiktionary.org/wiki/صراط (IPA /sˤi.raːtˤ/);
  en.wikipedia.org/wiki/As-Sirat (Ṣirāṭ, الصراط).
- **`zalzalah -> Zal-zalah` / `az-zalzalah -> az-Zal-zalah`**: MINOR. The surah
  name is confirmed as az-Zalzalah, "The Earthquake" (quran.com surah 99).
  Zalzalah (زَلْزَلَة) = /zal.za.la/: ALL vowels short, ta marbuta ending -ah
  correct, and MSA stress falls on the first, heavy syllable: ZAL-za-lah. The
  respelling has the right consonants and vowels, but the chunk "zalah" invites
  an English reader to say zal-ZAH-lah (penult stress) or even a long-a
  "zal-ZAY-lah". Works if the ear-test passes; if Daniel drifts, the fully
  hyphenated `Zal-za-lah` pins each short syllable and keeps first-syllable
  stress. Not a wrong-vowel flag, a TTS-behavior risk.
  Sources: en.wiktionary.org/wiki/زلزلة (IPA /zal.za.la/);
  quran.com/az-zalzalah ("99. Surah Az-Zalzalah - The Earthquake").
- **`fussilat -> Fussi-lat`**: OK. Fuṣṣilat (فُصِّلَت) has a genuinely doubled
  (geminated) ṣad - Wikipedia gives the transliteration fuṣṣilat and quran.com
  titles surah 41 "Fussilat". Syllables fuṣ-ṣi-lat; the final CVC syllable is
  not superheavy and the penult is light, so MSA stress is on the first
  syllable: FUS-si-lat. "Fussi" reads like English "fussy" (FUSS-i), which
  gives the first-syllable stress, keeps the u short (never "fyoo"), and the
  "ss" is as close to gemination as English TTS gets. Emphatic ṣ -> plain s
  per convention.
  Sources: en.wikipedia.org/wiki/Fussilat ("Fuṣṣilat, فصلت");
  quran.com/fussilat ("Fussilat - Explained in Detail").

### Existing entries confirmed for the readability pass

- **`abu -> Aboo`** (fetch-story.ts line 236): present and adequate. MSA Abū =
  AH-boo, long final u; "Aboo" supplies the long "oo" and blocks the "AY-boo"/
  "uh-BYOO" default. Owner-locked style, left as-is.
- **`mas'ud -> Mas-ood`** (fetch-story.ts line 241): present and adequate.
  Masʿūd = /mas.ʕuːd/, stress mas-OOD with long uu; "Mas-ood" lands it. The
  ayn is unpronounceable and dropped per convention (already ruled OK in the
  earlier audit above). Owner-locked style, left as-is.

### Batch 4 verdicts

| Key | Respelling | Verdict |
| --- | --- | --- |
| sa'id | Sa-eed | OK |
| sirat / as-sirat | Si-raat / as-Si-raat | OK |
| zalzalah / az-zalzalah | Zal-zalah / az-Zal-zalah | MINOR (suggest Zal-za-lah if ear-test drifts) |
| fussilat | Fussi-lat | OK |
| abu (existing) | Aboo | OK (confirmed present) |
| mas'ud (existing) | Mas-ood | OK (confirmed present) |
