import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT, ARABIC_DISPLAY_FONT } from "./fonts";

// Bespoke, accurate "Decoded" graphics for Surah Ar-Rahman. Emerald/gold.
// Every claim is sourced (55:33 names jinn + mankind; 55:46 + 55:62 = 2+2
// gardens; the refrain recurs 31 times). No hand-typed full verses — only a
// single well-known word fragment (رَبِّكُمَا) + transliteration as a label.
type SceneProps = { theme: ThemePalette; data?: any };
const CREAM = "#f3ecda";
const GOLD = "#e7c163";
const GREEN = "#5bb389";
const DIM = "#8fae8c";
const BG = "radial-gradient(ellipse at 50% 36%, #143a2c 0%, #0c2419 55%, #07140e 100%)";
const CARD = "rgba(18,42,30,0.82)";
const BORDER = "1px solid rgba(120,200,150,0.4)";

// THE reveal: the refrain is dual — addressed to mankind AND jinn (55:33).
const RahmanDual: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const top = spring({ frame: f - 2, fps, config: { damping: 200 } });
  const line = interpolate(f, [22, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const left = spring({ frame: f - 40, fps, config: { damping: 200 } });
  const right = spring({ frame: f - 50, fps, config: { damping: 200 } });
  const tag = interpolate(f, [64, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pillar = (label: string, sub: string, p: number) => (
    <div style={{ width: width * 0.36, padding: "26px 16px", borderRadius: 18, background: CARD, border: `2px solid ${GREEN}`, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 44, fontWeight: 800, color: GOLD }}>{label}</div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 28, color: CREAM, marginTop: 6 }}>{sub}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", padding: "0 56px" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 34, letterSpacing: 2, color: DIM, opacity: top, marginBottom: 18 }}>ONE QUESTION. TWO CREATIONS.</div>
      <div style={{ width: width * 0.8, padding: "26px 30px", borderRadius: 22, background: CARD, border: BORDER, textAlign: "center", opacity: top, transform: `scale(${0.94 + top * 0.06})` }}>
        <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 40, fontWeight: 700, color: CREAM, lineHeight: 1.3 }}>“So which of your Lord’s favors will you deny?”</div>
        <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 28, color: GOLD, marginTop: 14 }}>fabi-ayyi ālā’i <span style={{ background: "rgba(231,193,99,0.18)", padding: "2px 8px", borderRadius: 6 }}>rabbikumā</span> tukadhdhibān</div>
        <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 24, color: DIM, marginTop: 8 }}>rabbikumā = “your Lord” — spoken to <b style={{ color: GREEN }}>two</b></div>
      </div>
      <svg width={width * 0.7} height={70} style={{ opacity: line }}>
        <line x1={width * 0.35} y1={0} x2={width * 0.18} y2={70} stroke={GREEN} strokeWidth={3} strokeDasharray="200" strokeDashoffset={(1 - line) * 200} />
        <line x1={width * 0.35} y1={0} x2={width * 0.52} y2={70} stroke={GREEN} strokeWidth={3} strokeDasharray="200" strokeDashoffset={(1 - line) * 200} />
      </svg>
      <div style={{ display: "flex", gap: 24 }}>
        {pillar("Mankind", "al-Ins", left)}
        {pillar("Jinn", "al-Jinn", right)}
      </div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 26, color: DIM, marginTop: 26, opacity: tag }}>Named together in <span style={{ color: GOLD }}>Surah Ar-Rahman 55:33</span></div>
    </AbsoluteFill>
  );
};

// "Not one paradise — four": two gardens (55:46) + two more (55:62).
const Arch: React.FC<{ p: number; label: string }> = ({ p, label }) => (
  <div style={{ width: 200, opacity: p, transform: `translateY(${(1 - p) * 26}px)`, textAlign: "center" }}>
    <svg width={200} height={150} viewBox="0 0 100 75">
      <path d="M12 72 L12 32 Q50 -4 88 32 L88 72 Z" fill="rgba(91,179,137,0.18)" stroke={GREEN} strokeWidth="2" />
      <path d="M50 72 L50 30" stroke={GOLD} strokeWidth="1.4" opacity="0.7" />
      {[30, 44, 58].map((y, i) => <path key={i} d={`M50 ${y} q -12 -6 -20 -2 M50 ${y} q 12 -6 20 -2`} stroke={GREEN} strokeWidth="1.2" fill="none" opacity="0.8" />)}
    </svg>
    <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 22, color: CREAM, marginTop: 4 }}>{label}</div>
  </div>
);
const RahmanGardens: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = spring({ frame: f - 2, fps, config: { damping: 200 } });
  const a = spring({ frame: f - 18, fps, config: { damping: 200 } });
  const b = spring({ frame: f - 26, fps, config: { damping: 200 } });
  const c = spring({ frame: f - 46, fps, config: { damping: 200 } });
  const d = spring({ frame: f - 54, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 56, fontWeight: 800, color: CREAM, opacity: h }}>Not one paradise.</div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 70, fontWeight: 800, color: GOLD, opacity: h, marginBottom: 10 }}>Four.</div>
      <div style={{ display: "flex", gap: 30, marginTop: 10 }}><Arch p={a} label="Garden" /><Arch p={b} label="Garden" /></div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 24, color: GOLD, opacity: Math.min(a, b), margin: "4px 0 14px" }}>“two gardens” · 55:46</div>
      <div style={{ display: "flex", gap: 30 }}><Arch p={c} label="Garden" /><Arch p={d} label="Garden" /></div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 24, color: GREEN, opacity: Math.min(c, d), marginTop: 4 }}>“and besides these, two more” · 55:62</div>
    </AbsoluteFill>
  );
};

// The refrain as a rhythm: each blessing is answered by the same question, ×31.
const RahmanRhythm: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const blessings = ["He taught the Quran", "The sun and the moon", "The stars and the trees", "He raised the balance", "Man from clay", "Jinn from fire", "The two seas", "Pearls and coral"];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 40, fontWeight: 800, color: CREAM, marginBottom: 6, opacity: interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>A gift, then the question.</div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 26, color: GOLD, marginBottom: 22, opacity: interpolate(f, [6, 18], [0, 1], { extrapolateRight: "clamp" }) }}>Repeated 31 times, like a heartbeat</div>
      {blessings.map((bl, i) => {
        const show = interpolate(f, [10 + i * 7, 22 + i * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ width: width * 0.82, display: "flex", alignItems: "center", gap: 14, margin: "5px 0", opacity: show, transform: `translateX(${(1 - show) * -20}px)` }}>
            <div style={{ flex: 1, textAlign: "right", fontFamily: TRANSLATION_FONT, fontSize: 28, color: CREAM }}>{bl}</div>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: GOLD, boxShadow: `0 0 12px ${GOLD}` }} />
            <div style={{ flex: 1, fontFamily: TRANSLATION_FONT, fontSize: 24, fontStyle: "italic", color: GREEN }}>…which favor will you deny?</div>
          </div>
        );
      })}
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 30, color: DIM, marginTop: 18, opacity: interpolate(f, [70, 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>… and so on, <span style={{ color: GOLD }}>×31</span></div>
    </AbsoluteFill>
  );
};

export const rahmanScenes: Record<string, React.FC<SceneProps>> = {
  "rahman-dual": RahmanDual,
  "rahman-gardens": RahmanGardens,
  "rahman-rhythm": RahmanRhythm,
};
