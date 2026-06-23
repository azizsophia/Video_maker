import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ThemePalette } from "./themes";

const W = 1080;
const H = 1920;

// Deterministic pseudo-random (Remotion renders frames in parallel workers, so
// never use Math.random at render time — seed everything by index).
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const useEntrance = () => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
};

// Soft glow blob.
const Glow: React.FC<{ x: number; y: number; r: number; color: string; opacity?: number }> = ({
  x,
  y,
  r,
  color,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity,
      filter: "blur(8px)",
    }}
  />
);

// ── Desert dunes: layered silhouettes with parallax drift + sand motes ────────
const Dunes: React.FC<{ theme: ThemePalette }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const e = useEntrance();
  const greens = ["#0f2418", "#16301f", "#1f4029", "#2b5436"];
  const wave = (baseY: number, amp: number, k: number, phase: number) => {
    let d = `M0,${H} L0,${baseY}`;
    for (let x = 0; x <= W; x += 24) d += ` L${x},${baseY + amp * Math.sin(x * k + phase)}`;
    d += ` L${W},${H} Z`;
    return d;
  };
  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(180deg, ${theme.gradientFrom} 0%, ${theme.gradientTo} 100%)`, opacity: e }}
    >
      <Glow x={W * 0.7} y={360} r={420} color={theme.accent} opacity={0.28} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={wave(1080 + i * 230, 50 + i * 18, 0.0016 + i * 0.0004, frame * (0.18 + i * 0.12) * 0.04 + i)}
            fill={greens[i]}
          />
        ))}
        {/* gold rim on the front dune */}
        <path
          d={wave(1080 + 3 * 230, 50 + 3 * 18, 0.0016 + 3 * 0.0004, frame * (0.18 + 3 * 0.12) * 0.04 + 3)}
          fill="none"
          stroke={theme.accent}
          strokeWidth={3}
          opacity={0.4}
        />
      </svg>
      {Array.from({ length: 36 }).map((_, i) => {
        const x = (rand(i) * W + frame * (0.3 + rand(i + 9))) % W;
        const y = 200 + rand(i + 3) * 760;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: theme.accent,
              opacity: 0.25 + 0.4 * rand(i + 5),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── Light rays from above (revelation/drama) ──────────────────────────────────
const Rays: React.FC<{ theme: ThemePalette }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const e = useEntrance();
  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(180deg, ${theme.gradientFrom}, ${theme.gradientTo})`, opacity: e, overflow: "hidden" }}
    >
      <Glow x={W / 2} y={-60} r={520} color={theme.accent} opacity={0.4} />
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = -40 + i * 10 + Math.sin(frame * 0.01 + i) * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: W / 2,
              top: -40,
              width: 26 + (i % 3) * 10,
              height: 1700,
              background: `linear-gradient(180deg, ${theme.accent}, transparent)`,
              opacity: 0.1 + 0.05 * ((i + 1) % 3),
              transformOrigin: "top center",
              transform: `rotate(${angle}deg)`,
              filter: "blur(6px)",
            }}
          />
        );
      })}
      {Array.from({ length: 30 }).map((_, i) => {
        const y = (rand(i) * H - frame * (0.4 + rand(i + 2))) ;
        const yy = ((y % H) + H) % H;
        return (
          <div
            key={`m${i}`}
            style={{
              position: "absolute",
              left: rand(i + 7) * W,
              top: yy,
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: theme.accent,
              opacity: 0.3 + 0.4 * rand(i + 1),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ── Carved cliffs / canyon silhouettes (evokes Hegra without depicting it) ────
const Stone: React.FC<{ theme: ThemePalette }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const e = useEntrance();
  const drift = Math.sin(frame * 0.01) * 14;
  const cliff = (baseY: number, seed: number, color: string) => {
    let d = `M0,${H} L0,${baseY}`;
    for (let x = 0; x <= W; x += 90) {
      const jag = baseY - rand(seed + x) * 150;
      d += ` L${x},${jag} L${x + 45},${jag + 60 + rand(seed + x + 1) * 70}`;
    }
    d += ` L${W},${H} Z`;
    return d;
  };
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${theme.gradientFrom}, ${theme.gradientTo})`, opacity: e }}>
      <Glow x={W * 0.5} y={500} r={460} color={theme.accent} opacity={0.22} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, transform: `translateX(${drift}px)` }}>
        <path d={cliff(1150, 10, "#13281b")} fill="#13281b" />
        <path d={cliff(1320, 50, "#1c3a26")} fill="#1c3a26" />
        {/* carved glowing doorways */}
        {Array.from({ length: 5 }).map((_, i) => {
          const x = 150 + i * 190;
          const y = 1180 + rand(i + 20) * 90;
          return (
            <g key={i}>
              <rect x={x} y={y} width={54} height={92} rx={6} fill={theme.accent} opacity={0.18} />
              <rect x={x + 12} y={y + 18} width={30} height={74} rx={4} fill={theme.accent} opacity={0.5} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// ── Night sky with gold stars + crescent (reflective beats) ───────────────────
const NightSky: React.FC<{ theme: ThemePalette }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const e = useEntrance();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 80%, ${theme.gradientFrom}, ${theme.gradientTo})`, opacity: e }}>
      {Array.from({ length: 80 }).map((_, i) => {
        const tw = 0.3 + 0.7 * Math.abs(Math.sin(frame * 0.04 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: rand(i) * W,
              top: rand(i + 31) * H * 0.8,
              width: 2 + rand(i + 5) * 3,
              height: 2 + rand(i + 5) * 3,
              borderRadius: "50%",
              background: theme.accent,
              opacity: tw * (0.4 + rand(i + 9) * 0.6),
            }}
          />
        );
      })}
      {/* crescent */}
      <div style={{ position: "absolute", left: W * 0.66, top: 300 }}>
        <div style={{ position: "absolute", width: 150, height: 150, borderRadius: "50%", background: theme.accent, filter: "blur(2px)", boxShadow: `0 0 60px ${theme.accent}` }} />
        <div style={{ position: "absolute", left: 42, top: -16, width: 150, height: 150, borderRadius: "50%", background: theme.gradientTo }} />
      </div>
    </AbsoluteFill>
  );
};

// ── Rising embers (destruction / punishment beat) ─────────────────────────────
const Embers: React.FC<{ theme: ThemePalette }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const e = useEntrance();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 110%, #3a2410, ${theme.gradientTo})`, opacity: e, overflow: "hidden" }}>
      <Glow x={W / 2} y={H + 120} r={620} color="#e0902f" opacity={0.5} />
      {Array.from({ length: 60 }).map((_, i) => {
        const speed = 1.4 + rand(i + 2) * 2.4;
        const y = H - ((frame * speed + rand(i) * H) % (H + 200));
        const sway = Math.sin(frame * 0.05 + i) * 26;
        const flick = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.2 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: rand(i + 11) * W + sway,
              top: y,
              width: 4 + rand(i + 3) * 5,
              height: 4 + rand(i + 3) * 5,
              borderRadius: "50%",
              background: i % 3 === 0 ? theme.accent : "#e8902c",
              opacity: flick * (0.5 + rand(i + 7) * 0.5),
              boxShadow: `0 0 10px ${i % 3 === 0 ? theme.accent : "#e8902c"}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Scene: React.FC<{ name?: string; theme: ThemePalette }> = ({ name = "dunes", theme }) => {
  switch (name) {
    case "rays":
      return <Rays theme={theme} />;
    case "stone":
      return <Stone theme={theme} />;
    case "nightsky":
      return <NightSky theme={theme} />;
    case "embers":
      return <Embers theme={theme} />;
    case "dunes":
    default:
      return <Dunes theme={theme} />;
  }
};
