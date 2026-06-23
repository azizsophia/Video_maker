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
import { ARABIC_DISPLAY_FONT, TRANSLATION_FONT, CAPTION_FONT } from "./fonts";

export const STORY_FPS = 30;

const resolveAudio = (src: string): string =>
  /^https?:\/\//.test(src) ? src : staticFile(src);

const contentEndSeconds = (props: StoryProps): number =>
  props.segments.reduce((m, s) => Math.max(m, s.fromSeconds + s.durationInSeconds), 0);

export const storyDurationInFrames = (props: StoryProps): number => {
  const end = contentEndSeconds(props);
  const outro = props.showOutro ? props.ctaSeconds ?? 4.5 : 0;
  return Math.max(1, Math.round((end + outro + 0.5) * STORY_FPS));
};

// Group words into short caption lines (subtitle style).
const toLines = (words: StoryWord[], perLine = 3) => {
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

  void appear;
  return (
    <AbsoluteFill
      style={{
        justifyContent: align === "bottom" ? "flex-end" : "center",
        alignItems: "center",
        padding: "0 70px",
        paddingBottom: align === "bottom" ? 380 : 0,
      }}
    >
      <div
        style={{
          fontFamily: CAPTION_FONT,
          fontSize: 90,
          fontWeight: 900,
          lineHeight: 1.18,
          letterSpacing: -1,
          textAlign: "center",
          color: "#ffffff",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px 16px",
        }}
      >
        {line?.words.map((w, i) => {
          const shown = t >= w.start - 0.12;
          const active = t >= w.start - 0.05 && t < w.end + 0.08;
          const pop = spring({
            frame: frame - Math.round((w.start - 0.05) * fps),
            fps,
            config: { damping: 14, stiffness: 220, mass: 0.6 },
          });
          const rise = shown ? pop : 0;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: active ? "#0b0b0b" : "#ffffff",
                background: active ? theme.accent : "transparent",
                padding: active ? "4px 18px" : "4px 2px",
                borderRadius: 18,
                opacity: shown ? 1 : 0,
                transform: `translateY(${(1 - rise) * 34}px) scale(${0.86 + 0.14 * rise})`,
                textShadow: active ? "none" : "0 4px 26px rgba(0,0,0,0.85)",
                WebkitTextStroke: active ? "0" : "1.5px rgba(0,0,0,0.35)",
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
            bottom: align === "bottom" ? 300 : 200,
            fontFamily: CAPTION_FONT,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#fff",
            opacity: 0.92,
            background: theme.accent,
            padding: "8px 20px",
            borderRadius: 22,
            mixBlendMode: "normal",
          }}
        >
          <span style={{ color: "#0b0b0b" }}>{source}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// A Quran verse shown on screen (NOT recited): Arabic on top, the English
// directly underneath (synced to the voice, which speaks only the English).
// Arabic comes from the validated Quran source.
const ArabicQuote: React.FC<{
  arabic: string;
  words?: StoryWord[];
  source?: string;
  theme: ThemePalette;
}> = ({ arabic, words = [], source, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const appear = spring({ frame, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px" }}>
      <div
        style={{
          maxWidth: 940,
          padding: "60px 48px",
          borderRadius: 40,
          background: "rgba(0,0,0,0.34)",
          border: `2px solid ${theme.accent}55`,
          boxShadow: "0 30px 90px rgba(0,0,0,0.5)",
          opacity: appear,
          transform: `translateY(${(1 - appear) * 24}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          dir="rtl"
          style={{
            fontFamily: ARABIC_DISPLAY_FONT,
            fontWeight: 700,
            fontSize: 90,
            lineHeight: 1.8,
            textAlign: "center",
            color: "#ffffff",
            textShadow: `0 0 44px ${theme.arabicGlow}`,
          }}
        >
          {arabic}
        </div>
        <div
          style={{
            marginTop: 40,
            height: 3,
            width: 120,
            borderRadius: 2,
            background: theme.accent,
            opacity: 0.8,
          }}
        />
        <div
          style={{
            marginTop: 36,
            fontFamily: CAPTION_FONT,
            fontSize: 50,
            fontWeight: 800,
            lineHeight: 1.32,
            textAlign: "center",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "6px 12px",
          }}
        >
          {words.map((w, i) => {
            const active = t >= w.start - 0.05 && t < w.end + 0.08;
            const shown = t >= w.start - 0.12;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  color: active ? theme.accent : "#ffffff",
                  opacity: shown ? 1 : 0.32,
                  transform: `scale(${active ? 1.05 : 1})`,
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
              marginTop: 34,
              fontFamily: CAPTION_FONT,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#0b0b0b",
              background: theme.accent,
              padding: "8px 20px",
              borderRadius: 22,
            }}
          >
            {source}
          </div>
        ) : null}
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

// Founding-list "ad" end card, auto-appended after the story. Shows the REAL
// product (books + the founding-list page) so viewers understand the CTA.
const OutroCard: React.FC<{
  theme: ThemePalette;
  websiteUrl: string;
  headline: string;
  onLight: boolean;
}> = ({ theme, websiteUrl, headline, onLight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame, fps, config: { damping: 200 } });
  const float = Math.sin(frame / 16) * 8;
  const ink = onLight ? "#1c3a2b" : "#ffffff";
  return (
    <AbsoluteFill
      style={{
        background: theme.gradientFrom,
        justifyContent: "center",
        alignItems: "center",
        opacity: appear,
      }}
    >
      {/* header: icon + wordmark */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 26 }}>
        <Img
          src={staticFile("brand/ketabi-icon-green.png")}
          style={{ width: 92, height: 92, objectFit: "contain" }}
        />
        <div style={{ fontFamily: CAPTION_FONT, fontSize: 50, fontWeight: 900, letterSpacing: 1, color: ink }}>
          Ketabi Studio
        </div>
      </div>

      {/* the real product page, in a floating rounded device card */}
      <div
        style={{
          width: 560,
          height: 940,
          borderRadius: 44,
          overflow: "hidden",
          boxShadow: "0 40px 110px rgba(0,0,0,0.5)",
          border: "6px solid rgba(255,255,255,0.9)",
          transform: `translateY(${float}px) scale(${0.94 + 0.06 * appear})`,
        }}
      >
        <Img
          src={staticFile("promo/founding-list.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
      </div>

      {/* CTA */}
      <div
        style={{
          marginTop: 30,
          fontFamily: CAPTION_FONT,
          fontSize: 50,
          fontWeight: 900,
          color: "#0b0b0b",
          background: theme.accent,
          padding: "12px 34px",
          borderRadius: 28,
        }}
      >
        {headline} →
      </div>
      <div style={{ marginTop: 18, fontFamily: CAPTION_FONT, fontSize: 40, fontWeight: 700, color: ink, opacity: 0.9 }}>
        {websiteUrl}
      </div>
    </AbsoluteFill>
  );
};

export const StoryVideo: React.FC<StoryProps> = (props) => {
  const theme = themes[props.theme];
  const contentEndFrames = Math.round(contentEndSeconds(props) * STORY_FPS);
  const outroFrames = Math.round((props.ctaSeconds ?? 4.5) * STORY_FPS);
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
              seg.arabic ? (
                <ArabicQuote arabic={seg.arabic} words={seg.words} source={seg.source} theme={theme} />
              ) : (
                <>
                  {seg.map ? <StoryMap view={seg.map} theme={theme} /> : null}
                  <Narration
                    words={seg.words}
                    source={seg.source}
                    theme={theme}
                    align={seg.map ? "bottom" : "center"}
                  />
                </>
              )
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
