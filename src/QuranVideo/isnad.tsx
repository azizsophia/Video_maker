import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT } from "./fonts";

type SceneProps = { theme: ThemePalette };
const CREAM = "#f3ecda";
const GOLD = "#e7c163";
const GREEN = "#4f9a7a";
const RED = "#d9695b";
const ORANGE = "#d9974b";
const BG = "radial-gradient(ellipse at 50% 42%, #15271f 0%, #0c1a13 55%, #08120d 100%)";

// The chain of narrators, drawn top to bottom.
const IsnadChain: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const nodes = ["The Prophet · ﷺ", "A Companion", "A Successor", "A Scholar", "Imam al-Bukhari"];
  const cx = width / 2;
  const y0 = height * 0.16;
  const step = (height * 0.66) / (nodes.length - 1);
  return (
    <AbsoluteFill style={{ background: BG }}>
      {nodes.map((n, i) => {
        const show = interpolate(f, [10 + i * 12, 24 + i * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = y0 + i * step;
        const isEnd = i === 0 || i === nodes.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 ? <div style={{ position: "absolute", left: cx - 2, top: y - step + 40, width: 4, height: step - 80, background: GREEN, opacity: show }} /> : null}
            <div style={{ position: "absolute", left: cx - 220, top: y - 34, width: 440, textAlign: "center", padding: "16px 0", borderRadius: 18, background: isEnd ? "rgba(231,193,99,0.14)" : "rgba(18,38,30,0.8)", border: `1px solid ${isEnd ? GOLD : GREEN}`, opacity: show, fontFamily: TRANSLATION_FONT, fontSize: 38, fontWeight: isEnd ? 800 : 600, color: isEnd ? GOLD : CREAM }}>{n}</div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// Vetting a single narrator.
const RijalCard: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const checks = ["Truthful?", "Precise memory?", "Met his teacher?"];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 32, letterSpacing: 2, color: GOLD, marginBottom: 24, opacity: interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>EVERY NARRATOR, INVESTIGATED</div>
      {checks.map((c, i) => {
        const show = interpolate(f, [14 + i * 14, 28 + i * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ width: width * 0.78, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 34px", margin: "9px 0", borderRadius: 16, background: "rgba(18,38,30,0.78)", border: "1px solid rgba(79,154,122,0.45)", opacity: show, transform: `translateX(${(1 - show) * 26}px)` }}>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 40, color: CREAM }}>{c}</span>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 40, fontWeight: 800, color: GREEN }}>{"✓"}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 600,000 examined -> ~7,000 accepted.
const BukhariFunnel: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const a = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const b = interpolate(f, [26, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 30, letterSpacing: 1, color: CREAM, opacity: a }}>Imam al-Bukhari examined</div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 110, fontWeight: 800, color: CREAM, opacity: a }}>600,000</div>
      <svg width={width * 0.7} height={140} style={{ opacity: b }}>
        <polygon points={`${width * 0.05},0 ${width * 0.65},0 ${width * 0.42},140 ${width * 0.28},140`} fill="rgba(231,193,99,0.18)" stroke={GOLD} strokeWidth={2} />
      </svg>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 28, color: GOLD, opacity: b }}>accepted only</div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 120, fontWeight: 800, color: GOLD, opacity: b, textShadow: "0 0 30px rgba(231,193,99,0.5)" }}>~7,000</div>
    </AbsoluteFill>
  );
};

// The grading scale.
const GradingScale: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const rows = [
    { t: "SAHIH", s: "authentic", c: GREEN },
    { t: "HASAN", s: "good", c: GOLD },
    { t: "DA'IF", s: "weak", c: ORANGE },
    { t: "MAWDU'", s: "fabricated", c: RED },
  ];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 34, fontWeight: 800, color: CREAM, marginBottom: 28, opacity: interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>Graded by its chain</div>
      {rows.map((r, i) => {
        const show = interpolate(f, [12 + i * 12, 26 + i * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ width: width * 0.78, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 34px", margin: "8px 0", borderRadius: 16, background: `${r.c}22`, border: `2px solid ${r.c}`, opacity: show, transform: `translateY(${(1 - show) * 16}px)` }}>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 44, fontWeight: 800, color: r.c }}>{r.t}</span>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 32, color: CREAM }}>{r.s}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const isnadScenes: Record<string, React.FC<SceneProps>> = {
  "isnad-chain": IsnadChain,
  "rijal-card": RijalCard,
  "bukhari-funnel": BukhariFunnel,
  "grading-scale": GradingScale,
};
