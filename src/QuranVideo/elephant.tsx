import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT } from "./fonts";

// Year of the Elephant — aniconic only (no elephants/birds): a march map, a
// stylized Ka'ba, and falling stones.
type SceneProps = { theme: ThemePalette };
const CREAM = "#f3ecda";
const GOLD = "#e7c163";
const GREEN = "#4f9a7a";
const RED = "#d9695b";
const BG = "radial-gradient(ellipse at 50% 42%, #15271f 0%, #0c1a13 55%, #08120d 100%)";

const Kaaba: React.FC<{ size: number; glow?: number }> = ({ size, glow = 0 }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    {glow ? <div style={{ position: "absolute", inset: -size * 0.5, borderRadius: "50%", background: `radial-gradient(circle, rgba(231,193,99,${0.35 * glow}), transparent 65%)` }} /> : null}
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#23211d,#111)", borderRadius: 8, border: "1px solid #3a352c" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: size * 0.34, height: size * 0.13, background: `linear-gradient(${GOLD},#bd9533)` }} />
  </div>
);

const MarchMap: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const draw = interpolate(f, [14, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const topY = height * 0.3;
  const botY = height * 0.74;
  const cx = width / 2;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", top: height * 0.16, left: 0, right: 0, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 36, fontWeight: 800, color: CREAM, opacity: interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>Abraha's march · c. 570 CE</div>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={`M ${cx} ${botY} L ${cx} ${topY + 80}`} stroke={RED} strokeWidth={5} strokeDasharray="16 14" strokeDashoffset={(1 - draw) * 700} fill="none" />
        {draw > 0.92 ? <polygon points={`${cx},${topY + 56} ${cx - 14},${topY + 90} ${cx + 14},${topY + 90}`} fill={RED} /> : null}
      </svg>
      <div style={{ position: "absolute", left: cx - 90, top: botY, textAlign: "center", width: 180 }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: CREAM, margin: "0 auto" }} />
        <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 28, color: CREAM, marginTop: 10 }}>Sana'a, Yemen</div>
      </div>
      <div style={{ position: "absolute", left: cx - 90, top: topY - 30, textAlign: "center", width: 180, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Kaaba size={70} />
        <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 30, color: GOLD, marginTop: 12 }}>Mecca</div>
      </div>
    </AbsoluteFill>
  );
};

const KaabaProtected: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { height } = useVideoConfig();
  const inn = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const glow = 0.6 + 0.4 * Math.sin(f / 18);
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: inn, transform: `scale(${0.9 + inn * 0.1})` }}>
        <Kaaba size={260} glow={glow} />
      </div>
      <div style={{ position: "absolute", top: height * 0.66, left: 0, right: 0, textAlign: "center", padding: "0 80px", fontFamily: TRANSLATION_FONT, fontSize: 40, fontWeight: 700, color: CREAM, opacity: interpolate(f, [16, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
        "This House has a Lord who will protect it."
      </div>
    </AbsoluteFill>
  );
};

const StonesFromSky: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const armyY = height * 0.7;
  const hit = interpolate(f, [30, 60], [1, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG }}>
      {new Array(26).fill(0).map((_, i) => {
        const col = (i % 13) / 12;
        const x = 80 + col * (width - 160) + (i > 12 ? 30 : 0);
        const period = 70;
        const local = (f * 6 + i * 24) % period;
        const y = (local / period) * armyY;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 12, height: 16, background: "#cdb88a", borderRadius: 3, transform: "rotate(45deg)", opacity: 0.85 }} />;
      })}
      {/* army row that dims as it is struck */}
      <div style={{ position: "absolute", left: 0, right: 0, top: armyY, display: "flex", justifyContent: "center", gap: 14 }}>
        {new Array(7).fill(0).map((_, i) => (
          <div key={i} style={{ width: 70, height: 110, background: "#3a342b", borderRadius: 6, opacity: hit }} />
        ))}
      </div>
      <div style={{ position: "absolute", top: height * 0.2, left: 0, right: 0, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 38, fontWeight: 800, color: GOLD, opacity: interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>Stones of baked clay</div>
    </AbsoluteFill>
  );
};

export const elephantScenes: Record<string, React.FC<SceneProps>> = {
  "march-map": MarchMap,
  "kaaba-protected": KaabaProtected,
  "stones-from-sky": StonesFromSky,
};
