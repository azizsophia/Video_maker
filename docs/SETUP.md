# Setup

## 1. Network allowlist (Claude Code web sessions only)

This dev environment restricts outbound network to an allowlist. To let me run
the fetcher and render videos *from here*, add these hosts in your environment's
**network egress settings**:

| Host | Why |
|---|---|
| `registry.npmjs.org` | install packages (usually already allowed) |
| `remotion.media` | download the headless Chrome that renders frames |
| `api.quran.com` | surah text, translations, word-by-word timing segments |
| `verses.quran.com` | per-ayah reciter audio files |
| `api.elevenlabs.io` | (later, M2) British narrator voice |
| `fonts.gstatic.com` | (optional) extra web fonts — Arabic fonts are bundled locally already |

You do **not** need this for the GitHub Action — GitHub runners have open
internet, so phone-triggered renders work without any allowlist changes.

## 2. ElevenLabs (for M2 — the story/narrator template)

1. Create an account at <https://elevenlabs.io> and grab your API key.
2. Pick (or clone) the British narrator voice you like and note its `voice_id`.
3. Add them as repo secrets / env vars: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`.

The Quran template (M1) does **not** use TTS — it uses real reciter audio — so
you can ship Quran videos before setting this up.

## 3. Google Drive auto-upload (optional)

To have finished videos land in your Drive automatically:

1. In Google Cloud, create a **service account** and enable the **Drive API**.
2. Download its JSON key. Share your target Drive folder with the service
   account's email, and copy the folder id from its URL.
3. Add repo secrets:
   - `GDRIVE_CREDENTIALS` — the full service-account JSON
   - `GDRIVE_FOLDER_ID` — the destination folder id
4. The render workflow has a guarded "Upload to Google Drive" step that activates
   once `GDRIVE_FOLDER_ID` is present.

## 4. Reciter & translation ids (Quran.com)

**Reciters** (`--recitation`): `1` AbdulBaset (Mujawwad) · `2` AbdulBaset
(Murattal) · `3` Sudais · `4` Shatri · `5` Hani ar-Rifai · `6` Husary ·
`7` Mishary Alafasy.

**Translations** (`--translation`): `20` Saheeh International · `131` The Clear
Quran (Dr. Mustafa Khattab) · `85` (Pickthall) and more at
<https://api.quran.com/api/v4/resources/translations>.
