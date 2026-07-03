import React from "react";
import {
  AbsoluteFill,
  Img,
  Audio,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  spring,
} from "remotion";
import { z } from "zod";
import { PLAYFAIR, CORMORANT, JOST } from "./luxFonts";

// Standalone app-promo reel for Ketabi (9:16). Turns the six pre-designed
// marketing slides (public/promo/*.png, cream ground + gold wordmark + green
// serif headline baked in) into a premium motion video: a branded hook card,
// each slide with a slow cinematic push-in and quick crossfade, then a download
// CTA card. Optional warm Daniel voiceover per beat (paced so each line lands on
// its slide) - when audio + per-beat durations are supplied via props the beats
// stretch to the narration; with no audio it plays silent on uniform timings.
// On-brand for an Islamic app: no instrumental music. Colours sampled from the
// slides.

export const PROMO_FPS = 30;

const CREAM = "#f5f0e6";
const GREEN = "#273428";
const GOLD = "#b39a63";

export const appPromoSchema = z.object({
  slides: z.array(z.string()),
  introSeconds: z.number(),
  slideSeconds: z.number(),
  outroSeconds: z.number(),
  crossfadeFrames: z.number(),
  // Optional voiceover track (fetch-promo.ts fills these). Same order as slides.
  slideAudio: z.array(z.string()).optional(),
  slideDurations: z.array(z.number()).optional(),
  introAudio: z.string().optional(),
  outroAudio: z.string().optional(),
});
export type AppPromoProps = z.infer<typeof appPromoSchema>;

export const DEFAULT_PROMO_PROPS: AppPromoProps = {
  // The five feature slides; slide 6 (cta) is intentionally omitted because the
  // branded OutroCard is the stronger, non-duplicate close.
  slides: [
    "promo/1_hook.png",
    "promo/2_checkin.png",
    "promo/3_adhkar.png",
    "promo/4_garden.png",
    "promo/5_journal.png",
  ],
  introSeconds: 2.1,
  slideSeconds: 2.7,
  outroSeconds: 3.4,
  crossfadeFrames: 9,
};

// Frames for each beat: intro, one per slide, outro. Honors per-beat VO
// durations when present, else the uniform defaults.
const beatFrames = (p: AppPromoProps) => {
  const introF = Math.round(p.introSeconds * PROMO_FPS);
  const outroF = Math.round(p.outroSeconds * PROMO_FPS);
  const slideF = p.slides.map((_, i) =>
    Math.round((p.slideDurations?.[i] ?? p.slideSeconds) * PROMO_FPS)
  );
  return { introF, slideF, outroF };
};

export const appPromoDurationInFrames = (p: AppPromoProps): number => {
  const { introF, slideF, outroF } = beatFrames(p);
  const all = [introF, ...slideF, outroF];
  // Each beat overlaps its neighbour by the crossfade.
  return all.reduce((sum, f) => sum + f, 0) - p.crossfadeFrames * (all.length - 1);
};

const BeatAudio: React.FC<{ src?: string }> = ({ src }) =>
  src ? <Audio src={staticFile(src)} startFrom={0} /> : null;

// One full-frame slide with a slow push-in (Ken Burns on the flat-cream slide
// reads as a gentle camera dolly toward the phone) and symmetric crossfade.
const Slide: React.FC<{
  src: string;
  durationInFrames: number;
  fade: number;
  audio?: string;
}> = ({ src, durationInFrames, fade, audio }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, fade, durationInFrames - fade, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const scale = interpolate(frame, [0, durationInFrames], [1.015, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: CREAM }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <BeatAudio src={audio} />
    </AbsoluteFill>
  );
};

const Wordmark: React.FC<{ delay?: number; size?: number }> = ({ delay = 0, size = 30 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = spring({ frame: frame - delay, fps, config: { damping: 200 }, durationInFrames: 24 });
  return (
    <div
      style={{
        fontFamily: JOST,
        fontWeight: 400,
        letterSpacing: 14,
        fontSize: size,
        color: GOLD,
        opacity: o,
      }}
    >
      KETABI
    </div>
  );
};

const IntroCard: React.FC<{ durationInFrames: number; fade: number; audio?: string }> = ({
  durationInFrames,
  fade,
  audio,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardOpacity = interpolate(
    frame,
    [0, 12, durationInFrames - fade, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const line = spring({ frame: frame - 12, fps, config: { damping: 200 }, durationInFrames: 30 });
  const lift = interpolate(line, [0, 1], [26, 0]);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: CREAM,
        opacity: cardOpacity,
        alignItems: "center",
        justifyContent: "center",
        padding: 90,
      }}
    >
      <Wordmark delay={0} size={30} />
      <div
        style={{
          marginTop: 44,
          fontFamily: PLAYFAIR,
          fontWeight: 500,
          fontSize: 82,
          lineHeight: 1.12,
          color: GREEN,
          textAlign: "center",
          opacity: line,
          transform: `translateY(${lift}px)`,
        }}
      >
        one quiet home
        <br />
        for your{" "}
        <span style={{ fontFamily: CORMORANT, fontStyle: "italic", fontWeight: 600 }}>
          whole deen
        </span>
      </div>
      <BeatAudio src={audio} />
    </AbsoluteFill>
  );
};

const OutroCard: React.FC<{ durationInFrames: number; fade: number; audio?: string }> = ({
  durationInFrames,
  fade,
  audio,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cardOpacity = interpolate(
    frame,
    [0, fade, durationInFrames - 6, durationInFrames],
    [0, 1, 1, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const head = spring({ frame: frame - 8, fps, config: { damping: 200 }, durationInFrames: 30 });
  const cta = spring({ frame: frame - 26, fps, config: { damping: 200 }, durationInFrames: 30 });
  const url = spring({ frame: frame - 40, fps, config: { damping: 200 }, durationInFrames: 30 });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: CREAM,
        opacity: cardOpacity,
        alignItems: "center",
        justifyContent: "center",
        padding: 90,
      }}
    >
      <Wordmark delay={0} size={30} />
      <div
        style={{
          marginTop: 40,
          fontFamily: PLAYFAIR,
          fontWeight: 500,
          fontSize: 76,
          lineHeight: 1.12,
          color: GREEN,
          textAlign: "center",
          opacity: head,
          transform: `translateY(${interpolate(head, [0, 1], [22, 0])}px)`,
        }}
      >
        begin whenever
        <br />
        <span style={{ fontFamily: CORMORANT, fontStyle: "italic", fontWeight: 600 }}>
          you&apos;re ready
        </span>
      </div>

      <div
        style={{
          marginTop: 54,
          opacity: cta,
          transform: `translateY(${interpolate(cta, [0, 1], [16, 0])}px)`,
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: JOST, fontWeight: 300, fontSize: 33, color: GREEN }}>
          Free on the App Store and Google Play
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: JOST,
            fontWeight: 400,
            fontSize: 24,
            letterSpacing: 4,
            color: GOLD,
            textTransform: "uppercase",
          }}
        >
          your Islamic companion
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 150,
          fontFamily: JOST,
          fontWeight: 400,
          fontSize: 30,
          letterSpacing: 8,
          color: GOLD,
          opacity: url,
        }}
      >
        KETABISTUDIO.COM
      </div>
      <BeatAudio src={audio} />
    </AbsoluteFill>
  );
};

export const AppPromo: React.FC<AppPromoProps> = (props) => {
  const { introF, slideF, outroF } = beatFrames(props);
  const fade = props.crossfadeFrames;

  // Place beats sequentially, each overlapping the previous by `fade`.
  const starts: number[] = [];
  let cursor = 0;
  const durations = [introF, ...slideF, outroF];
  durations.forEach((d, i) => {
    starts.push(cursor);
    cursor += d - fade;
  });
  const introFrom = starts[0];
  const slideStarts = starts.slice(1, 1 + props.slides.length);
  const outroFrom = starts[starts.length - 1];

  return (
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      <Sequence from={introFrom} durationInFrames={introF}>
        <IntroCard durationInFrames={introF} fade={fade} audio={props.introAudio} />
      </Sequence>

      {props.slides.map((src, i) => (
        <Sequence key={src} from={slideStarts[i]} durationInFrames={slideF[i]}>
          <Slide
            src={src}
            durationInFrames={slideF[i]}
            fade={fade}
            audio={props.slideAudio?.[i]}
          />
        </Sequence>
      ))}

      <Sequence from={outroFrom} durationInFrames={outroF}>
        <OutroCard durationInFrames={outroF} fade={fade} audio={props.outroAudio} />
      </Sequence>
    </AbsoluteFill>
  );
};
