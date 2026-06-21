# Accuracy protocol (Quran content is sensitive — this is mandatory)

The goal is not "trust the model's memory." It is to **engineer accuracy in so errors are caught, not relied on.** Five layers:

## 1. Authoritative sources, never memory, never hand-typed
- **Quran:** every verse is auto-pulled from Quran.com by reference (`verseRef`). The build **fails** if Arabic is hand-typed in a narration segment without a `verseRef` (the accuracy guard in `scripts/fetch-story.ts`).
- **Facts/structure:** drawn from the curated, sourced library `scripts/facts/surahs.json` — not recalled. Extend that file (with citations) rather than asserting from memory.
- **Hadith:** flagged + verified + on the fact sheet. (See #2 for auto-pull plan.)

### Action needed from you (one-time): allowlist research sources
So I can **verify by fetching while drafting** (not recall), add these hosts to this environment's **network egress allowlist** (Settings → network policy, then start a fresh web session):
- `quran.com` and `api.quran.com` (verses + tafsir)
- `sunnah.com` (hadith + grading)
- `tanzil.net` (Uthmani text cross-check)

Until then, the render pipeline still reaches `api.quran.com` (so verses are safe), but my drafting research is limited to memory + this library.

## 2. Hadith auto-pull (planned)
Replace hand-typed hadith Arabic with a `hadithRef` resolver that pulls text + grading from sunnah.com (needs the allowlist above, and possibly an API key). Until built: hadith stays hand-typed **but** must be (a) flagged `"hadith": true`, (b) verified against sunnah.com, (c) on the fact sheet with its grade, and (d) only used when authentic (sahih/hasan). Contested-grade virtue-hadith are cut (e.g. Ar-Rahman is Quran-only).

## 3. Claims manifest + fact sheet (every render)
Each story declares a top-level `claims` array — every on-screen factual assertion + its source:
```json
"claims": [
  { "claim": "The refrain recurs 31 times", "source": "Textual count across Surah 55" }
]
```
`fetch-story.ts` writes `story-facts.txt` containing: the auto-pulled verses/hadith, the **claims review checklist**, the sources, and a **sign-off block**. This file is in every render's artifact.

## 4. Bulletproof-only
State only what is (a) explicit in a cited verse, or (b) established scholarly consensus. Anything interpretive is **attributed** ("scholars note…") or **cut**. When in doubt, cut it.

## 5. Human / scholar sign-off (the real final gate)
**Nothing posts until `story-facts.txt` is reviewed.** No automation replaces a knowledgeable human checking the claims against the sources. For sensitive episodes, get a scholar/student-of-knowledge to glance at the fact sheet.

---

### Per-video checklist
- [ ] All Arabic auto-pulled (no hand-typed verses) — guard passed
- [ ] `claims` declared for every on-screen fact, each with a source
- [ ] Facts came from `scripts/facts/surahs.json` (or were added there with citations)
- [ ] Hadith authentic, flagged, graded, on the fact sheet
- [ ] `story-facts.txt` reviewed + signed off before posting
