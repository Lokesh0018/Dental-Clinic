# Crown Dental Group — 3D hero

React + Vite site whose hero is a powder-blue studio with an oversized white wordmark and a
single, giant glossy molar rendered live with React Three Fiber, choreographed with GSAP + ScrollTrigger.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

## Branding & clinic details

Everything lives in `src/config/brand.js` (`BRAND`): wordmark (`CROWN`), subtitle
(`DENTAL GROUP`), full name, tagline, nav links and the booking link. Contact details
are rendered **only when filled in** — nothing is invented.

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
