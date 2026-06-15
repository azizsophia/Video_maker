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
        <pattern id="stars" width="180" height="180" patternUnits="userSpaceOnUse">
          {/* Eight-pointed star (khatam) — a classic Islamic motif. */}
          <g stroke={color} strokeWidth="1.5" fill="none">
            <path d="M90 20 L110 70 L160 90 L110 110 L90 160 L70 110 L20 90 L70 70 Z" />
            <rect x="55" y="55" width="70" height="70" transform="rotate(45 90 90)" />
            <circle cx="90" cy="90" r="48" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#stars)" />
    </svg>
  );
};
