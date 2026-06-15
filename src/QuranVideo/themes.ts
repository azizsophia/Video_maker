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
  },
};
