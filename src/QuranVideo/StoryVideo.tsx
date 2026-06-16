import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
} from "remotion";
import { StoryProps, StorySegment, StoryWord } from "./storySchema";
import { themes, ThemePalette } from "./themes";
import { Background } from "./Background";
import { ARABIC_DISPLAY_FONT, TRANSLATION_FONT } from "./fonts";

export const STORY_FPS = 30;
const EMBER = "rgba(255, 176, 92, 1)"; // warm ember tint for atmosphere

const resolveAudio = (src: string): string =>
  /^https?:\/\//.test(src) ? src : staticFile(src);

export const storyDurationInFrames = (props: StoryProps): number => {
  const end = props.segments.reduce(
    (m, s) => Math.max(m, s.fromSeconds + s.durationInSeconds),
    0
  );
  return Math.max(1, Math.round((end + 0.6) * STORY_FPS));
};

// --- Atmosphere: slowly drifting embers/dust, behind everything ---------------
const Embers: React.FC<{ count?: number; warm?: boolean }> = ({ count = 26, warm }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const span = height + 200;
  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const seed = i + 1;
        const x = random(`x${seed}`) * width;
        const size = 2 + random(`s${seed}`) * 5;
        const speed = 0.6 + random(`v${seed}`) * 1.4;
        const raw = random(`y${seed}`) * span + frame * speed;
        const y = span - (raw % span) - 100;
        const drift = Math.sin(frame / fps + seed) * 26;
        const flick = 0.25 + 0.55 * Math.abs(Math.sin(frame / fps * 1.6 + seed));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + drift,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: warm ? EMBER : "rgba(220,235,255,0.9)",
              opacity: flick * (warm ? 0.7 : 0.4),
              filter: "blur(1px)",
              boxShadow: `0 0 ${size * 3}px ${warm ? EMBER : "rgba(200,225,255,0.8)"}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Slow-moving soft fog blobs for depth.
const Fog: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", opacity: 0.5 }}>
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          left: 200 + Math.sin(t * 0.15) * 120,
          top: 300 + Math.cos(t * 0.12) * 100,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(60,90,140,0.18), transparent 60%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1200,
          height: 1200,
          right: 150 + Math.cos(t * 0.1) * 110,
          bottom: 200 + Math.sin(t * 0.13) * 120,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(40,60,100,0.16), transparent 60%)",
        }}
      />
    </AbsoluteFill>
  );
};

// --- Narration captions (synced, dramatic) ------------------------------------
const toLines = (words: StoryWord[], perLine = 4) => {
  const lines: { words: StoryWord[]; start: number; end: number }[] = [];
  for (let i = 0; i < words.length; i += perLine) {
    const chunk = words.slice(i, i + perLine);
    if (chunk.length)
      lines.push({ words: chunk, start: chunk[0].start, end: chunk[chunk.length - 1].end });
  }
  return lines;
};

const Narration: React.FC<{
  words?: StoryWord[];
  source?: string;
  hook?: boolean;
  theme: ThemePalette;
}> = ({ words = [], source, hook, theme }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const lines = toLines(words);
  let idx = 0;
  for (let i = 0; i < lines.length; i++) if (t >= lines[i].start - 0.12) idx = i;
  const line = lines[idx];
  const lineFrame = frame - Math.round((line?.start ?? 0) * fps);
  const appear = spring({ frame: lineFrame, fps, config: { damping: 200 } });
  const kb = interpolate(frame, [0, durationInFrames], [1, 1.05]);
  const fontSize = hook ? 76 : 60;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 86px" }}>
      <div
        style={{
          transform: `scale(${kb})`,
          fontFamily: TRANSLATION_FONT,
          fontSize,
          fontWeight: 800,
          lineHeight: 1.28,
          textAlign: "center",
          color: "#ffffff",
          textShadow: "0 6px 36px rgba(0,0,0,0.85)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 18px",
          opacity: Math.min(1, appear + 0.15),
        }}
      >
        {line?.words.map((w, i) => {
          const active = t >= w.start - 0.04 && t < w.end + 0.12;
          const seen = t >= w.start - 0.04;
          return (
            <span
              key={i}
              style={{
                color: active ? theme.accent : "#ffffff",
                opacity: seen ? 1 : 0.25,
                transform: `translateY(${(1 - appear) * 18}px) scale(${active ? 1.07 : 1})`,
                display: "inline-block",
                transition: "color 0.08s linear, opacity 0.12s linear",
                textShadow: active ? `0 0 26px ${theme.arabicGlow}` : "0 6px 36px rgba(0,0,0,0.85)",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
      {source ? (
        <div
          style={{
            position: "absolute",
            bottom: 232,
            fontFamily: TRANSLATION_FONT,
            fontSize: 26,
            letterSpacing: 1.5,
            color: theme.accent,
            opacity: 0.9,
            background: "rgba(0,0,0,0.4)",
            padding: "9px 20px",
            borderRadius: 22,
            border: `1px solid ${theme.accent}55`,
          }}
        >
          {source}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// --- Ayah card (dramatic; molten "ember" variant for the wall) ----------------
const AyahCard: React.FC<{
  arabic?: string;
  translation?: string;
  source?: string;
  ember?: boolean;
  theme: ThemePalette;
}> = ({ arabic, translation, source, ember, theme }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 16, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const transReveal = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const kb = interpolate(frame, [0, durationInFrames], [1.02, 1.09]);
  const glow = ember ? "rgba(255,150,60,0.75)" : theme.arabicGlow;
  const arabicColor = ember ? "#fff1e0" : theme.arabicActive;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 76px", opacity }}>
      {ember ? (
        <AbsoluteFill
          style={{
            background: "radial-gradient(circle at 50% 45%, rgba(255,120,40,0.22), transparent 55%)",
          }}
        />
      ) : null}
      <div style={{ transform: `scale(${kb})`, textAlign: "center" }}>
        <div
          dir="rtl"
          style={{
            fontFamily: ARABIC_DISPLAY_FONT,
            fontWeight: 700,
            fontSize: 104,
            lineHeight: 1.7,
            color: arabicColor,
            textShadow: `0 0 46px ${glow}`,
          }}
        >
          {arabic}
        </div>
        <div
          style={{
            marginTop: 54,
            maxWidth: 900,
            fontFamily: TRANSLATION_FONT,
            fontSize: 44,
            lineHeight: 1.45,
            color: theme.translation,
            opacity: transReveal,
            transform: `translateY(${(1 - transReveal) * 22}px)`,
          }}
        >
          {translation}
        </div>
        {source ? (
          <div
            style={{
              marginTop: 40,
              fontFamily: TRANSLATION_FONT,
              fontSize: 26,
              letterSpacing: 2.5,
              color: ember ? "#ffb060" : theme.accent,
              opacity: transReveal * 0.95,
              textTransform: "uppercase",
            }}
          >
            {source}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const StoryVideo: React.FC<StoryProps> = (props) => {
  const theme = themes[props.theme];
  return (
    <AbsoluteFill style={{ backgroundColor: theme.background }}>
      <Background theme={theme} />
      <Fog />
      <Embers />
      {/* Cinematic darken + top light. */}
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.32)" }} />
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 18%, rgba(120,150,210,0.12), transparent 45%)",
        }}
      />

      {/* Atmospheric bed (sound effect, never music). */}
      {props.ambientSrc ? (
        <Audio src={resolveAudio(props.ambientSrc)} loop volume={0.16} />
      ) : null}

      {props.segments.map((seg: StorySegment, i: number) => {
        const from = Math.round(seg.fromSeconds * STORY_FPS);
        const dur = Math.round(seg.durationInSeconds * STORY_FPS);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Audio src={resolveAudio(seg.audioSrc)} />
            {seg.sfxSrc ? <Audio src={resolveAudio(seg.sfxSrc)} volume={0.55} /> : null}
            {seg.ember ? <Embers warm count={34} /> : null}
            {seg.kind === "narration" ? (
              <Narration words={seg.words} source={seg.source} hook={seg.hook} theme={theme} />
            ) : (
              <AyahCard
                arabic={seg.arabic}
                translation={seg.translation}
                source={seg.source}
                ember={seg.ember}
                theme={theme}
              />
            )}
          </Sequence>
        );
      })}

      {/* Edge vignette for cinematic framing. */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 45%, transparent 30%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Subtle persistent brand chip. */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 64 }}>
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontSize: 26,
            letterSpacing: 3,
            color: theme.accent,
            opacity: 0.65,
          }}
        >
          {props.websiteUrl}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
