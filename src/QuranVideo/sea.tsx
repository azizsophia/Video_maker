import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, random } from "remotion";

// Cinematic, aniconic scene kit for "The Splitting of the Sea". No people are
// ever shown: the drama is carried by water, light, a path, and the staff.
// The water is built from layered perspective waves + a broken moonlight
// reflection + glints + foam, so it reads as a living sea, not a flat fill.
type SceneProps = { theme: any; data?: any };

const FOAM = "#e8f8fb";

const NightSky: React.FC<{ warm?: boolean }> = ({ warm }) => (
  <AbsoluteFill style={{ background: warm
    ? "linear-gradient(180deg, #1c1206 0%, #3a2410 38%, #6e431d 70%, #9c6a32 100%)"
    : "linear-gradient(180deg, #04070d 0%, #081827 45%, #0e2c3c 78%, #14414f 100%)" }} />
);

const Stars: React.FC<{ count?: number; area?: number; warm?: boolean }> = ({ count = 70, area = 0.45, warm }) => {
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

const Moon: React.FC<{ x: number; y: number; r: number; warm?: boolean }> = ({ x, y, r, warm }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%",
    background: warm ? "radial-gradient(circle, #fff4da 0%, #ffce86 55%, transparent 72%)" : "radial-gradient(circle, #f6fbff 0%, #c4dcea 52%, transparent 70%)",
    filter: "blur(1px)", boxShadow: warm ? "0 0 120px 30px rgba(255,200,130,0.35)" : "0 0 120px 30px rgba(170,210,240,0.30)" }} />
);

// Living sea surface: perspective waves + broken moonlight column + glints.
const WaterSurface: React.FC<{ horizon: number; moonX?: number; warm?: boolean }> = ({ horizon, moonX, warm }) => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const seaH = height - horizon;
  const mx = moonX ?? width * 0.5;
  const rows = 26;
  const waveCol = warm ? "rgba(255,224,180," : "rgba(190,232,247,";
  return (
    <div style={{ position: "absolute", left: 0, top: horizon, width, height: seaH, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: warm
        ? "linear-gradient(180deg, #5a3b1e 0%, #2e1d10 45%, #160d07 100%)"
        : "linear-gradient(180deg, #14424f 0%, #0c2c38 50%, #061620 100%)" }} />
      {/* perspective wave strokes (denser near horizon) */}
      <svg width={width} height={seaH} style={{ position: "absolute", inset: 0 }}>
        {new Array(rows).fill(0).map((_, i) => {
          const t = i / rows;
          const y = Math.pow(t, 1.7) * seaH;
          const amp = 1.5 + t * 11;
          const phase = f * (0.25 + t * 1.2) + i * 1.3;
          const op = 0.05 + t * 0.20;
          let d = `M0 ${y.toFixed(1)}`;
          const seg = 14;
          for (let s = 1; s <= seg; s++) {
            const x = (width * s) / seg;
            const yy = y + Math.sin(phase + s * 0.8) * amp + Math.sin(phase * 0.5 + s * 1.7) * amp * 0.4;
            d += ` L${x.toFixed(1)} ${yy.toFixed(1)}`;
          }
          return <path key={i} d={d} fill="none" stroke={`${waveCol}${op.toFixed(3)})`} strokeWidth={1 + t * 1.8} />;
        })}
      </svg>
      {/* broken moonlight reflection column */}
      {new Array(24).fill(0).map((_, i) => {
        const t = i / 24;
        const y = Math.pow(t, 1.7) * seaH;
        const w = (8 + t * 150) * (0.55 + 0.45 * Math.sin(f / 6 + i));
        const op = (0.55 * (1 - t) + 0.12) * (0.55 + 0.45 * Math.abs(Math.sin(f / 9 + i)));
        return <div key={`r${i}`} style={{ position: "absolute", left: mx - w / 2, top: y, width: w, height: 2 + t * 5, borderRadius: 6, background: warm ? "#ffe9c0" : FOAM, opacity: op, filter: "blur(0.8px)" }} />;
      })}
      {/* specular glints */}
      {new Array(46).fill(0).map((_, i) => {
        const s = i + 1;
        const gx = random(`gx${s}`) * width;
        const gt = random(`gt${s}`);
        const y = Math.pow(gt, 1.6) * seaH;
        const tw = Math.abs(Math.sin(f / 7 + s * 1.5));
        return <div key={`g${i}`} style={{ position: "absolute", left: gx, top: y, width: 1.5 + gt * 3, height: 2, borderRadius: 2, background: warm ? "#ffe9c0" : "#d6f1fb", opacity: tw * 0.5 * (0.4 + gt) }} />;
      })}
    </div>
  );
};

// A towering wall of water: luminous moonlit crest fading to a deep base,
// horizontal water-layer ripples, cascading foam and a glowing inner edge.
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
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: `polygon(${poly})`, background: "linear-gradient(180deg, #e2f6fa 0%, #8fd0dd 7%, #3f9fb4 24%, #1d6776 50%, #0d3a46 78%, #06222c 100%)" }}>
      {/* horizontal water-layer ripples */}
      {new Array(20).fill(0).map((_, i) => {
        const t = i / 20;
        const y = horizon + t * (height - horizon);
        const sh = Math.sin(f / 13 + i * 0.7) * 9;
        const op = 0.05 + 0.16 * (1 - t);
        return <div key={`h${i}`} style={{ position: "absolute", left: 0, right: 0, top: y + sh, height: 1.5, background: `rgba(235,250,253,${op.toFixed(3)})` }} />;
      })}
      {/* soft cascading foam streaks */}
      {new Array(6).fill(0).map((_, i) => {
        const x = innerTop + (outer - innerTop) * ((i + 0.5) / 6);
        const flow = ((f * 1.6 + i * 47) % (height - horizon + 160)) - 80;
        return <div key={`c${i}`} style={{ position: "absolute", top: horizon + flow, left: x, width: 16, height: 140, background: "linear-gradient(180deg, transparent, rgba(235,250,253,0.18), transparent)", filter: "blur(4px)" }} />;
      })}
      {/* bright foam crest along the top */}
      <div style={{ position: "absolute", top: horizon - 5, left: 0, right: 0, height: 16, background: `linear-gradient(180deg, ${FOAM}, transparent)`, opacity: 0.6, filter: "blur(2px)" }} />
      {/* glowing inner edge (where the wall meets the path) */}
      <div style={{ position: "absolute", top: horizon, left: innerTop - 11, width: 22, height: height - horizon, background: `linear-gradient(90deg, ${side === "left" ? "transparent, " + FOAM : FOAM + ", transparent"})`, opacity: 0.6, filter: "blur(3px)", transform: `skewX(${side === "left" ? 6 : -6}deg)`, transformOrigin: "top" }} />
    </div>
  );
};

const Spray: React.FC<{ count?: number; cx?: number }> = ({ count = 50, cx }) => {
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
        const x = x0 + side * up * (60 + random(`x${s}`) * 140);
        const y = height * 0.5 - up * (220 + random(`y${s}`) * 280) + Math.pow(up, 2) * 340;
        const o = interpolate(up, [0, 0.2, 1], [0, 0.9, 0]);
        const sz = 3 + random(`z${s}`) * 5;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: sz, height: sz, borderRadius: "50%", background: FOAM, opacity: o, filter: "blur(1px)" }} />;
      })}
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, transparent 42%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none" }} />
);

// 1) Shore at night: trapped, sea ahead, dark dust (the army) approaching.
const SeaShore: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const horizon = height * 0.46;
  const moonX = width * 0.64;
  const dust = interpolate(f, [0, 130], [-width * 0.5, -width * 0.05], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <NightSky />
      <Stars count={80} area={0.45} />
      <Moon x={moonX} y={horizon - 150} r={46} />
      {/* horizon haze */}
      <div style={{ position: "absolute", left: 0, right: 0, top: horizon - 50, height: 100, background: "linear-gradient(180deg, transparent, rgba(150,200,225,0.18), transparent)", filter: "blur(10px)" }} />
      <WaterSurface horizon={horizon} moonX={moonX} />
      {/* approaching army as a dark dust storm on the left */}
      <div style={{ position: "absolute", top: horizon - 120, left: dust, width: width * 0.55, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,20,10,0.9), transparent 70%)", filter: "blur(22px)" }} />
      <Vignette />
    </AbsoluteFill>
  );
};

// 2) The staff strikes: a blinding crack opening down the centre of the sea.
const SeaStrike: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const horizon = height * 0.44;
  const open = interpolate(f, [4, 42], [6, 150], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(f, [0, 7, 26], [0, 1, 0.2], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <NightSky />
      <Stars count={50} area={0.44} />
      <WaterSurface horizon={horizon} moonX={width / 2} />
      {/* the opening gap (dry darkness between rising walls) */}
      <div style={{ position: "absolute", top: horizon, left: width / 2 - open / 2, width: open, height: height - horizon, background: "linear-gradient(180deg, #163842 0%, #2a2416 55%, #4a3d28 100%)" }} />
      {/* foam edges of the opening */}
      <div style={{ position: "absolute", top: horizon, left: width / 2 - open / 2 - 6, width: 12, height: height - horizon, background: FOAM, opacity: 0.6 * flash + 0.3, filter: "blur(3px)" }} />
      <div style={{ position: "absolute", top: horizon, left: width / 2 + open / 2 - 6, width: 12, height: height - horizon, background: FOAM, opacity: 0.6 * flash + 0.3, filter: "blur(3px)" }} />
      {/* lightning crack + flash */}
      <div style={{ position: "absolute", top: horizon - 40, left: width / 2 - 2, width: 4, height: height - horizon + 40, background: FOAM, opacity: flash, filter: "blur(1px)", boxShadow: `0 0 50px ${FOAM}` }} />
      <AbsoluteFill style={{ background: `rgba(232,248,251,${0.22 * flash})` }} />
      <Vignette />
    </AbsoluteFill>
  );
};

// 3) The sea parted: two towering walls and a dry path. The hero shot.
const SeaParted: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const horizon = height * 0.38;
  const grow = interpolate(f, [0, 32], [0.45, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const topGap = 64 * grow;
  const botGap = width * 0.2 * grow;
  return (
    <AbsoluteFill>
      <NightSky />
      <Stars count={60} area={0.36} />
      {/* dry sea-bed path (perspective) with wet sheen */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #081827 0%, #081827 38%, #2a2416 38%, #4a3d28 100%)" }} />
      <div style={{ position: "absolute", left: 0, top: horizon, width, height: height - horizon, clipPath: `polygon(${width / 2 - topGap}px 0px, ${width / 2 + topGap}px 0px, ${width / 2 + botGap}px ${height - horizon}px, ${width / 2 - botGap}px ${height - horizon}px)`, background: "linear-gradient(180deg, #5e4d2e 0%, #6e5a36 60%, #3a3020 100%)" }}>
        {new Array(6).fill(0).map((_, i) => {
          const p = (i + 1) / 7;
          return <div key={i} style={{ position: "absolute", left: `${50 - 26 * p}%`, right: `${50 - 26 * p}%`, top: `${p * p * 100}%`, height: 1 + p * 3, background: "rgba(255,240,210,0.10)" }} />;
        })}
      </div>
      <WaterWall side="left" topGap={topGap} botGap={botGap} horizon={horizon} />
      <WaterWall side="right" topGap={topGap} botGap={botGap} horizon={horizon} />
      {/* god-ray glow at the vanishing point */}
      <div style={{ position: "absolute", top: horizon - 70, left: width / 2 - 90, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(220,245,251,0.55), transparent 70%)", filter: "blur(10px)", opacity: grow }} />
      <Vignette />
    </AbsoluteFill>
  );
};

// 4) Crossing: moving down the corridor, walls towering on each side.
const SeaPath: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const horizon = height * 0.3;
  const topGap = 56;
  const botGap = width * 0.24;
  return (
    <AbsoluteFill>
      <NightSky />
      <Stars count={46} area={0.3} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #081827 0%, #081827 30%, #2a2416 30%, #4a3d28 100%)" }} />
      <div style={{ position: "absolute", left: 0, top: horizon, width, height: height - horizon, clipPath: `polygon(${width / 2 - topGap}px 0px, ${width / 2 + topGap}px 0px, ${width / 2 + botGap}px ${height - horizon}px, ${width / 2 - botGap}px ${height - horizon}px)`, background: "linear-gradient(180deg, #5e4d2e, #3a3020)" }}>
        {new Array(9).fill(0).map((_, i) => {
          const p = ((i / 9) + (f % 54) / 54) % 1;
          const y = p * p * (height - horizon);
          return <div key={i} style={{ position: "absolute", left: `${50 - 30 * p}%`, right: `${50 - 30 * p}%`, top: y, height: 2 + p * 5, background: `rgba(255,240,210,${0.10 + p * 0.18})` }} />;
        })}
      </div>
      <WaterWall side="left" topGap={topGap} botGap={botGap} horizon={horizon} />
      <WaterWall side="right" topGap={topGap} botGap={botGap} horizon={horizon} />
      <Vignette />
    </AbsoluteFill>
  );
};

// 5) The walls collapse (Pharaoh's army drowned — shown only as crashing water).
const SeaClosing: React.FC<SceneProps> = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const horizon = height * 0.38;
  const close = interpolate(f, [6, 48], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const topGap = 64 * close;
  const botGap = width * 0.2 * close;
  const flood = interpolate(f, [34, 64], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <NightSky />
      <Stars count={40} area={0.36} />
      <div style={{ position: "absolute", inset: 0, background: "#2a2416" }} />
      <WaterWall side="left" topGap={topGap} botGap={botGap} horizon={horizon} />
      <WaterWall side="right" topGap={topGap} botGap={botGap} horizon={horizon} />
      <div style={{ position: "absolute", left: 0, right: 0, top: horizon, bottom: 0, opacity: flood }}>
        <WaterSurface horizon={0} moonX={width / 2} />
      </div>
      <Spray count={70} />
      <Vignette />
    </AbsoluteFill>
  );
};

// 6) Dawn on the far shore: calm restored, warm light, safety.
const SeaDawn: React.FC<SceneProps> = () => {
  const { height, width } = useVideoConfig();
  const f = useCurrentFrame();
  const horizon = height * 0.5;
  const sun = interpolate(f, [0, 70], [horizon + 30, horizon - 50], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <NightSky warm />
      <Stars count={20} area={0.28} warm />
      <Moon x={width / 2} y={sun} r={70} warm />
      <WaterSurface horizon={horizon} moonX={width / 2} warm />
      <Vignette />
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
