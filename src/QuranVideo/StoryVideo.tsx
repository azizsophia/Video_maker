import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { StoryProps, StorySegment, StoryWord } from "./storySchema";
import { themes, ThemePalette } from "./themes";
import { Background } from "./Background";
import { StoryMap } from "./StoryMap";
import { ARABIC_DISPLAY_FONT, TRANSLATION_FONT } from "./fonts";

export const STORY_FPS = 30;

const resolveAudio = (src: string): string =>
  /^https?:\/\//.test(src) ? src : staticFile(src);

const contentEndSeconds = (props: StoryProps): number =>
  props.segments.reduce((m, s) => Math.max(m, s.fromSeconds + s.durationInSeconds), 0);

export const storyDurationInFrames = (props: StoryProps): number => {
  const end = contentEndSeconds(props);
  const outro = props.showOutro ? props.ctaSeconds ?? 3.5 : 0;
  return Math.max(1, Math.round((end + outro + 0.5) * STORY_FPS));
};

// Group words into short caption lines (subtitle style).
const toLines = (words: StoryWord[], perLine = 5) => {
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
  theme: ThemePalette;
  align?: "center" | "bottom";
}> = ({ words = [], source, theme, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lines = toLines(words);
  // current line = last line whose start has passed
  let idx = 0;
  for (let i = 0; i < lines.length; i++) if (t >= lines[i].start - 0.15) idx = i;
  const line = lines[idx];
  const appear = spring({ frame: frame - Math.round((line?.start ?? 0) * fps), fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: align === "bottom" ? "flex-end" : "center",
        alignItems: "center",
        padding: "0 90px",
        paddingBottom: align === "bottom" ? 360 : 0,
      }}
    >
      <div
        style={{
          fontFamily: TRANSLATION_FONT,
          fontSize: 62,
          fontWeight: 800,
          lineHeight: 1.3,
          textAlign: "center",
          color: "#ffffff",
          textShadow: "0 4px 30px rgba(0,0,0,0.8)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 16px",
          transform: `translateY(${(1 - appear) * 24}px)`,
        }}
      >
        {line?.words.map((w, i) => {
          const active = t >= w.start - 0.05 && t < w.end + 0.05;
          return (
            <span
              key={i}
              style={{
                color: active ? theme.accent : "#ffffff",
                transform: active ? "scale(1.06)" : "scale(1)",
                display: "inline-block",
                transition: "color 0.1s linear",
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
            bottom: 230,
            fontFamily: TRANSLATION_FONT,
            fontSize: 26,
            letterSpacing: 1,
            color: theme.accent,
            opacity: 0.85,
            background: "rgba(0,0,0,0.35)",
            padding: "8px 18px",
            borderRadius: 20,
          }}
        >
          {source}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Arabic verse shown on screen (NOT recited) above a narration beat — the voice
// only speaks the English. Arabic comes from the validated Quran source.
const ArabicQuote: React.FC<{ arabic: string; theme: ThemePalette }> = ({ arabic, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 380, opacity: appear }}>
      <div
        dir="rtl"
        style={{
          fontFamily: ARABIC_DISPLAY_FONT,
          fontWeight: 700,
          fontSize: 84,
          lineHeight: 1.7,
          textAlign: "center",
          color: theme.arabicActive,
          textShadow: `0 0 40px ${theme.arabicGlow}`,
          padding: "0 80px",
          transform: `translateY(${(1 - appear) * 16}px)`,
        }}
      >
        {arabic}
      </div>
    </AbsoluteFill>
  );
};

const AyahCard: React.FC<{
  arabic?: string;
  translation?: string;
  source?: string;
  theme: ThemePalette;
}> = ({ arabic, translation, source, theme }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 14, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const transReveal = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px", opacity }}>
      <div
        dir="rtl"
        style={{
          fontFamily: ARABIC_DISPLAY_FONT,
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1.7,
          textAlign: "center",
          color: theme.arabicActive,
          textShadow: `0 0 40px ${theme.arabicGlow}`,
        }}
      >
        {arabic}
      </div>
      <div
        style={{
          marginTop: 56,
          maxWidth: 900,
          fontFamily: TRANSLATION_FONT,
          fontSize: 44,
          lineHeight: 1.45,
          textAlign: "center",
          color: theme.translation,
          opacity: transReveal,
          transform: `translateY(${(1 - transReveal) * 20}px)`,
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
            letterSpacing: 2,
            color: theme.accent,
            opacity: transReveal * 0.9,
            textTransform: "uppercase",
          }}
        >
          {source}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Founding-list "ad" end card, auto-appended after the story. Uses the green
// brand icon so it reads on both light (noor) and dark themes.
const OutroCard: React.FC<{
  theme: ThemePalette;
  websiteUrl: string;
  headline: string;
  onLight: boolean;
}> = ({ theme, websiteUrl, headline, onLight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame, fps, config: { damping: 200 } });
  const ink = onLight ? "#1c3a2b" : "#ffffff";
  return (
    <AbsoluteFill
      style={{
        background: theme.gradientFrom,
        justifyContent: "center",
        alignItems: "center",
        gap: 34,
        opacity: appear,
      }}
    >
      <Img
        src={staticFile("brand/ketabi-icon-green.png")}
        style={{
          width: 240,
          height: 240,
          objectFit: "contain",
          transform: `scale(${0.92 + 0.08 * appear})`,
        }}
      />
      <div
        style={{
          fontFamily: TRANSLATION_FONT,
          fontSize: 60,
          fontWeight: 800,
          letterSpacing: 3,
          color: ink,
        }}
      >
        Ketabi Studio
      </div>
      <div
        style={{
          fontFamily: TRANSLATION_FONT,
          fontSize: 48,
          fontWeight: 700,
          color: theme.accent,
        }}
      >
        {headline}
      </div>
      <div
        style={{
          fontFamily: TRANSLATION_FONT,
          fontSize: 40,
          color: ink,
          opacity: 0.82,
          marginTop: 6,
        }}
      >
        {websiteUrl}
      </div>
    </AbsoluteFill>
  );
};

export const StoryVideo: React.FC<StoryProps> = (props) => {
  const theme = themes[props.theme];
  const contentEndFrames = Math.round(contentEndSeconds(props) * STORY_FPS);
  const outroFrames = Math.round((props.ctaSeconds ?? 3.5) * STORY_FPS);
  return (
    <AbsoluteFill>
      <Background theme={theme} />
      {/* Extra darken for cinematic mood. */}
      <AbsoluteFill style={{ background: "rgba(0,0,0,0.28)" }} />
      {props.segments.map((seg: StorySegment, i: number) => {
        const from = Math.round(seg.fromSeconds * STORY_FPS);
        const dur = Math.round(seg.durationInSeconds * STORY_FPS);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Audio src={resolveAudio(seg.audioSrc)} />
            {seg.kind === "narration" ? (
              <>
                {seg.map ? <StoryMap view={seg.map} theme={theme} /> : null}
                {seg.arabic ? <ArabicQuote arabic={seg.arabic} theme={theme} /> : null}
                <Narration
                  words={seg.words}
                  source={seg.source}
                  theme={theme}
                  align={seg.map || seg.arabic ? "bottom" : "center"}
                />
              </>
            ) : (
              <AyahCard
                arabic={seg.arabic}
                translation={seg.translation}
                source={seg.source}
                theme={theme}
              />
            )}
          </Sequence>
        );
      })}
      {/* Subtle persistent brand chip — only during the content, not the outro. */}
      <Sequence durationInFrames={Math.max(1, contentEndFrames)}>
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 70 }}>
          <div
            style={{
              fontFamily: TRANSLATION_FONT,
              fontSize: 26,
              letterSpacing: 3,
              color: theme.accent,
              opacity: 0.7,
            }}
          >
            {props.websiteUrl}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Auto-appended founding-list ad end card. */}
      {props.showOutro ? (
        <Sequence from={contentEndFrames} durationInFrames={outroFrames}>
          <OutroCard
            theme={theme}
            websiteUrl={props.websiteUrl}
            headline={props.ctaHeadline}
            onLight={props.theme === "noor"}
          />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
