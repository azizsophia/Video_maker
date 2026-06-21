#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Upload a file to Google Drive — for CI delivery (no LLM/base64 in the path).

Delivery method is auto-detected from the environment (GitHub Secrets):

  1) Apps Script web app  — easiest for a personal @gmail; no OAuth client, no
     verification wall. Runs as you, so files are owned by you.
        DRIVE_UPLOAD_URL    the deployed /exec web-app URL
        DRIVE_UPLOAD_TOKEN  the shared secret set in the script
     (Deploy steps: scripts/drive-webapp.gs and docs/SETUP.md §3.)

  2) OAuth refresh token  — personal @gmail, owned by you.
        GDRIVE_CLIENT_ID / GDRIVE_CLIENT_SECRET / GDRIVE_REFRESH_TOKEN

  3) Service account JSON — Google Workspace / Shared Drives only.
        GDRIVE_SA_JSON

Optional:
  GDRIVE_FOLDER_ID   destination folder (else Drive root)

Usage:
  python3 scripts/upload_to_drive.py --file out.mp4 [--name "Title.mp4"]
                                     [--mime video/mp4] [--folder <id>] [--replace]
"""

import argparse
import base64
import json
import os
import sys
import urllib.parse
import urllib.request

SCOPES = ["https://www.googleapis.com/auth/drive"]


# --------------------------------------------------------------------------
# Method 1: Apps Script web app (stdlib only)
# --------------------------------------------------------------------------

def upload_via_webapp(url, token, file_path, name, mime, folder):
    with open(file_path, "rb") as f:
        b64 = base64.b64encode(f.read())
    # "replace": ask the web app to overwrite an existing file of the same name
    # instead of creating a duplicate. Harmless if the Apps Script ignores it.
    qs = {"token": token, "name": name, "mimeType": mime, "replace": "true"}
    if folder:
        qs["folderId"] = folder
    full = url + ("&" if "?" in url else "?") + urllib.parse.urlencode(qs)
    req = urllib.request.Request(
        full, data=b64, method="POST",
        headers={"Content-Type": "text/plain"})
    with urllib.request.urlopen(req, timeout=300) as resp:
        body = resp.read().decode("utf-8", "replace")
    try:
        data = json.loads(body)
    except ValueError:
        sys.exit(f"Web app returned non-JSON (is the URL the /exec deployment?):"
                 f"\n{body[:500]}")
    if not data.get("ok"):
        sys.exit(f"Web app upload failed: {data.get('error')}")
    print(f"Uploaded: {data.get('name')}  id={data.get('id')}")
    print(f"Link: {data.get('url')}")


# --------------------------------------------------------------------------
# Methods 2 & 3: Google Drive API (lazy-imports google libs only when used)
# --------------------------------------------------------------------------

def _google_credentials():
    cid = os.environ.get("GDRIVE_CLIENT_ID")
    csec = os.environ.get("GDRIVE_CLIENT_SECRET")
    rtok = os.environ.get("GDRIVE_REFRESH_TOKEN")
    sa = os.environ.get("GDRIVE_SA_JSON")
    if cid and csec and rtok:
        from google.oauth2.credentials import Credentials
        return Credentials(
            token=None, refresh_token=rtok, client_id=cid, client_secret=csec,
            token_uri="https://oauth2.googleapis.com/token", scopes=SCOPES)
    if sa:
        from google.oauth2 import service_account
        return service_account.Credentials.from_service_account_info(
            json.loads(sa), scopes=SCOPES)
    return None


def upload_via_api(file_path, name, mime, folder, replace):
    try:
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload
        from googleapiclient.errors import HttpError
    except ImportError:
        sys.exit("Missing deps. Install: pip install "
                 "google-api-python-client google-auth google-auth-oauthlib")
    creds = _google_credentials()
    if creds is None:
        sys.exit("No Drive credentials found. Set DRIVE_UPLOAD_URL (Apps Script) "
                 "or the GDRIVE_* secrets. See docs/SETUP.md §3.")
    svc = build("drive", "v3", credentials=creds, cache_discovery=False)
    media = MediaFileUpload(file_path, mimetype=mime, resumable=True,
                            chunksize=8 * 1024 * 1024)
    existing = None
    if replace:
        q = [f"name = '{name}'", "trashed = false"]
        if folder:
            q.append(f"'{folder}' in parents")
        res = svc.files().list(q=" and ".join(q), spaces="drive",
                               fields="files(id)", supportsAllDrives=True,
                               includeItemsFromAllDrives=True).execute()
        files = res.get("files", [])
        existing = files[0]["id"] if files else None
    try:
        if existing:
            req = svc.files().update(fileId=existing, media_body=media,
                                     fields="id,name,webViewLink",
                                     supportsAllDrives=True)
        else:
            meta = {"name": name}
            if folder:
                meta["parents"] = [folder]
            req = svc.files().create(body=meta, media_body=media,
                                     fields="id,name,webViewLink",
                                     supportsAllDrives=True)
        resp = None
        while resp is None:
            status, resp = req.next_chunk()
            if status:
                sys.stdout.write(f"\r  {int(status.progress() * 100)}%")
                sys.stdout.flush()
        print()
        print(f"Uploaded: {resp.get('name')}  id={resp.get('id')}")
        print(f"Link: {resp.get('webViewLink')}")
    except HttpError as e:
        sys.exit(f"Drive API error: {e}")


def main():
    ap = argparse.ArgumentParser(description="Upload a file to Google Drive.")
    ap.add_argument("--file", required=True)
    ap.add_argument("--name", default=None)
    ap.add_argument("--mime", default="video/mp4")
    ap.add_argument("--folder", default=os.environ.get("GDRIVE_FOLDER_ID"))
    ap.add_argument("--replace", action="store_true")
    args = ap.parse_args()

    if not os.path.exists(args.file):
        sys.exit(f"File not found: {args.file}")
    name = args.name or os.path.basename(args.file)
    size_mb = os.path.getsize(args.file) / 1e6

    webapp_url = os.environ.get("DRIVE_UPLOAD_URL", "").strip()
    print(f"Uploading {args.file} ({size_mb:.1f} MB) as '{name}'")
    if webapp_url:
        upload_via_webapp(webapp_url,
                          os.environ.get("DRIVE_UPLOAD_TOKEN", "").strip(),
                          args.file, name, args.mime, args.folder)
    else:
        upload_via_api(args.file, name, args.mime, args.folder, args.replace)


if __name__ == "__main__":
    main()
