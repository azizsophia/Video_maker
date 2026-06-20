import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  random,
} from "remotion";
import { ThemePalette } from "./themes";

// Modern, fast-moving science motifs (aniconic). Vibrant, high-energy, every one
// animates continuously so the frame is never static. Used for Quran-science shorts.

type SceneProps = { theme: ThemePalette };

const SciStars: React.FC<{ count?: number; drift?: number }> = ({ count = 90, drift = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const s = i + 1;
        const x = (random(`x${s}`) * width + frame * drift * (0.2 + random(`v${s}`))) % width;
        const y = random(`y${s}`) * height;
        const sz = 1 + random(`s${s}`) * 2.4;
        const tw = 0.3 + 0.7 * Math.abs(Math.sin((frame / fps) * 1.6 + s));
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: "50%", background: "#eaf3ff", opacity: tw, boxShadow: `0 0 ${sz * 2}px #9cc2ff` }} />
        );
      })}
    </AbsoluteFill>
  );
};

const Cosmos: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #122044 0%, #0a0f24 45%, #04060f 85%)" }}>
      <div style={{ position: "absolute", width: width * 1.4, height: width * 1.4, left: width * 0.1 + Math.sin(t * 0.2) * 60, top: -width * 0.2, borderRadius: "50%", background: "radial-gradient(circle, rgba(80,120,255,0.18), transparent 60%)", filter: "blur(30px)" }} />
      <div style={{ position: "absolute", width: width * 1.2, height: width * 1.2, right: -width * 0.2, bottom: -width * 0.1, borderRadius: "50%", background: "radial-gradient(circle, rgba(150,80,255,0.16), transparent 60%)", filter: "blur(30px)" }} />
      <SciStars count={110} drift={0.4} />
    </AbsoluteFill>
  );
};

const Supernova: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const cx = width / 2;
  const cy = height * 0.42;
  const t = frame / fps;
  const pulse = 0.7 + 0.3 * Math.sin(t * 4);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, #2a1a3a 0%, #0a0814 55%, #03020a 100%)" }}>
      <SciStars count={80} drift={0.3} />
      {[0, 1, 2, 3].map((i) => {
        const local = (frame + i * 22) % 88;
        const r = interpolate(local, [0, 88], [40, Math.max(width, height) * 0.9]);
        const op = interpolate(local, [0, 20, 88], [0.7, 0.5, 0]);
        return <div key={i} style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", border: "2px solid rgba(255,190,120,0.6)", opacity: op }} />;
      })}
      <div style={{ position: "absolute", left: cx - 130, top: cy - 130, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, #fff 0%, #ffd28a 35%, rgba(255,140,60,0.5) 60%, transparent 75%)", transform: `scale(${pulse})`, filter: "blur(2px)" }} />
    </AbsoluteFill>
  );
};

const Planet: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  const r = width * 0.34;
  const cx = width / 2;
  const cy = height * 0.46;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, #0a1330 0%, #050a1c 60%, #02040c 100%)" }}>
      <SciStars count={90} drift={0.3} />
      <div style={{ position: "absolute", left: cx - r - 24, top: cy - r - 24, width: (r + 24) * 2, height: (r + 24) * 2, borderRadius: "50%", background: "radial-gradient(circle, rgba(90,160,255,0.35), transparent 62%)", filter: "blur(8px)" }} />
      <div style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", background: `radial-gradient(circle at ${38 + Math.sin(t * 0.4) * 6}% 36%, #6fb0ff 0%, #2b6fd0 45%, #123a78 75%, #0a1f44 100%)`, boxShadow: "inset -30px -20px 80px rgba(0,0,0,0.6)" }} />
    </AbsoluteFill>
  );
};

const Meteor: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "linear-gradient(160deg, #0a1024 0%, #060a18 55%, #03050e 100%)" }}>
      <SciStars count={60} drift={0.2} />
      {new Array(14).fill(0).map((_, i) => {
        const s = i + 1;
        const period = 60 + random(`p${s}`) * 40;
        const local = (frame + random(`o${s}`) * period) % period;
        const prog = local / period;
        const startX = random(`mx${s}`) * width * 1.3 - width * 0.15;
        const x = startX + prog * width * 0.5;
        const y = -120 + prog * (height + 240);
        const len = 120 + random(`l${s}`) * 160;
        const op = Math.sin(prog * Math.PI);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 3, height: len, background: "linear-gradient(180deg, rgba(255,220,170,0), rgba(255,210,150,0.95))", transform: "rotate(28deg)", opacity: op, filter: "blur(0.5px)" }} />;
      })}
    </AbsoluteFill>
  );
};

const IronCore: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  const r = width * 0.3;
  const cx = width / 2;
  const cy = height * 0.45;
  const pulse = 0.94 + 0.06 * Math.sin(t * 3);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #2a1408 0%, #120a06 55%, #060302 100%)" }}>
      <div style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "radial-gradient(circle at 42% 38%, #ffe9c0 0%, #ff9d3c 30%, #d4471a 60%, #6e1f0c 85%, #2a0c04 100%)", transform: `scale(${pulse})`, boxShadow: "0 0 120px 30px rgba(255,110,40,0.35)" }} />
      {new Array(20).fill(0).map((_, i) => {
        const s = i + 1;
        const a = random(`a${s}`) * Math.PI * 2;
        const dist = r + 20 + ((frame * (0.6 + random(`v${s}`)) ) % 200);
        const x = cx + Math.cos(a) * dist;
        const y = cy + Math.sin(a) * dist - 40;
        const op = 1 - (dist - r) / 220;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 4, height: 4, borderRadius: "50%", background: "#ffb060", opacity: Math.max(0, op) * 0.8, boxShadow: "0 0 8px #ff8a3c" }} />;
      })}
    </AbsoluteFill>
  );
};

const Atom: React.FC<SceneProps> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height * 0.45;
  const accent = theme.accent;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #0b1630 0%, #060b1c 60%, #02050e 100%)" }}>
      <SciStars count={50} drift={0.2} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {[0, 60, 120].map((rot, i) => {
          const ang = (frame * (2 + i)) % 360;
          const ex = cx + Math.cos((ang * Math.PI) / 180) * width * 0.32;
          const ey = cy + Math.sin((ang * Math.PI) / 180) * height * 0.12;
          return (
            <g key={i} transform={`rotate(${rot} ${cx} ${cy})`}>
              <ellipse cx={cx} cy={cy} rx={width * 0.32} ry={height * 0.12} fill="none" stroke={accent} strokeWidth={2} opacity={0.5} />
              <circle cx={ex} cy={ey} r={9} fill={accent} />
            </g>
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: cx - 26, top: cy - 26, width: 52, height: 52, borderRadius: "50%", background: `radial-gradient(circle, #fff, ${accent} 70%)`, boxShadow: `0 0 40px ${accent}` }} />
    </AbsoluteFill>
  );
};

const DataGrid: React.FC<SceneProps> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const horizon = height * 0.5;
  const offset = (frame * 6) % 80;
  const accent = theme.accent;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #060a1a 0%, #0a1430 50%, #1a0f30 100%)" }}>
      <SciStars count={40} drift={0.2} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {new Array(16).fill(0).map((_, i) => {
          const y = horizon + Math.pow(i / 15, 2) * (height - horizon) + offset * Math.pow(i / 15, 2);
          return <line key={`h${i}`} x1={0} y1={y} x2={width} y2={y} stroke={accent} strokeWidth={1.5} opacity={0.35} />;
        })}
        {new Array(17).fill(0).map((_, i) => {
          const x = (i / 16) * width;
          return <line key={`v${i}`} x1={x} y1={height} x2={width / 2 + (x - width / 2) * 0.12} y2={horizon} stroke={accent} strokeWidth={1.5} opacity={0.3} />;
        })}
      </svg>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: horizon, background: "linear-gradient(180deg, #060a1a, transparent)" }} />
    </AbsoluteFill>
  );
};

export const scienceScenes: Record<string, React.FC<SceneProps>> = {
  cosmos: Cosmos,
  supernova: Supernova,
  planet: Planet,
  meteor: Meteor,
  ironcore: IronCore,
  atom: Atom,
  datagrid: DataGrid,
};
