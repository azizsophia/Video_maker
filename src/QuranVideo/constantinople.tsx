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
  const lx = Math.round(width * 0.24);
  const rx = Math.round(width * 0.76);
  const axisY = height * 0.52;
  const draw = interpolate(f, [12, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const right = interpolate(f, [50, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endpoint = (cxp: number, year: string, label: string, show: number) => (
    <div style={{ position: "absolute", left: cxp - 210, top: axisY - 150, width: 420, textAlign: "center", opacity: show }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 80, fontWeight: 800, color: GOLD, textShadow: "0 0 22px rgba(231,193,99,0.5)" }}>{year}</div>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 27, letterSpacing: 1, color: CREAM, marginTop: 6 }}>{label}</div>
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

// The chain across the Golden Horn, and the ships hauled overland around it.
// Path kept on the right; labels centred/bottom so nothing overlaps.
const GoldenHorn: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const chain = interpolate(f, [8, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const path = interpolate(f, [30, 72], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #10243a 0%, #0a1726 55%, #060e16 100%)" }}>
      <div style={{ position: "absolute", top: height * 0.14, left: 0, right: 0, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 34, fontWeight: 800, color: CREAM, opacity: interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>The Golden Horn</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: height * 0.24, height: height * 0.2, background: "rgba(60,120,180,0.16)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TRANSLATION_FONT, fontSize: 30, color: "#9cc2e8" }}>THE HARBOR</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: height * 0.56, height: height * 0.2, background: "rgba(60,120,180,0.16)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: TRANSLATION_FONT, fontSize: 30, color: "#9cc2e8" }}>THE SEA</div>
      {/* chain across the mouth (left two thirds, leaving the right clear for the path) */}
      <div style={{ position: "absolute", left: 60, width: width * 0.55, top: height * 0.49, display: "flex", gap: 9, opacity: chain }}>
        {new Array(11).fill(0).map((_, i) => (
          <div key={i} style={{ width: 26, height: 16, border: `3px solid ${RED}`, borderRadius: 10 }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 60, top: height * 0.52, fontFamily: TRANSLATION_FONT, fontSize: 26, color: RED, opacity: chain }}>iron chain seals the harbor</div>
      {/* ship path on the far right */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={`M ${width * 0.8} ${height * 0.66} C ${width - 30} ${height * 0.62}, ${width - 30} ${height * 0.38}, ${width * 0.8} ${height * 0.34}`} fill="none" stroke={GOLD} strokeWidth={6} strokeDasharray="16 14" strokeDashoffset={(1 - path) * 1400} opacity={path > 0.02 ? 1 : 0} />
        {path > 0.95 ? <polygon points={`${width * 0.8},${height * 0.32} ${width * 0.8 - 14},${height * 0.36} ${width * 0.8 + 14},${height * 0.36}`} fill={GOLD} /> : null}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: height * 0.06, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 30, fontWeight: 700, color: GOLD, opacity: path }}>
        70 ships dragged overland, around the chain
      </div>
    </AbsoluteFill>
  );
};

// The Theodosian Walls: a moat + three walls of rising height.
const Walls: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const groundY = height * 0.64;
  const items = [
    { w: 150, h: 130, c: "#3a6cb0", label: "Moat" },
    { w: 110, h: 170, c: "#7a6a52", label: "Outer" },
    { w: 120, h: 250, c: "#9a8662", label: "Inner" },
    { w: 130, h: 340, c: "#c2ac80", label: "Great Wall" },
  ];
  const totalW = items.reduce((a, b) => a + b.w + 18, 0);
  let xCur = width / 2 - totalW / 2;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", top: height * 0.2, left: 0, right: 0, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 40, fontWeight: 800, color: CREAM, opacity: interpolate(f, [0, 12], [0, 1], { extrapolateRight: "clamp" }) }}>The Theodosian Walls</div>
      <div style={{ position: "absolute", top: height * 0.27, left: 0, right: 0, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 28, color: GOLD, opacity: interpolate(f, [6, 18], [0, 1], { extrapolateRight: "clamp" }) }}>Unbreached for 1,000 years</div>
      {items.map((it, i) => {
        const show = interpolate(f, [14 + i * 8, 30 + i * 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const left = xCur;
        xCur += it.w + 18;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left, top: groundY - it.h * show, width: it.w, height: it.h * show, background: it.c, borderRadius: "4px 4px 0 0" }} />
            <div style={{ position: "absolute", left, top: groundY + 14, width: it.w, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 22, color: CREAM, opacity: show }}>{it.label}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: width / 2 - totalW / 2, width: totalW, top: groundY, height: 4, background: "rgba(243,236,218,0.4)" }} />
    </AbsoluteFill>
  );
};

// Every recorded siege, all marked failed.
const SiegesFailed: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width } = useVideoConfig();
  const rows = ["674 CE", "717 CE", "1411", "1422"];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      {rows.map((r, i) => {
        const show = interpolate(f, [8 + i * 10, 22 + i * 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div key={i} style={{ width: width * 0.76, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 30px", margin: "8px 0", borderRadius: 16, background: "rgba(40,18,18,0.6)", border: "1px solid rgba(217,105,91,0.4)", opacity: show, transform: `translateX(${(1 - show) * -30}px)` }}>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 40, color: CREAM }}>{r}</span>
            <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 34, fontWeight: 800, color: RED }}>✗ FAILED</span>
          </div>
        );
      })}
      <div style={{ marginTop: 40, fontFamily: TRANSLATION_FONT, fontSize: 44, fontWeight: 800, color: GOLD, opacity: interpolate(f, [50, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>800 years. Every one failed.</div>
    </AbsoluteFill>
  );
};

// Orban's giant bombard + stats.
const Cannon: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const inn = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const stats = ["Over 25 feet long", "60 oxen to move it", "Stone shot over 600 lb"];
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 38, fontWeight: 800, color: CREAM, opacity: inn, marginBottom: 30 }}>Orban's Bombard</div>
      <div style={{ position: "relative", opacity: inn }}>
        <div style={{ width: width * 0.6, height: 70, background: "linear-gradient(#5a5148,#2e2925)", borderRadius: 14 }} />
        <div style={{ position: "absolute", right: -26, top: 6, width: 58, height: 58, borderRadius: "50%", border: "10px solid #5a5148" }} />
        <div style={{ position: "absolute", left: -10, top: 18, width: 26, height: 34, background: "#1b1815", borderRadius: 6 }} />
      </div>
      <div style={{ marginTop: 50 }}>
        {stats.map((s, i) => {
          const show = interpolate(f, [22 + i * 12, 36 + i * 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <div key={i} style={{ fontFamily: TRANSLATION_FONT, fontSize: 40, color: GOLD, textAlign: "center", margin: "12px 0", opacity: show, transform: `translateY(${(1 - show) * 16}px)` }}>{s}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// "Constantinople fell" date stamp.
const FellStamp: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const s = interpolate(f, [4, 18], [1.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(f, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center" }}>
      <div style={{ transform: `scale(${s}) rotate(-5deg)`, opacity: o, border: `6px solid ${RED}`, borderRadius: 18, padding: "44px 60px", textAlign: "center" }}>
        <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 56, fontWeight: 800, letterSpacing: 2, color: RED }}>CONSTANTINOPLE FELL</div>
        <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 70, fontWeight: 800, color: CREAM, marginTop: 14 }}>29 MAY 1453</div>
      </div>
      <div style={{ marginTop: 50, fontFamily: TRANSLATION_FONT, fontSize: 40, color: GOLD, opacity: interpolate(f, [30, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>Exactly as foretold.</div>
    </AbsoluteFill>
  );
};

export const constantinopleScenes: Record<string, React.FC<SceneProps>> = {
  "prophecy-timeline": ProphecyTimeline,
  "golden-horn": GoldenHorn,
  walls: Walls,
  "sieges-failed": SiegesFailed,
  cannon: Cannon,
  "fell-stamp": FellStamp,
};
