#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Upload a file to Google Drive — for CI delivery (no LLM/base64 in the path).

Auth (pick one, via environment / GitHub Secrets):

  A) OAuth refresh token  — best for a personal @gmail account. Files are owned
     by you and count against your Drive quota normally.
        GDRIVE_CLIENT_ID
        GDRIVE_CLIENT_SECRET
        GDRIVE_REFRESH_TOKEN
     (Get these in a phone browser via the OAuth Playground — see
      docs/SETUP.md.)

  B) Service account JSON — best for Google Workspace / Shared Drives.
        GDRIVE_SA_JSON   (the full JSON key as a string)
     Note: service accounts have NO storage in consumer Drive, so for a personal
     @gmail use option A, or upload into a Shared Drive.

Optional:
  GDRIVE_FOLDER_ID   destination folder (else Drive root)

Usage:
  python3 scripts/upload_to_drive.py --file out.mp4 [--name "Title.mp4"]
                                     [--mime video/mp4] [--folder <id>] [--replace]
"""

import argparse
import json
import os
import sys

try:
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaFileUpload
    from googleapiclient.errors import HttpError
except ImportError:
    sys.exit("Missing deps. Install: pip install "
             "google-api-python-client google-auth google-auth-oauthlib")

SCOPES = ["https://www.googleapis.com/auth/drive"]


def get_credentials():
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
    sys.exit("No Drive credentials found. Set GDRIVE_CLIENT_ID/"
             "GDRIVE_CLIENT_SECRET/GDRIVE_REFRESH_TOKEN (recommended) or "
             "GDRIVE_SA_JSON. See docs/SETUP.md.")


def find_existing(svc, name, folder):
    q = [f"name = '{name}'", "trashed = false"]
    if folder:
        q.append(f"'{folder}' in parents")
    res = svc.files().list(
        q=" and ".join(q), spaces="drive", fields="files(id,name)",
        supportsAllDrives=True, includeItemsFromAllDrives=True).execute()
    files = res.get("files", [])
    return files[0]["id"] if files else None


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

    svc = build("drive", "v3", credentials=get_credentials(),
                cache_discovery=False)
    media = MediaFileUpload(args.file, mimetype=args.mime, resumable=True,
                            chunksize=8 * 1024 * 1024)
    print(f"Uploading {args.file} ({size_mb:.1f} MB) as '{name}' "
          f"-> folder {args.folder or 'root'}")
    try:
        existing = find_existing(svc, name, args.folder) if args.replace else None
        if existing:
            req = svc.files().update(fileId=existing, media_body=media,
                                     fields="id,name,webViewLink",
                                     supportsAllDrives=True)
        else:
            meta = {"name": name}
            if args.folder:
                meta["parents"] = [args.folder]
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


if __name__ == "__main__":
    main()
