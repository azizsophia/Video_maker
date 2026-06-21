import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT, ARABIC_DISPLAY_FONT } from "./fonts";

// Reusable end-card CTA: the Ketabi Studio shop / founding-list ad.
// Brand-faithful (parchment, forest green, gold) and aniconic: shows the
// calligraphy greeting cards, never the illustrated (faced) storybook covers.
type Card = { ar?: string; en?: string; color?: string; src?: string };
type SceneProps = { theme: ThemePalette; data?: any };

const PARCH = "radial-gradient(ellipse at 50% 28%, #f7f0e2 0%, #ece1cb 60%, #ddd0b4 100%)";
const INK = "#2c3a30";
const GREEN = "#33503b";
const GOLD = "#b8893a";
const CREAM = "#f6efe1";

const resolveImg = (src: string) => (/^https?:\/\//.test(src) ? src : staticFile(src));

const GiftCard: React.FC<{ c: Card; w: number; tilt: number }> = ({ c, w, tilt }) => {
  const h = w * 1.38;
  return (
    <div style={{ width: w, height: h, transform: `rotate(${tilt}deg)`, borderRadius: 12, overflow: "hidden", background: c.color || "#3a5a44", boxShadow: "0 18px 30px rgba(60,45,20,0.28)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 14 }}>
      {c.src ? (
        <Img src={resolveImg(c.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <>
          <div style={{ width: 34, height: 2, background: "rgba(246,239,225,0.6)", marginBottom: 16 }} />
          <div style={{ fontFamily: ARABIC_DISPLAY_FONT, fontSize: w * 0.34, color: CREAM, lineHeight: 1.2, textAlign: "center" }}>{c.ar}</div>
          <div style={{ fontFamily: TRANSLATION_FONT, fontStyle: "italic", fontSize: w * 0.12, color: "rgba(246,239,225,0.9)", marginTop: 14, textAlign: "center" }}>{c.en}</div>
          <div style={{ width: 34, height: 2, background: "rgba(246,239,225,0.6)", marginTop: 16 }} />
        </>
      )}
    </div>
  );
};

const ShopWaitlist: React.FC<SceneProps> = ({ data }) => {
  const f = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const d = data || {};
  const headline = d.headline || "Something beautiful is coming";
  const sub = d.sub || "Personalized storybooks, photo keepsakes, and cards sealed with a dua.";
  const cta = d.cta || "Join the founding list";
  const url = d.url || "ketabistudio.com";
  const products: Card[] = d.products || [
    { ar: "عيد مبارك", en: "Blessed Eid", color: "#3a5a44" },
    { ar: "سكينة", en: "You are my sakinah", color: "#b46b6b" },
    { ar: "مبارك", en: "Congratulations", color: "#6f93b0" },
  ];
  const ph = width * 0.2; // product height

  const logo = spring({ frame: f - 2, fps, config: { damping: 200 } });
  const head = interpolate(f, [14, 32], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subA = interpolate(f, [26, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btn = spring({ frame: f - 52, fps, config: { damping: 200 } });
  const pulse = 1 + 0.025 * Math.sin(f / 6);
  const tilts = [-6, 0, 6];

  return (
    <AbsoluteFill style={{ background: PARCH, justifyContent: "center", alignItems: "center", padding: "0 70px" }}>
      {/* brand lockup */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: logo, transform: `translateY(${(1 - logo) * -16}px)`, marginBottom: 30 }}>
        <div style={{ width: 84, height: 84, borderRadius: 20, background: GREEN, display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0 8px 20px rgba(40,60,45,0.3)" }}>
          <span style={{ fontFamily: ARABIC_DISPLAY_FONT, fontSize: 56, color: CREAM, marginTop: -6 }}>ك</span>
        </div>
        <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 46, fontWeight: 700, letterSpacing: 1, color: INK }}>Ketabi <span style={{ color: GREEN }}>Studio</span></span>
      </div>

      <div style={{ opacity: head, transform: `translateY(${(1 - head) * 22}px)`, fontFamily: TRANSLATION_FONT, fontSize: 74, fontWeight: 700, color: INK, textAlign: "center", lineHeight: 1.15, maxWidth: width * 0.86 }}>
        {headline}<span style={{ color: GOLD }}>.</span>
      </div>

      <div style={{ opacity: subA, transform: `translateY(${(1 - subA) * 18}px)`, fontFamily: TRANSLATION_FONT, fontStyle: "italic", fontSize: 36, color: "#6a6a52", textAlign: "center", marginTop: 20, maxWidth: width * 0.84 }}>
        {sub}
      </div>

      {/* product display: real cover images if provided, else card mockups */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 18, marginTop: 40, height: ph * 1.4 }}>
        {products.slice(0, 3).map((c, i) => {
          const show = spring({ frame: f - (20 + i * 8), fps, config: { damping: 180 } });
          return (
            <div key={i} style={{ opacity: show, transform: `translateY(${(1 - show) * 36}px) rotate(${tilts[i] ?? 0}deg)` }}>
              {c.src ? (
                <Img src={resolveImg(c.src)} style={{ height: ph, width: "auto", borderRadius: 14, boxShadow: "0 18px 30px rgba(60,45,20,0.32)", border: "3px solid #fff" }} />
              ) : (
                <GiftCard c={c} w={width * 0.22} tilt={0} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ opacity: btn, transform: `scale(${(0.92 + btn * 0.08) * pulse})`, marginTop: 46, fontFamily: TRANSLATION_FONT, fontSize: 42, fontWeight: 700, color: CREAM, background: GREEN, borderRadius: 16, padding: "20px 46px", boxShadow: "0 10px 26px rgba(40,60,45,0.32)" }}>
        {cta}
      </div>
      <div style={{ opacity: btn, fontFamily: TRANSLATION_FONT, fontSize: 32, letterSpacing: 1.5, color: GOLD, marginTop: 24 }}>
        {url}
      </div>
    </AbsoluteFill>
  );
};

export const ctaScenes: Record<string, React.FC<SceneProps>> = {
  "shop-waitlist": ShopWaitlist,
};
