import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT, ARABIC_DISPLAY_FONT } from "./fonts";

// Reusable end-card CTAs. Data-driven so the copy + products are a one-line change.
type Product = { type?: "book" | "print"; src?: string; title?: string };
type SceneProps = { theme: ThemePalette; data?: any };
const CREAM = "#f3ecda";
const GOLD = "#e7c163";
const GREEN = "#4f9a7a";
const BG = "radial-gradient(ellipse at 50% 38%, #15271f 0%, #0c1a13 55%, #08120d 100%)";

const resolveImg = (src: string) => (/^https?:\/\//.test(src) ? src : staticFile(src));

// A standing book mockup (or the real cover image if `src` is supplied).
const Book: React.FC<{ p: Product; w: number; tilt: number }> = ({ p, w, tilt }) => {
  const h = w * 1.45;
  return (
    <div style={{ width: w, height: h, transform: `rotate(${tilt}deg)`, position: "relative", filter: "drop-shadow(0 22px 30px rgba(0,0,0,0.55))" }}>
      {/* page edge */}
      <div style={{ position: "absolute", right: -6, top: 6, width: 12, height: h - 12, borderRadius: 3, background: "linear-gradient(90deg,#cbb98f,#efe6cf)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: 8, overflow: "hidden", border: `1px solid rgba(231,193,99,0.5)` }}>
        {p.src ? (
          <Img src={resolveImg(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: "linear-gradient(160deg,#1f4a3a,#0c1f17)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 14 }}>
            <div style={{ width: "70%", height: 3, background: GOLD, opacity: 0.7, marginBottom: 14 }} />
            <div style={{ fontFamily: ARABIC_DISPLAY_FONT, fontSize: w * 0.34, color: GOLD }}>كتابي</div>
            <div style={{ fontFamily: TRANSLATION_FONT, fontSize: w * 0.13, letterSpacing: 2, color: CREAM, marginTop: 10 }}>{p.title || "KETABI"}</div>
            <div style={{ width: "70%", height: 3, background: GOLD, opacity: 0.7, marginTop: 14 }} />
          </div>
        )}
      </div>
      {/* spine shadow */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 10, height: "100%", background: "linear-gradient(90deg,rgba(0,0,0,0.45),transparent)", borderRadius: "8px 0 0 8px" }} />
    </div>
  );
};

// A framed art print mockup (or the real artwork if `src` is supplied).
const Frame: React.FC<{ p: Product; w: number; tilt: number }> = ({ p, w, tilt }) => {
  const h = w * 1.3;
  return (
    <div style={{ width: w, height: h, transform: `rotate(${tilt}deg)`, padding: 12, borderRadius: 6, background: "linear-gradient(150deg,#e7c163,#9c7a2f)", filter: "drop-shadow(0 22px 30px rgba(0,0,0,0.55))" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 2, overflow: "hidden", background: "#0e1b14", display: "flex", justifyContent: "center", alignItems: "center" }}>
        {p.src ? (
          <Img src={resolveImg(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 100 130">
            <g stroke={GOLD} strokeWidth="1.2" fill="none" opacity="0.85">
              <circle cx="50" cy="65" r="30" />
              <circle cx="50" cy="65" r="20" />
              {new Array(8).fill(0).map((_, i) => {
                const a = (i / 8) * Math.PI * 2;
                return <path key={i} d={`M50 65 q ${Math.cos(a) * 18} ${Math.sin(a) * 18 - 8} ${Math.cos(a) * 30} ${Math.sin(a) * 30}`} />;
              })}
            </g>
          </svg>
        )}
      </div>
    </div>
  );
};

// Shop waitlist ad: premium, calm, aniconic. Shows books + art prints.
const ShopWaitlist: React.FC<SceneProps> = ({ data }) => {
  const f = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const d = data || {};
  const kicker = d.kicker || "COMING SOON";
  const headline = d.headline || "The Ketabi Shop";
  const sub = d.sub || "Beautiful Islamic books and art prints.";
  const cta = d.cta || "Join the waitlist";
  const url = d.url || "ketabistudio.com";
  const products: Product[] = d.products || [{ type: "book" }, { type: "print" }, { type: "book" }];

  const head = interpolate(f, [10, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subA = interpolate(f, [22, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btn = spring({ frame: f - 40, fps, config: { damping: 200 } });
  const pulse = 1 + 0.03 * Math.sin(f / 6);
  const glow = 0.5 + 0.5 * Math.abs(Math.sin(f / 22));
  const tilts = [-7, 0, 7];

  return (
    <AbsoluteFill style={{ background: BG, justifyContent: "center", alignItems: "center", padding: "0 70px" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 38%, rgba(231,193,99,${0.12 * glow}), transparent 55%)` }} />

      <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 26, letterSpacing: 6, color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 30, padding: "9px 24px", marginBottom: 30, opacity: interpolate(f, [0, 14], [0, 1], { extrapolateRight: "clamp" }) }}>
        {kicker}
      </div>

      {/* product display */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 22, height: width * 0.5, marginBottom: 14 }}>
        {products.slice(0, 3).map((p, i) => {
          const show = spring({ frame: f - (8 + i * 7), fps, config: { damping: 180 } });
          const w = width * 0.24;
          return (
            <div key={i} style={{ opacity: show, transform: `translateY(${(1 - show) * 40}px)` }}>
              {p.type === "print" ? <Frame p={p} w={w} tilt={tilts[i] ?? 0} /> : <Book p={p} w={w} tilt={tilts[i] ?? 0} />}
            </div>
          );
        })}
      </div>

      <div style={{ opacity: head, transform: `translateY(${(1 - head) * 22}px)`, fontFamily: TRANSLATION_FONT, fontSize: 76, fontWeight: 800, color: CREAM, textAlign: "center", lineHeight: 1.1, marginTop: 18, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
        {headline}
      </div>
      <div style={{ opacity: subA, transform: `translateY(${(1 - subA) * 18}px)`, fontFamily: TRANSLATION_FONT, fontSize: 38, color: GREEN, textAlign: "center", marginTop: 18, maxWidth: width * 0.82 }}>
        {sub}
      </div>

      <div style={{ opacity: btn, transform: `scale(${(0.9 + btn * 0.1) * pulse})`, marginTop: 40, fontFamily: TRANSLATION_FONT, fontSize: 44, fontWeight: 800, color: "#0c1a13", background: GOLD, borderRadius: 18, padding: "20px 50px", boxShadow: `0 0 ${40 * glow}px rgba(231,193,99,0.6)` }}>
        {cta}
      </div>
      <div style={{ opacity: btn, fontFamily: TRANSLATION_FONT, fontSize: 34, letterSpacing: 2, color: CREAM, marginTop: 28 }}>
        {url}
      </div>
    </AbsoluteFill>
  );
};

export const ctaScenes: Record<string, React.FC<SceneProps>> = {
  "shop-waitlist": ShopWaitlist,
};
