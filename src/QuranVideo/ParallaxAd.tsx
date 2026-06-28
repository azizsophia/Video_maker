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

// A simple floating product tile (used for the second book in the back).
const Tile: React.FC<{ src: string; w: number; cx: number; cy: number; depth: number; baseRot: number; delay: number; total: number }>
  = ({ src, w, cx, cy, depth, baseRot, delay, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = ease(interpolate(frame, [0, total], [0, 1], { extrapolateRight: "clamp" }));
  const panX = interpolate(p, [0, 1], [34, -34]) * depth;
  const floatY = Math.sin((frame / fps) * 0.8 + delay) * 9 * depth;
  const rotY = baseRot + Math.sin((frame / fps) * 0.5 + delay) * 2;
  const enter = spring({ frame: frame - delay * 8, fps, config: { damping: 200, mass: 0.7 } });
  const h = w * 1.18;
  return (
    <div style={{
      position: "absolute", left: cx - w / 2 + panX, top: cy - h / 2 + floatY, width: w, height: h,
      opacity: interpolate(enter, [0, 1], [0, 1]),
      transform: `perspective(1600px) rotateY(${rotY}deg) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
      borderRadius: 22, overflow: "hidden",
      boxShadow: `0 ${28 * depth + 12}px ${56 * depth + 26}px rgba(0,0,0,${0.3 * depth + 0.16})`,
      border: "1px solid rgba(231,200,115,0.25)",
    }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.05)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 50px rgba(0,0,0,0.22)" }} />
    </div>
  );
};

// The hero: a hardcover book that opens on its spine to reveal an inner photo
// page. The cover (front) rotates around its left edge; the interior spread is
// revealed underneath, with a gold light sweep at the moment it opens.
const OpeningBook: React.FC<{ coverSrc: string; spreadSrc: string; w: number; cx: number; cy: number; open0: number; open1: number }>
  = ({ coverSrc, spreadSrc, w, cx, cy, open0, open1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h = w * 1.18;
  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.8 } });
  const open = ease(interpolate(frame, [open0, open1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const rot = -open * 156; // cover swings open to the left
  const floatY = Math.sin((frame / fps) * 0.6) * 7;
  const sweep = interpolate(frame, [open1 - 18, open1 + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      position: "absolute", left: cx - w / 2, top: cy - h / 2 + floatY, width: w, height: h,
      opacity: interpolate(enter, [0, 1], [0, 1]),
      transform: `scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
    }}>
      {/* Interior page (revealed) */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, overflow: "hidden", boxShadow: "0 36px 70px rgba(0,0,0,0.4)", border: "1px solid rgba(231,200,115,0.25)" }}>
        <Img src={staticFile(spreadSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {/* spine shadow near the hinge, fades as it opens */}
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.5), transparent 28%)", opacity: 1 - open }} />
        {/* gold light sweep on reveal */}
        <AbsoluteFill style={{ background: `linear-gradient(115deg, transparent ${sweep * 100 - 30}%, rgba(255,245,210,0.55) ${sweep * 100}%, transparent ${sweep * 100 + 22}%)`, opacity: sweep < 1 ? 0.8 : 0, mixBlendMode: "screen" }} />
      </div>
      {/* Turning cover, hinged on the left edge */}
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: "0% 50%", transform: `perspective(1700px) rotateY(${rot}deg)` }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 18, overflow: "hidden", boxShadow: `0 ${30 - open * 10}px ${60}px rgba(0,0,0,${0.45 - open * 0.2})`, border: "1px solid rgba(231,200,115,0.35)" }}>
          <Img src={staticFile(coverSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {/* shading as the cover turns toward edge-on */}
          <AbsoluteFill style={{ background: "#000", opacity: open * 0.45 }} />
        </div>
        {/* inside-front-cover (back face): cream paper */}
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: 18, background: `linear-gradient(135deg, ${CREAM}, #ece5d6)`, border: "1px solid rgba(231,200,115,0.4)", boxShadow: "inset 0 0 60px rgba(168,116,38,0.12)" }} />
      </div>
    </div>
  );
};

const GoldDust: React.FC = () => {
  const frame = useCurrentFrame();
  const specks = [[180, 520, 6], [870, 360, 5], [620, 1300, 7], [300, 1440, 4], [930, 980, 6], [120, 1150, 5], [780, 1560, 5], [520, 300, 4]];
  return (<>{specks.map(([x, y, r], i) => {
    const dy = Math.sin(frame / 30 + i) * 16;
    const tw = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(frame / 18 + i * 2));
    return <div key={i} style={{ position: "absolute", left: x, top: y + dy, width: r, height: r, borderRadius: r, background: GOLD, opacity: tw, filter: "blur(1px)", boxShadow: `0 0 ${r * 2}px ${GOLD}` }} />;
  })}</>);
};

// `frames` overrides the duration used for the slow camera/parallax drift, so
// the ad animates correctly whether it's its own composition (standalone ad) or
// embedded as a fixed-length outro inside a longer story video.
export const ParallaxAd: React.FC<{ audioSrc?: string; frames?: number }> = ({ audioSrc, frames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const total = frames ?? durationInFrames;
  const cam = interpolate(ease(interpolate(frame, [0, total], [0, 1])), [0, 1], [1, 1.06]);
  const glowDrift = Math.sin(frame / 40) * 40;
  const headIn = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  const subIn = spring({ frame: frame - 116, fps, config: { damping: 200 } });
  const ctaIn = spring({ frame: frame - 150, fps, config: { damping: 200 } });
  const pulse = 1 + 0.03 * (0.5 + 0.5 * Math.sin(frame / 9));

  return (
    <AbsoluteFill style={{ background: `linear-gradient(165deg, ${FOREST} 0%, ${FOREST_DEEP} 60%, #1c2f24 100%)` }}>
      {audioSrc ? <Sequence from={12}><Audio src={staticFile(audioSrc)} /></Sequence> : null}
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${50 + glowDrift / 10}% 28%, rgba(201,168,76,0.22), transparent 55%)` }} />
      <GoldDust />

      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        {/* second book (closed) in the back for "two books" */}
        <Tile src="ad/book-mama.png" w={272} cx={256} cy={792} depth={0.42} baseRot={-9} delay={1.4} total={total} />
        {/* hero book that opens to reveal a DIFFERENT inner photo page (bigger,
            so the printed caption inside reads clearly) */}
        <OpeningBook coverSrc="ad/book-baba.png" spreadSrc="ad/spread-mama-sq.png" w={520} cx={772} cy={988} open0={42} open1={108} />
      </AbsoluteFill>

      {/* Headline */}
      <div style={{ position: "absolute", top: 176, width: "100%", textAlign: "center", opacity: interpolate(headIn, [0, 1], [0, 1]), transform: `translateY(${interpolate(headIn, [0, 1], [-26, 0])}px)` }}>
        <div style={{ fontFamily: JOST, fontWeight: 500, letterSpacing: 9, fontSize: 30, color: GOLD, marginBottom: 22 }}>KETABI STUDIO</div>
        <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 80, lineHeight: 1.08, color: CREAM, textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>
          Your photos,<br />a keepsake forever
        </div>
      </div>

      {/* Subline — personalization made explicit (enlarged for legibility,
          balanced over two lines so it doesn't crowd the CTA) */}
      <div style={{ position: "absolute", top: 1352, width: "100%", textAlign: "center", padding: "0 70px", boxSizing: "border-box", opacity: interpolate(subIn, [0, 1], [0, 1]) }}>
        <span style={{ fontFamily: JOST, fontWeight: 500, fontSize: 46, lineHeight: 1.28, color: CREAM, textShadow: "0 3px 18px rgba(0,0,0,0.55)" }}>hardcover books made<br />from your own photos</span>
      </div>

      {/* CTA */}
      <div style={{ position: "absolute", bottom: 150, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(ctaIn, [0, 1], [0, 1]), transform: `translateY(${interpolate(ctaIn, [0, 1], [30, 0])}px)` }}>
        <div style={{ fontFamily: JOST, fontWeight: 400, fontSize: 30, color: "rgba(246,244,239,0.85)", marginBottom: 24 }}>be the first to make yours</div>
        <div style={{ transform: `scale(${pulse})`, fontFamily: JOST, fontWeight: 500, letterSpacing: 1, fontSize: 40, color: FOREST_DEEP, background: `linear-gradient(180deg, #f0e6c8, ${GOLD})`, padding: "26px 64px", borderRadius: 100, boxShadow: "0 14px 40px rgba(201,168,76,0.35)" }}>
          Join the waitlist
        </div>
        <div style={{ fontFamily: JOST, fontWeight: 500, letterSpacing: 4, fontSize: 32, color: CREAM, marginTop: 28 }}>ketabistudio.com</div>
      </div>
    </AbsoluteFill>
  );
};
