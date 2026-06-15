# -*- coding: utf-8 -*-
"""
Ayat al-Kursi — Cinematic 3-D renderer.

A genuine software 3-D pipeline (perspective projection + 3-D rotation, all
vectorised in numpy) that flies the camera through a volumetric golden
star/dust field while a slowly rotating 8-pointed Islamic "Throne" emblem
(the Khatam / Rub-el-Hizb, extruded into 3-D) glows at the centre. The verse
is revealed phrase by phrase, each line emerging from depth with bloom, then
the complete verse over the emblem before converging to a single point of light.

Cinematic finishing: HDR bloom, volumetric light rays, chromatic aberration,
vignette, film grain and an anamorphic 2.39:1 letterbox.

No GPU, Blender or system ffmpeg required — pure numpy + Pillow, encoded with
the bundled ffmpeg from imageio-ffmpeg.

Usage:
    python3 src/cinematic.py [--out output/ayat_al_kursi_cinematic.mp4]
                             [--width 1920 --height 1080 --fps 30]
                             [--preview] [--poster] [--seconds-cap N]
"""

import argparse
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, features
import imageio_ffmpeg

import verse

# ---------------------------------------------------------------------------
# Paths, fonts, palette
# ---------------------------------------------------------------------------

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
FONT_DIR = os.path.join(ROOT, "assets", "fonts")

F_QURAN = os.path.join(FONT_DIR, "AmiriQuran.ttf")
F_LATIN = os.path.join(FONT_DIR, "DejaVuSans.ttf")
F_SERIF = os.path.join(FONT_DIR, "DejaVuSerif.ttf")

USE_RAQM = features.check("raqm")

# Warm gold / deep cosmos palette (linear-ish HDR, values may exceed 1.0).
GOLD = np.array([1.00, 0.82, 0.45])
GOLD_HOT = np.array([1.00, 0.93, 0.72])
STAR_COOL = np.array([0.72, 0.82, 1.00])
PARCH = np.array([1.00, 0.97, 0.90])
EMBLEM_COL = np.array([1.00, 0.80, 0.40])

_font_cache = {}
_ARABIC = {F_QURAN}


def font(path, size):
    key = (path, size)
    if key not in _font_cache:
        eng = ImageFont.Layout.RAQM if (USE_RAQM and path in _ARABIC) else None
        _font_cache[key] = ImageFont.truetype(path, size, layout_engine=eng)
    return _font_cache[key]


def shape_ar(text):
    return text  # raqm/harfbuzz handles shaping + bidi from logical order


# ---------------------------------------------------------------------------
# Easing
# ---------------------------------------------------------------------------

def smooth(t):
    t = np.clip(t, 0.0, 1.0)
    return t * t * (3 - 2 * t)


def smoother(t):
    t = np.clip(t, 0.0, 1.0)
    return t * t * t * (t * (t * 6 - 15) + 10)


def lerp(a, b, t):
    return a + (b - a) * t


# ---------------------------------------------------------------------------
# HDR splatting helpers (additive into a float (H,W,3) buffer)
# ---------------------------------------------------------------------------

# Crisp bright core with a soft halo, so distant stars stay points and
# near ones bloom — weights sum > 1 to give the field real presence.
_KERNEL = [(-1, -1, .10), (0, -1, .26), (1, -1, .10),
           (-1, 0, .26),  (0, 0, .85),  (1, 0, .26),
           (-1, 1, .10),  (0, 1, .26),  (1, 1, .10)]


def splat(buf, xs, ys, cols, W, H):
    """Additively splat soft points (3x3 gaussian) into HDR buffer."""
    flat = buf.reshape(-1, 3)
    ix = np.round(xs).astype(np.int64)
    iy = np.round(ys).astype(np.int64)
    for dx, dy, w in _KERNEL:
        X = ix + dx
        Y = iy + dy
        m = (X >= 0) & (X < W) & (Y >= 0) & (Y < H)
        if not m.any():
            continue
        np.add.at(flat, Y[m] * W + X[m], cols[m] * w)


# ---------------------------------------------------------------------------
# Volumetric particle field (true perspective fly-through)
# ---------------------------------------------------------------------------

class Field:
    """A frustum of particles. Each holds (u, v, z, tint, mag).

    Screen position is center + (u, v) * SCALE / z, so as z shrinks (camera
    advancing) particles sweep radially outward — a real 3-D fly-through.
    """

    def __init__(self, n, W, H, znear, zfar, scale, seed,
                 warm_ratio=0.7, vdrift=0.0):
        rng = np.random.default_rng(seed)
        self.W, self.H = W, H
        self.znear, self.zfar, self.scale = znear, zfar, scale
        self.vdrift = vdrift
        self.u = rng.uniform(-1.25, 1.25, n)
        self.v = rng.uniform(-1.25, 1.25, n)
        self.z = rng.uniform(znear, zfar, n)
        self.mag = rng.uniform(0.35, 1.0, n) ** 1.6
        warm = rng.uniform(0, 1, n) < warm_ratio
        tint = np.where(warm[:, None], GOLD[None, :], STAR_COOL[None, :])
        tint = tint * rng.uniform(0.7, 1.0, n)[:, None]
        self.tint = tint
        self.rng = rng

    def advance(self, dz):
        self.z -= dz
        self.v += self.vdrift
        rec = self.z < self.znear
        k = int(rec.sum())
        if k:
            self.z[rec] = self.zfar - self.rng.uniform(0, 0.5, k)
            self.u[rec] = self.rng.uniform(-1.25, 1.25, k)
            self.v[rec] = self.rng.uniform(-1.25, 1.25, k)
            self.mag[rec] = self.rng.uniform(0.35, 1.0, k) ** 1.6

    def render(self, buf, dz, brightness=1.0, streak=1.0, pan_u=0.0, pan_v=0.0):
        W, H = self.W, self.H
        cx, cy = W * 0.5, H * 0.5
        z = self.z
        inv = self.scale / z
        u = self.u + pan_u                  # camera pan -> nearer stars shift more
        v = self.v + pan_v
        sx = cx + u * inv
        sy = cy + v * inv * (W / H)  # keep aspect of motion
        # brightness falls with depth, sharpens near camera
        depth = np.clip(1.0 - (z - self.znear) / (self.zfar - self.znear), 0, 1)
        amp = (0.30 + 1.5 * depth ** 1.5) * self.mag * brightness
        cols = self.tint * amp[:, None]
        # motion streaks: sample along the path travelled this frame
        zprev = z + dz
        invp = self.scale / zprev
        sxp = cx + u * invp
        syp = cy + v * invp * (W / H)
        speed = np.hypot(sx - sxp, sy - syp)
        nseg = int(np.clip(streak, 1, 6))
        if nseg <= 1:
            splat(buf, sx, sy, cols, W, H)
        else:
            for s in range(nseg):
                f = s / (nseg - 1)
                xs = lerp(sxp, sx, f)
                ys = lerp(syp, sy, f)
                splat(buf, xs, ys, cols / nseg, W, H)
        return speed


# ---------------------------------------------------------------------------
# 3-D rotation + projection for the emblem
# ---------------------------------------------------------------------------

def rot_matrix(ax, ay, az):
    cx, sx = np.cos(ax), np.sin(ax)
    cy, sy = np.cos(ay), np.sin(ay)
    cz, sz = np.cos(az), np.sin(az)
    Rx = np.array([[1, 0, 0], [0, cx, -sx], [0, sx, cx]])
    Ry = np.array([[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]])
    Rz = np.array([[cz, -sz, 0], [sz, cz, 0], [0, 0, 1]])
    return Rz @ Ry @ Rx


def medallion_geometry():
    """A round ornamental medallion — concentric rings joined by radial spokes,
    like a rose-window / astrolabe. Deliberately circular (no pointed star
    polygons) so it reads as Islamic geometry with no resemblance to a hexagram.

    The outer ring has a little depth (a thin band) so it tilts in 3-D as it
    rotates. Returns (vertices, edges, tips)."""
    no, nm, ni, nspoke = 36, 24, 16, 12
    d = 0.06

    def ring(n, r, z):
        a = np.arange(n) * 2 * np.pi / n
        return np.column_stack([r * np.cos(a), r * np.sin(a), np.full(n, z)])

    outerF = ring(no, 1.00, d)
    outerB = ring(no, 1.00, -d)
    mid = ring(nm, 0.62, 0.0)
    inner = ring(ni, 0.30, 0.0)
    verts = np.vstack([outerF, outerB, mid, inner])
    oF, oB, mO, iO = 0, no, 2 * no, 2 * no + nm
    edges = []
    for k in range(no):
        edges.append((oF + k, oF + (k + 1) % no))      # outer ring front
        edges.append((oB + k, oB + (k + 1) % no))      # outer ring back
    for k in range(0, no, 2):
        edges.append((oF + k, oB + k))                 # band thickness
    for k in range(nm):
        edges.append((mO + k, mO + (k + 1) % nm))      # middle ring
    for k in range(ni):
        edges.append((iO + k, iO + (k + 1) % ni))      # inner ring
    for s in range(nspoke):
        edges.append((iO + (s * ni // nspoke), oF + s * (no // nspoke)))  # spokes
    tips = [oF + s * (no // nspoke) for s in range(nspoke)]  # bright nodes
    return verts, edges, tips


_KHATAM_V, _KHATAM_E, _KHATAM_TIPS = medallion_geometry()


def render_emblem(W, H, t, cz, rot_speed, scale_px, brightness,
                  cx_off=0.0, cy_off=0.0):
    """Draw the rotating 3-D emblem to an intensity layer, return RGB float (H,W,3).

    Rendered as a glowing line drawing: a sharp core layer plus a strongly
    blurred halo layer, composited and tinted gold."""
    core = Image.new("L", (W, H), 0)
    halo = Image.new("L", (W, H), 0)
    dc = ImageDraw.Draw(core)
    dh = ImageDraw.Draw(halo)
    R = rot_matrix(0.38 * np.sin(t * 0.16), t * rot_speed, 0.12 * np.sin(t * 0.10))
    P = (_KHATAM_V @ R.T)
    P[:, 2] += cz
    f = scale_px
    z = P[:, 2]
    sx = W * 0.5 + cx_off + f * P[:, 0] / z
    sy = H * 0.5 + cy_off + f * P[:, 1] / z
    for i, j in _KHATAM_E:
        if z[i] <= 0.05 or z[j] <= 0.05:
            continue
        zb = 2.4 / (z[i] + z[j])               # nearer edges brighter/thicker
        wdt = max(1, int(2.0 * zb))
        val = int(np.clip(150 * zb, 60, 255))
        dc.line([(sx[i], sy[i]), (sx[j], sy[j])], fill=val, width=wdt)
        dh.line([(sx[i], sy[i]), (sx[j], sy[j])], fill=val, width=wdt + 4)
    for k in _KHATAM_TIPS:                       # glowing tips
        if z[k] > 0.05:
            r = max(2, int(0.012 * f / z[k]))
            dc.ellipse([sx[k] - r, sy[k] - r, sx[k] + r, sy[k] + r], fill=255)
            dh.ellipse([sx[k] - r * 2, sy[k] - r * 2,
                        sx[k] + r * 2, sy[k] + r * 2], fill=200)
    core = core.filter(ImageFilter.GaussianBlur(0.8))
    halo = halo.filter(ImageFilter.GaussianBlur(7))
    inten = (np.asarray(core).astype(np.float32)
             + 0.7 * np.asarray(halo).astype(np.float32)) / 255.0
    return inten[:, :, None] * (EMBLEM_COL[None, None, :] * brightness)


# ---------------------------------------------------------------------------
# Text tiles (Arabic / Latin) rendered once, then composited with glow
# ---------------------------------------------------------------------------

def make_text_tile(lines, font_obj, fill, line_gap=1.5, pad=40, align="center"):
    """Render multi-line text to a tight RGBA tile."""
    tmp = Image.new("RGBA", (10, 10))
    td = ImageDraw.Draw(tmp)
    widths, heights = [], []
    for ln in lines:
        b = td.textbbox((0, 0), ln, font=font_obj)
        widths.append(b[2] - b[0])
        heights.append(b[3] - b[1])
    lh = int(font_obj.size * line_gap)
    W = max(widths) + pad * 2
    H = lh * len(lines) + pad * 2
    tile = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(tile)
    for i, ln in enumerate(lines):
        y = pad + i * lh + lh // 2
        d.text((W // 2, y), ln, font=font_obj, fill=fill, anchor="mm")
    return tile


def _measure(txt, font_obj):
    return ImageDraw.Draw(Image.new("RGBA", (4, 4))).textlength(txt, font=font_obj)


def make_word_tile(word, font_obj, fill):
    """Render a single word to a tight RGBA tile (symmetric padding for glow)."""
    pad = int(font_obj.size * 0.40)
    adv = _measure(word, font_obj)
    W = int(adv) + pad * 2
    H = int(font_obj.size * 1.75) + pad
    tile = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(tile).text((W // 2, H // 2), word, font=font_obj,
                              fill=fill, anchor="mm")
    return tile, adv


def layout_words(text, font_obj, fill, max_w, line_h, rtl):
    """Lay words out into wrapped, centred lines. Returns a list of
    (tile, dx, dy) in reading order, positioned relative to the block centre."""
    space_w = max(_measure(" ", font_obj), font_obj.size * 0.30)
    items = [(w,) + make_word_tile(w, font_obj, fill) for w in text.split()]
    lines, cur, curw = [], [], 0.0
    for (w, tile, adv) in items:
        add = adv + (space_w if cur else 0)
        if cur and curw + add > max_w:
            lines.append((cur, curw))
            cur, curw, add = [], 0.0, adv
        cur.append((tile, adv))
        curw += add
    if cur:
        lines.append((cur, curw))
    placed, n = [], len(lines)
    for li, (cur, curw) in enumerate(lines):
        dy = (li - (n - 1) / 2.0) * line_h
        if rtl:
            x = curw / 2.0
            for (tile, adv) in cur:
                placed.append((tile, x - adv / 2.0, dy))
                x -= adv + space_w
        else:
            x = -curw / 2.0
            for (tile, adv) in cur:
                placed.append((tile, x + adv / 2.0, dy))
                x += adv + space_w
    return placed


def wrap_latin(txt, font_obj, max_w):
    tmp = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    words, lines, cur = txt.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if tmp.textbbox((0, 0), trial, font=font_obj)[2] <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def wrap_arabic(txt, font_obj, max_w):
    tmp = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    words, lines, cur = txt.split(), [], []
    for w in words:
        trial = cur + [w]
        if tmp.textbbox((0, 0), shape_ar(" ".join(trial)), font=font_obj)[2] <= max_w or not cur:
            cur = trial
        else:
            lines.append(shape_ar(" ".join(cur)))
            cur = [w]
    if cur:
        lines.append(shape_ar(" ".join(cur)))
    return lines


# ---------------------------------------------------------------------------
# Compositing a premultiplied tile with additive glow onto HDR buffer
# ---------------------------------------------------------------------------

def composite_tile(buf, tile_rgba, cx, cy, scale, alpha, glow=0.45,
                   glow_color=GOLD):
    """Place an RGBA tile centred at (cx,cy), scaled, with given alpha,
    adding a soft additive glow. buf is HDR float (H,W,3)."""
    if alpha <= 0.001 or scale <= 0.01:
        return
    H, W = buf.shape[:2]
    tw, th = tile_rgba.size
    nw, nh = max(1, int(tw * scale)), max(1, int(th * scale))
    t = tile_rgba.resize((nw, nh), Image.LANCZOS)
    arr = np.asarray(t).astype(np.float32) / 255.0  # (nh,nw,4)
    rgb = arr[:, :, :3]
    a = arr[:, :, 3] * alpha
    x0 = int(cx - nw / 2)
    y0 = int(cy - nh / 2)
    # clip to buffer
    bx0, by0 = max(0, x0), max(0, y0)
    bx1, by1 = min(W, x0 + nw), min(H, y0 + nh)
    if bx1 <= bx0 or by1 <= by0:
        return
    tx0, ty0 = bx0 - x0, by0 - y0
    tx1, ty1 = tx0 + (bx1 - bx0), ty0 + (by1 - by0)
    sub = buf[by0:by1, bx0:bx1, :]
    ca = a[ty0:ty1, tx0:tx1][:, :, None]
    crgb = rgb[ty0:ty1, tx0:tx1, :]
    # over-composite (linear) plus additive glow proportional to alpha
    buf[by0:by1, bx0:bx1, :] = sub * (1 - ca) + crgb * ca
    if glow > 0:
        gw = a[ty0:ty1, tx0:tx1][:, :, None] * glow
        buf[by0:by1, bx0:bx1, :] += glow_color[None, None, :] * gw


# ---------------------------------------------------------------------------
# Post-processing: bloom, rays, chromatic aberration, vignette, grain, bars
# ---------------------------------------------------------------------------

def post_process(hdr, vignette_mask, grain_rng, frame_idx, bar_h,
                 exposure=1.0, bloom_strength=0.9, ca=1.6):
    H, W = hdr.shape[:2]
    img = hdr * exposure

    # --- bloom: threshold bright areas, blur at low res, add back ---
    bright = np.clip(img - 0.75, 0, None)
    small = Image.fromarray(
        np.clip(bright / (bright.max() + 1e-6) * 255, 0, 255).astype(np.uint8)
    ).resize((W // 4, H // 4), Image.BILINEAR)
    bmax = bright.max() + 1e-6
    b1 = small.filter(ImageFilter.GaussianBlur(6))
    b2 = small.filter(ImageFilter.GaussianBlur(18))
    bloom = (np.asarray(b1).astype(np.float32) + 0.6 * np.asarray(b2).astype(np.float32))
    bloom = np.asarray(Image.fromarray(np.clip(bloom, 0, 255).astype(np.uint8))
                       .resize((W, H), Image.BILINEAR)).astype(np.float32) / 255.0
    img = img + bloom * bmax * bloom_strength

    # --- tone map (filmic-ish) ---
    x = np.clip(img, 0, None)
    mapped = (x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14)
    mapped = np.clip(mapped, 0, 1)

    # --- chromatic aberration (radial channel split) ---
    if ca > 0:
        cax = int(ca)
        if cax >= 1:
            r = np.roll(mapped[:, :, 0], cax, axis=1)
            b = np.roll(mapped[:, :, 2], -cax, axis=1)
            mapped = np.dstack([r, mapped[:, :, 1], b])

    # --- vignette ---
    mapped = mapped * vignette_mask[:, :, None]

    # --- film grain ---
    grain = grain_rng.normal(0, 0.012, (H, W, 1)).astype(np.float32)
    mapped = np.clip(mapped + grain, 0, 1)

    out = (mapped * 255).astype(np.uint8)

    # --- anamorphic letterbox bars ---
    if bar_h > 0:
        out[:bar_h] = 0
        out[H - bar_h:] = 0
    return out


def build_vignette(W, H):
    yy, xx = np.mgrid[0:H, 0:W]
    cx, cy = W / 2, H / 2
    d = np.sqrt(((xx - cx) / (W * 0.62)) ** 2 + ((yy - cy) / (H * 0.62)) ** 2)
    return np.clip(1.15 - 0.55 * d ** 2.2, 0.25, 1.0).astype(np.float32)


# ---------------------------------------------------------------------------
# Brand watermark (faint, premium, slowly drifting — anti-theft)
# ---------------------------------------------------------------------------

BRAND_DIR = os.path.join(ROOT, "assets", "brand")


def _load_logo(name, W, frac):
    path = os.path.join(BRAND_DIR, name)
    if not os.path.exists(path):
        return None
    logo = Image.open(path).convert("RGBA")
    tw = max(1, int(W * frac))
    th = max(1, int(tw * logo.height / logo.width))
    return logo.resize((tw, th), Image.LANCZOS)


def load_watermark(W):
    """Return the brand marks used as watermarks.

    hero  — the wordmark for the premium placement inside the bottom bar.
    guard — a small, faint, drifting wordmark in a corner for anti-theft."""
    return {
        "hero": _load_logo("ketabi-horizontal-dark.png", W, 0.150),
        "guard": _load_logo("ketabi-horizontal-dark.png", W, 0.090),
    }


def _blend_logo(frame, logo, cx, cy, alpha):
    if logo is None or alpha <= 0.001:
        return
    lw, lh = logo.size
    x0, y0 = int(cx - lw / 2), int(cy - lh / 2)
    bx0, by0 = max(0, x0), max(0, y0)
    bx1, by1 = min(frame.shape[1], x0 + lw), min(frame.shape[0], y0 + lh)
    if bx1 <= bx0 or by1 <= by0:
        return
    arr = np.asarray(logo).astype(np.float32)
    a = (arr[:, :, 3] / 255.0 * alpha)[by0 - y0:by1 - y0, bx0 - x0:bx1 - x0, None]
    rgb = arr[:, :, :3][by0 - y0:by1 - y0, bx0 - x0:bx1 - x0, :]
    sub = frame[by0:by1, bx0:bx1, :].astype(np.float32)
    frame[by0:by1, bx0:bx1, :] = np.clip(sub * (1 - a) + rgb * a, 0, 255).astype(np.uint8)


def apply_watermark(frame, marks, t, W, H, bar_h):
    """Premium hero wordmark centred in the lower letterbox bar, plus a faint
    drifting wordmark in the top-right active area as an anti-theft guard.
    Applied after grading so the brand stays crisp."""
    if not marks:
        return frame
    # hero: centred in the bottom cinematic bar (clear of the verse)
    hero = marks.get("hero")
    if hero is not None:
        drift = int(np.sin(t * 0.08) * W * 0.006)
        _blend_logo(frame, hero, W * 0.5 + drift, H - bar_h / 2, alpha=0.62)
    # guard: faint, slowly drifting, top-right active area (away from centre text)
    guard = marks.get("guard")
    if guard is not None:
        gx = W * 0.83 + np.sin(t * 0.10) * W * 0.012
        gy = bar_h + guard.size[1] * 0.9 + np.sin(t * 0.07 + 1.0) * H * 0.010
        _blend_logo(frame, guard, gx, gy, alpha=0.14)
    return frame


# ---------------------------------------------------------------------------
# Timeline
# ---------------------------------------------------------------------------

class Scene:
    def __init__(self, kind, dur, **kw):
        self.kind = kind
        self.dur = dur
        self.kw = kw


def build_timeline():
    scenes = [Scene("title", 6.0)]
    total = len(verse.SEGMENTS)
    for i, (ar, tr, en) in enumerate(verse.SEGMENTS, 1):
        dur = 5.4 + min(2.2, len(en) / 50.0)
        climax = (i == 7)  # "His Throne extends over the heavens and the earth"
        scenes.append(Scene("verse", dur, idx=i, total=total,
                            ar=ar, tr=tr, en=en, climax=climax))
    scenes.append(Scene("finale", 9.0))
    return scenes


# ---------------------------------------------------------------------------
# Pre-rendered tiles per scene
# ---------------------------------------------------------------------------

def prepare_assets(W, H):
    max_w = int(W * 0.78)
    assets = {}
    # title
    assets["title_ar"] = make_text_tile(
        [shape_ar(verse.TITLE_AR)], font(F_QURAN, int(H * 0.16)), (245, 232, 200, 255))
    assets["title_en"] = make_text_tile(
        [verse.TITLE_EN], font(F_SERIF, int(H * 0.07)), (224, 196, 130, 255))
    assets["title_sub"] = make_text_tile(
        ["THE THRONE  •  " + verse.REFERENCE.upper()],
        font(F_LATIN, int(H * 0.028)), (190, 200, 205, 255))
    # per verse — Arabic & transliteration are laid out word-by-word for the
    # kinetic reveal; the English meaning fades in as wrapped line tiles.
    ar_font = font(F_QURAN, int(H * 0.100))
    tr_font = font(F_SERIF, int(H * 0.038))
    for i, (ar, tr, en) in enumerate(verse.SEGMENTS, 1):
        assets[f"arw{i}"] = layout_words(
            ar, ar_font, (246, 238, 214, 255), max_w,
            line_h=int(H * 0.100 * 1.6), rtl=True)
        assets[f"trw{i}"] = layout_words(
            tr, tr_font, (206, 214, 200, 255), max_w,
            line_h=int(H * 0.038 * 1.5), rtl=False)
        en_lines = wrap_latin(en, font(F_LATIN, int(H * 0.036)), max_w)
        assets[f"en{i}"] = make_text_tile(
            en_lines, font(F_LATIN, int(H * 0.036)), (214, 218, 224, 255))
        assets[f"ct{i}"] = make_text_tile(
            [f"{i} / {len(verse.SEGMENTS)}"], font(F_LATIN, int(H * 0.024)),
            (150, 160, 165, 255))
    # finale — full verse revealed line-by-line (cascade)
    full_font = font(F_QURAN, int(H * 0.060))
    fa = wrap_arabic(verse.FULL_ARABIC, full_font, int(W * 0.82))
    lh = int(H * 0.060 * 1.75)
    assets["full_lines"] = []
    for li, line in enumerate(fa):
        tile = make_text_tile([line], full_font, (244, 236, 212, 255), line_gap=1.0)
        dy = (li - (len(fa) - 1) / 2.0) * lh
        assets["full_lines"].append((tile, dy))
    assets["full_ref"] = make_text_tile(
        [verse.REFERENCE.upper()], font(F_LATIN, int(H * 0.028)), (224, 196, 130, 255))
    return assets


# ---------------------------------------------------------------------------
# Per-scene frame painters
# ---------------------------------------------------------------------------

def reveal_words(buf, placed, lt, dur, ox, oy, stagger, start, hold_exit,
                 glow_color, rise, gmul=0.4, scale0=0.82, app=0.45):
    """Reveal a list of (tile, dx, dy) word tiles staggered in reading order.
    Each word fades + rises into place with a glow burst that then settles."""
    ex = smooth((lt - (dur - hold_exit)) / hold_exit)
    for k, (tile, dx, dy) in enumerate(placed):
        loc = lt - (start + k * stagger)
        if loc < 0:
            continue
        a = smooth(loc / app) * (1.0 - ex)
        if a <= 0.002:
            continue
        ri = (1.0 - smooth(loc / (app * 1.3))) * rise
        s = lerp(scale0, 1.0, smoother(min(1.0, loc / app)))
        burst = 1.0 - smooth(loc / (app * 0.9))     # 1 -> 0 as it lands
        g = gmul * (0.45 + 1.7 * burst)
        composite_tile(buf, tile, ox + dx, oy + dy - ri, s, a,
                       glow=g, glow_color=glow_color)


def paint_title(buf, assets, lt, dur, W, H):
    # text emerges from depth: scale up + fade in, gentle float
    a = smooth(lt / 1.6) * (1.0 - smooth((lt - (dur - 1.4)) / 1.4))
    s = lerp(0.7, 1.0, smoother(min(1.0, lt / 2.6)))
    drift = np.sin(lt * 0.5) * H * 0.006
    composite_tile(buf, assets["title_ar"], W * 0.5, H * 0.40 + drift,
                   s, a, glow=0.7, glow_color=GOLD)
    composite_tile(buf, assets["title_en"], W * 0.5, H * 0.585 + drift,
                   lerp(0.9, 1.0, smooth(lt / 2.0)),
                   smooth((lt - 0.6) / 1.6) * a / max(a, 1e-6) * a, glow=0.3)
    composite_tile(buf, assets["title_sub"], W * 0.5, H * 0.66 + drift,
                   1.0, smooth((lt - 1.0) / 1.6) * a / max(a, 1e-6) * a, glow=0.1)


def verse_alpha(lt, dur, fin=1.1, fout=1.1):
    return smooth(lt / fin) * (1.0 - smooth((lt - (dur - fout)) / fout))


def paint_verse(buf, assets, sc, lt, W, H, sway=(0.0, 0.0)):
    i = sc.kw["idx"]
    dur = sc.dur
    sx, sy = sway
    a_all = verse_alpha(lt, dur)
    composite_tile(buf, assets[f"ct{i}"], W * 0.5 + sx * 0.3, H * 0.155 + sy * 0.3,
                   1.0, a_all * 0.75, glow=0.05, glow_color=PARCH)

    # Arabic — word by word, in reading order, igniting as each lands.
    arw = assets[f"arw{i}"]
    reveal_words(buf, arw, lt, dur, W * 0.5 + sx, H * 0.40 + sy,
                 stagger=0.16, start=0.35, hold_exit=1.0,
                 glow_color=GOLD, rise=H * 0.028, gmul=0.42, scale0=0.80)

    # Transliteration — quick left-to-right word cascade, after Arabic starts.
    tr_start = 0.7 + len(arw) * 0.16 * 0.45
    trw = assets[f"trw{i}"]
    reveal_words(buf, trw, lt, dur, W * 0.5 + sx * 0.6, H * 0.66 + sy * 0.6,
                 stagger=0.05, start=tr_start, hold_exit=0.9,
                 glow_color=GOLD, rise=H * 0.012, gmul=0.12, scale0=0.92, app=0.3)

    # English meaning — fades in as a block once the rest is settling.
    en_start = tr_start + len(trw) * 0.05 + 0.3
    a_en = smooth((lt - en_start) / 0.9) * (1.0 - smooth((lt - (dur - 0.9)) / 0.9))
    composite_tile(buf, assets[f"en{i}"], W * 0.5 + sx * 0.45, H * 0.78 + sy * 0.45,
                   1.0, a_en, glow=0.05, glow_color=PARCH)


def paint_finale(buf, assets, lt, dur, W, H, sway=(0.0, 0.0)):
    sx, sy = sway
    # Full verse cascades in line by line, holds, then converges to a point.
    converge = smooth((lt - (dur - 2.6)) / 2.4)
    lines = assets["full_lines"]
    for li, (tile, dy) in enumerate(lines):
        loc = lt - (0.4 + li * 0.45)
        if loc < 0:
            continue
        a_in = smooth(loc / 0.9)
        a = a_in * (1.0 - converge)
        if a <= 0.002:
            continue
        burst = 1.0 - smooth(loc / 0.8)
        s = lerp(0.9, 1.0, smoother(min(1.0, loc / 0.8))) * lerp(1.0, 0.05, converge)
        composite_tile(buf, tile, W * 0.5 + sx * 0.6,
                       H * 0.44 + dy * lerp(1.0, 0.05, converge) + sy * 0.6,
                       s, a, glow=0.30 + 0.8 * burst, glow_color=GOLD)
    composite_tile(buf, assets["full_ref"], W * 0.5 + sx * 0.4, H * 0.80 + sy * 0.4,
                   lerp(1.0, 0.2, converge),
                   smooth((lt - (0.4 + len(lines) * 0.45)) / 1.2) * (1 - converge),
                   glow=0.15)


# ---------------------------------------------------------------------------
# Main render
# ---------------------------------------------------------------------------

def render(out_path, W, H, fps, preview=False, seconds_cap=None,
           poster_only=False):
    print(f"[setup] {W}x{H} @ {fps}fps   raqm={USE_RAQM}")
    vignette = build_vignette(W, H)
    bar_h = int((H - W / 2.39) / 2)  # anamorphic 2.39:1
    assets = prepare_assets(W, H)
    watermark = load_watermark(W)
    print(f"[brand] watermark={'loaded' if watermark is not None else 'MISSING'}")

    # particle fields (parallax depth layers)
    star_far = Field(2600, W, H, 0.18, 7.0, scale=W * 0.115, seed=7,
                     warm_ratio=0.55)
    dust = Field(700, W, H, 0.18, 5.0, scale=W * 0.10, seed=21,
                 warm_ratio=0.95, vdrift=0.0006)

    timeline = build_timeline()
    if preview:
        timeline = [timeline[0], timeline[1], timeline[7], timeline[-1]]

    grain_rng = np.random.default_rng(1234)

    # camera dz schedule helper per scene kind
    def dz_for(kind, lt, dur, climax):
        base = 0.010
        if kind == "title":
            return base * lerp(2.2, 0.8, smooth(lt / dur))
        if kind == "finale":
            return base * lerp(0.9, 0.25, smooth(lt / dur))
        # verse: brief warp accelerate at the start (transition), then settle
        warp = (1.0 - smooth(lt / 0.7)) * 0.05
        spd = base * (1.0 + (0.6 if climax else 0.0))
        return spd + warp

    if poster_only:
        # render a representative single frame (climax verse) for inspection
        frame = _render_single_poster(assets, star_far, dust, vignette, bar_h,
                                      W, H, grain_rng, watermark)
        ppath = os.path.join(ROOT, "output", "cinematic_poster.png")
        Image.fromarray(frame).save(ppath)
        print(f"[poster] {ppath}")
        return ppath

    total_dur = sum(s.dur for s in timeline)
    if seconds_cap:
        total_dur = min(total_dur, seconds_cap)
    total_frames = int(total_dur * fps)
    print(f"[plan] {len(timeline)} scenes · {total_dur:.1f}s · {total_frames} frames")

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    cmd = [ffmpeg, "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
           "-s", f"{W}x{H}", "-r", str(fps), "-i", "-", "-an",
           "-c:v", "libx264", "-preset", "medium", "-crf", "17",
           "-pix_fmt", "yuv420p", "-movflags", "+faststart", out_path]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE,
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    done = 0
    abs_t = 0.0
    emblem_phase = 0.0
    for sc in timeline:
        n = int(sc.dur * fps)
        climax = sc.kw.get("climax", False)
        for f in range(n):
            if seconds_cap and abs_t >= seconds_cap:
                break
            lt = f / fps
            dz = dz_for(sc.kind, lt, sc.dur, climax)
            emblem_phase += dz

            hdr = np.zeros((H, W, 3), dtype=np.float32)

            # --- camera parallax sway (nearer layers drift more) ---
            pan_u = 0.055 * np.sin(abs_t * 0.16)
            pan_v = 0.038 * np.sin(abs_t * 0.12 + 1.0)
            sway = (pan_u * 240.0, pan_v * 240.0)        # mid-depth screen offset
            emb_off = (pan_u * 90.0, pan_v * 90.0)       # far layer offset

            # --- background particle fields ---
            star_far.advance(dz)
            dust.advance(dz * 0.7)
            warpx = 4 if lt < 0.7 and sc.kind == "verse" else (5 if sc.kind == "title" and lt < 1.5 else 2)
            star_far.render(hdr, dz, brightness=1.0, streak=warpx,
                            pan_u=pan_u, pan_v=pan_v)
            dust.render(hdr, dz * 0.7, brightness=0.8, streak=1,
                        pan_u=pan_u * 1.3, pan_v=pan_v * 1.3)

            # --- rotating 3-D emblem ---
            if sc.kind == "title":
                emb_b = lerp(0.0, 0.5, smooth((lt - 1.0) / 3.0))
                emb_scale = W * 0.42
                emb_cz = lerp(5.0, 3.2, smooth(lt / sc.dur))
            elif sc.kind == "finale":
                emb_b = lerp(0.6, 0.0, smooth((lt - (sc.dur - 3.0)) / 3.0))
                emb_scale = W * 0.5
                emb_cz = 2.6
            else:
                base_b = 0.30
                emb_b = base_b * (1.4 if climax else 1.0)
                emb_scale = W * (0.62 if climax else 0.46)
                emb_cz = (2.3 if climax else 3.0)
            if emb_b > 0.001:
                emb = render_emblem(W, H, emblem_phase * 6.0 + abs_t,
                                    emb_cz, rot_speed=0.5,
                                    scale_px=emb_scale, brightness=emb_b,
                                    cx_off=emb_off[0], cy_off=emb_off[1])
                hdr += emb

            # --- text layer ---
            if sc.kind == "title":
                paint_title(hdr, assets, lt, sc.dur, W, H)
            elif sc.kind == "finale":
                paint_finale(hdr, assets, lt, sc.dur, W, H, sway=sway)
            else:
                paint_verse(hdr, assets, sc, lt, W, H, sway=sway)

            # global fade from/to black at very start and end
            fade = 1.0
            if abs_t < 1.2:
                fade = smooth(abs_t / 1.2)
            frame = post_process(hdr, vignette, grain_rng, done, bar_h,
                                 exposure=1.0, bloom_strength=0.95, ca=1.6)
            frame = apply_watermark(frame, watermark, abs_t, W, H, bar_h)
            if fade < 1.0:
                frame = (frame.astype(np.float32) * fade).astype(np.uint8)

            proc.stdin.write(frame.tobytes())
            done += 1
            abs_t += 1.0 / fps
            if done % 30 == 0:
                pct = 100 * done / total_frames
                sys.stdout.write(f"\r[render] {done}/{total_frames} ({pct:4.1f}%)")
                sys.stdout.flush()
        if seconds_cap and abs_t >= seconds_cap:
            break
    sys.stdout.write("\n")
    proc.stdin.close()
    proc.wait()
    size_mb = os.path.getsize(out_path) / 1e6
    print(f"[done] {out_path}  ({size_mb:.1f} MB)")
    return out_path


def _render_single_poster(assets, star_far, dust, vignette, bar_h, W, H, grain,
                          watermark=None):
    hdr = np.zeros((H, W, 3), dtype=np.float32)
    for _ in range(12):
        star_far.advance(0.01)
    star_far.render(hdr, 0.01, brightness=1.0, streak=3)
    dust.render(hdr, 0.007, brightness=0.8, streak=1)
    emb = render_emblem(W, H, 1.4, 2.3, 0.5, W * 0.62, 0.42)
    hdr += emb
    # paint a verse
    sc = Scene("verse", 6.0, idx=7, total=9)
    paint_verse(hdr, assets, sc, 2.4, W, H)
    frame = post_process(hdr, vignette, grain, 0, bar_h, bloom_strength=0.95, ca=1.6)
    return apply_watermark(frame, watermark, 1.4, W, H, bar_h)


def main():
    ap = argparse.ArgumentParser(description="Cinematic 3-D Ayat al-Kursi renderer.")
    ap.add_argument("--out", default=os.path.join(ROOT, "output",
                    "ayat_al_kursi_cinematic.mp4"))
    ap.add_argument("--width", type=int, default=1920)
    ap.add_argument("--height", type=int, default=1080)
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--preview", action="store_true")
    ap.add_argument("--poster", action="store_true")
    ap.add_argument("--seconds-cap", type=float, default=None)
    args = ap.parse_args()
    render(args.out, args.width, args.height, args.fps,
           preview=args.preview, seconds_cap=args.seconds_cap,
           poster_only=args.poster)


if __name__ == "__main__":
    main()
