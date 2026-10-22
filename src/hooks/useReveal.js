import gsap from 'gsap';

/**
 * Scroll reveal shared by every section: targets fade up once as `trigger`
 * enters the viewport. Call inside a useGSAP callback (scoped to the section)
 * and skip the call entirely under prefers-reduced-motion.
 */
export const reveal = (targets, trigger, vars = {}) =>
  gsap.from(targets, {
    autoAlpha: 0,
    y: 28,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.1,
    scrollTrigger: { trigger, start: 'top 82%', once: true },
    ...vars,
  });
