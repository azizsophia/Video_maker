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
  // ayah
  arabic: z.string().optional(),
  translation: z.string().optional(),
  // effects
  sfxSrc: z.string().optional(), // one-shot sound effect at segment start
  ember: z.boolean().optional(), // warm molten-iron treatment (the wall moment)
  hook: z.boolean().optional(), // scroll-stopper styling for the opening
  scene: z.string().optional(), // illustrated backdrop (see scenes.tsx)
  data: z.any().optional(), // arbitrary content for data-driven scenes (Decoded kit)
  stock: z.string().optional(), // cached Pexels footage path (real cinematic backdrop)
});

export const storyPropsSchema = z.object({
  title: z.string(),
  theme: themeSchema.default("midnight"),
  reciterName: z.string().default("Sheikh Abdur-Rahman as-Sudais"),
  voiceName: z.string().default("Daniel"),
  websiteUrl: z.string().default("ketabistudio.com"),
  ambientSrc: z.string().optional(), // looping atmospheric bed (sound effect, never music)
  ambientDuration: z.number().optional(),
  segments: z.array(storySegmentSchema),
});

export type StoryProps = z.infer<typeof storyPropsSchema>;
export type StorySegment = z.infer<typeof storySegmentSchema>;
export type StoryWord = z.infer<typeof storyWordSchema>;
