// Hifz (memorization) pass structure.
//
// Memorization sticks when the learner ACTS, not just watches. So each ayah
// runs through a graded sequence of passes:
//
//   Listen      → full text + meaning + transliteration, recite along.
//   Follow      → text hidden, each word reveals just after the reciter says
//                 it (hear-then-see build-up). No crutches.
//   Recall      → text hidden; after the reciter finishes there's a silent
//                 "Your turn" beat to recite from memory, then the full ayah
//                 reveals to confirm.
//   From memory → hidden throughout + a "Your turn" beat, then a final reveal.

export type RevealKind = "always" | "build" | "afterGap" | "end";

export type HifzPass = {
  label: string;
  reveal: RevealKind;
  responseGap: boolean; // insert a silent "your turn" beat after the recitation
};

export const passForRepetition = (rep: number, repeats: number): HifzPass => {
  if (repeats <= 1 || rep === 0)
    return { label: `Listen · 1 / ${repeats}`, reveal: "always", responseGap: false };
  if (rep === repeats - 1)
    return {
      label: `From memory · ${repeats} / ${repeats}`,
      reveal: "end",
      responseGap: true,
    };
  // Middle passes: the first is a gentle "Follow" build-up, the rest are
  // active "Recall" passes with a your-turn gap.
  const middleIdx = rep - 1; // 0-based among the middle passes
  if (middleIdx === 0)
    return { label: `Follow · ${rep + 1} / ${repeats}`, reveal: "build", responseGap: false };
  return { label: `Recall · ${rep + 1} / ${repeats}`, reveal: "afterGap", responseGap: true };
};
