import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ShortProps, ShortBeat } from "./shortSchema";
import { CAPTION_FONT, ARABIC_DISPLAY_FONT } from "./fonts";

export const EXPLAINER_FPS = 30;

// Light "explainer / paper" palette for the maths half…
const PAPER = "#f1e9d6";
const INK = "#22332a";
const GOLD = "#a9781f";
const EM = "#2c7a57";
// …dark cinematic palette for the Qur'an half.
const DARK = "#04130d";
const GOLDD = "#f2d391";
const EMD = "#57e6a9";
const WHITE = "#ffffff";

const PHI = 1.61803399;
const resolveSrc = (s: string) => (/^https?:\/\//.test(s) ? s : staticFile(s));
const joinWords = (b: ShortBeat) => (b.words ?? []).map((w) => w.text).join(" ");

export const explainerDurationInFrames = (props: ShortProps): number => {
  const end = props.beats.reduce((m, b) => Math.max(m, b.fromSeconds + b.durationInSeconds), 0);
  return Math.max(1, Math.round((end + 0.4) * EXPLAINER_FPS));
};

// A golden (logarithmic) spiral as an SVG path — grows by φ every quarter turn.
function spiralPath(cx: number, cy: number, a: number, turns: number, rot = 0): string {
  const per = 72;
  const total = Math.round(turns * per);
  let d = "";
  for (let i = 0; i <= total; i++) {
    const theta = (i / per) * Math.PI * 2;
    const r = a * Math.pow(PHI, theta / (Math.PI / 2));
    const ang = theta + rot;
    const x = cx + r * Math.cos(ang);
    const y = cy + r * Math.sin(ang);
    d += (i === 0 ? "M " : " L ") + x.toFixed(2) + " " + y.toFixed(2);
  }
  return d;
}

// ---------- backgrounds ------------------------------------------------------
const PaperBg: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: PAPER }}>
    <svg width="100%" height="100%" style={{ position: "absolute" }}>
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(34,51,42,0.06)" strokeWidth="1.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, transparent 45%, rgba(120,95,45,0.14) 100%)" }} />
  </AbsoluteFill>
);

const DarkBg: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: DARK }}>
    <AbsoluteFill style={{ background: "linear-gradient(160deg,#06180f 0%,#03100b 60%,#020a07 100%)" }} />
    <AbsoluteFill style={{ background: `radial-gradient(60% 45% at 50% 34%, ${EMD}14 0%, transparent 60%)` }} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 44%, transparent 40%, rgba(0,0,0,0.55) 100%)" }} />
  </AbsoluteFill>
);

const Label: React.FC<{ text?: string; dark?: boolean }> = ({ text, dark }) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const a = spring({ frame, fps, config: { damping: 200 } });
  if (!text) return null;
  return (
    <div
      style={{
        fontFamily: CAPTION_FONT,
        fontWeight: 800,
        fontSize: 30,
        letterSpacing: 6,
        textTransform: "uppercase",
        color: dark ? GOLDD : GOLD,
        opacity: a,
        transform: `translateY(${(1 - a) * -14}px)`,
      }}
    >
      {text}
    </div>
  );
};

const SourceChip: React.FC<{ source?: string; dark?: boolean }> = ({ source, dark }) => {
  if (!source) return null;
  return (
    <div
      style={{
        fontFamily: CAPTION_FONT,
        fontWeight: 800,
        fontSize: 25,
        letterSpacing: 1.5,
        color: dark ? "#08130d" : PAPER,
        background: dark ? `linear-gradient(90deg, ${GOLDD}, ${EMD})` : `linear-gradient(90deg, ${GOLD}, ${EM})`,
        padding: "9px 22px",
        borderRadius: 999,
      }}
    >
      {source}
    </div>
  );
};

// ---------- maths scenes (paper) --------------------------------------------
const TitleScene: React.FC<{ beat: ShortBeat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 160, mass: 0.7 } });
  const sub = spring({ frame: frame - 16, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill>
      <PaperBg />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px", gap: 22 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 300, lineHeight: 1, color: GOLD, transform: `scale(${pop})` }}>φ</div>
        <div style={{ fontFamily: CAPTION_FONT, fontWeight: 900, fontSize: 68, color: INK, opacity: sub }}>The Golden Ratio</div>
        <div style={{ fontFamily: CAPTION_FONT, fontWeight: 700, fontSize: 40, letterSpacing: 3, color: EM, opacity: sub }}>1 · 6 1 8</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
const FibonacciScene: React.FC<{ beat: ShortBeat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const step = durationInFrames / (FIB.length + 3);
  let shown = 0;
  for (let i = 0; i < FIB.length; i++) if (frame >= (i + 1) * step) shown = i + 1;
  const lastIdx = Math.max(2, shown - 1); // for the "a + b = c" rule
  const ruleOn = shown >= 3;
  return (
    <AbsoluteFill>
      <PaperBg />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 60px", gap: 70 }}>
        <Label text={beat.label} />
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "18px 26px", maxWidth: 940 }}>
          {FIB.map((n, i) => {
            const on = i < shown;
            const app = spring({ frame: frame - Math.round((i + 1) * step), fps, config: { damping: 12, stiffness: 200, mass: 0.5 } });
            const isNew = i === shown - 1;
            return (
              <div
                key={i}
                style={{
                  fontFamily: CAPTION_FONT,
                  fontWeight: 900,
                  fontSize: 76,
                  color: isNew ? GOLD : INK,
                  opacity: on ? app : 0,
                  transform: `translateY(${(1 - (on ? app : 0)) * 24}px) scale(${isNew ? 1.12 : 1})`,
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        {ruleOn ? (
          <div style={{ fontFamily: CAPTION_FONT, fontWeight: 800, fontSize: 58 }}>
            <span style={{ color: EM }}>{FIB[lastIdx - 2]}</span>
            <span style={{ color: INK }}> + </span>
            <span style={{ color: EM }}>{FIB[lastIdx - 1]}</span>
            <span style={{ color: INK }}> = </span>
            <span style={{ color: GOLD }}>{FIB[lastIdx]}</span>
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const RATIO_ROWS: [string, string, string][] = [
  ["8", "5", "1.600"],
  ["13", "8", "1.625"],
  ["55", "34", "1.618"],
];
const RatioScene: React.FC<{ beat: ShortBeat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const step = durationInFrames / 6;
  const phiOn = frame >= step * 4;
  const phiA = spring({ frame: frame - step * 4, fps, config: { damping: 13, stiffness: 150 } });
  return (
    <AbsoluteFill>
      <PaperBg />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px", gap: 34 }}>
        <Label text={beat.label} />
        {RATIO_ROWS.map((r, j) => {
          const on = frame >= (j + 1) * step;
          const a = spring({ frame: frame - (j + 1) * step, fps, config: { damping: 200 } });
          return (
            <div key={j} style={{ fontFamily: CAPTION_FONT, fontWeight: 800, fontSize: 62, opacity: on ? a : 0, transform: `translateX(${(1 - (on ? a : 0)) * -30}px)` }}>
              <span style={{ color: INK }}>{r[0]} ÷ {r[1]} = </span>
              <span style={{ color: j === RATIO_ROWS.length - 1 ? GOLD : EM }}>{r[2]}</span>
            </div>
          );
        })}
        {phiOn ? (
          <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 18, opacity: phiA, transform: `scale(${0.9 + phiA * 0.1})` }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 96, color: GOLD }}>φ</div>
            <div style={{ fontFamily: CAPTION_FONT, fontWeight: 900, fontSize: 84, color: INK }}>= 1.618</div>
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SpiralScene: React.FC<{ beat: ShortBeat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const draw = interpolate(frame, [6, durationInFrames * 0.9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const d = spiralPath(540, 980, 5.4, 2.4, Math.PI);
  return (
    <AbsoluteFill>
      <PaperBg />
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 230 }}>
        <Label text={beat.label} />
      </AbsoluteFill>
      <AbsoluteFill>
        <svg width="1080" height="1920" viewBox="0 0 1080 1920">
          <path d={d} fill="none" stroke={GOLD} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const NatureScene: React.FC<{ beat: ShortBeat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const draw = interpolate(frame, [10, durationInFrames * 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, durationInFrames], [1.03, 1.09], { extrapolateRight: "clamp" });
  const d = spiralPath(540, 940, 4.2, 2.35, Math.PI * 1.1);
  return (
    <AbsoluteFill style={{ backgroundColor: DARK, overflow: "hidden" }}>
      {beat.videoSrc ? (
        <AbsoluteFill style={{ transform: `scale(${scale})` }}>
          <OffthreadVideo src={resolveSrc(beat.videoSrc)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)" }} />
      <AbsoluteFill>
        <svg width="1080" height="1920" viewBox="0 0 1080 1920">
          <path d={d} fill="none" stroke={GOLDD} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} style={{ filter: "drop-shadow(0 0 10px rgba(242,211,145,0.7))" }} />
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 300 }}>
        <SourceChip source={beat.source} dark />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------- Qur'an scenes (dark) --------------------------------------------
const CenterText: React.FC<{ text: string; size: number; color?: string; delay?: number }> = ({ text, size, color = WHITE, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - delay, fps, config: { damping: 200 } });
  return (
    <div style={{ fontFamily: CAPTION_FONT, fontWeight: 800, fontSize: size, lineHeight: 1.3, textAlign: "center", color, maxWidth: 940, opacity: a, transform: `translateY(${(1 - a) * 18}px)`, textShadow: "0 3px 16px rgba(0,0,0,0.85)" }}>
      {text}
    </div>
  );
};

const BridgeScene: React.FC<{ beat: ShortBeat }> = ({ beat }) => (
  <AbsoluteFill>
    <DarkBg />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px" }}>
      <CenterText text={joinWords(beat)} size={70} />
    </AbsoluteFill>
  </AbsoluteFill>
);

const DarkLineScene: React.FC<{ beat: ShortBeat }> = ({ beat }) => (
  <AbsoluteFill>
    <DarkBg />
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px", gap: 46 }}>
      <CenterText text={joinWords(beat)} size={66} />
      <SourceChip source={beat.source} dark />
    </AbsoluteFill>
  </AbsoluteFill>
);

const AyahScene: React.FC<{ beat: ShortBeat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ar = spring({ frame, fps, config: { damping: 200 } });
  const tr = spring({ frame: frame - 16, fps, config: { damping: 200 } });
  const len = (beat.arabic ?? "").length;
  const arSize = len > 90 ? 76 : 100;
  return (
    <AbsoluteFill>
      <DarkBg />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 66px" }}>
        <div dir="rtl" style={{ fontFamily: ARABIC_DISPLAY_FONT, fontWeight: 700, fontSize: arSize, lineHeight: 1.7, textAlign: "center", color: WHITE, opacity: ar, textShadow: `0 0 44px ${EMD}66, 0 4px 18px rgba(0,0,0,0.9)` }}>
          {beat.arabic}
        </div>
        {beat.translation ? (
          <div style={{ marginTop: 42, maxWidth: 900, fontFamily: CAPTION_FONT, fontWeight: 600, fontSize: 44, lineHeight: 1.4, textAlign: "center", color: WHITE, opacity: tr }}>
            {beat.translation}
          </div>
        ) : null}
        {beat.source ? <div style={{ marginTop: 32, opacity: tr }}><SourceChip source={beat.source} dark /></div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const MapScene: React.FC<{ beat: ShortBeat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.02, 1.12], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: DARK, overflow: "hidden" }}>
      {beat.videoSrc ? (
        <AbsoluteFill style={{ transform: `scale(${scale})` }}>
          <Img src={resolveSrc(beat.videoSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.85) 100%)" }} />
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 300, padding: "300px 64px 0" }}>
        <CenterText text={joinWords(beat)} size={58} color={WHITE} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 300 }}>
        <SourceChip source={beat.source} dark />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneFor: React.FC<{ beat: ShortBeat }> = ({ beat }) => {
  const s = beat.scene;
  if (s === "title") return <TitleScene beat={beat} />;
  if (s === "fibonacci") return <FibonacciScene beat={beat} />;
  if (s === "ratio") return <RatioScene beat={beat} />;
  if (s === "spiral") return <SpiralScene beat={beat} />;
  if (s === "nature") return <NatureScene beat={beat} />;
  if (s === "bridge") return <BridgeScene beat={beat} />;
  if (s === "map") return <MapScene beat={beat} />;
  if (beat.kind === "ayah") return <AyahScene beat={beat} />;
  return <DarkLineScene beat={beat} />;
};

export const GoldenExplainer: React.FC<ShortProps> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK }}>
      {props.beats.map((beat: ShortBeat, i: number) => {
        const from = Math.round(beat.fromSeconds * EXPLAINER_FPS);
        const dur = Math.round(beat.durationInSeconds * EXPLAINER_FPS);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {beat.audioSrc ? <Audio src={resolveSrc(beat.audioSrc)} /> : null}
            <SceneFor beat={beat} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 54 }}>
        <div style={{ fontFamily: CAPTION_FONT, fontWeight: 800, fontSize: 28, letterSpacing: 1, color: WHITE, opacity: 0.72, textShadow: "0 2px 10px rgba(0,0,0,0.7)", mixBlendMode: "difference" }}>
          {props.handle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
