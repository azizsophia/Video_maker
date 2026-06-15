# Google Drive delivery — one-time setup (phone-friendly)

This lets a GitHub Action upload finished videos **straight to your Google
Drive**. You do this once; after that every video is one tap away.

Why not just have the assistant upload? The Drive assistant tool needs the whole
file pasted in as base64 text, which corrupts/can't fit real videos. A GitHub
Action uploads the actual file with no size limit — reliable, phone-only.

You will create 3 secrets (`GDRIVE_CLIENT_ID`, `GDRIVE_CLIENT_SECRET`,
`GDRIVE_REFRESH_TOKEN`) and, optionally, `GDRIVE_FOLDER_ID`.

---

## 1. Turn on the Drive API and make an OAuth client (phone browser)

1. Go to **console.cloud.google.com** → sign in as **ketabistudio@gmail.com**.
2. Top bar → **Create project** → name it `Ketabi` → Create.
3. Search bar → **Google Drive API** → **Enable**.
4. Left menu → **APIs & Services → OAuth consent screen**:
   - User type **External** → Create.
   - App name `Ketabi`, your email for support + developer fields → Save.
   - **Audience / Test users** → add `ketabistudio@gmail.com` → Save.
5. **APIs & Services → Credentials → Create credentials → OAuth client ID**:
   - Application type **Web application**.
   - Under **Authorized redirect URIs** add exactly:
     `https://developers.google.com/oauthplayground`
   - Create. **Copy the Client ID and Client secret** (you'll paste them next).

## 2. Get a refresh token (phone browser, ~1 min)

1. Go to **developers.google.com/oauthplayground**.
2. Tap the **gear (⚙︎)** top-right → check **Use your own OAuth credentials** →
   paste the **Client ID** and **Client secret** from step 1 → Close.
3. In **Step 1** (left list) scroll to **Drive API v3** and select the scope
   `https://www.googleapis.com/auth/drive` (or type it in the "input your own
   scopes" box) → **Authorize APIs** → sign in as ketabistudio@gmail.com →
   **Allow**.
4. In **Step 2** tap **Exchange authorization code for tokens**.
5. **Copy the `Refresh token`** value that appears.

## 3. (Optional) Pick a destination folder

- Open **drive.google.com**, create/open a folder (e.g. `Ketabi Renders`).
- The folder ID is the last part of the URL: `.../folders/THIS_PART`. Copy it.
- Without this, videos land in your Drive root.

## 4. Add the secrets to GitHub (phone app or browser)

Repo → **Settings → Secrets and variables → Actions → New repository secret**.
Add each:

| Secret name | Value |
| --- | --- |
| `GDRIVE_CLIENT_ID` | Client ID from step 1 |
| `GDRIVE_CLIENT_SECRET` | Client secret from step 1 |
| `GDRIVE_REFRESH_TOKEN` | Refresh token from step 2 |
| `GDRIVE_FOLDER_ID` | *(optional)* folder ID from step 3 |

## 5. Run it 🎬

Repo → **Actions** tab → **Render & Upload to Drive** → **Run workflow**:

- **Branch**: the branch with your video (e.g. `claude/ayat-al-kursi-render-nukbn9`).
- **mode**:
  - `upload-existing` — uploads the MP4 already committed in `output/` (fast).
  - `render-and-upload` — renders a fresh video first, then uploads.
- Tap **Run workflow**.

In ~1 minute (upload-existing) the video appears in your Drive under the title
you chose. Re-running with the same title overwrites it (no duplicates).

---

### Troubleshooting

- **`invalid_grant` / token expired** — redo step 2 for a new refresh token and
  update `GDRIVE_REFRESH_TOKEN`. (Tokens for an app left in "Testing" can expire
  after 7 days; publish the OAuth consent screen to make it permanent:
  OAuth consent screen → **Publish app**.)
- **`storageQuotaExceeded`** — you used a *service account* on a personal Gmail;
  use the OAuth refresh-token method above instead (it uploads as *you*).
- **File not found in the Action** — for `upload-existing`, make sure the path in
  the `file` input matches a file committed under `output/`.
