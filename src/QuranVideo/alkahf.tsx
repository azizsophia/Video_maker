import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT, ARABIC_DISPLAY_FONT } from "./fonts";

// "Surah Decoded" scene kit — name card, info tiles, structure bar, an
// interactive poll, and a lessons list. Clean rows (no overlap), brand palette.
type SceneProps = { theme: ThemePalette };
const CREAM = "#f3ecda";
const GOLD = "#e7c163";
const GREEN = "#4f9a7a";
const BG = "radial-gradient(ellipse at 50% 42%, #15271f 0%, #0c1a13 55%, #08120d 100%)";

const AlkahfName: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const sub = interpolate(f, [14, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: ARABIC_DISPLAY_FONT, fontSize: 200, color: GOLD, opacity: inn, transform: `scale(${0.9 + inn * 0.1})`, textShadow: "0 0 50px rgba(231,193,99,0.4)" }}>الكهف</div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 64, fontWeight: 800, color: CREAM, opacity: sub, marginTop: 10 }}>Al-Kahf · The Cave</div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 32, letterSpacing: 3, color: GREEN, opacity: sub, marginTop: 14 }}>CHAPTER 18</div>
    </AbsoluteFill>
  );
};

const AlkahfInfo: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const tiles = [["MECCAN", "where it was revealed"], ["110", "verses"], ["4", "hidden stories"]];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      {tiles.map((t, i) => {
        const show = interpolate(f, [6 + i * 12, 20 + i * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ width: width * 0.78, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 36px", margin: "10px 0", borderRadius: 18, background: "rgba(18,38,30,0.78)", border: "1px solid rgba(79,154,122,0.45)", opacity: show, transform: `translateX(${(1 - show) * -26}px)` }}>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 30, color: CREAM }}>{t[1]}</span>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 52, fontWeight: 800, color: GOLD }}>{t[0]}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const AlkahfStructure: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const rows = [["1", "The People of the Cave", "FAITH"], ["2", "The Two Gardens", "WEALTH"], ["3", "Musa & Al-Khidr", "KNOWLEDGE"], ["4", "Dhul-Qarnayn", "POWER"]];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 38, fontWeight: 800, color: CREAM, marginBottom: 24, opacity: interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>Four stories. Four trials.</div>
      {rows.map((r, i) => {
        const show = interpolate(f, [10 + i * 12, 24 + i * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ width: width * 0.84, display: "flex", alignItems: "center", padding: "18px 30px", margin: "8px 0", borderRadius: 16, background: "rgba(18,38,30,0.78)", border: "1px solid rgba(79,154,122,0.45)", opacity: show, transform: `translateX(${(1 - show) * -24}px)` }}>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 40, fontWeight: 800, color: GOLD, width: 50 }}>{r[0]}</span>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 34, color: CREAM, flex: 1 }}>{r[1]}</span>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 24, letterSpacing: 1, color: GREEN }}>{r[2]}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const PollCard: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const opts = ["Faith", "Wealth", "Knowledge", "Power"];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 50, fontWeight: 800, color: CREAM, textAlign: "center", marginBottom: 30, opacity: interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" }) }}>Which one is testing YOU?</div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, width: width * 0.84 }}>
        {opts.map((o, i) => {
          const show = interpolate(f, [16 + i * 8, 28 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <div key={i} style={{ width: "44%", textAlign: "center", padding: "26px 0", borderRadius: 18, background: "rgba(231,193,99,0.12)", border: `2px solid ${GOLD}`, opacity: show, transform: `scale(${0.9 + show * 0.1})`, fontFamily: TRANSLATION_FONT, fontSize: 40, fontWeight: 700, color: GOLD }}>{o}</div>;
        })}
      </div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 34, color: GREEN, marginTop: 30, opacity: interpolate(f, [44, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>Comment it below.</div>
    </AbsoluteFill>
  );
};

const AlkahfLessons: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const rows = ["Faith outlasts numbers.", "Wealth is borrowed, never owned.", "Knowledge has limits only Allah sees past.", "Power is a test, not a trophy."];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 38, fontWeight: 800, color: CREAM, marginBottom: 22, opacity: interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>What it teaches</div>
      {rows.map((r, i) => {
        const show = interpolate(f, [10 + i * 11, 24 + i * 11], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ width: width * 0.82, display: "flex", alignItems: "center", gap: 18, padding: "16px 28px", margin: "7px 0", borderRadius: 14, background: "rgba(18,38,30,0.78)", border: "1px solid rgba(79,154,122,0.4)", opacity: show, transform: `translateX(${(1 - show) * 22}px)` }}>
            <span style={{ color: GOLD, fontSize: 30 }}>◆</span>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 34, color: CREAM }}>{r}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const alkahfScenes: Record<string, React.FC<SceneProps>> = {
  "alkahf-name": AlkahfName,
  "alkahf-info": AlkahfInfo,
  "alkahf-structure": AlkahfStructure,
  "poll-card": PollCard,
  "alkahf-lessons": AlkahfLessons,
};
