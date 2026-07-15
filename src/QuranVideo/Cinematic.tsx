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
import { PLAYFAIR, CORMORANT, JOST, NUNITO } from "./luxFonts";
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
export const CinematicBg: React.FC<{ src?: string; imageSrc?: string; videoDuration?: number; dim?: number; warm?: boolean }> = ({ src, imageSrc, videoDuration, dim, warm }) => {
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
            {warm ? (
              <AbsoluteFill style={{ background: `radial-gradient(circle at 81% 77%, rgba(255,188,98,${(0.16 + 0.30 * flick).toFixed(3)}) 0%, rgba(255,150,60,${(0.07 + 0.13 * flick).toFixed(3)}) 4%, transparent 9%)`, mixBlendMode: "screen" }} />
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
      {warm ? (
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
          fontFamily: warm ? NUNITO : PLAYFAIR,
          fontWeight: warm ? 800 : 700,
          fontSize: warm ? Math.round(fontSize * 0.94) : fontSize,
          lineHeight: 1.3,
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
const CineQuote: React.FC<{ arabic?: string; words?: StoryWord[]; kicker?: string; foot?: string; warm?: boolean }> = ({ arabic, words = [], kicker, foot, warm }) => {
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

// One cinematic beat: footage + (title OR quote OR caption + labels).
// `warm` switches to the children's "kitab" storytime palette (soft amber grade,
// rounded font) instead of the dark green/gold cinematic grade.
export const CinematicBeat: React.FC<{ seg: StorySegment; warm?: boolean; hideBg?: boolean }> = ({ seg, warm, hideBg }) => {
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
        <CinematicBg imageSrc={seg.imageSrc} dim={seg.dim} warm={warm} />
      ) : seg.videoSrc ? (
        <CinematicBg src={seg.videoSrc} videoDuration={seg.videoDuration} dim={seg.dim} warm={warm} />
      ) : (
        <AbsoluteFill style={{ background: warm ? "#20140c" : "#0b1410" }} />
      )}
      {seg.title ? (
        <CineTitle title={seg.title} sub={seg.titleSub} kicker={seg.kicker} />
      ) : seg.arabic ? (
        <CineQuote arabic={seg.arabic} words={seg.words} kicker={seg.kicker} foot={seg.foot} warm={warm} />
      ) : (
        <>
          <CineLabel kicker={seg.kicker} foot={seg.foot} warm={warm} />
          <CineCaption words={seg.words} warm={warm} />
        </>
      )}
    </AbsoluteFill>
  );
};
