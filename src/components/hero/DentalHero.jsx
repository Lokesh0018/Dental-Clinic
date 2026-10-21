import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Navigation from './Navigation.jsx';
import HeroCopy from './HeroCopy.jsx';
import PatientProof from './PatientProof.jsx';
import ConsultBadge from './ConsultBadge.jsx';
import { BRAND } from '../../config/brand.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import '../../styles/hero.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function DentalHero() {
  const root = useRef(null);
  const mountedAt = useRef(0);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  /* Entrance: card → nav → headline lines → avatars → intro → proof → badge → tooth image */
  useGSAP(
    () => {
      mountedAt.current = performance.now();
      if (reduced) return;

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-hero="card"]', { autoAlpha: 0, scale: 0.97, duration: 1.1, ease: 'power2.out' }, 0)
        .from('[data-hero="nav"]', { autoAlpha: 0, y: -10, duration: 0.9 }, 0.2)
        .from('[data-hero="line"]', { yPercent: 105, duration: 1.1, stagger: 0.1, ease: 'power4.out' }, 0.3)
        .from('.avatars > *', { autoAlpha: 0, scale: 0.4, duration: 0.7, stagger: 0.08, ease: 'back.out(2)' }, 0.95)
        .from('[data-hero="intro"]', { autoAlpha: 0, y: 16, duration: 0.9 }, 0.8)
        .from('[data-hero="tooth-img"]', { autoAlpha: 0, scale: 0.85, y: 30, duration: 1.3, ease: 'power2.out' }, 0.5)
        .from('[data-hero="stat"]', { autoAlpha: 0, y: 30, rotate: -6, duration: 1.0, ease: 'back.out(1.6)' }, 1.0)
        .from('[data-hero="patient"]', { autoAlpha: 0, yPercent: 18, duration: 1.2 }, 0.9)
        .from('[data-hero="consult"]', { autoAlpha: 0, scale: 0.5, rotate: -90, duration: 1.1, ease: 'back.out(1.5)' }, 1.2);

      const range = { trigger: root.current, start: 'top top', end: 'bottom top' };
      // Scroll parallax effects
      gsap.to('[data-hero="tooth-img"]', { yPercent: 15, ease: 'none', scrollTrigger: { ...range, scrub: 0.9 } });
      // patient drifts up a touch faster than the card for a little depth
      gsap.to('.proof', { yPercent: -10, ease: 'none', scrollTrigger: { ...range, scrub: true } });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section id="top" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__card" data-hero="card">
        <Navigation />

        <div className="hero__stage" role="img" aria-label={`A giant glossy white molar tooth — ${BRAND.name}`}>
          <img
            className="hero__tooth-image"
            data-hero="tooth-img"
            src="/images/tooth-hero.png"
            alt="Glossy anatomical molar tooth"
            width="1000"
            height="1000"
            decoding="async"
            fetchPriority="high"
          />
        </div>

        <HeroCopy />
        <PatientProof />
      </div>

      <ConsultBadge />
    </section>
  );
}
