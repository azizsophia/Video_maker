import React from "react";
import {
  AbsoluteFill,
  Img,
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
// each slide with a slow cinematic push-in and crossfade, then a download CTA
// card. Silent by design (works muted with the baked-in headlines); on-brand
// for an Islamic app (no instrumental music). Colours sampled from the slides.

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

export const appPromoDurationInFrames = (p: AppPromoProps): number => {
  const intro = Math.round(p.introSeconds * PROMO_FPS);
  const slide = Math.round(p.slideSeconds * PROMO_FPS);
  const outro = Math.round(p.outroSeconds * PROMO_FPS);
  // Slides overlap each neighbour by crossfadeFrames; intro/outro overlap too.
  const advance = slide - p.crossfadeFrames;
  return intro + advance * p.slides.length + outro;
};

// One full-frame slide with a slow push-in (Ken Burns on the flat-cream slide
// reads as a gentle camera dolly toward the phone) and symmetric crossfade.
const Slide: React.FC<{ src: string; durationInFrames: number; fade: number }> = ({
  src,
  durationInFrames,
  fade,
}) => {
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

const IntroCard: React.FC<{ durationInFrames: number; fade: number }> = ({
  durationInFrames,
  fade,
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
    </AbsoluteFill>
  );
};

const OutroCard: React.FC<{ durationInFrames: number; fade: number }> = ({
  durationInFrames,
  fade,
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
    </AbsoluteFill>
  );
};

export const AppPromo: React.FC<AppPromoProps> = (props) => {
  const intro = Math.round(props.introSeconds * PROMO_FPS);
  const slide = Math.round(props.slideSeconds * PROMO_FPS);
  const outro = Math.round(props.outroSeconds * PROMO_FPS);
  const fade = props.crossfadeFrames;
  const advance = slide - fade;

  let cursor = 0;
  const introFrom = cursor;
  cursor += intro - fade;

  const slideStarts = props.slides.map((_, i) => introFrom + (intro - fade) + i * advance);
  const outroFrom = introFrom + (intro - fade) + props.slides.length * advance;

  return (
    <AbsoluteFill style={{ backgroundColor: CREAM }}>
      <Sequence from={introFrom} durationInFrames={intro}>
        <IntroCard durationInFrames={intro} fade={fade} />
      </Sequence>

      {props.slides.map((src, i) => (
        <Sequence key={src} from={slideStarts[i]} durationInFrames={slide}>
          <Slide src={src} durationInFrames={slide} fade={fade} />
        </Sequence>
      ))}

      <Sequence from={outroFrom} durationInFrames={outro}>
        <OutroCard durationInFrames={outro} fade={fade} />
      </Sequence>
    </AbsoluteFill>
  );
};
