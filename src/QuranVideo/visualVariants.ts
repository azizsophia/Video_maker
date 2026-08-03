// Per-video visual variation.
//
// The old Background rendered ONE motif (a rosette) with ONE motion signature,
// so every render looked identical apart from its color theme — a "mass-
// produced / templated" signal that trips TikTok's Creator Rewards low-quality
// flag (see docs/CREATOR_REWARDS.md). This picks a distinct look per video:
// a different geometric motif + motion signature + particle behavior.
//
// Selection is DETERMINISTIC: the same story/surah always renders the same
// look (stable across re-renders — important for Remotion), but different
// stories look different. An explicit `visual` prop can pin a specific look.
//
// Everything here stays GPU-free (strokes, fills, transforms, opacity only) so
// it rasterizes cheaply on CI runners without a GPU, per Background.tsx.

export type MotifKind = "rosette" | "khatam" | "arcs" | "hex" | "waves" | "diamond";
export type ParticleStyle = "rise" | "fall" | "drift" | "twinkle";

export type VisualVariant = {
  name: string;
  motif: MotifKind;
  // Motion signature applied to the motif layer.
  zoomFrom: number;
  zoomTo: number;
  rotate: number; // total degrees over the video (can be negative)
  particles: ParticleStyle;
};

// A small, hand-tuned set so each pick reads as a deliberate, distinct look
// rather than random noise. Order is stable — do not reorder without care, as
// the hash below indexes into it.
export const VISUAL_VARIANTS: VisualVariant[] = [
  { name: "rosette", motif: "rosette", zoomFrom: 1.08, zoomTo: 1.22, rotate: 6, particles: "rise" },
  { name: "khatam", motif: "khatam", zoomFrom: 1.2, zoomTo: 1.06, rotate: -5, particles: "twinkle" },
  { name: "arcs", motif: "arcs", zoomFrom: 1.05, zoomTo: 1.16, rotate: 2, particles: "drift" },
  { name: "hex", motif: "hex", zoomFrom: 1.1, zoomTo: 1.24, rotate: 0, particles: "fall" },
  { name: "waves", motif: "waves", zoomFrom: 1.04, zoomTo: 1.12, rotate: -2, particles: "twinkle" },
  { name: "diamond", motif: "diamond", zoomFrom: 1.12, zoomTo: 1.26, rotate: 4, particles: "rise" },
];

// Cheap, stable string hash (FNV-1a). No Math.random / Date — Remotion renders
// must be deterministic.
export const hashSeed = (seed: string): number => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
};

// Pick a variant. An explicit name (from a story's `visual` field) wins, unless
// it's absent / "auto" / unknown, in which case the seed selects one.
export const pickVariant = (seed: string, explicit?: string): VisualVariant => {
  if (explicit && explicit !== "auto") {
    const found = VISUAL_VARIANTS.find((v) => v.name === explicit);
    if (found) return found;
  }
  const idx = hashSeed(seed || "ketabi") % VISUAL_VARIANTS.length;
  return VISUAL_VARIANTS[idx];
};
