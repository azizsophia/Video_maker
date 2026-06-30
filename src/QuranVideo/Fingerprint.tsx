import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

// Code-generated fingerprint-ridge backdrops for the "Fingerprint Verse" short.
// The video is literally about fingerprints, so the footage IS a fingerprint —
// drawn entirely by code on the dark-green / gold Ketabi palette. Human-free and
// text-free by construction (no Pexels QC needed), and every beat's pattern is
// chosen to match the line being spoken (the visual-matches-the-scene rule).
//
// Rendered into the same cinematic grade as the stock-footage path (CinematicBg)
// so a scene beat and a footage beat sit on an identical brand look.

const VB_W = 1080;
const VB_H = 1920;
const GOLD = "#e7c873";
const GOLD_DEEP = "#cda24a";

// Deterministic pseudo-random — Remotion renders frames in parallel workers, so
// never use Math.random at render time; seed everything by index.
const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// One closed ridge loop around (cx,cy) with a little organic per-vertex wobble
// so it reads like a real friction ridge rather than a perfect ellipse.
const ridgePath = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number,
  wobble = 0.05
): string => {
  // Smooth, finely sampled loop. Low-frequency wobble (not per-vertex noise) so
  // ridges curve like friction ridges instead of looking faceted.
  const steps = 140;
  const ph = rand(seed) * Math.PI * 2;
  let d = "";
  for (let k = 0; k <= steps; k++) {
    const a = (k / steps) * Math.PI * 2;
    const j = 1 + Math.sin(a * 3 + ph) * wobble * 0.6 + Math.sin(a * 5 + ph * 2) * wobble * 0.4;
    const x = cx + Math.cos(a) * rx * j;
    const y = cy + Math.sin(a) * ry * j;
    d += (k === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
  }
  return d + "Z";
};

// A short "delta" branch — the little fork below/right of a fingerprint core.
const deltaPath = (cx: number, cy: number, len: number, seed: number): string => {
  const a0 = 0.5 + rand(seed) * 0.4;
  const x1 = cx + Math.cos(a0) * len;
  const y1 = cy + Math.sin(a0) * len;
  const x2 = cx + Math.cos(a0 + 0.7) * len * 0.9;
  const y2 = cy + Math.sin(a0 + 0.7) * len * 0.9;
  return `M${x1.toFixed(1)},${y1.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
};

type RidgeConfig = {
  cx: number;
  cy: number;
  rings: number;
  base: number; // innermost rx
  gap: number; // spacing between rings
  squish: number; // ry / rx (taller fingertip oval)
  seed: number;
  scale?: number; // overall size multiplier
};

// The fingerprint itself: concentric ridges drawn on from the core outward, then
// a slow breathe + drift so it stays alive without distracting from the caption.
const RidgeField: React.FC<{
  cfg: RidgeConfig;
  highlightRing?: number; // -1 = none; index of a ring to warm to bright gold
  draw?: boolean; // animate the ridges drawing on
  bright?: boolean; // brighter ridges for compositing over footage
}> = ({ cfg, highlightRing = -1, draw = true, bright = false }) => {
  const frame = useCurrentFrame();
  const { cx, cy, rings, base, gap, squish, seed, scale = 1 } = cfg;
  // bright = composited over footage (the short). Keep it CALM: no breathing,
  // no rotation drift, and a single slow draw-on that then holds perfectly
  // still, so the only ambient motion in the beat is the gentle footage itself.
  const breathe = bright ? 1 : 1 + 0.018 * Math.sin(frame * 0.045 + seed);
  const driftR = bright ? 0 : Math.sin(frame * 0.006 + seed) * 1.4;
  const items = [] as React.ReactNode[];
  for (let i = 0; i < rings; i++) {
    const rx = (base + i * gap) * scale;
    const ry = rx * squish;
    // Nudge inner rings up so the core sits slightly high — a loop-ish core
    // instead of a dead-centre bullseye.
    const cyi = cy - (rings - 1 - i) * 1.6;
    // Slower, gentler reveal when composited (calm), quicker for the standalone.
    const p = draw ? clamp01((frame - i * (bright ? 1.6 : 1.0)) / (bright ? 34 : 20)) : 1;
    const isHi = i === highlightRing;
    items.push(
      <path
        key={i}
        d={ridgePath(cx, cyi, rx, ry, seed + i * 13, 0.03 + (i % 3) * 0.008)}
        fill="none"
        stroke={isHi ? GOLD : bright ? GOLD : GOLD_DEEP}
        strokeWidth={isHi ? 3 : (bright ? 2 : 1.6) - Math.min(0.8, i * 0.03)}
        strokeLinecap="round"
        opacity={(isHi ? 0.98 : (bright ? 0.8 : 0.6) - i * 0.014) * p}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
      />
    );
  }
  // delta fork sits just below-right of the core
  const dp = draw ? clamp01((frame - rings * 1.0) / 26) : 1;
  // Breathe + drift about the fingerprint core (translate → scale/rotate → back).
  return (
    <g
      transform={`translate(${cx} ${cy}) scale(${breathe}) rotate(${driftR}) translate(${-cx} ${-cy})`}
    >
      {items}
      <path
        d={deltaPath(cx, cy + (base + rings * gap) * squish * scale * 0.62, 120 * scale, seed + 7)}
        fill="none"
        stroke={GOLD_DEEP}
        strokeWidth={2}
        opacity={0.4 * dp}
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - dp}
      />
    </g>
  );
};

// Rising gold ridge-dust — used on the "crumbled into dust / gathered again"
// beats. Particles drift up and fade, seeded by index.
const Dust: React.FC<{ count?: number; opacity?: number }> = ({ count = 46, opacity = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const speed = 0.5 + rand(i + 2) * 1.6;
        const y = VB_H - ((frame * speed + rand(i) * VB_H) % (VB_H + 120));
        const sway = Math.sin(frame * 0.03 + i) * 22;
        const flick = 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.08 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${((rand(i + 11) * VB_W + sway) / VB_W) * 100}%`,
              top: `${(y / VB_H) * 100}%`,
              width: 3 + rand(i + 3) * 3,
              height: 3 + rand(i + 3) * 3,
              borderRadius: "50%",
              background: i % 4 === 0 ? GOLD : GOLD_DEEP,
              opacity: flick * (0.35 + rand(i + 7) * 0.5) * opacity,
            }}
          />
        );
      })}
    </>
  );
};

// Sweeping analysis line (the Galton / "proved why" science beat).
const ScanLine: React.FC = () => {
  const frame = useCurrentFrame();
  const period = 150;
  const p = (frame % period) / period;
  const top = interpolate(p, [0, 1], [22, 64]);
  const fade = Math.sin(p * Math.PI);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: `${top}%`,
          left: "16%",
          width: "68%",
          height: 2,
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          opacity: 0.6 * fade,
        }}
      />
    </AbsoluteFill>
  );
};

// Soft gold glow blob (core spotlight).
const CoreGlow: React.FC<{ pulse?: boolean }> = ({ pulse = false }) => {
  const frame = useCurrentFrame();
  const a = pulse ? 0.22 + 0.16 * (0.5 + 0.5 * Math.sin(frame * 0.06)) : 0.2;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 38%, rgba(231,200,115,${a.toFixed(3)}), transparent 46%)`,
      }}
    />
  );
};

// The brand grade + readability scrims, identical to the stock-footage path so a
// code-generated beat sits on the exact same look as a Pexels beat.
const Grade: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, rgba(13,40,28,0.40) 0%, rgba(11,20,16,0.10) 35%, rgba(11,20,16,0.35) 70%, rgba(8,16,12,0.88) 100%)",
      }}
    />
    <AbsoluteFill style={{ boxShadow: "inset 0 0 320px rgba(0,0,0,0.55)", mixBlendMode: "multiply" }} />
  </>
);

// Per-beat ridge geometry, chosen so the pattern matches the line being spoken.
const sceneConfig = (
  name: string
): { cfg: RidgeConfig; cfg2?: RidgeConfig; highlightRing?: number; scan?: boolean; dust?: number; pulseCore?: boolean; draw?: boolean } => {
  const center: RidgeConfig = { cx: 540, cy: 720, rings: 22, base: 36, gap: 22, squish: 1.22, seed: 4 };
  switch (name) {
    // "the pattern belongs to you" — a single print forms.
    case "fp-whorl":
      return { cfg: center, draw: true };
    // "the Qur'an pointed to this exact part" — spotlight pulses on the core.
    case "fp-core":
      return { cfg: center, pulseCore: true, draw: true };
    // "crumbled into dust" — ridges faint, gold dust rises.
    case "fp-dust":
      return { cfg: { ...center, seed: 9 }, dust: 60, draw: true };
    // 75:4 "restore the very tips of his fingers" — ridges draw on, calm.
    case "fp-restore":
      return { cfg: { ...center, seed: 12 }, draw: true, pulseCore: true };
    // Galton "proved why" — an analysis line sweeps the ridges.
    case "fp-scan":
      return { cfg: { ...center, seed: 21 }, scan: true, draw: true };
    // "no two the same, not even twins" — two visibly different prints.
    case "fp-twins":
      return {
        cfg: { cx: 320, cy: 700, rings: 11, base: 40, gap: 26, squish: 1.2, seed: 3, scale: 1 },
        cfg2: { cx: 760, cy: 760, rings: 11, base: 40, gap: 26, squish: 1.2, seed: 31, scale: 1 },
        draw: true,
      };
    // "every ridge is a signature never issued twice" — one ridge glows gold.
    case "fp-signature":
      return { cfg: { ...center, seed: 17 }, highlightRing: 6, draw: true };
    // "the one mark that makes everyone unmistakable" — a pressed, sealed print.
    case "fp-seal":
      return { cfg: { ...center, rings: 16 }, pulseCore: true, draw: true };
    // "gather you again from dust" — reforming from dust.
    case "fp-gather":
      return { cfg: { ...center, seed: 26 }, dust: 48, pulseCore: true, draw: true };
    default:
      return { cfg: center, draw: true };
  }
};

export const isFingerprintScene = (name?: string): boolean =>
  typeof name === "string" && name.startsWith("fp-");

// overlay = composite the ridges over real cinematic footage (CinematicBg) for
// the premium look: no opaque base, ridges brightened + a soft gold glow, and a
// faint dark "seat" so they read over a busy clip. Otherwise the scene is a
// self-contained dark-green backdrop.
export const FingerprintScene: React.FC<{ name: string; overlay?: boolean; still?: boolean }> = ({
  name,
  overlay = false,
  still = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const cfgs = sceneConfig(name);
  const { cfg, cfg2, highlightRing, scan, dust, pulseCore } = cfgs;
  // still = a settled, fully-drawn frame (for cover stills): no draw-on, no fade.
  const draw = still ? false : cfgs.draw;
  const fade = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const opacity = still ? 1 : Math.min(fade, out);
  return (
    <AbsoluteFill style={{ background: overlay ? "transparent" : "#0b1410", opacity }}>
      {overlay ? (
        // Seat the print on the footage: a soft dark vignette focused behind the
        // ridge cluster so the fine gold lines stay legible over bright texture.
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 46% 34% at 50% 38%, rgba(5,13,9,0.55) 0%, rgba(5,13,9,0.15) 55%, transparent 72%)",
          }}
        />
      ) : (
        <AbsoluteFill
          style={{ background: "radial-gradient(circle at 50% 40%, #15301f 0%, #050d09 72%)" }}
        />
      )}
      <CoreGlow pulse={pulseCore && !overlay} />
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid slice"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          filter: overlay ? "drop-shadow(0 0 7px rgba(231,200,115,0.45))" : undefined,
        }}
      >
        <RidgeField cfg={cfg} highlightRing={highlightRing} draw={draw} bright={overlay} />
        {cfg2 ? <RidgeField cfg={cfg2} draw={draw} bright={overlay} /> : null}
      </svg>
      {/* The sweeping scan line and rising dust are motion-heavy, so they are
          only used by the standalone (non-overlay) treatment. In the composited
          short, the fingerprint holds still over the calm footage. */}
      {scan && !overlay ? <ScanLine /> : null}
      {dust && !overlay ? <Dust count={dust} opacity={1} /> : null}
      {overlay ? null : <Grade />}
    </AbsoluteFill>
  );
};
