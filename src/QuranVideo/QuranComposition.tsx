import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { QuranProps, Ayah } from "./schema";
import { themes } from "./themes";
import { Background } from "./Background";
import { AyahView } from "./Ayah";
import { Intro, Outro } from "./Cards";
import { Watermark } from "./Watermark";
import { TajweedLegend } from "./TajweedLegend";
import { passForRepetition, HifzPass } from "./hifz";
import { canonicalRule } from "./tajweed";
import { ARABIC_DISPLAY_FONT, TRANSLATION_FONT } from "./fonts";

export const FPS = 30;

// Resolve an audioSrc that may be a /public path or an absolute URL.
const resolveAudio = (src: string): string =>
  /^https?:\/\//.test(src) ? src : staticFile(src);

export const ayahFrameLength = (durationInSeconds: number, gapSeconds: number): number =>
  Math.round((durationInSeconds + gapSeconds) * FPS);

// Seconds for the silent "Your turn" recall beat (scaled to the ayah length).
const CONFIRM_SECONDS = 1.8; // hold after the reveal, to read the confirmation
const yourTurnSeconds = (ayah: Ayah): number => {
  const lastEnd = ayah.words.reduce((m, w) => Math.max(m, w.end), 0);
  return Math.min(Math.max(lastEnd, 2.0), 6.0);
};

// One on-screen unit. In standard mode there's one per ayah; in Hifz mode each
// ayah expands into several repetition passes (some with a recall gap).
export type Segment = {
  key: string;
  ayah: Ayah;
  frames: number;
  pass?: HifzPass; // present only in Hifz mode
  responseGapSeconds: number; // length of the silent "your turn" beat (0 = none)
};

export const buildSegments = (props: QuranProps): Segment[] => {
  const segs: Segment[] = [];
  for (const ayah of props.ayahs) {
    const recite = ayahFrameLength(ayah.durationInSeconds, props.ayahGapSeconds);
    if (props.mode === "hifz") {
      for (let rep = 0; rep < props.hifzRepeats; rep++) {
        const pass = passForRepetition(rep, props.hifzRepeats);
        const gapSec = pass.responseGap ? yourTurnSeconds(ayah) : 0;
        const confirmSec =
          pass.reveal === "afterGap" || pass.reveal === "end" ? CONFIRM_SECONDS : 0;
        segs.push({
          key: `${ayah.key}-r${rep}`,
          ayah,
          frames: recite + Math.round((gapSec + confirmSec) * FPS),
          pass,
          responseGapSeconds: gapSec,
        });
      }
    } else {
      segs.push({ key: ayah.key, ayah, frames: recite, responseGapSeconds: 0 });
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
            {/* Stop the recitation before the silent "your turn" beat. */}
            <Audio
              src={resolveAudio(seg.ayah.audioSrc)}
              endAt={Math.round(seg.ayah.durationInSeconds * FPS)}
            />
            <AyahView
              ayah={seg.ayah}
              theme={theme}
              durationInFrames={seg.frames}
              pass={seg.pass}
              responseGapSeconds={seg.responseGapSeconds}
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

      {/* Outro card — also where the reciter + translation credits live now. */}
      <Sequence from={introFrames + ayahsFrames} durationInFrames={outroFrames}>
        <Outro
          surahNameArabic={props.surahNameArabic}
          surahNameEnglish={props.surahNameEnglish}
          channelName={props.channelName}
          ayahReference={ayahReference(props)}
          reciterName={props.reciterName}
          translationName={props.translationName}
          theme={theme}
        />
      </Sequence>

      {/* Anti-theft watermark over everything. Reciter + translation credits
          now live on the outro card (and belong in the video description),
          keeping every recitation frame clean. */}
      <Watermark src={props.watermarkSrc} opacity={props.watermarkOpacity} />
    </AbsoluteFill>
  );
};
