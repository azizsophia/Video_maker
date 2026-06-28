import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { StoryProps, StorySegment, StoryWord } from "./storySchema";
import { themes, ThemePalette } from "./themes";
import { Background } from "./Background";
import { StoryMap } from "./StoryMap";
import { Scene } from "./Scenes";
import { Slide, InstitutionalScene, InkCaption } from "./Slides";
import { CinematicBeat } from "./Cinematic";
import { ParallaxAd } from "./ParallaxAd";
import { ARABIC_DISPLAY_FONT, TRANSLATION_FONT, CAPTION_FONT } from "./fonts";

export const STORY_FPS = 30;

const resolveAudio = (src: string): string =>
  /^https?:\/\//.test(src) ? src : staticFile(src);

const contentEndSeconds = (props: StoryProps): number =>
  props.segments.reduce((m, s) => Math.max(m, s.fromSeconds + s.durationInSeconds), 0);

// Seconds of outro appended after the content. The default outro is the
// ParallaxAd product spot (keepsake books + "Join the waitlist · ketabistudio.com"),
// which needs ~8s to play its open-the-book + CTA timeline. Set outroAd:false to
// use the lightweight text end card (ctaSeconds) instead.
export const outroSeconds = (props: StoryProps): number => {
  if (!props.showOutro) return 0;
  return props.outroAd === false ? props.ctaSeconds ?? 5.5 : props.adSeconds ?? 8;
};

export const storyDurationInFrames = (props: StoryProps): number => {
  const end = contentEndSeconds(props);
  return Math.max(1, Math.round((end + outroSeconds(props) + 0.5) * STORY_FPS));
};

// Group words into short caption lines (subtitle style).
const toLines = (words: StoryWord[], perLine = 3) => {
  const lines: { words: StoryWord[]; start: number; end: number }[] = [];
  for (let i = 0; i < words.length; i += perLine) {
    const chunk = words.slice(i, i + perLine);
    if (chunk.length)
      lines.push({ words: chunk, start: chunk[0].start, end: chunk[chunk.length - 1].end });
  }
  return lines;
};

const Narration: React.FC<{
  words?: StoryWord[];
  source?: string;
  theme: ThemePalette;
  align?: "center" | "bottom";
}> = ({ words = [], source, theme, align = "center" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lines = toLines(words);
  // current line = last line whose start has passed
  let idx = 0;
  for (let i = 0; i < lines.length; i++) if (t >= lines[i].start - 0.15) idx = i;
  const line = lines[idx];
  const appear = spring({ frame: frame - Math.round((line?.start ?? 0) * fps), fps, config: { damping: 200 } });

  void appear;
  return (
    <AbsoluteFill
      style={{
        justifyContent: align === "bottom" ? "flex-end" : "center",
        alignItems: "center",
        padding: "0 70px",
        paddingBottom: align === "bottom" ? 380 : 0,
      }}
    >
      <div
        style={{
          fontFamily: CAPTION_FONT,
          fontSize: 90,
          fontWeight: 900,
          lineHeight: 1.18,
          letterSpacing: -1,
          textAlign: "center",
          color: "#ffffff",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px 16px",
        }}
      >
        {line?.words.map((w, i) => {
          const shown = t >= w.start - 0.12;
          const active = t >= w.start - 0.05 && t < w.end + 0.08;
          const pop = spring({
            frame: frame - Math.round((w.start - 0.05) * fps),
            fps,
            config: { damping: 14, stiffness: 220, mass: 0.6 },
          });
          const rise = shown ? pop : 0;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: active ? "#0b0b0b" : "#ffffff",
                background: active ? theme.accent : "transparent",
                padding: active ? "4px 18px" : "4px 2px",
                borderRadius: 18,
                opacity: shown ? 1 : 0,
                transform: `translateY(${(1 - rise) * 34}px) scale(${0.86 + 0.14 * rise})`,
                textShadow: active ? "none" : "0 4px 26px rgba(0,0,0,0.85)",
                WebkitTextStroke: active ? "0" : "1.5px rgba(0,0,0,0.35)",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
      {source ? (
        <div
          style={{
            position: "absolute",
            bottom: align === "bottom" ? 300 : 200,
            fontFamily: CAPTION_FONT,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#fff",
            opacity: 0.92,
            background: theme.accent,
            padding: "8px 20px",
            borderRadius: 22,
            mixBlendMode: "normal",
          }}
        >
          <span style={{ color: "#0b0b0b" }}>{source}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Bottom gradient so captions stay readable over busy animated scenes.
const CaptionScrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(to top, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.34) 28%, rgba(0,0,0,0) 54%)",
    }}
  />
);

// A Quran verse shown on screen (NOT recited): Arabic on top, the English
// directly underneath (synced to the voice, which speaks only the English).
// Arabic comes from the validated Quran source.
const ArabicQuote: React.FC<{
  arabic: string;
  words?: StoryWord[];
  source?: string;
  theme: ThemePalette;
}> = ({ arabic, words = [], source, theme }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const appear = spring({ frame, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 70px" }}>
      <div
        style={{
          maxWidth: 940,
          padding: "60px 48px",
          borderRadius: 40,
          background: "rgba(0,0,0,0.34)",
          border: `2px solid ${theme.accent}55`,
          boxShadow: "0 30px 90px rgba(0,0,0,0.5)",
          opacity: appear,
          transform: `translateY(${(1 - appear) * 24}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          dir="rtl"
          style={{
            fontFamily: ARABIC_DISPLAY_FONT,
            fontWeight: 700,
            fontSize: 90,
            lineHeight: 1.8,
            textAlign: "center",
            color: "#ffffff",
            textShadow: `0 0 44px ${theme.arabicGlow}`,
          }}
        >
          {arabic}
        </div>
        <div
          style={{
            marginTop: 40,
            height: 3,
            width: 120,
            borderRadius: 2,
            background: theme.accent,
            opacity: 0.8,
          }}
        />
        <div
          style={{
            marginTop: 36,
            fontFamily: CAPTION_FONT,
            fontSize: 50,
            fontWeight: 800,
            lineHeight: 1.32,
            textAlign: "center",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "6px 12px",
          }}
        >
          {words.map((w, i) => {
            const active = t >= w.start - 0.05 && t < w.end + 0.08;
            const shown = t >= w.start - 0.12;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  color: active ? theme.accent : "#ffffff",
                  opacity: shown ? 1 : 0.32,
                  transform: `scale(${active ? 1.05 : 1})`,
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
        {source ? (
          <div
            style={{
              marginTop: 34,
              fontFamily: CAPTION_FONT,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 2,
              color: "#0b0b0b",
              background: theme.accent,
              padding: "8px 20px",
              borderRadius: 22,
            }}
          >
            {source}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const AyahCard: React.FC<{
  arabic?: string;
  translation?: string;
  source?: string;
  theme: ThemePalette;
}> = ({ arabic, translation, source, theme }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 14, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const transReveal = spring({ frame: frame - 10, fps, config: { damping: 200 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px", opacity }}>
      <div
        dir="rtl"
        style={{
          fontFamily: ARABIC_DISPLAY_FONT,
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1.7,
          textAlign: "center",
          color: theme.arabicActive,
          textShadow: `0 0 40px ${theme.arabicGlow}`,
        }}
      >
        {arabic}
      </div>
      <div
        style={{
          marginTop: 56,
          maxWidth: 900,
          fontFamily: TRANSLATION_FONT,
          fontSize: 44,
          lineHeight: 1.45,
          textAlign: "center",
          color: theme.translation,
          opacity: transReveal,
          transform: `translateY(${(1 - transReveal) * 20}px)`,
        }}
      >
        {translation}
      </div>
      {source ? (
        <div
          style={{
            marginTop: 40,
            fontFamily: TRANSLATION_FONT,
            fontSize: 26,
            letterSpacing: 2,
            color: theme.accent,
            opacity: transReveal * 0.9,
            textTransform: "uppercase",
          }}
        >
          {source}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Auto-appended end card. The ask is explicit and website-first: a headline that
// says what to do ("Join the founding list") and the destination (ketabistudio.com)
// shown as a clear gold button, so the viewer knows exactly where to go and why.
// Kept to the END card only (never over an ayah / the spiritual climax — adab).
// A handle / comment-keyword can be layered in via props but are optional + off.
const OutroCard: React.FC<{
  theme: ThemePalette;
  websiteUrl: string;
  headline: string;
  handle: string;
  sub: string;
  comment: string;
  showUrl: boolean;
  onLight: boolean;
}> = ({ theme, websiteUrl, headline, handle, sub, comment, showUrl, onLight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame, fps, config: { damping: 200 } });
  const rise = (1 - appear) * 24;
  const ink = onLight ? "#1c3a2b" : "#ffffff";
  const soft = onLight ? "rgba(28,58,43,0.72)" : "rgba(255,255,255,0.78)";
  return (
    <AbsoluteFill
      style={{
        background: theme.gradientFrom,
        justifyContent: "center",
        alignItems: "center",
        opacity: appear,
        padding: "0 90px",
      }}
    >
      {/* brand mark — small, like a signature, not a billboard */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 54, transform: `translateY(${rise}px)` }}>
        <Img
          src={staticFile("brand/ketabi-icon-green.png")}
          style={{ width: 78, height: 78, objectFit: "contain" }}
        />
        <div style={{ fontFamily: CAPTION_FONT, fontSize: 40, fontWeight: 900, letterSpacing: 1, color: ink }}>
          Ketabi Studio
        </div>
      </div>

      {/* the ask: what to do */}
      <div
        style={{
          fontFamily: CAPTION_FONT,
          fontSize: 60,
          fontWeight: 900,
          lineHeight: 1.12,
          textAlign: "center",
          color: ink,
          transform: `translateY(${rise}px)`,
        }}
      >
        {headline}
      </div>

      {sub ? (
        <div
          style={{
            marginTop: 16,
            fontFamily: TRANSLATION_FONT,
            fontSize: 32,
            fontWeight: 600,
            textAlign: "center",
            color: soft,
            transform: `translateY(${rise}px)`,
          }}
        >
          {sub}
        </div>
      ) : null}

      {/* the destination: the clear "go here" button (the website / waitlist) */}
      {showUrl ? (
        <div
          style={{
            marginTop: 42,
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: theme.accent,
            color: "#0b1410",
            fontFamily: CAPTION_FONT,
            fontSize: 46,
            fontWeight: 900,
            letterSpacing: 0.5,
            padding: "20px 44px",
            borderRadius: 999,
            boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
            transform: `translateY(${rise}px) scale(${0.96 + 0.04 * appear})`,
          }}
        >
          {websiteUrl}
          <span style={{ fontSize: 40 }}>→</span>
        </div>
      ) : null}

      {/* optional secondary follow line (off unless a handle is set) */}
      {handle ? (
        <div
          style={{
            marginTop: 24,
            fontFamily: TRANSLATION_FONT,
            fontSize: 28,
            fontWeight: 700,
            color: soft,
            transform: `translateY(${rise}px)`,
          }}
        >
          or follow {handle}
        </div>
      ) : null}

      {/* optional comment-keyword funnel (off by default) */}
      {comment ? (
        <div
          style={{
            marginTop: 28,
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: onLight ? "rgba(28,58,43,0.08)" : "rgba(255,255,255,0.12)",
            border: `2px solid ${theme.accent}`,
            borderRadius: 999,
            padding: "14px 28px",
            transform: `translateY(${rise}px)`,
          }}
        >
          <div style={{ fontFamily: TRANSLATION_FONT, fontSize: 30, fontWeight: 700, color: ink }}>
            Comment{" "}
            <span style={{ color: theme.accent, fontWeight: 900 }}>{`“${comment}”`}</span>
            {" "}and I’ll send it to you
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const StoryVideo: React.FC<StoryProps> = (props) => {
  const theme = themes[props.theme];
  const contentEndFrames = Math.round(contentEndSeconds(props) * STORY_FPS);
  const outroFrames = Math.round(outroSeconds(props) * STORY_FPS);
  const adOutro = props.outroAd !== false;
  const institutional = props.theme === "atlas";
  const cinematic = props.cinematic === true;
  return (
    <AbsoluteFill style={{ background: cinematic ? "#0b1410" : institutional ? "#efe4cd" : undefined }}>
      {!institutional && !cinematic ? (
        <>
          <Background theme={theme} />
          {/* Extra darken for cinematic mood. */}
          <AbsoluteFill style={{ background: "rgba(0,0,0,0.28)" }} />
        </>
      ) : null}
      {props.segments.map((seg: StorySegment, i: number) => {
        const from = Math.round(seg.fromSeconds * STORY_FPS);
        const dur = Math.round(seg.durationInSeconds * STORY_FPS);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            {seg.audioSrc ? <Audio src={resolveAudio(seg.audioSrc)} /> : null}
            {cinematic ? (
              <CinematicBeat seg={seg} />
            ) : institutional ? (
              <>
                <Slide kicker={seg.kicker} foot={seg.foot}>
                  <InstitutionalScene seg={seg} theme={theme} />
                </Slide>
                {!seg.arabic ? (
                  <InkCaption
                    words={seg.words}
                    align={!seg.scene || seg.scene === "statement" ? "center" : "bottom"}
                  />
                ) : null}
              </>
            ) : seg.kind === "narration" ? (
              seg.arabic ? (
                <>
                  <Scene name={seg.scene ?? "rays"} theme={theme} />
                  <CaptionScrim />
                  <ArabicQuote arabic={seg.arabic} words={seg.words} source={seg.source} theme={theme} />
                </>
              ) : seg.map ? (
                <>
                  <StoryMap view={seg.map} theme={theme} />
                  <CaptionScrim />
                  <Narration words={seg.words} source={seg.source} theme={theme} align="bottom" />
                </>
              ) : (
                <>
                  <Scene name={seg.scene} theme={theme} />
                  <CaptionScrim />
                  <Narration words={seg.words} source={seg.source} theme={theme} align="bottom" />
                </>
              )
            ) : (
              <AyahCard
                arabic={seg.arabic}
                translation={seg.translation}
                source={seg.source}
                theme={theme}
              />
            )}
          </Sequence>
        );
      })}
      {/* Subtle persistent brand chip — only during the content (dark themes only). */}
      {!institutional && !cinematic ? (
        <Sequence durationInFrames={Math.max(1, contentEndFrames)}>
          <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 70 }}>
            <div
              style={{
                fontFamily: TRANSLATION_FONT,
                fontSize: 26,
                letterSpacing: 3,
                color: theme.accent,
                opacity: 0.7,
              }}
            >
              {props.websiteUrl}
            </div>
          </AbsoluteFill>
        </Sequence>
      ) : null}

      {/* Auto-appended outro. Default: the ParallaxAd product spot (keepsake
          books + "Join the waitlist · ketabistudio.com"). outroAd:false falls
          back to the lightweight text end card. */}
      {props.showOutro ? (
        <Sequence from={contentEndFrames} durationInFrames={outroFrames}>
          {adOutro ? (
            <ParallaxAd frames={outroFrames} />
          ) : (
            <OutroCard
              theme={theme}
              websiteUrl={props.websiteUrl}
              headline={props.ctaHeadline}
              handle={props.ctaHandle}
              sub={props.ctaSub}
              comment={props.ctaComment}
              showUrl={props.ctaShowUrl}
              onLight={props.theme === "noor" || props.theme === "atlas"}
            />
          )}
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
