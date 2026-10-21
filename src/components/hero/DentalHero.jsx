import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Navigation from './Navigation.jsx';
import HeroCopy from './HeroCopy.jsx';
import PatientProof from './PatientProof.jsx';
import ConsultBadge from './ConsultBadge.jsx';
import FrameSequence, { sequenceUrls } from './FrameSequence.jsx';
import { BRAND } from '../../config/brand.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import '../../styles/hero.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SEQ = BRAND.hero.sequence;
const FRAME_SETS = SEQ.sets.map(({ width, path }) => ({ width, urls: sequenceUrls(SEQ, path) }));
// Data-saver users get the still first frame instead of 4–8 MB of frames.
const saveData = typeof navigator !== 'undefined' && navigator.connection?.saveData === true;

export default function DentalHero() {
  const root = useRef(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [inView, setInView] = useState(true);

  /* Entrance: card → nav → headline lines → avatars → intro → proof → badge → tooth image */
  useGSAP(
    () => {
      if (reduced) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl
        .from('[data-hero="card"]', { autoAlpha: 0, scale: 0.97, duration: 1.1, ease: 'power2.out' }, 0)
        .from('[data-hero="nav"]', { autoAlpha: 0, y: -10, duration: 0.9 }, 0.2)
        .from('[data-hero="line"]', { yPercent: 105, duration: 1.1, stagger: 0.1, ease: 'power4.out' }, 0.3)
        .from('.avatars > *', { autoAlpha: 0, scale: 0.4, duration: 0.7, stagger: 0.08, ease: 'back.out(2)' }, 0.95)
        .from('[data-hero="intro"]', { autoAlpha: 0, y: 16, duration: 0.9 }, 0.8)
        .from('[data-hero="actions"] > *', { autoAlpha: 0, y: 14, duration: 0.8, stagger: 0.1 }, 1.0)
        .from('[data-hero="tooth"]', { autoAlpha: 0, scale: 0.96, y: 30, duration: 1.3, ease: 'power2.out' }, 0.5)
        .from('[data-hero="stat"]', { autoAlpha: 0, y: 24, duration: 0.9, ease: 'power3.out' }, 1.0)
        // meter fills in step with the count-up (its resting scale comes from --value in CSS)
        .from('[data-hero="meter"]', { scaleX: 0, duration: 1.4, ease: 'power2.out' }, 1.1)
        .from('[data-hero="patient"]', { autoAlpha: 0, yPercent: 18, duration: 1.2 }, 0.9)
        .from('[data-hero="consult"]', { autoAlpha: 0, scale: 0.5, rotate: -90, duration: 1.1, ease: 'back.out(1.5)' }, 1.2);

      // stat counts up as its card lands ("98%" → prefix 0…98 suffix); non-numeric values are left alone
      const stat = root.current.querySelector('[data-count]');
      const parts = stat?.textContent.match(/^(\D*)(\d+)(.*)$/);
      let restoreStat;
      if (parts) {
        const [, pre, num, post] = parts;
        const n = { v: 0 };
        tl.to(n, { v: Number(num), duration: 1.4, ease: 'power2.out', onUpdate: () => (stat.textContent = pre + Math.round(n.v) + post) }, 1.1);
        // a revert mid-count (StrictMode, motion-preference change) must not leave a partial number behind
        restoreStat = () => (stat.textContent = pre + num + post);
      }

      const range = { trigger: root.current, start: 'top top', end: 'bottom top' };
      // Scroll parallax effects
      gsap.to('[data-hero="tooth"]', { yPercent: 15, ease: 'none', scrollTrigger: { ...range, scrub: 0.9 } });
      // patient drifts up a touch faster than the card for a little depth
      gsap.to('.proof', { yPercent: -10, ease: 'none', scrollTrigger: { ...range, scrub: true } });

      return restoreStat;
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  /* Pause every loop (frames + CSS) while the hero is off-screen. */
  useEffect(() => {
    const el = root.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="top" ref={root} className="hero" aria-labelledby="hero-title" data-paused={!inView || undefined}>
      <div className="hero__card" data-hero="card">
        <Navigation />

        <div className="hero__stage" role="img" aria-label={`${BRAND.hero.sequenceLabel} — ${BRAND.name}`}>
          <div className="hero__frames" data-hero="tooth">
            <FrameSequence
              className="hero__frames-canvas"
              sets={FRAME_SETS}
              size={SEQ.size}
              fps={SEQ.fps}
              playing={inView}
              still={reduced || saveData}
            />
          </div>
        </div>

        <HeroCopy />
        <PatientProof />
      </div>

      <ConsultBadge />
    </section>
  );
}
