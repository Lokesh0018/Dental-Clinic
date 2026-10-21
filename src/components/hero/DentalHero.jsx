import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Navigation from './Navigation.jsx';
import HeroCopy from './HeroCopy.jsx';
import PatientProof from './PatientProof.jsx';
import ConsultBadge from './ConsultBadge.jsx';
import ToothCrew from './ToothCrew.jsx';
import { BRAND } from '../../config/brand.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import '../../styles/hero.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function DentalHero() {
  const root = useRef(null);
  const mountedAt = useRef(0);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [inView, setInView] = useState(true);
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');

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
        .from('[data-hero="actions"] > *', { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.1 }, 1.0)
        .from('[data-hero="glow"]', { autoAlpha: 0, scale: 0.7, duration: 1.6, ease: 'power2.out' }, 0.4)
        .from('[data-hero="tooth"]', { autoAlpha: 0, scale: 0.85, y: 30, duration: 1.3, ease: 'power2.out' }, 0.5)
        // the crew drops onto the tooth once it has landed
        .from('[data-crew]', { autoAlpha: 0, y: -24, duration: 0.7, stagger: 0.12, ease: 'back.out(2)' }, 1.4)
        .from('[data-hero="stat"]', { autoAlpha: 0, y: 30, rotate: -6, duration: 1.0, ease: 'back.out(1.6)' }, 1.0)
        .from('[data-hero="patient"]', { autoAlpha: 0, yPercent: 18, duration: 1.2 }, 0.9)
        .from('[data-hero="consult"]', { autoAlpha: 0, scale: 0.5, rotate: -90, duration: 1.1, ease: 'back.out(1.5)' }, 1.2);

      const range = { trigger: root.current, start: 'top top', end: 'bottom top' };
      // Scroll parallax effects
      gsap.to('[data-hero="tooth"]', { yPercent: 15, ease: 'none', scrollTrigger: { ...range, scrub: 0.9 } });
      // patient drifts up a touch faster than the card for a little depth
      gsap.to('.proof', { yPercent: -10, ease: 'none', scrollTrigger: { ...range, scrub: true } });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  /* Desktop only: the tooth rig tilts a few degrees towards the pointer. */
  useEffect(() => {
    const rig = root.current?.querySelector('[data-hero="tilt"]');
    if (!rig || !finePointer || reduced) return;
    const setX = gsap.quickTo(rig, 'rotateY', { duration: 0.9, ease: 'power3.out' });
    const setY = gsap.quickTo(rig, 'rotateX', { duration: 0.9, ease: 'power3.out' });
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      setX(((e.clientX / window.innerWidth) * 2 - 1) * 6);
      setY(-((e.clientY / window.innerHeight) * 2 - 1) * 4);
    };
    const reset = () => {
      setX(0);
      setY(0);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', reset);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', reset);
      gsap.set(rig, { clearProps: 'transform' });
    };
  }, [finePointer, reduced]);

  /* Pause the crew's animation while the hero is off-screen. */
  useEffect(() => {
    const el = root.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="top" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__card" data-hero="card">
        <Navigation />

        <div
          className="hero__stage"
          role="img"
          aria-label={`A giant glossy molar being polished by miniature dentists — ${BRAND.name}`}
        >
          {/* rig: entrance + scroll parallax · float: idle bob (CSS) — separate nodes so they never fight */}
          <div className="hero__glow" data-hero="glow" aria-hidden="true" />
          <div className="tooth-rig" data-hero="tooth">
            <div className="tooth-rig__tilt" data-hero="tilt">
            <div className="tooth-rig__float">
              <img
                className="hero__tooth-image"
                src="/images/tooth-hero.png"
                alt=""
                width="500"
                height="500"
                decoding="async"
                fetchPriority="high"
              />
              <ToothCrew paused={reduced || !inView} />
            </div>
            <div className="tooth-rig__shadow" aria-hidden="true" />
            </div>
          </div>
        </div>

        <HeroCopy />
        <PatientProof />
      </div>

      <ConsultBadge />
    </section>
  );
}
