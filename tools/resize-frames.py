"""Finalize a keyed (RGBA) frame set for the web, optionally at a smaller width.

Usage:  python tools/resize-frames.py <src_dir> <out_dir> [width]
- Resizes in premultiplied alpha (no dark or coloured fringes at cut-out edges), Lanczos.
- Snaps near-invisible alpha to 0 and near-solid alpha to 255 and keeps 64 alpha levels:
  visually identical on the hero's backdrop, ~30% smaller files.
src_dir and out_dir may be the same folder (frames are rewritten in place).
"""
import shutil
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ALPHA_LO, ALPHA_HI, ALPHA_LEVELS = 12, 243, 64


def finalize_alpha(rgba):
    a = rgba[..., 3].astype(np.float32)
    a[a < ALPHA_LO] = 0
    a[a > ALPHA_HI] = 255
    a = np.round(a / 255 * (ALPHA_LEVELS - 1)) / (ALPHA_LEVELS - 1) * 255
    out = rgba.copy()
    out[..., 3] = a.astype(np.uint8)
    out[out[..., 3] == 0, :3] = 0  # hidden pixels carry no detail to encode
    return out


def main(src, out, width=None):
    src, out = Path(src), Path(out)
    out.mkdir(parents=True, exist_ok=True)
    files = sorted(src.glob('*.webp'))
    frames = [(f.name, Image.open(f).convert('RGBA')) for f in files]  # read all first: src may equal out
    total = 0
    for name, im in frames:
        if width and int(width) != im.width:
            w = int(width)
            im = im.convert('RGBa').resize((w, round(im.height * w / im.width)), Image.LANCZOS).convert('RGBA')
        dest = out / name
        Image.fromarray(finalize_alpha(np.asarray(im)), 'RGBA').save(dest, 'WEBP', quality=80, alpha_quality=100, method=4)
        total += dest.stat().st_size
    if (src / 'meta.json').exists() and src.resolve() != out.resolve():
        shutil.copy(src / 'meta.json', out / 'meta.json')
    print(f'{len(frames)} frames -> {out} at {frames[0][1].width if not width else width}px wide ({total / 1e6:.1f} MB)')


if __name__ == '__main__':
    if len(sys.argv) not in (3, 4):
        sys.exit(__doc__)
    main(*sys.argv[1:])
