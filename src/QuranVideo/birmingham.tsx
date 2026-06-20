import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, random } from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT, ARABIC_DISPLAY_FONT } from "./fonts";

// Bespoke motion-graphics for the Birmingham Qur'an manuscript video.
type SceneProps = { theme: ThemePalette };
const CREAM = "#f3ecda";
const GOLD = "#e7c163";
const GREEN = "#4f9a7a";
const BG = "radial-gradient(ellipse at 50% 42%, #15271f 0%, #0c1a13 55%, #08120d 100%)";

// An aged parchment folio (museum-style) with undotted Hijazi-era Arabic from
// Surah Maryam, which the real Birmingham manuscript contains. Ragged edges,
// stains, darkened borders, ruling lines, a warm spotlight + drifting dust.
const STAINS =
  "radial-gradient(circle at 17% 20%, rgba(120,85,40,0.28), transparent 18%)," +
  "radial-gradient(circle at 84% 28%, rgba(110,75,35,0.24), transparent 16%)," +
  "radial-gradient(circle at 28% 82%, rgba(85,55,24,0.30), transparent 22%)," +
  "radial-gradient(circle at 73% 86%, rgba(120,85,40,0.22), transparent 18%)";
const RAGGED =
  "polygon(1.5% 3%, 22% 0.6%, 48% 2.6%, 78% 0.4%, 98.5% 4%, 100% 28%, 98.8% 56%, 100% 92%, 72% 99.4%, 45% 97.6%, 14% 100%, 1% 72%, 2.2% 40%)";

const Manuscript: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height, durationInFrames, fps } = useVideoConfig();
  const inn = interpolate(f, [0, 24], [0, 1], { extrapolateRight: "clamp" });
  const zoom = interpolate(f, [0, durationInFrames], [1, 1.06]);
  const t = f / fps;
  const W = width * 0.78;
  const H = height * 0.54;
  const lines = ["واذكر في الكتاب مريم", "اذ انتبذت من اهلها", "مكانا شرقيا"];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", width: W * 1.5, height: W * 1.5, borderRadius: "50%", background: "radial-gradient(circle, rgba(231,193,99,0.22), transparent 60%)" }} />
      {new Array(18).fill(0).map((_, i) => {
        const s = i + 1;
        const x = (random(`mx${s}`) * width + t * 8 * (0.3 + random(`mv${s}`))) % width;
        const y = height * 0.18 + random(`my${s}`) * height * 0.64;
        return <div key={i} style={{ position: "absolute", left: x, top: y + Math.sin(t + s) * 10, width: 3, height: 3, borderRadius: "50%", background: "rgba(231,193,99,0.55)", opacity: 0.4 }} />;
      })}
      <div style={{ transform: `scale(${zoom}) rotate(-1.6deg)`, opacity: inn }}>
        <div
          dir="rtl"
          style={{
            position: "relative",
            width: W,
            height: H,
            background: `${STAINS}, linear-gradient(150deg, #ece0bf 0%, #ddc99c 52%, #c9b184 100%)`,
            clipPath: RAGGED,
            boxShadow: "0 55px 110px rgba(0,0,0,0.62)",
            padding: "76px 70px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 42,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={`r${i}`} style={{ position: "absolute", left: 60, right: 60, top: `${26 + i * 18}%`, height: 1, background: "rgba(90,62,28,0.18)" }} />
          ))}
          {lines.map((line, i) => (
            <div key={i} style={{ fontFamily: ARABIC_DISPLAY_FONT, color: "#3a2912", fontSize: 58, lineHeight: 1.6, opacity: 0.9, textShadow: "0 1px 0 rgba(255,255,255,0.25)" }}>{line}</div>
          ))}
          <div style={{ position: "absolute", inset: 0, clipPath: RAGGED, background: "radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(70,46,16,0.55) 100%)", pointerEvents: "none" }} />
        </div>
      </div>
      <div style={{ position: "absolute", bottom: height * 0.13, fontFamily: TRANSLATION_FONT, fontSize: 28, letterSpacing: 2, color: GOLD, opacity: inn }}>
        The Birmingham Qur'an · Surah Maryam
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

// Clean comparison: the same line, dated 568 CE vs today, marked identical.
const MatchCompare: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const a = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const b = interpolate(f, [22, 38], [0, 1], { extrapolateRight: "clamp" });
  const badge = interpolate(f, [46, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const line = "وَاذْكُرْ فِي الْكِتَابِ مَرْيَمَ";
  const card = (op: number, ty: number): React.CSSProperties => ({
    width: width * 0.8,
    background: "rgba(18,38,30,0.78)",
    border: "1px solid rgba(79,154,122,0.5)",
    borderRadius: 24,
    padding: "30px 40px",
    textAlign: "center",
    opacity: op,
    transform: `translateY(${ty}px)`,
  });
  const lab: React.CSSProperties = { fontFamily: TRANSLATION_FONT, fontSize: 26, letterSpacing: 3, color: GOLD };
  const ar: React.CSSProperties = { fontFamily: ARABIC_DISPLAY_FONT, fontSize: 54, color: CREAM, marginTop: 10, lineHeight: 1.6 };
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={card(a, (1 - a) * -24)}>
        <div style={lab}>THE PARCHMENT · 568 CE</div>
        <div dir="rtl" style={ar}>{line}</div>
      </div>
      <div style={{ margin: "22px 0", opacity: badge, fontFamily: TRANSLATION_FONT, fontSize: 30, fontWeight: 800, letterSpacing: 2, color: "#0c1a13", background: GOLD, padding: "10px 26px", borderRadius: 30 }}>
        ✓ IDENTICAL
      </div>
      <div style={card(b, (1 - b) * 24)}>
        <div style={lab}>TODAY</div>
        <div dir="rtl" style={ar}>{line}</div>
      </div>
    </AbsoluteFill>
  );
};

export const birminghamScenes: Record<string, React.FC<SceneProps>> = {
  manuscript: Manuscript,
  "match-compare": MatchCompare,
  "carbon-timeline": CarbonTimeline,
  "confidence-meter": ConfidenceMeter,
  "preservation-timeline": PreservationTimeline,
};

export const BIRMINGHAM_FULL_VISUAL = ["manuscript", "carbon-timeline", "confidence-meter", "preservation-timeline"];
