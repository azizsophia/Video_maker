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
export type Place = { label: string; lat: number; lon: number };
export const PLACES: Record<string, Place> = {
  makkah: { label: "Makkah", lat: 21.42, lon: 39.83 },
  medina: { label: "Madinah", lat: 24.47, lon: 39.61 },
  alula: { label: "AlUla (Dadan · Hegra)", lat: 26.62, lon: 37.92 },
  hegra: { label: "Al-Hijr · Hegra", lat: 26.79, lon: 37.95 },
  tabuk: { label: "Tabuk", lat: 28.38, lon: 36.57 },
  petra: { label: "Petra", lat: 30.33, lon: 35.44 },
  busra: { label: "Busra", lat: 32.52, lon: 36.48 },
  // Euphrates river: source in eastern Turkey, through Syria and Iraq, to the Gulf.
  eupSource: { label: "Source · E. Turkey", lat: 38.8, lon: 38.7 },
  eupSyria: { label: "Syria", lat: 35.95, lon: 39.0 },
  eupIraq: { label: "Iraq", lat: 32.5, lon: 44.4 },
  eupGulf: { label: "Persian Gulf", lat: 30.4, lon: 47.9 },
};

export type Bounds = { lonMin: number; lonMax: number; latMin: number; latMax: number };
export type MapView = { title: string; subtitle?: string; pins: string[]; route?: string[]; bounds?: Bounds; chip?: string };
export const VIEWS: Record<string, MapView> = {
  // Madinah -> Busra: the fire's glow was recorded reaching this far north, into
  // southern Syria. Window widened north to include the Levant.
  "medina-busra": {
    title: "",
    pins: ["medina", "busra"],
    route: ["medina", "busra"],
    bounds: { lonMin: 33.5, lonMax: 42.5, latMin: 21, latMax: 34 },
    chip: "≈ 1,300 km",
  },
  // The Euphrates, source to sea: the river the hadith names.
  euphrates: {
    title: "",
    pins: ["eupSource", "eupSyria", "eupIraq", "eupGulf"],
    route: ["eupSource", "eupSyria", "eupIraq", "eupGulf"],
    bounds: { lonMin: 36.5, lonMax: 49.5, latMin: 28.5, latMax: 40 },
  },
  hijaz: {
    title: "AL-ULA, NORTH-WEST ARABIA",
    subtitle: "One valley — beside Islam's holiest cities",
    pins: ["makkah", "medina", "hegra", "tabuk"],
  },
  "tabuk-route": {
    title: "THE ROAD TO TABUK · 9 AH",
    subtitle: "The army's path ran straight through the ruins",
    pins: ["medina", "hegra", "tabuk"],
    route: ["medina", "hegra", "tabuk"],
  },
  "incense-road": {
    title: "THE INCENSE ROAD",
    subtitle: "The richest trade route of the ancient world ran through here",
    pins: ["makkah", "medina", "alula", "petra"],
    route: ["makkah", "medina", "alula", "petra"],
  },
};

// Point at a fraction (0..1) along a polyline.
const pointAlong = (pts: { x: number; y: number }[], frac: number) => {
  if (pts.length < 2) return pts[0] ?? { x: 0, y: 0 };
  const segs = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  const total = segs.reduce((a, b) => a + b, 0);
  let target = total * Math.max(0, Math.min(1, frac));
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i]) {
      const r = segs[i] === 0 ? 0 : target / segs[i];
      return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * r, y: pts[i].y + (pts[i + 1].y - pts[i].y) * r };
    }
    target -= segs[i];
  }
  return pts[pts.length - 1];
};

// Default projection window over NW Arabia (a view may override via bounds).
export const DEFAULT_BOUNDS: Bounds = { lonMin: 34.5, lonMax: 41.5, latMin: 19.5, latMax: 30.5 };
const BOX = { left: 140, right: 940, top: 320, bottom: 1480 };

const makeProject = (b: Bounds) => (p: Place) => ({
  x: BOX.left + ((p.lon - b.lonMin) / (b.lonMax - b.lonMin)) * (BOX.right - BOX.left),
  y: BOX.top + ((b.latMax - p.lat) / (b.latMax - b.latMin)) * (BOX.bottom - BOX.top),
});

// Animated schematic history map: pins drop in, a route draws on. Stylised on
// purpose (a labelled point map, not a fake coastline) so nothing is inaccurate.
export const StoryMap: React.FC<{ view: string; theme: ThemePalette }> = ({ view, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const def = VIEWS[view] ?? VIEWS.hijaz;
  const project = makeProject(def.bounds ?? DEFAULT_BOUNDS);

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
      <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", padding: "0 80px", display: def.title || def.subtitle ? "block" : "none" }}>
        {def.title ? (
        <div
          style={{
            display: "inline-block",
            fontFamily: TRANSLATION_FONT,
            fontSize: 38,
            letterSpacing: 3,
            fontWeight: 900,
            color: "#0b0b0b",
            background: theme.accent,
            padding: "8px 24px",
            borderRadius: 14,
          }}
        >
          {def.title}
        </div>
        ) : null}
        {def.subtitle ? (
          <div
            style={{
              marginTop: 18,
              fontFamily: TRANSLATION_FONT,
              fontSize: 30,
              lineHeight: 1.3,
              fontWeight: 600,
              color: "#ffffff",
              textShadow: "0 3px 18px rgba(0,0,0,0.85)",
            }}
          >
            {def.subtitle}
          </div>
        ) : null}
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

        {routePts.length > 1 ? (
          (() => {
            const m = pointAlong(routePts, routeProgress);
            return (
              <g>
                <circle cx={m.x} cy={m.y} r={26} fill={theme.accent} opacity={0.22} />
                <circle cx={m.x} cy={m.y} r={11} fill="#ffffff" stroke={theme.accent} strokeWidth={4} />
              </g>
            );
          })()
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
