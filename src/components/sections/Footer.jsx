import { useRef } from 'react';
import { BRAND, bookingLinkProps } from '../../config/brand.js';
import { useInView } from '../../hooks/useInView.js';
import ToothLogo, { TOOTH_PATH } from '../hero/ToothLogo.jsx';
import { SERVICE_TITLES } from '../../data/services.jsx';
import { getMapTarget } from '../../config/map.js';
import ArrowIcon from '../hero/ArrowIcon.jsx';
import '../../styles/footer.css';


/* Brand marks from Simple Icons (CC0). Only networks with a URL in BRAND.social render. */
const SOCIAL = {
  instagram: {
    label: 'Instagram',
    path: 'M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zM12 0C8.7 0 8.3 0 7.1.1 5.8.1 4.9.3 4.1.6c-.8.3-1.5.7-2.1 1.4C1.3 2.6.9 3.3.6 4.1.3 4.9.1 5.8.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.1 1.3.3 2.2.6 3 .3.8.7 1.5 1.4 2.1.6.7 1.3 1.1 2.1 1.4.8.3 1.7.5 3 .6C8.3 24 8.7 24 12 24s3.7 0 4.9-.1c1.3-.1 2.2-.3 3-.6.8-.3 1.5-.7 2.1-1.4.7-.6 1.1-1.3 1.4-2.1.3-.8.5-1.7.6-3 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.3-.3-2.2-.6-3-.3-.8-.7-1.5-1.4-2.1C21.4 1.3 20.7.9 19.9.6c-.8-.3-1.7-.5-3-.6C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-10.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z',
  },
  facebook: {
    label: 'Facebook',
    path: 'M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4H7.1v-3.5h3v-2.7c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.3l-.5 3.5h-2.8V24C19.6 23.1 24 18.1 24 12.1z',
  },
  youtube: {
    label: 'YouTube',
    path: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z',
  },
  whatsapp: {
    label: 'WhatsApp',
    path: 'M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 0 1 2.2 12 9.8 9.8 0 0 1 12 2.2 9.8 9.8 0 0 1 21.8 12 9.8 9.8 0 0 1 12 21.8zM12 0C5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6A12 12 0 0 0 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0z',
  },
};

/* Big molars that hover in place: position (viewBox units, 160x100), scale, drift duration, delay, tilt. */
const FIELD = [
  { x: 8, y: 16, s: 1.3, d: 22, dl: 0, r: -12 },
  { x: 34, y: 66, s: 0.9, d: 26, dl: -7, r: 8 },
  { x: 58, y: 24, s: 0.7, d: 18, dl: -3, r: 20 },
  { x: 84, y: 74, s: 1.1, d: 30, dl: -12, r: -6 },
  { x: 106, y: 12, s: 0.8, d: 24, dl: -16, r: 14 },
  { x: 130, y: 54, s: 1.5, d: 34, dl: -5, r: -18 },
  { x: 150, y: 20, s: 0.7, d: 20, dl: -9, r: 6 },
  { x: 46, y: 6, s: 0.5, d: 16, dl: -2, r: -24 },
  { x: 118, y: 88, s: 0.6, d: 19, dl: -11, r: 10 },
];
/* Small molars that rise from the bottom like bubbles and fade out near the top. */
const RISERS = [
  { x: 18, s: 0.32, d: 26, dl: 0 },
  { x: 42, s: 0.22, d: 32, dl: -9 },
  { x: 70, s: 0.28, d: 24, dl: -17 },
  { x: 96, s: 0.2, d: 36, dl: -5 },
  { x: 122, s: 0.3, d: 28, dl: -22 },
  { x: 144, s: 0.24, d: 30, dl: -13 },
  { x: 60, s: 0.18, d: 40, dl: -27 },
];

function Backdrop() {
  return (
    <svg className="footer__bg" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="footer-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#a9cde2" stopOpacity="0.35" />
          <stop offset="1" stopColor="#a9cde2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="footer-sweep" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* soft sky glow that breathes */}
      <circle className="footer__glow" cx="128" cy="36" r="52" fill="url(#footer-glow)" />
      <circle className="footer__glow footer__glow--2" cx="24" cy="84" r="44" fill="url(#footer-glow)" />

      {/* drifting molars */}
      {FIELD.map((t, i) => (
        <g key={i} className="footer__tooth" transform={`translate(${t.x} ${t.y})`} style={{ '--s': t.s, '--d': `${t.d}s`, '--dl': `${t.dl}s`, '--r': `${t.r}deg` }}>
          <path d={TOOTH_PATH} />
        </g>
      ))}

      {/* rising molars */}
      {RISERS.map((t, i) => (
        <g key={`r${i}`} className="footer__riser" transform={`translate(${t.x} 100)`} style={{ '--s': t.s, '--d': `${t.d}s`, '--dl': `${t.dl}s` }}>
          <path d={TOOTH_PATH} />
        </g>
      ))}

      {/* polish sweep: a diagonal band of light gliding across */}
      <rect className="footer__sweep" x="-40" y="-20" width="36" height="140" fill="url(#footer-sweep)" />

      {/* sparkles that twinkle in turn */}
      {[
        [22, 34, 0],
        [92, 20, 1.3],
        [140, 70, 2.4],
        [64, 86, 3.1],
        [116, 46, 1.9],
      ].map(([x, y, dl], i) => (
        <path key={i} className="footer__spark" style={{ '--dl': `${dl}s` }} transform={`translate(${x} ${y})`} d="M0-2.2 0.55-0.55 2.2 0 0.55 0.55 0 2.2-0.55 0.55-2.2 0-0.55-0.55z" />
      ))}
    </svg>
  );
}

export default function Footer() {
  const root = useRef(null);
  const inView = useInView(root, { initial: false }); // backdrop loops only run while the footer is on screen
  const { contact } = BRAND;
  const year = new Date().getFullYear();
  const social = Object.entries(BRAND.social ?? {}).filter(([k, url]) => url && SOCIAL[k]);
  const directionsHref = getMapTarget().directions;
  const details = [
    contact.phone && { label: 'Phone', value: contact.phone, href: `tel:${contact.phone.replace(/[^+\d]/g, '')}` },
    contact.email && { label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    contact.address && { label: 'Address', value: contact.address },
    contact.hours && { label: 'Hours', value: contact.hours },
  ].filter(Boolean);

  return (
    <footer ref={root} className="footer" aria-labelledby="footer-title" data-paused={!inView || undefined}>
      <Backdrop />
      <div className="section__inner footer__inner">
        <div className="footer__grid">
          {/* brand block + CTA */}
          <div className="footer__brand">
            <a className="footer__logo" href="#top" aria-label={`${BRAND.name} — back to top`}>
              <span className="footer__chip" aria-hidden="true">
                <ToothLogo className="footer__mark" />
              </span>
              <span>{BRAND.shortName}</span>
            </a>
            <h2 id="footer-title" className="footer__title">
              Your smile, in good hands.
            </h2>
            <p className="footer__lede">Modern, gentle dentistry with every option explained before anything begins.</p>
            <a className="btn btn--primary footer__cta" href={BRAND.booking.href} {...bookingLinkProps}>
              {BRAND.booking.label}
              <ArrowIcon />
            </a>
          </div>

          {/* link columns */}
          <nav className="footer__col" aria-labelledby="footer-nav">
            <h3 id="footer-nav">Explore</h3>
            <ul>
              {BRAND.nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>
                    <ArrowIcon />
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav className="footer__col" aria-labelledby="footer-services">
            <h3 id="footer-services">Treatments</h3>
            <ul>
              {SERVICE_TITLES.map((s) => (
                <li key={s}>
                  <a href="#services">
                    <ArrowIcon />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer__col">
            <h3>Visit</h3>
            <ul>
              {details.map((d) => (
                <li key={d.label}>{d.href ? <a href={d.href}>{d.value}</a> : <span>{d.value}</span>}</li>
              ))}
              <li>
                <a href={directionsHref} target="_blank" rel="noopener">
                  <ArrowIcon />
                  Get directions
                </a>
              </li>
              <li>
                <a href={BRAND.booking.href} {...bookingLinkProps}>
                  <ArrowIcon />
                  Request an appointment
                </a>
              </li>
            </ul>
            {social.length > 0 && (
              <ul className="footer__social" aria-label="Follow us">
                {social.map(([k, url]) => (
                  <li key={k}>
                    <a href={url} target="_blank" rel="noopener" aria-label={SOCIAL[k].label}>
                      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                        <path fill="currentColor" d={SOCIAL[k].path} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>


        {/* bottom bar */}
        <div className="footer__bottom">
          <p>
            © {year} {BRAND.name}. All rights reserved.
          </p>
          <a className="footer__up" href="#top">
            Back to top
            <span className="footer__up-dot" aria-hidden="true">
              <ArrowIcon />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
