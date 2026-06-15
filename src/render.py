# -*- coding: utf-8 -*-
"""
Render Ayat al-Kursi as an elegant animated video.

The verse is revealed phrase by phrase over a deep, ornamented background.
Each scene shows the Arabic (in the AmiriQuran script), a transliteration,
and the English meaning, with smooth cross-fades between them.

No system ffmpeg or Arabic fonts are required — a bundled ffmpeg binary
(via imageio-ffmpeg) is used and fonts are loaded from assets/fonts.

Usage:
    python3 src/render.py [--out output/ayat_al_kursi.mp4] [--preview]
"""

import argparse
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont, features
import arabic_reshaper
from bidi.algorithm import get_display
import imageio_ffmpeg

import verse

# ---------------------------------------------------------------------------
# Paths & configuration
# ---------------------------------------------------------------------------

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
FONT_DIR = os.path.join(ROOT, "assets", "fonts")

F_QURAN = os.path.join(FONT_DIR, "AmiriQuran.ttf")
F_ARABIC = os.path.join(FONT_DIR, "Amiri-Regular.ttf")
F_LATIN = os.path.join(FONT_DIR, "DejaVuSans.ttf")
F_LATIN_BOLD = os.path.join(FONT_DIR, "DejaVuSans-Bold.ttf")
F_SERIF = os.path.join(FONT_DIR, "DejaVuSerif.ttf")

# Palette — deep midnight green/blue with warm gold accents.
COL_BG_TOP = (8, 22, 20)
COL_BG_BOTTOM = (2, 6, 10)
COL_GOLD = (212, 175, 92)
COL_GOLD_SOFT = (188, 156, 86)
COL_ARABIC = (245, 240, 224)
COL_TRANSLIT = (196, 210, 198)
COL_ENGLISH = (210, 214, 220)
COL_DIM = (120, 132, 130)


# ---------------------------------------------------------------------------
# Arabic shaping
# ---------------------------------------------------------------------------
#
# PIL is built with libraqm here, so HarfBuzz performs full OpenType shaping
# (cursive joining, ligatures, mark positioning) and the Unicode bidi
# algorithm directly from the logical-order text. That means we pass the
# original Arabic straight through — using arabic-reshaper's presentation
# forms would actually break the Quranic fonts, which carry their glyphs in
# OpenType GSUB tables rather than the legacy presentation-forms block.

USE_RAQM = features.check("raqm")


def shape_arabic(text):
    """Return Arabic in logical order; HarfBuzz/raqm handles shaping + bidi."""
    if USE_RAQM:
        return text
    # Fallback if libraqm is unavailable: legacy reshape + manual bidi.
    reshaper = arabic_reshaper.ArabicReshaper(
        configuration={"delete_harakat": False, "support_ligatures": True}
    )
    return get_display(reshaper.reshape(text))


# ---------------------------------------------------------------------------
# Font cache
# ---------------------------------------------------------------------------

_font_cache = {}
_ARABIC_FONTS = {F_QURAN, F_ARABIC}


def font(path, size):
    key = (path, size)
    if key not in _font_cache:
        engine = None
        if USE_RAQM and path in _ARABIC_FONTS:
            engine = ImageFont.Layout.RAQM
        _font_cache[key] = ImageFont.truetype(path, size, layout_engine=engine)
    return _font_cache[key]


# ---------------------------------------------------------------------------
# Text helpers
# ---------------------------------------------------------------------------

def text_size(draw, txt, fnt):
    box = draw.textbbox((0, 0), txt, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def draw_centered(draw, cy, txt, fnt, fill, width, anchor="mm", shadow=None):
    """Draw horizontally centered text at vertical center cy."""
    cx = width // 2
    if shadow:
        draw.text((cx + shadow[0], cy + shadow[1]), txt, font=fnt,
                  fill=shadow[2], anchor=anchor)
    draw.text((cx, cy), txt, font=fnt, fill=fill, anchor=anchor)


def wrap_latin(draw, txt, fnt, max_width):
    """Greedy word-wrap for left-to-right text. Returns list of lines."""
    words = txt.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if text_size(draw, trial, fnt)[0] <= max_width or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def wrap_arabic(draw, raw_text, fnt, max_width):
    """Word-wrap Arabic by words, shaping each resulting line. Returns shaped lines."""
    words = raw_text.split()
    lines, cur = [], []
    for w in words:
        trial = cur + [w]
        shaped = shape_arabic(" ".join(trial))
        if text_size(draw, shaped, fnt)[0] <= max_width or not cur:
            cur = trial
        else:
            lines.append(shape_arabic(" ".join(cur)))
            cur = [w]
    if cur:
        lines.append(shape_arabic(" ".join(cur)))
    return lines


# ---------------------------------------------------------------------------
# Background
# ---------------------------------------------------------------------------

def make_background(W, H):
    """A deep vertical gradient with a soft radial glow, starfield and gold frame."""
    # Vertical gradient base.
    top = np.array(COL_BG_TOP, dtype=np.float64)
    bot = np.array(COL_BG_BOTTOM, dtype=np.float64)
    t = np.linspace(0, 1, H)[:, None]
    grad = (top[None, :] * (1 - t) + bot[None, :] * t)  # (H,3)
    img = np.repeat(grad[:, None, :], W, axis=1)         # (H,W,3)

    # Radial glow toward the upper-centre.
    yy, xx = np.mgrid[0:H, 0:W]
    cx, cy = W * 0.5, H * 0.42
    r = np.sqrt((xx - cx) ** 2 + ((yy - cy) * 1.15) ** 2)
    glow = np.clip(1.0 - r / (0.75 * W), 0, 1) ** 2.2
    glow_col = np.array([26, 60, 52], dtype=np.float64)
    img += glow[:, :, None] * glow_col[None, None, :]

    # Subtle starfield.
    rng = np.random.default_rng(255)
    n_stars = int(W * H / 9000)
    sx = rng.integers(0, W, n_stars)
    sy = rng.integers(0, H, n_stars)
    bright = rng.uniform(20, 90, n_stars)
    for x, y, b in zip(sx, sy, bright):
        img[y, x] += b
        # a touch of bloom
        if 0 < x < W - 1 and 0 < y < H - 1:
            img[y, x - 1] += b * 0.3
            img[y, x + 1] += b * 0.3
            img[y - 1, x] += b * 0.3
            img[y + 1, x] += b * 0.3

    img = np.clip(img, 0, 255).astype(np.uint8)
    base = Image.fromarray(img, "RGB")

    # Ornamental gold frame.
    draw = ImageDraw.Draw(base)
    m = int(min(W, H) * 0.045)
    draw.rectangle([m, m, W - m, H - m], outline=COL_GOLD_SOFT, width=2)
    m2 = m + 10
    draw.rectangle([m2, m2, W - m2, H - m2], outline=(COL_GOLD_SOFT[0] // 2,
                   COL_GOLD_SOFT[1] // 2, COL_GOLD_SOFT[2] // 2), width=1)

    # Corner diamonds.
    for (cxp, cyp) in [(m, m), (W - m, m), (m, H - m), (W - m, H - m)]:
        s = 9
        draw.polygon([(cxp, cyp - s), (cxp + s, cyp),
                      (cxp, cyp + s), (cxp - s, cyp)], fill=COL_GOLD)
    return base


def draw_divider(draw, W, cy, half=160):
    """A slim gold divider with a central diamond."""
    cx = W // 2
    grad_steps = 40
    for i in range(grad_steps):
        a = i / grad_steps
        x0 = cx - int(half * (1 - a))
        col = tuple(int(c * (0.25 + 0.75 * a)) for c in COL_GOLD)
        draw.line([(x0, cy), (cx - 14, cy)], fill=col, width=2)
        x1 = cx + int(half * (1 - a))
        draw.line([(cx + 14, cy), (x1, cy)], fill=col, width=2)
    s = 6
    draw.polygon([(cx, cy - s), (cx + s, cy), (cx, cy + s), (cx - s, cy)],
                 fill=COL_GOLD)


# ---------------------------------------------------------------------------
# Scene rendering (each produces an RGBA overlay drawn on the background)
# ---------------------------------------------------------------------------

def render_title(W, H):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    title_ar = shape_arabic(verse.TITLE_AR)
    d.text  # noqa  (warm font cache)
    draw_centered(d, int(H * 0.40), title_ar, font(F_QURAN, 150), COL_ARABIC, W,
                  shadow=(0, 4, (0, 0, 0, 160)))
    draw_divider(d, W, int(H * 0.555))
    draw_centered(d, int(H * 0.63), verse.TITLE_EN, font(F_SERIF, 70), COL_GOLD, W)
    draw_centered(d, int(H * 0.70), verse.REFERENCE.upper(),
                  font(F_LATIN, 30), COL_TRANSLIT, W)
    return layer


def render_segment(W, H, idx, total, arabic, translit, english):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    max_w = int(W * 0.80)

    # Verse counter pill.
    counter = f"{idx} / {total}"
    draw_centered(d, int(H * 0.135), counter, font(F_LATIN, 26), COL_DIM, W)

    # Arabic block (wrapped, large Quranic script).
    ar_font = font(F_QURAN, 96)
    ar_lines = wrap_arabic(d, arabic, ar_font, max_w)
    line_h = int(ar_font.size * 1.7)
    block_h = line_h * len(ar_lines)
    ar_top = int(H * 0.34) - block_h // 2
    for i, line in enumerate(ar_lines):
        cy = ar_top + i * line_h + line_h // 2
        draw_centered(d, cy, line, ar_font, COL_ARABIC, W,
                      shadow=(0, 3, (0, 0, 0, 150)))

    draw_divider(d, W, int(H * 0.585), half=120)

    # Transliteration (italic-ish serif).
    tr_font = font(F_SERIF, 42)
    tr_lines = wrap_latin(d, translit, tr_font, max_w)
    ty = int(H * 0.65)
    for line in tr_lines:
        draw_centered(d, ty, line, tr_font, COL_TRANSLIT, W)
        ty += int(tr_font.size * 1.35)

    # English meaning.
    en_font = font(F_LATIN, 40)
    en_lines = wrap_latin(d, english, en_font, max_w)
    ey = int(H * 0.78)
    for line in en_lines:
        draw_centered(d, ey, line, en_font, COL_ENGLISH, W)
        ey += int(en_font.size * 1.3)
    return layer


def render_full(W, H):
    """Closing card: the entire verse together."""
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    max_w = int(W * 0.84)
    ar_font = font(F_QURAN, 70)
    ar_lines = wrap_arabic(d, verse.FULL_ARABIC, ar_font, max_w)
    line_h = int(ar_font.size * 1.75)
    block_h = line_h * len(ar_lines)
    top = (H - block_h) // 2 - int(H * 0.04)
    for i, line in enumerate(ar_lines):
        cy = top + i * line_h + line_h // 2
        draw_centered(d, cy, line, ar_font, COL_ARABIC, W,
                      shadow=(0, 3, (0, 0, 0, 150)))
    draw_divider(d, W, top + block_h + int(H * 0.04))
    draw_centered(d, top + block_h + int(H * 0.10), verse.REFERENCE.upper(),
                  font(F_LATIN, 30), COL_GOLD, W)
    return layer


# ---------------------------------------------------------------------------
# Timeline & easing
# ---------------------------------------------------------------------------

def ease(t):
    """Smoothstep."""
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def scene_alpha(local_t, dur, fade=0.9):
    """Alpha envelope for a scene of length `dur`, fading in/out over `fade`."""
    if local_t < fade:
        return ease(local_t / fade)
    if local_t > dur - fade:
        return ease((dur - local_t) / fade)
    return 1.0


# ---------------------------------------------------------------------------
# Main render loop
# ---------------------------------------------------------------------------

def build_timeline():
    """Return list of (overlay_factory_marker, duration). Durations in seconds."""
    scenes = []
    scenes.append(("title", 4.0))
    total = len(verse.SEGMENTS)
    for i, (ar, tr, en) in enumerate(verse.SEGMENTS, 1):
        # Give longer phrases a little more time on screen.
        dur = 4.6 + min(2.0, len(en) / 55.0)
        scenes.append(("seg", dur, i, total, ar, tr, en))
    scenes.append(("full", 7.0))
    return scenes


def render(out_path, W, H, fps, preview=False):
    print(f"[1/4] Building background {W}x{H} …")
    bg = make_background(W, H)
    bg_arr = np.asarray(bg).astype(np.float64)

    print("[2/4] Composing scenes …")
    timeline = build_timeline()
    if preview:
        timeline = timeline[:3]

    overlays = []
    for sc in timeline:
        kind = sc[0]
        if kind == "title":
            ov = render_title(W, H)
        elif kind == "full":
            ov = render_full(W, H)
        else:
            _, dur, i, total, ar, tr, en = sc
            ov = render_segment(W, H, i, total, ar, tr, en)
        # Premultiply: store overlay rgb and its own alpha mask.
        ov_arr = np.asarray(ov).astype(np.float64)
        overlays.append((ov_arr[:, :, :3], ov_arr[:, :, 3] / 255.0, sc[1]))

    total_dur = sum(o[2] for o in overlays)
    total_frames = int(total_dur * fps)
    print(f"      {len(overlays)} scenes · {total_dur:.1f}s · {total_frames} frames")

    print("[3/4] Encoding via ffmpeg …")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [
        ffmpeg, "-y",
        "-f", "rawvideo", "-pix_fmt", "rgb24",
        "-s", f"{W}x{H}", "-r", str(fps),
        "-i", "-",
        "-an",
        "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        out_path,
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE,
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    done = 0
    for (ov_rgb, ov_a, dur) in overlays:
        n = int(dur * fps)
        for f in range(n):
            t = f / fps
            a = scene_alpha(t, dur)
            # subtle vertical drift for life.
            if a <= 0.0:
                frame = bg_arr
            else:
                mask = (ov_a * a)[:, :, None]
                frame = bg_arr * (1 - mask) + ov_rgb * mask
            proc.stdin.write(np.clip(frame, 0, 255).astype(np.uint8).tobytes())
            done += 1
            if done % 60 == 0:
                pct = 100 * done / total_frames
                sys.stdout.write(f"\r      frame {done}/{total_frames} ({pct:4.1f}%)")
                sys.stdout.flush()
    sys.stdout.write("\n")
    proc.stdin.close()
    proc.wait()

    print("[4/4] Done.")
    size_mb = os.path.getsize(out_path) / 1e6
    print(f"      Wrote {out_path}  ({size_mb:.1f} MB)")
    return out_path


def main():
    ap = argparse.ArgumentParser(description="Render Ayat al-Kursi video.")
    ap.add_argument("--out", default=os.path.join(ROOT, "output", "ayat_al_kursi.mp4"))
    ap.add_argument("--width", type=int, default=1920)
    ap.add_argument("--height", type=int, default=1080)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--preview", action="store_true",
                    help="Render only the first few scenes for a quick check.")
    ap.add_argument("--poster", action="store_true",
                    help="Also save a PNG poster of the title card.")
    args = ap.parse_args()

    if args.poster:
        bg = make_background(args.width, args.height)
        title = render_title(args.width, args.height)
        poster = Image.alpha_composite(bg.convert("RGBA"), title).convert("RGB")
        ppath = os.path.join(ROOT, "output", "poster.png")
        os.makedirs(os.path.dirname(ppath), exist_ok=True)
        poster.save(ppath)
        print(f"Saved poster -> {ppath}")

    render(args.out, args.width, args.height, args.fps, preview=args.preview)


if __name__ == "__main__":
    main()
