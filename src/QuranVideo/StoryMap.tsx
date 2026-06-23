import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { ThemePalette } from "./themes";
import { TRANSLATION_FONT } from "./fonts";

// Real coordinates (lat/lon) so the geography is honest, not decorative.
type Place = { label: string; lat: number; lon: number };
const PLACES: Record<string, Place> = {
  makkah: { label: "Makkah", lat: 21.42, lon: 39.83 },
  medina: { label: "Madinah", lat: 24.47, lon: 39.61 },
  alula: { label: "AlUla (Dadan · Hegra)", lat: 26.62, lon: 37.92 },
  hegra: { label: "Al-Hijr · Hegra", lat: 26.79, lon: 37.95 },
  tabuk: { label: "Tabuk", lat: 28.38, lon: 36.57 },
  petra: { label: "Petra", lat: 30.33, lon: 35.44 },
};

type MapView = { title: string; pins: string[]; route?: string[] };
const VIEWS: Record<string, MapView> = {
  hijaz: {
    title: "The Hijaz · north-west Arabia",
    pins: ["makkah", "medina", "hegra", "tabuk"],
  },
  "tabuk-route": {
    title: "The road to Tabuk · 9 AH (630 CE)",
    pins: ["medina", "hegra", "tabuk"],
    route: ["medina", "hegra", "tabuk"],
  },
  "incense-road": {
    title: "The incense road · AlUla, the crossroads",
    pins: ["makkah", "medina", "alula", "petra"],
    route: ["makkah", "medina", "alula", "petra"],
  },
};

// Projection window over NW Arabia.
const LON_MIN = 34.5;
const LON_MAX = 41.5;
const LAT_MIN = 19.5;
const LAT_MAX = 30.5;
const BOX = { left: 140, right: 940, top: 320, bottom: 1480 };

const project = (p: Place) => ({
  x: BOX.left + ((p.lon - LON_MIN) / (LON_MAX - LON_MIN)) * (BOX.right - BOX.left),
  y: BOX.top + ((LAT_MAX - p.lat) / (LAT_MAX - LAT_MIN)) * (BOX.bottom - BOX.top),
});

// Animated schematic history map: pins drop in, a route draws on. Stylised on
// purpose (a labelled point map, not a fake coastline) so nothing is inaccurate.
export const StoryMap: React.FC<{ view: string; theme: ThemePalette }> = ({ view, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const def = VIEWS[view] ?? VIEWS.hijaz;

  const pins = def.pins.map((id) => ({ id, place: PLACES[id], pt: project(PLACES[id]) }));
  const routePts = (def.route ?? []).map((id) => project(PLACES[id]));
  let routeLen = 0;
  for (let i = 1; i < routePts.length; i++) {
    routeLen += Math.hypot(routePts[i].x - routePts[i - 1].x, routePts[i].y - routePts[i - 1].y);
  }
  const routeProgress = interpolate(frame, [14, Math.max(30, fps * 2.4)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dashOffset = routeLen * (1 - routeProgress);
  const routePath = routePts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const isLight = theme.background === "#f6efdf"; // noor theme
  const grid = isLight ? "rgba(120,95,45,0.16)" : "rgba(255,255,255,0.08)";
  const labelColor = isLight ? "#1c3a2b" : "#ffffff";

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 180,
          width: "100%",
          textAlign: "center",
          fontFamily: TRANSLATION_FONT,
          fontSize: 34,
          letterSpacing: 2,
          fontWeight: 700,
          color: theme.accent,
        }}
      >
        {def.title}
      </div>

      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const x = BOX.left + (i / 7) * (BOX.right - BOX.left);
          return <line key={`v${i}`} x1={x} y1={BOX.top} x2={x} y2={BOX.bottom} stroke={grid} strokeWidth={1} />;
        })}
        {Array.from({ length: 10 }).map((_, i) => {
          const y = BOX.top + (i / 9) * (BOX.bottom - BOX.top);
          return <line key={`h${i}`} x1={BOX.left} y1={y} x2={BOX.right} y2={y} stroke={grid} strokeWidth={1} />;
        })}

        {routePts.length > 1 ? (
          <path
            d={routePath}
            fill="none"
            stroke={theme.accent}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={routeLen}
            strokeDashoffset={dashOffset}
            opacity={0.92}
          />
        ) : null}

        {pins.map(({ id, pt }, i) => {
          const appear = spring({ frame: frame - 8 - i * 8, fps, config: { damping: 200 } });
          const r = 13 * appear;
          return (
            <g key={id} opacity={appear}>
              <circle cx={pt.x} cy={pt.y} r={r + 9} fill={theme.accent} opacity={0.18} />
              <circle cx={pt.x} cy={pt.y} r={r} fill={theme.accent} />
            </g>
          );
        })}
      </svg>

      {pins.map(({ id, place, pt }, i) => {
        const appear = spring({ frame: frame - 12 - i * 8, fps, config: { damping: 200 } });
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              left: pt.x + 24,
              top: pt.y - 20,
              fontFamily: TRANSLATION_FONT,
              fontSize: 30,
              fontWeight: 700,
              color: labelColor,
              opacity: appear,
              textShadow: isLight ? "none" : "0 2px 12px rgba(0,0,0,0.85)",
              transform: `translateY(${(1 - appear) * 8}px)`,
            }}
          >
            {place.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
