// Build scripts/stories/longform-yusuf.json from the vetted clip map
// (docs/yusuf-clips.json) + the approved v2 narration. Keeps beat->clip exact,
// no reuse. The 6 on-screen ayahs use `quote`; beat 1 is the title card; beat 8
// is the code-generated map. Run: node scripts/build-yusuf-json.mjs
//
// Narration is FRONT-LOADED: each beat opens with the image that matches its
// clip, so the visual and the words land together (no more picture-runs-ahead).
// Lines are tightened to ~10-15s. `dim` darkens a clip that is brighter than the
// grade; `holdSeconds` lets a beat linger after the line (title + closing).
import { readFileSync, writeFileSync } from "node:fs";

const clips = JSON.parse(readFileSync("docs/yusuf-clips.json", "utf8"));
const byBeat = new Map(clips.map((c) => [c.beat, c]));

const beats = [
  { n: 1, title: "THE STORY OF YUSUF", titleSub: "alayhi salam", kicker: "KETABI STUDIO", foot: "Surah Yusuf 12:3", holdSeconds: 2,
    text: "Of all the stories in the Qur'an, only one is told from beginning to end, in a single chapter. And Allah Himself calls it the most beautiful of them all. This is the story of Yusuf, alayhi salam." },
  { n: 2, kicker: "THE DREAM", quote: "12:4", foot: "Surah Yusuf 12:4 (shown, not recited)",
    text: "Eleven stars, and the sun, and the moon, all bowing down before a young boy as he sleeps. Frightened and amazed, Yusuf, alayhi salam, runs to his father, the Prophet Yaqub, alayhi salam." },
  { n: 3, kicker: "A FATHER'S WARNING", foot: "Surah Yusuf 12:5",
    text: "A father's hand closes gently over his small son's. He knows what a dream like this means. This boy has been chosen. Keep it between us, he warns him. Do not breathe a word of it to your brothers." },
  { n: 4, kicker: "ENVY", foot: "Surah Yusuf 12:8-9",
    text: "Out in the fields, his brothers seethe. Grown men, strong and many, and still their father's heart leans toward this one boy. They cannot forgive him for it. And quietly, that envy hardens into a plan." },
  { n: 5, kicker: "THE WELL", foot: "Surah Yusuf 12:15",
    text: "Far from home, out in the open, they throw him down into the darkness of a deep well. Then they stand at the rim, and listen to a child cry out below them, and they turn and walk away." },
  { n: 6, kicker: "AS THE QUR'AN SAYS", quote: "12:18", foot: "Surah Yusuf 12:16-18 (shown, not recited)",
    text: "A wolf, they tell their father that night, had taken Yusuf while they raced ahead. They hold up his shirt, stained with blood. But Yaqub knows his own sons are lying. And he turns to beautiful patience." },
  { n: 7, kicker: "SOLD INTO EGYPT", foot: "Surah Yusuf 12:19-20",
    text: "A passing caravan, crossing the dunes, stops at that well to draw water. And in the bucket, they find a boy. They carry him down to Egypt, and sell him there, for a few cheap coins, as if he were worth nothing." },
  { n: 8, kicker: "CANAAN TO EGYPT", foot: "Surah Yusuf 12:21", map: "yusuf-egypt",
    text: "A prophet's son, of the line of Ibrahim, carried hundreds of miles from his father, and sold in the markets of a foreign land." },
  { n: 9, kicker: "THE HOUSE OF POWER", foot: "Surah Yusuf 12:21-22",
    text: "Inside a grand house in Egypt, behind towering columns, Yusuf is bought by one of the most powerful men in the land, who tells his wife, take good care of him. And there, the boy grows into a young man." },
  { n: 10, kicker: "HALF OF ALL BEAUTY", foot: "Sahih Muslim 162",
    text: "And he grows into no ordinary man. On the night the Prophet, peace be upon him, was raised up through the heavens, he met Yusuf, and told us he had been given half of all the beauty in creation." },
  { n: 11, kicker: "THE LOCKED DOORS", foot: "Surah Yusuf 12:23",
    text: "Down the long corridors of that house, the minister's wife closes the doors, one after another, until there is nowhere left for him to go. For years she had wanted him. And now she turns to him." },
  { n: 12, kicker: "HE REFUSED", foot: "Surah Yusuf 12:23",
    text: "He turns toward the light, and refuses her. I seek refuge in Allah, he says. Your husband has trusted me, and treated me well. How could I ever wrong him? How could I disobey my Lord?" },
  { n: 13, foot: "Surah Yusuf 12:25",
    text: "His shirt tears in her hands as he runs for the door. And just as it flies open, her husband is standing on the other side." },
  { n: 14, kicker: "THE BANQUET", foot: "Surah Yusuf 12:31",
    text: "At a banquet, she places a knife and a piece of fruit in every woman's hand, and calls Yusuf into the room. The moment they see him, they are so overcome that they cut their own hands, and never feel the blade." },
  { n: 15, kicker: "THE CHOICE", foot: "Surah Yusuf 12:32-35",
    text: "Prison, or obey her. That is her threat. And Yusuf chooses the prison. My Lord, he prays, it is dearer to me than the sin they call me to. And though he had done no wrong, the iron doors close behind him." },
  { n: 16, kicker: "THE PRISON", foot: "Surah Yusuf 12:36-37",
    text: "Two young men are thrown into the cell beside him, each carrying a dream he cannot understand. They come to Yusuf for answers. But before he reads a single dream, he turns them to something far greater." },
  { n: 17, kicker: "AS THE QUR'AN SAYS", quote: "12:39", foot: "Surah Yusuf 12:39 (shown, not recited)",
    text: "O my two companions of prison. Are many scattered lords better, or Allah, the One, the Supreme?" },
  { n: 18, dim: 0.34, foot: "Surah Yusuf 12:41-42",
    text: "One of you, he tells them, will press the grapes and pour wine for the king once more. The other will not survive. And to the one who will live, Yusuf says softly, remember me to your master." },
  { n: 19, foot: "Surah Yusuf 12:42",
    text: "But the freed man forgets him. And so Yusuf stays in that cell, forgotten by everyone, as the light crosses the wall, for several more years." },
  { n: 20, dim: 0.2, kicker: "THE KING'S DREAM", foot: "Surah Yusuf 12:43",
    text: "Seven fat cows, swallowed whole by seven starving ones. Seven green ears of grain, and seven dry. The king of Egypt wakes from the dream shaking, and no one in his court can explain it." },
  { n: 21, dim: 0.32, kicker: "SEVEN YEARS", foot: "Surah Yusuf 12:46-49",
    text: "Golden fields, as far as the eye can see. The freed servant remembers Yusuf at last. Seven years of plenty are coming, he reads, then seven of famine. Plant all you can, and store it. It will keep your people alive." },
  { n: 22, kicker: "HE WOULD NOT RUSH OUT", foot: "Surah Yusuf 12:50-51",
    text: "The prison door swings open onto daylight. But Yusuf will not simply walk out. First, he says, ask about the women who cut their hands. Let my name be cleared. He will leave innocent, or not at all." },
  { n: 23, foot: "Sahih al-Bukhari 3372",
    text: "It is a patience almost beyond us. The Prophet, peace be upon him, said that had he waited in prison as long as Yusuf, and then been called, he would have hurried straight out. But Yusuf waited, for his honour." },
  { n: 24, kicker: "GIVEN CHARGE OF EGYPT", foot: "Surah Yusuf 12:54-55",
    text: "The storehouses of all Egypt, mountains of grain, are placed into his hands. The boy who was thrown into a well, sold, and forgotten in a cell, now feeds an entire kingdom." },
  { n: 25, kicker: "THE FAMINE", foot: "Surah Yusuf 12:58",
    text: "Then the earth cracks. The famine comes, just as he foretold, and spreads far beyond Egypt, until it reaches the hills of Canaan, a grieving old father, and ten desperate brothers." },
  { n: 26, kicker: "THE BROTHERS RETURN", foot: "Surah Yusuf 12:58",
    text: "Ten travel-worn men bow low before the most powerful man in Egypt, begging for grain, never once realizing they are looking into the eyes of the little brother they buried in a well." },
  { n: 27, foot: "Surah Yusuf 12:70, 12:76",
    text: "He knows them at once. And to keep his youngest brother safely at his side, he hides the king's own cup inside the boy's sack. It was a plan, the Qur'an tells us, that Allah Himself taught him." },
  { n: 28, kicker: "AS THE QUR'AN SAYS", quote: "12:86", foot: "Surah Yusuf 12:84, 12:86 (shown, not recited)",
    text: "Back in Canaan, Yaqub still grieves. He has wept for Yusuf so long that his eyes have turned white. And still he will not lose hope. I only complain of my grief and my sorrow to Allah, he says. And I know from Allah what you do not know." },
  { n: 29, kicker: "I AM YUSUF", foot: "Surah Yusuf 12:89-90",
    text: "At last, broken and desperate, the brothers stand before him one final time. And he can hold it back no longer. I am Yusuf, he says. They freeze. And they know, in that instant, exactly what they have done." },
  { n: 30, kicker: "AS THE QUR'AN SAYS", quote: "12:92", foot: "Surah Yusuf 12:92 (shown, not recited)",
    text: "They were completely in his power. He could have done anything to them. Instead, he said, there is no blame upon you today. May Allah forgive you. He is the most merciful of the merciful." },
  { n: 31, kicker: "AN ECHO AT MAKKAH", foot: "Conquest of Makkah (seerah)",
    text: "At the gates of Makkah, centuries later, a vast crowd waits. The Prophet, peace be upon him, stands over the very people who drove him out and killed his companions, and forgives them with almost the same words. Go, he says. You are free." },
  { n: 32, kicker: "THE SCENT OF YUSUF", foot: "Surah Yusuf 12:93-96",
    text: "A white shirt lifts on the wind, carried home to Canaan. And before it even arrives, the old man lifts his head. I can sense the scent of Yusuf, he says, though you will think I am a foolish old man. They lay it over his face, and his sight comes rushing back." },
  { n: 33, kicker: "THE DREAM FULFILLED", foot: "Surah Yusuf 12:100",
    text: "Eleven stars, the sun, and the moon, rising over the horizon. His parents and his eleven brothers bow before him in honour. And the dream of that little boy comes true, exactly as he saw it, all those years before." },
  { n: 34, kicker: "AS THE QUR'AN SAYS", quote: "12:101", foot: "Surah Yusuf 12:101 (shown, not recited)",
    text: "My Lord, You have given me power, and taught me. You are my protector in this world, and the next. Let me die in submission to You, and join me with the righteous." },
  { n: 35, kicker: "REFLECT", holdSeconds: 2.5,
    text: "A single trail of footprints, leading toward the sunrise. He was betrayed by his own blood, enslaved, lied about, and imprisoned for years. And every step was quietly carrying him exactly where Allah meant him to be. So whatever you are walking through tonight, do not lose hope. Trust the One who is writing your story." },
];

const segments = beats.map((b) => {
  const seg = { type: "narration", text: b.text };
  if (b.kicker) seg.kicker = b.kicker;
  if (b.foot) seg.foot = b.foot;
  if (b.quote) seg.quote = b.quote;
  if (b.title) { seg.title = b.title; if (b.titleSub) seg.titleSub = b.titleSub; }
  if (typeof b.dim === "number") seg.dim = b.dim;
  if (typeof b.holdSeconds === "number") seg.holdSeconds = b.holdSeconds;
  if (b.map) { seg.map = b.map; }
  else {
    const clip = byBeat.get(b.n);
    if (!clip) throw new Error(`No clip for beat ${b.n}`);
    seg.video = clip.link;
    seg.videoDuration = clip.dur;
  }
  return seg;
});

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

const vids = segments.filter((s) => s.video).map((s) => s.video);
const dup = vids.filter((v, i) => vids.indexOf(v) !== i);
const words = segments.reduce((m, s) => m + s.text.trim().split(/\s+/).length, 0);
console.log(`segments: ${segments.length}, footage: ${vids.length}, map: ${segments.filter(s=>s.map).length}, title: ${segments.filter(s=>s.title).length}, quotes: ${segments.filter(s=>s.quote).length}, dim: ${segments.filter(s=>s.dim).length}`);
console.log(`reused footage: ${dup.length ? dup : "NONE"} | total narration words: ${words} (~${Math.round(words/2.6)}s voice)`);
