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

## 3. Google Drive auto-upload

Finished videos upload straight to your Drive from the render workflow (no
base64, no size limit). The uploader is `scripts/upload_to_drive.py`; the
"Upload to Google Drive" step runs automatically once the secrets below exist.

### Recommended for a personal @gmail — OAuth refresh token

A service account **cannot** store files in a consumer (personal) Google Drive
(it has no storage quota there), so use the OAuth method — the upload happens as
*you*, and files land in your Drive normally. All steps are phone-browser doable.

**A) Make an OAuth client (Google Cloud Console, signed in as your channel gmail)**
1. **console.cloud.google.com** → create a project (e.g. `Ketabi`).
2. Search **Google Drive API** → **Enable**.
3. **APIs & Services → OAuth consent screen** → External → fill the name/emails.
   Under **Audience**, either add your gmail under **Test users**, *or* tap
   **Publish app** (publishing avoids the "app not verified / access blocked"
   wall on the next step).
4. **APIs & Services → Credentials → Create credentials → OAuth client ID** →
   **Web application** → add redirect URI
   `https://developers.google.com/oauthplayground` → Create. Copy the
   **Client ID** and **Client secret**.

**B) Get a refresh token (OAuth Playground)**
1. **developers.google.com/oauthplayground** → gear ⚙︎ → check
   **Use your own OAuth credentials** → paste your Client ID + secret.
2. In Step 1, paste the scope `https://www.googleapis.com/auth/drive` →
   **Authorize APIs** → sign in → (if warned) **Advanced → continue**.
3. Step 2 → **Exchange authorization code for tokens** → copy the **Refresh token**.

**C) Add repo secrets** (Settings → Secrets and variables → Actions)
- `GDRIVE_CLIENT_ID`
- `GDRIVE_CLIENT_SECRET`
- `GDRIVE_REFRESH_TOKEN`
- `GDRIVE_FOLDER_ID` *(optional — a Drive folder id from its URL; else root)*

Re-running with the same title overwrites the file (no duplicates).

### Alternative — service account (Google Workspace / Shared Drive only)

If you use a Workspace account uploading into a **Shared Drive**, add the full
service-account JSON as `GDRIVE_SA_JSON` (and `GDRIVE_FOLDER_ID`). The uploader
auto-detects whichever secret set is present.

## 4. Reciter & translation ids (Quran.com)

**Reciters with word-by-word timing** (`--recitation`): `1` AbdulBaset
(Mujawwad) · `2` AbdulBaset (Murattal, default) · `3` Sudais · `4` Shatri ·
`5` Hani ar-Rifai · `6` Husary · `12` Husary (Muallim).

**Translations** (`--translation`): `20` Saheeh International · `131` The Clear
Quran (Dr. Mustafa Khattab) · `85` (Pickthall) and more at
<https://api.quran.com/api/v4/resources/translations>.

### Luhaidan & Dossary

These two are **not** available on the free Quran.com word-timing API, so they
can't be word-synced out of the box. Two ways to support them later:

1. **Ayah-level highlight** — pull their audio from another CDN (e.g.
   EveryAyah) and highlight a whole ayah at a time instead of each word.
2. **Forced alignment** — run their audio + the Arabic text through an aligner
   (e.g. `aeneas` / a Whisper-based aligner) to generate our own word timings,
   then feed those into the same composition. This gives full word-by-word sync
   for any reciter.

For now **Abdul Basit** is the recommended default — fully word-synced and one
of your preferred reciters.
