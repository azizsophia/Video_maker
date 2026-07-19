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
  videoSrc: z.string().optional(), // cinematic: background clip (remote Pexels URL or /public path)
  imageSrc: z.string().optional(), // cinematic: background STILL (remote/public URL) — Ken Burns pan, never freezes
  videoDuration: z.number().optional(), // clip length in seconds — slows playback to fill the beat (no end freeze)
  title: z.string().optional(), // cinematic film-open: gold-on-black title card over the beat
  titleSub: z.string().optional(), // small line under the title (e.g. "alayhi salam")
  // 99-Names series signature card: the Name of Allah in gold Arabic script,
  // its transliteration, and its English meaning, read deep. Captions suppressed.
  nameArabic: z.string().optional(), // the Name in Arabic (gold), e.g. "ٱلسَّمِيع"
  nameTranslit: z.string().optional(), // transliteration, e.g. "As-Samee'"
  nameMeaning: z.string().optional(), // English meaning, e.g. "The All-Hearing"
  hook: z.boolean().optional(), // aura intro: render the spoken line as a hook with a gold highlight sweep
  hookMark: z.string().optional(), // the word/phrase in the hook to sweep-highlight in gold
  dim: z.number().optional(), // extra darkening (0..1) for clips that are too bright for the grade
  // ayah
  arabic: z.string().optional(),
  arabicText: z.string().optional(), // manual Arabic clause to SHOW (not fetched from `quote`)
  translation: z.string().optional(),
});

export const storyPropsSchema = z.object({
  title: z.string(),
  theme: themeSchema.default("midnight"),
  reciterName: z.string().default("Sheikh Abdur-Rahman as-Sudais"),
  voiceName: z.string().default("Daniel"),
  websiteUrl: z.string().default("ketabistudio.com"),
  // Auto-appended end card (on by default). The standalone brand ad sets
  // showOutro:false so it doesn't get a redundant second CTA.
  //
  // Website-first CTA: the ask names the action ("Join the founding list") and
  // shows the destination (ctaShowUrl -> the websiteUrl as a gold button), so
  // viewers know exactly where to go to join the waitlist. Kept to the end card
  // only — never over an ayah / the spiritual climax (adab). The bio + a pinned
  // comment carry the link too.
  showOutro: z.boolean().default(true),
  // Default outro = the ParallaxAd product spot (keepsake books + "Join the
  // waitlist · ketabistudio.com"). Set false for the lightweight text end card.
  outroAd: z.boolean().default(true),
  adSeconds: z.number().default(8),
  ctaHeadline: z.string().default("Join the founding list"),
  // Optional handle, rendered small as "or follow @handle". Empty -> hidden.
  ctaHandle: z.string().default(""),
  // Optional value line under the headline (e.g. the waitlist benefit). Empty -> hidden.
  ctaSub: z.string().default("Founding members get 15% off the first order."),
  // Optional comment-keyword funnel (off by default): viewers comment this word
  // and you reply with the link. Empty -> the line is hidden.
  ctaComment: z.string().default(""),
  // Show the website url as the clear destination button. On by default — the
  // funnel goal is signups at the site.
  ctaShowUrl: z.boolean().default(true),
  // A produced video file (in public/) played as the outro instead of the
  // code-generated ad. Takes precedence over outroAd.
  outroVideoSrc: z.string().optional(),
  ctaSeconds: z.number().default(5.5),
  // Cinematic mode: full-bleed stock footage backgrounds + calm captions.
  cinematic: z.boolean().default(false),
  // Kids channel (single still background): per-image ambient motion. Each cosy
  // image declares only the effects that fit it, so a rainy window gets rain and
  // a clear starry night does not. All optional / off by default.
  ambient: z
    .object({
      rain: z.boolean().optional(), // animated rain over the window view
      flame: z.string().optional(), // CSS position of a flickering flame glow, e.g. "81% 77%"
      stars: z.boolean().optional(), // gentle star twinkle over the upper sky
    })
    .optional(),
  // Background audio bed (e.g. a vocal-only nasheed) mixed LOW under the
  // narration. Path under /public (e.g. "audio/nasheed-bed.mp3") or a URL. Loops
  // to fill the content. Volume is linear: 0.12 ~= -18dB (felt, not heard).
  musicSrc: z.string().optional(),
  musicVolume: z.number().default(0.12),
  segments: z.array(storySegmentSchema),
});

export type StoryProps = z.infer<typeof storyPropsSchema>;
export type StorySegment = z.infer<typeof storySegmentSchema>;
export type StoryWord = z.infer<typeof storyWordSchema>;
