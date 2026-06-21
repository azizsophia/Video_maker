import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, random } from "remotion";

// Cinematic, aniconic scene kit for "The Splitting of the Sea". No people are
// ever shown: the drama is carried by water, light, a path, and the staff.
type SceneProps = { theme: any; data?: any };

const FOAM = "#e6f7f9";
const DEEP = "#072c39";
const SEA = "#0e5566";

const Stars: React.FC<{ count?: number; area?: number; warm?: boolean }> = ({ count = 60, area = 0.6, warm }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const s = i + 1;
        const x = random(`x${s}`) * width;
        const y = random(`y${s}`) * height * area;
        const sz = 1 + random(`z${s}`) * 2.2;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin((frame / fps) * 1.2 + s));
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: "50%", background: warm ? "#ffe6c0" : "#fff", opacity: tw * 0.8, boxShadow: `0 0 ${sz * 2}px ${warm ? "#ffd9a0" : "#cfe6ff"}` }} />;
      })}
    </AbsoluteFill>
  );
};

// Animated sea surface (horizontal rolling waves).
const SeaSurface: React.FC<{ top: number; color?: string }> = ({ top, color = SEA }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const h = height - top;
  return (
    <div style={{ position: "absolute", left: 0, top, width, height: h, overflow: "hidden", background: `linear-gradient(180deg, ${color}, ${DEEP})` }}>
      {new Array(6).fill(0).map((_, i) => {
        const yy = (i / 6) * h;
        const shift = Math.sin(f / 20 + i) * 30;
        return <div key={i} style={{ position: "absolute", left: -40, right: -40, top: yy, height: 2, background: "rgba(230,247,249,0.18)", transform: `translateX(${shift}px)` }} />;
      })}
    </div>
  );
};

// A towering wall of water (left or right), with foam inner edge.
const WaterWall: React.FC<{ side: "left" | "right"; topGap: number; botGap: number; horizon: number }> = ({ side, topGap, botGap, horizon }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cx = width / 2;
  const innerTop = side === "left" ? cx - topGap : cx + topGap;
  const innerBot = side === "left" ? cx - botGap : cx + botGap;
  const outer = side === "left" ? 0 : width;
  const poly = side === "left"
    ? `0px ${horizon}px, ${innerTop}px ${horizon}px, ${innerBot}px ${height}px, 0px ${height}px`
    : `${width}px ${horizon}px, ${innerTop}px ${horizon}px, ${innerBot}px ${height}px, ${width}px ${height}px`;
  const grad = side === "left" ? "100deg" : "260deg";
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: `polygon(${poly})`, background: `linear-gradient(${grad}, ${DEEP} 0%, ${SEA} 55%, #2a8aa0 100%)` }}>
      {/* vertical caustic streaks */}
      {new Array(10).fill(0).map((_, i) => {
        const p = i / 10;
        const x = innerTop + (outer - innerTop) * p;
        const wob = Math.sin(f / 14 + i * 1.3) * 10;
        return <div key={i} style={{ position: "absolute", top: horizon, bottom: 0, left: x + wob, width: 2 + random(`w${i}`) * 3, background: "rgba(230,247,249,0.10)" }} />;
      })}
      {/* foam inner edge */}
      <div style={{ position: "absolute", top: horizon, left: innerTop - 6, width: 12, height: height - horizon, background: FOAM, opacity: 0.5, filter: "blur(3px)", transform: `skewX(${side === "left" ? 4 : -4}deg)` }} />
    </div>
  );
};

const Spray: React.FC<{ count?: number; cx?: number }> = ({ count = 40, cx }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const x0 = cx ?? width / 2;
  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const s = i + 1;
        const t = (frame * (1 + random(`s${s}`)) + random(`o${s}`) * 200) % 200;
        const up = interpolate(t, [0, 200], [0, 1]);
        const side = random(`d${s}`) > 0.5 ? 1 : -1;
        const x = x0 + side * up * (60 + random(`x${s}`) * 120);
        const y = height * 0.5 - up * (200 + random(`y${s}`) * 260) + Math.pow(up, 2) * 300;
        const o = interpolate(up, [0, 0.2, 1], [0, 0.9, 0]);
        const sz = 3 + random(`z${s}`) * 5;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: "50%", background: FOAM, opacity: o, filter: "blur(1px)" }} />;
      })}
    </AbsoluteFill>
  );
};

const NightSky: React.FC<{ warm?: boolean }> = ({ warm }) => (
  <AbsoluteFill style={{ background: warm
    ? "radial-gradient(ellipse at 50% 90%, #3a2a14 0%, #1a130b 45%, #0a0805 85%)"
    : "radial-gradient(ellipse at 50% 95%, #123040 0%, #0a1822 45%, #050a0f 85%)" }} />
);

// 1) Shore at night: trapped, sea ahead, dark dust (the army) approaching.
const SeaShore: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const dust = interpolate(f, [0, 90], [width * 1.1, width * 0.72], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <NightSky />
      <Stars count={70} area={0.55} />
      <SeaSurface top={height * 0.5} />
      {/* approaching dust cloud (no figures) */}
      <div style={{ position: "absolute", top: height * 0.34, left: dust, width: width * 0.6, height: height * 0.2, borderRadius: "50%", background: "radial-gradient(circle, rgba(40,28,16,0.85), transparent 70%)", filter: "blur(18px)" }} />
    </AbsoluteFill>
  );
};

// 2) The staff strikes: a bright crack opening down the centre of the sea.
const SeaStrike: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const open = interpolate(f, [4, 40], [4, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(f, [0, 8, 22], [0, 1, 0.25], { extrapolateRight: "clamp" });
  const horizon = height * 0.46;
  return (
    <AbsoluteFill>
      <NightSky />
      <Stars count={50} area={0.5} />
      <SeaSurface top={horizon} />
      {/* the opening gap */}
      <div style={{ position: "absolute", top: horizon, left: width / 2 - open / 2, width: open, height: height - horizon, background: "linear-gradient(180deg, rgba(20,40,50,0.6), #06222c)", boxShadow: `0 0 60px rgba(230,247,249,${0.5 * flash})` }} />
      {/* lightning crack */}
      <div style={{ position: "absolute", top: horizon, left: width / 2 - 2, width: 4, height: height - horizon, background: FOAM, opacity: flash, filter: "blur(1px)", boxShadow: `0 0 40px ${FOAM}` }} />
      <AbsoluteFill style={{ background: `rgba(230,247,249,${0.22 * flash})` }} />
    </AbsoluteFill>
  );
};

// 3) The sea parted: two towering walls and a dry path. The hero shot.
const SeaParted: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const horizon = height * 0.4;
  const grow = interpolate(f, [0, 30], [0.4, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const topGap = 70 * grow;
  const botGap = width * 0.22 * grow;
  return (
    <AbsoluteFill>
      <NightSky />
      <Stars count={60} area={0.42} />
      {/* dry path (perspective) */}
      <div style={{ position: "absolute", left: 0, top: 0, width, height, background: "linear-gradient(180deg, #0a1822 0%, #0a1822 40%, #2a2418 40%, #4a3d28 100%)" }} />
      <div style={{ position: "absolute", left: 0, top: horizon, width, height: height - horizon, clipPath: `polygon(${width / 2 - topGap}px 0px, ${width / 2 + topGap}px 0px, ${width / 2 + botGap}px ${height - horizon}px, ${width / 2 - botGap}px ${height - horizon}px)`, background: "linear-gradient(180deg, #6a5836, #3a3020)" }} />
      <WaterWall side="left" topGap={topGap} botGap={botGap} horizon={horizon} />
      <WaterWall side="right" topGap={topGap} botGap={botGap} horizon={horizon} />
      {/* moonlight glow at the vanishing point */}
      <div style={{ position: "absolute", top: horizon - 40, left: width / 2 - 60, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(230,247,249,0.5), transparent 70%)", filter: "blur(8px)", opacity: grow }} />
    </AbsoluteFill>
  );
};

// 4) Crossing: moving down the corridor, walls towering on each side.
const SeaPath: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const horizon = height * 0.34;
  const topGap = 60;
  const botGap = width * 0.26;
  return (
    <AbsoluteFill>
      <NightSky />
      <Stars count={50} area={0.34} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0a1822 0%, #0a1822 34%, #2a2418 34%, #4a3d28 100%)" }} />
      {/* scrolling path rungs for forward motion */}
      <div style={{ position: "absolute", left: 0, top: horizon, width, height: height - horizon, clipPath: `polygon(${width / 2 - topGap}px 0px, ${width / 2 + topGap}px 0px, ${width / 2 + botGap}px ${height - horizon}px, ${width / 2 - botGap}px ${height - horizon}px)`, background: "linear-gradient(180deg, #6a5836, #3a3020)" }}>
        {new Array(8).fill(0).map((_, i) => {
          const p = ((i / 8) + (f % 60) / 60) % 1;
          const y = p * p * (height - horizon);
          const wgt = 0.15 + p * 0.5;
          return <div key={i} style={{ position: "absolute", left: `${50 - 30 * p}%`, right: `${50 - 30 * p}%`, top: y, height: 2 + p * 4, background: `rgba(40,32,20,${wgt})` }} />;
        })}
      </div>
      <WaterWall side="left" topGap={topGap} botGap={botGap} horizon={horizon} />
      <WaterWall side="right" topGap={topGap} botGap={botGap} horizon={horizon} />
    </AbsoluteFill>
  );
};

// 5) The walls collapse (Pharaoh's army drowned — shown only as crashing water).
const SeaClosing: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const horizon = height * 0.4;
  const close = interpolate(f, [6, 46], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const topGap = 70 * close;
  const botGap = width * 0.22 * close;
  const flood = interpolate(f, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <NightSky />
      <Stars count={40} area={0.4} />
      <div style={{ position: "absolute", inset: 0, background: "#2a2418" }} />
      <WaterWall side="left" topGap={topGap} botGap={botGap} horizon={horizon} />
      <WaterWall side="right" topGap={topGap} botGap={botGap} horizon={horizon} />
      {/* the path floods over */}
      <div style={{ position: "absolute", left: 0, right: 0, top: horizon, bottom: 0, background: `linear-gradient(180deg, ${SEA}, ${DEEP})`, opacity: flood }} />
      <Spray count={60} />
    </AbsoluteFill>
  );
};

// 6) Dawn on the far shore: calm restored, warm light, safety.
const SeaDawn: React.FC<SceneProps> = () => {
  const { height, width } = useVideoConfig();
  const f = useCurrentFrame();
  const sun = interpolate(f, [0, 60], [height * 0.52, height * 0.42], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <NightSky warm />
      <Stars count={26} area={0.3} warm />
      <SeaSurface top={height * 0.5} color="#1c5566" />
      {/* dawn sun + reflection path */}
      <div style={{ position: "absolute", top: sun - 70, left: width / 2 - 70, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, #ffe6b0, rgba(255,200,120,0.2) 60%, transparent 75%)", filter: "blur(4px)" }} />
      <div style={{ position: "absolute", top: height * 0.5, left: width / 2 - 50, width: 100, bottom: 0, background: "linear-gradient(180deg, rgba(255,220,150,0.5), transparent)", filter: "blur(10px)" }} />
    </AbsoluteFill>
  );
};

export const seaScenes: Record<string, React.FC<SceneProps>> = {
  "sea-shore": SeaShore,
  "sea-strike": SeaStrike,
  "sea-parted": SeaParted,
  "sea-path": SeaPath,
  "sea-closing": SeaClosing,
  "sea-dawn": SeaDawn,
};
