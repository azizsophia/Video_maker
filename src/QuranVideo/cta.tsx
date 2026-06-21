import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT } from "./fonts";

// Reusable end-card CTAs. Data-driven so the copy is a one-line change.
type SceneProps = { theme: ThemePalette; data?: any };
const CREAM = "#f3ecda";
const GOLD = "#e7c163";
const GREEN = "#4f9a7a";
const BG = "radial-gradient(ellipse at 50% 40%, #15271f 0%, #0c1a13 55%, #08120d 100%)";

// Shop waitlist ad: premium, calm, aniconic. Drives sign-ups at the website.
const ShopWaitlist: React.FC<SceneProps> = ({ data }) => {
  const f = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const d = data || {};
  const kicker = d.kicker || "COMING SOON";
  const headline = d.headline || "The Ketabi Shop";
  const sub = d.sub || "Something calm and beautiful for your faith.";
  const cta = d.cta || "Join the waitlist";
  const url = d.url || "ketabistudio.com";

  const badge = spring({ frame: f - 4, fps, config: { damping: 200 } });
  const head = interpolate(f, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subA = interpolate(f, [22, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btn = spring({ frame: f - 38, fps, config: { damping: 200 } });
  const pulse = 1 + 0.03 * Math.sin(f / 6);
  const glow = 0.5 + 0.5 * Math.abs(Math.sin(f / 22));

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
      {/* soft product glow */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 42%, rgba(231,193,99,${0.12 * glow}), transparent 55%)` }} />

      <div style={{ opacity: badge, transform: `translateY(${(1 - badge) * 20}px)`, fontFamily: TRANSLATION_FONT, fontSize: 28, letterSpacing: 6, color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 30, padding: "10px 26px", marginBottom: 34 }}>
        {kicker}
      </div>

      <div style={{ opacity: head, transform: `translateY(${(1 - head) * 26}px)`, fontFamily: TRANSLATION_FONT, fontSize: 84, fontWeight: 800, color: CREAM, textAlign: "center", lineHeight: 1.1, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
        {headline}
      </div>

      <div style={{ opacity: subA, transform: `translateY(${(1 - subA) * 20}px)`, fontFamily: TRANSLATION_FONT, fontSize: 40, color: GREEN, textAlign: "center", marginTop: 22, maxWidth: width * 0.8 }}>
        {sub}
      </div>

      <div style={{ opacity: btn, transform: `scale(${(0.9 + btn * 0.1) * pulse})`, marginTop: 52, fontFamily: TRANSLATION_FONT, fontSize: 46, fontWeight: 800, color: "#0c1a13", background: GOLD, borderRadius: 18, padding: "22px 54px", boxShadow: `0 0 ${40 * glow}px rgba(231,193,99,0.6)` }}>
        {cta}
      </div>

      <div style={{ opacity: btn, fontFamily: TRANSLATION_FONT, fontSize: 36, letterSpacing: 2, color: CREAM, marginTop: 34 }}>
        {url}
      </div>
    </AbsoluteFill>
  );
};

export const ctaScenes: Record<string, React.FC<SceneProps>> = {
  "shop-waitlist": ShopWaitlist,
};
