"""Remove the studio backdrop from the hero frame sequence (static camera, smooth backdrop).

Usage:  python tools/key-frames.py <src_dir> <out_dir>
Needs:  numpy, pillow (with WebP), scipy

1. Fit a clean background plate: a smooth 2-D polynomial per channel, fitted to pixels that
   are confidently backdrop (cyan: green well above red, blue close to green) across frames.
   Every frame is keyed against the same plate, so static edges never flicker.
2. Per pixel, measure how unlike the backdrop it is (chroma + luma distance to the plate).
   Far from it -> solid subject (alpha 1). Close to it -> backdrop (alpha 0).
3. In the band between, estimate the subject colour by spreading nearby solid colour outward,
   then compute alpha by projecting the pixel between plate and that colour, and un-mix the
   backdrop out of it (no cyan halo). Thin parts with no solid core nearby (hoses) fall back
   to the distance-based alpha.
4. Steady static edges over time (colour-weighted temporal average of alpha).
5. Drop isolated specks, crop every frame to the union bounding box of the subject and save
   RGBA WebP, plus meta.json with the crop, so the player knows the original geometry.
   (The source's last 2 rows are a compression artifact and are trimmed first.)
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

sys.path.insert(0, str(Path(__file__).parent))
from importlib import import_module

finalize_alpha = import_module('resize-frames').finalize_alpha  # snap + quantise alpha for size

LO, HI = 22.0, 50.0  # distance to the plate: <= LO backdrop, >= HI solid subject
TRIM_BOTTOM = 2  # the source frames' last 2 rows are a green compression artifact
TEMPORAL_RADIUS = 2  # frames on each side used to steady static edges
TEMPORAL_SIGMA = 8.0  # colour difference (0-255) at which a neighbouring frame stops counting
LUMA = np.array([0.299, 0.587, 0.114], np.float32)


def load(path):
    im = np.asarray(Image.open(path).convert('RGB')).astype(np.float32)
    return im[: im.shape[0] - TRIM_BOTTOM]


def backdrop_seed(im):
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    seed = ((g - r) > 45) & ((b - g) < 40) & ((b - g) > -15)
    return ndi.binary_erosion(seed, iterations=6)


def basis(x, y, deg=5):
    return np.stack([x**i * y**j for i in range(deg + 1) for j in range(deg + 1 - i)], -1)


def fit_plate(frames, h, w):
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    xn, yn = xx / w * 2 - 1, yy / h * 2 - 1
    # backdrop in every sampled frame (moving subjects never pollute the fit)
    seed = np.logical_and.reduce([backdrop_seed(f) for f in frames])
    ref = np.mean(frames, axis=0)
    mask = seed
    for _ in range(3):  # refit, dropping residual outliers
        idx = np.flatnonzero(mask.ravel())[::5]
        a = basis(xn.ravel()[idx], yn.ravel()[idx])
        coef = [np.linalg.lstsq(a, ref[..., c].ravel()[idx], rcond=None)[0] for c in range(3)]
        plate = np.stack([basis(xn, yn) @ k for k in coef], -1).astype(np.float32)
        mask = seed & (np.abs(ref - plate).max(-1) < 10)
    res = np.abs(ref - plate).max(-1)[mask]
    print(f'plate fit on {mask.mean() * 100:.1f}% of pixels: residual mean {res.mean():.2f}, p99 {np.percentile(res, 99):.2f}')
    return plate


def distance(im, plate):
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    pr, pg, pb = plate[..., 0], plate[..., 1], plate[..., 2]
    chroma = np.hypot((g - r) - (pg - pr), (b - r) - (pb - pr))
    luma = np.abs(im @ LUMA - plate @ LUMA)
    return np.hypot(chroma, luma)


def spread(values, weight, sigma, passes):
    """Normalized convolution: push colours from weighted pixels into their surroundings."""
    v, wsum = values * weight[..., None], weight.astype(np.float32)
    for _ in range(passes):
        v = np.stack([ndi.gaussian_filter(v[..., c], sigma) for c in range(3)], -1)
        wsum = ndi.gaussian_filter(wsum, sigma)
    return v / np.maximum(wsum, 1e-6)[..., None], wsum


def key(im, plate):
    d = distance(im, plate)
    t = np.clip((d - LO) / (HI - LO), 0, 1)
    alpha_d = t * t * (3 - 2 * t)
    core = d >= HI
    # drop isolated specks (compression noise on the backdrop) but keep thin lines like hoses
    labels, n = ndi.label(core)
    if n:
        sizes = ndi.sum(core, labels, index=np.arange(1, n + 1))
        core &= np.isin(labels, np.flatnonzero(sizes >= 25) + 1)
    band = (d > LO) & ~core

    # subject colour estimate around the edges, from nearby solid pixels
    fg_est, support = spread(im, core, sigma=2.0, passes=2)
    diff = fg_est - plate
    span = np.einsum('...c,...c', diff, diff)
    proj = np.einsum('...c,...c', im - plate, diff) / np.maximum(span, 1e-6)
    reliable = (support > 0.15) & (span > 30.0**2)
    alpha = np.where(core, 1.0, 0.0)
    alpha = np.where(band, np.where(reliable, np.clip(proj, 0, 1), alpha_d), alpha)
    # tiny alpha is just noise on the backdrop
    alpha = np.where(alpha < 0.04, 0.0, alpha).astype(np.float32)

    # drop isolated specks (compression noise) that survived as faint alpha
    labels, n = ndi.label(alpha > 0)
    if n:
        sizes = ndi.sum(alpha > 0, labels, index=np.arange(1, n + 1))
        alpha[~np.isin(labels, np.flatnonzero(sizes >= 150) + 1)] = 0

    # un-mix the backdrop out of partially transparent pixels; where alpha is only an estimate
    # (thin parts with no solid core nearby, e.g. hoses) cap the boost so they don't glow
    floor = np.where(band & ~reliable, 0.4, 0.12)
    a = np.maximum(alpha, floor)[..., None]
    rgb = np.where((alpha > 0)[..., None] & (alpha < 1)[..., None], plate + (im - plate) / a, im)
    return np.clip(rgb, 0, 255), alpha


def main(src, out):
    src, out = Path(src), Path(out)
    files = sorted(src.glob('*.webp'))
    if not files:
        sys.exit(f'no .webp frames in {src}')
    first = load(files[0])
    h, w, _ = first.shape
    sample = [load(f) for f in files[:: max(1, len(files) // 8)]]
    plate = fit_plate(sample, h, w)

    srcs, keyed = [], []
    for f in files:
        im = load(f)
        rgb, alpha = key(im, plate)
        srcs.append(im.astype(np.uint8))
        keyed.append([f.name, rgb.astype(np.uint8), alpha])

    # Steady the edges: the source is lossy, so per-frame noise makes static edges shimmer.
    # Average each pixel's alpha with its neighbours in time, weighted by how alike that pixel's
    # colour is across those frames: static edges are averaged, moving edges are left alone.
    alphas = [k[2] for k in keyed]
    for t in range(len(keyed)):
        acc, wsum = np.zeros_like(alphas[t]), np.zeros_like(alphas[t])
        for k in range(max(0, t - TEMPORAL_RADIUS), min(len(keyed), t + TEMPORAL_RADIUS + 1)):
            diff = np.abs(srcs[t].astype(np.int16) - srcs[k].astype(np.int16)).max(-1).astype(np.float32)
            wt = np.exp(-((diff / TEMPORAL_SIGMA) ** 2))
            acc += wt * alphas[k]
            wsum += wt
        keyed[t][2] = acc / wsum
    for k in keyed:
        k[2] = (k[2] * 255 + 0.5).astype(np.uint8)

    # crop to the union of every frame's subject (+ margin)
    union = np.logical_or.reduce([a > 0 for _, _, a in keyed])
    ys, xs = np.nonzero(union)
    m = 6
    x0, x1 = max(0, xs.min() - m), min(w, xs.max() + 1 + m)
    y0, y1 = max(0, ys.min() - m), min(h, ys.max() + 1 + m)
    out.mkdir(parents=True, exist_ok=True)
    total = 0
    for name, rgb, alpha in keyed:
        rgba = np.dstack([rgb, alpha])[y0:y1, x0:x1]
        dest = out / name
        Image.fromarray(finalize_alpha(rgba), 'RGBA').save(dest, 'WEBP', quality=80, alpha_quality=100, method=4)
        total += dest.stat().st_size
    meta = {'source': [w, h + TRIM_BOTTOM], 'crop': [int(x0), int(y0), int(x1 - x0), int(y1 - y0)], 'frames': len(keyed)}
    (out / 'meta.json').write_text(json.dumps(meta, indent=2) + '\n')
    print(f'{len(keyed)} frames -> {out} ({total / 1e6:.1f} MB), crop {meta["crop"]}')


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(*sys.argv[1:])
