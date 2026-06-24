import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { StorySegment, StoryWord } from "./storySchema";
import { ThemePalette } from "./themes";
import { PLAYFAIR, CORMORANT, JOST } from "./luxFonts";
import { ARABIC_DISPLAY_FONT } from "./fonts";

const W = 1080;
const H = 1920;
const INK = "#163528";
const INK2 = "#2c5240";
const GOLD = "#9e7320";
const GOLD_GRAD = "linear-gradient(135deg,#946b1d,#eccd80 42%,#c79a3e 66%,#8c6720)";

const rand = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const GoldText: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <span
    style={{
      background: GOLD_GRAD,
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      ...style,
    }}
  >
    {children}
  </span>
);

// ── Slide chrome: ivory paper, texture, vignette, hairline gold frame + corner
// diamonds, kicker, footnote. Children (the diagram) get a slow ken-burns so
// every frame is always subtly moving.
export const Slide: React.FC<{
  kicker?: string;
  foot?: string;
  children: React.ReactNode;
}> = ({ kicker, foot, children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = durationInFrames > 1 ? frame / durationInFrames : 0;
  const zoom = 1 + 0.04 * t;
  const drift = Math.sin(frame * 0.012) * 6;
  const fade = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 36%, #faf5e9 0%, #efe4cd 100%)` }}>
      <AbsoluteFill
        style={{
          opacity: 0.45,
          backgroundImage: "radial-gradient(rgba(150,115,40,.06) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          transform: `translateX(${drift}px)`,
        }}
      />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px rgba(120,90,30,.22)" }} />

      {/* diagram, gently moving */}
      <AbsoluteFill style={{ opacity: fade, transform: `scale(${zoom})` }}>{children}</AbsoluteFill>

      {/* gold double frame */}
      <div style={{ position: "absolute", inset: 48, border: "2px solid rgba(158,115,32,.5)", borderRadius: 8 }}>
        <div style={{ position: "absolute", inset: 11, border: "1px solid rgba(158,115,32,.3)", borderRadius: 4 }} />
      </div>
      {[
        { top: 40, left: 40 },
        { top: 40, right: 40 },
        { bottom: 40, left: 40 },
        { bottom: 40, right: 40 },
      ].map((p, i) => (
        <div
          key={i}
          style={{ position: "absolute", width: 16, height: 16, background: GOLD_GRAD, transform: "rotate(45deg)", ...p }}
        />
      ))}

      {kicker ? (
        <div
          style={{
            position: "absolute",
            top: 280,
            width: "100%",
            textAlign: "center",
            fontFamily: JOST,
            fontWeight: 500,
            letterSpacing: 9,
            fontSize: 29,
            opacity: fade,
          }}
        >
          <GoldText>{kicker}</GoldText>
        </div>
      ) : null}
      {foot ? (
        <div
          style={{
            position: "absolute",
            top: kicker ? 346 : 280,
            width: "100%",
            textAlign: "center",
            fontFamily: CORMORANT,
            fontStyle: "italic",
            fontSize: 32,
            color: INK2,
            opacity: fade * 0.9,
          }}
        >
          {foot}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ── Word-by-word caption (ink on ivory; active word gold) ─────────────────────
const toLines = (words: StoryWord[], per = 4) => {
  const out: { words: StoryWord[]; start: number }[] = [];
  for (let i = 0; i < words.length; i += per) {
    const c = words.slice(i, i + per);
    if (c.length) out.push({ words: c, start: c[0].start });
  }
  return out;
};

export const InkCaption: React.FC<{ words?: StoryWord[]; align?: "center" | "bottom" }> = ({
  words = [],
  align = "bottom",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lines = toLines(words);
  let idx = 0;
  for (let i = 0; i < lines.length; i++) if (t >= lines[i].start - 0.18) idx = i;
  const line = lines[idx];
  return (
    <AbsoluteFill
      style={{
        justifyContent: align === "center" ? "center" : "flex-end",
        alignItems: "center",
        padding: align === "center" ? "0 120px" : "0 120px 560px",
      }}
    >
      <div
        style={{
          fontFamily: PLAYFAIR,
          fontWeight: 900,
          fontSize: align === "center" ? 92 : 72,
          lineHeight: 1.14,
          textAlign: "center",
          color: INK,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "6px 18px",
        }}
      >
        {line?.words.map((w, i) => {
          const shown = t >= w.start - 0.12;
          const active = t >= w.start - 0.04 && t < w.end + 0.1;
          const pop = spring({ frame: frame - Math.round((w.start - 0.04) * fps), fps, config: { damping: 16, stiffness: 200 } });
          const rise = shown ? pop : 0;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: active ? GOLD : INK,
                opacity: shown ? 1 : 0,
                transform: `translateY(${(1 - rise) * 26}px)`,
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Chronology timeline (a real graph): axis, gridlines, era bars grow in ─────
const ERAS = [
  { id: "dadan", x: 210, y: 620, w: 206, label: "Dadan", date: "9th–6th c. BC", green: "#1f4632" },
  { id: "lihyan", x: 416, y: 724, w: 232, label: "Lihyan", date: "5th–2nd c. BC", green: "#2c5a40" },
  { id: "nabataean", x: 648, y: 828, w: 186, label: "Nabataeans", date: "100 BC – 106 AD", green: "#3a7152" },
];

const Chronology: React.FC<{ highlight?: string }> = ({ highlight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const axis = interpolate(frame, [4, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const shimmer = 0.7 + 0.3 * Math.sin(frame * 0.12);
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <g stroke="rgba(158,115,32,.22)" strokeWidth={1}>
          {[150, 334, 518, 702, 886].map((x, i) => (
            <line key={i} x1={x} y1={560} x2={x} y2={560 + (1180 - 560) * axis} />
          ))}
        </g>
        <line x1={150} y1={1180} x2={150 + 780 * axis} y2={1180} stroke={INK} strokeWidth={3} />
        <g textAnchor="middle" fill={INK2} fontFamily={JOST} fontSize={24} opacity={axis}>
          <text x={150} y={1230}>1000 BC</text>
          <text x={426} y={1230}>500 BC</text>
          <text x={702} y={1230}>1 AD</text>
          <text x={886} y={1230}>300 AD</text>
        </g>
        {ERAS.map((e, i) => {
          const grow = spring({ frame: frame - (18 + i * 10), fps, config: { damping: 20 } });
          const on = highlight === e.id;
          const fill = on ? "#c79a3e" : e.green;
          return (
            <g key={e.id} opacity={grow}>
              <text x={e.x} y={e.y - 12} fontFamily={JOST} fontSize={24} fill={INK2}>
                {e.date}
              </text>
              <rect x={e.x} y={e.y} width={e.w * grow} height={64} rx={10} fill={fill} opacity={on ? shimmer : 1} />
              <text x={e.x + 14} y={e.y + 44} fontFamily={PLAYFAIR} fontWeight={700} fontSize={38} fill={on ? "#3a2a08" : "#f7f1e2"}>
                {e.label}
              </text>
            </g>
          );
        })}
        {/* Thamud — Qur'anic marker */}
        <g opacity={interpolate(frame, [40, 58], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <line x1={150} y1={980} x2={320} y2={980} stroke={GOLD} strokeWidth={3} strokeDasharray="8 8" />
          <rect x={150} y={956} width={16} height={16} transform="rotate(45 158 964)" fill={GOLD} />
          <text x={190} y={994} fontFamily={PLAYFAIR} fontWeight={700} fontSize={38} fill={INK}>Thamud</text>
          <text x={150} y={1024} fontFamily={JOST} fontSize={24} fill={INK2}>Qur&apos;anic · al-Hijr (dating debated)</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ── Annotated map (scale bar, north arrow, callout, drawing route, marker) ────
const NODES = [
  { x: 300, y: 1180, label: "Makkah", r: 12, big: false },
  { x: 380, y: 940, label: "Madinah", r: 12, big: false },
  { x: 520, y: 720, label: "AlUla · Hegra", r: 16, big: true },
  { x: 470, y: 500, label: "Petra", r: 12, big: false },
];
const pointAlong = (pts: { x: number; y: number }[], f: number) => {
  const segs = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  const total = segs.reduce((a, b) => a + b, 0);
  let target = total * Math.max(0, Math.min(1, f));
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i]) {
      const r = segs[i] === 0 ? 0 : target / segs[i];
      return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * r, y: pts[i].y + (pts[i + 1].y - pts[i].y) * r };
    }
    target -= segs[i];
  }
  return pts[pts.length - 1];
};

const MapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [6, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const travel = ((frame % 110) / 110); // continuous loop
  const m = pointAlong([...NODES].reverse().map((n) => ({ x: n.x, y: n.y })), travel);
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <g transform="translate(840,470)">
          <line x1={0} y1={40} x2={0} y2={-10} stroke={INK} strokeWidth={3} />
          <path d="M-10,-2 L0,-22 L10,-2 z" fill={INK} />
          <text x={-8} y={62} fontFamily={JOST} fontSize={24} fill={INK2}>N</text>
        </g>
        <path
          d="M300,1180 L380,940 L520,720 L470,500"
          fill="none"
          stroke={GOLD}
          strokeWidth={4}
          strokeDasharray="2 14"
          strokeLinecap="round"
          pathLength={1}
          strokeDashoffset={1 - draw}
          style={{ strokeDasharray: 1 }}
        />
        <g>
          <circle cx={m.x} cy={m.y} r={20} fill={GOLD} opacity={0.2} />
          <circle cx={m.x} cy={m.y} r={9} fill="#fff" stroke={GOLD} strokeWidth={4} />
        </g>
        {NODES.map((n, i) => {
          const op = interpolate(frame, [10 + i * 7, 24 + i * 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <g key={i} opacity={op}>
              <circle cx={n.x} cy={n.y} r={n.r} fill={n.big ? GOLD : INK} />
              <text x={n.x + 26} y={n.y + 10} fontFamily={PLAYFAIR} fontWeight={700} fontSize={n.big ? 44 : 40} fill={INK}>
                {n.label}
              </text>
            </g>
          );
        })}
        <g opacity={interpolate(frame, [30, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
          <rect x={150} y={560} width={360} height={120} rx={12} fill="rgba(255,253,247,.78)" stroke={GOLD} />
          <text x={172} y={606} fontFamily={PLAYFAIR} fontWeight={700} fontSize={30} fill={INK}>Frankincense &amp; myrrh</text>
          <text x={172} y={648} fontFamily={JOST} fontSize={26} fill={INK2}>carried N → from south Arabia</text>
        </g>
        <g transform="translate(630,1250)" opacity={draw}>
          <line x1={0} y1={0} x2={200} y2={0} stroke={INK} strokeWidth={4} />
          <line x1={0} y1={-8} x2={0} y2={8} stroke={INK} strokeWidth={4} />
          <line x1={200} y1={-8} x2={200} y2={8} stroke={INK} strokeWidth={4} />
          <text x={100} y={40} textAnchor="middle" fontFamily={JOST} fontSize={24} fill={INK2}>≈ 300 km</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ── Nabataean tomb facade, revealed by a top-down "drawing" wipe ──────────────
const Facade: React.FC = () => {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, [6, 44], [450, 1380], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = 0.16 + 0.12 * (0.5 + 0.5 * Math.sin(frame * 0.1));
  return (
    <AbsoluteFill>
      <svg width={W} height={H}>
        <defs>
          <radialGradient id="halo2" cx="50%" cy="42%" r="55%">
            <stop offset="0%" stopColor="#e7c873" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#e7c873" stopOpacity={0} />
          </radialGradient>
          <clipPath id="wipe">
            <rect x={300} y={440} width={480} height={wipe - 440} />
          </clipPath>
        </defs>
        <ellipse cx={540} cy={840} rx={380} ry={440} fill="url(#halo2)" />
        <g clipPath="url(#wipe)" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" fill="none">
          <rect x={334} y={450} width={412} height={930} rx={46} fill="#efe4cd" stroke="rgba(22,53,40,.22)" />
          <path d="M378,604 L378,560 L414,560 L414,528 L450,528 L450,496 L486,496 L486,470 L518,470 L518,604 Z" fill="#e7d6ad" />
          <path d="M702,604 L702,560 L666,560 L666,528 L630,528 L630,496 L594,496 L594,470 L562,470 L562,604 Z" fill="#e7d6ad" />
          <rect x={360} y={604} width={360} height={28} fill="#e7d6ad" />
          <line x1={360} y1={664} x2={720} y2={664} />
          <rect x={372} y={632} width={48} height={32} fill="#e7d6ad" />
          <rect x={385} y={664} width={22} height={648} fill="#efe4cd" />
          <rect x={660} y={632} width={48} height={32} fill="#e7d6ad" />
          <rect x={673} y={664} width={22} height={648} fill="#efe4cd" />
          <circle cx={540} cy={726} r={26} stroke={GOLD} />
          <circle cx={540} cy={726} r={9} fill="#c79a3e" stroke="none" />
          <rect x={468} y={772} width={144} height={468} rx={4} fill="#e3d2a8" />
          <rect x={492} y={804} width={96} height={436} rx={3} stroke={GOLD} fill="#c79a3e" fillOpacity={glow} />
          <rect x={468} y={746} width={144} height={26} fill="#e7d6ad" />
          <line x1={332} y1={1312} x2={722} y2={1312} />
          <line x1={314} y1={1350} x2={740} y2={1350} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ── Statement beat: chrome + drifting gold motes + a drawn rule (caption is
// rendered centred by InkCaption) ────────────────────────────────────────────
const Statement: React.FC = () => {
  const frame = useCurrentFrame();
  const rule = interpolate(frame, [8, 30], [0, 300], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      {Array.from({ length: 16 }).map((_, i) => {
        const x = (rand(i) * W + frame * (0.25 + rand(i + 4) * 0.4)) % W;
        const y = 300 + rand(i + 2) * 1200 + Math.sin(frame * 0.02 + i) * 14;
        return (
          <div
            key={i}
            style={{ position: "absolute", left: x, top: y, width: 5, height: 5, borderRadius: "50%", background: GOLD, opacity: 0.18 + 0.25 * rand(i + 7) }}
          />
        );
      })}
      <div style={{ position: "absolute", top: 1330, left: W / 2 - rule / 2, width: rule, height: 2, background: "linear-gradient(90deg,transparent,#b8902f,transparent)" }} />
    </AbsoluteFill>
  );
};

// ── Qur'an pull-quote card (Arabic shown, never recited; English under it) ────
const QuoteScene: React.FC<{ arabic?: string; words?: StoryWord[] }> = ({ arabic, words = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const card = spring({ frame, fps, config: { damping: 200 } });
  const flourish = interpolate(frame, [18, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const t = frame / fps;
  const glow = 0.5 + 0.5 * Math.sin(frame * 0.06);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 96px" }}>
      <div
        style={{
          width: "100%",
          padding: "78px 60px 64px",
          background: "rgba(255,253,247,.62)",
          border: "1.5px solid rgba(158,115,32,.5)",
          borderRadius: 20,
          boxShadow: "0 30px 70px rgba(60,45,15,.18)",
          opacity: card,
          transform: `translateY(${(1 - card) * 24}px)`,
        }}
      >
        <div
          dir="rtl"
          style={{
            fontFamily: ARABIC_DISPLAY_FONT,
            fontWeight: 700,
            fontSize: 96,
            lineHeight: 1.85,
            textAlign: "center",
            color: INK,
            textShadow: `0 0 ${20 + 18 * glow}px rgba(199,154,62,.35)`,
          }}
        >
          {arabic}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, margin: "44px 0" }}>
          <div style={{ height: 1.5, width: 150 * flourish, background: "linear-gradient(90deg,transparent,#b8902f)" }} />
          <div style={{ width: 16, height: 16, transform: "rotate(45deg)", background: GOLD_GRAD, opacity: flourish }} />
          <div style={{ height: 1.5, width: 150 * flourish, background: "linear-gradient(90deg,#b8902f,transparent)" }} />
        </div>
        <div
          style={{
            fontFamily: CORMORANT,
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 58,
            lineHeight: 1.3,
            textAlign: "center",
            color: INK,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2px 14px",
          }}
        >
          {words.map((w, i) => (
            <span key={i} style={{ opacity: t >= w.start - 0.12 ? 1 : 0.25, color: t >= w.start - 0.05 && t < w.end + 0.1 ? GOLD : INK }}>
              {w.text}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const InstitutionalScene: React.FC<{ seg: StorySegment; theme: ThemePalette }> = ({ seg }) => {
  if (seg.arabic) return <QuoteScene arabic={seg.arabic} words={seg.words} />;
  switch (seg.scene) {
    case "chronology":
      return <Chronology highlight={seg.highlight} />;
    case "facade":
      return <Facade />;
    case "map":
      return <MapScene />;
    case "statement":
    default:
      return <Statement />;
  }
};
