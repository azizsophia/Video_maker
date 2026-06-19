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

// 632 (prophecy) -> 1453 (conquest): two clean endpoints, the 821-year gap big
// in the centre. (Failed-siege dots removed; they clustered and overlapped.)
const ProphecyTimeline: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const lx = 150;
  const rx = width - 150;
  const axisY = height * 0.52;
  const draw = interpolate(f, [12, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const right = interpolate(f, [50, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endpoint = (cxp: number, year: string, label: string, show: number) => (
    <div style={{ position: "absolute", left: cxp - 150, top: axisY - 150, width: 300, textAlign: "center", opacity: show }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 84, fontWeight: 800, color: GOLD, textShadow: "0 0 22px rgba(231,193,99,0.5)" }}>{year}</div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 30, letterSpacing: 2, color: CREAM, marginTop: 6 }}>{label}</div>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: GOLD, margin: "26px auto 0", boxShadow: `0 0 16px ${GOLD}` }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", left: lx, top: axisY, width: (rx - lx) * draw, height: 5, background: "rgba(243,236,218,0.45)", borderRadius: 3 }} />
      {endpoint(lx, "632", "THE PROPHECY", interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" }))}
      {endpoint(rx, "1453", "THE CONQUEST", right)}
      <div style={{ position: "absolute", left: 0, right: 0, top: axisY + 90, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 120, fontWeight: 800, color: CREAM, opacity: draw, textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>
        821
        <div style={{ fontSize: 40, letterSpacing: 8, color: GREEN }}>YEARS LATER</div>
      </div>
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
