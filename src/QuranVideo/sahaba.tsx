import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT, ARABIC_DISPLAY_FONT } from "./fonts";

// Generic, DATA-DRIVEN "Meet the Sahaba" scene kit. Warm parchment/gold palette
// (distinct from the green/blue Decoded look). Content comes from each segment's
// `data` field, so every companion is just a JSON + QC, no new code.
type SceneProps = { theme: ThemePalette; data?: any };
const CREAM = "#f3ecda";
const GOLD = "#e7c163";
const AMBER = "#c8a05a";
const SAGE = "#8fae8c";
const BG = "radial-gradient(ellipse at 50% 38%, #2a2012 0%, #18110a 55%, #0c0805 100%)";
const CARD = "rgba(40,30,16,0.80)";
const BORDER = "1px solid rgba(200,160,90,0.42)";

// Concentric medallion emblem (safe Islamic geometry — no stars/figures).
const Medallion: React.FC<{ f: number; size: number }> = ({ f, size }) => {
  const spin = (f % 360);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity: 0.9 }}>
      <circle cx="50" cy="50" r="46" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.7" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={AMBER} strokeWidth="0.8" opacity="0.5" />
      <g transform={`rotate(${spin} 50 50)`}>
        {new Array(16).fill(0).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          return <line key={i} x1={50 + Math.cos(a) * 38} y1={50 + Math.sin(a) * 38} x2={50 + Math.cos(a) * 46} y2={50 + Math.sin(a) * 46} stroke={GOLD} strokeWidth="0.8" opacity="0.6" />;
        })}
      </g>
    </svg>
  );
};

const SahabaName: React.FC<SceneProps> = ({ data }) => {
  const f = useCurrentFrame();
  const d = data || {};
  const inn = interpolate(f, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const sub = interpolate(f, [14, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      <div style={{ position: "absolute", opacity: inn * 0.5 }}><Medallion f={f * 0.3} size={520} /></div>
      <div style={{ fontFamily: ARABIC_DISPLAY_FONT, fontSize: 150, color: GOLD, opacity: inn, transform: `scale(${0.92 + inn * 0.08})`, textShadow: "0 0 50px rgba(231,193,99,0.4)" }}>{d.arabic || ""}</div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 58, fontWeight: 800, color: CREAM, opacity: sub, marginTop: 6, textAlign: "center" }}>{d.name || ""}</div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 30, letterSpacing: 2, color: AMBER, opacity: sub, marginTop: 14, textAlign: "center" }}>{d.title || ""}</div>
    </AbsoluteFill>
  );
};

const SahabaDossier: React.FC<SceneProps> = ({ data }) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const tiles: [string, string][] = (data && data.tiles) || [];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      {tiles.map((t, i) => {
        const show = interpolate(f, [6 + i * 12, 20 + i * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ width: width * 0.78, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "22px 36px", margin: "10px 0", borderRadius: 18, background: CARD, border: BORDER, opacity: show, transform: `translateX(${(1 - show) * -26}px)` }}>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 30, color: CREAM }}>{t[1]}</span>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 46, fontWeight: 800, color: GOLD }}>{t[0]}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Vertical "journey" map: connected milestones drawing downward.
const SahabaJourney: React.FC<SceneProps> = ({ data }) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const d = data || {};
  const rows: [string, string][] = d.rows || [];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 36, fontWeight: 800, color: CREAM, marginBottom: 26, opacity: interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>{d.heading || "The journey"}</div>
      <div style={{ position: "relative", width: width * 0.82 }}>
        {rows.map((r, i) => {
          const show = interpolate(f, [10 + i * 14, 26 + i * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const last = i === rows.length - 1;
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 22, opacity: show, transform: `translateX(${(1 - show) * 22}px)` }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "stretch" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: GOLD, boxShadow: `0 0 14px ${GOLD}`, marginTop: 8 }} />
                {!last ? <div style={{ width: 2, flex: 1, minHeight: 42, background: `linear-gradient(${AMBER}, rgba(200,160,90,0.2))` }} /> : null}
              </div>
              <div style={{ paddingBottom: 26 }}>
                <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 28, fontWeight: 800, letterSpacing: 1.5, color: GOLD }}>{r[0]}</div>
                <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 30, color: CREAM, marginTop: 4 }}>{r[1]}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SahabaPoll: React.FC<SceneProps> = ({ data }) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const d = data || {};
  const opts: string[] = d.options || [];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 46, fontWeight: 800, color: CREAM, textAlign: "center", marginBottom: 30, opacity: interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" }) }}>{d.question || ""}</div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, width: width * 0.84 }}>
        {opts.map((o, i) => {
          const show = interpolate(f, [16 + i * 8, 28 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <div key={i} style={{ width: "44%", textAlign: "center", padding: "24px 10px", borderRadius: 18, background: "rgba(200,160,90,0.12)", border: `2px solid ${GOLD}`, opacity: show, transform: `scale(${0.9 + show * 0.1})`, fontFamily: TRANSLATION_FONT, fontSize: 34, fontWeight: 700, color: GOLD }}>{o}</div>;
        })}
      </div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 32, color: SAGE, marginTop: 30, opacity: interpolate(f, [44, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>{d.cta || "Comment your answer."}</div>
    </AbsoluteFill>
  );
};

const SahabaVirtues: React.FC<SceneProps> = ({ data }) => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const d = data || {};
  const items: string[] = d.items || [];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 38, fontWeight: 800, color: CREAM, marginBottom: 22, opacity: interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>{d.heading || "His legacy"}</div>
      {items.map((r, i) => {
        const show = interpolate(f, [10 + i * 11, 24 + i * 11], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ width: width * 0.82, display: "flex", alignItems: "center", gap: 18, padding: "16px 28px", margin: "7px 0", borderRadius: 14, background: CARD, border: BORDER, opacity: show, transform: `translateX(${(1 - show) * 22}px)` }}>
            <span style={{ color: GOLD, fontSize: 28 }}>✦</span>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 32, color: CREAM }}>{r}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const sahabaScenes: Record<string, React.FC<SceneProps>> = {
  "sahaba-name": SahabaName,
  "sahaba-dossier": SahabaDossier,
  "sahaba-journey": SahabaJourney,
  "sahaba-poll": SahabaPoll,
  "sahaba-virtues": SahabaVirtues,
};
