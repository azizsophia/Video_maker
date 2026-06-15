import { z } from "zod";

// A single word with timing relative to its ayah's audio file (seconds).
export const wordSchema = z.object({
  text: z.string(),
  start: z.number(), // seconds from start of this ayah's audio
  end: z.number(),
});

export const ayahSchema = z.object({
  number: z.number(), // ayah number within the surah
  key: z.string(), // e.g. "112:1"
  arabic: z.string(),
  words: z.array(wordSchema),
  translation: z.string(),
  // Path under /public (e.g. "audio/112_7/112001.mp3") or an absolute URL.
  audioSrc: z.string(),
  durationInSeconds: z.number(),
});

export const themeSchema = z.enum(["midnight", "emerald", "sand"]);

export const quranPropsSchema = z.object({
  surahNameEnglish: z.string(),
  surahNameArabic: z.string(),
  reciterName: z.string(),
  translationName: z.string(),
  theme: themeSchema,
  // Channel name shown on the intro/outro cards (e.g. "Ketabi Studio").
  channelName: z.string().default("Ketabi Studio"),
  // Gap of silence held between ayahs (seconds) for breathing room.
  ayahGapSeconds: z.number().default(0.4),
  // Animated title/closing cards that bracket the recitation and help videos
  // comfortably reach the 60s+ length good for Shorts/Reels.
  introSeconds: z.number().default(5),
  outroSeconds: z.number().default(4),
  ayahs: z.array(ayahSchema),
});

export type QuranProps = z.infer<typeof quranPropsSchema>;
export type Ayah = z.infer<typeof ayahSchema>;
export type Word = z.infer<typeof wordSchema>;
