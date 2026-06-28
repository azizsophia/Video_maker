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

const GoldDust: React.FC = () => {
  const frame = useCurrentFrame();
  const specks = [[180, 520, 6], [870, 360, 5], [620, 1300, 7], [300, 1440, 4], [930, 980, 6], [120, 1150, 5], [780, 1560, 5], [520, 300, 4]];
  return (<>{specks.map(([x, y, r], i) => {
    const dy = Math.sin(frame / 30 + i) * 16;
    const tw = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(frame / 18 + i * 2));
    return <div key={i} style={{ position: "absolute", left: x, top: y + dy, width: r, height: r, borderRadius: r, background: GOLD, opacity: tw, filter: "blur(1px)", boxShadow: `0 0 ${r * 2}px ${GOLD}` }} />;
  })}</>);
};

// The REAL keepsake book opening: the actual product cover (coverSrc) swings
// open around the spine to reveal the actual interior page (interiorSrc). Square
// format to match the product; page thickness + a center spine + an outer drop
// shadow make it read as a hardcover opening, not a flat picture. No invented
// art — both faces are the real product files.
const OpenBook: React.FC<{ coverSrc: string; interiorSrc: string; w: number; cx: number; cy: number; open0: number; open1: number }>
  = ({ coverSrc, interiorSrc, w, cx, cy, open0, open1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = w; // the product is square
  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.8 } });
  const open = ease(clamp01(interpolate(frame, [open0, open1], [0, 1])));
  const floatY = Math.sin(frame / fps * 0.7) * 6;
  const rot = -open * 156; // front cover swings open to the left around the spine
  const sweep = clamp01(interpolate(frame, [open1 - 16, open1 + 24], [0, 1]));

  // Thin, warm-toned page edges (the fore-edge of the book seen side-on) so the
  // closed cover reads as a thick hardcover, not an awkward white border.
  const PageEdge = ({ side }: { side: "right" | "bottom" }) => (
    <>{[0, 1, 2, 3, 4].map((i) => (
      <div key={i} style={{
        position: "absolute", inset: 0,
        transform: side === "right" ? `translateX(${(i + 1) * 1.5}px)` : `translateY(${(i + 1) * 1.5}px)`,
        background: i % 2 ? "#d8cdb4" : "#c9bfa3",
        borderRadius: 8, zIndex: -1,
      }} />
    ))}</>
  );

  return (
    <div style={{
      position: "absolute", left: cx - w / 2, top: cy - h / 2 + floatY, width: w, height: h,
      opacity: interpolate(enter, [0, 1], [0, 1]),
      transform: `perspective(2200px) rotateX(4deg) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
      transformStyle: "preserve-3d",
      filter: "drop-shadow(0 42px 66px rgba(0,0,0,0.48))",
    }}>
      {/* page-block thickness behind the interior page */}
      <PageEdge side="right" />
      <PageEdge side="bottom" />

      {/* RIGHT PAGE — the real interior page of the keepsake */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(180,160,120,0.35)" }}>
        <Img src={staticFile(interiorSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* gutter shadow on the inner (left) edge */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.22), rgba(0,0,0,0) 12%)" }} />
      </div>

      {/* SPINE */}
      <div style={{ position: "absolute", left: -3, top: 0, width: 8, height: "100%", background: "linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0.05))", borderRadius: 4 }} />

      {/* TURNING FRONT COVER — front = the real product cover, back = inside cover */}
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: "0% 50%", transform: `perspective(2200px) rotateY(${rot}deg)` }}>
        {/* front face: the actual cover file */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(0,0,0,0.2)", boxShadow: `0 ${24 - open * 8}px 50px rgba(0,0,0,${0.42 - open * 0.2})` }}>
          <Img src={staticFile(coverSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <AbsoluteFill style={{ background: "#000", opacity: open * 0.42 }} />
        </div>
        {/* back face: the real dedication page (left page of the open spread) */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 8, overflow: "hidden", border: "1px solid rgba(180,160,120,0.35)" }}>
          <Img src={staticFile("ad/dedication-mama.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {/* gutter shadow on the inner (right) edge */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(270deg, rgba(0,0,0,0.2), rgba(0,0,0,0) 12%)" }} />
          {/* warm light sweep as the cover lays open */}
          <AbsoluteFill style={{ background: `linear-gradient(115deg, transparent ${sweep * 120 - 35}%, rgba(255,245,210,0.5) ${sweep * 120}%, transparent ${sweep * 120 + 20}%)`, opacity: sweep > 0 && sweep < 1 ? 0.9 : 0, mixBlendMode: "screen" }} />
        </div>
      </div>
    </div>
  );
};

export const ParallaxAd: React.FC<{ audioSrc?: string; frames?: number }> = ({ audioSrc, frames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const total = frames ?? durationInFrames;
  const cam = interpolate(ease(interpolate(frame, [0, total], [0, 1])), [0, 1], [1, 1.05]);
  const glowDrift = Math.sin(frame / 40) * 40;
  const headIn = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  const subIn = spring({ frame: frame - 120, fps, config: { damping: 200 } });
  const ctaIn = spring({ frame: frame - 152, fps, config: { damping: 200 } });
  const pulse = 1 + 0.03 * (0.5 + 0.5 * Math.sin(frame / 9));

  return (
    <AbsoluteFill style={{ background: `linear-gradient(165deg, ${FOREST} 0%, ${FOREST_DEEP} 60%, #1c2f24 100%)` }}>
      {audioSrc ? <Sequence from={12}><Audio src={staticFile(audioSrc)} /></Sequence> : null}
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${50 + glowDrift / 10}% 30%, rgba(201,168,76,0.2), transparent 56%)` }} />
      <GoldDust />

      {/* Headline */}
      <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", opacity: interpolate(headIn, [0, 1], [0, 1]), transform: `translateY(${interpolate(headIn, [0, 1], [-26, 0])}px)` }}>
        <div style={{ fontFamily: JOST, fontWeight: 500, letterSpacing: 9, fontSize: 28, color: GOLD, marginBottom: 18 }}>KETABI STUDIO</div>
        <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 74, lineHeight: 1.08, color: CREAM, textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>
          Your photos,<br />a keepsake forever
        </div>
      </div>

      {/* The real keepsake, opening (centered) */}
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        <OpenBook coverSrc="ad/book-mama.png" interiorSrc="ad/photopage-mama.jpg" w={470} cx={726} cy={1000} open0={46} open1={116} />
      </AbsoluteFill>

      {/* Subline */}
      <div style={{ position: "absolute", top: 1408, width: "100%", textAlign: "center", padding: "0 70px", boxSizing: "border-box", opacity: interpolate(subIn, [0, 1], [0, 1]) }}>
        <span style={{ fontFamily: JOST, fontWeight: 500, fontSize: 44, lineHeight: 1.28, color: CREAM, textShadow: "0 3px 18px rgba(0,0,0,0.55)" }}>Hardcover books made<br />from your own photos</span>
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", bottom: 130, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(ctaIn, [0, 1], [0, 1]), transform: `translateY(${interpolate(ctaIn, [0, 1], [30, 0])}px)` }}>
        <div style={{ fontFamily: JOST, fontWeight: 400, fontSize: 30, color: "rgba(246,244,239,0.85)", marginBottom: 22 }}>be the first to make yours</div>
        <div style={{ transform: `scale(${pulse})`, fontFamily: JOST, fontWeight: 500, letterSpacing: 1, fontSize: 42, color: FOREST_DEEP, background: `linear-gradient(180deg, #f0e6c8, ${GOLD})`, padding: "22px 56px", borderRadius: 100, boxShadow: "0 14px 40px rgba(201,168,76,0.35)" }}>
          ketabistudio.com →
        </div>
      </div>
    </AbsoluteFill>
  );
};
