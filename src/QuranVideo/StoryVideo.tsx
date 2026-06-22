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
import { SceneLayer } from "./scenes";
import { FULL_VISUAL_SCENES } from "./explainer";
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
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const wide = width > height;
  const t = frame / fps;
  const lines = toLines(words, wide ? 5 : 3);
  let idx = 0;
  for (let i = 0; i < lines.length; i++) if (t >= lines[i].start - 0.12) idx = i;
  const line = lines[idx];
  const lineFrame = frame - Math.round((line?.start ?? 0) * fps);
  const appear = spring({ frame: lineFrame, fps, config: { damping: 200 } });
  const kb = interpolate(frame, [0, durationInFrames], [1, 1.05]);
  const fontSize = (hook ? 104 : 86) * (wide ? 0.8 : 1);

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: wide ? "0 150px" : "0 70px" }}
    >
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
          opacity: Math.min(1, appear + 0.15),
        }}
      >
        {line?.words.map((w, i) => {
          const active = t >= w.start - 0.04 && t < w.end + 0.12;
          const seen = t >= w.start - 0.04;
          // Ketabi brand caption palette: cream base, gold keyword highlight.
          const CREAM = "#f3ecda";
          const GOLD = "#e7c163";
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  color: active ? GOLD : CREAM,
                  opacity: seen ? 1 : 0.25,
                  transform: `translateY(${(1 - appear) * 18}px) scale(${active ? 1.04 : 1})`,
                  display: "inline-block",
                  transition: "color 0.08s linear, opacity 0.12s linear",
                  textShadow: active
                    ? `0 0 26px rgba(231,193,99,0.55), 0 4px 18px rgba(0,0,0,0.85)`
                    : "0 4px 18px rgba(0,0,0,0.9)",
                }}
              >
                {w.text}
              </span>
              {i < (line?.words.length ?? 0) - 1 ? " " : ""}
            </React.Fragment>
          );
        })}
      </div>
      {source ? (
        <div
          style={{
            position: "absolute",
            bottom: wide ? 96 : 232,
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
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const wide = width > height;
  const fadeIn = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 16, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const transReveal = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const kb = interpolate(frame, [0, durationInFrames], [1.02, 1.06]);
  const glow = ember ? "rgba(255,150,60,0.75)" : theme.arabicGlow;
  const arabicColor = ember ? "#fff1e0" : theme.arabicActive;

  // Auto-fit: long verses (e.g. Ayat al-Kursi, 2:255) must never overflow or
  // clip. Scale the Arabic + translation down by character count so the whole
  // ayah and its translation always sit inside the (TikTok/Shorts-safe) frame.
  const alen = (arabic ?? "").length;
  const arabicSize = wide
    ? alen > 260 ? 44 : alen > 180 ? 56 : alen > 120 ? 68 : alen > 60 ? 82 : 92
    : alen > 260 ? 50 : alen > 180 ? 60 : alen > 120 ? 74 : alen > 60 ? 90 : 104;
  const tlen = (translation ?? "").length;
  const transSize = wide
    ? tlen > 220 ? 32 : 40
    : tlen > 220 ? 34 : tlen > 120 ? 40 : 44;

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: wide ? "0 150px" : "190px 70px", opacity }}
    >
      {ember ? (
        <AbsoluteFill
          style={{
            background: "radial-gradient(circle at 50% 45%, rgba(255,120,40,0.22), transparent 55%)",
          }}
        />
      ) : null}
      <div
        style={{
          transform: `scale(${kb})`,
          textAlign: "center",
          maxHeight: height * (wide ? 0.82 : 0.7),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          dir="rtl"
          style={{
            fontFamily: ARABIC_DISPLAY_FONT,
            fontWeight: 700,
            fontSize: arabicSize,
            lineHeight: 1.62,
            maxWidth: wide ? 1500 : 960,
            color: arabicColor,
            textShadow: `0 0 46px ${glow}`,
          }}
        >
          {arabic}
        </div>
        <div
          style={{
            marginTop: wide ? 30 : 40,
            maxWidth: wide ? 1300 : 920,
            fontFamily: TRANSLATION_FONT,
            fontSize: transSize,
            lineHeight: 1.42,
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

// Cinematic legibility gradient shown over footage beats (darker top + bottom,
// lighter middle) so the calligraphy/captions stay readable on the footage.
// Semi-transparent, so in footage (alpha) mode the footage still shows through.
const FootageGradient: React.FC = () => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 38%, rgba(0,0,0,0.2) 62%, rgba(0,0,0,0.72) 100%)" }} />
);

export const StoryVideo: React.FC<StoryProps> = (props) => {
  const theme = themes[props.theme];
  // Footage mode: the Pexels footage is composited UNDER this render by ffmpeg
  // (see render-story.yml), NOT decoded inside Remotion — putting video in
  // Remotion is a ~5x render slowdown on the CI runner. So in footage mode the
  // root is transparent (alpha render), footage beats are just a gradient + text
  // that the ffmpeg overlay shows footage through, and code-scene beats stay
  // opaque (covering the footage where there is none).
  const footageMode = !!props.backgroundSrc;
  // Group consecutive segments sharing a scene so the illustrated backdrop only
  // crossfades on real scene changes.
  const spans: { scene?: string; data?: unknown; stock?: string; start: number; end: number }[] = [];
  props.segments.forEach((s) => {
    const last = spans[spans.length - 1];
    const end = s.fromSeconds + s.durationInSeconds;
    const stock = (s as { stock?: string }).stock;
    if (last && last.scene === s.scene && last.stock === stock) last.end = end;
    else spans.push({ scene: s.scene, data: (s as { data?: unknown }).data, stock, start: s.fromSeconds, end });
  });

  return (
    <AbsoluteFill style={{ backgroundColor: footageMode ? "transparent" : theme.background }}>
      {spans.map((sp, i) => {
        const isFootage = !!sp.stock && footageMode;
        // Code scenes get ±frames of padding so the illustrated backdrop
        // crossfades smoothly; footage gradients use exact bounds so adjacent
        // beats abut without overlapping (overlap would double-darken).
        const from = isFootage
          ? Math.round(sp.start * STORY_FPS)
          : Math.max(0, Math.round(sp.start * STORY_FPS) - 8);
        const dur = isFootage
          ? Math.max(1, Math.round((sp.end - sp.start) * STORY_FPS))
          : Math.round((sp.end - sp.start) * STORY_FPS) + 16;
        return (
          <Sequence key={`scene-${i}`} from={from} durationInFrames={dur}>
            {isFootage ? (
              <FootageGradient />
            ) : (
              <SceneLayer name={sp.scene} theme={theme} data={sp.data} />
            )}
          </Sequence>
        );
      })}
      {/* Gentle darken for caption legibility (skip in footage mode — the
          FootageGradient already handles it and we want the footage crisp). */}
      {footageMode ? null : <AbsoluteFill style={{ background: "rgba(0,0,0,0.24)" }} />}

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
            {FULL_VISUAL_SCENES.includes(seg.scene ?? "") ? null : seg.kind === "narration" && seg.arabic ? (
              <AyahCard
                arabic={seg.arabic}
                translation={seg.translation}
                source={seg.source}
                theme={theme}
              />
            ) : seg.kind === "narration" ? (
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
