import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BRAND, bookingLinkProps } from '../../config/brand.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import ArrowIcon from '../hero/ArrowIcon.jsx';
import '../../styles/services.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Icons: 24×24, 2px strokes (Lucide geometry, ISC licence). */
const icon = { viewBox: '0 0 24 24', width: 24, height: 24, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false };

/* a shared molar outline, so every tooth-based icon has the same silhouette */
const TOOTH =
  'M12 5.3c-1.6-1.5-4.1-2-6.1-1C3.4 5.6 2.9 8.8 3.9 11.3c1 2.8 2 6 2.5 9 .3 1.4 2 1.6 2.6.3L11 15.8c.4-.8 1.6-.8 2 0l2 4.8c.6 1.3 2.3 1.1 2.6-.3.5-3 1.5-6.2 2.5-9 1-2.5.5-5.7-2-7-2-1-4.5-.5-6.1 1z';

const ICONS = {
  /* tooth with the canal traced down the centre */
  rootCanal: (
    <svg {...icon}>
      <path d={TOOTH} />
      <path d="M12 8.5v6" strokeDasharray="1.5 2" />
    </svg>
  ),
  /* crown on a threaded titanium post */
  implants: (
    <svg {...icon}>
      <path d="M8 3h8a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M10 8v10.5a2 2 0 0 0 4 0V8" />
      <path d="M10 11h4M10 14h4M10 17h4" />
    </svg>
  ),
  /* dental arch wrapped in a clear tray */
  aligners: (
    <svg {...icon}>
      <path d="M4 12V11a8 8 0 0 1 16 0v1" />
      <path d="M4 12c0 3.3 3.6 5 8 5s8-1.7 8-5" />
      <path d="M8.5 6.5V15M12 4.5V16M15.5 6.5V15" strokeOpacity="0.55" />
    </svg>
  ),
  /* tooth with a sparkle: design, not just repair */
  smile: (
    <svg {...icon}>
      <path d={TOOTH} />
      <path d="M18.5 2.5v4M16.5 4.5h4" />
    </svg>
  ),
  /* Lucide "crown" */
  crowns: (
    <svg {...icon}>
      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
      <path d="M5 21h14" />
    </svg>
  ),
};

const CheckIcon = () => (
  <svg {...icon} width={14} height={14} strokeWidth={3}>
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);

const SERVICES = [
  {
    icon: 'rootCanal',
    title: 'Root Canal',
    body: 'Gentle, pain-free endodontic therapy designed to save and preserve your natural tooth while eliminating infection.',
    includes: ['Single-visit options', 'Digital apex locator', 'Pain-free anaesthesia'],
  },
  {
    icon: 'implants',
    title: 'Dental Implants',
    body: 'Permanent titanium and zirconia tooth replacements that look, feel, and function just like natural teeth.',
    includes: ['Full-arch solutions', 'Computer-guided placement', 'Natural aesthetics'],
  },
  {
    icon: 'aligners',
    title: 'Clear Aligners',
    body: 'Discreet, comfortable transparent trays that straighten your teeth seamlessly without brackets or metal wires.',
    includes: ['Custom 3D scan', 'Virtually invisible', 'Removable convenience'],
  },
  {
    icon: 'smile',
    title: 'Smile Designing',
    body: 'Bespoke aesthetic smile transformations combining proportions, facial symmetry, veneers, and whitening.',
    includes: ['Digital smile simulation', 'Porcelain veneers', 'Enamel reshaping'],
  },
  {
    icon: 'crowns',
    title: 'Zirconia Crowns',
    body: 'Ultra-durable, lifelike biocompatible crowns that restore strength, function, and aesthetic perfection.',
    includes: ['Metal-free biocompatibility', 'High fracture resistance', 'Precision CAD/CAM fit'],
  },
];

export default function ServicesSection() {
  const root = useRef(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  useGSAP(
    () => {
      if (reduced) return;
      const reveal = (targets, trigger, vars = {}) =>
        gsap.from(targets, {
          autoAlpha: 0,
          y: 28,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger, start: 'top 82%', once: true },
          ...vars,
        });
      reveal('.services__head > *', '.services__head');
      reveal('.services__card', '.services__grid', { stagger: 0.12 });
      reveal('.services__help', '.services__help', { y: 20 });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section id="services" ref={root} className="section services" aria-labelledby="services-title">
      <div className="section__inner">
        <header className="services__head">
          <p className="section__eyebrow services__eyebrow">
            <span className="services__eyebrow-dot" aria-hidden="true" />
            Services
          </p>
          <h2 id="services-title" className="section__title">
            Care for every smile.
          </h2>
          <p className="section__lede">
            From routine check-ups to complete smile makeovers, every treatment is planned around you and explained before it begins.
          </p>
        </header>

        <ul className="services__grid">
          {SERVICES.map((s, i) => (
            <li key={s.title} className={`services__card${i === 0 ? ' services__card--featured' : ''}`}>
              <span className="services__watermark" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="services__card-top">
                <span className="services__icon">{ICONS[s.icon]}</span>
                {i === 0 && <span className="services__badge">Most requested</span>}
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <ul className="services__includes" aria-label={`${s.title} includes`}>
                {s.includes.map((t) => (
                  <li key={t}>
                    <CheckIcon />
                    {t}
                  </li>
                ))}
              </ul>
              <a className="services__link" href={BRAND.booking.href} {...bookingLinkProps}>
                <span>Ask about {s.title.toLowerCase()}</span>
                <span className="services__link-dot" aria-hidden="true">
                  <ArrowIcon />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <aside className="services__help" aria-label="Not sure what you need">
          <div className="services__help-text">
            <h3>Not sure which treatment you need?</h3>
            <p>Start with a consultation. We will examine, explain your options side by side, and let you decide at your own pace.</p>
          </div>
          <a className="btn btn--primary" href={BRAND.booking.href} {...bookingLinkProps}>
            {BRAND.booking.label}
            <ArrowIcon />
          </a>
        </aside>
      </div>
    </section>
  );
}
