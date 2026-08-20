#!/usr/bin/env bash
# Encode a hero backdrop loop from a source video.
#
#   ./scripts/encode-hero-loop.sh raw/eliyahu.mp4 00:00:12 10
#                                 ^source          ^start   ^seconds
#
# Writes public/video/hero-loop.webm and .mp4, then print the line to paste
# into src/data.js.
#
# Why these settings: the clip sits at 11% opacity behind a scrim, so detail is
# invisible and bitrate spent on it is wasted. 1280 wide, 24fps, heavy CRF, and
# NO AUDIO TRACK AT ALL - a muted <video> still downloads the audio stream if
# one is present, which is pure waste on a background element.
set -euo pipefail

SRC="${1:?usage: encode-hero-loop.sh <source> [start] [duration]}"
START="${2:-00:00:00}"
DUR="${3:-12}"
OUT_DIR="public/video"
mkdir -p "$OUT_DIR"

COMMON=(-ss "$START" -t "$DUR" -i "$SRC" -an -vf "scale=1280:-2,fps=24" -movflags +faststart)

ffmpeg -y "${COMMON[@]}" -c:v libvpx-vp9 -crf 40 -b:v 0 -row-mt 1 "$OUT_DIR/hero-loop.webm"
ffmpeg -y "${COMMON[@]}" -c:v libx264   -crf 30 -preset slow -pix_fmt yuv420p "$OUT_DIR/hero-loop.mp4"

echo
ls -lh "$OUT_DIR"
echo
echo "Now set this in src/data.js:"
echo "export const HERO_BG_VIDEO = { webm: '/video/hero-loop.webm', mp4: '/video/hero-loop.mp4' }"
