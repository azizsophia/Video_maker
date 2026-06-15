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
const clear = () => continueRender(handle);

if (typeof document !== "undefined" && "fonts" in document) {
  const load = Promise.all([
    document.fonts.load("400 100px Amiri"),
    document.fonts.load("700 100px Amiri"),
    document.fonts.load('400 100px "Scheherazade New"'),
    document.fonts.load('700 100px "Scheherazade New"'),
  ])
    .then(() => document.fonts.ready)
    .then(() => undefined);

  // Safety net: on some render tabs document.fonts.load() never settles, which
  // would stall the frame until delayRender times out (~28s) and the whole
  // render fails. Cap the wait — the bundled @fontsource fonts load well within
  // this, so quality is unaffected; we just never hang.
  const cap = new Promise<void>((resolve) => setTimeout(resolve, 4000));

  Promise.race([load, cap]).then(clear, clear);
} else {
  clear();
}
