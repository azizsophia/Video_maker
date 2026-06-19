import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT } from "./fonts";

type SceneProps = { theme: ThemePalette };
const CREAM = "#f3ecda";
const GOLD = "#e7c163";
const GREEN = "#4f9a7a";
const RED = "#d9695b";
const BG = "radial-gradient(ellipse at 50% 42%, #15271f 0%, #0c1a13 55%, #08120d 100%)";

// 632 (prophecy) -> 1453 (conquest), with failed sieges marked in the gap.
const ProphecyTimeline: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const x0 = 110;
  const x1 = width - 110;
  const x = (y: number) => x0 + (x1 - x0) * ((y - 600) / 900);
  const axisY = height * 0.5;
  const draw = interpolate(f, [10, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fails = [
    { y: 674, label: "674" },
    { y: 717, label: "717" },
    { y: 1390, label: "1390s" },
  ];
  const dot = (y: number, color: string, top: string, label: string, show: number) => (
    <>
      <div style={{ position: "absolute", left: x(y) - 9, top: axisY - 9, width: 18, height: 18, borderRadius: "50%", background: color, opacity: show, boxShadow: `0 0 14px ${color}` }} />
      <div style={{ position: "absolute", left: x(y) - 70, width: 140, textAlign: "center", top, fontFamily: TRANSLATION_FONT, fontSize: 26, color, opacity: show }}>{label}</div>
    </>
  );
  return (
    <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", top: height * 0.22, left: 0, right: 0, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 38, fontWeight: 800, color: CREAM, opacity: interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" }) }}>
        821 years apart
      </div>
      <div style={{ position: "absolute", left: x0, top: axisY, width: (x1 - x0) * draw, height: 4, background: "rgba(243,236,218,0.55)", borderRadius: 2 }} />
      {fails.map((s) => (
        <React.Fragment key={s.y}>{dot(s.y, RED, `${axisY + 22}px`, "siege failed", draw > (s.y - 600) / 900 ? 0.85 : 0)}</React.Fragment>
      ))}
      {dot(632, GOLD, `${axisY - 80}px`, "632 · the prophecy", 1)}
      {dot(1453, GOLD, `${axisY - 80}px`, "1453 · the conquest", draw > 0.9 ? 1 : 0)}
    </AbsoluteFill>
  );
};

// Stylized tactic: the chain across the Golden Horn, and the ships hauled overland around it.
const GoldenHorn: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const chain = interpolate(f, [8, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const path = interpolate(f, [30, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cx = width / 2;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #10243a 0%, #0a1726 55%, #060e16 100%)" }}>
      {/* water regions */}
      <div style={{ position: "absolute", left: 0, right: 0, top: height * 0.2, height: height * 0.24, background: "rgba(60,120,180,0.18)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: height * 0.18, height: height * 0.24, background: "rgba(60,120,180,0.18)" }} />
      <div style={{ position: "absolute", left: 60, top: height * 0.22, fontFamily: TRANSLATION_FONT, fontSize: 28, color: "#9cc2e8" }}>THE GOLDEN HORN</div>
      <div style={{ position: "absolute", left: 60, bottom: height * 0.2, fontFamily: TRANSLATION_FONT, fontSize: 28, color: "#9cc2e8" }}>THE SEA</div>
      {/* the chain across the mouth */}
      <div style={{ position: "absolute", left: 0, right: 0, top: height * 0.46, display: "flex", justifyContent: "center", gap: 10, opacity: chain }}>
        {new Array(16).fill(0).map((_, i) => (
          <div key={i} style={{ width: 26, height: 16, border: `3px solid ${RED}`, borderRadius: 10 }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: height * 0.49, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 26, color: RED, opacity: chain }}>iron chain blocks the harbor</div>
      {/* overland ship path */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={`M ${cx + 300} ${height * 0.66} C ${width - 40} ${height * 0.6}, ${width - 40} ${height * 0.36}, ${cx + 300} ${height * 0.3}`} fill="none" stroke={GOLD} strokeWidth={5} strokeDasharray="16 14" strokeDashoffset={(1 - path) * 1400} opacity={path > 0.02 ? 1 : 0} />
      </svg>
      <div style={{ position: "absolute", right: 50, top: height * 0.47, width: 220, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 26, fontWeight: 700, color: GOLD, opacity: path }}>
        70 ships hauled overland, around the chain
      </div>
    </AbsoluteFill>
  );
};

export const constantinopleScenes: Record<string, React.FC<SceneProps>> = {
  "prophecy-timeline": ProphecyTimeline,
  "golden-horn": GoldenHorn,
};
