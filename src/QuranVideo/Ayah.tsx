import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Ayah as AyahType } from "./schema";
import { ThemePalette } from "./themes";
import { ARABIC_DISPLAY_FONT, TRANSLATION_FONT } from "./fonts";

// Small lead so a word lights up just as the reciter begins it.
const HIGHLIGHT_LEAD = 0.08;

export const AyahView: React.FC<{
  ayah: AyahType;
  theme: ThemePalette;
  durationInFrames: number;
  hiddenWords?: number[]; // indices of words to blank out (Hifz mode)
  repetitionLabel?: string; // e.g. "Repetition 2 / 4"
}> = ({ ayah, theme, durationInFrames, hiddenWords = [], repetitionLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps; // seconds within this ayah
  const hidden = new Set(hiddenWords);

  // Gentle fade in/out at the edges of the ayah's time on screen.
  const fadeIn = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 14, durationInFrames - 2],
    [1, 0],
    { extrapolateLeft: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  // Translation rises in shortly after the Arabic appears.
  const transReveal = spring({ frame: frame - 8, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "0 90px",
        opacity,
      }}
    >
      {repetitionLabel ? (
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontSize: 26,
            letterSpacing: 3,
            color: theme.accent,
            opacity: 0.85,
            marginBottom: 40,
            textTransform: "uppercase",
          }}
        >
          {repetitionLabel}
        </div>
      ) : null}
      <div
        dir="rtl"
        style={{
          fontFamily: ARABIC_DISPLAY_FONT,
          fontWeight: 700,
          fontSize: 96,
          lineHeight: 1.75,
          textAlign: "center",
          color: theme.arabicIdle,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 18px",
        }}
      >
        {ayah.words.map((word, i) => {
          const active = t >= word.start - HIGHLIGHT_LEAD && t < word.end;
          const sungProgress = interpolate(
            t,
            [word.start - HIGHLIGHT_LEAD, word.start + 0.12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const isHidden = hidden.has(i);
          return (
            <span
              key={i}
              style={{
                // Blanked words keep their footprint (transparent glyphs) so the
                // line never reflows; a tile + glow marks where the word is.
                color: isHidden ? "transparent" : active ? theme.arabicActive : theme.arabicIdle,
                background: isHidden
                  ? active
                    ? theme.arabicGlow
                    : `${theme.accent}22`
                  : "transparent",
                borderRadius: isHidden ? 14 : 0,
                boxShadow: isHidden && active ? `0 0 30px ${theme.arabicGlow}` : "none",
                textShadow:
                  !isHidden && active
                    ? `0 0 30px ${theme.arabicGlow}, 0 0 60px ${theme.arabicGlow}`
                    : "none",
                transform: `scale(${1 + sungProgress * 0.06})`,
                transition: "color 0.12s linear, background 0.12s linear",
                display: "inline-block",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 70,
          maxWidth: 880,
          fontFamily: TRANSLATION_FONT,
          fontSize: 40,
          lineHeight: 1.5,
          textAlign: "center",
          color: theme.translation,
          opacity: transReveal,
          transform: `translateY(${(1 - transReveal) * 24}px)`,
        }}
      >
        {ayah.translation}
      </div>

      <div
        style={{
          marginTop: 44,
          fontFamily: TRANSLATION_FONT,
          fontSize: 26,
          letterSpacing: 2,
          color: theme.accent,
          opacity: transReveal * 0.9,
        }}
      >
        {ayah.key}
      </div>
    </AbsoluteFill>
  );
};
