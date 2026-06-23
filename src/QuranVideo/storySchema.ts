import { z } from "zod";
import { themeSchema } from "./schema";

// A spoken word with its timing (seconds, relative to its own audio clip).
export const storyWordSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
});

// One beat of the story: either AI English narration, or a real Qur'an ayah.
export const storySegmentSchema = z.object({
  kind: z.enum(["narration", "ayah"]),
  audioSrc: z.string(), // /public path or URL
  fromSeconds: z.number(), // start offset within the whole video
  durationInSeconds: z.number(),
  // narration
  words: z.array(storyWordSchema).optional(), // for synced captions
  source: z.string().optional(), // small citation chip (e.g. "Tirmidhi 3153 (hasan)")
  map: z.string().optional(), // optional animated history map behind a narration beat
  scene: z.string().optional(), // institutional visual: statement|chronology|facade|map|quote
  kicker: z.string().optional(), // small gold eyebrow label at the top of the slide
  foot: z.string().optional(), // small italic source/footnote at the bottom
  highlight: z.string().optional(), // chronology: which era to emphasise (dadan|lihyan|nabataean)
  // ayah
  arabic: z.string().optional(),
  translation: z.string().optional(),
});

export const storyPropsSchema = z.object({
  title: z.string(),
  theme: themeSchema.default("midnight"),
  reciterName: z.string().default("Sheikh Abdur-Rahman as-Sudais"),
  voiceName: z.string().default("Daniel"),
  websiteUrl: z.string().default("ketabistudio.com"),
  // Auto-appended founding-list "ad" end card (on by default). The standalone
  // brand ad sets showOutro:false so it doesn't get a redundant second CTA.
  showOutro: z.boolean().default(true),
  ctaHeadline: z.string().default("Join the founding list"),
  ctaSeconds: z.number().default(4.5),
  segments: z.array(storySegmentSchema),
});

export type StoryProps = z.infer<typeof storyPropsSchema>;
export type StorySegment = z.infer<typeof storySegmentSchema>;
export type StoryWord = z.infer<typeof storyWordSchema>;
