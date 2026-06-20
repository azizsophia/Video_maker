import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT, ARABIC_DISPLAY_FONT } from "./fonts";

// Bespoke motion-graphics "explainer" scenes for the ring-composition video.
// Each renders its own text, so the narration captions are suppressed on these.

type SceneProps = { theme: ThemePalette };
const CREAM = "#f3ecda";
const GOLD = "#e7c163";
const GREEN = "#4f9a7a";
const BG = "radial-gradient(ellipse at 50% 42%, #15271f 0%, #0c1a13 55%, #08120d 100%)";
const cardStyle: React.CSSProperties = {
  background: "rgba(18,38,30,0.78)",
  border: `1px solid rgba(79,154,122,0.45)`,
  borderRadius: 26,
  padding: "34px 42px",
  textAlign: "center",
};

// Critic quote, then struck through with "He was wrong."
const Carlyle: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const inn = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const strike = interpolate(f, [42, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wrong = interpolate(f, [62, 78], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", padding: "0 86px" }}>
      <div style={{ ...cardStyle, maxWidth: 860, opacity: inn, transform: `translateY(${(1 - inn) * 30}px)`, position: "relative" }}>
        <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 130, color: GOLD, lineHeight: 0.5, height: 56 }}>“</div>
        <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 56, fontWeight: 700, color: CREAM, lineHeight: 1.3 }}>
          A wearisome, confused jumble… crude, incondite.
        </div>
        <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 30, color: GREEN, marginTop: 26 }}>— Thomas Carlyle, 1841</div>
        <div style={{ position: "absolute", left: 36, right: 36, top: "52%", height: 7, background: "#e0564b", transformOrigin: "left", transform: `scaleX(${strike})`, borderRadius: 4 }} />
      </div>
      <div style={{ marginTop: 44, fontFamily: TRANSLATION_FONT, fontSize: 50, fontWeight: 800, letterSpacing: 2, color: "#e0564b", opacity: wrong }}>HE WAS WRONG.</div>
    </AbsoluteFill>
  );
};

// The real connected verses: the root آمن ("believe") opens (2:3) and closes
// (2:285) the chapter. The shared word is highlighted in both, and linked.
const BaqarahMirror: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const b = interpolate(f, [26, 42], [0, 1], { extrapolateRight: "clamp" });
  const link = interpolate(f, [48, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const g: React.CSSProperties = { color: GOLD };
  const label: React.CSSProperties = { fontFamily: TRANSLATION_FONT, fontSize: 26, letterSpacing: 3, color: GOLD };
  const ar: React.CSSProperties = { fontFamily: ARABIC_DISPLAY_FONT, fontSize: 50, color: CREAM, marginTop: 12, lineHeight: 1.75 };
  const tr: React.CSSProperties = { fontFamily: TRANSLATION_FONT, fontSize: 34, color: CREAM, marginTop: 12, opacity: 0.92 };
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", padding: "0 60px" }}>
      <div style={{ ...cardStyle, width: 860, opacity: a, transform: `translateY(${(1 - a) * -26}px)` }}>
        <div style={label}>THE OPENING · 2:3</div>
        <div dir="rtl" style={ar}>
          الَّذِينَ <span style={g}>يُؤْمِنُونَ</span> بِالْغَيْبِ
        </div>
        <div style={tr}>
          Those who <span style={g}>believe</span> in the unseen…
        </div>
      </div>
      <div style={{ height: 132, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: link }}>
        <div style={{ width: 3, height: 34, background: GOLD }} />
        <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 25, letterSpacing: 1, color: GOLD, margin: "8px 0", border: `1px solid ${GOLD}`, borderRadius: 22, padding: "7px 18px" }}>
          same root: آمن · believe
        </div>
        <div style={{ width: 3, height: 34, background: GOLD }} />
      </div>
      <div style={{ ...cardStyle, width: 860, opacity: b, transform: `translateY(${(1 - b) * 26}px)` }}>
        <div style={label}>THE ENDING · 2:285</div>
        <div dir="rtl" style={{ ...ar, fontSize: 42 }}>
          <span style={g}>آمَنَ</span> الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ <span style={g}>وَالْمُؤْمِنُونَ</span>
        </div>
        <div style={tr}>
          The Messenger <span style={g}>believed</span> in what was revealed to him from his Lord, and so did the <span style={g}>believers</span>.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Labeled concentric ring folding to the qibla center.
const BaqarahRing: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height * 0.42;
  const labels = ["Faith", "Law", "Story", "Covenant"];
  const rings = 5;
  return (
    <AbsoluteFill style={{ background: BG }}>
      {new Array(rings).fill(0).map((_, i) => {
        const appear = interpolate(f, [i * 10, i * 10 + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const size = (rings - i) / rings;
        const w = width * 0.84 * size;
        const h = height * 0.6 * size;
        const center = i === rings - 1;
        return (
          <div key={i} style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: Math.max(16, 30 * size), border: `${center ? 3 : 2}px solid ${center ? GOLD : GREEN}`, opacity: appear * (center ? 1 : 0.65), background: center ? "rgba(231,193,99,0.12)" : "transparent", boxShadow: center ? "0 0 50px rgba(231,193,99,0.5)" : "none", display: "flex", justifyContent: "center" }}>
            {!center ? (
              <div style={{ marginTop: -17, background: "#0c1a13", padding: "2px 16px", fontFamily: TRANSLATION_FONT, fontSize: 24, color: GREEN, opacity: appear }}>{labels[i]}</div>
            ) : null}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: cy - 40, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 32, fontWeight: 800, lineHeight: 1.25, color: GOLD, opacity: interpolate(f, [rings * 10, rings * 10 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 0 24px rgba(231,193,99,0.6)" }}>
        Face the Ka'ba
        <div style={{ fontSize: 24, color: CREAM, fontWeight: 600 }}>2:144</div>
      </div>
    </AbsoluteFill>
  );
};

// 23-year revelation timeline with fragments landing at scattered points.
const RevelationTimeline: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [6, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dots = 11;
  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center" }}>
      <div style={{ textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 44, fontWeight: 800, color: CREAM, marginBottom: 56, opacity: interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" }) }}>
        23 years. In fragments.
      </div>
      <div style={{ position: "relative", margin: "0 86px", height: 8 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: `${draw * 100}%`, background: GREEN, borderRadius: 4 }} />
        {new Array(dots).fill(0).map((_, i) => {
          const p = (i + 0.5) / dots;
          return <div key={i} style={{ position: "absolute", left: `${p * 100}%`, top: -11, width: 14, height: 30, marginLeft: -7, background: GOLD, borderRadius: 3, opacity: draw > p ? 1 : 0, boxShadow: `0 0 12px ${GOLD}` }} />;
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "26px 86px 0", fontFamily: TRANSLATION_FONT, fontSize: 26, color: GREEN, opacity: draw }}>
        <span>610 CE</span>
        <span>632 CE</span>
      </div>
    </AbsoluteFill>
  );
};

export const explainerScenes: Record<string, React.FC<SceneProps>> = {
  carlyle: Carlyle,
  "baqarah-mirror": BaqarahMirror,
  "baqarah-ring": BaqarahRing,
  "revelation-timeline": RevelationTimeline,
};

export const FULL_VISUAL_SCENES = ["app-showcase", "carlyle", "baqarah-mirror", "baqarah-ring", "revelation-timeline", "ringdiagram", "manuscript", "match-compare", "carbon-timeline", "confidence-meter", "preservation-timeline", "prophecy-timeline", "golden-horn", "walls", "sieges-failed", "cannon", "fell-stamp", "march-map", "kaaba-protected", "stones-from-sky", "isnad-chain", "rijal-card", "bukhari-funnel", "grading-scale"];
