import React from "react";
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ThemePalette } from "./themes";
import { ARABIC_DISPLAY_FONT, TRANSLATION_FONT } from "./fonts";

const resolveSrc = (src: string): string =>
  /^https?:\/\//.test(src) ? src : staticFile(src);

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

// A glowing brand mark that gently floats and breathes — used on both cards.
const BrandMark: React.FC<{ src?: string; theme: ThemePalette; size: number }> = ({
  src,
  theme,
  size,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const float = Math.sin(frame / 22) * 6;
  return (
    <div
      style={{
        width: size,
        height: size,
        marginBottom: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        transform: `translateY(${float}px) scale(${0.6 + pop * 0.4})`,
        background: `radial-gradient(circle, ${theme.arabicGlow} 0%, transparent 68%)`,
      }}
    >
      {src ? (
        <Img
          src={resolveSrc(src)}
          style={{ width: "62%", height: "62%", objectFit: "contain", opacity: 0.95 }}
        />
      ) : null}
    </div>
  );
};

// Opening card: brand mark + Bismillah (sourced from the API) + surah name.
export const Intro: React.FC<{
  basmala: string;
  surahNameArabic: string;
  surahNameEnglish: string;
  channelName: string;
  brandSrc?: string;
  ayahReference?: string;
  theme: ThemePalette;
}> = ({
  basmala,
  surahNameArabic,
  surahNameEnglish,
  channelName,
  brandSrc,
  ayahReference,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 200 } });
  return (
    <Card fadeOut>
      <BrandMark src={brandSrc} theme={theme} size={170} />
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
          margin: "48px 0",
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
        {ayahReference ? (
          <span style={{ opacity: 0.7 }}> · {ayahReference}</span>
        ) : null}
      </div>
      <div
        style={{
          fontFamily: TRANSLATION_FONT,
          fontSize: 22,
          letterSpacing: 3,
          color: theme.translation,
          opacity: 0.6,
          marginTop: 44,
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
  ayahReference?: string;
  reciterName?: string;
  translationName?: string;
  websiteUrl?: string;
  showCourseCta?: boolean;
  ctaHeadline?: string;
  theme: ThemePalette;
}> = ({
  surahNameArabic,
  surahNameEnglish,
  channelName,
  ayahReference,
  reciterName,
  translationName,
  websiteUrl,
  showCourseCta = false,
  ctaHeadline = "Find more at",
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cta = spring({ frame: frame - 18, fps, config: { damping: 16 } });
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
        {ayahReference ? (
          <span style={{ opacity: 0.7 }}> · {ayahReference}</span>
        ) : null}
      </div>
      <div
        style={{
          width: 160,
          height: 2,
          background: theme.accent,
          opacity: 0.6,
          margin: "44px 0",
        }}
      />
      {/* Course call-to-action (only once the course is live). */}
      {showCourseCta ? (
      <div
        style={{
          transform: `scale(${0.85 + cta * 0.15})`,
          opacity: cta,
          padding: "22px 46px",
          borderRadius: 28,
          border: `2px solid ${theme.accent}`,
          background: `${theme.accent}1a`,
          boxShadow: `0 0 28px ${theme.arabicGlow}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontSize: 26,
            letterSpacing: 1,
            color: theme.translation,
          }}
        >
          {ctaHeadline}
        </div>
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontSize: 38,
            fontWeight: 700,
            letterSpacing: 1,
            color: theme.arabicActive,
          }}
        >
          {websiteUrl}
        </div>
      </div>
      ) : null}
      <div
        style={{
          fontFamily: TRANSLATION_FONT,
          fontSize: 24,
          letterSpacing: 3,
          color: theme.accent,
          textTransform: "uppercase",
          marginTop: 28,
        }}
      >
        {channelName} · Subscribe for new surahs weekly
      </div>
      {/* Credits — kept off the recitation frames, gathered here instead. */}
      {reciterName || translationName ? (
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontSize: 18,
            lineHeight: 1.5,
            color: theme.translation,
            opacity: 0.55,
            marginTop: 40,
          }}
        >
          {reciterName ? <div>Recitation · {reciterName}</div> : null}
          {translationName ? <div>Translation · {translationName}</div> : null}
        </div>
      ) : null}
    </Card>
  );
};
