import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { QuranProps, Ayah } from "./schema";
import { themes } from "./themes";
import { Background } from "./Background";
import { AyahView } from "./Ayah";
import { Intro, Outro } from "./Cards";
import { Watermark } from "./Watermark";
import { TajweedLegend } from "./TajweedLegend";
import { revealForRepetition, repetitionLabel, Reveal } from "./hifz";
import { canonicalRule } from "./tajweed";
import { ARABIC_DISPLAY_FONT, TRANSLATION_FONT } from "./fonts";

export const FPS = 30;

// Resolve an audioSrc that may be a /public path or an absolute URL.
const resolveAudio = (src: string): string =>
  /^https?:\/\//.test(src) ? src : staticFile(src);

export const ayahFrameLength = (durationInSeconds: number, gapSeconds: number): number =>
  Math.round((durationInSeconds + gapSeconds) * FPS);

// One on-screen unit. In standard mode there's one per ayah; in Hifz mode each
// ayah expands into several repetitions with progressively more words hidden.
export type Segment = {
  key: string;
  ayah: Ayah;
  frames: number;
  reveal?: Reveal; // present only in Hifz mode
  repetitionLabel?: string;
};

export const buildSegments = (props: QuranProps): Segment[] => {
  const segs: Segment[] = [];
  for (const ayah of props.ayahs) {
    const frames = ayahFrameLength(ayah.durationInSeconds, props.ayahGapSeconds);
    if (props.mode === "hifz") {
      for (let rep = 0; rep < props.hifzRepeats; rep++) {
        segs.push({
          key: `${ayah.key}-r${rep}`,
          ayah,
          frames,
          reveal: revealForRepetition(rep, props.hifzRepeats),
          repetitionLabel: repetitionLabel(rep, props.hifzRepeats),
        });
      }
    } else {
      segs.push({ key: ayah.key, ayah, frames });
    }
  }
  return segs;
};

// "2:255" for a single ayah, or "2:255–256" for a range.
export const ayahReference = (props: QuranProps): string => {
  const a = props.ayahs;
  if (a.length === 0) return "";
  if (a.length === 1) return a[0].key;
  return `${a[0].key}–${a[a.length - 1].number}`;
};

export const ayahsDurationInFrames = (props: QuranProps): number =>
  buildSegments(props).reduce((sum, s) => sum + s.frames, 0);

export const totalDurationInFrames = (props: QuranProps): number =>
  Math.round(props.introSeconds * FPS) +
  ayahsDurationInFrames(props) +
  Math.round(props.outroSeconds * FPS);

// Collect the distinct tajweed rules present, for the legend.
export const tajweedRulesPresent = (props: QuranProps): string[] => {
  const set = new Set<string>();
  for (const a of props.ayahs)
    for (const w of a.words)
      for (const r of w.runs ?? []) if (r.rule) set.add(canonicalRule(r.rule));
  return Array.from(set);
};

export const QuranComposition: React.FC<QuranProps> = (props) => {
  const theme = themes[props.theme];
  const showTajweed = props.mode === "tajweed";
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
          basmala={props.basmala}
          surahNameArabic={props.surahNameArabic}
          surahNameEnglish={props.surahNameEnglish}
          channelName={props.channelName}
          brandSrc={props.watermarkSrc}
          ayahReference={ayahReference(props)}
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

      {/* Ayah / repetition sequences with synced audio */}
      {buildSegments(props).map((seg) => {
        const from = cursor;
        cursor += seg.frames;
        return (
          <Sequence key={seg.key} from={from} durationInFrames={seg.frames}>
            <Audio src={resolveAudio(seg.ayah.audioSrc)} />
            <AyahView
              ayah={seg.ayah}
              theme={theme}
              durationInFrames={seg.frames}
              reveal={seg.reveal}
              repetitionLabel={seg.repetitionLabel}
              showTajweed={showTajweed}
              showTransliteration={props.showTransliteration}
            />
          </Sequence>
        );
      })}

      {/* Tajweed legend (only in tajweed mode, only during recitation) */}
      {showTajweed ? (
        <Sequence from={introFrames} durationInFrames={ayahsFrames}>
          <TajweedLegend rules={tajweedRulesPresent(props)} />
        </Sequence>
      ) : null}

      {/* Outro card */}
      <Sequence from={introFrames + ayahsFrames} durationInFrames={outroFrames}>
        <Outro
          surahNameArabic={props.surahNameArabic}
          surahNameEnglish={props.surahNameEnglish}
          channelName={props.channelName}
          ayahReference={ayahReference(props)}
          theme={theme}
        />
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
