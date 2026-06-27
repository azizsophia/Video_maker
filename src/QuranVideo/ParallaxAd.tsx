import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
// Bundled fonts (no gstatic through the proxy).
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/900.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";

const PLAYFAIR = '"Playfair Display", Georgia, serif';
const JOST = 'Jost, "Helvetica Neue", Arial, sans-serif';

// Brand kit
const FOREST = "#2E4A3A";
const FOREST_DEEP = "#233A2D";
const CREAM = "#F6F4EF";
const GOLD = "#C9A84C";

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

// One floating product tile with parallax depth + a gentle 3D tilt.
const Tile: React.FC<{
  src: string; w: number; cx: number; cy: number; depth: number; baseRot: number; delay: number;
}> = ({ src, w, cx, cy, depth, baseRot, delay }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  // Camera pan drives parallax: deeper tiles (small depth) move less.
  const p = ease(interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" }));
  const panX = interpolate(p, [0, 1], [40, -40]) * depth;
  const panY = interpolate(p, [0, 1], [18, -18]) * depth;
  // Slow individual float + tilt for life.
  const floatY = Math.sin((frame / fps) * 0.8 + delay) * 10 * depth;
  const rotY = baseRot + Math.sin((frame / fps) * 0.5 + delay) * 2.2;
  const rotX = Math.sin((frame / fps) * 0.4 + delay) * 1.4;
  // Staggered entrance.
  const enter = spring({ frame: frame - delay * 8, fps, config: { damping: 200, mass: 0.7 } });
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const rise = interpolate(enter, [0, 1], [70, 0]);
  const pop = interpolate(enter, [0, 1], [0.9, 1]);
  const h = w * 1.2;
  return (
    <div
      style={{
        position: "absolute",
        left: cx - w / 2 + panX,
        top: cy - h / 2 + panY + floatY + rise,
        width: w,
        height: h,
        opacity,
        transform: `perspective(1600px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${pop})`,
        borderRadius: 26,
        overflow: "hidden",
        boxShadow: `0 ${30 * depth + 14}px ${60 * depth + 30}px rgba(0,0,0,${0.34 * depth + 0.18}), 0 2px 0 rgba(255,255,255,0.05)`,
        border: "1px solid rgba(231,200,115,0.30)",
      }}
    >
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.06)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 60px rgba(0,0,0,0.25)", borderRadius: 26 }} />
    </div>
  );
};

const GoldDust: React.FC = () => {
  const frame = useCurrentFrame();
  const specks = [
    [180, 520, 6], [870, 360, 5], [620, 1280, 7], [300, 1420, 4],
    [930, 980, 6], [120, 1150, 5], [780, 1560, 5], [520, 300, 4],
  ];
  return (
    <>
      {specks.map(([x, y, r], i) => {
        const dy = Math.sin(frame / 30 + i) * 16;
        const tw = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(frame / 18 + i * 2));
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y + dy, width: r, height: r, borderRadius: r, background: GOLD, opacity: tw, filter: "blur(1px)", boxShadow: `0 0 ${r * 2}px ${GOLD}` }} />
        );
      })}
    </>
  );
};

export const ParallaxAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  // Slow overall push-in.
  const cam = interpolate(ease(interpolate(frame, [0, durationInFrames], [0, 1])), [0, 1], [1, 1.07]);
  const glowDrift = Math.sin(frame / 40) * 40;

  const headIn = spring({ frame: frame - 6, fps, config: { damping: 200 } });
  const ctaIn = spring({ frame: frame - 70, fps, config: { damping: 200 } });
  const pulse = 1 + 0.03 * (0.5 + 0.5 * Math.sin(frame / 9));

  return (
    <AbsoluteFill style={{ background: `linear-gradient(165deg, ${FOREST} 0%, ${FOREST_DEEP} 60%, #1c2f24 100%)` }}>
      {/* drifting gold glow */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${50 + glowDrift / 10}% 26%, rgba(201,168,76,0.22), transparent 55%)` }} />
      <GoldDust />

      {/* Parallax product cluster (pushed in by camera) */}
      <AbsoluteFill style={{ transform: `scale(${cam})` }}>
        <Tile src="ad/book-baba.png" w={300} cx={300} cy={1040} depth={0.45} baseRot={9} delay={2.4} />
        <Tile src="ad/book-mama.png" w={320} cx={800} cy={980} depth={0.62} baseRot={-8} delay={1.5} />
        <Tile src="ad/card-open.png" w={430} cx={540} cy={920} depth={1.0} baseRot={-2} delay={0} />
      </AbsoluteFill>

      {/* Headline (top safe zone) */}
      <div style={{ position: "absolute", top: 180, width: "100%", textAlign: "center", opacity: interpolate(headIn, [0, 1], [0, 1]), transform: `translateY(${interpolate(headIn, [0, 1], [-26, 0])}px)` }}>
        <div style={{ fontFamily: JOST, fontWeight: 500, letterSpacing: 9, fontSize: 30, color: GOLD, marginBottom: 22 }}>KETABI STUDIO</div>
        <div style={{ fontFamily: PLAYFAIR, fontWeight: 900, fontSize: 78, lineHeight: 1.08, color: CREAM, textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}>
          Cards &amp; keepsakes,<br />sealed with a prayer
        </div>
      </div>

      {/* CTA (bottom safe zone) */}
      <div style={{ position: "absolute", bottom: 230, width: "100%", display: "flex", flexDirection: "column", alignItems: "center", opacity: interpolate(ctaIn, [0, 1], [0, 1]), transform: `translateY(${interpolate(ctaIn, [0, 1], [30, 0])}px)` }}>
        <div style={{ fontFamily: JOST, fontWeight: 400, fontSize: 30, color: "rgba(246,244,239,0.85)", marginBottom: 26 }}>be the first to gift one</div>
        <div style={{ transform: `scale(${pulse})`, fontFamily: JOST, fontWeight: 500, letterSpacing: 1, fontSize: 40, color: FOREST_DEEP, background: `linear-gradient(180deg, #f0e6c8, ${GOLD})`, padding: "26px 64px", borderRadius: 100, boxShadow: "0 14px 40px rgba(201,168,76,0.35)" }}>
          Join the waitlist
        </div>
        <div style={{ fontFamily: JOST, fontWeight: 500, letterSpacing: 4, fontSize: 32, color: CREAM, marginTop: 30 }}>ketabistudio.com</div>
      </div>
    </AbsoluteFill>
  );
};
