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
| `api.pexels.com` | stock B-roll search for the viral shorts |
| `*.pexels.com` / `player.vimeo.com` | downloading the chosen B-roll clips |
| `huggingface.co` / `*.hf.co` | Kokoro voice model weights (first run only) |
| `api.elevenlabs.io` | (optional) ElevenLabs narrator for the story template |
| `fonts.gstatic.com` | (optional) extra web fonts — Arabic fonts are bundled locally already |

You do **not** need this for the GitHub Action — GitHub runners have open
internet, so phone-triggered renders work without any allowlist changes.

## 2. ElevenLabs (for M2 — the story/narrator template)

1. Create an account at <https://elevenlabs.io> and grab your API key.
2. Pick (or clone) the British narrator voice you like and note its `voice_id`.
3. Add them as repo secrets / env vars: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`.

The Quran template (M1) does **not** use TTS — it uses real reciter audio — so
you can ship Quran videos before setting this up.

## 2b. Viral shorts — Kokoro voice + Pexels stock (free, no ElevenLabs)

The fast-cut "scroll-stopper" shorts (`ViralShort` composition, e.g.
`3 Kinds of People Allah Loves`) don't use ElevenLabs at all. Narration is
**Kokoro** — a free, open-source (Apache-2.0) TTS model — and the backgrounds
are matched **Pexels** stock clips.

**Voice — Kokoro (no key, no cost).** Nothing to sign up for. In CI the render
workflow runs `pip install -r scripts/requirements-kokoro.txt` and the voice
model (~330 MB, `hexgrad/Kokoro-82M`) auto-downloads from HuggingFace on the
first run. Voices you can pass as `--voice`: `bm_george` / `bm_lewis` (British
male, the default), `am_michael` / `am_adam` (American male), `af_heart` /
`af_bella` (American female), `bf_emma` (British female). British voices use
`lang_code` `b`; American voices use `a` (the build reads this from the script's
`lang_code`).

**Stock — Pexels (free key).** Grab a free API key at
<https://www.pexels.com/api/> (instant, no card). Add it as a repo secret
`PEXELS_API_KEY` (Settings → Secrets and variables → Actions). The build picks a
**portrait** clip per beat from that beat's search terms and skips any clip
whose page mentions people/faces/hands, so there are **no human depictions**. No
key? The render still works — it just falls back to the code-generated
geometric backdrop.

**On a computer:**

```bash
pip install -r scripts/requirements-kokoro.txt   # + espeak-ng (see below)
export PEXELS_API_KEY=your_key                    # optional but recommended
npm run build:short                               # Kokoro + Pexels + ayahs -> props
npm run render:short                              # -> out/short.mp4
```

`espeak-ng` is a small system package the tokenizer uses for out-of-dictionary
words: `sudo apt-get install -y espeak-ng` (Linux) or `brew install espeak-ng`
(mac). Re-render layout tweaks fast with `npm run build:short -- --skip-tts`
(reuses the WAVs, no model reload).

## 3. Google Drive auto-upload

Finished videos upload straight to your Drive from the render workflow (no
base64 in chat, no size limit). The uploader is `scripts/upload_to_drive.py` and
runs automatically once one of the secret sets below exists. If none are set,
the video is still available from the run's **Artifacts**.

### Recommended — Apps Script web app (no OAuth client, no verification wall) ⭐

This is the easiest path for a personal @gmail. A tiny Google Apps Script runs
**as you**, so files are owned by you with no service-account quota issue and no
"app not verified" wall (it's your own script). All steps are phone-doable.

1. Open **script.google.com** → **New project**.
2. Delete the sample, paste all of **`scripts/drive-webapp.gs`**, and Save.
3. In the pasted `CONFIG`, set `SECRET` to a long random password (you'll reuse
   it), and optionally `FOLDER_ID` to a Drive folder id (else it goes to root).
4. **Deploy → New deployment → (gear) Web app** → *Execute as:* **Me**,
   *Who has access:* **Anyone** → **Deploy** → **Authorize access** → pick your
   account → (if warned) **Advanced → Go to … (unsafe) → Allow**.
5. Copy the Web app **URL** (ends in `/exec`).
6. Add repo secrets (Settings → Secrets and variables → Actions):
   - `DRIVE_UPLOAD_URL` = the `/exec` URL
   - `DRIVE_UPLOAD_TOKEN` = the same `SECRET` from step 3

That's it — every render now drops into your Drive. Re-running with the same
title replaces the old file (no duplicates).

### Alternative — OAuth refresh token

If you prefer the API route: make an OAuth client (Google Cloud Console →
enable **Drive API** → **OAuth consent screen**: under **Audience** add your
gmail as a **Test user** *or* **Publish app** to clear the "access blocked"
wall → **Credentials → OAuth client ID → Web application** with redirect URI
`https://developers.google.com/oauthplayground`). Then at
**developers.google.com/oauthplayground** (gear → *Use your own OAuth
credentials*), authorize the scope `https://www.googleapis.com/auth/drive` and
**Exchange authorization code for tokens**. Add `GDRIVE_CLIENT_ID`,
`GDRIVE_CLIENT_SECRET`, `GDRIVE_REFRESH_TOKEN` (and optional `GDRIVE_FOLDER_ID`)
as secrets.

### Alternative — service account (Google Workspace / Shared Drive only)

For a Workspace account uploading into a **Shared Drive**, add the full
service-account JSON as `GDRIVE_SA_JSON` (and `GDRIVE_FOLDER_ID`). Service
accounts have no storage in a *personal* Drive, so use one of the methods above
for an @gmail account.

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
