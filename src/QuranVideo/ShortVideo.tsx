import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ShortProps, ShortBeat, ShortWord } from "./shortSchema";
import { themes, ThemePalette } from "./themes";
import { Background } from "./Background";
import { ARABIC_DISPLAY_FONT, TRANSLATION_FONT } from "./fonts";

export const SHORT_FPS = 30;

const resolveSrc = (src: string): string =>
  /^https?:\/\//.test(src) ? src : staticFile(src);

export const shortDurationInFrames = (props: ShortProps): number => {
  const end = props.beats.reduce(
    (m, b) => Math.max(m, b.fromSeconds + b.durationInSeconds),
    0
  );
  return Math.max(1, Math.round((end + 0.4) * SHORT_FPS));
};

// Group words into short caption lines (2–4 words per line reads punchiest on
// a vertical feed).
const toLines = (words: ShortWord[], perLine = 3) => {
  const lines: { words: ShortWord[]; start: number; end: number }[] = [];
  for (let i = 0; i < words.length; i += perLine) {
    const chunk = words.slice(i, i + perLine);
    if (chunk.length)
      lines.push({ words: chunk, start: chunk[0].start, end: chunk[chunk.length - 1].end });
  }
  return lines;
};

// Full-bleed background: the beat's B-roll clip with a slow Ken-Burns push,
// or the code-generated geometric backdrop when no clip is available.
const BeatBackground: React.FC<{ beat: ShortBeat; theme: ThemePalette }> = ({
  beat,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.06, 1.2], {
    extrapolateRight: "clamp",
  });
  if (!beat.videoSrc) {
    return <Background theme={theme} />;
  }
  return (
    <AbsoluteFill style={{ backgroundColor: theme.background, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo
          src={resolveSrc(beat.videoSrc)}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Legibility scrim: darken top + bottom so white captions always pop, without
// hiding the footage in the middle.
const Scrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.12) 26%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.82) 100%)",
    }}
  />
);

// The big TikTok-style word-by-word caption block.
const Captions: React.FC<{ words?: ShortWord[]; theme: ThemePalette; big?: boolean }> = ({
  words = [],
  theme,
  big,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lines = toLines(words);
  let idx = 0;
  for (let i = 0; i < lines.length; i++) if (t >= lines[i].start - 0.12) idx = i;
  const line = lines[idx];
  const appear = spring({
    frame: frame - Math.round((line?.start ?? 0) * fps),
    fps,
    config: { damping: 200, stiffness: 140 },
  });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "6px 18px",
        fontFamily: TRANSLATION_FONT,
        fontWeight: 900,
        fontSize: big ? 96 : 78,
        lineHeight: 1.15,
        textAlign: "center",
        letterSpacing: -0.5,
        transform: `translateY(${(1 - appear) * 26}px) scale(${0.94 + appear * 0.06})`,
      }}
    >
      {line?.words.map((w, i) => {
        const active = t >= w.start - 0.04 && t < w.end + 0.06;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: active ? theme.accent : "#ffffff",
              WebkitTextStroke: "2px rgba(0,0,0,0.55)",
              textShadow:
                "0 4px 22px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,0.9)",
              transform: active ? "translateY(-4px) scale(1.05)" : "none",
              transition: "color 0.08s linear",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

// The rounded number badge + kicker shown on "point" beats.
const PointHeader: React.FC<{ badge?: string; kicker?: string; theme: ThemePalette }> = ({
  badge,
  kicker,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 180, mass: 0.6 } });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      {badge ? (
        <div
          style={{
            width: 168,
            height: 168,
            borderRadius: "50%",
            background: theme.accent,
            color: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: TRANSLATION_FONT,
            fontWeight: 900,
            fontSize: 104,
            boxShadow: "0 10px 40px rgba(0,0,0,0.45)",
            transform: `scale(${pop})`,
          }}
        >
          {badge}
        </div>
      ) : null}
      {kicker ? (
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#ffffff",
            opacity: 0.9 * pop,
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          {kicker}
        </div>
      ) : null}
    </div>
  );
};

const SourceChip: React.FC<{ source?: string; translit?: string; theme: ThemePalette }> = ({
  source,
  translit,
  theme,
}) => {
  if (!source && !translit) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      {translit ? (
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 40,
            color: "#ffffff",
            opacity: 0.95,
            textShadow: "0 2px 14px rgba(0,0,0,0.85)",
          }}
        >
          {translit}
        </div>
      ) : null}
      {source ? (
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 1.5,
            color: "#0a0a0a",
            background: theme.accent,
            padding: "9px 20px",
            borderRadius: 22,
            boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
          }}
        >
          {source}
        </div>
      ) : null}
    </div>
  );
};

// A "point" beat: number badge up top, karaoke caption in the middle,
// transliteration + source chip beneath.
const PointBeat: React.FC<{ beat: ShortBeat; theme: ThemePalette }> = ({ beat, theme }) => (
  <AbsoluteFill
    style={{
      justifyContent: "space-between",
      alignItems: "center",
      padding: "300px 70px 360px",
    }}
  >
    <PointHeader badge={beat.badge} kicker={beat.kicker} theme={theme} />
    <Captions words={beat.words} theme={theme} />
    <SourceChip source={beat.source} translit={beat.translit} theme={theme} />
  </AbsoluteFill>
);

// A "hook" or "cta" beat: one bold centered caption block.
const TextBeat: React.FC<{ beat: ShortBeat; theme: ThemePalette; big?: boolean }> = ({
  beat,
  theme,
  big,
}) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      {beat.kicker ? (
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: theme.accent,
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          {beat.kicker}
        </div>
      ) : null}
      <Captions words={beat.words} theme={theme} big={big} />
      <SourceChip source={beat.source} theme={theme} />
    </div>
  </AbsoluteFill>
);

// An "ayah" beat: real Arabic (from Quran.com) + trusted translation.
const AyahBeat: React.FC<{ beat: ShortBeat; theme: ThemePalette }> = ({ beat, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame: frame - 8, fps, config: { damping: 200 } });
  // Scale the Arabic down for longer verses so it never overflows 9:16.
  const len = (beat.arabic ?? "").length;
  const arabicSize = len > 120 ? 62 : len > 80 ? 74 : len > 45 ? 88 : 100;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px" }}>
      <div
        dir="rtl"
        style={{
          fontFamily: ARABIC_DISPLAY_FONT,
          fontWeight: 700,
          fontSize: arabicSize,
          lineHeight: 1.7,
          textAlign: "center",
          color: "#ffffff",
          textShadow: `0 0 40px ${theme.arabicGlow}, 0 4px 18px rgba(0,0,0,0.85)`,
        }}
      >
        {beat.arabic}
      </div>
      {beat.translation ? (
        <div
          style={{
            marginTop: 44,
            maxWidth: 900,
            fontFamily: TRANSLATION_FONT,
            fontWeight: 700,
            fontSize: 46,
            lineHeight: 1.4,
            textAlign: "center",
            color: "#ffffff",
            opacity: reveal,
            transform: `translateY(${(1 - reveal) * 18}px)`,
            textShadow: "0 3px 16px rgba(0,0,0,0.85)",
          }}
        >
          {beat.translation}
        </div>
      ) : null}
      {beat.source ? (
        <div style={{ marginTop: 34, opacity: reveal }}>
          <SourceChip source={beat.source} theme={theme} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC<{ theme: ThemePalette }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pct = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start" }}>
      <div style={{ height: 8, width: "100%", background: "rgba(255,255,255,0.16)" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: theme.accent }} />
      </div>
    </AbsoluteFill>
  );
};

export const ShortVideo: React.FC<ShortProps> = (props) => {
  const theme = themes[props.theme];
  return (
    <AbsoluteFill style={{ backgroundColor: theme.background }}>
      {props.beats.map((beat: ShortBeat, i: number) => {
        const from = Math.round(beat.fromSeconds * SHORT_FPS);
        const dur = Math.round(beat.durationInSeconds * SHORT_FPS);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <BeatBackground beat={beat} theme={theme} />
            <Scrim />
            {beat.audioSrc ? <Audio src={resolveSrc(beat.audioSrc)} /> : null}
            {beat.kind === "point" ? (
              <PointBeat beat={beat} theme={theme} />
            ) : beat.kind === "ayah" ? (
              <AyahBeat beat={beat} theme={theme} />
            ) : (
              <TextBeat beat={beat} theme={theme} big={beat.kind === "hook"} />
            )}
          </Sequence>
        );
      })}

      {props.progressBar ? <ProgressBar theme={theme} /> : null}

      {/* Persistent handle, bottom-center. */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 64 }}>
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 2,
            color: "#ffffff",
            opacity: 0.82,
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
          }}
        >
          {props.handle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
