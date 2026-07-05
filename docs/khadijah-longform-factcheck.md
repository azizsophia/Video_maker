# Khadijah long-form - independent adversarial fact-check (QC gate 1, pass 2)

Run 2026-07-05 by a separate reviewer pass that did not write the script,
against sunnah.com texts (via mirrors: en.tohed.com, IIUM full text,
sahih-bukhari.com), quran.com, Tafsir Ibn Kathir, and the standard seerah
record (Ibn Hisham / Ibn Sa'd). Script: `scripts/stories/longform-khadijah.json`.
Source table: `docs/khadijah-longform-sources.md`.

VERDICT: script verified claim-by-claim; 11 required changes + 1 chronology
hedge were returned and ALL were applied on 2026-07-05 (commit with this file).
No unresolved flags remain.

## Verified as written (highlights)

- Sahih al-Bukhari 3: full iqra narrative (Read / I cannot read / pressed three
  times / 96:1), "Cover me, cover me", "I fear for myself", Khadijah's
  reassurance list, Waraqah old + blind + Christian + knew scripture, "the
  Namus sent to Musa", "your people will drive you out", "no man brought the
  like... without hostility", "if I live... I will support you strongly".
- Sahih al-Bukhari 3820 / Sahih Muslim 2432: the dish of food IS in the hadith;
  salam from her Lord and from Jibril; house in Paradise of qasab (hollowed
  pearl per the standard commentarial gloss); no noise and no fatigue.
- Sahih al-Bukhari 3818 / Sahih Muslim 2435: sheep to Khadijah's friends;
  Aisha's jealousy "though I did not see her".
- Sahih al-Bukhari 3821 + Musnad Ahmad 24864 (hasan, al-Arna'ut): the exchange
  and the "she believed in me..." reply; foot correctly splits the two sources.
- Sahih al-Bukhari 3432 (narrated Ali): "best of the women of her time was
  Maryam... and the best of the women of her time is Khadijah" (script wording
  aligned to the hadith's implied qualifier).
- Qur'an 96:1 and 108:1 wording; abtar occasion per classical tafsir, footed as
  Tafsir Ibn Kathir.
- Seerah backbone (footed as seerah): at-Tahirah, al-Amin, Maysarah caravan,
  her proposal, he was 25, ~25 years monogamous, six children, first believer
  overall, ~3-year boycott in the shi'b, deaths in year 10 (Aam al-Huzn),
  burial at al-Hajun with the grave-descent report footed Ibn Sa'd only.

## Flags returned and fixes applied (all closed)

| # | Flag | Fix applied |
|---|---|---|
| 1 | BLOCKING: "most complete women who ever lived" conflated Bukhari 3411 (Maryam + Asiya only) with Bukhari 3432 | Now "counted her among the very best of women" |
| 2 | BLOCKING: "Waraqah listened... and trembled" - no source has Waraqah trembling | "and answered at once" |
| 3 | BLOCKING: "and then he lost Khadijah" asserted a disputed death order | "and he lost Khadijah" (no sequence claimed) |
| 4 | BLOCKING: caption's "the only human being greeted by name with peace from her Lord" unprovable absolute (Aisha also received salam, Bukhari 3768); caption's "richest woman in Makkah" superlative | Caption now "one of the wealthiest people in Makkah... was greeted by name with peace from her Lord" |
| 5 | BLOCKING: "the wealthiest woman in Makkah" in beat 24 | "one of the wealthiest people in Makkah" |
| 6 | "by Allah" oath added to the Musnad Ahmad reply | Now "No. Allah did not give me better than her." (matches Ahmad text) |
| 7 | Fifth reassurance item "you stand with the truth" drifted from tu'in ala nawa'ib al-haqq | Now "you stand with people struck by hardship, in every right cause" |
| 8 | Age claims ("neared forty", "fortieth year") footed only to Bukhari 3 / 2:185 | Foots now add "and Seerah" |
| 9 | Shi'b of Abu Talib called "outside the city" (it is a gorge at Makkah's edge) | "at the edge of the city" |
| 10 | "nearly two billion" undercounts (Pew 2025: 2.0B by 2020) | "some two billion" |
| 11 | "more profit than she had ever seen" overstates the sourced report (double the usual) | "twice the profit she expected" |
| 12 | Chronology: the abtar taunt likely postdates prophethood; beat sits pre-Hira | Beat reworded to prospective: "In the years ahead... would mock... would call him abtar" |

## Standing accuracy decisions recorded

- The janazah-not-yet-legislated claim (source table row 21) is ABSENT from the
  script and must stay out (Ibn Sa'd via al-Waqidi, weak).
- The grave-descent line stays footed "Seerah (Ibn Sa'd)" - never upgrade this
  foot to a hadith collection.
- Hook's "from above the seven heavens" is homiletic framing (flagged for owner
  awareness in the review message; theologically standard).
- "History records no complaint from her" is framed as an absence-of-record
  claim and stays exactly as framed.
