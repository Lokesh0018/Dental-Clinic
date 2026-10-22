import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BRAND, bookingLinkProps } from '../../config/brand.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import ArrowIcon from '../hero/ArrowIcon.jsx';
import { CheckIcon, iconProps } from '../icons.jsx';
import { reveal } from '../../hooks/useReveal.js';
import aboutImg from '../../assets/images/about.webp';
import chairImg from '../../assets/images/chair.webp';
import cutterImg from '../../assets/images/cutter.webp';
import mirrorImg from '../../assets/images/mouth-mirror.webp';
import testerImg from '../../assets/images/tester.webp';
import toothHeroImg from '../../assets/images/tooth-hero.png';
import '../../styles/about.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const icon = { ...iconProps, width: 22, height: 22 };

const ICONS = {
  listen: (
    <svg {...icon}>
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  ),
  explain: (
    <svg {...icon}>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  ),
  gentle: (
    <svg {...icon}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  plan: (
    <svg {...icon}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  ),
};

const VALUES = [
  { icon: 'listen', title: 'We listen first', body: 'Every visit starts with your questions and concerns, before any examination begins.' },
  { icon: 'explain', title: 'Clear explanations', body: 'We show you what we see and explain each option in plain language — no pressure, no jargon.' },
  { icon: 'gentle', title: 'Gentle, modern care', body: 'Careful technique and up-to-date equipment keep treatment as comfortable as possible.' },
  { icon: 'plan', title: 'Plans that fit you', body: 'Treatment is planned around your priorities and paced around your schedule.' },
];

const STEPS = [
  { title: 'A conversation', body: 'Tell us what brings you in, what worries you and what you would like to change.' },
  { title: 'Examination & plan', body: 'A thorough check-up, then a clear written plan with your options laid out side by side.' },
  { title: 'Care at your pace', body: 'Treatment begins when you are ready, one comfortable step at a time.' },
];

const TRUST = ['Listening first', 'Clear, honest options', 'Care at your pace'];

/* mineral "bubbles" that drift around the heart */
const BUBBLES = [
  { symbol: 'F', label: 'Fluorine', pos: 'f' },
  { symbol: 'Ca', label: 'Calcium', pos: 'ca' },
  { symbol: 'P', label: '', pos: 'p' },
];

export default function AboutSection() {
  const root = useRef(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');

  /* Scroll reveal: each group fades up once as it enters; nothing moves under reduced motion. */
  useGSAP(
    () => {
      if (reduced) return;
      reveal('.about__intro > *', '.about__intro');
      reveal('.about__promise', '.about__promise', { y: 40, duration: 1.1 });
      // bubbles pop in after the heart; their continuous float is CSS (about.css)
      gsap.from('.about__bubble', {
        autoAlpha: 0,
        scale: 0.5,
        duration: 0.7,
        ease: 'back.out(1.7)',
        stagger: 0.12,
        delay: 0.45,
        clearProps: 'all',
        scrollTrigger: { trigger: '.about__promise', start: 'top 82%', once: true },
      });
      reveal('.about__value', '.about__values');
      reveal('.about__step', '.about__steps', { stagger: 0.14 });
      // the connector draws in on wide screens (stacked layouts use static per-step segments)
      gsap.from('.about__steps-line', {
        scaleX: 0,
        duration: 1.4,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.about__steps', start: 'top 82%', once: true },
      });

      // Background floating items parallax scrolling effect (moves dynamically as you scroll up and down)
      const pRange = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 };
      gsap.fromTo('.about__bg-item--mirror', { y: 120, rotation: 10 }, { y: -160, rotation: 32, ease: 'none', scrollTrigger: pRange });
      gsap.fromTo('.about__bg-item--tester', { y: 160, rotation: -10 }, { y: -220, rotation: -38, ease: 'none', scrollTrigger: pRange });
      gsap.fromTo('.about__bg-item--cutter', { y: 140, rotation: -5 }, { y: -190, rotation: -26, ease: 'none', scrollTrigger: pRange });
      gsap.fromTo('.about__bg-item--chair', { y: 100, rotation: -4 }, { y: -150, rotation: 14, ease: 'none', scrollTrigger: pRange });
      gsap.fromTo('.about__bg-item--tooth', { y: 130, rotation: -6 }, { y: -180, rotation: 18, ease: 'none', scrollTrigger: pRange });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  return (
    <section id="about" ref={root} className="section about" aria-labelledby="about-title">
      {/* Background floating addon elements with parallax effect */}
      <div className="about__bg-addons" aria-hidden="true">
        <img className="about__bg-item about__bg-item--mirror" src={mirrorImg} alt="" width="300" height="300" loading="lazy" decoding="async" />
        <img className="about__bg-item about__bg-item--tester" src={testerImg} alt="" width="260" height="400" loading="lazy" decoding="async" />
        <img className="about__bg-item about__bg-item--cutter" src={cutterImg} alt="" width="280" height="340" loading="lazy" decoding="async" />
        <img className="about__bg-item about__bg-item--chair" src={chairImg} alt="" width="320" height="460" loading="lazy" decoding="async" />
        <img className="about__bg-item about__bg-item--tooth" src={toothHeroImg} alt="" width="240" height="240" loading="lazy" decoding="async" />
      </div>

      <div className="section__inner">
        {/* intro: copy + the studio "promise" panel */}
        <div className="about__top">
          <div className="about__intro">
            <p className="section__eyebrow section__eyebrow--pill">
              <span className="section__eyebrow-dot" aria-hidden="true" />
              About {BRAND.name}
            </p>
            <h2 id="about-title" className="section__title">
              Modern dentistry, delivered with a gentle touch.
            </h2>
            <p className="section__lede">
              At {BRAND.name}, every visit begins with listening. We explain what we see, outline your options clearly, and move at a
              pace that feels comfortable — so you leave with a healthier, brighter smile and complete confidence in your care.
            </p>
            <div className="about__actions">
              <a className="btn btn--primary" href={BRAND.booking.href} {...bookingLinkProps}>
                {BRAND.booking.label}
                <ArrowIcon />
              </a>
              <a className="about__link" href="#services">
                Explore our services
                <ArrowIcon />
              </a>
            </div>
            <ul className="about__trust" aria-label="What to expect">
              {TRUST.map((t) => (
                <li key={t}>
                  <CheckIcon size={16} strokeWidth={2.5} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <figure className="about__promise" aria-label="A tooth on a soft blue heart, surrounded by fluorine, calcium and phosphorus">
            <div className="about__stage">
              <img
                className="about__promise-img"
                src={aboutImg}
                alt=""
                width="1672"
                height="941"
                loading="lazy"
                decoding="async"
              />
              {BUBBLES.map((b) => (
                <span key={b.symbol} className={`about__bubble about__bubble--${b.pos}`} aria-hidden="true">
                  <span className="about__bubble-symbol">{b.symbol}</span>
                  {b.label && <span className="about__bubble-label">{b.label}</span>}
                </span>
              ))}
            </div>
          </figure>
        </div>

        {/* values */}
        <header className="about__head">
          <p className="about__kicker">Our approach</p>
          <h3 className="about__subhead" id="about-values">
            How we care for you
          </h3>
          <p className="about__head-lede">Four habits that shape every appointment, from the first hello to the follow-up.</p>
        </header>
        <ul className="about__values" aria-labelledby="about-values">
          {VALUES.map((v, i) => (
            <li key={v.title} className="about__value">
              <div className="about__value-top">
                <span className="about__icon">{ICONS[v.icon]}</span>
                <span className="about__value-index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h4>{v.title}</h4>
              <p>{v.body}</p>
            </li>
          ))}
        </ul>

        {/* first visit */}
        <div className="about__steps-panel">
          <header className="about__head about__head--tight">
            <p className="about__kicker">What happens next</p>
            <h3 className="about__subhead" id="about-steps">
              Your first visit
            </h3>
            <p className="about__head-lede">No surprises. Here is how the first appointment unfolds.</p>
          </header>
          <div className="about__steps-wrap">
            <span className="about__steps-line" aria-hidden="true" />
            <ol className="about__steps" aria-labelledby="about-steps">
              {STEPS.map((s, i) => (
                <li key={s.title} className="about__step">
                  <span className="about__step-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
