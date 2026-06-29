# Euphrates long-form — publishing pack

Everything needed to publish the 16:9 long-form Euphrates documentary. Script
lives at `scripts/stories/longform-euphrates.json`; render via `render-story.yml`
(`orientation=wide`).

House rules for all copy here: **no emojis, no em dashes or en dashes.** Plain
hyphens are fine.

## Latest render

- Run #108, branch `claude/video-performance-analysis-1o75wa`, commit `b9b8fce`.
- Artifact: `story-video` (the run's Artifacts tab) -> unzip -> `story.mp4` (~9:02, 1920x1080).
- Render link: https://github.com/azizsophia/Video_maker/actions/runs/28344918215
- A "failure" badge on the run is ONLY the optional Google Drive step; the video artifact is still produced.
- Render time is ~50-55 min (the "Render video" step). Narration + footage build is ~2 min.

## Title options (pick one)

Curiosity / high click-through:
- He Warned Us About This River 1,400 Years Ago
- A Mountain of Gold Is Buried Beneath the Euphrates
- The River Is Drying, and It Was Foretold
- A Mountain of Gold, and a Warning Almost No One Heeds

Authority / documentary:
- The Euphrates Prophecy: The Mountain of Gold Explained
- The Euphrates: A 1,400 Year Old Prophecy Meets Modern Science
- What the Prophet (peace be upon him) Said About the Euphrates River

Recommended: "He Warned Us About This River 1,400 Years Ago" (pairs with thumbnail C).

## Thumbnail (final = brand template)

CANONICAL: `public/promo/euphrates/thumb-brand-mountain-of-gold.png` - rendered
through the brand `CoverWide` composition (Playfair title, gold frame + flourish,
green/gold grade), so it matches the channel covers. This is the rule for ALL
long-form thumbnails now: use `CoverWide`, not PIL mockups.

Regenerate / make variants:
```
NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt npx remotion still CoverWide \
  out/euph-thumb.png \
  --props='{"title":"A Mountain\nof Gold","kicker":"THE EUPHRATES PROPHECY","image":"<https poster url>","wordmark":"KETABI STUDIO"}' \
  --ignore-certificate-errors
```
Swap `title` (Title Case, \n for line breaks), `kicker`, and `image` (a real
https image URL, e.g. a Pexels video poster cropped w=1280&h=720) for variants.

Superseded PIL mockups (kept for reference only, do not use): `thumb-A/B/C-*.png`.

## YouTube description (copy-paste, timestamps are estimates - confirm after a watch)

Fourteen hundred years ago, a man who could neither read nor write pointed to a single river, and described something the world could only begin to measure from space in our own lifetime.

This is the prophecy of the Euphrates: a coming mountain of gold, a warning that almost no one heeds, and what the Qur'an and the authentic Sunnah actually told us, long before modern science caught up.

In this documentary we trace the river from the mountains of eastern Turkey to the Persian Gulf, examine the hadith recorded in both Sahih al-Bukhari and Sahih Muslim, and ask the harder question the Prophet (peace be upon him) was really pointing to. Not the gold itself, but what the love of wealth does to the human heart. We then look, honestly, at the documented science of the Euphrates' decline, without overstating a single thing.

No sensationalism. No date-setting. Every claim is sourced.

Chapters
0:00 The river the Prophet (peace be upon him) pointed to
0:32 One river: Turkey, Syria, Iraq, the Gulf
1:35 The prophecy: a mountain of gold
2:25 The warning: ninety-nine out of every hundred
3:40 Why gold? What the Qur'an says about wealth
4:56 How the classical scholars understood it
5:45 The river today (NASA GRACE satellite data)
6:58 Being honest: this has not happened yet
7:44 "Its signs have already come"
7:53 A final reflection

Sources
Sahih Muslim 2894: "a mountain of gold" (jabal min dhahab); ninety-nine of every hundred perish.
Sahih al-Bukhari 7119: "a treasure of gold" (kanz min dhahab); take nothing from it.
Qur'an 100:8, 102:1, 47:18 (shown on screen, with translation).
Imam an-Nawawi (Sharh Sahih Muslim) and Ibn Hajar al-Asqalani (Fath al-Bari).
NASA GRACE satellite mission; Voss et al., 2013, Water Resources Research (about 144 cubic kilometres of freshwater lost in the Tigris and Euphrates basin from 2003 to 2009).

A note on intent: this video is a reflection, not a claim of fulfilment. The mountain of gold has not appeared. We present the prophecy and the documented science side by side, and leave the knowledge of the Hour where it belongs, with Allah alone.

Ketabi Studio makes Qur'an and Sunnah grounded videos for people who want depth without exaggeration.

We are opening early access soon. Join the founding waitlist at ketabistudio.com to be first in.

If this gave you something to reflect on, subscribe and share it with one person who needs it.

#Euphrates #IslamicProphecy #SignsOfTheHour #Quran #EndTimes #Islam #Hadith #Bukhari #Muslim #Dunya #IslamicReminder
