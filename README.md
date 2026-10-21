# Crown Dental Group — hero

React + Vite site whose hero is a rounded blue card — nav with a "Contacts" pill, a large
"Restore Your True Smile" headline with an avatar stack, booking CTAs, a wavy proof badge
beside a patient cut-out, a rotating lime "Book your consultation" badge — and a looping
frame-sequence scene of miniature dentists working on a giant tooth implant, choreographed
with GSAP + ScrollTrigger.

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

`public/frames_Fix/frame_000011.webp … frame_000071.webp` (61 frames, 1920×1080) are played
on a canvas by `src/components/hero/FrameSequence.jsx`. To swap the sequence, change
`hero.sequence` in `brand.js` (`path`, `start`, `count`, `pad`, `ext`, `fps`).

- **Seamless loop:** the clip has no clean cut point, so it plays forward then backward with
  cosine-eased turnarounds (peak speed = `fps`). Every step is a real one-frame step — no
  jump and no cross-fade ghosting at the seam.
- **No distortion:** frames are only scaled uniformly and never cropped into the action
  (x ≈ 340–1640 in the source). The studio backdrop fades into the card at the left and top,
  over backdrop only.
- **Memory:** each frame is decoded once at its displayed size (capped at 1280px wide).
- If you replace the frames with a different scene, update `WIN_X0/WIN_X1` and
  `ACTION_X0/ACTION_Y0` in `FrameSequence.jsx` to match where its action sits.

## Behaviour notes

- Copy and CTAs render immediately; the first frame paints as soon as it loads, the other
  frames load in the background before playback starts.
- Playback (and the badge spin) pauses when the hero is off-screen.
- `prefers-reduced-motion` or Data Saver: only the first frame is downloaded, shown still;
  no entrance, count-up or sheen motion.

## Screenshots

With the dev server running:

```bash
node tools/shoot.mjs http://localhost:5173 shots
```

Captures the hero at six viewports using the locally installed Chrome via `playwright-core`
(see the header of `tools/shoot.mjs` for options).
