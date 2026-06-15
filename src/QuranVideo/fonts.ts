// Fonts are bundled locally via @fontsource (no network needed at render time),
// then we explicitly wait for them so text never renders un-styled.
import "@fontsource/amiri/400.css";
import "@fontsource/amiri/700.css";
import "@fontsource/scheherazade-new/400.css";
import "@fontsource/scheherazade-new/700.css";
import { continueRender, delayRender } from "remotion";

export const ARABIC_FONT = "Amiri";
export const ARABIC_DISPLAY_FONT = '"Scheherazade New"';
export const TRANSLATION_FONT = 'Georgia, "Times New Roman", serif';

const handle = delayRender("Loading Arabic fonts");

if (typeof document !== "undefined" && "fonts" in document) {
  Promise.all([
    document.fonts.load("400 100px Amiri"),
    document.fonts.load("700 100px Amiri"),
    document.fonts.load('700 100px "Scheherazade New"'),
  ])
    .then(() => continueRender(handle))
    .catch(() => continueRender(handle));
} else {
  continueRender(handle);
}
