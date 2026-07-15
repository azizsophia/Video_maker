import React from "react";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import { FingerprintScene, isFingerprintScene } from "./Fingerprint";
import { Scene, isSceneName } from "./Scenes";
import { themes } from "./themes";
// Locally-bundled fonts (no gstatic network at render — the headless browser
// can't reach Google Fonts through the proxy CA). @fontsource registers the
// @font-face rules at import.
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/jost/500.css";

const PLAYFAIR = '"Playfair Display", Georgia, serif';
const JOST = 'Jost, "Helvetica Neue", Arial, sans-serif';

const GOLD = "#e7c873";
const CREAM = "#f7f1e2";
const WARM = "#f0a45a"; // kids "shop.ketabi" warm accent

if (typeof document !== "undefined" && "fonts" in document) {
  void Promise.allSettled([
    document.fonts.load("900 100px 'Playfair Display'"),
    document.fonts.load("700 100px 'Playfair Display'"),
    document.fonts.load("500 100px Jost"),
  ]);
}

export type CoverProps = {
  title: string; // use \n to force line breaks
  kicker?: string;
  image?: string; // full-bleed photo; omit when using a code-generated `scene`
  scene?: string; // e.g. an `fp-*` fingerprint scene — the cover matches the video's subject
  wordmark?: string;
  warm?: boolean; // kids "shop.ketabi" channel — warm amber grade instead of green/gold
};

// A single premium, brand-consistent cover (1080x1920). Full-bleed photo with
// the same green/gold grade as the videos, a top wordmark, and a gold-accented
// title in the lower third. Every cover shares this exact treatment so the
// TikTok grid reads as one brand.
export const Cover: React.FC<CoverProps> = ({ title, kicker, image, scene, wordmark = "KETABI STUDIO", warm = false }) => {
  const { width, height } = useVideoConfig();
  const wide = width > height; // 16:9 YouTube thumbnail vs 9:16 feed cover
  const lines = title.split("\n");
  const longLine = lines.some((l) => l.length > 16);
  const accent = warm ? WARM : GOLD;
  // Legibility scrims: green for the Ketabi brand, warm amber for the kids channel.
  const scrim = warm
    ? "linear-gradient(180deg, rgba(30,18,10,0.60) 0%, rgba(30,18,10,0.10) 26%, rgba(24,15,9,0.32) 58%, rgba(16,10,6,0.86) 84%, rgba(12,8,5,0.96) 100%)"
    : "linear-gradient(180deg, rgba(8,22,16,0.62) 0%, rgba(11,20,16,0.10) 26%, rgba(8,16,12,0.30) 58%, rgba(6,13,10,0.86) 84%, rgba(5,11,8,0.96) 100%)";
  const glow = warm
    ? "radial-gradient(circle at 50% 30%, rgba(240,164,90,0.12), transparent 62%)"
    : "radial-gradient(circle at 50% 30%, rgba(231,200,115,0.10), transparent 62%)";
  const accentRGBA = warm ? "rgba(240,164,90,0.85)" : "rgba(231,200,115,0.85)";
  return (
    <AbsoluteFill style={{ background: "#0b1410", width, height }}>
      {/* Backdrop: a code-generated scene (e.g. the fingerprint, so the cover
          matches the video's subject) or a full-bleed photo. */}
      {isFingerprintScene(scene) ? (
        <FingerprintScene name={scene as string} still />
      ) : isSceneName(scene) ? (
        <Scene name={scene} theme={themes.ketabi} />
      ) : image ? (
        <AbsoluteFill style={{ transform: "scale(1.04)" }}>
          <Img src={/^https?:\/\//.test(image) ? image : staticFile(image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      ) : null}

      {/* Brand grade + legibility scrims (green for Ketabi, warm for shop.ketabi) */}
      <AbsoluteFill style={{ background: scrim }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 360px rgba(0,0,0,0.6)" }} />
      <AbsoluteFill style={{ background: glow }} />

      {/* Delicate inset accent frame */}
      <AbsoluteFill style={{ inset: 34, border: `1.5px solid ${warm ? "rgba(240,164,90,0.45)" : "rgba(231,200,115,0.45)"}`, borderRadius: 10 }} />

      {/* Top wordmark */}
      <div style={{ position: "absolute", top: wide ? 56 : 92, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
        <div style={{ height: 1.5, width: 64, background: `linear-gradient(90deg,transparent,${accentRGBA})` }} />
        <span style={{ fontFamily: JOST, fontWeight: 500, letterSpacing: 9, fontSize: 30, color: accent }}>{wordmark}</span>
        <div style={{ height: 1.5, width: 64, background: `linear-gradient(90deg,${accentRGBA},transparent)` }} />
      </div>

      {/* Title block — kept in the vertical center band so it survives TikTok's
          profile-grid center crop (which clips ~270px top & bottom). */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: wide ? 110 : 470, padding: wide ? "0 150px" : "0 110px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        {kicker ? (
          <span style={{ fontFamily: JOST, fontWeight: 500, letterSpacing: 8, fontSize: 32, color: accent, marginBottom: 28, textShadow: "0 2px 16px rgba(0,0,0,0.8)" }}>
            {kicker}
          </span>
        ) : null}
        <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: wide ? (longLine ? 86 : 104) : (longLine ? 92 : 112), lineHeight: 1.06, color: CREAM, textShadow: "0 6px 34px rgba(0,0,0,0.92)", maxWidth: wide ? 1400 : 880 }}>
          {lines.map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
        {/* accent flourish */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 34 }}>
          <div style={{ height: 1.5, width: 90, background: `linear-gradient(90deg,transparent,${accent})` }} />
          <div style={{ width: 11, height: 11, transform: "rotate(45deg)", background: accent }} />
          <div style={{ height: 1.5, width: 90, background: `linear-gradient(90deg,${accent},transparent)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
