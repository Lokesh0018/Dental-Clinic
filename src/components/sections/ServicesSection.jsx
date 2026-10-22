import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BRAND, bookingLinkProps } from '../../config/brand.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import ArrowIcon from '../hero/ArrowIcon.jsx';
import ServiceModal from './ServiceModal.jsx';
import { CheckIcon } from '../icons.jsx';
import { SERVICES, SERVICE_ICONS } from '../../data/services.jsx';
import { reveal } from '../../hooks/useReveal.js';
import '../../styles/services.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ServicesSection() {
  const root = useRef(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [active, setActive] = useState(null); // index of the open service, or null

  useGSAP(
    () => {
      if (reduced) return;
      reveal('.services__head > *', '.services__head');
      reveal('.services__card', '.services__grid', { stagger: 0.12 });
      reveal('.services__help', '.services__help', { y: 20 });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section id="services" ref={root} className="section services" aria-labelledby="services-title">
      <div className="section__inner">
        <header className="section__head services__head">
          <p className="section__eyebrow section__eyebrow--pill">
            <span className="section__eyebrow-dot" aria-hidden="true" />
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
                <span className="services__icon">{SERVICE_ICONS[s.icon]}</span>
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
              <button type="button" className="services__link" onClick={() => setActive(i)}>
                <span>See before &amp; after</span>
                <span className="services__link-dot" aria-hidden="true">
                  <ArrowIcon />
                </span>
              </button>
            </li>
          ))}
        </ul>

        <ServiceModal
          service={active === null ? null : SERVICES[active]}
          index={active ?? 0}
          icon={active === null ? null : SERVICE_ICONS[SERVICES[active].icon]}
          onClose={() => setActive(null)}
        />

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
