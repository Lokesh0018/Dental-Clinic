import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import BrandTypography from './BrandTypography.jsx';
import SmileTagline from './SmileTagline.jsx';
import { BRAND } from '../../config/brand.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import { hasWebGL } from '../../lib/webgl.js';
import '../../styles/hero.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ToothScene = lazy(() => import('./scene/ToothScene.jsx'));
const FALLBACK_SRC = '/images/molar-still.webp';
const FALLBACK_DELAY_MS = 1400; // show the matching still if the model is slow to arrive

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error) {
    console.warn('[hero] 3D scene unavailable, using still image.', error);
    this.props.onError?.();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function DentalHero() {
  const root = useRef(null);
  // Plain numbers shared with the R3F frame loop: GSAP tweens them, three.js reads them
  // every frame. No React state changes per frame, no DOM/3D transform conflicts.
  const motion = useRef({ reveal: 0, scroll: 0, pointerX: 0, pointerY: 0 }).current;
  const mountedAt = useRef(0);

  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isStacked = useMediaQuery('(max-width: 767px), (max-width: 1199px) and (orientation: portrait)');

  const [webgl] = useState(hasWebGL);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const live = webgl && !failed;

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);

  /* Entrance: nav → wordmark → subtitle → (tooth, below) → tagline; plus the scroll hand-off. */
  useGSAP(
    () => {
      mountedAt.current = performance.now();
      if (reduced) return;
      const nav = document.querySelector('[data-hero="nav"]');

      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('[data-hero="glow"]', { autoAlpha: 0, duration: 1.4, ease: 'power2.out' }, 0)
        .from(nav, { autoAlpha: 0, y: -8, duration: 0.9 }, 0.1)
        .from('[data-hero="wordmark"]', { autoAlpha: 0, y: 40, duration: 1.2 }, 0.3)
        .from('[data-hero="subtitle"]', { autoAlpha: 0, y: 18, duration: 1.0 }, 0.6)
        .from('[data-hero="tagline"]', { autoAlpha: 0, y: 12, duration: 1.0 }, 1.5);

      const range = { trigger: root.current, start: 'top top', end: 'bottom top' };
      gsap.to(motion, { scroll: 1, ease: 'none', scrollTrigger: { ...range, scrub: 0.9 } });
      gsap.to('.smile', {
        autoAlpha: 0,
        y: -12,
        ease: 'none',
        scrollTrigger: { ...range, end: () => `+=${Math.round(window.innerHeight * 0.3)}`, scrub: true },
      });
      gsap.to('[data-hero="glow"]', { autoAlpha: 0.3, ease: 'none', scrollTrigger: { ...range, scrub: true } });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  /* Tooth reveal — starts once the model has actually loaded (never before ~0.6s). */
  useGSAP(
    () => {
      if (!ready) return;
      if (reduced) {
        motion.reveal = 1;
        gsap.set('[data-hero="canvas"]', { autoAlpha: 1 });
        gsap.set('[data-hero="fallback"]', { autoAlpha: 0 });
        return;
      }
      const elapsed = (performance.now() - mountedAt.current) / 1000;
      const delay = Math.max(0, 0.6 - elapsed);
      gsap.to('[data-hero="canvas"]', { autoAlpha: 1, duration: 1.3, ease: 'power2.out', delay });
      gsap.to(motion, { reveal: 1, duration: 2.1, ease: 'power3.out', delay });
      gsap.to('[data-hero="fallback"]', { autoAlpha: 0, duration: 0.9, ease: 'power1.out', delay: delay + 0.35 });
    },
    { scope: root, dependencies: [ready, reduced], revertOnUpdate: true },
  );

  /* Static still: shown when WebGL is unavailable, or while a slow download finishes. */
  useEffect(() => {
    const img = root.current?.querySelector('[data-hero="fallback"]');
    if (!img || ready) return;
    if (!live) {
      gsap.to(img, { autoAlpha: 1, duration: reduced ? 0 : 1.2, ease: 'power2.out', delay: reduced ? 0 : 0.6 });
      return;
    }
    const id = setTimeout(() => gsap.to(img, { autoAlpha: 1, duration: 0.9 }), FALLBACK_DELAY_MS);
    return () => clearTimeout(id);
  }, [live, ready, reduced]);

  /* Stop rendering while the hero is off-screen. */
  useEffect(() => {
    const el = root.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '80px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Gentle pointer influence (desktop, fine pointers only). */
  const interactive = finePointer && !reduced && !isMobile;
  useEffect(() => {
    if (!interactive) return;
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      motion.pointerX = gsap.utils.clamp(-1, 1, (e.clientX / window.innerWidth) * 2 - 1);
      motion.pointerY = gsap.utils.clamp(-1, 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    const reset = () => {
      motion.pointerX = 0;
      motion.pointerY = 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', reset);
    window.addEventListener('blur', reset);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', reset);
      window.removeEventListener('blur', reset);
      reset();
    };
  }, [interactive, motion]);

  return (
    <section id="top" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__backdrop" aria-hidden="true">
        <div className="hero__glow" data-hero="glow" />
        <div className="hero__floor" />
      </div>

      <div className="hero__brand">
        <BrandTypography />
      </div>

      <div className="hero__stage" role="img" aria-label={`A single glossy white molar tooth floating above a soft blue surface — ${BRAND.name}`}>
        <img
          className="hero__still"
          data-hero="fallback"
          src={FALLBACK_SRC}
          alt=""
          width="1200"
          height="1400"
          decoding="async"
          fetchPriority={live ? 'low' : 'high'}
        />
        {live && (
          <div className="hero__canvas" data-hero="canvas">
            <SceneBoundary onError={onError}>
              <Suspense fallback={null}>
                <ToothScene
                  motion={motion}
                  active={inView}
                  still={reduced}
                  interactive={interactive}
                  lite={isMobile}
                  fill={isStacked ? 1.08 : 1.16}
                  onReady={onReady}
                />
              </Suspense>
            </SceneBoundary>
          </div>
        )}
      </div>

      <SmileTagline />
    </section>
  );
}
