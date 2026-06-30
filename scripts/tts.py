#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate English narration via ElevenLabs (text-to-speech WITH timestamps).

Writes an MP3 plus a JSON alignment file (per-character start/end seconds) so the
story composition can sync captions tightly to the voice. The Qur'an is NEVER
synthesized here — only English narration. Arabic ayahs use the real reciter.

Env:  ELEVENLABS_API_KEY   (GitHub secret)

Usage:
  python3 scripts/tts.py --text "..." --out out/narration.mp3 \
                         [--timestamps out/narration.json] \
                         [--voice onwK4e9ZLuTAKqWW03F9] [--model eleven_multilingual_v2]
"""

import argparse
import base64
import json
import os
import sys
import urllib.request

DANIEL = "onwK4e9ZLuTAKqWW03F9"  # deep British male


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--text", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--timestamps", default=None)
    ap.add_argument("--voice", default=DANIEL)
    ap.add_argument("--model", default="eleven_multilingual_v2")
    args = ap.parse_args()

    key = os.environ.get("ELEVENLABS_API_KEY", "").strip()
    if not key:
        sys.exit("ELEVENLABS_API_KEY is not set.")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{args.voice}/with-timestamps"
    body = json.dumps({
        "text": args.text,
        "model_id": args.model,
        # Lower stability + some style = a warmer, more emotional read with
        # natural variation (not a flat newsreader). Pacing/pauses come from the
        # script punctuation (commas, full stops, ellipses, line breaks).
        "voice_settings": {"stability": 0.35, "similarity_boost": 0.8, "style": 0.45,
                           "use_speaker_boost": True},
    }).encode("utf-8")
    req = urllib.request.Request(
        url, data=body, method="POST",
        headers={"xi-api-key": key, "Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        sys.exit(f"ElevenLabs error {e.code}: {e.read().decode('utf-8', 'replace')[:400]}")

    audio = base64.b64decode(data["audio_base64"])
    os.makedirs(os.path.dirname(args.out) or ".", exist_ok=True)
    with open(args.out, "wb") as f:
        f.write(audio)

    align = data.get("alignment") or {}
    ends = align.get("character_end_times_seconds") or []
    dur = ends[-1] if ends else 0.0
    chars = len(args.text)
    print(f"Wrote {args.out}  ({len(audio)} bytes, ~{dur:.1f}s, {chars} chars)")

    if args.timestamps:
        with open(args.timestamps, "w") as f:
            json.dump(align, f)
        print(f"Wrote alignment {args.timestamps}")


if __name__ == "__main__":
    main()
