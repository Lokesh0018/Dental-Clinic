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

const ICONS = {
  shield: (
    <svg {...icon}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  ),
  wrench: (
    <svg {...icon}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  sparkle: (
    <svg {...icon}>
      <path d="M9.9 3.2 11.2 7a2 2 0 0 0 1.3 1.3l3.8 1.3a.5.5 0 0 1 0 .9l-3.8 1.3A2 2 0 0 0 11.2 13l-1.3 3.8a.5.5 0 0 1-.9 0L7.7 13a2 2 0 0 0-1.3-1.3L2.6 10.5a.5.5 0 0 1 0-.9l3.8-1.3A2 2 0 0 0 7.7 7L9 3.2a.5.5 0 0 1 .9 0z" />
      <path d="M18 2v4M20 4h-4M19 16v4M21 18h-4" />
    </svg>
  ),
};

const SERVICES = [
  {
    icon: 'shield',
    title: 'Preventive care',
    body: 'Thorough examinations and gentle hygiene visits that keep small concerns from becoming larger ones.',
    includes: ['Check-ups', 'Hygiene & cleaning', 'Digital X-rays'],
  },
  {
    icon: 'wrench',
    title: 'Restorative dentistry',
    body: 'Fillings, crowns and bridges planned with precision and finished to blend naturally with your smile.',
    includes: ['Fillings', 'Crowns & bridges', 'Root canal care'],
  },
  {
    icon: 'sparkle',
    title: 'Cosmetic dentistry',
    body: 'Whitening and smile design guided by proportion and restraint, so results look like you — only brighter.',
    includes: ['Whitening', 'Veneers', 'Smile design'],
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
            <li key={s.title} className="services__card">
              <div className="services__card-top">
                <span className="services__icon">{ICONS[s.icon]}</span>
                <span className="services__index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <ul className="services__includes" aria-label={`${s.title} includes`}>
                {s.includes.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <a className="services__link" href={BRAND.booking.href} {...bookingLinkProps}>
                Ask about {s.title.toLowerCase()}
                <ArrowIcon />
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
