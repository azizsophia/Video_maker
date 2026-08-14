#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Narration for the fast-cut shorts, using **Kokoro** — a free, open-source,
Apache-2.0 TTS model (hexgrad/Kokoro-82M). No API key, no per-character cost.

For each text segment it writes a WAV plus a JSON of word-level timings so the
big karaoke captions stay locked to the voice. Kokoro exposes per-token
timestamps; when they're unavailable we fall back to a length-weighted estimate
so a render never fails for lack of timing data.

The Qur'an is NEVER synthesized here — only the English narration. Real Arabic
ayahs (when used) come from the reciter audio via the Quran.com API.

Install:
    pip install -r scripts/requirements-kokoro.txt
    # espeak-ng is used by the tokenizer for out-of-dictionary words:
    #   apt-get install -y espeak-ng   (Linux)   |   brew install espeak-ng (mac)

Usage (batch — one model load for the whole video, which is much faster):
    python3 scripts/kokoro_tts.py --manifest build/tts-manifest.json

Manifest shape:
    {
      "voice": "bm_george",          # British male (default)
      "lang_code": "b",              # 'b' British English, 'a' American English
      "speed": 1.0,
      "segments": [
        {"id": "hook", "text": "...", "out": "public/short/hook.wav",
         "timestamps": "build/hook.json"}
      ]
    }

Single-shot (no manifest):
    python3 scripts/kokoro_tts.py --text "..." --out public/short/x.wav \
        --timestamps build/x.json --voice bm_george --lang b
"""

import argparse
import json
import os
import re
import sys

SAMPLE_RATE = 24000  # Kokoro renders at 24 kHz


def _to_numpy(audio):
    """Kokoro may return a torch tensor or a numpy array; normalise to numpy."""
    try:
        import numpy as np
    except ImportError:
        sys.exit("numpy is required (pip install -r scripts/requirements-kokoro.txt).")
    if hasattr(audio, "detach"):  # torch tensor
        audio = audio.detach().cpu().numpy()
    return np.asarray(audio, dtype="float32").reshape(-1)


def _estimate_words(text, duration):
    """Length-weighted fallback timing when the model gives no per-token times."""
    words = [w for w in re.findall(r"\S+", text)]
    if not words or duration <= 0:
        return []
    weights = [len(w) + 1 for w in words]
    total = sum(weights)
    out, cursor = [], 0.0
    for w, wt in zip(words, weights):
        span = duration * (wt / total)
        out.append({"text": w, "start": round(cursor, 3), "end": round(cursor + span, 3)})
        cursor += span
    return out


def synth(pipeline, text, voice, speed):
    """Run Kokoro over `text`; return (float32 mono audio, [word timings])."""
    import numpy as np

    chunks = []
    words = []
    offset = 0.0  # cumulative seconds across chunks
    for result in pipeline(text, voice=voice, speed=speed):
        # Newer kokoro yields a Result object; older yields (graphemes, phonemes, audio).
        audio = getattr(result, "audio", None)
        tokens = getattr(result, "tokens", None)
        if audio is None:
            try:
                _gs, _ps, audio = result
            except (TypeError, ValueError):
                audio = result
            tokens = None
        audio = _to_numpy(audio)
        chunk_dur = len(audio) / SAMPLE_RATE
        if tokens:
            for tk in tokens:
                start = getattr(tk, "start_ts", None)
                end = getattr(tk, "end_ts", None)
                txt = (getattr(tk, "text", "") or "").strip()
                if txt and start is not None and end is not None:
                    words.append(
                        {
                            "text": txt,
                            "start": round(offset + float(start), 3),
                            "end": round(offset + float(end), 3),
                        }
                    )
        chunks.append(audio)
        offset += chunk_dur

    audio = np.concatenate(chunks) if chunks else np.zeros(1, dtype="float32")
    duration = len(audio) / SAMPLE_RATE
    # Drop any punctuation-only tokens and merge stray artifacts.
    words = [w for w in words if re.search(r"\w", w["text"], flags=re.UNICODE)]
    if not words:
        words = _estimate_words(text, duration)
    return audio, words, duration


def write_outputs(audio, words, duration, out_path, ts_path):
    import soundfile as sf

    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    sf.write(out_path, audio, SAMPLE_RATE)
    if ts_path:
        os.makedirs(os.path.dirname(ts_path) or ".", exist_ok=True)
        with open(ts_path, "w", encoding="utf-8") as f:
            json.dump({"words": words, "duration": round(duration, 3)}, f, ensure_ascii=False)


def build_pipeline(lang_code):
    try:
        from kokoro import KPipeline
    except ImportError:
        sys.exit(
            "kokoro is not installed. Run:\n"
            "  pip install -r scripts/requirements-kokoro.txt"
        )
    # repo_id pinned to silence the version warning; weights auto-download once.
    return KPipeline(lang_code=lang_code, repo_id="hexgrad/Kokoro-82M")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", help="JSON manifest for batch synthesis")
    ap.add_argument("--text")
    ap.add_argument("--out")
    ap.add_argument("--timestamps")
    ap.add_argument("--voice", default="bm_george")
    ap.add_argument("--lang", default="b", help="'b' British, 'a' American")
    ap.add_argument("--speed", type=float, default=1.0)
    args = ap.parse_args()

    if args.manifest:
        with open(args.manifest, encoding="utf-8") as f:
            man = json.load(f)
        voice = man.get("voice", args.voice)
        lang = man.get("lang_code", args.lang)
        speed = float(man.get("speed", args.speed))
        pipeline = build_pipeline(lang)
        results = []
        for seg in man["segments"]:
            audio, words, duration = synth(pipeline, seg["text"], voice, speed)
            write_outputs(audio, words, duration, seg["out"], seg.get("timestamps"))
            print(f"  ✓ {seg.get('id', seg['out'])}: {duration:.1f}s, {len(words)} words")
            results.append({"id": seg.get("id"), "duration": round(duration, 3), "words": words})
        # Also emit a combined result so callers that don't want to re-read each
        # timestamps file can pick everything up at once.
        out_index = man.get("index")
        if out_index:
            with open(out_index, "w", encoding="utf-8") as f:
                json.dump(results, f, ensure_ascii=False)
        print(f"Done: {len(results)} segment(s), voice={voice}, lang={lang}")
        return

    if not (args.text and args.out):
        sys.exit("Provide --manifest, or --text and --out.")
    pipeline = build_pipeline(args.lang)
    audio, words, duration = synth(pipeline, args.text, args.voice, args.speed)
    write_outputs(audio, words, duration, args.out, args.timestamps)
    print(f"Wrote {args.out} (~{duration:.1f}s, {len(words)} words)")


if __name__ == "__main__":
    main()
