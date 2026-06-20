// Tajweed rule classification comes from an authoritative tajweed-annotated
// edition (see scripts/fetch-ayahs.ts). Colors here are presentation only and
// are deliberately distinct and legible on dark backgrounds. The names follow
// the widely used tajweedjs / Quran.com class names.

export type TajweedRule = {
  color: string;
  label: string; // shown in the legend
};

export const TAJWEED_RULES: Record<string, TajweedRule> = {
  // Madd (elongation) — warm reds, intensity ~ length.
  madda_normal: { color: "#ff9d7a", label: "Madd (2)" },
  madda_permissible: { color: "#ff7a5c", label: "Madd Jaa'iz" },
  madda_necessary: { color: "#ff4d4d", label: "Madd Laazim" },
  madda_obligatory: { color: "#ff5e8a", label: "Madd Waajib" },
  // Nasalisation / merging — greens.
  ghunnah: { color: "#7cf0a8", label: "Ghunnah" },
  idgham_ghunnah: { color: "#5fe0c0", label: "Idghaam + Ghunnah" },
  idgham_wo_ghunnah: { color: "#b9f06e", label: "Idghaam no Ghunnah" },
  idgham_shafawi: { color: "#9be07c", label: "Idghaam Shafawi" },
  idgham_mutajanisayn: { color: "#8fe6a0", label: "Idghaam Mutajaanisayn" },
  idgham_mutaqaribayn: { color: "#8fe6c8", label: "Idghaam Mutaqaaribayn" },
  // Hiding — purples.
  ikhafa: { color: "#c79bff", label: "Ikhfaa" },
  ikhafa_shafawi: { color: "#b88bff", label: "Ikhfaa Shafawi" },
  // Conversion — amber.
  iqlab: { color: "#ffd36e", label: "Iqlaab" },
  // Echo — cyan.
  qalaqah: { color: "#6ee7ff", label: "Qalqalah" },
  // Silent / connecting hamza — greys.
  ham_wasl: { color: "#9aa7b3", label: "Hamzat Wasl" },
  laam_shamsiyah: { color: "#7c8794", label: "Laam Shamsiyyah" },
  slnt: { color: "#6b7785", label: "Silent" },
  end: { color: "#8aa0b6", label: "Ayah end" },
};

// Short codes some editions use in their markup -> canonical class names above.
const CODE_ALIASES: Record<string, string> = {
  h: "ham_wasl",
  s: "slnt",
  l: "laam_shamsiyah",
  n: "idgham_ghunnah",
  w: "idgham_wo_ghunnah",
  m: "madda_normal",
  p: "madda_permissible",
  q: "qalaqah",
  i: "ikhafa",
  b: "iqlab",
  g: "ghunnah",
};

export const canonicalRule = (code: string): string =>
  TAJWEED_RULES[code] ? code : CODE_ALIASES[code] ?? code;

export const tajweedColor = (rule: string | null, fallback: string): string => {
  if (!rule) return fallback;
  const r = TAJWEED_RULES[canonicalRule(rule)];
  return r ? r.color : fallback;
};

export type Run = { text: string; rule: string | null };

/**
 * Parse a tajweed-annotated string into runs.
 *
 * Handles the common bracket markup `[<code>:<id>[<text>]` and `[<code>[<text>]`
 * and returns both the runs and the clean (markup-free) text so the caller can
 * VERIFY it against the authoritative Uthmani text. Text outside any tag becomes
 * un-ruled runs (rule: null). Unknown codes are kept verbatim as the rule name
 * so nothing is silently mis-coloured.
 */
export const parseTajweed = (annotated: string): { runs: Run[]; clean: string } => {
  const runs: Run[] = [];
  let clean = "";
  // Matches [code:id[text]  or  [code[text]
  const re = /\[([a-zA-Z_]+)(?::\d+)?\[([^\]]*)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(annotated)) !== null) {
    if (m.index > last) {
      const plain = annotated.slice(last, m.index);
      runs.push({ text: plain, rule: null });
      clean += plain;
    }
    const rule = canonicalRule(m[1]);
    runs.push({ text: m[2], rule });
    clean += m[2];
    last = re.lastIndex;
  }
  if (last < annotated.length) {
    const plain = annotated.slice(last);
    runs.push({ text: plain, rule: null });
    clean += plain;
  }
  return { runs, clean };
};
