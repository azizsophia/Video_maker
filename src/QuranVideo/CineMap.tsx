import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { PLACES, VIEWS, DEFAULT_BOUNDS, Bounds } from "./StoryMap";
import { TRANSLATION_FONT } from "./fonts";

const GOLD = "#e7c873";
const CREAM = "#f7f1e2";

// Cinematic atlas map: a curved glowing route with a travelling light, pulsing
// city markers with leader-line labels (placed clear of the bottom caption), a
// faint graticule + sea/land tint, a compass, drifting dust and a slow drift.
// Pins are at real lat/lon (honest); the land/sea tint is deliberately abstract.
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

// Projection box sits in the upper-middle so the bottom third stays free for the
// narration caption (no overlap with labels).
const BOX = { left: 200, right: 880, top: 360, bottom: 1120 };
const proj = (b: Bounds, lon: number, lat: number) => ({
  x: BOX.left + ((lon - b.lonMin) / (b.lonMax - b.lonMin)) * (BOX.right - BOX.left),
  y: BOX.top + ((b.latMax - lat) / (b.latMax - b.latMin)) * (BOX.bottom - BOX.top),
});

export const CineMap: React.FC<{ view: string }> = ({ view }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const def = VIEWS[view] ?? VIEWS["medina-busra"];
  const b = def.bounds ?? DEFAULT_BOUNDS;

  const ids = def.route && def.route.length >= 2 ? def.route : def.pins;
  const pts = ids.map((id) => ({ id, place: PLACES[id], ...proj(b, PLACES[id].lon, PLACES[id].lat) }));
  const a = pts[0];
  const z = pts[pts.length - 1];

  // Curved (great-circle-ish) route: a quadratic bezier bowed to the west.
  const mx = (a.x + z.x) / 2, my = (a.y + z.y) / 2;
  const dx = z.x - a.x, dy = z.y - a.y, len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len; // perpendicular
  const bow = 120;
  const cx = mx + nx * bow, cy = my + ny * bow;
  const bez = (t: number) => {
    const u = 1 - t;
    return { x: u * u * a.x + 2 * u * t * cx + t * t * z.x, y: u * u * a.y + 2 * u * t * cy + t * t * z.y };
  };

  // Slow drift (Ken Burns) of the whole map.
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const driftScale = 1.04 + 0.05 * p;
  const driftX = interpolate(p, [0, 1], [10, -10]);

  // Route draw + travelling light.
  const draw = clamp01(interpolate(frame, [18, 78], [0, 1]));
  const head = bez(draw);
  const routeMid = bez(0.5);

  // Build the partially-drawn path by sampling.
  const N = 60;
  const path = Array.from({ length: N + 1 }, (_, i) => {
    const t = (i / N) * draw;
    const q = bez(t);
    return `${i === 0 ? "M" : "L"} ${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
  }).join(" ");

  // Drifting gold dust.
  const specks = [[230, 520, 5], [840, 430, 4], [300, 980, 6], [780, 1040, 4], [180, 760, 4], [900, 760, 5], [520, 360, 4]];

  return (
    <AbsoluteFill>
      {/* atmosphere */}
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, rgba(31,64,44,0.65), rgba(8,16,12,0.96) 72%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 36%, rgba(231,200,115,0.14), transparent 55%)" }} />

      <AbsoluteFill style={{ transform: `scale(${driftScale}) translateX(${driftX}px)` }}>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#caa24a" />
              <stop offset="100%" stopColor="#f3e6c0" />
            </linearGradient>
            <radialGradient id="land" cx="55%" cy="42%" r="60%">
              <stop offset="0%" stopColor="rgba(86,116,84,0.42)" />
              <stop offset="100%" stopColor="rgba(40,64,46,0.05)" />
            </radialGradient>
            <filter id="soft"><feGaussianBlur stdDeviation="18" /></filter>
          </defs>

          {/* abstract land mass tint (stylised, not a precise coastline) */}
          <ellipse cx={620} cy={760} rx={360} ry={520} fill="url(#land)" filter="url(#soft)" />
          <ellipse cx={330} cy={520} rx={150} ry={260} fill="rgba(60,92,70,0.18)" filter="url(#soft)" />

          {/* faint curved graticule */}
          {Array.from({ length: 5 }).map((_, i) => {
            const yy = BOX.top + (i / 4) * (BOX.bottom - BOX.top);
            return <path key={`lat${i}`} d={`M ${BOX.left - 40} ${yy + 30} Q 540 ${yy - 30} ${BOX.right + 40} ${yy + 30}`} fill="none" stroke="rgba(231,200,115,0.10)" strokeWidth={1} />;
          })}
          {Array.from({ length: 5 }).map((_, i) => {
            const xx = BOX.left + (i / 4) * (BOX.right - BOX.left);
            return <path key={`lon${i}`} d={`M ${xx - 20} ${BOX.top - 40} Q ${xx + 30} 740 ${xx - 20} ${BOX.bottom + 40}`} fill="none" stroke="rgba(231,200,115,0.08)" strokeWidth={1} />;
          })}

          {/* route glow + line */}
          <path d={path} fill="none" stroke={GOLD} strokeWidth={16} strokeLinecap="round" opacity={0.18} filter="url(#soft)" />
          <path d={path} fill="none" stroke="url(#routeGrad)" strokeWidth={5} strokeLinecap="round" />

          {/* travelling light at the head of the route */}
          {draw > 0 && draw < 1 ? (
            <g>
              <circle cx={head.x} cy={head.y} r={22} fill={GOLD} opacity={0.25} />
              <circle cx={head.x} cy={head.y} r={7} fill="#fff7e0" />
            </g>
          ) : null}

          {/* city markers: concentric pulse + dot */}
          {pts.map((pt, i) => {
            const appear = spring({ frame: frame - 6 - i * 26, fps, config: { damping: 200 } });
            const pulse = 1 + 0.5 * (0.5 + 0.5 * Math.sin((frame - i * 10) / 14));
            return (
              <g key={pt.id} opacity={appear}>
                <circle cx={pt.x} cy={pt.y} r={16 * pulse + 10} fill="none" stroke={GOLD} strokeWidth={1.5} opacity={0.35} />
                <circle cx={pt.x} cy={pt.y} r={20} fill={GOLD} opacity={0.16} />
                <circle cx={pt.x} cy={pt.y} r={8 * appear} fill="#fff7e0" stroke={GOLD} strokeWidth={3} />
              </g>
            );
          })}

          {/* compass, top-right */}
          <g transform="translate(905,300)" opacity={0.7}>
            <circle r={34} fill="none" stroke="rgba(231,200,115,0.4)" strokeWidth={1.5} />
            <path d="M 0 -30 L 7 0 L 0 8 L -7 0 Z" fill={GOLD} />
            <path d="M 0 30 L 7 0 L 0 -8 L -7 0 Z" fill="rgba(231,200,115,0.3)" />
          </g>
        </svg>

        {/* leader-line labels — placed ABOVE each pin so they never hit the caption */}
        {pts.map((pt, i) => {
          const appear = spring({ frame: frame - 12 - i * 26, fps, config: { damping: 200 } });
          const left = pt.x < 540; // bias label outward
          return (
            <div key={pt.id} style={{
              position: "absolute", left: pt.x + (left ? -250 : 26), top: pt.y - 78,
              width: 240, textAlign: left ? "right" : "left",
              opacity: appear, transform: `translateY(${(1 - appear) * 8}px)`,
            }}>
              <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 17, letterSpacing: 4, color: GOLD, marginBottom: 2 }}>
                {pt.id === ids[0] ? "FROM" : "SEEN AS FAR AS"}
              </div>
              <div style={{ fontFamily: TRANSLATION_FONT, fontWeight: 700, fontSize: 40, color: CREAM, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
                {pt.place.label}
              </div>
            </div>
          );
        })}

        {/* distance chip near the route midpoint */}
        <div style={{
          position: "absolute", left: routeMid.x - 110, top: routeMid.y - 24, width: 220, textAlign: "center",
          opacity: clamp01(interpolate(frame, [70, 92], [0, 1])),
        }}>
          <span style={{ fontFamily: TRANSLATION_FONT, fontSize: 24, letterSpacing: 2, fontWeight: 600, color: "#0b140f", background: GOLD, padding: "6px 16px", borderRadius: 20 }}>
            ≈ 1,300 km
          </span>
        </div>
      </AbsoluteFill>

      {/* drifting dust */}
      {specks.map(([x, y, r], i) => {
        const dy = Math.sin(frame / 30 + i) * 14;
        const tw = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(frame / 17 + i * 2));
        return <div key={i} style={{ position: "absolute", left: x, top: y + dy, width: r, height: r, borderRadius: r, background: GOLD, opacity: tw, filter: "blur(1px)", boxShadow: `0 0 ${r * 2}px ${GOLD}` }} />;
      })}

      {/* vignette */}
      <AbsoluteFill style={{ boxShadow: "inset 0 0 320px rgba(0,0,0,0.6)" }} />
    </AbsoluteFill>
  );
};
