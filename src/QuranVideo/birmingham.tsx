import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT, ARABIC_DISPLAY_FONT } from "./fonts";

// Bespoke motion-graphics for the Birmingham Qur'an manuscript video.
type SceneProps = { theme: ThemePalette };
const CREAM = "#f3ecda";
const GOLD = "#e7c163";
const GREEN = "#4f9a7a";
const BG = "radial-gradient(ellipse at 50% 42%, #15271f 0%, #0c1a13 55%, #08120d 100%)";

// An aged parchment folio with early Hijazi-era Arabic (from Surah Maryam, which
// the real manuscript contains).
const Manuscript: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const inn = interpolate(f, [0, 22], [0, 1], { extrapolateRight: "clamp" });
  const float = Math.sin(f / 30) * 6;
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: width * 0.9, height: width * 0.9, borderRadius: "50%", background: "radial-gradient(circle, rgba(231,193,99,0.16), transparent 60%)" }} />
      <div
        dir="rtl"
        style={{
          width: width * 0.74,
          height: height * 0.5,
          background: "linear-gradient(155deg, #efe2c2 0%, #e3d2ab 55%, #d2bd8e 100%)",
          borderRadius: 12,
          boxShadow: "0 40px 90px rgba(0,0,0,0.55), inset 0 0 80px rgba(120,90,40,0.35)",
          transform: `translateY(${float}px) rotate(-2deg) scale(${0.9 + inn * 0.1})`,
          opacity: inn,
          padding: "60px 54px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 34,
          fontFamily: ARABIC_DISPLAY_FONT,
          color: "#3a2a16",
          fontSize: 52,
          lineHeight: 1.9,
        }}
      >
        <div>وَاذْكُرْ فِي الْكِتَابِ مَرْيَمَ</div>
        <div>إِذِ انتَبَذَتْ مِنْ أَهْلِهَا</div>
        <div>مَكَانًا شَرْقِيًّا</div>
      </div>
      <div style={{ position: "absolute", bottom: height * 0.16, fontFamily: TRANSLATION_FONT, fontSize: 28, letterSpacing: 2, color: GOLD, opacity: inn }}>
        Birmingham Qur'an · Surah Maryam
      </div>
    </AbsoluteFill>
  );
};

// The carbon-dating graph: the parchment's date range vs the Prophet's lifetime.
const CarbonTimeline: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const x0 = 130;
  const x1 = width - 130;
  const yr = (y: number) => x0 + (x1 - x0) * ((y - 550) / 110);
  const axisY = height * 0.62;
  const grow = interpolate(f, [10, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const grow2 = interpolate(f, [30, 54], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const band = (x: number, w: number, top: number, color: string, g: number, label: string): React.ReactNode => (
    <>
      <div style={{ position: "absolute", left: x, top, width: w * g, height: 52, background: color, borderRadius: 8, transformOrigin: "left" }} />
      <div style={{ position: "absolute", left: x, top: top - 36, fontFamily: TRANSLATION_FONT, fontSize: 26, color, opacity: g }}>{label}</div>
    </>
  );
  return (
    <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", top: height * 0.16, left: 0, right: 0, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 40, fontWeight: 800, color: CREAM, opacity: interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" }) }}>
        Radiocarbon dating
      </div>
      {band(yr(568), yr(645) - yr(568), height * 0.36, GREEN, grow, "Parchment · 568–645 CE")}
      {band(yr(570), yr(632) - yr(570), height * 0.48, GOLD, grow2, "Prophet ﷺ · 570–632 CE")}
      <div style={{ position: "absolute", left: x0, top: axisY, width: x1 - x0, height: 3, background: "rgba(243,236,218,0.5)" }} />
      {[550, 575, 600, 625, 650].map((y) => (
        <div key={y} style={{ position: "absolute", left: yr(y) - 24, top: axisY + 14, width: 48, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 22, color: "rgba(243,236,218,0.7)" }}>{y}</div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: height * 0.72, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 30, fontWeight: 700, color: GOLD, opacity: grow2 }}>
        His entire life falls inside the date.
      </div>
    </AbsoluteFill>
  );
};

// 95.4% confidence gauge.
const ConfidenceMeter: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const v = interpolate(f, [8, 40], [0, 95.4], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barW = width - 220;
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 30, letterSpacing: 3, color: CREAM, opacity: 0.85 }}>DATING CONFIDENCE</div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 170, fontWeight: 800, color: GOLD, lineHeight: 1.1, textShadow: "0 0 40px rgba(231,193,99,0.5)" }}>
        {v.toFixed(1)}%
      </div>
      <div style={{ width: barW, height: 22, background: "rgba(243,236,218,0.15)", borderRadius: 12, overflow: "hidden", marginTop: 20 }}>
        <div style={{ width: `${(v / 100) * 100}%`, height: "100%", background: GOLD, borderRadius: 12 }} />
      </div>
    </AbsoluteFill>
  );
};

// 1,400-year preservation line: revelation -> today, text unchanged.
const PreservationTimeline: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const draw = interpolate(f, [8, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const x0 = 120;
  const x1 = width - 120;
  const y = height * 0.5;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", top: height * 0.32, left: 0, right: 0, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 44, fontWeight: 800, color: CREAM, opacity: interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" }) }}>
        1,400 years. Not a letter changed.
      </div>
      <div style={{ position: "absolute", left: x0, top: y, width: (x1 - x0) * draw, height: 5, background: GOLD, borderRadius: 3, boxShadow: `0 0 16px ${GOLD}` }} />
      <div style={{ position: "absolute", left: x0 - 6, top: y - 9, width: 22, height: 22, borderRadius: "50%", background: GOLD }} />
      <div style={{ position: "absolute", left: x1 - 16, top: y - 9, width: 22, height: 22, borderRadius: "50%", background: GOLD, opacity: draw > 0.95 ? 1 : 0 }} />
      <div style={{ position: "absolute", left: x0 - 30, top: y + 26, fontFamily: TRANSLATION_FONT, fontSize: 26, color: GREEN }}>610 CE</div>
      <div style={{ position: "absolute", left: x1 - 70, top: y + 26, fontFamily: TRANSLATION_FONT, fontSize: 26, color: GREEN, opacity: draw }}>Today</div>
    </AbsoluteFill>
  );
};

export const birminghamScenes: Record<string, React.FC<SceneProps>> = {
  manuscript: Manuscript,
  "carbon-timeline": CarbonTimeline,
  "confidence-meter": ConfidenceMeter,
  "preservation-timeline": PreservationTimeline,
};

export const BIRMINGHAM_FULL_VISUAL = ["manuscript", "carbon-timeline", "confidence-meter", "preservation-timeline"];
