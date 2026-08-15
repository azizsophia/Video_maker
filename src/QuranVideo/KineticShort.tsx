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
} from "remotion";
import { ShortProps, ShortBeat, ShortWord } from "./shortSchema";
import { CAPTION_FONT, ARABIC_DISPLAY_FONT } from "./fonts";

export const KINETIC_FPS = 30;

// A bespoke motion-design look — NO stock footage. Animated Islamic geometry,
// drifting light, and word-by-word kinetic typography synced to the narration.
export const INK = "#04130d";
export const EMERALD = "#57e6a9";
export const GOLD = "#f2d391";
export const WHITE = "#ffffff";

const resolveSrc = (src: string): string =>
  /^https?:\/\//.test(src) ? src : staticFile(src);

export const kineticDurationInFrames = (props: ShortProps): number => {
  const end = props.beats.reduce(
    (m, b) => Math.max(m, b.fromSeconds + b.durationInSeconds),
    0
  );
  return Math.max(1, Math.round((end + 0.4) * KINETIC_FPS));
};

const toLines = (words: ShortWord[], maxWords = 3) => {
  const lines: { words: ShortWord[]; start: number; end: number }[] = [];
  let cur: ShortWord[] = [];
  const flush = () => {
    if (cur.length) lines.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    cur = [];
  };
  for (const w of words) {
    cur.push(w);
    if (cur.length >= maxWords || /[.,!?…—:;]$/.test(w.text)) flush();
  }
  flush();
  return lines;
};

// --- Animated background (software-cheap: gradients + transforms only) -------
const GeoLattice: React.FC<{ color: string }> = ({ color }) => (
  <svg width="100%" height="100%" viewBox="0 0 1080 1080" preserveAspectRatio="xMidYMid slice">
    <defs>
      <pattern id="k-rosette" width="200" height="200" patternUnits="userSpaceOnUse">
        <g stroke={color} strokeWidth="1.4" fill="none">
          <circle cx="100" cy="100" r="58" />
          <circle cx="100" cy="100" r="34" />
          <circle cx="0" cy="100" r="58" />
          <circle cx="200" cy="100" r="58" />
          <circle cx="100" cy="0" r="58" />
          <circle cx="100" cy="200" r="58" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#k-rosette)" />
  </svg>
);

const MotionBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  // Two drifting colour glows -> living "mesh gradient".
  const g1x = 30 + Math.sin(t * 0.5) * 12;
  const g1y = 32 + Math.cos(t * 0.4) * 10;
  const g2x = 72 + Math.cos(t * 0.45) * 10;
  const g2y = 64 + Math.sin(t * 0.35) * 12;
  const breathe = 0.5 + 0.5 * Math.sin(t * 0.8);
  // Slow lattice drift + a periodic diagonal light sweep.
  const rot = interpolate(frame, [0, durationInFrames], [0, 8]);
  const scale = interpolate(frame, [0, durationInFrames], [1.05, 1.18]);
  const sweep = ((t * 26) % 160) - 30; // -30 → 130 %

  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `linear-gradient(160deg, #06180f 0%, #03100b 60%, #020a07 100%)` }} />
      <AbsoluteFill
        style={{ background: `radial-gradient(50% 42% at ${g1x}% ${g1y}%, ${EMERALD}2e 0%, transparent 60%)`, opacity: 0.7 + breathe * 0.3 }}
      />
      <AbsoluteFill
        style={{ background: `radial-gradient(46% 40% at ${g2x}% ${g2y}%, ${GOLD}26 0%, transparent 60%)`, opacity: 0.6 + (1 - breathe) * 0.3 }}
      />
      <AbsoluteFill style={{ transform: `scale(${scale}) rotate(${rot}deg)`, opacity: 0.12 }}>
        <GeoLattice color={GOLD} />
      </AbsoluteFill>
      {/* Diagonal light sweep */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(105deg, transparent ${sweep - 12}%, ${WHITE}0f ${sweep}%, transparent ${sweep + 12}%)`,
        }}
      />
      {/* Vignette to focus the type */}
      <AbsoluteFill
        style={{ background: `radial-gradient(circle at 50% 44%, transparent 40%, rgba(0,0,0,0.62) 100%)` }}
      />
    </AbsoluteFill>
  );
};

// --- Word-by-word kinetic captions ------------------------------------------
const Kinetic: React.FC<{ words?: ShortWord[]; size?: number; maxWords?: number }> = ({
  words = [],
  size = 78,
  maxWords = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lines = toLines(words, maxWords);
  let idx = 0;
  for (let i = 0; i < lines.length; i++) if (t >= lines[i].start - 0.12) idx = i;
  const line = lines[idx];
  const lw = line?.words ?? [];
  let activeIdx = -1;
  for (let i = 0; i < lw.length; i++) if (t >= lw[i].start - 0.02) activeIdx = i;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px 16px",
        fontFamily: CAPTION_FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.08,
        textAlign: "center",
        letterSpacing: -1.5,
      }}
    >
      {lw.map((w, i) => {
        // Each word pops in on its own start time (typewriter-by-voice).
        const wf = frame - Math.round(w.start * fps);
        const enter = spring({ frame: wf, fps, config: { damping: 14, stiffness: 200, mass: 0.5 } });
        const appeared = t >= w.start - 0.04;
        const active = i === activeIdx;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: active ? GOLD : WHITE,
              opacity: appeared ? enter : 0,
              transform: `translateY(${(1 - enter) * 34}px) scale(${active ? 1.08 : 0.9 + enter * 0.1})`,
              textShadow: active
                ? `0 0 26px ${GOLD}88, 0 4px 20px rgba(0,0,0,0.85)`
                : "0 4px 20px rgba(0,0,0,0.85)",
              WebkitTextStroke: "1px rgba(0,0,0,0.28)",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const Badge: React.FC<{ badge?: string; kicker?: string }> = ({ badge, kicker }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 11, stiffness: 170, mass: 0.6 } });
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      {badge ? (
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: CAPTION_FONT,
            fontWeight: 900,
            fontSize: 88,
            color: INK,
            background: `linear-gradient(150deg, ${GOLD}, ${EMERALD})`,
            border: "4px solid rgba(255,255,255,0.9)",
            transform: `scale(${pop}) rotate(${(1 - pop) * -12}deg)`,
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
            fontSize: 26,
            letterSpacing: 7,
            textTransform: "uppercase",
            color: GOLD,
            opacity: pop,
          }}
        >
          {kicker}
        </div>
      ) : null}
    </div>
  );
};

const Chips: React.FC<{ translit?: string; source?: string }> = ({ translit, source }) => {
  if (!translit && !source) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      {translit ? (
        <div style={{ fontFamily: CAPTION_FONT, fontWeight: 600, fontStyle: "italic", fontSize: 36, color: WHITE, opacity: 0.95, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
          {translit}
        </div>
      ) : null}
      {source ? (
        <div style={{ fontFamily: CAPTION_FONT, fontWeight: 800, fontSize: 24, letterSpacing: 1.5, color: INK, background: `linear-gradient(90deg, ${GOLD}, ${EMERALD})`, padding: "9px 22px", borderRadius: 999 }}>
          {source}
        </div>
      ) : null}
    </div>
  );
};

const AyahScene: React.FC<{ beat: ShortBeat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ar = spring({ frame, fps, config: { damping: 200 } });
  const tr = spring({ frame: frame - 14, fps, config: { damping: 200 } });
  const len = (beat.arabic ?? "").length;
  const arSize = len > 120 ? 60 : len > 80 ? 72 : 92;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 66px" }}>
      <div dir="rtl" style={{ fontFamily: ARABIC_DISPLAY_FONT, fontWeight: 700, fontSize: arSize, lineHeight: 1.7, textAlign: "center", color: WHITE, opacity: ar, transform: `scale(${0.97 + ar * 0.03})`, textShadow: `0 0 46px ${GOLD}66, 0 4px 18px rgba(0,0,0,0.9)` }}>
        {beat.arabic}
      </div>
      {beat.translation ? (
        <div style={{ marginTop: 42, maxWidth: 900, fontFamily: CAPTION_FONT, fontWeight: 600, fontSize: 42, lineHeight: 1.4, textAlign: "center", color: WHITE, opacity: tr, transform: `translateY(${(1 - tr) * 16}px)`, textShadow: "0 3px 16px rgba(0,0,0,0.9)" }}>
          {beat.translation}
        </div>
      ) : null}
      {beat.source ? <div style={{ marginTop: 30, opacity: tr }}><Chips source={beat.source} /></div> : null}
    </AbsoluteFill>
  );
};

export const Scene: React.FC<{ beat: ShortBeat }> = ({ beat }) => {
  if (beat.kind === "ayah") return <AyahScene beat={beat} />;
  if (beat.kind === "point")
    return (
      <AbsoluteFill style={{ justifyContent: "space-between", alignItems: "center", padding: "290px 62px 350px" }}>
        <Badge badge={beat.badge} kicker={beat.kicker} />
        <Kinetic words={beat.words} size={72} maxWords={3} />
        <Chips translit={beat.translit} source={beat.source} />
      </AbsoluteFill>
    );
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 62px" }}>
      <Kinetic words={beat.words} size={beat.kind === "hook" ? 90 : 78} maxWords={3} />
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pct = interpolate(frame, [0, durationInFrames], [0, 100], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start" }}>
      <div style={{ height: 6, width: "100%", background: "rgba(255,255,255,0.12)" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${GOLD}, ${EMERALD})` }} />
      </div>
    </AbsoluteFill>
  );
};

export const KineticShort: React.FC<ShortProps> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      <MotionBackground />
      {props.beats.map((beat: ShortBeat, i: number) => {
        const from = Math.round(beat.fromSeconds * KINETIC_FPS);
        const dur = Math.round(beat.durationInSeconds * KINETIC_FPS);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {beat.audioSrc ? <Audio src={resolveSrc(beat.audioSrc)} /> : null}
            <Scene beat={beat} />
          </Sequence>
        );
      })}
      {props.progressBar ? <ProgressBar /> : null}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 56 }}>
        <div style={{ fontFamily: CAPTION_FONT, fontWeight: 800, fontSize: 30, letterSpacing: 1, color: WHITE, opacity: 0.9, textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}>
          {props.handle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
