# Crown Dental Group — hero

React + Vite site whose hero is a rounded studio-cyan card — nav with a "Contacts" pill, a large
"Restore Your True Smile" headline with an avatar stack, booking CTAs, a wavy proof badge
beside a patient cut-out, a rotating lime "Book your consultation" badge — and a looping,
background-free frame-sequence scene of miniature dentists working on a giant tooth implant,
set on its own studio backdrop and choreographed with GSAP + ScrollTrigger.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

## Branding & clinic details

Everything lives in `src/config/brand.js` (`BRAND`): name, nav links, the nav CTA pill,
the booking link (used by the primary CTA and the rotating badge), hero headline/intro,
the frame sequence and social proof. Contact details are rendered **only when filled in**.

- `proof` (98% stat, `+2k` count, avatar photos) ships with **placeholder values and
  randomuser.me portraits** — replace them with real figures and consented patient photos,
  or set a field to `null` to hide it.
- `hero.patient` points to `public/images/patient.png`: a transparent cut-out of a happy
  patient (about 3:4, subject touching the bottom edge). It stays hidden until the file exists.

## The hero animation

The scene is a 61-frame sequence played on a canvas by `src/components/hero/FrameSequence.jsx`.

- **Source frames** (1920×1080, opaque studio backdrop): `assets-src/frames_Fix/` — kept out of
  `public/` so they are not deployed.
- **Played frames** (transparent cut-outs, 1274×1040): `public/frames_keyed/`, plus a 760px-wide
  copy for small screens in `public/frames_keyed_760/`. Regenerate with

  ```bash
  python tools/key-frames.py assets-src/frames_Fix public/frames_keyed            # numpy, pillow, scipy
  python tools/resize-frames.py public/frames_keyed public/frames_keyed_760 760   # small-screen set
  ```

  The keyer fits a clean background plate (the backdrop is a smooth gradient and the camera
  is static), keeps the tooth/dentists/metal as a solid core, mattes only a thin edge band,
  un-mixes the cyan backdrop out of edge pixels, steadies static edges over time, trims the
  source's 2-row bottom artifact and crops to the subject. It writes `meta.json` with the
  crop; keep `hero.sequence.size` in `brand.js` equal to the crop's width × height.
- **Hero background** is the frames' own studio backdrop (`.hero__card` in `hero.css`, values
  sampled from the fitted plate), so the cut-out scene sits on the colours it was lit for.
  Hero text is ink (5–13:1 on that backdrop); white text would fail contrast there.
- **Seamless loop:** the clip has no clean cut point, so it plays forward then backward with
  cosine-eased turnarounds (peak speed = `fps`). Every step is a real one-frame step — no
  jump and no cross-fade ghosting at the seam.
- **No distortion:** frames are only scaled uniformly and never cropped; each is decoded once
  at its displayed size (capped at 1280px wide).
- **Fast start:** the player picks the smallest set that is still sharp at the displayed size ×
  pixel ratio (`hero.sequence.sets` in `brand.js`), and starts looping once the first 16 frames
  have arrived, widening the loop as the rest stream in. On a phone over 4G: moving after
  ~1.8 s and 4.3 MB (was ~11.7 s and 9.6 MB).

## Behaviour notes

- Copy and CTAs render immediately; the first frame paints as soon as it loads, the other
  frames load in the background before playback starts.
- Playback (and the badge spin) pauses when the hero is off-screen.
- A compact floating nav (`src/components/StickyNav.jsx`) slides in once the hero nav has
  scrolled away, keeping section links and "Book now" reachable; it is inert while hidden.
- `prefers-reduced-motion` or Data Saver: only the first frame (~70–140 KB) is downloaded, shown still;
  no entrance, count-up or sheen motion.

## Screenshots

With the dev server running:

```bash
node tools/shoot.mjs http://localhost:5173 shots
```

Captures the hero at six viewports using the locally installed Chrome via `playwright-core`
(see the header of `tools/shoot.mjs` for options).
