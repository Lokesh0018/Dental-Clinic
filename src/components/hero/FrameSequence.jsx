import { useEffect, useRef, useState } from 'react';

/*
 * Plays a numbered image sequence on a canvas as a seamless, continuous loop.
 *
 * - Ping-pong playback (forward, then back) with cosine-eased turnarounds: every step is a
 *   real one-frame step, so there is never a jump or a cross-fade (ghosting) at the seam.
 *   Speed peaks at `fps` mid-sequence and eases to a stop at each end before reversing.
 * - Frames are only ever scaled uniformly (no stretching) and never cropped into the action.
 * - Each frame is decoded once at the size it is displayed (capped). Its studio backdrop is
 *   faded into transparency at the left and top in canvas space (only over plain backdrop, never
 *   the action), so the scene blends into the hero card instead of reading as a rectangle.
 * - Draws only when the frame index changes; stops when `playing` is false.
 */

const SRC_W = 1920;
const SRC_H = 1080;
// The action (tooth, dentists, scaffolds) lives between x ≈ 340 and 1640 and below y ≈ 40 in the
// source. The fit window adds ~150px of plain backdrop on the left so the left edge fade only
// ever lands on backdrop, never on a dentist.
const ACTION_X0 = 330;
const ACTION_Y0 = 32;
const WIN_X0 = 190;
const WIN_X1 = 1660;
const CENTER_X = (WIN_X0 + WIN_X1) / 2;
// Decoded width cap: 61 frames × 1280×720 RGBA ≈ 225 MB worst case (2× screens).
const MAX_FRAME_W = 1280;
const CONCURRENCY = 4;

export function sequenceUrls({ path, start, count, pad, ext }) {
  return Array.from({ length: count }, (_, i) => `${path}${String(start + i).padStart(pad, '0')}${ext}`);
}

/** Cover the box, but never crop into the fit window; bottom-aligned, centred on the window. */
function layout(w, h) {
  const s = Math.min(Math.max(h / SRC_H, w / SRC_W), w / (WIN_X1 - WIN_X0));
  return { s, dx: w / 2 - CENTER_X * s, dy: h - SRC_H * s };
}

/** Transparent at 0 → opaque at (x, y), eased so the transition has no visible start line. */
function edge(ctx, x, y) {
  const g = ctx.createLinearGradient(0, 0, x, y);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.35, 'rgba(0,0,0,0.22)');
  g.addColorStop(0.7, 'rgba(0,0,0,0.72)');
  g.addColorStop(1, '#000');
  return g;
}

function loadImage(url, priority) {
  const img = new Image();
  img.decoding = 'async';
  if (priority) img.fetchPriority = priority;
  img.src = url;
  return { img, done: img.decode().then(() => img) };
}

/** Downscale once; fade the bottom edge (it meets the card or the proof card on small screens). */
function bake(img, width) {
  const height = Math.round((width * SRC_H) / SRC_W);
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const x = c.getContext('2d');
  x.imageSmoothingQuality = 'high';
  x.drawImage(img, 0, 0, width, height);
  x.globalCompositeOperation = 'destination-in';
  const g = x.createLinearGradient(0, 0, 0, height);
  g.addColorStop(0.88, '#000');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, width, height);
  return c;
}

export default function FrameSequence({ urls, fps = 24, playing = true, still = false, className }) {
  const canvas = useRef(null);
  const frames = useRef([]);
  const current = useRef(-1);
  const [ready, setReady] = useState(false); // first frame painted
  const [loaded, setLoaded] = useState(false); // every frame available

  const draw = (i) => {
    const c = canvas.current;
    const f = frames.current[i];
    if (!c || !f || !c.width) return;
    const ctx = c.getContext('2d');
    const { s, dx, dy } = layout(c.width, c.height);
    const w = SRC_W * s;
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(f, dx, dy, w, SRC_H * s);
    // The source has little sky above the top dentist. Extend the backdrop upward by repeating its
    // top row (plain backdrop: nothing in the scene is stretched), so the top fade can be long.
    if (dy > 0) ctx.drawImage(f, 0, 0, f.width, 1, dx, 0, w, dy + 1);
    // Fade left and top edges over backdrop only: they end just before the action starts.
    ctx.globalCompositeOperation = 'destination-in';
    const fadeX = dx + ACTION_X0 * s;
    if (fadeX > 1) {
      ctx.fillStyle = edge(ctx, fadeX, 0);
      ctx.fillRect(0, 0, c.width, c.height);
    }
    const fadeY = Math.max(dy, 0) + ACTION_Y0 * s;
    if (fadeY > 1) {
      ctx.fillStyle = edge(ctx, 0, fadeY);
      ctx.fillRect(0, 0, c.width, c.height);
    }
    ctx.globalCompositeOperation = 'source-over';
    current.current = i;
  };

  /* Keep the backing store matched to the element size; redraw on resize. */
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const fit = () => {
      // layout size, not getBoundingClientRect: the entrance scale must not shrink the backing store
      const width = c.clientWidth;
      const height = c.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.max(1, Math.round(width * dpr));
      c.height = Math.max(1, Math.round(height * dpr));
      draw(Math.max(current.current, 0));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  /* Load: first frame immediately (poster), the rest only when it will actually play. */
  useEffect(() => {
    const c = canvas.current;
    if (!c || !urls.length) return;
    let cancelled = false;
    const pending = [];
    const { s } = layout(c.clientWidth || 800, c.clientHeight || 600);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(Math.min(SRC_W, MAX_FRAME_W, Math.max(480, SRC_W * s * dpr)));
    const slots = new Array(urls.length).fill(null);

    const fetchFrame = (i, priority) => {
      const job = loadImage(urls[i], priority);
      pending.push(job.img);
      return job.done.then(
        (img) => {
          if (!cancelled) slots[i] = bake(img, width);
        },
        () => {}, // a missing frame is skipped, never fatal
      );
    };

    fetchFrame(0, 'high').then(() => {
      if (cancelled || !slots[0]) return;
      frames.current = [slots[0]];
      draw(0);
      setReady(true);
      if (still) return;

      let next = 1;
      const worker = async () => {
        while (!cancelled && next < urls.length) await fetchFrame(next++);
      };
      Promise.all(Array.from({ length: CONCURRENCY }, worker)).then(() => {
        if (cancelled) return;
        frames.current = slots.filter(Boolean);
        setLoaded(frames.current.length > 1);
      });
    });

    return () => {
      cancelled = true;
      pending.forEach((img) => (img.src = ''));
      frames.current = [];
      current.current = -1;
      setReady(false);
      setLoaded(false);
    };
  }, [urls, still]);

  /* Playback: elapsed time only advances while playing, so pausing never causes a jump. */
  const elapsed = useRef(0);
  useEffect(() => {
    if (!loaded || !playing || still) return;
    const last = frames.current.length - 1;
    const period = (Math.PI * last) / fps; // seconds for one forward + back cycle
    let raf = 0;
    let prev = performance.now();
    const tick = (now) => {
      elapsed.current += Math.min(now - prev, 100) / 1000; // clamp: no catch-up after a stall
      prev = now;
      const phase = (elapsed.current % period) / period;
      const i = Math.round(((1 - Math.cos(phase * 2 * Math.PI)) / 2) * last);
      if (i !== current.current) draw(i);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [loaded, playing, still, fps]);

  return <canvas ref={canvas} className={className} data-ready={ready || undefined} aria-hidden="true" />;
}
