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

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 38%, ${theme.gradientFrom} 0%, ${theme.gradientTo} 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          opacity: 0.9,
        }}
      >
        <GeometricPattern color={theme.patternColor} />
      </AbsoluteFill>
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
