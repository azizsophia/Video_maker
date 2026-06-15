import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

// A faint, slowly drifting watermark. A moving mark is much harder for
// re-uploaders to crop or mask out than a fixed corner logo, yet at ~10%
// opacity it stays out of the way of the recitation.
export const Watermark: React.FC<{ src: string; opacity: number }> = ({
  src,
  opacity,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const resolved = /^https?:\/\//.test(src) ? src : staticFile(src);

  // Drift along a slow diagonal loop across the whole timeline.
  const t = frame / Math.max(1, durationInFrames);
  const x = interpolate(Math.sin(t * Math.PI * 2), [-1, 1], [-width * 0.18, width * 0.18]);
  const y = interpolate(Math.cos(t * Math.PI * 2), [-1, 1], [-60, 60]);
  // Gentle opacity breathing so it never reads as a static stamp.
  const breathe = interpolate(Math.sin(t * Math.PI * 4), [-1, 1], [0.7, 1]);

  const size = Math.round(width * 0.34);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", pointerEvents: "none" }}>
      <Img
        src={resolved}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          opacity: opacity * breathe,
          transform: `translate(${x}px, ${y}px)`,
          filter: "drop-shadow(0 0 12px rgba(0,0,0,0.25))",
        }}
      />
    </AbsoluteFill>
  );
};
