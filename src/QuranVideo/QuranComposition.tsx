import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { QuranProps } from "./schema";
import { themes } from "./themes";
import { Background } from "./Background";
import { AyahView } from "./Ayah";
import { Intro, Outro } from "./Cards";
import { Watermark } from "./Watermark";
import { ARABIC_DISPLAY_FONT, TRANSLATION_FONT } from "./fonts";

export const FPS = 30;

// Resolve an audioSrc that may be a /public path or an absolute URL.
const resolveAudio = (src: string): string =>
  /^https?:\/\//.test(src) ? src : staticFile(src);

export const ayahFrameLength = (durationInSeconds: number, gapSeconds: number): number =>
  Math.round((durationInSeconds + gapSeconds) * FPS);

export const ayahsDurationInFrames = (props: QuranProps): number =>
  props.ayahs.reduce(
    (sum, a) => sum + ayahFrameLength(a.durationInSeconds, props.ayahGapSeconds),
    0
  );

export const totalDurationInFrames = (props: QuranProps): number =>
  Math.round(props.introSeconds * FPS) +
  ayahsDurationInFrames(props) +
  Math.round(props.outroSeconds * FPS);

export const QuranComposition: React.FC<QuranProps> = (props) => {
  const theme = themes[props.theme];
  const introFrames = Math.round(props.introSeconds * FPS);
  const outroFrames = Math.round(props.outroSeconds * FPS);
  const ayahsFrames = ayahsDurationInFrames(props);
  let cursor = introFrames;

  return (
    <AbsoluteFill>
      <Background theme={theme} />

      {/* Intro title card */}
      <Sequence from={0} durationInFrames={introFrames}>
        <Intro
          surahNameArabic={props.surahNameArabic}
          surahNameEnglish={props.surahNameEnglish}
          channelName={props.channelName}
          theme={theme}
        />
      </Sequence>

      {/* Header (only during the recitation) */}
      <Sequence from={introFrames} durationInFrames={ayahsFrames}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 90 }}>
          <div
            style={{
              fontFamily: ARABIC_DISPLAY_FONT,
              fontSize: 56,
              color: theme.arabicActive,
              opacity: 0.95,
            }}
          >
            {props.surahNameArabic}
          </div>
          <div
            style={{
              fontFamily: TRANSLATION_FONT,
              fontSize: 28,
              letterSpacing: 3,
              color: theme.accent,
              marginTop: 10,
              textTransform: "uppercase",
            }}
          >
            {props.surahNameEnglish}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Ayah sequences with synced audio */}
      {props.ayahs.map((ayah) => {
        const frames = ayahFrameLength(ayah.durationInSeconds, props.ayahGapSeconds);
        const from = cursor;
        cursor += frames;
        return (
          <Sequence key={ayah.key} from={from} durationInFrames={frames}>
            <Audio src={resolveAudio(ayah.audioSrc)} />
            <AyahView ayah={ayah} theme={theme} durationInFrames={frames} />
          </Sequence>
        );
      })}

      {/* Outro card */}
      <Sequence from={introFrames + ayahsFrames} durationInFrames={outroFrames}>
        <Outro channelName={props.channelName} theme={theme} />
      </Sequence>

      {/* Anti-theft watermark over everything */}
      <Watermark src={props.watermarkSrc} opacity={props.watermarkOpacity} />

      {/* Footer: reciter + translation credit */}
      <AbsoluteFill
        style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 70 }}
      >
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontSize: 26,
            color: theme.translation,
            opacity: 0.85,
          }}
        >
          {props.reciterName}
        </div>
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontSize: 20,
            color: theme.translation,
            opacity: 0.5,
            marginTop: 6,
          }}
        >
          {props.translationName}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
