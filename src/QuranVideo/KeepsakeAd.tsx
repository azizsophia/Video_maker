import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
// Bundled fonts (no gstatic through the proxy).
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";

const PLAYFAIR = '"Playfair Display", Georgia, serif';
const JOST = 'Jost, "Helvetica Neue", Arial, sans-serif';

const FOREST = "#2E4A3A";
const FOREST_DEEP = "#233A2D";
const CREAM = "#F6F4EF";
const GOLD = "#C9A84C";

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// Opacity for a scene that lives in [start,end], fading in/out over `fade` frames.
const sceneOpacity = (frame: number, start: number, end: number, fade = 14) =>
  Math.min(clamp01((frame - start) / fade), clamp01((end - frame) / fade));

// A framed product card (rounded, cream edge, soft shadow) with a slow Ken Burns.
const Card: React.FC<{
  src: string; w: number; h: number; cx: number; cy: number;
  appear: number; kb: number; rot?: number; z?: number;
}> = ({ src, w, h, cx, cy, appear, kb, rot = 0, z = 1 }) => {
  const floatY = Math.sin(kb * Math.PI) * -6;
  const scale = interpolate(appear, [0, 1], [0.94, 1]) * (1 + 0.05 * kb);
  return (
    <div style={{
      position: "absolute", left: cx - w / 2, top: cy - h / 2 + floatY, width: w, height: h,
      transform: `perspective(1600px) rotate(${rot}deg) scale(${scale})`,
      borderRadius: 26, overflow: "hidden", zIndex: z,
      boxShadow: "0 34px 80px rgba(0,0,0,0.42)",
      border: "6px solid rgba(246,244,239,0.95)",
    }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.18)" }} />
    </div>
  );
};

const Eyebrow: React.FC<{ children: React.ReactNode; top: number; op: number }> = ({ children, top, op }) => (
  <div style={{ position: "absolute", top, width: "100%", textAlign: "center", opacity: op }}>
    <span style={{ fontFamily: JOST, fontWeight: 500, letterSpacing: 9, fontSize: 28, color: GOLD }}>{children}</span>
  </div>
);

const Headline: React.FC<{ children: React.ReactNode; top: number; op: number; size?: number }> = ({ children, top, op, size = 62 }) => (
  <div style={{ position: "absolute", top, width: "100%", textAlign: "center", padding: "0 80px", boxSizing: "border-box", opacity: op }}>
    <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: size, lineHeight: 1.1, color: CREAM, textShadow: "0 4px 24px rgba(0,0,0,0.45)" }}>{children}</div>
  </div>
);

export const KeepsakeAd: React.FC<{ audioSrc?: string; frames?: number }> = ({ audioSrc, frames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const total = frames ?? durationInFrames;

  // Scene windows (8s @ 30fps = 240f).
  const s1 = sceneOpacity(frame, 0, 86);     // the keepsake (cover)
  const s2 = sceneOpacity(frame, 84, 158);   // inside (interior page)
  const s3 = sceneOpacity(frame, 156, 214);  // the range (two books)
  const s4Spring = spring({ frame: frame - 198, fps, config: { damping: 200 } }); // CTA

  // Per-scene Ken Burns progress (0..1 within the scene).
  const kb1 = clamp01(frame / 86);
  const kb2 = clamp01((frame - 84) / 74);
  const kb3 = clamp01((frame - 156) / 58);

  const ctaPulse = 1 + 0.03 * (0.5 + 0.5 * Math.sin(frame / 9));

  return (
    <AbsoluteFill style={{ background: `linear-gradient(168deg, ${FOREST} 0%, ${FOREST_DEEP} 58%, #1b2c22 100%)` }}>
      {audioSrc ? <Sequence from={12}><Audio src={staticFile(audioSrc)} /></Sequence> : null}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 34%, rgba(201,168,76,0.16), transparent 58%)` }} />
      {/* hairline gold frame for an editorial feel */}
      <AbsoluteFill style={{ margin: 28, border: "1px solid rgba(201,168,76,0.28)", borderRadius: 8, pointerEvents: "none" }} />

      {/* SCENE 1 — the keepsake (cover) */}
      {s1 > 0 ? (
        <AbsoluteFill style={{ opacity: s1 }}>
          <Eyebrow top={232} op={1}>KETABI STUDIO</Eyebrow>
          <Headline top={300} op={1}>Made to be kept,<br />not scrolled past.</Headline>
          <Card src="ad/book-mama.png" w={600} h={600} cx={540} cy={1170} appear={s1} kb={kb1} />
        </AbsoluteFill>
      ) : null}

      {/* SCENE 2 — what's inside (interior page) */}
      {s2 > 0 ? (
        <AbsoluteFill style={{ opacity: s2 }}>
          <Headline top={272} op={1} size={58}>Your photos. Your words.<br />A dua to close.</Headline>
          <Card src="ad/spread-mama-sq.png" w={620} h={620} cx={540} cy={1180} appear={s2} kb={kb2} />
        </AbsoluteFill>
      ) : null}

      {/* SCENE 3 — the range (two books) */}
      {s3 > 0 ? (
        <AbsoluteFill style={{ opacity: s3 }}>
          <Headline top={262} op={1}>A keepsake for<br />everyone you love.</Headline>
          <Card src="ad/book-baba.png" w={470} h={470} cx={400} cy={1130} appear={s3} kb={kb3} rot={-5} z={1} />
          <Card src="ad/book-mama.png" w={470} h={470} cx={690} cy={1230} appear={s3} kb={kb3} rot={5} z={2} />
          <div style={{ position: "absolute", top: 1560, width: "100%", textAlign: "center", opacity: s3 }}>
            <span style={{ fontFamily: JOST, fontWeight: 400, fontSize: 34, letterSpacing: 2, color: "rgba(246,244,239,0.85)" }}>mama · baba · grandparents · baby</span>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* SCENE 4 — CTA (website-first) */}
      {frame >= 198 ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: interpolate(s4Spring, [0, 1], [0, 1]) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40, transform: `translateY(${interpolate(s4Spring, [0, 1], [20, 0])}px)` }}>
            <Img src={staticFile("brand/ketabi-icon-green.png")} style={{ width: 76, height: 76, objectFit: "contain" }} />
            <div style={{ fontFamily: PLAYFAIR, fontWeight: 700, fontSize: 44, color: CREAM }}>Ketabi Studio</div>
          </div>
          <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 66, color: CREAM, textAlign: "center", lineHeight: 1.1 }}>Join the founding list</div>
          <div style={{ marginTop: 18, fontFamily: JOST, fontWeight: 400, fontSize: 34, color: "rgba(246,244,239,0.82)" }}>early access before the shop opens</div>
          <div style={{ marginTop: 40, transform: `scale(${ctaPulse})`, fontFamily: JOST, fontWeight: 500, letterSpacing: 1, fontSize: 44, color: FOREST_DEEP, background: `linear-gradient(180deg, #f0e6c8, ${GOLD})`, padding: "22px 56px", borderRadius: 100, boxShadow: "0 14px 40px rgba(201,168,76,0.35)" }}>
            ketabistudio.com →
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
