// Premium typography for the institutional style, loaded the Remotion way
// (delayRender-aware) so headless renders wait for the faces.
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";
import { loadFont as loadCormorant } from "@remotion/google-fonts/CormorantGaramond";
import { loadFont as loadJost } from "@remotion/google-fonts/Jost";

export const PLAYFAIR = loadPlayfair("normal", { weights: ["500", "700", "900"] }).fontFamily;
export const CORMORANT = loadCormorant("italic", { weights: ["500", "600"] }).fontFamily;
export const JOST = loadJost("normal", { weights: ["300", "400", "500"] }).fontFamily;
