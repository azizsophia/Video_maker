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

// "standard" = clean word-by-word recitation.
// "hifz" = memorization drill: each ayah repeats while words progressively
// blank out so the viewer recites the gaps from memory.
export const modeSchema = z.enum(["standard", "hifz"]);

export const quranPropsSchema = z.object({
  surahNameEnglish: z.string(),
  surahNameArabic: z.string(),
  reciterName: z.string(),
  translationName: z.string(),
  theme: themeSchema,
  mode: modeSchema.default("standard"),
  // Hifz mode: how many times each ayah repeats (first pass full text,
  // last pass fully blanked — "recite from memory").
  hifzRepeats: z.number().int().min(2).max(8).default(4),
  // Channel name shown on the intro/outro cards (e.g. "Ketabi Studio").
  channelName: z.string().default("Ketabi Studio"),
  // Gap of silence held between ayahs (seconds) for breathing room.
  ayahGapSeconds: z.number().default(0.4),
  // Animated title/closing cards that bracket the recitation and help videos
  // comfortably reach the 60s+ length good for Shorts/Reels.
  introSeconds: z.number().default(5),
  outroSeconds: z.number().default(4),
  // Anti-theft watermark: a faint, slowly drifting brand mark.
  watermarkSrc: z.string().default("brand/ketabi-mark.png"),
  watermarkOpacity: z.number().default(0.1),
  ayahs: z.array(ayahSchema),
});

export type QuranProps = z.infer<typeof quranPropsSchema>;
export type Ayah = z.infer<typeof ayahSchema>;
export type Word = z.infer<typeof wordSchema>;
