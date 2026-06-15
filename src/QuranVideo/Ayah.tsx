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
import { tajweedColor } from "./tajweed";
import { Reveal } from "./hifz";
import { ARABIC_DISPLAY_FONT, TRANSLATION_FONT } from "./fonts";

// Small lead so a word lights up just as the reciter begins it.
const HIGHLIGHT_LEAD = 0.08;
// In "from memory" mode, reveal the whole ayah this many seconds before the end.
const MEMORY_REVEAL = 1.3;

export const AyahView: React.FC<{
  ayah: AyahType;
  theme: ThemePalette;
  durationInFrames: number;
  reveal?: Reveal; // Hifz reveal behaviour (undefined = always shown)
  repetitionLabel?: string; // e.g. "Recall · 2 / 4"
  showTajweed?: boolean; // color letters by tajweed rule
  showTransliteration?: boolean; // romanized pronunciation line
}> = ({
  ayah,
  theme,
  durationInFrames,
  reveal,
  repetitionLabel,
  showTajweed = false,
  showTransliteration = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps; // seconds within this ayah
  const total = durationInFrames / fps;
  const lastEnd = ayah.words.reduce((m, w) => Math.max(m, w.end), 0) || total;

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

  // How far through the recitation we are (karaoke progress bar).
  const progress = interpolate(t, [0, lastEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Per-word reveal state for the current time.
  const wordState = (word: AyahType["words"][number]) => {
    const active = t >= word.start - HIGHLIGHT_LEAD && t < word.end;
    let revealAt = -Infinity; // when the word becomes visible (seconds)
    if (!reveal || reveal.mode === "always") revealAt = -Infinity;
    else if (reveal.mode === "afterWord") revealAt = word.end + reveal.delay;
    else revealAt = total - MEMORY_REVEAL; // "memory": all reveal near the end
    const revealProg = interpolate(t, [revealAt, revealAt + 0.28], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return { active, hidden: revealProg < 1, revealProg };
  };

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
          const { active, hidden, revealProg } = wordState(word);
          const sungProgress = interpolate(
            t,
            [word.start - HIGHLIGHT_LEAD, word.start + 0.12],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const baseColor = active ? theme.arabicActive : theme.arabicIdle;
          const useRuns = showTajweed && !hidden && word.runs && word.runs.length > 0;
          // A revealing word fades + lifts in; a hidden word is a glowing tile.
          const revealScale = hidden ? 1 : 0.94 + revealProg * 0.06;
          return (
            <span
              key={i}
              style={{
                // Blanked words keep their footprint (transparent glyphs) so the
                // line never reflows; a tile + glow marks where the word is, and
                // the tile pulses while the reciter is actually saying it.
                color: hidden
                  ? "transparent"
                  : revealProg < 1
                    ? theme.arabicActive
                    : baseColor,
                background: hidden
                  ? active
                    ? theme.arabicGlow
                    : `${theme.accent}22`
                  : "transparent",
                borderRadius: hidden ? 14 : 0,
                boxShadow: hidden && active ? `0 0 30px ${theme.arabicGlow}` : "none",
                textShadow:
                  !hidden && (active || revealProg < 1)
                    ? `0 0 30px ${theme.arabicGlow}, 0 0 60px ${theme.arabicGlow}`
                    : "none",
                opacity: hidden ? 1 : 0.35 + revealProg * 0.65,
                transform: `scale(${revealScale * (1 + sungProgress * 0.06)})`,
                transition: "color 0.12s linear, background 0.12s linear",
                display: "inline-block",
              }}
            >
              {useRuns
                ? word.runs!.map((r, j) => (
                    <span key={j} style={{ color: tajweedColor(r.rule, baseColor) }}>
                      {r.text}
                    </span>
                  ))
                : word.text}
            </span>
          );
        })}
      </div>

      {/* Romanized pronunciation line (optional). */}
      {showTransliteration && ayah.transliteration ? (
        <div
          style={{
            marginTop: 34,
            maxWidth: 900,
            fontFamily: TRANSLATION_FONT,
            fontSize: 30,
            fontStyle: "italic",
            letterSpacing: 1,
            textAlign: "center",
            color: theme.accent,
            opacity: transReveal * 0.8,
          }}
        >
          {ayah.transliteration}
        </div>
      ) : null}

      {/* Karaoke-style recitation progress bar. */}
      <div
        style={{
          marginTop: 40,
          width: 360,
          height: 6,
          borderRadius: 3,
          background: `${theme.accent}22`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: "100%",
            borderRadius: 3,
            background: theme.accent,
            boxShadow: `0 0 14px ${theme.arabicGlow}`,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 40,
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
          marginTop: 36,
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
