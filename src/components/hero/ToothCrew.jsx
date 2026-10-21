import { useEffect, useId, useRef } from 'react';

/*
 * Miniature dental technicians working on the hero tooth — pure SVG, no assets.
 * Drawn in the tooth PNG's own 500×500 pixel space (plus 70px of headroom above it, see
 * .tooth-rig), so feet and tools sit exactly on the enamel (cusp tops ≈ y 42–55, grooves
 * at x ≈ 190 / 310, left wall at x ≈ 90).
 *
 * Each figure: legs (world space, hip at 0,-32) → upper body group pivoting at the hip
 * (torso + head drawn in a lean-rotated local frame) → arms in world space, the working
 * arm grouped with its instrument so they move as one. All motion is SMIL with joint
 * pivots and per-worker phases; the whole set pauses via svg.pauseAnimations().
 */

const C = {
  uni: '#2f63cb', uniShade: '#1d47a0', uniHi: '#6391e8',
  navy: '#172b57',
  skin: '#f1c4a0', skinShade: '#d39c74',
  glove: '#f8fafc', gloveShade: '#c9d3df',
  boot: '#1b2843', sole: '#0d1527',
  eye: '#1c2436',
  rubber: '#2a3450',
  metalDark: '#7d8c9e',
  frame: '#dfe6ee', frameEdge: '#8a99ab',
  water: '#eaf7ff',
};

const HIP = [0, -32];
const loop = { repeatCount: 'indefinite' };
const ease = { calcMode: 'spline', keyTimes: '0;0.5;1', keySplines: '0.42 0 0.58 1;0.42 0 0.58 1' };

const line = (a, b) => `M${a[0]} ${a[1]}L${b[0]} ${b[1]}`;
const deg = (r) => (r * 180) / Math.PI;

/** A shaded limb segment: dark edge, base colour, soft highlight along the lit side. */
function Seg({ a, b, w, base, shade, hi }) {
  const s = { fill: 'none', strokeLinecap: 'round' };
  return (
    <>
      <path d={line(a, b)} stroke={shade} strokeWidth={w} {...s} />
      <path d={line([a[0] - 0.35, a[1] - 0.35], [b[0] - 0.35, b[1] - 0.35])} stroke={base} strokeWidth={w - 1.4} {...s} />
      <path d={line([a[0] - 1, a[1] - 1.1], [b[0] - 1, b[1] - 1.1])} stroke={hi} strokeWidth={w * 0.3} opacity={0.55} {...s} />
    </>
  );
}

function Boot({ at: [x, y] }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-3.2 -5H2.8Q6 -4.5 6.6 -1.2Q6.8 0.6 4.5 0.8H-3.4Q-4.4 0.8 -4.4 -0.4Z" fill={C.boot} />
      <path d="M-4.3 0.2H5.2Q6.4 0.2 6.2 1.3H-4.2Z" fill={C.sole} />
      <path d="M-2.4 -4.6V-1.4" stroke={C.uniHi} strokeWidth={0.7} opacity={0.35} />
    </g>
  );
}

function Leg({ knee, foot, far }) {
  const base = far ? C.uniShade : C.uni;
  const shade = far ? C.navy : C.uniShade;
  return (
    <>
      <Seg a={HIP} b={knee} w={7} base={base} shade={shade} hi={C.uniHi} />
      <Seg a={knee} b={[foot[0], foot[1] - 4]} w={6.2} base={base} shade={shade} hi={C.uniHi} />
      <circle cx={knee[0]} cy={knee[1]} r={2.1} fill={shade} opacity={0.55} />
      <Boot at={foot} />
    </>
  );
}

function Head({ ids }) {
  return (
    <>
      <circle r={6.4} fill={`url(#${ids}-skin)`} />
      <circle cx={-4.9} cy={0.6} r={1.5} fill={C.skinShade} />
      <circle cx={-4.9} cy={0.6} r={0.8} fill={C.skin} />
      {/* eye, brow, nose, mouth — minimal, readable at distance */}
      <circle cx={3.3} cy={-0.6} r={0.85} fill={C.eye} />
      <path d="M2 -2.4Q3.4 -3.2 4.6 -2.4" stroke={C.eye} strokeWidth={0.55} fill="none" strokeLinecap="round" opacity={0.75} />
      <path d="M5.9 -0.2Q7.2 1.4 5.8 2" stroke={C.skinShade} strokeWidth={0.7} fill="none" strokeLinecap="round" />
      <path d="M3.4 3.4Q4.6 4 5.6 3.3" stroke={C.skinShade} strokeWidth={0.6} fill="none" strokeLinecap="round" />
      {/* hard hat: dome, centre ridge, brim, gloss */}
      <path d="M-7.3 -1.4Q-7.3 -8.6 0 -8.8Q7.3 -8.6 7.3 -1.4Z" fill={`url(#${ids}-hat)`} />
      <path d="M-1.4 -8.7Q0 -9.6 1.4 -8.7L1.2 -4.6H-1.2Z" fill={C.uniShade} opacity={0.75} />
      <path d="M-7.8 -1.6H4.5Q9.4 -1.6 9.6 0.1Q6 0.7 -7.6 -0.2Q-8.3 -0.9 -7.8 -1.6Z" fill={C.uniShade} />
      <path d="M-5.4 -6.2Q-3.4 -7.9 -0.8 -7.6" stroke="#fff" strokeWidth={1} strokeLinecap="round" fill="none" opacity={0.45} />
    </>
  );
}

/** Torso + head, drawn upright in a frame rotated by the lean and pivoting at the hip. */
function Torso({ lean = 0, tilt, ids }) {
  const L = 21;
  return (
    <g transform={`translate(0 -32) rotate(${lean})`}>
      <path
        d={`M-6.5 0Q-7.2 -3 -6.6 -8L-8.2 -${L - 1.5}Q-8.4 -${L + 2.2} -5 -${L + 2.4}H5Q8.4 -${L + 2.2} 8.2 -${L - 1.5}L6.6 -8Q7.2 -3 6.5 0Q0 1.2 -6.5 0Z`}
        fill={`url(#${ids}-uni)`}
      />
      {/* placket, panel seams, chest pocket */}
      <path d={`M0.6 -3V-${L + 1}`} stroke={C.uniShade} strokeWidth={0.7} opacity={0.8} />
      <path d={`M-5.4 -${L - 4}L-3.6 -8M5.4 -${L - 4}L3.6 -8`} stroke={C.uniShade} strokeWidth={0.5} opacity={0.6} />
      <rect x={2.2} y={-14} width={3.3} height={3.4} rx={0.6} fill={C.uniShade} opacity={0.8} />
      <path d="M2.2 -13.1H5.5" stroke={C.uniHi} strokeWidth={0.5} opacity={0.5} />
      <path d={`M-3.4 -${L + 2}L0 -${L - 1}L3.4 -${L + 2}`} fill="none" stroke={C.uniHi} strokeWidth={1.1} strokeLinejoin="round" opacity={0.75} />
      {/* utility belt with buckle and pouch */}
      <path d="M-6.9 -4.6Q0 -3.4 6.9 -4.6" stroke={C.navy} strokeWidth={2.6} fill="none" />
      <rect x={-1.3} y={-5.8} width={2.6} height={2.2} rx={0.4} fill={C.metalDark} />
      <rect x={3.2} y={-5.6} width={2.4} height={2.6} rx={0.5} fill={C.navy} />
      {/* shoulders */}
      <ellipse cx={-5.4} cy={-L + 0.6} rx={3.4} ry={2.2} fill={C.uniShade} opacity={0.9} />
      <ellipse cx={5.4} cy={-L + 0.6} rx={3.4} ry={2.2} fill={C.uni} />
      <ellipse cx={4.6} cy={-L - 0.3} rx={2.2} ry={1} fill={C.uniHi} opacity={0.5} />
      {/* neck + head, own tilt pivot at the neck */}
      <path d={`M0.8 -${L + 1}L1.6 -${L + 5}`} stroke={C.skinShade} strokeWidth={4.2} strokeLinecap="round" />
      <g transform={`translate(1.8 -${L + 7.5})`}>
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-1.5 0 4;1.5 0 4;-1.5 0 4" dur={tilt.dur} begin={tilt.begin} {...ease} {...loop} />
          <Head ids={ids} />
        </g>
      </g>
    </g>
  );
}

function Arm({ pts: [s, e, h], far, grip = 0 }) {
  const base = far ? C.uniShade : C.uni;
  const shade = far ? C.navy : C.uniShade;
  return (
    <>
      <Seg a={s} b={e} w={5.6} base={base} shade={shade} hi={C.uniHi} />
      <circle cx={e[0]} cy={e[1]} r={1.9} fill={shade} opacity={0.5} />
      <Seg a={e} b={h} w={4.6} base={base} shade={shade} hi={C.uniHi} />
      {/* cuff */}
      <circle cx={h[0] - (h[0] - e[0]) * 0.14} cy={h[1] - (h[1] - e[1]) * 0.14} r={2.5} fill={C.uniHi} opacity={0.6} />
      {/* glove: palm + thumb, rotated to the grip */}
      <g transform={`translate(${h[0]} ${h[1]}) rotate(${grip})`}>
        <ellipse rx={2.9} ry={2.4} fill={C.gloveShade} />
        <ellipse cx={-0.3} cy={-0.3} rx={2.5} ry={2} fill={C.glove} />
        <circle cx={1.6} cy={-1.9} r={1.1} fill={C.glove} stroke={C.gloveShade} strokeWidth={0.4} />
      </g>
    </>
  );
}

/* ----------------------------------------------------------------- instruments */

/** Draws an instrument along +y in a local frame from `from` towards `to`. */
function Along({ from, to, children }) {
  const a = deg(Math.atan2(to[1] - from[1], to[0] - from[0])) - 90;
  return <g transform={`translate(${from[0]} ${from[1]}) rotate(${a})`}>{children}</g>;
}
const len = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

function Shaft({ y, h, w, ids, rx = 1.6 }) {
  return <rect x={-w / 2} y={y} width={w} height={h} rx={rx} fill={`url(#${ids}-metal)`} />;
}
function Grip({ y, h, w }) {
  const ribs = Array.from({ length: Math.floor(h / 2.2) }, (_, i) => `M${-w / 2 + 0.6} ${y + 1.4 + i * 2.2}H${w / 2 - 0.6}`).join('');
  return (
    <>
      <rect x={-w / 2} y={y} width={w} height={h} rx={1.2} fill={C.rubber} />
      <path d={ribs} stroke="#3d4866" strokeWidth={0.5} />
    </>
  );
}
function Ring({ y, w, h = 1.3 }) {
  return <rect x={-w / 2} y={y} width={w} height={h} fill={C.metalDark} />;
}

/** Prophy handpiece: rubber grip → motor body → tapered neck → spinning polishing cup. */
function Polisher({ from, to, ids }) {
  const L = len(from, to);
  return (
    <Along from={from} to={to}>
      <Grip y={-4} h={13} w={7.2} />
      <Ring y={9} w={7.6} />
      <Shaft y={10} h={L - 24} w={6.6} ids={ids} />
      <Ring y={L - 15} w={7} />
      <path d={`M-2.2 ${L - 14}L-1.3 ${L - 4}H1.3L2.2 ${L - 14}Z`} fill={C.metalDark} />
      <g transform={`translate(0 ${L - 2})`}>
        <ellipse rx={8} ry={2.4} fill="#f2f5f8" stroke={C.metalDark} strokeWidth={0.8} />
        <ellipse rx={5.2} ry={1.3} fill="none" stroke={C.metalDark} strokeWidth={0.7} strokeDasharray="2.4 2.4">
          <animate attributeName="stroke-dashoffset" values="0;-4.8" dur="0.18s" {...loop} />
        </ellipse>
      </g>
      <path d={`M-2.2 12V${L - 16}`} stroke="#fff" strokeWidth={0.8} opacity={0.5} />
    </Along>
  );
}

/** Ultrasonic scaler: steel cap, ribbed grip, collar, tapered tip. */
function Scaler({ from, to, ids }) {
  const L = len(from, to);
  return (
    <Along from={from} to={to}>
      <Shaft y={-3} h={6} w={6} ids={ids} rx={2.5} />
      <Grip y={3} h={L - 20} w={6.4} />
      <Ring y={L - 17} w={6.8} />
      <Shaft y={L - 16} h={7} w={4.4} ids={ids} rx={1} />
      <path d={`M-1.4 ${L - 9}L-0.6 ${L}L0.6 ${L}L1.4 ${L - 9}Z`} fill={C.metalDark} />
    </Along>
  );
}

/** Air/water syringe: grip, metal barrel, nozzle. */
function Syringe({ from, to, ids }) {
  const L = len(from, to);
  return (
    <Along from={from} to={to}>
      <Grip y={-2} h={9} w={6.4} />
      <Ring y={7} w={6.8} />
      <Shaft y={8} h={L - 12} w={5.4} ids={ids} />
      <Ring y={L - 5} w={6} />
      <path d={`M-1.2 ${L - 4}H1.2V${L + 1}Q0 ${L + 2.2} -1.2 ${L + 1}Z`} fill={C.metalDark} />
    </Along>
  );
}

/** Finishing buffer: short grip, steel stem, foam pad. */
function Buffer({ from, to, ids }) {
  const L = len(from, to);
  return (
    <Along from={from} to={to}>
      <Grip y={-3} h={L - 6} w={5.2} />
      <Ring y={L - 9} w={5.6} />
      <Shaft y={L - 8} h={5} w={3.2} ids={ids} rx={1} />
      <g transform={`translate(0 ${L})`}>
        <ellipse rx={8.5} ry={3} fill="#f3f6f9" stroke={C.metalDark} strokeWidth={0.7} />
        <ellipse cx={-1.5} cy={-0.8} rx={4.5} ry={1} fill="#fff" opacity={0.8} />
      </g>
    </Along>
  );
}

/* ------------------------------------------------------------------ effects */

function Spark({ at: [x, y], begin = '0s', size = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path d="M0-2.8L.6-.6 2.8 0 .6.6 0 2.8-.6.6-2.8 0-.6-.6Z" fill="#fff">
        <animateTransform attributeName="transform" type="scale" values="0;1;0" dur="0.8s" begin={begin} {...loop} />
      </path>
    </g>
  );
}

function FootShadow({ x, y, rx = 13 }) {
  return <ellipse cx={x} cy={y + 1} rx={rx} ry={2.1} fill="#0b2c5c" opacity={0.2} />;
}

/** Upper body pivoting at the hip: a slow weight shift with its own phase. */
function Upper({ dur, begin, children }) {
  return (
    <g>
      <animateTransform attributeName="transform" type="rotate" values="-1.3 0 -32;1.3 0 -32;-1.3 0 -32" dur={dur} begin={begin} {...ease} {...loop} />
      {children}
    </g>
  );
}

/* ------------------------------------------------- 1 · polishing the left cusp */
function Worker1({ ids }) {
  return (
    <g transform="translate(145 55)">
      <g data-crew>
        <Leg knee={[-6, -17]} foot={[-12, -2]} far />
        <Leg knee={[8, -18]} foot={[6, -2]} />
        <Upper dur="2.3s" begin="0s">
          <Arm pts={[[8, -50], [17, -43], [26, -35]]} far grip={40} />
          <Torso lean={22} tilt={{ dur: '2.9s', begin: '0.3s' }} ids={ids} />
          {/* controlled polishing stroke: both hands and the handpiece move together */}
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;2.4 0.9;0 0" dur="0.9s" {...ease} {...loop} />
            <Polisher from={[27, -34]} to={[43, 2]} ids={ids} />
            <Arm pts={[[9, -51], [20, -44], [29, -31]]} grip={40} />
          </g>
        </Upper>
      </g>
    </g>
  );
}

/* --------------------------------------- 2 · precision scaling, centre cusp */
function Worker2({ ids }) {
  return (
    <g transform="translate(232 43)">
      <g data-crew>
        <Leg knee={[-7, -16]} foot={[-9, -2]} far />
        <Leg knee={[7, -17]} foot={[4, -2]} />
        <Upper dur="2.7s" begin="0.6s">
          <Arm pts={[[8, -49], [17, -42], [23, -40]]} far grip={90} />
          <Torso lean={26} tilt={{ dur: '3.3s', begin: '1s' }} ids={ids} />
          {/* fine wrist pressure: slow press from the shoulder, micro-vibration on the tool only */}
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-1.6 9 -49;1.6 9 -49;-1.6 9 -49" dur="1.3s" {...ease} {...loop} />
            <g>
              <animateTransform attributeName="transform" type="translate" values="0 0;0 -0.5;0 0.2;0 0" dur="0.16s" {...loop} />
              <Scaler from={[25, -36]} to={[26, 2]} ids={ids} />
            </g>
            <Arm pts={[[9, -50], [20, -38], [26, -31]]} grip={90} />
          </g>
        </Upper>
        <Spark at={[24, 2]} />
        <Spark at={[29, -1]} begin="0.4s" size={0.7} />
      </g>
    </g>
  );
}

/* --------------------------------------------- 3 · rinsing the right groove */
const DROPS = [
  ['M0 0Q4 16 9 40', '0s'],
  ['M0 0Q8 18 14 39', '0.12s'],
  ['M0 0Q1 18 5 41', '0.24s'],
  ['M0 0Q6 14 11 40', '0.36s'],
  ['M0 0Q10 16 17 37', '0.48s'],
  ['M0 0Q3 20 7 41', '0.6s'],
];

function Worker3({ ids }) {
  return (
    <>
      {/* supply hose runs behind the technician and off over the right side of the tooth */}
      <path d="M336 8C356-12 402 0 417 40S440 160 470 230 505 360 520 520 530 700 530 900" fill="none" stroke={C.navy} strokeWidth={3} strokeLinecap="round" />
      <path d="M336 8C356-12 402 0 417 40S440 160 470 230" fill="none" stroke={C.uniHi} strokeWidth={0.8} strokeLinecap="round" opacity={0.35} />
      <g transform="translate(352 47) scale(-1 1)">
        <g data-crew>
          <Leg knee={[-8, -18]} foot={[-11, -2]} far />
          <Leg knee={[7, -18]} foot={[9, -2]} />
          <Upper dur="2.1s" begin="1.2s">
            <Arm pts={[[5, -50], [13, -44], [20, -40]]} far grip={30} />
            <Torso lean={12} tilt={{ dur: '3.1s', begin: '0.5s' }} ids={ids} />
            <g>
              <animateTransform attributeName="transform" type="rotate" values="-2.2 6 -50;2.2 6 -50;-2.2 6 -50" dur="1.7s" {...ease} {...loop} />
              <Syringe from={[15, -41]} to={[33, -28]} ids={ids} />
              <Arm pts={[[6, -50], [15, -41], [23, -35]]} grip={30} />
              {/* fine spray + mist where it lands */}
              <g transform="translate(34 -27)">
                {DROPS.map(([d, begin]) => (
                  <circle key={begin} r={1.1} fill={C.water} opacity={0}>
                    <animateMotion path={d} dur="0.6s" begin={begin} {...loop} />
                    <animate attributeName="opacity" values="0;0.95;0.95;0" dur="0.6s" begin={begin} {...loop} />
                  </circle>
                ))}
                {[0, 0.3].map((b) => (
                  <circle key={b} cx={10} cy={40} fill={C.water} opacity={0}>
                    <animate attributeName="r" values="1;6" dur="0.6s" begin={`${b}s`} {...loop} />
                    <animate attributeName="opacity" values="0.6;0" dur="0.6s" begin={`${b}s`} {...loop} />
                  </circle>
                ))}
              </g>
            </g>
          </Upper>
        </g>
      </g>
    </>
  );
}

/* ------------------------------------------ 4 · finishing from the scaffold */
function Scaffold() {
  const rungs = [];
  for (let y = 246; y < 800; y += 16) rungs.push(y);
  const tube = { stroke: C.frame, strokeWidth: 3.2, strokeLinecap: 'round' };
  const edge = { stroke: C.frameEdge, strokeWidth: 1.2, strokeLinecap: 'round' };
  return (
    <g data-crew>
      {/* ladder — runs past the image box so it reaches the floor (the hero card clips it) */}
      <path d="M6 232V800M18 232V800" {...edge} strokeWidth={2.4} />
      <path d={rungs.map((y) => `M6 ${y}H18`).join('')} {...edge} strokeWidth={1.8} />
      <path d="M24 196V800M100 196V800M24 330H100M24 430H100M24 530H100M24 630H100M24 236 100 330M100 330 24 430M24 430 100 530M100 530 24 630M24 630 100 730" {...tube} />
      <path d="M24 196V800M100 196V800" {...edge} strokeWidth={0.8} opacity={0.6} />
      {[330, 430, 530, 630].flatMap((y) => [24, 100].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.4} fill={C.frameEdge} />))}
      {/* deck with tread */}
      <rect x={20} y={230} width={88} height={5} rx={1.5} fill={C.frame} stroke={C.frameEdge} strokeWidth={1} />
      <path d={Array.from({ length: 14 }, (_, i) => `M${24 + i * 6} 231V234`).join('')} stroke={C.frameEdge} strokeWidth={0.6} opacity={0.6} />
    </g>
  );
}

function Worker4({ ids }) {
  return (
    <g transform="translate(58 230)">
      <g data-crew>
        <Leg knee={[-4, -17]} foot={[-6, -2]} far />
        <Leg knee={[3, -17]} foot={[4, -2]} />
        <Upper dur="2.5s" begin="0.9s">
          <Arm pts={[[2, -50], [0, -42], [8, -36]]} far />
          <Torso lean={4} tilt={{ dur: '2.6s', begin: '1.4s' }} ids={ids} />
          {/* careful up-and-down finishing pass from the shoulder */}
          <g>
            <animateTransform attributeName="transform" type="rotate" values="-9 2 -51;8 2 -51;-9 2 -51" dur="1.5s" {...ease} {...loop} />
            <Buffer from={[22, -62]} to={[30, -62]} ids={ids} />
            <Arm pts={[[2, -51], [13, -57], [22, -62]]} grip={-10} />
          </g>
        </Upper>
        {[
          [35, -70, '0s'],
          [34, -56, '0.5s'],
          [37, -63, '1s'],
        ].map(([x, y, begin]) => (
          <circle key={begin} cx={x} cy={y} fill="#fff" opacity={0}>
            <animate attributeName="r" values="0.5;2.2" dur="1.5s" begin={begin} {...loop} />
            <animate attributeName="opacity" values="0.85;0" dur="1.5s" begin={begin} {...loop} />
          </circle>
        ))}
      </g>
      {/* front rail, in front of the technician's legs */}
      <path d="M-34 -34H42M-34 -17H42" stroke={C.frame} strokeWidth={2.6} strokeLinecap="round" data-crew />
    </g>
  );
}

export default function ToothCrew({ paused = false }) {
  const svg = useRef(null);
  const ids = useId().replace(/:/g, '');

  useEffect(() => {
    const el = svg.current;
    if (!el?.pauseAnimations) return;
    if (paused) el.pauseAnimations();
    else el.unpauseAnimations();
  }, [paused]);

  return (
    <svg ref={svg} className="tooth-crew" viewBox="0 -70 500 570" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${ids}-uni`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={C.uniShade} />
          <stop offset="0.45" stopColor={C.uni} />
          <stop offset="0.8" stopColor={C.uniHi} />
          <stop offset="1" stopColor={C.uni} />
        </linearGradient>
        <linearGradient id={`${ids}-hat`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7fa6f0" />
          <stop offset="0.45" stopColor={C.uni} />
          <stop offset="1" stopColor={C.uniShade} />
        </linearGradient>
        <radialGradient id={`${ids}-skin`} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#f8d4b4" />
          <stop offset="0.7" stopColor={C.skin} />
          <stop offset="1" stopColor={C.skinShade} />
        </radialGradient>
        <linearGradient id={`${ids}-metal`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8b9aab" />
          <stop offset="0.35" stopColor="#f5f8fb" />
          <stop offset="0.6" stopColor="#d4dde6" />
          <stop offset="1" stopColor="#7b8a9c" />
        </linearGradient>
      </defs>
      <Scaffold />
      <FootShadow x={140} y={55} />
      <FootShadow x={230} y={43} />
      <FootShadow x={352} y={47} />
      <Worker3 ids={ids} />
      <Worker1 ids={ids} />
      <Worker2 ids={ids} />
      <Worker4 ids={ids} />
    </svg>
  );
}
