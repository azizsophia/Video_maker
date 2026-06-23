import { z } from "zod";
import { themeSchema } from "./schema";

export type ThemePalette = {
  background: string; // base background color
  gradientFrom: string;
  gradientTo: string;
  patternColor: string; // geometric pattern stroke
  arabicIdle: string;
  arabicActive: string;
  arabicGlow: string;
  translation: string;
  accent: string;
  vignette: string; // edge vignette color (dark for dark themes, soft for light)
};

export const themes: Record<z.infer<typeof themeSchema>, ThemePalette> = {
  midnight: {
    background: "#060b14",
    gradientFrom: "#0a1626",
    gradientTo: "#020407",
    patternColor: "rgba(120, 170, 220, 0.06)",
    arabicIdle: "rgba(220, 232, 245, 0.45)",
    arabicActive: "#f7fbff",
    arabicGlow: "rgba(120, 200, 255, 0.55)",
    translation: "rgba(210, 222, 238, 0.85)",
    accent: "#7fd1ff",
    vignette: "rgba(0,0,0,0.55)",
  },
  emerald: {
    background: "#04110c",
    gradientFrom: "#0a2419",
    gradientTo: "#020806",
    patternColor: "rgba(120, 220, 170, 0.06)",
    arabicIdle: "rgba(220, 245, 232, 0.45)",
    arabicActive: "#f3fff8",
    arabicGlow: "rgba(110, 240, 180, 0.5)",
    translation: "rgba(210, 238, 224, 0.85)",
    accent: "#6ef0b4",
    vignette: "rgba(0,0,0,0.55)",
  },
  sand: {
    background: "#13100a",
    gradientFrom: "#241d0f",
    gradientTo: "#0a0704",
    patternColor: "rgba(220, 190, 120, 0.07)",
    arabicIdle: "rgba(245, 238, 220, 0.45)",
    arabicActive: "#fffaf0",
    arabicGlow: "rgba(240, 205, 120, 0.5)",
    translation: "rgba(238, 230, 210, 0.85)",
    accent: "#f0cd78",
    vignette: "rgba(0,0,0,0.55)",
  },
  // Brand theme — the website's palette: deep ink-green + gold + cream.
  // Dark/cinematic for story videos, but on-brand (no blue).
  ketabi: {
    background: "#0c1c14",
    gradientFrom: "#15301f",
    gradientTo: "#050d09",
    patternColor: "rgba(199, 154, 62, 0.12)",
    arabicIdle: "rgba(244, 236, 216, 0.45)",
    arabicActive: "#f6efdc",
    arabicGlow: "rgba(199, 154, 62, 0.55)",
    translation: "rgba(244, 236, 216, 0.9)",
    accent: "#cda24a",
    vignette: "rgba(0,0,0,0.55)",
  },
  // Light "noor" theme — cream paper, deep ink-green Arabic, gold accents.
  // Stands out on a feed full of dark Quran videos.
  noor: {
    background: "#f6efdf",
    gradientFrom: "#fcf7ec",
    gradientTo: "#ece0c8",
    patternColor: "rgba(120, 95, 45, 0.10)",
    arabicIdle: "rgba(38, 64, 50, 0.42)",
    arabicActive: "#1c3a2b",
    arabicGlow: "rgba(193, 150, 70, 0.45)",
    translation: "rgba(54, 60, 50, 0.88)",
    accent: "#a9792b",
    vignette: "rgba(120, 95, 50, 0.18)",
  },
};
