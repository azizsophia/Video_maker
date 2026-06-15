// Hifz (memorization) reveal logic.
//
// The teaching method: you HEAR a word, then SEE it — so words start hidden and
// reveal just after the reciter says them, building the ayah up word-by-word.
// Across the repetitions the difficulty ramps:
//   pass 0            → "Listen": full text shown, read along.
//   middle passes     → "Recall": words hidden, each revealed just after it's
//                        recited (with a small, growing delay so you get a beat
//                        to recall it first).
//   final pass        → "From memory": stays hidden the whole time, then the
//                        complete ayah reveals at the end as a self-check.

export type RevealMode = "always" | "afterWord" | "memory";

export type Reveal = {
  mode: RevealMode;
  delay: number; // extra seconds to hold the blank past the spoken word (afterWord)
};

export const revealForRepetition = (rep: number, repeats: number): Reveal => {
  if (repeats <= 1 || rep === 0) return { mode: "always", delay: 0 };
  if (rep === repeats - 1) return { mode: "memory", delay: 0 };
  // Middle "recall" passes: reveal just after each word, with a delay that
  // grows from 0 up to ~0.5s across the middle passes.
  const revealCount = repeats - 2; // number of middle passes
  const idx = rep - 1; // 0-based among them
  const delay = revealCount > 1 ? (idx / (revealCount - 1)) * 0.5 : 0.15;
  return { mode: "afterWord", delay };
};

export const repetitionLabel = (rep: number, repeats: number): string => {
  if (rep === 0) return `Listen · 1 / ${repeats}`;
  if (rep === repeats - 1) return `From memory · ${repeats} / ${repeats}`;
  return `Recall · ${rep + 1} / ${repeats}`;
};
