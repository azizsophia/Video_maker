import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ThemePalette } from "./themes";

// A fully code-generated, slowly breathing Islamic geometric backdrop.
// No stock assets — every pixel is drawn, which keeps it unique and free.
export const Background: React.FC<{ theme: ThemePalette }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Very slow zoom + drift across the whole video for a "living" feel.
  const scale = interpolate(frame, [0, durationInFrames], [1.08, 1.22]);
  const rotate = interpolate(frame, [0, durationInFrames], [0, 6]);
  // A second lattice rotating the other way for parallax depth.
  const rotate2 = interpolate(frame, [0, durationInFrames], [0, -9]);
  const scale2 = interpolate(frame, [0, durationInFrames], [1.35, 1.18]);
  // Gentle breathing of the central glow (~7s period).
  const breathe = 0.5 + 0.5 * Math.sin((frame / fpsPeriod(durationInFrames)) * Math.PI * 2);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 38%, ${theme.gradientFrom} 0%, ${theme.gradientTo} 70%)`,
        }}
      />
      {/* Breathing halo behind the text. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${theme.arabicGlow} 0%, transparent 45%)`,
          opacity: 0.06 + breathe * 0.07,
        }}
      />
      {/* Far lattice, slow counter-rotation. */}
      <AbsoluteFill
        style={{ transform: `scale(${scale2}) rotate(${rotate2}deg)`, opacity: 0.35 }}
      >
        <GeometricPattern color={theme.patternColor} />
      </AbsoluteFill>
      {/* Near lattice. */}
      <AbsoluteFill
        style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, opacity: 0.9 }}
      >
        <GeometricPattern color={theme.patternColor} />
      </AbsoluteFill>
      {/* Slowly drifting motes of light. */}
      <Particles frame={frame} color={theme.accent} />
      {/* Soft vignette to focus the eye on the text. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at 50% 42%, transparent 35%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Period (in frames) for one breath: scale the cycle to the clip but keep it slow.
const fpsPeriod = (durationInFrames: number) => Math.max(150, durationInFrames / 8);

const Particles: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  // Deterministic specks that drift upward and fade — cheap and pretty.
  const dots = React.useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const r = seed / 233280;
        return {
          x: (r * 100 + i * 6.3) % 100,
          size: 2 + ((seed >> 3) % 4),
          speed: 0.06 + ((seed >> 5) % 7) / 60,
          phase: (seed % 100) / 100,
          drift: ((seed >> 7) % 10) - 5,
        };
      }),
    []
  );
  return (
    <AbsoluteFill>
      {dots.map((d, i) => {
        const cycle = (d.phase + frame * d.speed * 0.01) % 1;
        const y = 100 - cycle * 110; // rise from bottom to top
        const x = d.x + Math.sin((frame / 60) * d.speed * 4) * d.drift;
        const fade = Math.sin(cycle * Math.PI); // fade in/out over the journey
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: d.size,
              height: d.size,
              borderRadius: "50%",
              background: color,
              opacity: fade * 0.25,
              filter: "blur(0.5px)",
              boxShadow: `0 0 8px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const GeometricPattern: React.FC<{ color: string }> = ({ color }) => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 1080 1080" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="rosette" width="180" height="180" patternUnits="userSpaceOnUse">
          {/* Interlaced-circle rosette (flower-of-life lattice) — a purely
              circular Islamic geometric motif, with no pointed-star shapes. */}
          <g stroke={color} strokeWidth="1.5" fill="none">
            <circle cx="90" cy="90" r="52" />
            <circle cx="90" cy="90" r="30" />
            <circle cx="0" cy="90" r="52" />
            <circle cx="180" cy="90" r="52" />
            <circle cx="90" cy="0" r="52" />
            <circle cx="90" cy="180" r="52" />
          </g>
          <circle cx="90" cy="90" r="5" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#rosette)" />
    </svg>
  );
};
