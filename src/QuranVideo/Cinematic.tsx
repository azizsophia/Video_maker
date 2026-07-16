import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Img,
  Loop,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
} from "remotion";
import { StorySegment, StoryWord } from "./storySchema";
import { PLAYFAIR, CORMORANT, JOST, NUNITO, MONTSERRAT } from "./luxFonts";
import { ARABIC_DISPLAY_FONT } from "./fonts";
import { CineMap } from "./CineMap";
import { FingerprintScene, isFingerprintScene } from "./Fingerprint";
import { Scene, isSceneName } from "./Scenes";
import { themes } from "./themes";

const GOLD = "#e7c873";
const CREAM = "#f7f1e2";
// Warm "kitab" (children's storytime) palette — soft amber/cream instead of the
// dark green/gold cinematic grade, with a rounded friendly font. Captions are
// boxless (soft floating text), so only the highlight colour is needed.
const WARM_HI = "#f0a45a";                // active-word highlight (warm amber)

const resolve = (src: string) => (/^https?:\/\//.test(src) ? src : staticFile(src));

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Full-bleed Pexels footage (muted) with a brand green/gold grade + scrims so
// captions stay readable. A continuous Ken Burns pan+zoom keeps motion alive,
// and the clip is slowed (playbackRate) to fill the whole beat so it never runs
// out and FREEZES on its last frame at the cut. Pass videoDuration (seconds) so
// the slow-down is computed exactly; otherwise a gentle slow-mo default is used.
export type Ambient = { rain?: boolean; flame?: string; stars?: boolean };
export const CinematicBg: React.FC<{ src?: string; imageSrc?: string; videoDuration?: number; dim?: number; warm?: boolean; ambient?: Ambient; aura?: boolean }> = ({ src, imageSrc, videoDuration, dim, warm, ambient, aura }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const beatSeconds = durationInFrames / fps;
  // Stretch the clip to cover the beat (never faster than 1x, never a crawl).
  const rate = videoDuration && videoDuration > 0
    ? clamp(videoDuration / (beatSeconds + 0.3), 0.5, 1)
    : 0.7;
  // Frames one full play of the clip occupies at this rate. When the clip fills
  // the beat this equals ~the whole beat (Loop never repeats); when the clip is
  // too short it is < the beat, so Loop repeats it instead of freezing.
  const loopFrames = videoDuration && videoDuration > 0
    ? Math.min(durationInFrames, Math.max(1, Math.round((videoDuration / rate) * fps)))
    : durationInFrames;
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: "clamp" });
  // Slow, restrained Ken Burns — gentle enough to feel luxurious rather than
  // busy (zoom ~1.05 -> 1.14 with a small directional pan that varies per clip).
  const zoom = 1.05 + 0.09 * p;
  const key = imageSrc || src || "";
  const dir = key.length % 2 === 0 ? 1 : -1;
  const panX = dir * interpolate(p, [0, 1], [-16, 16]);
  const panY = interpolate(p, [0, 1], [11, -11]);
  const fade = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  // Flame shimmer for a warm STILL (the lantern window). This background renders
  // ONCE, continuously, behind every beat (see StoryVideo), so `frame` is the
  // absolute video frame — the flicker is smooth and never resets at a cut. It is
  // tiny (8% radius) and locked to the flame, so only the flame breathes.
  const flickS = 0.55 * Math.sin(frame * 0.5) + 0.30 * Math.sin(frame * 1.3 + 1.1) + 0.15 * Math.sin(frame * 2.7 + 0.5); // ~ -1..1
  const flick = 0.5 + 0.5 * flickS; // ~0..1, organic flame wobble
  return (
    <AbsoluteFill style={{ background: warm ? "#20140c" : "#0b1410" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`, opacity: fade }}>
        {imageSrc ? (
          // Still image (e.g. the cosy lantern window): slow Ken Burns drift + a
          // small flame-locked shimmer so the lantern reads as a live flame. A
          // still never runs out, so it never freezes.
          <>
            <Img src={resolve(imageSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            {warm && ambient?.rain ? (
              // Animated rain — masked to the window view (an ellipse over the
              // outdoor opening) so it never falls on the cosy interior. Two
              // diagonal streak layers at different speeds give depth; the
              // repeating gradient scrolls seamlessly via backgroundPosition.
              <AbsoluteFill
                style={{
                  WebkitMaskImage: "radial-gradient(ellipse 40% 31% at 50% 33%, #000 60%, transparent 84%)",
                  maskImage: "radial-gradient(ellipse 40% 31% at 50% 33%, #000 60%, transparent 84%)",
                }}
              >
                <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(101deg, rgba(228,240,255,0.11) 0px, rgba(228,240,255,0.11) 1px, transparent 1px, transparent 9px)", backgroundPosition: `0px ${(frame * 10).toFixed(1)}px`, opacity: 0.6, mixBlendMode: "screen" }} />
                <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(99deg, rgba(228,240,255,0.08) 0px, rgba(228,240,255,0.08) 1px, transparent 1px, transparent 14px)", backgroundPosition: `0px ${(frame * 6).toFixed(1)}px`, opacity: 0.5, mixBlendMode: "screen" }} />
              </AbsoluteFill>
            ) : null}
            {warm && ambient?.stars ? (
              // Gentle star twinkle over the upper sky (for clear-night images):
              // two faint speckled layers cross-fading, so a few stars breathe
              // without any whole-screen flicker. Masked to the sky band.
              <AbsoluteFill
                style={{
                  WebkitMaskImage: "linear-gradient(180deg, #000 0%, #000 40%, transparent 60%)",
                  maskImage: "linear-gradient(180deg, #000 0%, #000 40%, transparent 60%)",
                }}
              >
                <AbsoluteFill style={{ backgroundImage: "radial-gradient(1.4px 1.4px at 22% 18%, rgba(255,255,255,0.9), transparent), radial-gradient(1.2px 1.2px at 63% 12%, rgba(255,255,255,0.8), transparent), radial-gradient(1.3px 1.3px at 78% 26%, rgba(255,255,255,0.85), transparent), radial-gradient(1.1px 1.1px at 40% 30%, rgba(255,255,255,0.7), transparent)", opacity: 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(frame * 0.16)), mixBlendMode: "screen" }} />
                <AbsoluteFill style={{ backgroundImage: "radial-gradient(1.2px 1.2px at 33% 14%, rgba(255,255,255,0.8), transparent), radial-gradient(1.4px 1.4px at 55% 24%, rgba(255,255,255,0.85), transparent), radial-gradient(1.1px 1.1px at 70% 16%, rgba(255,255,255,0.75), transparent), radial-gradient(1.2px 1.2px at 48% 20%, rgba(255,255,255,0.7), transparent)", opacity: 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(frame * 0.16 + Math.PI)), mixBlendMode: "screen" }} />
              </AbsoluteFill>
            ) : null}
            {warm && ambient?.flame ? (
              // flame-locked shimmer (only the flame breathes) at the image's flame
              <AbsoluteFill style={{ background: `radial-gradient(circle at ${ambient.flame}, rgba(255,188,98,${(0.16 + 0.30 * flick).toFixed(3)}) 0%, rgba(255,150,60,${(0.07 + 0.13 * flick).toFixed(3)}) 4%, transparent 9%)`, mixBlendMode: "screen" }} />
            ) : null}
          </>
        ) : (
          // Loop the clip so one shorter than its beat repeats instead of holding
          // (freezing) on its last frame. One iteration plays `videoDuration`s of
          // footage at `rate`; when the clip already fills the beat the period is
          // ~the whole beat, so it never actually repeats (no-op for long clips).
          <Loop durationInFrames={loopFrames} layout="none">
            <OffthreadVideo src={resolve(src as string)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </Loop>
        )}
      </AbsoluteFill>
      {aura ? (
        <>
          {/* aura: minimal grade — keep the footage's natural cinematic colour,
              just a gentle vignette + slight overall darken so the big white
              glowing captions pop. The CineQuote scrims do the heavy lifting. */}
          <AbsoluteFill style={{ boxShadow: "inset 0 0 340px rgba(0,0,0,0.5)" }} />
          <AbsoluteFill style={{ background: "rgba(3,5,10,0.12)" }} />
        </>
      ) : warm ? (
        <>
          {/* cosy night storytime grade — protects a blue night sky + stars up top
              (cool, near-neutral, NOT amber) and only warms the lower third for a
              fire-glow feel and readable captions. Keeps campfire scenes magical. */}
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,14,24,0.34) 0%, rgba(10,14,24,0.0) 30%, rgba(24,15,9,0.22) 66%, rgba(12,8,5,0.8) 100%)" }} />
          <AbsoluteFill style={{ boxShadow: "inset 0 0 300px rgba(8,10,16,0.5)" }} />
          <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 80%, rgba(240,150,70,0.12), transparent 55%)" }} />
        </>
      ) : (
        <>
          {/* brand green tint + gold warmth */}
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(13,40,28,0.45) 0%, rgba(11,20,16,0.15) 35%, rgba(11,20,16,0.35) 70%, rgba(8,16,12,0.85) 100%)" }} />
          <AbsoluteFill style={{ boxShadow: "inset 0 0 320px rgba(0,0,0,0.55)", mixBlendMode: "multiply" }} />
          <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 42%, rgba(231,200,115,0.10), transparent 60%)" }} />
        </>
      )}
      {/* per-clip extra darkening for footage that is brighter than the grade */}
      {dim ? <AbsoluteFill style={{ background: `rgba(6,12,9,${clamp(dim, 0, 1)})` }} /> : null}
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
const CineCaption: React.FC<{ words?: StoryWord[]; warm?: boolean }> = ({ words = [], warm }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const wide = width > height; // 16:9 long-form vs 9:16 short
  const t = frame / fps;
  // Kids/warm captions read more aesthetic smaller and shorter (4 words/line).
  const lines = toLines(words, wide ? 7 : warm ? 4 : 5);
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
          fontFamily: warm ? NUNITO : PLAYFAIR,
          fontWeight: warm ? 700 : 700,
          // Smaller, more refined caption for the kids channel (owner: subtitles
          // smaller = more aesthetic); the Ketabi size is unchanged.
          fontSize: warm ? Math.round(fontSize * 0.7) : fontSize,
          lineHeight: warm ? 1.35 : 1.3,
          letterSpacing: warm ? 0.3 : 0,
          textAlign: "center",
          color: CREAM,
          // Warm kids look: NO caption box — soft floating text, kept legible over
          // busy footage (rain) by a layered glow instead of a background pill.
          textShadow: warm
            ? "0 2px 10px rgba(0,0,0,0.9), 0 0 26px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.6)"
            : "0 4px 26px rgba(0,0,0,0.95)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "4px 16px",
          maxWidth,
          background: warm ? "transparent" : "rgba(6,12,9,0.5)",
          padding: warm ? "6px 18px" : "20px 32px",
          borderRadius: warm ? 0 : 28,
          opacity: lineFade,
          transform: `translateY(${(1 - lineFade) * 12}px)`,
        }}
      >
        {line?.words.map((w, i) => {
          const active = t >= w.start - 0.03 && t < w.end + 0.12;
          const hi = warm ? WARM_HI : GOLD;
          return (
            <span key={i} style={{ color: active ? hi : CREAM, transition: "color 0.2s linear" }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const CineLabel: React.FC<{ kicker?: string; foot?: string; warm?: boolean }> = ({ kicker, foot, warm }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const wide = width > height;
  const fade = interpolate(frame, [4, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Kicker rides near the top; the source foot sits just above the lower-third
  // caption. Both insets shrink for the shorter 16:9 frame. The 9:16 caption
  // box is bottom-anchored at 600 and grows upward, so a three-line caption
  // tops out near 990 from the bottom - the pill sits above that to never
  // collide with a tall caption.
  const kickerTop = wide ? 80 : 300;
  const footBottom = wide ? 300 : 1000;
  return (
    <>
      {kicker ? (
        <div style={{ position: "absolute", top: kickerTop, width: "100%", display: "flex", justifyContent: "center", opacity: fade }}>
          <span style={warm
            ? { fontFamily: NUNITO, fontWeight: 800, letterSpacing: 6, fontSize: 27, color: WARM_HI, background: "transparent", padding: "4px 8px", borderRadius: 0, textShadow: "0 2px 10px rgba(0,0,0,0.85), 0 0 24px rgba(0,0,0,0.7)" }
            : { fontFamily: JOST, fontWeight: 500, letterSpacing: 8, fontSize: 28, color: GOLD, background: "rgba(6,12,9,0.42)", padding: "9px 22px", borderRadius: 16, textShadow: "0 2px 16px rgba(0,0,0,0.85)" }}>
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
// The source reference (foot) renders INSIDE the quote card: an ayah on screen
// must carry its citation on the same frame, per the accuracy rule.
const CineQuote: React.FC<{ arabic?: string; words?: StoryWord[]; kicker?: string; foot?: string; warm?: boolean; aura?: boolean }> = ({ arabic, words = [], kicker, foot, warm, aura }) => {
  const ACC = warm ? WARM_HI : GOLD;
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const wide = width > height;
  const t = frame / fps;
  const fade = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const flourish = interpolate(frame, [18, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Kids channel (warm): a subtle ketabistudio.com wordmark fades in on the verse
  // card AFTER the translation finishes reading, so the brand lands last without
  // touching the cozy bedtime vibe. Keyed to `warm` so every kids video gets it.
  const lastEnd = words.length ? Math.max(...words.map((w) => w.end)) : 2.2;
  const brandOp = interpolate(t, [lastEnd + 0.35, lastEnd + 1.15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // 16:9 has more width but much less height: tighten the vertical padding,
  // shrink the Arabic + translation a touch, and widen the text column so even
  // a longer narration line under the ayah never overflows the short frame.
  const padY = wide ? 70 : 200;
  const padX = wide ? 150 : 90;
  const arabicSize = wide ? 66 : 92;
  const transSize = wide ? 40 : 58;
  const maxWidth = wide ? 1500 : 900;
  // "aura" aesthetic: the Qur'an translation as big glowing white captions in the
  // CENTRE of the frame (word-by-word pop synced to the deep voice), the Arabic
  // small + elegant up top, the citation small at the bottom — over natural
  // cinematic b-roll (no boxed card, no heavy grade). The look lives in the type.
  if (aura) {
    const arSize = wide ? 44 : 54;
    const trSize = wide ? 64 : 86;
    return (
      <AbsoluteFill style={{ opacity: fade }}>
        {/* soft top + bottom scrims so white type reads over any footage */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 26%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.78) 100%)" }} />
        {/* soft centre scrim: a feathered dark ellipse behind the caption band so
            the white translation stays legible even over a bright sun-bloom, while
            the footage still reads at the edges (minimal, not a boxed card) */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 74% 32% at 50% 50%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 46%, rgba(0,0,0,0) 74%)" }} />
        {/* Arabic ayah — small, elegant, upper area */}
        {arabic ? (
          <div style={{ position: "absolute", top: wide ? "11%" : "14%", left: 0, right: 0, padding: "0 8%", textAlign: "center" }}>
            <div dir="rtl" style={{ fontFamily: ARABIC_DISPLAY_FONT, fontWeight: 700, fontSize: arSize, lineHeight: 1.75, color: "#ffffff", textShadow: "0 0 34px rgba(255,255,255,0.35), 0 2px 18px rgba(0,0,0,0.85)", opacity: 0.94 }}>{arabic}</div>
          </div>
        ) : null}
        {/* Translation — WORD BY WORD: the current short phrase (3-5 words) sits
            centred, and each word POPS in one at a time exactly as the deep voice
            says it (scale + fade), staying lit once spoken. Upcoming words in the
            phrase are held invisible but still reserve their space, so the line
            never reflows as words land. When the voice moves to the next phrase
            the group clears and the next one builds. Premium, minimal, kinetic. */}
        {(() => {
          const trLines = toLines(words, wide ? 5 : 3);
          let li = 0;
          for (let i = 0; i < trLines.length; i++) if (t >= trLines[i].start - 0.15) li = i;
          const cur = trLines[li];
          const groupEnd = cur?.words.length ? cur.words[cur.words.length - 1].end : 0;
          // gentle group fade so the swap between phrases is soft, not a hard cut
          const gIn = interpolate(t, [(cur?.start ?? 0) - 0.14, (cur?.start ?? 0) + 0.12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const gOut = interpolate(t, [groupEnd + 0.14, groupEnd + 0.42], [1, 0.86], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: wide ? "0 9%" : "0 10%" }}>
              <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: trSize, lineHeight: 1.3, textAlign: "center", color: "#ffffff", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 20px", maxWidth: wide ? 1400 : 820, opacity: Math.min(gIn, gOut) }}>
                {cur?.words.map((w, i) => {
                  // each word pops in as it is spoken; a slight overshoot then settle
                  const appear = interpolate(t, [w.start - 0.03, w.start + 0.15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const pop = interpolate(t, [w.start - 0.03, w.start + 0.13, w.start + 0.28], [0.72, 1.09, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
                  const active = t >= w.start - 0.04 && t < w.end + 0.2;
                  return (
                    <span
                      key={i}
                      style={{
                        display: "inline-block",
                        color: "#ffffff",
                        opacity: appear,
                        transform: `scale(${pop})`,
                        textShadow: active
                          ? "0 0 48px rgba(255,255,255,0.6), 0 4px 26px rgba(0,0,0,0.95)"
                          : "0 0 30px rgba(255,255,255,0.24), 0 4px 24px rgba(0,0,0,0.9)",
                      }}
                    >
                      {w.text}
                    </span>
                  );
                })}
              </div>
            </AbsoluteFill>
          );
        })()}
        {/* citation — small, bottom */}
        {foot ? (
          <div style={{ position: "absolute", bottom: wide ? "8%" : "10.5%", left: 0, right: 0, textAlign: "center", fontFamily: MONTSERRAT, fontWeight: 600, letterSpacing: 2, fontSize: wide ? 22 : 27, color: "rgba(255,255,255,0.85)", textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
            {foot.replace(/\s*\(shown, not recited\)\s*/gi, " ").replace(/\s+;/g, ";").trim()}
          </div>
        ) : null}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: warm ? "rgba(34,20,10,0.62)" : "rgba(6,12,9,0.55)", justifyContent: "center", alignItems: "center", padding: `${padY}px ${padX}px`, opacity: fade }}>
      {kicker ? (
        <div style={{ marginBottom: wide ? 28 : 40, fontFamily: warm ? NUNITO : JOST, fontWeight: warm ? 800 : 500, letterSpacing: warm ? 4 : 8, fontSize: 28, color: ACC }}>{kicker}</div>
      ) : null}
      <div dir="rtl" style={{ fontFamily: ARABIC_DISPLAY_FONT, fontWeight: 700, fontSize: arabicSize, lineHeight: 1.7, textAlign: "center", color: CREAM, textShadow: warm ? "0 0 50px rgba(240,175,95,0.45)" : "0 0 50px rgba(231,200,115,0.4)" }}>
        {arabic}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, margin: wide ? "30px 0" : "44px 0" }}>
        <div style={{ height: 1.5, width: 150 * flourish, background: `linear-gradient(90deg,transparent,${ACC})` }} />
        <div style={{ width: 14, height: 14, transform: "rotate(45deg)", background: ACC, opacity: flourish }} />
        <div style={{ height: 1.5, width: 150 * flourish, background: `linear-gradient(90deg,${ACC},transparent)` }} />
      </div>
      <div style={{ fontFamily: CORMORANT, fontStyle: "italic", fontWeight: 600, fontSize: transSize, lineHeight: 1.3, textAlign: "center", color: CREAM, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2px 14px", maxWidth }}>
        {words.map((w, i) => (
          <span key={i} style={{ opacity: t >= w.start - 0.12 ? 1 : 0.3, color: t >= w.start - 0.04 && t < w.end + 0.12 ? ACC : CREAM }}>
            {w.text}
          </span>
        ))}
      </div>
      {foot ? (
        <div style={{ marginTop: wide ? 28 : 42, opacity: flourish * 0.95 }}>
          <span style={{ fontFamily: JOST, fontWeight: 400, letterSpacing: 2, fontSize: 26, color: "rgba(247,241,226,0.92)", background: "rgba(6,12,9,0.42)", padding: "7px 18px", borderRadius: 14, textShadow: "0 2px 14px rgba(0,0,0,0.9)" }}>
            {/* strip the production note wherever it sits; the screen shows just the citation */}
            {foot.replace(/\s*\(shown, not recited\)\s*/gi, " ").replace(/\s+;/g, ";").trim()}
          </span>
        </div>
      ) : null}
      {warm ? (
        <div style={{ marginTop: wide ? 24 : 40, opacity: brandOp }}>
          <span style={{ fontFamily: NUNITO, fontWeight: 800, letterSpacing: 3, fontSize: 25, color: WARM_HI, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
            ketabistudio.com
          </span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Cinematic film-open title card: a gold, letter-spaced title rises out of the
// dark over the opening footage (the trembling lamp), with a gold flourish, like
// the open of a film. The narration plays underneath; no running caption here.
const CineTitle: React.FC<{ title: string; sub?: string; kicker?: string }> = ({ title, sub, kicker }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const wide = width > height;
  const t = frame / fps;
  const rise = interpolate(t, [0.6, 2.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flourish = interpolate(t, [1.8, 3.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const kfade = interpolate(t, [0.2, 1.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleSize = wide ? 132 : 120;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 8%" }}>
      {/* deepen the frame so the gold reads like a film title */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(6,12,9,0.45) 0%, rgba(5,10,8,0.82) 70%, rgba(4,8,6,0.95) 100%)" }} />
      {kicker ? (
        <div style={{ position: "relative", fontFamily: JOST, fontWeight: 300, letterSpacing: 14, fontSize: wide ? 26 : 30, color: GOLD, opacity: kfade, marginBottom: wide ? 30 : 44 }}>
          {kicker}
        </div>
      ) : null}
      <div
        style={{
          position: "relative",
          fontFamily: PLAYFAIR,
          fontWeight: 900,
          fontSize: titleSize,
          lineHeight: 1.04,
          letterSpacing: 3,
          textAlign: "center",
          color: GOLD,
          background: "linear-gradient(180deg,#f6e7b8 0%,#e7c873 46%,#bf9a45 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 60px rgba(231,200,115,0.35)",
          opacity: rise,
          transform: `translateY(${(1 - rise) * 26}px)`,
        }}
      >
        {title}
      </div>
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: 18, margin: wide ? "34px 0 0" : "46px 0 0" }}>
        <div style={{ height: 1.5, width: 180 * flourish, background: "linear-gradient(90deg,transparent,#e7c873)" }} />
        <div style={{ width: 13, height: 13, transform: "rotate(45deg)", background: GOLD, opacity: flourish }} />
        <div style={{ height: 1.5, width: 180 * flourish, background: "linear-gradient(90deg,#e7c873,transparent)" }} />
      </div>
      {sub ? (
        <div style={{ position: "relative", fontFamily: CORMORANT, fontStyle: "italic", fontWeight: 600, fontSize: wide ? 44 : 50, color: CREAM, opacity: flourish, marginTop: wide ? 22 : 30 }}>
          {sub}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// aura intro hook: the spoken line appears word-by-word over the b-roll, and a
// GOLD highlight bar sweeps across the marked word as it is spoken (the word inks
// dark once the sweep passes) — a premium, original take on the "highlighter"
// intro. Then the video opens into the ayah.
const CineHook: React.FC<{ words?: StoryWord[]; mark?: string }> = ({ words = [], mark }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const wide = width > height;
  const t = frame / fps;
  const fade = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const size = wide ? 54 : 66;
  const markN = (mark || "").toLowerCase().replace(/[^a-z]/g, "");
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.08) 62%, rgba(0,0,0,0.74) 100%)" }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: wide ? "0 10%" : "0 9%" }}>
        <div style={{ fontFamily: MONTSERRAT, fontWeight: 800, fontSize: size, lineHeight: 1.32, textAlign: "center", color: "#ffffff", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 16px", maxWidth: wide ? 1400 : 840, textShadow: "0 0 30px rgba(255,255,255,0.18), 0 4px 26px rgba(0,0,0,0.92)" }}>
          {words.map((w, i) => {
            const shown = t >= w.start - 0.12;
            const clean = w.text.toLowerCase().replace(/[^a-z]/g, "");
            const isMark = markN.length > 0 && clean === markN;
            if (isMark) {
              const sweep = interpolate(t, [w.start - 0.02, w.start + 0.45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
              const inked = sweep > 0.55;
              return (
                <span key={i} style={{ position: "relative", display: "inline-block", opacity: shown ? 1 : 0 }}>
                  <span style={{ position: "absolute", left: -6, right: -6, top: "12%", bottom: "8%", background: "linear-gradient(90deg,#f6e7b8,#e7c873)", transform: `scaleX(${sweep})`, transformOrigin: "left center", borderRadius: 4, boxShadow: "0 0 26px rgba(231,200,115,0.5)" }} />
                  <span style={{ position: "relative", color: inked ? "#0b0b0b" : "#ffffff", fontWeight: 900, transition: "color 0.15s linear", padding: "0 4px" }}>{w.text}</span>
                </span>
              );
            }
            return <span key={i} style={{ display: "inline-block", opacity: shown ? 1 : 0.3, transition: "opacity 0.2s linear" }}>{w.text}</span>;
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// One cinematic beat: footage + (title OR quote OR caption + labels).
// `warm` switches to the children's "kitab" storytime palette (soft amber grade,
// rounded font) instead of the dark green/gold cinematic grade.
export const CinematicBeat: React.FC<{ seg: StorySegment; warm?: boolean; hideBg?: boolean; aura?: boolean }> = ({ seg, warm, hideBg, aura }) => {
  return (
    <AbsoluteFill>
      {hideBg ? null : seg.map ? (
        isSceneName(seg.scene) ? (
          // Premium map composited over a code-generated backdrop (e.g. dunes),
          // kept legible by CineMap's lighter base.
          <>
            <Scene name={seg.scene} theme={themes.ketabi} />
            <CineMap view={seg.map} backdrop />
          </>
        ) : (
          <CineMap view={seg.map} />
        )
      ) : isSceneName(seg.scene) ? (
        // Code-generated cinematic scene (night sky, dunes, stone, rays, water,
        // embers) with a bottom scrim so the lower-third caption stays readable.
        <>
          <Scene name={seg.scene} theme={themes.ketabi} />
          <AbsoluteFill
            style={{ background: "linear-gradient(180deg, transparent 42%, rgba(6,13,10,0.55) 78%, rgba(5,11,8,0.9) 100%)" }}
          />
        </>
      ) : isFingerprintScene(seg.scene) ? (
        seg.videoSrc ? (
          // Premium composite: real cinematic texture (ink / gold dust / bokeh)
          // behind, the code-generated fingerprint glowing on top — so the beat
          // has filmic depth AND its subject (a fingerprint) is literally drawn.
          <>
            <CinematicBg src={seg.videoSrc} videoDuration={seg.videoDuration} />
            <FingerprintScene name={seg.scene as string} overlay />
          </>
        ) : (
          // No texture wired: the self-contained fingerprint backdrop.
          <FingerprintScene name={seg.scene as string} />
        )
      ) : seg.imageSrc ? (
        <CinematicBg imageSrc={seg.imageSrc} dim={seg.dim} warm={warm} aura={aura} />
      ) : seg.videoSrc ? (
        <CinematicBg src={seg.videoSrc} videoDuration={seg.videoDuration} dim={seg.dim} warm={warm} aura={aura} />
      ) : (
        <AbsoluteFill style={{ background: warm ? "#20140c" : aura ? "#05070c" : "#0b1410" }} />
      )}
      {seg.hook ? (
        <CineHook words={seg.words} mark={seg.hookMark} />
      ) : seg.title ? (
        <CineTitle title={seg.title} sub={seg.titleSub} kicker={seg.kicker} />
      ) : seg.arabic ? (
        <CineQuote arabic={seg.arabic} words={seg.words} kicker={seg.kicker} foot={seg.foot} warm={warm} aura={aura} />
      ) : (
        <>
          <CineLabel kicker={seg.kicker} foot={seg.foot} warm={warm} />
          <CineCaption words={seg.words} warm={warm} />
        </>
      )}
    </AbsoluteFill>
  );
};
