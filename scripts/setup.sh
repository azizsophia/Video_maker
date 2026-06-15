#!/usr/bin/env bash
#
# One-shot setup for the Ayat al-Kursi renderer.
#   - installs the Python dependencies
#   - downloads the Amiri / AmiriQuran fonts (if missing)
#   - copies a Latin fallback font from the system
#
set -euo pipefail
cd "$(dirname "$0")/.."

echo ">> Installing Python dependencies …"
pip3 install -q -r requirements.txt

mkdir -p assets/fonts

if [ ! -f assets/fonts/AmiriQuran.ttf ]; then
  echo ">> Downloading Amiri fonts …"
  tmp="$(mktemp -d)"
  curl -sSL -o "$tmp/amiri.zip" \
    "https://github.com/aliftype/amiri/releases/download/1.000/Amiri-1.000.zip"
  ( cd "$tmp" && unzip -q amiri.zip )
  cp "$tmp"/Amiri-1.000/AmiriQuran.ttf   assets/fonts/
  cp "$tmp"/Amiri-1.000/Amiri-Regular.ttf assets/fonts/
  rm -rf "$tmp"
fi

# Latin font for transliteration / translation.
for f in DejaVuSans DejaVuSans-Bold DejaVuSerif; do
  if [ ! -f "assets/fonts/$f.ttf" ]; then
    src="$(fc-match -f '%{file}' "${f/DejaVu/DejaVu }" 2>/dev/null || true)"
    [ -n "$src" ] && cp "$src" "assets/fonts/$f.ttf" || true
  fi
done
# Fallback: pull DejaVu straight from the common system path.
for f in DejaVuSans DejaVuSans-Bold DejaVuSerif; do
  [ -f "assets/fonts/$f.ttf" ] || cp "/usr/share/fonts/truetype/dejavu/$f.ttf" "assets/fonts/$f.ttf"
done

echo ">> Setup complete. Render with:  python3 src/render.py"
