import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ThemePalette } from "./themes";

// A fully code-generated, slowly breathing Islamic geometric backdrop.
// Deliberately cheap to rasterize: CI runners have no GPU, so we avoid blur
// filters and box-shadows (which are very slow in software) and keep a single
// transformed lattice. Motion comes from transforms + opacity, which are cheap.
export const Background: React.FC<{ theme: ThemePalette }> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Very slow zoom + drift for a "living" feel.
  const scale = interpolate(frame, [0, durationInFrames], [1.08, 1.22]);
  const rotate = interpolate(frame, [0, durationInFrames], [0, 6]);
  // Gentle breathing of the central halo (cheap: just an opacity oscillation).
  const period = Math.max(150, durationInFrames / 8);
  const breathe = 0.5 + 0.5 * Math.sin((frame / period) * Math.PI * 2);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 38%, ${theme.gradientFrom} 0%, ${theme.gradientTo} 70%)`,
        }}
      />
      {/* Breathing halo behind the text — static gradient, animated opacity. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${theme.arabicGlow} 0%, transparent 45%)`,
          opacity: 0.06 + breathe * 0.08,
        }}
      />
      {/* Single geometric lattice, slow drift. */}
      <AbsoluteFill
        style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, opacity: 0.9 }}
      >
        <GeometricPattern color={theme.patternColor} />
      </AbsoluteFill>
      {/* A handful of drifting motes — plain dots (no blur/shadow) so they're
          essentially free to render. */}
      <Particles frame={frame} color={theme.accent} />
      {/* Soft vignette to focus the eye on the text (theme-aware: dark on dark
          themes, a soft warm edge on the light "noor" theme). */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 42%, transparent 35%, ${theme.vignette} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Particles: React.FC<{ frame: number; color: string }> = ({ frame, color }) => {
  const dots = React.useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const r = seed / 233280;
        return {
          x: (r * 100 + i * 9.1) % 100,
          size: 2 + ((seed >> 3) % 3),
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
        const y = 100 - cycle * 110;
        const x = d.x + Math.sin((frame / 60) * d.speed * 4) * d.drift;
        const fade = Math.sin(cycle * Math.PI);
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
              opacity: fade * 0.22,
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
