import { z } from "zod";
import { themeSchema } from "./schema";

// A spoken word with its timing (seconds, relative to its own audio clip).
// Used to drive the big word-by-word "karaoke" captions.
export const shortWordSchema = z.object({
  text: z.string(),
  start: z.number(),
  end: z.number(),
});

// One beat of a fast-cut short. Every beat has its own narration audio +
// (usually) its own background B-roll clip, so the visual changes each line.
export const shortBeatSchema = z.object({
  kind: z.enum(["hook", "line", "point", "ayah", "cta"]),
  audioSrc: z.string(), // /public path or URL (Kokoro narration)
  fromSeconds: z.number(), // start offset within the whole video
  durationInSeconds: z.number(),

  // Karaoke captions (the actual spoken words, tightly synced).
  words: z.array(shortWordSchema).optional(),

  // Full-bleed background clip for this beat (public path or URL). When absent
  // the code-generated geometric backdrop is used instead.
  videoSrc: z.string().optional(),

  // Big number badge on "point" beats: "1", "2", "3".
  badge: z.string().optional(),
  // A short kicker over the caption, e.g. "PEOPLE ALLAH LOVES".
  kicker: z.string().optional(),
  // Small citation chip, e.g. "Qur'an 2:222 · Saheeh International".
  source: z.string().optional(),
  // Latin transliteration of the Arabic term, e.g. "At-Tawwābūn".
  translit: z.string().optional(),

  // "ayah" beats only: real Arabic (fetched from Quran.com, never hand-typed)
  // + a trusted translation.
  arabic: z.string().optional(),
  translation: z.string().optional(),
});

export const shortPropsSchema = z.object({
  title: z.string(),
  theme: themeSchema.default("emerald"),
  voiceName: z.string().default("Kokoro · bm_george"),
  handle: z.string().default("@ketabi"),
  websiteUrl: z.string().default("ketabistudio.com"),
  // Show a thin top progress bar (helps retention on Shorts/Reels).
  progressBar: z.boolean().default(true),
  beats: z.array(shortBeatSchema),
});

export type ShortProps = z.infer<typeof shortPropsSchema>;
export type ShortBeat = z.infer<typeof shortBeatSchema>;
export type ShortWord = z.infer<typeof shortWordSchema>;
