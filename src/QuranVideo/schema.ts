import { z } from "zod";

// A colored slice of a word's text, used by Tajweed mode. `rule` is an
// authoritative tajweed class name (or null for an un-ruled slice).
export const tajweedRunSchema = z.object({
  text: z.string(),
  rule: z.string().nullable(),
});

// A single word with timing relative to its ayah's audio file (seconds).
export const wordSchema = z.object({
  text: z.string(),
  start: z.number(), // seconds from start of this ayah's audio
  end: z.number(),
  // Present only in Tajweed mode; concatenating run texts === `text`.
  runs: z.array(tajweedRunSchema).optional(),
});

export const ayahSchema = z.object({
  number: z.number(), // ayah number within the surah
  key: z.string(), // e.g. "112:1"
  arabic: z.string(),
  words: z.array(wordSchema),
  translation: z.string(),
  // Romanized pronunciation line (optional; shown when showTransliteration is on).
  transliteration: z.string().optional(),
  // Path under /public (e.g. "audio/112_7/112001.mp3") or an absolute URL.
  audioSrc: z.string(),
  durationInSeconds: z.number(),
});

export const themeSchema = z.enum(["midnight", "emerald", "sand"]);

// "standard" = clean word-by-word recitation.
// "hifz" = memorization drill: each ayah repeats while words progressively
// blank out so the viewer recites the gaps from memory.
// "tajweed" = letters colored by their authoritative tajweed rule.
export const modeSchema = z.enum(["standard", "hifz", "tajweed"]);

export const quranPropsSchema = z.object({
  surahNameEnglish: z.string(),
  surahNameArabic: z.string(),
  reciterName: z.string(),
  translationName: z.string(),
  theme: themeSchema,
  mode: modeSchema.default("standard"),
  // Hifz mode: how many times each ayah repeats. First pass is a full
  // read-along; middle passes hide the words and reveal each one just AFTER
  // the reciter says it (build-from-listening); the final pass stays hidden
  // for full recall, then reveals at the end as a check.
  hifzRepeats: z.number().int().min(2).max(8).default(4),
  // Show a romanized transliteration line under the Arabic (pronunciation aid
  // for non-Arabic speakers). Data is filled in per-ayah by the fetcher.
  showTransliteration: z.boolean().default(false),
  // Basmala shown on the intro card. ALWAYS sourced from the API by the
  // fetcher (empty for Surah at-Tawbah). The literal here is only a fallback
  // for offline preview and is never used for published renders.
  basmala: z.string().default("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"),
  // Channel name shown on the intro/outro cards (e.g. "Ketabi Studio").
  channelName: z.string().default("Ketabi Studio"),
  // Website call-to-action on the outro (promotes ketabistudio.com).
  websiteUrl: z.string().default("ketabistudio.com"),
  showCourseCta: z.boolean().default(true),
  // Small line above the CTA url ("Find more at" normally; for promo shorts,
  // e.g. "Watch the full lesson").
  ctaHeadline: z.string().default("Find more at"),
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
