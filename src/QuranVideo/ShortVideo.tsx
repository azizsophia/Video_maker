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
import { ARABIC_DISPLAY_FONT, CAPTION_FONT } from "./fonts";

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

// Group words into caption lines that break on punctuation (so a phrase never
// splits mid-thought), capped at `maxWords` per line.
const toLines = (words: ShortWord[], maxWords = 4) => {
  const lines: { words: ShortWord[]; start: number; end: number }[] = [];
  let cur: ShortWord[] = [];
  const flush = () => {
    if (cur.length)
      lines.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  for (const w of words) {
    cur.push(w);
    const breaks = /[.,!?…—:;]$/.test(w.text);
    if (cur.length >= maxWords || breaks) flush();
  }
  flush();
  return lines;
};

// Gentle ease-in on each beat so cuts feel intentional, not jarring.
const FadeIn: React.FC<{ children: React.ReactNode; frames?: number }> = ({
  children,
  frames = 6,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, frames], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

// Full-bleed background: the beat's B-roll with a slow Ken-Burns push and a
// cohesive colour grade (so mixed stock clips read as one film), or the
// code-generated backdrop when no clip is available.
const BeatBackground: React.FC<{ beat: ShortBeat; theme: ThemePalette }> = ({
  beat,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.05, 1.18], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: theme.background, overflow: "hidden" }}>
      {beat.videoSrc ? (
        <AbsoluteFill style={{ transform: `scale(${scale})` }}>
          <OffthreadVideo
            src={resolveSrc(beat.videoSrc)}
            muted
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </AbsoluteFill>
      ) : (
        <Background theme={theme} />
      )}
      {/* Colour grade for cohesion across clips. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(175deg, ${theme.gradientFrom}55 0%, transparent 30%, ${theme.gradientTo}66 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 78% at 50% 30%, ${theme.arabicGlow}22 0%, transparent 55%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Legibility scrim: darken top + bottom so captions always pop.
const Scrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 24%, rgba(0,0,0,0.10) 52%, rgba(0,0,0,0.86) 100%)",
    }}
  />
);

// Modern highlight-block captions: bold sans, the currently-spoken word gets a
// filled accent "pill" (the trendy short-form look).
const Captions: React.FC<{ words?: ShortWord[]; theme: ThemePalette; size?: number; maxWords?: number }> = ({
  words = [],
  theme,
  size = 72,
  maxWords = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lines = toLines(words, maxWords);
  let idx = 0;
  for (let i = 0; i < lines.length; i++) if (t >= lines[i].start - 0.1) idx = i;
  const line = lines[idx];
  const lineFrame = frame - Math.round((line?.start ?? 0) * fps);
  // Slide up with a spring, but fade in fast so a line is never invisible for
  // long (avoids blank gaps between lines).
  const rise = spring({ frame: lineFrame, fps, config: { damping: 200, stiffness: 150 } });
  const op = interpolate(lineFrame, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px 14px",
        fontFamily: CAPTION_FONT,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1.06,
        textAlign: "center",
        letterSpacing: -1,
        transform: `translateY(${(1 - rise) * 26}px)`,
        opacity: op,
      }}
    >
      {(() => {
        // Exactly one highlighted word: the last one that has started. It stays
        // lit until the next word begins — classic karaoke, never two at once.
        let activeIdx = -1;
        const lw = line?.words ?? [];
        for (let i = 0; i < lw.length; i++) if (t >= lw[i].start - 0.02) activeIdx = i;
        return lw.map((w, i) => {
        const active = i === activeIdx;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: active ? "#08130d" : "#ffffff",
              background: active ? theme.accent : "transparent",
              padding: active ? "4px 16px" : "4px 2px",
              borderRadius: 16,
              transform: active ? "scale(1.06)" : "scale(1)",
              boxShadow: active ? `0 10px 30px ${theme.accent}66` : "none",
              WebkitTextStroke: active ? "0" : "1px rgba(0,0,0,0.35)",
              textShadow: active ? "none" : "0 3px 18px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.95)",
            }}
          >
            {w.text}
          </span>
        );
        });
      })()}
    </div>
  );
};

// Number badge + kicker for "point" beats.
const PointHeader: React.FC<{ badge?: string; kicker?: string; theme: ThemePalette }> = ({
  badge,
  kicker,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 11, stiffness: 170, mass: 0.6 } });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      {badge ? (
        <div
          style={{
            width: 158,
            height: 158,
            borderRadius: "50%",
            background: theme.accent,
            color: "#08130d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: CAPTION_FONT,
            fontWeight: 900,
            fontSize: 92,
            border: "5px solid rgba(255,255,255,0.85)",
            boxShadow: `0 16px 44px ${theme.accent}55, 0 6px 18px rgba(0,0,0,0.5)`,
            transform: `scale(${pop})`,
          }}
        >
          {badge}
        </div>
      ) : null}
      {kicker ? (
        <div
          style={{
            fontFamily: CAPTION_FONT,
            fontWeight: 800,
            fontSize: 27,
            letterSpacing: 7,
            textTransform: "uppercase",
            color: "#ffffff",
            opacity: 0.92 * pop,
            textShadow: "0 2px 12px rgba(0,0,0,0.85)",
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {translit ? (
        <div
          style={{
            fontFamily: CAPTION_FONT,
            fontWeight: 600,
            fontStyle: "italic",
            fontSize: 37,
            color: "#ffffff",
            opacity: 0.96,
            textShadow: "0 2px 14px rgba(0,0,0,0.9)",
          }}
        >
          {translit}
        </div>
      ) : null}
      {source ? (
        <div
          style={{
            fontFamily: CAPTION_FONT,
            fontWeight: 800,
            fontSize: 25,
            letterSpacing: 1.5,
            color: "#08130d",
            background: theme.accent,
            padding: "9px 22px",
            borderRadius: 999,
            boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
          }}
        >
          {source}
        </div>
      ) : null}
    </div>
  );
};

const PointBeat: React.FC<{ beat: ShortBeat; theme: ThemePalette }> = ({ beat, theme }) => (
  <AbsoluteFill
    style={{ justifyContent: "space-between", alignItems: "center", padding: "290px 64px 350px" }}
  >
    <PointHeader badge={beat.badge} kicker={beat.kicker} theme={theme} />
    <Captions words={beat.words} theme={theme} size={70} maxWords={4} />
    <SourceChip source={beat.source} translit={beat.translit} theme={theme} />
  </AbsoluteFill>
);

const TextBeat: React.FC<{ beat: ShortBeat; theme: ThemePalette; big?: boolean }> = ({
  beat,
  theme,
  big,
}) => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 64px" }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
      {beat.kicker ? (
        <div
          style={{
            fontFamily: CAPTION_FONT,
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: 7,
            textTransform: "uppercase",
            color: theme.accent,
            textShadow: "0 2px 12px rgba(0,0,0,0.85)",
          }}
        >
          {beat.kicker}
        </div>
      ) : null}
      <Captions words={beat.words} theme={theme} size={big ? 86 : 74} maxWords={big ? 3 : 4} />
      <SourceChip source={beat.source} theme={theme} />
    </div>
  </AbsoluteFill>
);

// "ayah" beat: real Arabic + translation, meant to run under a real reciter.
const AyahBeat: React.FC<{ beat: ShortBeat; theme: ThemePalette }> = ({ beat, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const arReveal = spring({ frame, fps, config: { damping: 200 } });
  const trReveal = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const len = (beat.arabic ?? "").length;
  const arabicSize = len > 120 ? 62 : len > 80 ? 74 : len > 45 ? 88 : 100;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 66px" }}>
      <div
        dir="rtl"
        style={{
          fontFamily: ARABIC_DISPLAY_FONT,
          fontWeight: 700,
          fontSize: arabicSize,
          lineHeight: 1.7,
          textAlign: "center",
          color: "#ffffff",
          opacity: arReveal,
          transform: `scale(${0.97 + arReveal * 0.03})`,
          textShadow: `0 0 44px ${theme.arabicGlow}, 0 4px 18px rgba(0,0,0,0.9)`,
        }}
      >
        {beat.arabic}
      </div>
      {beat.translation ? (
        <div
          style={{
            marginTop: 44,
            maxWidth: 900,
            fontFamily: CAPTION_FONT,
            fontWeight: 600,
            fontSize: 42,
            lineHeight: 1.4,
            textAlign: "center",
            color: "#ffffff",
            opacity: trReveal,
            transform: `translateY(${(1 - trReveal) * 18}px)`,
            textShadow: "0 3px 16px rgba(0,0,0,0.9)",
          }}
        >
          {beat.translation}
        </div>
      ) : null}
      {beat.source ? (
        <div style={{ marginTop: 34, opacity: trReveal }}>
          <SourceChip source={beat.source} theme={theme} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC<{ theme: ThemePalette }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pct = interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start" }}>
      <div style={{ height: 6, width: "100%", background: "rgba(255,255,255,0.14)" }}>
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
            {beat.audioSrc ? <Audio src={resolveSrc(beat.audioSrc)} /> : null}
            <FadeIn>
              <BeatBackground beat={beat} theme={theme} />
              <Scrim />
              {beat.kind === "point" ? (
                <PointBeat beat={beat} theme={theme} />
              ) : beat.kind === "ayah" ? (
                <AyahBeat beat={beat} theme={theme} />
              ) : (
                <TextBeat beat={beat} theme={theme} big={beat.kind === "hook"} />
              )}
            </FadeIn>
          </Sequence>
        );
      })}

      {props.progressBar ? <ProgressBar theme={theme} /> : null}

      {/* Persistent handle, bottom-center. */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 56 }}>
        <div
          style={{
            fontFamily: CAPTION_FONT,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 1,
            color: "#ffffff",
            opacity: 0.9,
            textShadow: "0 2px 12px rgba(0,0,0,0.85)",
          }}
        >
          {props.handle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
