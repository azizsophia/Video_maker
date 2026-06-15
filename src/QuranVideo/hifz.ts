// Deterministic helpers for Hifz (memorization) mode.

// Small seeded PRNG so the same ayah always blanks words in the same order
// (stable across re-renders, but varied between ayahs).
const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// A stable shuffled order of word indices for a given ayah.
export const seededOrder = (count: number, seed: number): number[] => {
  const rng = mulberry32(seed + count * 7919);
  const arr = Array.from({ length: count }, (_, i) => i);
  for (let i = count - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// Which words are hidden on repetition `rep` (0-based) out of `repeats`.
// rep 0 shows everything; the final rep hides everything.
export const hiddenForRepetition = (
  wordCount: number,
  rep: number,
  repeats: number,
  seed: number
): number[] => {
  const level = repeats <= 1 ? 1 : rep / (repeats - 1);
  const hideCount = Math.round(level * wordCount);
  return seededOrder(wordCount, seed).slice(0, hideCount);
};

export const repetitionLabel = (rep: number, repeats: number): string => {
  if (rep === 0) return `Listen · 1 / ${repeats}`;
  if (rep === repeats - 1) return `From memory · ${repeats} / ${repeats}`;
  return `Repeat · ${rep + 1} / ${repeats}`;
};
