// Fonts are bundled locally via @fontsource (no network needed at render time),
// then we explicitly wait for them so text never renders un-styled.
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "@fontsource/scheherazade-new/400.css";
import "@fontsource/scheherazade-new/700.css";

export const ARABIC_FONT = "Amiri";
export const ARABIC_DISPLAY_FONT = '"Scheherazade New"';
export const TRANSLATION_FONT = 'Georgia, "Times New Roman", serif';
// Heavy sans for modern, punchy short-form captions (TikTok/Reels style).
// Uses fonts present in the headless render (Liberation/Arial, DejaVu).
export const CAPTION_FONT =
  'Arial, "Helvetica Neue", "Liberation Sans", system-ui, sans-serif';

// The Arabic fonts are bundled locally via @fontsource — the CSS imports above
// register their @font-face rules at load time, so they apply effectively
// immediately. We deliberately do NOT gate rendering on document.fonts.load():
// in the headless render that promise can fail to settle on some frame tabs,
// and (because Remotion freezes in-page timers during a frame) there's no
// reliable in-page way to time out the wait — which previously left a
// delayRender uncleared and failed the whole render after ~28s.
//
// Fire-and-forget a load() nudge so the faces are requested as early as
// possible, but never await it, so it can never block or fail a frame.
if (typeof document !== "undefined" && "fonts" in document) {
  void Promise.allSettled([
    document.fonts.load("400 100px Amiri"),
    document.fonts.load("700 100px Amiri"),
    document.fonts.load('400 100px "Scheherazade New"'),
    document.fonts.load('700 100px "Scheherazade New"'),
  ]);
}
