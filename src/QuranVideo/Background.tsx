import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ThemePalette } from "./themes";
import { MotifKind, ParticleStyle, VisualVariant, pickVariant } from "./visualVariants";

// A fully code-generated, slowly breathing Islamic geometric backdrop.
// Deliberately cheap to rasterize: CI runners have no GPU, so we avoid blur
// filters and box-shadows (which are very slow in software) and keep a single
// transformed lattice. Motion comes from transforms + opacity, which are cheap.
//
// The MOTIF, MOTION and PARTICLE style come from a per-video `variant` so each
// render looks visually distinct instead of mass-produced (see
// visualVariants.ts + docs/CREATOR_REWARDS.md). Callers pass either an explicit
// `variant`, or a `seed` (story title / surah name) that deterministically
// selects one.
export const Background: React.FC<{
  theme: ThemePalette;
  variant?: VisualVariant;
  seed?: string;
}> = ({ theme, variant, seed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const v = variant ?? pickVariant(seed ?? "");

  // Slow zoom + drift for a "living" feel — direction/amount vary per variant.
  const scale = interpolate(frame, [0, durationInFrames], [v.zoomFrom, v.zoomTo]);
  const rotate = interpolate(frame, [0, durationInFrames], [0, v.rotate]);
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
      {/* Single geometric lattice, slow drift — motif chosen by the variant. */}
      <AbsoluteFill
        style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, opacity: 0.9 }}
      >
        <GeometricPattern motif={v.motif} color={theme.patternColor} />
      </AbsoluteFill>
      {/* A handful of drifting motes — plain dots (no blur/shadow) so they're
          essentially free to render; behavior varies per variant. */}
      <Particles frame={frame} color={theme.accent} style={v.particles} />
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

const Particles: React.FC<{ frame: number; color: string; style: ParticleStyle }> = ({
  frame,
  color,
  style,
}) => {
  const count = style === "twinkle" ? 16 : 10;
  const dots = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const r = seed / 233280;
        return {
          x: (r * 100 + i * 9.1) % 100,
          y0: ((seed >> 4) % 100),
          size: 2 + ((seed >> 3) % 3),
          speed: 0.06 + ((seed >> 5) % 7) / 60,
          phase: (seed % 100) / 100,
          drift: ((seed >> 7) % 10) - 5,
        };
      }),
    [count]
  );
  return (
    <AbsoluteFill>
      {dots.map((d, i) => {
        const cycle = (d.phase + frame * d.speed * 0.01) % 1;
        let x = d.x;
        let y: number;
        let fade: number;
        if (style === "twinkle") {
          // Stay put and pulse in/out — like distant stars.
          x = d.x;
          y = d.y0;
          fade = Math.max(0, Math.sin((d.phase + frame * d.speed * 0.03) * Math.PI * 2));
        } else if (style === "fall") {
          y = cycle * 110 - 5;
          x = d.x + Math.sin((frame / 60) * d.speed * 4) * d.drift;
          fade = Math.sin(cycle * Math.PI);
        } else if (style === "drift") {
          // Diagonal drift across the frame.
          y = 100 - cycle * 110;
          x = (d.x + cycle * 30 * Math.sign(d.drift || 1)) % 100;
          fade = Math.sin(cycle * Math.PI);
        } else {
          // "rise" (default): motes float upward.
          y = 100 - cycle * 110;
          x = d.x + Math.sin((frame / 60) * d.speed * 4) * d.drift;
          fade = Math.sin(cycle * Math.PI);
        }
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

// All motifs are pure SVG tiles (strokes/fills only, no filters) so they stay
// cheap to rasterize on GPU-less CI. Each is a repeating <pattern>.
const GeometricPattern: React.FC<{ motif: MotifKind; color: string }> = ({ motif, color }) => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 1080 1080" preserveAspectRatio="xMidYMid slice">
      <defs>{motifDef(motif, color)}</defs>
      <rect width="100%" height="100%" fill={`url(#motif-${motif})`} />
    </svg>
  );
};

const motifDef = (motif: MotifKind, color: string): React.ReactNode => {
  const stroke = { stroke: color, strokeWidth: 1.5, fill: "none" as const };
  switch (motif) {
    case "rosette":
      // Interlaced-circle rosette (flower-of-life lattice) — purely circular.
      return (
        <pattern id="motif-rosette" width="180" height="180" patternUnits="userSpaceOnUse">
          <g {...stroke}>
            <circle cx="90" cy="90" r="52" />
            <circle cx="90" cy="90" r="30" />
            <circle cx="0" cy="90" r="52" />
            <circle cx="180" cy="90" r="52" />
            <circle cx="90" cy="0" r="52" />
            <circle cx="90" cy="180" r="52" />
          </g>
          <circle cx="90" cy="90" r="5" fill={color} />
        </pattern>
      );
    case "khatam":
      // Eight-fold "khatam" star: two overlaid squares + a bounding octagon.
      return (
        <pattern id="motif-khatam" width="160" height="160" patternUnits="userSpaceOnUse">
          <g {...stroke}>
            <rect x="34" y="34" width="92" height="92" />
            <rect x="34" y="34" width="92" height="92" transform="rotate(45 80 80)" />
            <circle cx="80" cy="80" r="66" />
          </g>
          <circle cx="80" cy="80" r="4" fill={color} />
        </pattern>
      );
    case "arcs":
      // Concentric muqarnas-style arches, tiled — a gentle vaulted rhythm.
      return (
        <pattern id="motif-arcs" width="200" height="120" patternUnits="userSpaceOnUse">
          <g {...stroke}>
            <path d="M0 120 A100 100 0 0 1 200 120" />
            <path d="M30 120 A70 70 0 0 1 170 120" />
            <path d="M60 120 A40 40 0 0 1 140 120" />
            <path d="M-100 120 A100 100 0 0 1 100 120" />
            <path d="M100 120 A100 100 0 0 1 300 120" />
          </g>
        </pattern>
      );
    case "hex":
      // Honeycomb hexagon lattice.
      return (
        <pattern id="motif-hex" width="120" height="104" patternUnits="userSpaceOnUse">
          <g {...stroke}>
            <polygon points="30,0 90,0 120,52 90,104 30,104 0,52" />
            <polygon points="90,0 150,0 180,52 150,104 90,104 60,52" />
          </g>
        </pattern>
      );
    case "waves":
      // Interlacing arabesque sine bands (horizontal flow).
      return (
        <pattern id="motif-waves" width="240" height="120" patternUnits="userSpaceOnUse">
          <g {...stroke}>
            <path d="M0 30 C60 0 180 60 240 30" />
            <path d="M0 60 C60 30 180 90 240 60" />
            <path d="M0 90 C60 60 180 120 240 90" />
          </g>
        </pattern>
      );
    case "diamond":
    default:
      // Girih-style diagonal diamond lattice with inscribed diamonds.
      return (
        <pattern id="motif-diamond" width="140" height="140" patternUnits="userSpaceOnUse">
          <g {...stroke}>
            <polygon points="70,6 134,70 70,134 6,70" />
            <polygon points="70,40 100,70 70,100 40,70" />
          </g>
          <circle cx="70" cy="70" r="3" fill={color} />
        </pattern>
      );
  }
};
