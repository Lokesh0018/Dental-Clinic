import { useEffect, useRef, useState } from 'react';

/*
 * Plays a numbered image sequence on a canvas as a seamless, continuous loop.
 *
 * - Ping-pong playback (forward, then back) with a cosine-shaped speed profile: full speed
 *   (`fps`) mid-sequence, easing down at each end before reversing. Every step is a real
 *   one-frame step, so there is never a jump or a cross-fade (ghosting) at the seam.
 * - Starts early: once the first MIN_START frames have arrived it plays over the frames loaded
 *   so far, and the range widens as the rest stream in (no waiting for the whole sequence).
 * - Picks the smallest frame set that is still sharp at the displayed size × pixel ratio.
 * - Frames are transparent cut-outs (see tools/key-frames.py). The whole frame is fitted inside
 *   the box — uniform scale only, nothing cropped — bottom-aligned and centred.
 * - Draws only when the frame index changes; stops when `playing` is false.
 */

// Decoded width cap: keeps 61 RGBA frames well under ~250 MB even on 2× screens.
const MAX_FRAME_W = 1280;
const CONCURRENCY = 4;
const MIN_START = 16; // frames needed before playback starts (~0.7s of motion)
const END_SPEED = 0.12; // fraction of fps kept at the turnarounds, so the ends never stall

export function sequenceUrls({ start, count, pad, ext }, path) {
  return Array.from({ length: count }, (_, i) => `${path}${String(start + i).padStart(pad, '0')}${ext}`);
}

/** Contain the frame in the box: uniform scale, bottom-aligned, centred horizontally. */
function layout(w, h, [fw, fh]) {
  const s = Math.min(w / fw, h / fh);
  return { s, dx: (w - fw * s) / 2, dy: h - fh * s };
}

function loadImage(url, priority) {
  const img = new Image();
  img.decoding = 'async';
  if (priority) img.fetchPriority = priority;
  img.src = url;
  return { img, done: img.decode().then(() => img) };
}

/** Downscale once; soften the bottom edge, where the implant and scaffold are cut by the frame. */
function bake(img, width) {
  const height = Math.round((width * img.naturalHeight) / img.naturalWidth);
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

/**
 * @param sets  frame sets, smallest first: [{ width, urls }]
 * @param size  frame geometry [w, h] (same aspect for every set)
 */
export default function FrameSequence({ sets, size, fps = 24, playing = true, still = false, className }) {
  const canvas = useRef(null);
  const frames = useRef([]); // baked frames; frames[0 .. available-1] are contiguous
  const available = useRef(0);
  const current = useRef(-1);
  const motion = useRef({ p: 0, dir: 1 }); // position (frame units) and direction
  const [ready, setReady] = useState(false); // first frame painted
  const [startable, setStartable] = useState(false); // enough frames to play

  const draw = (i) => {
    const c = canvas.current;
    const f = frames.current[i];
    if (!c || !f || !c.width) return;
    const ctx = c.getContext('2d');
    const { s, dx, dy } = layout(c.width, c.height, size);
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(f, dx, dy, size[0] * s, size[1] * s);
    current.current = i;
  };

  /* Keep the backing store matched to the element size; redraw on resize. */
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const fit = () => {
      // layout size, not getBoundingClientRect: the entrance scale must not shrink the backing store
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.max(1, Math.round(c.clientWidth * dpr));
      c.height = Math.max(1, Math.round(c.clientHeight * dpr));
      draw(Math.max(current.current, 0));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  /* Load: first frame immediately (poster), the rest in order only when it will actually play. */
  useEffect(() => {
    const c = canvas.current;
    if (!c || !sets.length) return;
    let cancelled = false;
    const pending = [];
    const { s } = layout(c.clientWidth || 800, c.clientHeight || 600, size);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const needed = size[0] * s * dpr;
    const set = sets.find((x) => x.width >= needed * 0.95) ?? sets[sets.length - 1];
    const width = Math.round(Math.min(set.width, MAX_FRAME_W, Math.max(320, needed)));
    const { urls } = set;
    const slots = new Array(urls.length).fill(null);

    const settle = () => {
      let n = 0;
      while (n < slots.length && slots[n]) n++;
      frames.current = slots;
      available.current = n;
      if (n >= Math.min(MIN_START, urls.length)) setStartable(true);
    };

    const fetchFrame = (i, priority) => {
      const job = loadImage(urls[i], priority);
      pending.push(job.img);
      return job.done.then(
        (img) => {
          if (cancelled) return;
          slots[i] = bake(img, width);
          settle();
        },
        () => {}, // a missing frame is skipped below, never fatal
      );
    };

    fetchFrame(0, 'high').then(() => {
      if (cancelled || !slots[0]) return;
      draw(0);
      setReady(true);
      if (still) return;

      let next = 1;
      const worker = async () => {
        while (!cancelled && next < urls.length) await fetchFrame(next++);
      };
      Promise.all(Array.from({ length: CONCURRENCY }, worker)).then(() => {
        if (cancelled) return;
        // all done: drop any frame that failed to load so the loop has no gap
        frames.current = slots.filter(Boolean);
        available.current = frames.current.length;
        if (available.current > 1) setStartable(true);
      });
    });

    return () => {
      cancelled = true;
      pending.forEach((img) => (img.src = ''));
      frames.current = [];
      available.current = 0;
      current.current = -1;
      motion.current = { p: 0, dir: 1 };
      setReady(false);
      setStartable(false);
    };
  }, [sets, size, still]);

  /*
   * Playback: integrate position with a cosine-shaped speed profile over the frames available
   * right now. Growing the range while playing never moves the position, so there is no jump;
   * pausing simply stops integrating, so resuming continues exactly where it left off.
   */
  useEffect(() => {
    if (!startable || !playing || still) return;
    let raf = 0;
    let prev = performance.now();
    const tick = (now) => {
      const dt = Math.min(now - prev, 100) / 1000; // clamp: no catch-up after a stall
      prev = now;
      const last = available.current - 1;
      if (last > 0) {
        const m = motion.current;
        m.p = Math.min(m.p, last);
        const speed = fps * Math.max(END_SPEED, (2 * Math.sqrt(m.p * (last - m.p))) / last);
        m.p += m.dir * speed * dt;
        if (m.p >= last) {
          m.p = last;
          m.dir = -1;
        } else if (m.p <= 0) {
          m.p = 0;
          m.dir = 1;
        }
        const i = Math.round(m.p);
        if (i !== current.current) draw(i);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [startable, playing, still, fps]);

  return <canvas ref={canvas} className={className} data-ready={ready || undefined} aria-hidden="true" />;
}
