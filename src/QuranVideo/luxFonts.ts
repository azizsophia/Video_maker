// Premium typography for the institutional style, loaded the Remotion way
// (delayRender-aware) so headless renders wait for the faces.
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadJost } from "@remotion/google-fonts/Jost";
// Warm, rounded, friendly face for the children's "kitab" storytime channel.
import { loadFont as loadNunito } from "@remotion/google-fonts/Nunito";

export const PLAYFAIR = loadPlayfair("normal", { weights: ["500", "700", "900"] }).fontFamily;
export const CORMORANT = loadCormorant("italic", { weights: ["500", "600"] }).fontFamily;
export const JOST = loadJost("normal", { weights: ["300", "400", "500"] }).fontFamily;
export const NUNITO = loadNunito("normal", { weights: ["400", "700", "800"] }).fontFamily;
// Clean geometric sans for the "aura" aesthetic (big glowing Qur'an-translation
// captions over cinematic b-roll, sacredayah style).
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
export const MONTSERRAT = loadMontserrat("normal", { weights: ["500", "700", "800", "900"] }).fontFamily;
