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
} from "remotion";
import { ShortProps, ShortBeat } from "./shortSchema";
import { CAPTION_FONT } from "./fonts";
import { Scene, INK, EMERALD, GOLD, WHITE, KINETIC_FPS } from "./KineticShort";

const resolveSrc = (s: string) => (/^https?:\/\//.test(s) ? s : staticFile(s));

const rnd = (i: number, s: number) => {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const BaseGrade: React.FC = () => (
  <>
    <AbsoluteFill style={{ background: "linear-gradient(160deg,#06180f 0%,#03100b 60%,#020a07 100%)" }} />
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, transparent 42%, rgba(0,0,0,0.6) 100%)" }} />
  </>
);

// 1) Generative particle flow (SVG/divs, deterministic per frame).
const ParticleFlowBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const N = 200;
  const parts = React.useMemo(
    () =>
      Array.from({ length: N }, (_, i) => ({
        x: rnd(i, 1) * 100,
        y: rnd(i, 2) * 100,
        size: 1.5 + rnd(i, 3) * 4,
        speed: 2 + rnd(i, 4) * 7,
        drift: rnd(i, 5) * 6 - 3,
        phase: rnd(i, 6) * Math.PI * 2,
        gold: rnd(i, 7) > 0.5,
      })),
    []
  );
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <BaseGrade />
      {parts.map((p, i) => {
        const y = (((p.y - t * p.speed) % 108) + 108) % 108 - 4;
        const x = p.x + Math.sin(t * 0.5 + p.phase) * p.drift;
        const op = 0.15 + 0.55 * (0.5 + 0.5 * Math.sin(t * 0.8 + p.phase));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: p.gold ? GOLD : EMERALD,
              opacity: op,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// 2) Copyright-clean cosmic footage.
const FootageBg: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.05, 1.16], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${scale})` }}>
        <OffthreadVideo src={resolveSrc(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)" }} />
    </AbsoluteFill>
  );
};

// 3) 8-fold arabesque mandala (NO six-point star). Rotating + breathing.
const petal = (cx: number, cy: number, len: number, w: number) =>
  `M ${cx} ${cy} C ${cx - w} ${cy - len * 0.4}, ${cx - w * 0.4} ${cy - len}, ${cx} ${cy - len} C ${cx + w * 0.4} ${cy - len}, ${cx + w} ${cy - len * 0.4}, ${cx} ${cy}`;

const MandalaBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const rot = (t * 6) % 360;
  const rot2 = -(t * 4) % 360;
  const breathe = 1 + Math.sin(t * 0.7) * 0.05;
  const ring = (n: number, len: number, w: number, r: number, color: string) =>
    Array.from({ length: n }, (_, k) => (
      <path key={k} d={petal(500, 500, len, w)} transform={`rotate(${(k * 360) / n} 500 500)`} stroke={color} strokeWidth={2} fill="none" opacity={0.5} />
    ));
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <BaseGrade />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 44%, ${EMERALD}22 0%, transparent 55%)` }} />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.6 }}>
        <svg width="140%" height="140%" viewBox="0 0 1000 1000">
          <g transform={`rotate(${rot} 500 500) scale(${breathe})`} style={{ transformOrigin: "500px 500px" }}>
            {ring(8, 300, 120, 0, GOLD)}
          </g>
          <g transform={`rotate(${rot2} 500 500) scale(${2 - breathe})`} style={{ transformOrigin: "500px 500px" }}>
            {ring(8, 190, 78, 0, EMERALD)}
          </g>
          <g transform={`rotate(${rot} 500 500)`}>
            {ring(16, 90, 34, 0, GOLD)}
          </g>
          <circle cx="500" cy="500" r="26" fill={GOLD} opacity={0.5} />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 4) Data-explainer motif: concentric rings + scanning arc + pulsing bars.
const DataBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const scan = (t * 60) % 360;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <BaseGrade />
      <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>
        <svg width="130%" height="130%" viewBox="0 0 1000 1000">
          {[120, 220, 320, 420].map((r, i) => (
            <circle key={i} cx="500" cy="500" r={r} stroke={i % 2 ? EMERALD : GOLD} strokeWidth={1.5} fill="none" opacity={0.35} strokeDasharray="6 10" />
          ))}
          <line x1="500" y1="500" x2={500 + 440 * Math.cos((scan * Math.PI) / 180)} y2={500 + 440 * Math.sin((scan * Math.PI) / 180)} stroke={GOLD} strokeWidth={2} opacity={0.6} />
        </svg>
      </AbsoluteFill>
      {/* pulsing bars at the bottom */}
      <AbsoluteFill style={{ alignItems: "flex-end", justifyContent: "center", paddingBottom: 130, gap: 10, flexDirection: "row" }}>
        {Array.from({ length: 9 }, (_, i) => {
          const h = 30 + (0.5 + 0.5 * Math.sin(t * 2 + i)) * 120;
          return <div key={i} style={{ width: 16, height: h, borderRadius: 6, background: i % 2 ? EMERALD : GOLD, opacity: 0.5 }} />;
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Label: React.FC<{ text: string }> = ({ text }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: 120 }}>
    <div
      style={{
        fontFamily: CAPTION_FONT,
        fontWeight: 800,
        fontSize: 26,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: INK,
        background: `linear-gradient(90deg, ${GOLD}, ${EMERALD})`,
        padding: "10px 26px",
        borderRadius: 999,
      }}
    >
      {text}
    </div>
  </AbsoluteFill>
);

const BGS = [ParticleFlowBg, null, MandalaBg, DataBg]; // index 1 = footage (needs src)
const LABELS = [
  "1 · Generative particles",
  "2 · Cosmic footage (free)",
  "3 · 8-fold mandala",
  "4 · Data explainer",
];

export const demoReelDurationInFrames = (props: ShortProps): number => {
  const beats = props.beats.slice(0, 4);
  const end = beats.reduce((m, b) => Math.max(m, b.fromSeconds + b.durationInSeconds), 0);
  return Math.max(1, Math.round((end + 0.3) * KINETIC_FPS));
};

export const DemoReel: React.FC<ShortProps> = (props) => {
  const beats = props.beats.slice(0, 4);
  return (
    <AbsoluteFill style={{ backgroundColor: INK }}>
      {beats.map((beat: ShortBeat, i: number) => {
        const from = Math.round(beat.fromSeconds * KINETIC_FPS);
        const dur = Math.round(beat.durationInSeconds * KINETIC_FPS);
        const Bg = BGS[i];
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {i === 1 ? <FootageBg src="short/demo-cosmos.mp4" /> : Bg ? <Bg /> : null}
            {beat.audioSrc ? <Audio src={resolveSrc(beat.audioSrc)} /> : null}
            <Scene beat={beat} />
            <Label text={LABELS[i]} />
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 56 }}>
        <div style={{ fontFamily: CAPTION_FONT, fontWeight: 800, fontSize: 30, letterSpacing: 1, color: WHITE, opacity: 0.9, textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}>
          {props.handle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
