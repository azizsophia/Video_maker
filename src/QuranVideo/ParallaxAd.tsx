import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
// Bundled fonts (no gstatic through the proxy).
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";

const PLAYFAIR = '"Playfair Display", Georgia, serif';
const JOST = 'Jost, "Helvetica Neue", Arial, sans-serif';
const AMIRI = 'Amiri, "Times New Roman", serif';

const FOREST = "#2E4A3A";
const FOREST_DEEP = "#233A2D";
const CREAM = "#F6F4EF";
const PAPER = "#F3EFE6";
const GOLD = "#C9A84C";
const INK = "#2b2a26";

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

// A real hardcover book that OPENS to a two-page spread:
//   left page  = a heartfelt line + the dua for parents (printed on the page)
//   right page = the family photo, printed with a page margin + a caption
// Page thickness + a center spine + an outer drop shadow sell the "book", so it
// reads as an opening keepsake, not a framed picture on a wall.
const OpenBook: React.FC<{ photoSrc: string; w: number; cx: number; cy: number; open0: number; open1: number }>
  = ({ photoSrc, w, cx, cy, open0, open1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = w * 1.32;
  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.8 } });
  const open = ease(clamp01(interpolate(frame, [open0, open1], [0, 1])));
  const floatY = Math.sin(frame / fps * 0.7) * 6;
  const rot = -open * 158; // front cover swings open to the left around the spine
  const sweep = clamp01(interpolate(frame, [open1 - 16, open1 + 24], [0, 1]));
  const gutter = "linear-gradient(90deg, rgba(0,0,0,0.22), rgba(0,0,0,0) 12%)";

  const PageEdge = ({ side }: { side: "right" | "bottom" }) => (
    <>{[0, 1, 2, 3, 4, 5].map((i) => (
      <div key={i} style={{
        position: "absolute", inset: 0,
        transform: side === "right" ? `translateX(${(i + 1) * 2.4}px)` : `translateY(${(i + 1) * 2.4}px)`,
        background: i % 2 ? "#efe9da" : "#e4ddca",
        borderRadius: 10, zIndex: -1,
      }} />
    ))}</>
  );

  return (
    <div style={{
      position: "absolute", left: cx - w / 2, top: cy - h / 2 + floatY, width: w, height: h,
      opacity: interpolate(enter, [0, 1], [0, 1]),
      transform: `perspective(2000px) rotateX(5deg) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
      transformStyle: "preserve-3d",
      filter: "drop-shadow(0 44px 70px rgba(0,0,0,0.5))",
    }}>
      {/* page-block thickness behind the right (photo) page */}
      <PageEdge side="right" />
      <PageEdge side="bottom" />

      {/* RIGHT PAGE — the family photo, printed with a margin + caption */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 10, overflow: "hidden", background: `linear-gradient(135deg, ${CREAM}, ${PAPER})`, border: "1px solid rgba(180,160,120,0.35)" }}>
        <div style={{ position: "absolute", top: 20, left: 26, right: 20, bottom: 78, borderRadius: 4, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.22)" }}>
          <Img src={staticFile(photoSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ position: "absolute", left: 26, right: 20, bottom: 28, textAlign: "center", fontFamily: PLAYFAIR, fontStyle: "italic", fontSize: 25, color: INK }}>
          the days we never want to forget
        </div>
        {/* gutter shadow on the inner (left) edge */}
        <div style={{ position: "absolute", inset: 0, background: gutter }} />
      </div>

      {/* SPINE */}
      <div style={{ position: "absolute", left: -3, top: 0, width: 8, height: "100%", background: "linear-gradient(90deg, rgba(0,0,0,0.35), rgba(0,0,0,0.05))", borderRadius: 4 }} />

      {/* TURNING FRONT COVER — front = branded cover, back = the dua page */}
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: "0% 50%", transform: `perspective(2000px) rotateY(${rot}deg)` }}>
        {/* front face: clean branded hardcover */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 10, overflow: "hidden", background: `linear-gradient(160deg, ${FOREST} 0%, ${FOREST_DEEP} 100%)`, border: "1px solid rgba(201,168,76,0.5)", boxShadow: `0 ${24 - open * 8}px 50px rgba(0,0,0,${0.4 - open * 0.2})` }}>
          <div style={{ position: "absolute", inset: 18, border: "1px solid rgba(201,168,76,0.45)", borderRadius: 6 }} />
          <AbsoluteFill style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 36px", textAlign: "center" }}>
            <div style={{ fontFamily: JOST, fontWeight: 500, letterSpacing: 6, fontSize: 18, color: GOLD, marginBottom: 18 }}>KETABI STUDIO</div>
            <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 42, lineHeight: 1.12, color: CREAM }}>Everything<br />I Love About<br />Mama</div>
            <div style={{ marginTop: 18, fontSize: 26, color: GOLD }}>&#10022;</div>
          </AbsoluteFill>
          {/* darkening as it turns edge-on */}
          <AbsoluteFill style={{ background: "#000", opacity: open * 0.4 }} />
        </div>
        {/* back face: the dua / heartfelt left page */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 10, overflow: "hidden", background: `linear-gradient(135deg, ${PAPER}, ${CREAM})`, border: "1px solid rgba(180,160,120,0.35)" }}>
          <AbsoluteFill style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 40px", textAlign: "center" }}>
            <div style={{ fontFamily: PLAYFAIR, fontStyle: "italic", fontSize: 26, color: INK, marginBottom: 28 }}>and we will always pray for you</div>
            <div style={{ fontFamily: AMIRI, fontWeight: 700, fontSize: 40, lineHeight: 1.6, color: INK, direction: "rtl" }}>رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي</div>
            <div style={{ marginTop: 18, fontFamily: JOST, fontStyle: "italic", fontSize: 21, lineHeight: 1.4, color: "rgba(43,42,38,0.8)" }}>My Lord, have mercy on them<br />as they raised me</div>
            <div style={{ marginTop: 14, fontFamily: JOST, fontWeight: 500, letterSpacing: 3, fontSize: 15, color: GOLD }}>QUR'AN 17:24</div>
          </AbsoluteFill>
          {/* gutter shadow on the inner (right) edge */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(270deg, rgba(0,0,0,0.22), rgba(0,0,0,0) 12%)" }} />
          {/* warm light sweep at the moment the page lays open */}
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

      {/* The opening hardcover (centered) */}
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        <OpenBook photoSrc="ad/interior-picnic.jpg" w={452} cx={726} cy={988} open0={46} open1={116} />
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
