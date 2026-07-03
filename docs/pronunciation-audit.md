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
