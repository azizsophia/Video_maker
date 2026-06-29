import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
} from "remotion";
import { StorySegment, StoryWord } from "./storySchema";
import { PLAYFAIR, CORMORANT, JOST } from "./luxFonts";
import { ARABIC_DISPLAY_FONT } from "./fonts";
import { CineMap } from "./CineMap";
import { FingerprintScene, isFingerprintScene } from "./Fingerprint";

const GOLD = "#e7c873";
const CREAM = "#f7f1e2";

const resolve = (src: string) => (/^https?:\/\//.test(src) ? src : staticFile(src));

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Full-bleed Pexels footage (muted) with a brand green/gold grade + scrims so
// captions stay readable. A continuous Ken Burns pan+zoom keeps motion alive,
// and the clip is slowed (playbackRate) to fill the whole beat so it never runs
// out and FREEZES on its last frame at the cut. Pass videoDuration (seconds) so
// the slow-down is computed exactly; otherwise a gentle slow-mo default is used.
const CinematicBg: React.FC<{ src: string; videoDuration?: number }> = ({ src, videoDuration }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const beatSeconds = durationInFrames / fps;
  // Stretch the clip to cover the beat (never faster than 1x, never a crawl).
  const rate = videoDuration && videoDuration > 0
    ? clamp(videoDuration / (beatSeconds + 0.3), 0.5, 1)
    : 0.7;
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  // Continuous motion: zoom in + a slow directional pan (direction varies per clip).
  const zoom = 1.06 + 0.16 * p;
  const dir = src.length % 2 === 0 ? 1 : -1;
  const panX = dir * interpolate(p, [0, 1], [-26, 26]);
  const panY = interpolate(p, [0, 1], [18, -18]);
  const fade = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0b1410" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`, opacity: fade }}>
        <OffthreadVideo src={resolve(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {/* brand green tint + gold warmth */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(13,40,28,0.45) 0%, rgba(11,20,16,0.15) 35%, rgba(11,20,16,0.35) 70%, rgba(8,16,12,0.85) 100%)" }} />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 320px rgba(0,0,0,0.55)", mixBlendMode: "multiply" }} />
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, rgba(231,200,115,0.10), transparent 60%)" }} />
    </AbsoluteFill>
  );
};

const toLines = (words: StoryWord[], per = 5) => {
  const out: { words: StoryWord[]; start: number }[] = [];
  for (let i = 0; i < words.length; i += per) {
    const c = words.slice(i, i + per);
    if (c.length) out.push({ words: c, start: c[0].start });
  }
  return out;
};

// Calm caption: lines fade in softly, the spoken word warms to gold. No jumpy
// per-word scaling (that was the "blinking").
const CineCaption: React.FC<{ words?: StoryWord[] }> = ({ words = [] }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const wide = width > height; // 16:9 long-form vs 9:16 short
  const t = frame / fps;
  const lines = toLines(words, wide ? 7 : 5);
  let idx = 0;
  for (let i = 0; i < lines.length; i++) if (t >= lines[i].start - 0.2) idx = i;
  const line = lines[idx];
  const lineFade = interpolate(t, [line?.start ?? 0, (line?.start ?? 0) + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Lower-third caption. Wide has far less vertical room, so the safe-area
  // bottom inset and type shrink; the line gets wider to use the extra width.
  const padBottom = wide ? 96 : 600;
  // 9:16: wider side margins + a narrower text column keep the centred caption
  // clear of the right-side icon rail (profile/like/comment/share) on
  // TikTok / Reels / Shorts. 16:9 has no overlay UI so it stays full-width.
  const padX = wide ? 160 : 150;
  const fontSize = wide ? 52 : 70;
  const maxWidth = wide ? 1520 : 780;
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", padding: `0 ${padX}px ${padBottom}px` }}>
      <div
        style={{
          fontFamily: PLAYFAIR,
          fontWeight: 700,
          fontSize,
          lineHeight: 1.25,
          textAlign: "center",
          color: CREAM,
          textShadow: "0 4px 26px rgba(0,0,0,0.95)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "4px 16px",
          maxWidth,
          background: "rgba(6,12,9,0.5)",
          padding: "20px 32px",
          borderRadius: 28,
          opacity: lineFade,
          transform: `translateY(${(1 - lineFade) * 12}px)`,
        }}
      >
        {line?.words.map((w, i) => {
          const active = t >= w.start - 0.03 && t < w.end + 0.12;
          return (
            <span key={i} style={{ color: active ? GOLD : CREAM, transition: "color 0.2s linear" }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CineLabel: React.FC<{ kicker?: string; foot?: string }> = ({ kicker, foot }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const wide = width > height;
  const fade = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Kicker rides near the top; the source foot sits just above the lower-third
  // caption. Both insets shrink for the shorter 16:9 frame.
  const kickerTop = wide ? 80 : 300;
  const footBottom = wide ? 300 : 860;
  return (
    <>
      {kicker ? (
        <div style={{ position: "absolute", top: kickerTop, width: "100%", display: "flex", justifyContent: "center", opacity: fade }}>
          <span style={{ fontFamily: JOST, fontWeight: 500, letterSpacing: 8, fontSize: 28, color: GOLD, background: "rgba(6,12,9,0.42)", padding: "9px 22px", borderRadius: 16, textShadow: "0 2px 16px rgba(0,0,0,0.85)" }}>
            {kicker}
          </span>
        </div>
      ) : null}
      {foot ? (
        <div style={{ position: "absolute", bottom: footBottom, width: "100%", display: "flex", justifyContent: "center", opacity: fade * 0.95 }}>
          <span style={{ fontFamily: JOST, fontWeight: 400, letterSpacing: 2, fontSize: 26, color: "rgba(247,241,226,0.92)", background: "rgba(6,12,9,0.42)", padding: "7px 18px", borderRadius: 14, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
            {foot}
          </span>
        </div>
      ) : null}
    </>
  );
};

// Qur'an pull-quote over darkened footage (Arabic shown, never recited).
const CineQuote: React.FC<{ arabic?: string; words?: StoryWord[]; kicker?: string }> = ({ arabic, words = [], kicker }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const wide = width > height;
  const t = frame / fps;
  const fade = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const flourish = interpolate(frame, [18, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 16:9 has more width but much less height: tighten the vertical padding,
  // shrink the Arabic + translation a touch, and widen the text column.
  const padY = wide ? 110 : 200;
  const padX = wide ? 160 : 90;
  const arabicSize = wide ? 74 : 92;
  const transSize = wide ? 46 : 58;
  const maxWidth = wide ? 1320 : 900;
  return (
    <AbsoluteFill style={{ background: "rgba(6,12,9,0.55)", justifyContent: "center", alignItems: "center", padding: `${padY}px ${padX}px`, opacity: fade }}>
      {kicker ? (
        <div style={{ marginBottom: wide ? 28 : 40, fontFamily: JOST, fontWeight: 500, letterSpacing: 8, fontSize: 28, color: GOLD }}>{kicker}</div>
      ) : null}
      <div dir="rtl" style={{ fontFamily: ARABIC_DISPLAY_FONT, fontWeight: 700, fontSize: arabicSize, lineHeight: 1.7, textAlign: "center", color: CREAM, textShadow: "0 0 50px rgba(231,200,115,0.4)" }}>
        {arabic}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, margin: wide ? "30px 0" : "44px 0" }}>
        <div style={{ height: 1.5, width: 150 * flourish, background: "linear-gradient(90deg,transparent,#e7c873)" }} />
        <div style={{ width: 14, height: 14, transform: "rotate(45deg)", background: GOLD, opacity: flourish }} />
        <div style={{ height: 1.5, width: 150 * flourish, background: "linear-gradient(90deg,#e7c873,transparent)" }} />
      </div>
      <div style={{ fontFamily: CORMORANT, fontStyle: "italic", fontWeight: 600, fontSize: transSize, lineHeight: 1.3, textAlign: "center", color: CREAM, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2px 14px", maxWidth }}>
        {words.map((w, i) => (
          <span key={i} style={{ opacity: t >= w.start - 0.12 ? 1 : 0.3, color: t >= w.start - 0.04 && t < w.end + 0.12 ? GOLD : CREAM }}>
            {w.text}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// One cinematic beat: footage + (quote OR caption + labels).
export const CinematicBeat: React.FC<{ seg: StorySegment }> = ({ seg }) => {
  return (
    <AbsoluteFill>
      {seg.map ? (
        <CineMap view={seg.map} />
      ) : isFingerprintScene(seg.scene) ? (
        // Code-generated fingerprint-ridge backdrop (no stock footage): the
        // subject of this short IS a fingerprint, so the visual is one.
        <FingerprintScene name={seg.scene as string} />
      ) : seg.videoSrc ? (
        <CinematicBg src={seg.videoSrc} videoDuration={seg.videoDuration} />
      ) : (
        <AbsoluteFill style={{ background: "#0b1410" }} />
      )}
      {seg.arabic ? (
        <CineQuote arabic={seg.arabic} words={seg.words} kicker={seg.kicker} />
      ) : (
        <>
          <CineLabel kicker={seg.kicker} foot={seg.foot} />
          <CineCaption words={seg.words} />
        </>
      )}
    </AbsoluteFill>
  );
};
