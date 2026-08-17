#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Render accurate satellite maps (with a location pin) for the "location reveal"
videos. Uses real map tiles via staticmap (Esri World Imagery satellite, with an
OpenStreetMap fallback). No API key.

Usage:
  python3 scripts/make_map.py --lat 26.7917 --lon 37.9539 \
      --out-wide public/maps/mws-wide.png --zoom-wide 5 \
      --out-close public/maps/mws-close.png --zoom-close 14
"""
import argparse
import os
import sys

ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
OSM = "https://tile.openstreetmap.org/{z}/{x}/{y}.png"


def render(lat, lon, zoom, w, h, out):
    from staticmap import StaticMap, CircleMarker

    for tpl in (ESRI, OSM):
        try:
            m = StaticMap(w, h, url_template=tpl, headers={"User-Agent": "ketabi-map/1.0"})
            # White halo + red dot = a clear pin. (staticmap takes (lon, lat).)
            m.add_marker(CircleMarker((lon, lat), "white", 34))
            m.add_marker(CircleMarker((lon, lat), "#ff2d2d", 22))
            img = m.render(zoom=zoom)
            os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
            img.save(out)
            print(f"  ✓ {out} (zoom {zoom}, {'satellite' if tpl is ESRI else 'osm'})")
            return True
        except Exception as e:  # noqa: BLE001
            print(f"  ! {tpl.split('/')[2]} failed: {e}")
    return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lat", type=float, required=True)
    ap.add_argument("--lon", type=float, required=True)
    ap.add_argument("--out-wide", required=True)
    ap.add_argument("--out-close", required=True)
    ap.add_argument("--zoom-wide", type=int, default=5)
    ap.add_argument("--zoom-close", type=int, default=14)
    ap.add_argument("--w", type=int, default=1080)
    ap.add_argument("--h", type=int, default=1920)
    args = ap.parse_args()
    ok1 = render(args.lat, args.lon, args.zoom_wide, args.w, args.h, args.out_wide)
    ok2 = render(args.lat, args.lon, args.zoom_close, args.w, args.h, args.out_close)
    if not (ok1 and ok2):
        sys.exit("map render failed")


if __name__ == "__main__":
    main()
