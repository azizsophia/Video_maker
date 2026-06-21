import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  random,
} from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT } from "./fonts";
import { scienceScenes } from "./scienceScenes";
import { explainerScenes } from "./explainer";
import { birminghamScenes } from "./birmingham";
import { constantinopleScenes } from "./constantinople";
import { elephantScenes } from "./elephant";
import { isnadScenes } from "./isnad";
import { alkahfScenes } from "./alkahf";
import { decodedScenes } from "./decoded";
import { sahabaScenes } from "./sahaba";
import { ctaScenes } from "./cta";
import { seaScenes } from "./sea";

// Hand-built, fully aniconic illustrated scenes (skies, deserts, architecture,
// light) — no faces, people, or animals, ever. Owned + copyright-free.

type SceneProps = { theme: ThemePalette; data?: any };

const Stars: React.FC<{ count?: number; area?: number; opacity?: number }> = ({
  count = 70,
  area = 0.7,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const s = i + 1;
        const x = random(`sx${s}`) * width;
        const y = random(`sy${s}`) * height * area;
        const sz = 1 + random(`ss${s}`) * 2.2;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin((frame / fps) * 1.2 + s));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: sz,
              borderRadius: "50%",
              background: "#fff",
              opacity: tw * opacity * 0.9,
              boxShadow: `0 0 ${sz * 2}px #cfe0ff`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Moon: React.FC<{ x: number; y: number; r: number; color?: string }> = ({
  x,
  y,
  r,
  color = "#dfe8ff",
}) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle at 38% 38%, #ffffff, ${color} 58%, transparent 72%)`,
      boxShadow: `0 0 ${r * 2}px ${r}px rgba(180,200,255,0.22)`,
    }}
  />
);

const dune = (w: number, h: number, base: number, off: number): string => {
  const y = h * base;
  const a = h * 0.05;
  return `M -60 ${h} L -60 ${y} C ${w * 0.25} ${y - a + off} ${w * 0.4} ${y + a} ${w * 0.55} ${
    y + off * 0.5
  } C ${w * 0.7} ${y - a} ${w * 0.9} ${y + a + off} ${w + 60} ${y} L ${w + 60} ${h} Z`;
};

const DesertNight: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const drift = Math.sin((frame / fps) * 0.1) * 16;
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg,#0a1230 0%,#162447 45%,#3a2e4f 70%,#1a1326 100%)",
      }}
    >
      <Stars count={80} area={0.55} />
      <Moon x={width * 0.7} y={height * 0.2} r={70} />
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0 }}
      >
        <path d={dune(width, height, 0.66, drift * 0.3)} fill="#241a33" />
        <path d={dune(width, height, 0.74, drift * 0.6)} fill="#19121f" />
        <path d={dune(width, height, 0.84, drift)} fill="#0c0810" />
      </svg>
    </AbsoluteFill>
  );
};

const Heavens: React.FC<SceneProps> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 120%, #1a2a55 0%, #0a1230 40%, #04060f 82%)",
      }}
    >
      <Stars count={70} area={1} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {new Array(7).fill(0).map((_, i) => {
          const cy = height * 0.97 - i * height * 0.12;
          const rx = width * (0.82 - i * 0.07);
          const pulse = 0.28 + 0.24 * Math.sin(t * 0.8 - i * 0.5);
          return (
            <ellipse
              key={i}
              cx={width / 2}
              cy={cy}
              rx={rx}
              ry={height * 0.16}
              fill="none"
              stroke={theme.accent}
              strokeWidth={2}
              opacity={Math.max(0, pulse * (1 - i * 0.08))}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: width / 2 - 70,
          bottom: 0,
          width: 140,
          height: height * 0.9,
          background: "linear-gradient(0deg, rgba(150,190,255,0.25), transparent)",
          filter: "blur(24px)",
        }}
      />
    </AbsoluteFill>
  );
};

const GraveEarth: React.FC<SceneProps> = () => {
  const { width, height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#05060a" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: height * 0.16,
          background: "linear-gradient(180deg,#0a1230,#05060a)",
        }}
      />
      <Stars count={24} area={0.13} />
      <div
        style={{
          position: "absolute",
          top: height * 0.16,
          left: 0,
          right: 0,
          height: 3,
          background: "#1a1410",
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: height * 0.16,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse at 50% 0%, #1d140d 0%, #0a0705 55%, #030202 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: height * 0.16,
          left: width / 2 - 55,
          width: 110,
          height: height * 0.52,
          background: "linear-gradient(180deg, rgba(205,182,120,0.30), transparent)",
          filter: "blur(16px)",
        }}
      />
    </AbsoluteFill>
  );
};

const MosqueNight: React.FC<SceneProps> = () => {
  const { width, height } = useVideoConfig();
  const hy = height * 0.72;
  const cx = width / 2;
  const domeR = 92;
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg,#070c22 0%,#0e1838 45%,#243a5e 72%,#0c1226 100%)",
      }}
    >
      <Stars count={80} area={0.6} />
      <Moon x={width * 0.28} y={height * 0.22} r={56} />
      <div
        style={{
          position: "absolute",
          left: cx - 190,
          top: hy - 280,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120,160,230,0.18), transparent 62%)",
        }}
      />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <g fill="#070a16">
          <rect x={0} y={hy} width={width} height={height} />
          <rect x={cx - 160} y={hy - 120} width={320} height={120} />
          <path d={`M ${cx - domeR} ${hy - 120} A ${domeR} ${domeR} 0 0 1 ${cx + domeR} ${hy - 120} Z`} />
          <rect x={cx - 4} y={hy - 238} width={8} height={42} />
          <rect x={cx - 222} y={hy - 200} width={26} height={200} />
          <path d={`M ${cx - 222} ${hy - 200} A 13 13 0 0 1 ${cx - 196} ${hy - 200} Z`} />
          <rect x={cx + 196} y={hy - 200} width={26} height={200} />
          <path d={`M ${cx + 196} ${hy - 200} A 13 13 0 0 1 ${cx + 222} ${hy - 200} Z`} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const MistyPlain: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg,#1b2230 0%,#39424f 50%,#5a5f66 78%,#2b2f36 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: height * 0.6,
          left: 0,
          right: 0,
          height: 2,
          background: "rgba(255,255,255,0.12)",
        }}
      />
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: -200 + Math.sin(t * 0.1 + i) * 120,
            top: height * (0.45 + i * 0.1),
            width: width + 400,
            height: 130,
            background: "rgba(220,225,235,0.06)",
            filter: "blur(34px)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// The Day of Gathering: a barren cracked plain under a huge, low sun.
const ScorchedSun: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const haze = Math.sin((frame / fps) * 1.5) * 6;
  const ground = height * 0.64;
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg,#e7bd84 0%,#dd9a52 28%,#bf5e2c 52%,#5a2a18 76%,#241009 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: width / 2 - 230,
          top: height * 0.16 + haze,
          width: 460,
          height: 460,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #fff7e6 0%, #ffd27a 38%, rgba(255,180,90,0) 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: ground - 70,
          left: 0,
          right: 0,
          height: 140,
          background: "rgba(255,220,160,0.22)",
          filter: "blur(34px)",
        }}
      />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <rect x={0} y={ground} width={width} height={height} fill="#34190f" />
        {new Array(7).fill(0).map((_, i) => {
          const x = (random(`cx${i}`) * width) | 0;
          const y = ground + 30 + random(`cy${i}`) * (height - ground - 40);
          const len = 60 + random(`cl${i}`) * 180;
          return (
            <path
              key={i}
              d={`M ${x} ${y} l ${len * 0.5} ${20} l ${-len * 0.3} ${24} l ${len * 0.4} ${18}`}
              stroke="#1c0d07"
              strokeWidth={2}
              fill="none"
              opacity={0.7}
            />
          );
        })}
      </svg>
      <AbsoluteFill style={{ background: "rgba(20,8,4,0.18)" }} />
    </AbsoluteFill>
  );
};

// App-showcase outro: cycles through the app screens on a calm cream/sage
// background that matches the app, with a download CTA. Edit APP_NAME / website
// if the app is branded differently.
const APP_SHOTS = ["app/home.png", "app/quran.png", "app/stateofheart.png", "app/adhkar.png"];
const APP_NAME = "Ketabi";
const APP_WEBSITE = "ketabistudio.com";

const AppShowcase: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, height } = useVideoConfig();
  const per = durationInFrames / APP_SHOTS.length;
  const headerIn = interpolate(frame, [4, 22], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg,#eef1ea 0%,#e6ebe0 55%,#dde3d6 100%)" }}>
      {/* faint decorative arc, like the app's marketing shots */}
      <div
        style={{
          position: "absolute",
          top: -height * 0.12,
          right: -height * 0.12,
          width: height * 0.42,
          height: height * 0.42,
          borderRadius: "50%",
          border: "2px solid rgba(60,90,70,0.10)",
        }}
      />
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 150 }}>
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontSize: 34,
            letterSpacing: 8,
            color: "#5d7064",
            textTransform: "uppercase",
            opacity: headerIn,
          }}
        >
          Your Daily Companion
        </div>
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontSize: 78,
            fontWeight: 800,
            color: "#20392b",
            marginTop: 12,
            opacity: headerIn,
          }}
        >
          {APP_NAME}
        </div>
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontSize: 30,
            fontStyle: "italic",
            color: "#5d7064",
            marginTop: 16,
            opacity: headerIn,
            textAlign: "center",
            maxWidth: 760,
          }}
        >
          "In the remembrance of Allah, hearts find rest."
        </div>
      </AbsoluteFill>

      {/* phone carousel */}
      {APP_SHOTS.map((src, i) => {
        const local = frame - i * per;
        const op = interpolate(local, [0, 14, per - 14, per], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const rise = interpolate(local, [0, 18], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const float = Math.sin(frame / fps + i) * 8;
        return (
          <AbsoluteFill key={i} style={{ justifyContent: "center", alignItems: "center", opacity: op }}>
            <Img
              src={staticFile(src)}
              style={{
                height: height * 0.6,
                transform: `translateY(${rise + float}px)`,
                filter: "drop-shadow(0 34px 60px rgba(40,55,45,0.28))",
                borderRadius: 24,
              }}
            />
          </AbsoluteFill>
        );
      })}

      {/* CTA */}
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150 }}>
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontSize: 50,
            fontWeight: 800,
            color: "#20392b",
          }}
        >
          Download {APP_NAME}
        </div>
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontSize: 34,
            color: "#5d7064",
            marginTop: 8,
            letterSpacing: 1,
          }}
        >
          Free at {APP_WEBSITE}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Void: React.FC<SceneProps> = ({ theme }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 35%, ${theme.gradientFrom}, ${theme.gradientTo} 82%)`,
    }}
  >
    <Stars count={50} area={1} opacity={0.7} />
  </AbsoluteFill>
);

// Deep-emerald brand backdrop (Ketabi green) for text-driven beats.
const EmeraldVeil: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  const cx = width / 2;
  const cy = height * 0.5;
  const R = width * 0.66;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #1c3b30 0%, #102219 55%, #08120d 100%)" }}>
      {/* slow-rotating astrolabe motif (concentric rings + tick marks) so the
          background is never flat. Deliberately no stars/polygons. */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.1 }}>
        <g transform={`rotate(${frame * 0.04} ${cx} ${cy})`} stroke="#e7c163" fill="none">
          <circle cx={cx} cy={cy} r={R * 0.62} strokeWidth={2} />
          <circle cx={cx} cy={cy} r={R * 0.46} strokeWidth={1.5} />
          <circle cx={cx} cy={cy} r={R * 0.3} strokeWidth={1.5} />
          {new Array(24).fill(0).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return <line key={i} x1={cx + Math.cos(a) * R * 0.62} y1={cy + Math.sin(a) * R * 0.62} x2={cx + Math.cos(a) * R * 0.7} y2={cy + Math.sin(a) * R * 0.7} strokeWidth={2} />;
          })}
        </g>
      </svg>
      {new Array(24).fill(0).map((_, i) => {
        const s = i + 1;
        const x = random(`ex${s}`) * width;
        const y = height - ((frame * (0.3 + random(`ev${s}`)) + random(`ey${s}`) * height) % (height + 80));
        const sz = 2 + random(`es${s}`) * 3;
        return (
          <div key={i} style={{ position: "absolute", left: x + Math.sin(t + s) * 14, top: y, width: sz, height: sz, borderRadius: "50%", background: "rgba(231,193,99,0.5)", opacity: 0.4, filter: "blur(1px)" }} />
        );
      })}
    </AbsoluteFill>
  );
};

// Ring-composition diagram: nested frames folding inward to a glowing gold center.
const RingDiagram: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const cx = width / 2;
  const cy = height * 0.44;
  const rings = 5;
  const GREEN = "#4f9a7a";
  const GOLD = "#e7c163";
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 44%, #163027 0%, #0c1a14 55%, #060e0a 100%)" }}>
      {new Array(rings).fill(0).map((_, i) => {
        const appear = interpolate(frame, [i * 9, i * 9 + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const size = (rings - i) / rings;
        const w = width * 0.82 * size;
        const h = height * 0.62 * size;
        const center = i === rings - 1;
        return (
          <div key={i} style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: Math.max(18, 28 * size), border: `${center ? 3 : 2}px solid ${center ? GOLD : GREEN}`, opacity: appear * (center ? 1 : 0.55), background: center ? "rgba(231,193,99,0.10)" : "transparent", boxShadow: center ? "0 0 50px rgba(231,193,99,0.5)" : "none" }} />
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: cy - 22, textAlign: "center", fontFamily: TRANSLATION_FONT, fontSize: 36, fontWeight: 800, color: GOLD, opacity: interpolate(frame, [rings * 9, rings * 9 + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textShadow: "0 0 24px rgba(231,193,99,0.6)" }}>
        The Ka'ba
      </div>
    </AbsoluteFill>
  );
};

const SCENES: Record<string, React.FC<SceneProps>> = {
  emerald: EmeraldVeil,
  ringdiagram: RingDiagram,
  "desert-night": DesertNight,
  heavens: Heavens,
  "grave-earth": GraveEarth,
  "mosque-night": MosqueNight,
  "misty-plain": MistyPlain,
  "scorched-sun": ScorchedSun,
  "app-showcase": AppShowcase,
  ...scienceScenes,
  ...explainerScenes,
  ...birminghamScenes,
  ...constantinopleScenes,
  ...elephantScenes,
  ...isnadScenes,
  ...alkahfScenes,
  ...decodedScenes,
  ...sahabaScenes,
  ...ctaScenes,
  ...seaScenes,
  void: Void,
};

export const SCENE_NAMES = Object.keys(SCENES);

// One scene layer with crossfade in/out + slow push-in.
export const SceneLayer: React.FC<{ name?: string; theme: ThemePalette; data?: any }> = ({ name, theme, data }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fade = 9;
  const opacity = Math.min(
    interpolate(frame, [0, fade], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [durationInFrames - fade, durationInFrames], [1, 0], {
      extrapolateLeft: "clamp",
    })
  );
  const kb = interpolate(frame, [0, durationInFrames], [1.05, 1.13]);
  const Comp = SCENES[name ?? "void"] ?? Void;
  return (
    <AbsoluteFill style={{ opacity }}>
      <AbsoluteFill style={{ transform: `scale(${kb})` }}>
        <Comp theme={theme} data={data} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
