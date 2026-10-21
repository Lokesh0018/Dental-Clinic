# Crown Dental Group — 3D hero

React + Vite site whose hero is a rounded blue card — nav with a "Contacts" pill, a large
"Restore Your True Smile" headline with an avatar stack, a wavy proof badge beside a patient
cut-out, a rotating lime "Book your consultation" badge — and a single, giant glossy molar
rendered live with React Three Fiber, choreographed with GSAP + ScrollTrigger.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

## Branding & clinic details

Everything lives in `src/config/brand.js` (`BRAND`): name, nav links, the nav CTA pill,
the booking link (used by the rotating badge), hero headline/intro and social proof.
Contact details are rendered **only when filled in**.

- `proof` (98% stat, `+2k` count, avatar photos) ships with **placeholder values and
  randomuser.me portraits** — replace them with real figures and consented patient photos,
  or set a field to `null` to hide it.
- `hero.patient` points to `public/images/patient.png`: a transparent cut-out of a happy
  patient (about 3:4, subject touching the bottom edge). It stays hidden until the file exists.

## The 3D asset

`public/models/molar.glb` is an original, procedurally generated maxillary first molar
(no third-party model or license). Regenerate it with:

```bash
npm run generate:molar
```

`scripts/generate-molar.mjs` describes the tooth as a signed distance field (crown with
height-of-contour and cervical constriction, four-cusp occlusal heightfield with oblique
ridge and fissures, cervical enamel line, three tapered, curved roots), meshes it with
surface nets, projects every vertex onto the true surface, uses analytic SDF normals
(no facets) and bakes ambient occlusion and enamel/root tint into vertex colors. The
mesh is then welded, simplified, quantized and meshopt-compressed (~95k triangles, ~570 KB).

`public/images/molar-still.webp` is a render of the same scene, used when WebGL is
unavailable or while the model is still downloading. To re-export it after changing the
model or lighting, run the dev server and then:

```bash
node tools/shoot.mjs http://localhost:5173 public/images still
```

`tools/shoot.mjs` (without `still`) screenshots the hero at several viewports;
it uses the locally installed Chrome via `playwright-core`.

## Behaviour notes

- Copy and CTAs render immediately; the three.js bundle is lazy-loaded.
- Rendering pauses when the hero is off-screen.
- `prefers-reduced-motion`: no entrance, float, pointer or scroll motion — a still model.
- `?nowebgl` forces the static fallback for testing.
