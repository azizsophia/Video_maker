#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Organize videos already in your Drive via the Apps Script web app.

  --action archive   move a posted video into the "Posted ✅" folder
  --action delete    send a video to Trash (frees space; Drive purges in 30 days)
  --action list      list the file names currently in the inbox folder

Reads DRIVE_UPLOAD_URL and DRIVE_UPLOAD_TOKEN from the environment (the same
secrets the uploader uses). Network runs on the CI runner, not locally.
"""

import argparse
import json
import os
import sys
import urllib.parse
import urllib.request


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--action", required=True, choices=["archive", "delete", "list"])
    ap.add_argument("--name", default="")
    args = ap.parse_args()

    url = os.environ.get("DRIVE_UPLOAD_URL", "").strip()
    token = os.environ.get("DRIVE_UPLOAD_TOKEN", "").strip()
    if not url:
        sys.exit("DRIVE_UPLOAD_URL is not set.")
    if args.action in ("archive", "delete") and not args.name:
        sys.exit(f"--name is required for {args.action}.")

    qs = urllib.parse.urlencode(
        {"token": token, "action": args.action, "name": args.name}
    )
    full = url + ("&" if "?" in url else "?") + qs
    req = urllib.request.Request(
        full, data=b"", method="POST", headers={"Content-Type": "text/plain"}
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        body = resp.read().decode("utf-8", "replace")
    try:
        data = json.loads(body)
    except ValueError:
        sys.exit(f"Web app returned non-JSON:\n{body[:400]}")
    print(json.dumps(data, ensure_ascii=False, indent=2))
    if not data.get("ok"):
        sys.exit(f"Action failed: {data.get('error')}")


if __name__ == "__main__":
    main()
