// Build scripts/stories/longform-yusuf.json from the vetted clip map
// (docs/yusuf-clips.json) + the approved v2 narration. Keeps beat->clip exact,
// no reuse. The 6 on-screen ayahs use `quote`; beat 1 is the title card; beat 8
// is the code-generated map. Run: node scripts/build-yusuf-json.mjs
import { readFileSync, writeFileSync } from "node:fs";

const clips = JSON.parse(readFileSync("docs/yusuf-clips.json", "utf8"));
const byBeat = new Map(clips.map((c) => [c.beat, c]));

// Per-beat narration (proper spelling for captions; Arabic names are voiced
// from a phonetic respelling at build time in fetch-story.ts). kicker = gold
// eyebrow; foot = on-screen source; quote = on-screen ayah key.
const beats = [
  { n: 1, title: "THE STORY OF YUSUF", titleSub: "alayhi salam", kicker: "KETABI STUDIO", foot: "Surah Yusuf 12:3",
    text: "Of all the stories in the Qur'an, only one is told from beginning to end, in a single chapter. And Allah Himself calls it the most beautiful of them all. This is the story of Yusuf, alayhi salam." },
  { n: 2, kicker: "THE DREAM", quote: "12:4", foot: "Surah Yusuf 12:4 (shown, not recited)",
    text: "It begins with a boy, and a dream. One night, young Yusuf sees eleven stars, and the sun, and the moon, all bowing down before him. Frightened and amazed, he runs to his father, the Prophet Yaqub, alayhi salam." },
  { n: 3, kicker: "A FATHER'S WARNING", foot: "Surah Yusuf 12:5",
    text: "His father's face softens, then turns serious. He knows what a dream like this means. This boy has been chosen. So he holds him close, and warns him, gently. Keep this between us. Do not breathe a word of it to your brothers." },
  { n: 4, kicker: "ENVY", foot: "Surah Yusuf 12:8-9",
    text: "Because his brothers were already jealous. They were grown men, strong and many, and still their father's heart leaned toward this one boy. They could not forgive him for it. And quietly, that jealousy hardened into a plan." },
  { n: 5, kicker: "THE WELL", foot: "Surah Yusuf 12:15",
    text: "They begged their father to let Yusuf come and play with them. And out in the open, far from home, they threw him down into the darkness of a deep well. Then they stood at the top, and listened to a child cry out, and they turned and walked away." },
  { n: 6, kicker: "AS THE QUR'AN SAYS", quote: "12:18", foot: "Surah Yusuf 12:16-18 (shown, not recited)",
    text: "That night they came home weeping, with a story ready. A wolf had taken Yusuf while they raced ahead. And they held up his shirt, stained with blood. But Yaqub knew, deep in his heart, that his own sons were lying to his face. And he turned to the only thing that could hold him. Beautiful patience." },
  { n: 7, kicker: "SOLD INTO EGYPT", foot: "Surah Yusuf 12:19-20",
    text: "Days later, a passing caravan stopped at that well to draw water. And when they pulled up the bucket, they found a boy. They took him to Egypt, and there they sold him, for a few cheap coins, as if he were worth nothing at all." },
  { n: 8, kicker: "CANAAN TO EGYPT", foot: "Surah Yusuf 12:21", map: "yusuf-egypt",
    text: "A prophet's son, of the line of Ibrahim, carried hundreds of miles from his father, and sold in the markets of a foreign land." },
  { n: 9, kicker: "THE HOUSE OF POWER", foot: "Surah Yusuf 12:21-22",
    text: "But Allah does not abandon His own. Yusuf was bought by one of the most powerful men in Egypt, who told his wife, take good care of him. And in that grand house, the boy grew into a young man." },
  { n: 10, kicker: "HALF OF ALL BEAUTY", foot: "Sahih Muslim 162",
    text: "And he grew into no ordinary man. On the night the Prophet, peace be upon him, was raised up through the heavens, he met Yusuf. And he told us that Yusuf had been given half of all the beauty in creation." },
  { n: 11, kicker: "THE LOCKED DOORS", foot: "Surah Yusuf 12:23",
    text: "In that house lived the minister's wife. And as the years passed, she fell for the young man under her own roof. Until one day, she sent every servant away, and closed the doors of the house, one after another, until there was nowhere left for him to go. And she turned to him." },
  { n: 12, kicker: "HE REFUSED", foot: "Surah Yusuf 12:23",
    text: "And Yusuf refused her. I seek refuge in Allah, he said. Your husband has trusted me, and treated me well. How could I ever wrong him? How could I disobey my Lord?" },
  { n: 13, foot: "Surah Yusuf 12:25",
    text: "He turned and ran for the door. She caught him, and his shirt tore in her hands. And just as the door flew open, her husband was standing on the other side." },
  { n: 14, kicker: "THE BANQUET", foot: "Surah Yusuf 12:31",
    text: "Word of it spread through the city. The women whispered that the great minister's wife had fallen for a servant boy. So she invited them all to a banquet, and placed a knife and a piece of fruit in every hand. And then she called Yusuf to walk into the room. The moment they laid eyes on him, they were so overwhelmed that they cut their own hands, and never even felt the blade." },
  { n: 15, kicker: "THE CHOICE", foot: "Surah Yusuf 12:32-35",
    text: "Now you see, she told them. Then she turned back to Yusuf, with a threat. Obey me, or you will be thrown into prison. And Yusuf made his choice. My Lord, he prayed, prison is dearer to me than the sin they are calling me to. And so, though he had done nothing wrong, the doors of a prison closed behind him." },
  { n: 16, kicker: "THE PRISON", foot: "Surah Yusuf 12:36-37",
    text: "But even there, Yusuf was still Yusuf. Two young men were thrown in beside him, each carrying a strange dream he could not understand. They came to him for answers. And before he said a single word about their dreams, he asked them something far more important." },
  { n: 17, kicker: "AS THE QUR'AN SAYS", quote: "12:39", foot: "Surah Yusuf 12:39 (shown, not recited)",
    text: "O my two companions of prison. Are many scattered lords better, or Allah, the One, the Supreme?" },
  { n: 18, foot: "Surah Yusuf 12:41-42",
    text: "Then he told them what their dreams meant. One of you will be set free, he said, and will pour wine for the king once more. The other will be put to death. And to the one who would live, Yusuf said softly, remember me to your master." },
  { n: 19, foot: "Surah Yusuf 12:42",
    text: "But when that man walked free, he forgot all about Yusuf. And so Yusuf stayed in that prison, forgotten by everyone, for several more years." },
  { n: 20, kicker: "THE KING'S DREAM", foot: "Surah Yusuf 12:43",
    text: "Until one night, the king of Egypt woke from a dream that shook him. Seven fat cows, swallowed whole by seven starving ones. Seven green ears of grain, and seven dry. No one in his court could explain it." },
  { n: 21, kicker: "SEVEN YEARS", foot: "Surah Yusuf 12:46-49",
    text: "And at last, the freed servant remembered the young man in the prison. They brought the dream to Yusuf, and he read it clearly. Seven years of plenty are coming, he said, and after them, seven years of famine. Plant all you can, and store it. It will keep your people alive." },
  { n: 22, kicker: "HE WOULD NOT RUSH OUT", foot: "Surah Yusuf 12:50-51",
    text: "Amazed, the king ordered him set free at once. But Yusuf would not simply walk out. First, he said, go back and ask about the women who cut their hands. Let the truth be known. He would leave that cell with his name cleared, or he would not leave at all." },
  { n: 23, foot: "Sahih al-Bukhari 3372",
    text: "It is a patience almost beyond us. The Prophet, peace be upon him, once said that had he been kept in prison as long as Yusuf, and then the call to freedom came, he would have hurried straight out. But Yusuf waited, for his honour." },
  { n: 24, kicker: "GIVEN CHARGE OF EGYPT", foot: "Surah Yusuf 12:54-55",
    text: "His innocence was proven before the whole court. And the boy who had been thrown into a well, sold, and forgotten in a cell, was placed in charge of the storehouses of all of Egypt." },
  { n: 25, kicker: "THE FAMINE", foot: "Surah Yusuf 12:58",
    text: "Then, just as he had foretold, the famine came. And it spread far beyond Egypt, until it reached the hills of Canaan, and a grieving old father, and ten desperate brothers." },
  { n: 26, kicker: "THE BROTHERS RETURN", foot: "Surah Yusuf 12:58",
    text: "They came down to Egypt to beg for grain. And they bowed before the most powerful man in the land, never once realizing that they were looking into the eyes of the little brother they had buried in a well." },
  { n: 27, foot: "Surah Yusuf 12:70, 12:76",
    text: "Yusuf knew them at once. He tested them. And to keep his youngest brother safely at his side, he had the king's own cup hidden in the boy's bag. It was a plan, the Qur'an tells us, that Allah Himself taught him." },
  { n: 28, kicker: "AS THE QUR'AN SAYS", quote: "12:86", foot: "Surah Yusuf 12:84, 12:86 (shown, not recited)",
    text: "And far away in Canaan, Yaqub was still grieving. He had wept for Yusuf for so many years that his eyesight had faded to white. And still, he would not give up hope. I complain, he said, only of my grief and my sorrow, to Allah." },
  { n: 29, kicker: "I AM YUSUF", foot: "Surah Yusuf 12:89-90",
    text: "At last, when the brothers stood before him one final time, broken and desperate, Yusuf could hold it back no longer. I am Yusuf, he said. And this is my brother. They froze. And they knew, in that instant, exactly what they had done." },
  { n: 30, kicker: "AS THE QUR'AN SAYS", quote: "12:92", foot: "Surah Yusuf 12:92 (shown, not recited)",
    text: "They were completely in his power. He could have done anything to them. Instead, he said, there is no blame upon you today. May Allah forgive you. He is the most merciful of the merciful." },
  { n: 31, kicker: "AN ECHO AT MAKKAH", foot: "Conquest of Makkah (seerah)",
    text: "And centuries later, another man would stand exactly where Yusuf stood. When the Prophet, peace be upon him, entered Makkah, over the very people who had driven him out and killed his companions, he asked them what they thought he would do. Then he forgave them, with almost the same words. Go, he said. You are free." },
  { n: 32, kicker: "THE SCENT OF YUSUF", foot: "Surah Yusuf 12:93-96",
    text: "Yusuf sent his shirt home to his father. And before it had even arrived, the old man lifted his head and said, I can sense the scent of Yusuf, though you will think I am a foolish old man. They laid the shirt over his face. And his sight came rushing back." },
  { n: 33, kicker: "THE DREAM FULFILLED", foot: "Surah Yusuf 12:100",
    text: "Then his family came to him. His parents, and his eleven brothers, bowed before him in honour. And the dream of that little boy, the eleven stars, the sun and the moon, had come true, exactly as he had seen it all those years before." },
  { n: 34, kicker: "AS THE QUR'AN SAYS", quote: "12:101", foot: "Surah Yusuf 12:101 (shown, not recited)",
    text: "My Lord, Yusuf prayed, You have given me power, and taught me. You are my protector in this world, and the next. Let me die in submission to You, and join me with the righteous." },
  { n: 35, kicker: "REFLECT",
    text: "He was betrayed by his own blood. Enslaved. Lied about. And left to rot in a prison for years. And every single step of it was quietly carrying him exactly where Allah meant for him to be. So whatever you are walking through tonight, do not lose hope. Trust the One who is writing your story." },
];

const segments = beats.map((b) => {
  const seg = { type: "narration", text: b.text };
  if (b.kicker) seg.kicker = b.kicker;
  if (b.foot) seg.foot = b.foot;
  if (b.quote) seg.quote = b.quote;
  if (b.title) { seg.title = b.title; if (b.titleSub) seg.titleSub = b.titleSub; }
  if (b.map) { seg.map = b.map; }
  else {
    const clip = byBeat.get(b.n);
    if (!clip) throw new Error(`No clip for beat ${b.n}`);
    seg.video = clip.link;
    seg.videoDuration = clip.dur;
  }
  return seg;
});

// Keep the existing packaging (captions, sources, cover) from the current file.
const existing = JSON.parse(readFileSync("scripts/stories/longform-yusuf.json", "utf8"));
const out = {
  id: existing.id,
  title: existing.title,
  theme: "ketabi",
  cinematic: true,
  voiceId: existing.voiceId,
  voiceName: existing.voiceName,
  showOutro: true,
  cover: existing.cover,
  captions: existing.captions,
  _note: existing._note,
  segments,
  sources: existing.sources,
};
writeFileSync("scripts/stories/longform-yusuf.json", JSON.stringify(out, null, 2));

// QC: confirm no footage clip is reused.
const vids = segments.filter((s) => s.video).map((s) => s.video);
const dup = vids.filter((v, i) => vids.indexOf(v) !== i);
console.log(`segments: ${segments.length}, footage beats: ${vids.length}, map beats: ${segments.filter(s=>s.map).length}, title beats: ${segments.filter(s=>s.title).length}, quote beats: ${segments.filter(s=>s.quote).length}`);
console.log(`reused footage: ${dup.length ? dup : "NONE"}`);
