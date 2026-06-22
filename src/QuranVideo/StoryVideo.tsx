import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  random,
} from "remotion";
import { StoryProps, StorySegment, StoryWord } from "./storySchema";
import { themes, ThemePalette } from "./themes";
import { SceneLayer } from "./scenes";
import { FULL_VISUAL_SCENES } from "./explainer";
import { ARABIC_DISPLAY_FONT, TRANSLATION_FONT } from "./fonts";

export const STORY_FPS = 30;
const EMBER = "rgba(255, 176, 92, 1)"; // warm ember tint for atmosphere

const resolveAudio = (src: string): string =>
  /^https?:\/\//.test(src) ? src : staticFile(src);

export const storyDurationInFrames = (props: StoryProps): number => {
  const end = props.segments.reduce(
    (m, s) => Math.max(m, s.fromSeconds + s.durationInSeconds),
    0
  );
  return Math.max(1, Math.round((end + 0.6) * STORY_FPS));
};

// --- Atmosphere: slowly drifting embers/dust, behind everything ---------------
const Embers: React.FC<{ count?: number; warm?: boolean }> = ({ count = 26, warm }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const span = height + 200;
  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const seed = i + 1;
        const x = random(`x${seed}`) * width;
        const size = 2 + random(`s${seed}`) * 5;
        const speed = 0.6 + random(`v${seed}`) * 1.4;
        const raw = random(`y${seed}`) * span + frame * speed;
        const y = span - (raw % span) - 100;
        const drift = Math.sin(frame / fps + seed) * 26;
        const flick = 0.25 + 0.55 * Math.abs(Math.sin(frame / fps * 1.6 + seed));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + drift,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: warm ? EMBER : "rgba(220,235,255,0.9)",
              opacity: flick * (warm ? 0.7 : 0.4),
              filter: "blur(1px)",
              boxShadow: `0 0 ${size * 3}px ${warm ? EMBER : "rgba(200,225,255,0.8)"}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// --- Narration captions (synced, dramatic) ------------------------------------
const toLines = (words: StoryWord[], perLine = 4) => {
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
  hook?: boolean;
  theme: ThemePalette;
  footage?: boolean;
}> = ({ words = [], source, hook, theme, footage }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const wide = width > height;
  const t = frame / fps;
  const lines = toLines(words, wide ? 5 : 3);
  let idx = 0;
  for (let i = 0; i < lines.length; i++) if (t >= lines[i].start - 0.12) idx = i;
  const line = lines[idx];
  const lineFrame = frame - Math.round((line?.start ?? 0) * fps);
  const appear = spring({ frame: lineFrame, fps, config: { damping: 200 } });
      const fontSize = (hook ? 100 : 84) * (wide ? 0.8 : 1);

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: wide ? "0 150px" : "0 64px" }}
    >
      {/* Modern, calm captions: the whole line is fully visible (no per-word
          dim/blink, no colour flips, no zoom). Only the spoken word glides up a
          touch with a soft warm-white glow, so it reads as karaoke without the
          flicker. The line itself fades + rises in once, smoothly. */}
      <div
        style={{
          fontFamily: TRANSLATION_FONT,
          fontSize,
          fontWeight: 800,
          lineHeight: 1.22,
          letterSpacing: -0.5,
          textAlign: "center",
          color: "#ffffff",
          opacity: appear,
          transform: `translateY(${(1 - appear) * 12}px)`,
        }}
      >
        {line?.words.map((w, i) => {
          const active = t >= w.start - 0.03 && t < w.end + 0.08;
          return (
            <React.Fragment key={i}>
              <span
                style={{
                  display: "inline-block",
                  color: "#ffffff",
                  transform: active ? "scale(1.09)" : "scale(1)",
                  transition: "transform 0.18s cubic-bezier(0.2,0.8,0.2,1), text-shadow 0.18s ease",
                  textShadow: active
                    ? "0 0 26px rgba(255,236,196,0.7), 0 4px 18px rgba(0,0,0,0.95)"
                    : "0 3px 16px rgba(0,0,0,0.92)",
                }}
              >
                {w.text}
              </span>
              {i < (line?.words.length ?? 0) - 1 ? " " : ""}
            </React.Fragment>
          );
        })}
      </div>
      {source ? (
        <div
          style={{
            position: "absolute",
            bottom: wide ? 96 : 232,
            fontFamily: TRANSLATION_FONT,
            fontSize: 26,
            letterSpacing: 1.5,
            color: footage ? "#f4f1ea" : theme.accent,
            opacity: 0.92,
            background: "rgba(0,0,0,0.5)",
            padding: "9px 20px",
            borderRadius: 22,
            border: `1px solid ${footage ? "rgba(255,255,255,0.35)" : theme.accent + "55"}`,
          }}
        >
          {source}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// --- Ayah card (dramatic; molten "ember" variant for the wall) ----------------
const AyahCard: React.FC<{
  arabic?: string;
  translation?: string;
  source?: string;
  ember?: boolean;
  theme: ThemePalette;
  footage?: boolean;
}> = ({ arabic, translation, source, ember, theme, footage }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const wide = width > height;
  const fadeIn = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [durationInFrames - 16, durationInFrames - 2], [1, 0], {
    extrapolateLeft: "clamp",
  });
  const opacity = Math.min(fadeIn, fadeOut);
  const transReveal = spring({ frame: frame - 12, fps, config: { damping: 200 } });
  const kb = 1; // steady — no slow zoom (it read as "shaky" over moving footage)
  // Over footage, keep the verse clean white with a soft glow (warm theme tints
  // clash with fire) and sit it on a dark scrim so it's always readable.
  const glow = footage ? "rgba(0,0,0,0.0)" : ember ? "rgba(255,150,60,0.75)" : theme.arabicGlow;
  const arabicColor = footage ? "#ffffff" : ember ? "#fff1e0" : theme.arabicActive;

  // Auto-fit: long verses (e.g. Ayat al-Kursi, 2:255) must never overflow or
  // clip. Scale the Arabic + translation down by character count so the whole
  // ayah and its translation always sit inside the (TikTok/Shorts-safe) frame.
  const alen = (arabic ?? "").length;
  const arabicSize = wide
    ? alen > 260 ? 44 : alen > 180 ? 56 : alen > 120 ? 68 : alen > 60 ? 82 : 92
    : alen > 260 ? 50 : alen > 180 ? 60 : alen > 120 ? 74 : alen > 60 ? 90 : 104;
  const tlen = (translation ?? "").length;
  const transSize = wide
    ? tlen > 220 ? 32 : 40
    : tlen > 220 ? 34 : tlen > 120 ? 40 : 44;

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: wide ? "0 150px" : "190px 70px", opacity }}
    >
      {ember && !footage ? (
        <AbsoluteFill
          style={{
            background: "radial-gradient(circle at 50% 45%, rgba(255,120,40,0.22), transparent 55%)",
          }}
        />
      ) : null}
      {/* Dark readability scrim so the verse always reads over busy footage. */}
      {footage ? (
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse 78% 52% at 50% 47%, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.5) 55%, transparent 100%)",
            opacity,
          }}
        />
      ) : null}
      <div
        style={{
          transform: `scale(${kb})`,
          textAlign: "center",
          maxHeight: height * (wide ? 0.82 : 0.7),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          dir="rtl"
          style={{
            fontFamily: ARABIC_DISPLAY_FONT,
            fontWeight: 700,
            fontSize: arabicSize,
            lineHeight: 1.62,
            maxWidth: wide ? 1500 : 960,
            color: arabicColor,
            textShadow: footage ? "0 4px 28px rgba(0,0,0,0.95), 0 0 18px rgba(0,0,0,0.8)" : `0 0 46px ${glow}`,
          }}
        >
          {arabic}
        </div>
        <div
          style={{
            marginTop: wide ? 30 : 40,
            maxWidth: wide ? 1300 : 920,
            fontFamily: TRANSLATION_FONT,
            fontSize: transSize,
            lineHeight: 1.42,
            color: footage ? "#f4f1ea" : theme.translation,
            textShadow: footage ? "0 3px 18px rgba(0,0,0,0.95)" : undefined,
            opacity: transReveal,
            transform: `translateY(${(1 - transReveal) * 22}px)`,
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
              letterSpacing: 2.5,
              color: footage ? "#e9d9a8" : ember ? "#ffb060" : theme.accent,
              textShadow: footage ? "0 2px 12px rgba(0,0,0,0.9)" : undefined,
              opacity: transReveal * 0.95,
              textTransform: "uppercase",
            }}
          >
            {source}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// --- Title card (storytelling opener, e.g. "The Story of Prophet Ibrahim") -----
const TitleCard: React.FC<{ title: string; sub?: string; theme: ThemePalette; footage?: boolean }> = ({
  title,
  sub,
  theme,
  footage,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const wide = width > height;
  const appear = spring({ frame: frame - 4, fps, config: { damping: 200 } });
  const fadeOut = interpolate(frame, [durationInFrames - 16, durationInFrames - 2], [1, 0], { extrapolateLeft: "clamp" });
  const kb = 1; // steady title (no zoom)
  const rule = interpolate(spring({ frame: frame - 14, fps, config: { damping: 200 } }), [0, 1], [0, 1]);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: wide ? "0 150px" : "0 80px", opacity: Math.min(appear, fadeOut) }}>
      {footage ? (
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }} />
      ) : null}
      <div style={{ transform: `scale(${kb}) translateY(${(1 - appear) * 20}px)`, textAlign: "center" }}>
        <div style={{ fontFamily: TRANSLATION_FONT, fontWeight: 500, fontSize: wide ? 30 : 34, letterSpacing: 6, textTransform: "uppercase", color: footage ? "#e9d9a8" : theme.accent, textShadow: "0 3px 18px rgba(0,0,0,0.9)", marginBottom: 26, opacity: 0.92 }}>
          A Quran Story
        </div>
        {title.split("\n").map((ln, i) => (
          <div key={i} style={{ fontFamily: TRANSLATION_FONT, fontWeight: 800, fontSize: wide ? 96 : 110, lineHeight: 1.08, color: "#ffffff", textShadow: "0 6px 34px rgba(0,0,0,0.92)" }}>
            {ln}
          </div>
        ))}
        <div style={{ height: 3, width: `${Math.round(rule * (wide ? 360 : 300))}px`, margin: "34px auto 0", background: footage ? "#e9d9a8" : theme.accent, opacity: 0.9, borderRadius: 2 }} />
        {sub ? (
          <div style={{ fontFamily: TRANSLATION_FONT, fontStyle: "italic", fontSize: wide ? 34 : 40, color: "#f4f1ea", textShadow: "0 3px 16px rgba(0,0,0,0.92)", marginTop: 26, opacity: 0.95 }}>
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// Cinematic legibility gradient shown over footage beats (darker top + bottom,
// Footage beats render a solid CHROMA-KEY green here; ffmpeg keys it out and
// drops the (already gradient-darkened) footage track behind, with the
// calligraphy/captions on top. Pure #00ff00 never appears in the nature footage
// (fire/sand/sky/water), so the key is clean. Rendering an OPAQUE green (instead
// of a transparent/alpha frame) keeps Remotion on its fast JPEG path — the whole
// point: footage videos render at the ~9 min baseline, not 50-80 min.
const CHROMA_KEY = "#00ff00";
const ChromaFill: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: CHROMA_KEY }} />
);

export const StoryVideo: React.FC<StoryProps> = (props) => {
  const theme = themes[props.theme];
  // Footage mode: the Pexels footage is composited UNDER this render by ffmpeg
  // (see render-story.yml), NOT decoded inside Remotion. The render stays OPAQUE
  // (fast JPEG): footage beats are painted chroma-green for ffmpeg to key out and
  // replace with the footage track; code-scene beats render their opaque scene.
  const footageMode = !!props.backgroundSrc;
  // Group consecutive segments sharing a scene so the illustrated backdrop only
  // crossfades on real scene changes.
  const spans: { scene?: string; data?: unknown; stock?: string; start: number; end: number }[] = [];
  props.segments.forEach((s) => {
    const last = spans[spans.length - 1];
    const end = s.fromSeconds + s.durationInSeconds;
    const stock = (s as { stock?: string }).stock;
    if (last && last.scene === s.scene && last.stock === stock) last.end = end;
    else spans.push({ scene: s.scene, data: (s as { data?: unknown }).data, stock, start: s.fromSeconds, end });
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.background }}>
      {spans.map((sp, i) => {
        const isFootage = !!sp.stock && footageMode;
        // Code scenes get ±frames of padding so the illustrated backdrop
        // crossfades smoothly; footage (chroma) beats use exact bounds so the key
        // colour never bleeds a frame into a neighbouring code scene.
        const from = isFootage
          ? Math.round(sp.start * STORY_FPS)
          : Math.max(0, Math.round(sp.start * STORY_FPS) - 8);
        const dur = isFootage
          ? Math.max(1, Math.round((sp.end - sp.start) * STORY_FPS))
          : Math.round((sp.end - sp.start) * STORY_FPS) + 16;
        return (
          <Sequence key={`scene-${i}`} from={from} durationInFrames={dur}>
            {isFootage ? (
              <ChromaFill />
            ) : (
              <SceneLayer name={sp.scene} theme={theme} data={sp.data} />
            )}
          </Sequence>
        );
      })}
      {/* Gentle darken for caption legibility (skip in footage mode — the gradient
          is baked into the footage track and we want the footage crisp). */}
      {footageMode ? null : <AbsoluteFill style={{ background: "rgba(0,0,0,0.24)" }} />}

      {/* Atmospheric bed (sound effect, never music). */}
      {props.ambientSrc ? (
        <Audio src={resolveAudio(props.ambientSrc)} loop volume={0.16} />
      ) : null}

      {props.segments.map((seg: StorySegment, i: number) => {
        const from = Math.round(seg.fromSeconds * STORY_FPS);
        const dur = Math.round(seg.durationInSeconds * STORY_FPS);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Audio src={resolveAudio(seg.audioSrc)} />
            {seg.sfxSrc ? <Audio src={resolveAudio(seg.sfxSrc)} volume={0.55} /> : null}
            {/* Verse recitation: starts just after the English narration line and
                plays while the ayah holds on screen (authentic reciter audio). */}
            {seg.recSrc ? (
              <Sequence from={Math.round((seg.recStart ?? 0) * STORY_FPS)}>
                <Audio src={resolveAudio(seg.recSrc)} volume={0.92} />
              </Sequence>
            ) : null}
            {seg.ember ? <Embers warm count={34} /> : null}
            {FULL_VISUAL_SCENES.includes(seg.scene ?? "") ? null : seg.title ? (
              <TitleCard title={seg.title} sub={seg.titleSub} theme={theme} footage={footageMode} />
            ) : seg.kind === "narration" && seg.arabic ? (
              <AyahCard
                arabic={seg.arabic}
                translation={seg.translation}
                source={seg.source}
                theme={theme}
                footage={footageMode}
              />
            ) : seg.kind === "narration" ? (
              <Narration words={seg.words} source={seg.source} hook={seg.hook} theme={theme} footage={footageMode} />
            ) : (
              <AyahCard
                arabic={seg.arabic}
                translation={seg.translation}
                source={seg.source}
                ember={seg.ember}
                theme={theme}
                footage={footageMode}
              />
            )}
          </Sequence>
        );
      })}

      {/* Edge vignette for cinematic framing. */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 50% 45%, transparent 30%, rgba(0,0,0,0.55) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Persistent brand watermark — crisp this time: solid white, bold, a real
          dark plate behind it so it stays sharp over any footage and after
          compression. Sits high (top) to clear the TikTok caption/UI at the
          bottom. */}
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 54, pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: TRANSLATION_FONT,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 1.5,
            color: "#ffffff",
            opacity: 0.92,
            padding: "8px 18px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.42)",
            textShadow: "0 2px 10px rgba(0,0,0,0.9)",
          }}
        >
          {props.websiteUrl}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
