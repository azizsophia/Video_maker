import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ThemePalette } from "./themes";
import { ARABIC_DISPLAY_FONT, TRANSLATION_FONT } from "./fonts";

const Card: React.FC<{ children: React.ReactNode; fadeOut?: boolean }> = ({
  children,
  fadeOut,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const out = fadeOut
    ? interpolate(frame, [durationInFrames - 16, durationInFrames - 2], [1, 0], {
        extrapolateLeft: "clamp",
      })
    : 1;
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: Math.min(fadeIn, out),
        padding: "0 80px",
        textAlign: "center",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Opening card: Bismillah (sourced from the API) + surah name, gently scaling in.
export const Intro: React.FC<{
  basmala: string;
  surahNameArabic: string;
  surahNameEnglish: string;
  channelName: string;
  theme: ThemePalette;
}> = ({ basmala, surahNameArabic, surahNameEnglish, channelName, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 } });
  return (
    <Card fadeOut>
      {basmala ? (
        <div
          dir="rtl"
          style={{
            fontFamily: ARABIC_DISPLAY_FONT,
            fontSize: 64,
            color: theme.arabicActive,
            textShadow: `0 0 40px ${theme.arabicGlow}`,
            transform: `translateY(${(1 - rise) * 20}px)`,
          }}
        >
          {basmala}
        </div>
      ) : null}
      <div
        style={{
          width: 160,
          height: 2,
          background: theme.accent,
          opacity: 0.6,
          margin: "56px 0",
        }}
      />
      <div
        dir="rtl"
        style={{ fontFamily: ARABIC_DISPLAY_FONT, fontSize: 92, color: theme.arabicActive }}
      >
        {surahNameArabic}
      </div>
      <div
        style={{
          fontFamily: TRANSLATION_FONT,
          fontSize: 34,
          letterSpacing: 4,
          color: theme.accent,
          marginTop: 16,
          textTransform: "uppercase",
        }}
      >
        Surah {surahNameEnglish}
      </div>
      <div
        style={{
          fontFamily: TRANSLATION_FONT,
          fontSize: 22,
          letterSpacing: 3,
          color: theme.translation,
          opacity: 0.6,
          marginTop: 48,
        }}
      >
        {channelName}
      </div>
    </Card>
  );
};

// Closing card. Intentionally free of any non-Quranic Arabic phrase to avoid
// authenticity concerns — just the surah reference and the channel mark.
export const Outro: React.FC<{
  surahNameArabic: string;
  surahNameEnglish: string;
  channelName: string;
  theme: ThemePalette;
}> = ({ surahNameArabic, surahNameEnglish, channelName, theme }) => {
  return (
    <Card>
      <div
        dir="rtl"
        style={{
          fontFamily: ARABIC_DISPLAY_FONT,
          fontSize: 76,
          color: theme.arabicActive,
          textShadow: `0 0 40px ${theme.arabicGlow}`,
        }}
      >
        {surahNameArabic}
      </div>
      <div
        style={{
          fontFamily: TRANSLATION_FONT,
          fontSize: 30,
          letterSpacing: 3,
          color: theme.translation,
          opacity: 0.85,
          marginTop: 18,
          textTransform: "uppercase",
        }}
      >
        Surah {surahNameEnglish}
      </div>
      <div
        style={{
          width: 160,
          height: 2,
          background: theme.accent,
          opacity: 0.6,
          margin: "48px 0",
        }}
      />
      <div
        style={{
          fontFamily: TRANSLATION_FONT,
          fontSize: 26,
          letterSpacing: 3,
          color: theme.accent,
          textTransform: "uppercase",
        }}
      >
        {channelName}
      </div>
    </Card>
  );
};
