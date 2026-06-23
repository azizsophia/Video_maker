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

const GOLD = "#e7c873";
const CREAM = "#f7f1e2";

const resolve = (src: string) => (/^https?:\/\//.test(src) ? src : staticFile(src));

// Full-bleed Pexels footage (muted) with a brand green/gold grade + scrims so
// captions stay readable. Calm: only a very slow zoom, footage does the motion.
const CinematicBg: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = 1.05 + 0.05 * interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  const fade = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0b1410" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, opacity: fade }}>
        <OffthreadVideo src={resolve(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const lines = toLines(words);
  let idx = 0;
  for (let i = 0; i < lines.length; i++) if (t >= lines[i].start - 0.2) idx = i;
  const line = lines[idx];
  const lineFade = interpolate(t, [line?.start ?? 0, (line?.start ?? 0) + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 360, padding: "0 90px 360px" }}>
      <div
        style={{
          fontFamily: PLAYFAIR,
          fontWeight: 700,
          fontSize: 70,
          lineHeight: 1.25,
          textAlign: "center",
          color: CREAM,
          textShadow: "0 4px 30px rgba(0,0,0,0.9)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "4px 16px",
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
  const fade = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      {kicker ? (
        <div style={{ position: "absolute", top: 150, width: "100%", textAlign: "center", fontFamily: JOST, fontWeight: 500, letterSpacing: 8, fontSize: 28, color: GOLD, opacity: fade, textShadow: "0 2px 16px rgba(0,0,0,0.8)" }}>
          {kicker}
        </div>
      ) : null}
      {foot ? (
        <div style={{ position: "absolute", bottom: 150, width: "100%", textAlign: "center", fontFamily: JOST, fontWeight: 400, letterSpacing: 2, fontSize: 26, color: "rgba(247,241,226,0.82)", opacity: fade * 0.95, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
          {foot}
        </div>
      ) : null}
    </>
  );
};

// Qur'an pull-quote over darkened footage (Arabic shown, never recited).
const CineQuote: React.FC<{ arabic?: string; words?: StoryWord[]; kicker?: string }> = ({ arabic, words = [], kicker }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const fade = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const flourish = interpolate(frame, [18, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "rgba(6,12,9,0.55)", justifyContent: "center", alignItems: "center", padding: "0 90px", opacity: fade }}>
      {kicker ? (
        <div style={{ position: "absolute", top: 200, fontFamily: JOST, fontWeight: 500, letterSpacing: 8, fontSize: 28, color: GOLD }}>{kicker}</div>
      ) : null}
      <div dir="rtl" style={{ fontFamily: ARABIC_DISPLAY_FONT, fontWeight: 700, fontSize: 96, lineHeight: 1.85, textAlign: "center", color: CREAM, textShadow: "0 0 50px rgba(231,200,115,0.4)" }}>
        {arabic}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, margin: "44px 0" }}>
        <div style={{ height: 1.5, width: 150 * flourish, background: "linear-gradient(90deg,transparent,#e7c873)" }} />
        <div style={{ width: 14, height: 14, transform: "rotate(45deg)", background: GOLD, opacity: flourish }} />
        <div style={{ height: 1.5, width: 150 * flourish, background: "linear-gradient(90deg,#e7c873,transparent)" }} />
      </div>
      <div style={{ fontFamily: CORMORANT, fontStyle: "italic", fontWeight: 600, fontSize: 58, lineHeight: 1.3, textAlign: "center", color: CREAM, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2px 14px", maxWidth: 900 }}>
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
      {seg.videoSrc ? <CinematicBg src={seg.videoSrc} /> : <AbsoluteFill style={{ background: "#0b1410" }} />}
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
