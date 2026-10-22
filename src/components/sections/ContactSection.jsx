import { useId, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BRAND } from '../../config/brand.js';
import { useMediaQuery } from '../../hooks/useMediaQuery.js';
import ArrowIcon from '../hero/ArrowIcon.jsx';
import chairImg from '../../assets/images/chair.webp';
import cutterImg from '../../assets/images/cutter.webp';
import mirrorImg from '../../assets/images/mouth-mirror.webp';
import testerImg from '../../assets/images/tester.webp';
import toothHeroImg from '../../assets/images/tooth-hero.png';
import '../../styles/contact.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Icons: 24×24, 2px strokes (Lucide geometry, ISC licence). */
const icon = { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: false };
const ICONS = {
  phone: (
    <svg {...icon}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </svg>
  ),
  mail: (
    <svg {...icon}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  pin: (
    <svg {...icon}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  clock: (
    <svg {...icon}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  check: (
    <svg {...icon} width={28} height={28} strokeWidth={2.5}>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  ),
};

const SERVICE_OPTIONS = ['Root Canal', 'Dental Implants', 'Clear Aligners', 'Smile Designing', 'Zirconia Crowns', 'General check-up', 'Not sure yet'];

const STEPS = [
  { title: 'We call you back', body: 'Within one working day to confirm a time that suits you.' },
  { title: 'Consultation and scan', body: 'A thorough examination, a 3D scan if needed, and a clear explanation of your options.' },
  { title: 'Your plan, your pace', body: 'A written treatment plan with costs. No pressure, no surprises.' },
];

const digits = (s) => s.replace(/[^+\d]/g, '');

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Please enter your name.';
  if (digits(v.phone).length < 7) e.phone = 'Please enter a phone number we can call.';
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) e.email = 'That email address does not look right.';
  if (!v.service) e.service = 'Choose a treatment, or "Not sure yet".';
  return e;
}

const EMPTY = { name: '', phone: '', email: '', service: '', date: '', message: '' };

export default function ContactSection() {
  const root = useRef(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const { contact } = BRAND;
  const id = useId();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed

  const mapQuery = contact.map?.query || contact.address || BRAND.name;
  const mapSrc = contact.map?.embedUrl || `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;

  const details = [
    contact.phone && { icon: 'phone', label: 'Call us', value: contact.phone, href: `tel:${digits(contact.phone)}` },
    contact.email && { icon: 'mail', label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    contact.address && { icon: 'pin', label: 'Visit', value: contact.address },
    contact.hours && { icon: 'clock', label: 'Hours', value: contact.hours },
  ].filter(Boolean);

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
      reveal('.contact__head > *', '.contact__head');
      reveal('.contact__form-card', '.contact__layout', { y: 36 });
      reveal('.contact__aside > *', '.contact__aside', { stagger: 0.12 });

      // Background floating items parallax scrolling effect
      const pRange = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 };
      gsap.fromTo('.contact__bg-item--mirror', { y: 110, rotation: -12 }, { y: -150, rotation: 22, ease: 'none', scrollTrigger: pRange });
      gsap.fromTo('.contact__bg-item--tester', { y: 140, rotation: 15 }, { y: -190, rotation: -24, ease: 'none', scrollTrigger: pRange });
      gsap.fromTo('.contact__bg-item--cutter', { y: 130, rotation: -8 }, { y: -170, rotation: 18, ease: 'none', scrollTrigger: pRange });
      gsap.fromTo('.contact__bg-item--chair', { y: 90, rotation: 6 }, { y: -140, rotation: -15, ease: 'none', scrollTrigger: pRange });
      gsap.fromTo('.contact__bg-item--tooth', { y: 120, rotation: -15 }, { y: -160, rotation: 25, ease: 'none', scrollTrigger: pRange });
    },
    { scope: root, dependencies: [reduced], revertOnUpdate: true },
  );

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    const er = validate(values);
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) {
      root.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      if (contact.formEndpoint) {
        const res = await fetch(contact.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else if (contact.email) {
        // No endpoint configured: hand the request to the visitor's mail client.
        const body = Object.entries(values)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k[0].toUpperCase()}${k.slice(1)}: ${v}`)
          .join('\n');
        window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(`Consultation request: ${values.service}`)}&body=${encodeURIComponent(body)}`;
      }
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  }

  const field = (name, label, props = {}, hint) => {
    const fid = `${id}-${name}`;
    const err = errors[name];
    return (
      <div className={`field${err ? ' field--error' : ''}`}>
        <label htmlFor={fid}>
          {label}
          {props.required ? <span aria-hidden="true"> *</span> : <span className="field__opt">optional</span>}
        </label>
        {props.as === 'select' ? (
          <div className="field__select">
            <select id={fid} name={name} value={values[name]} onChange={set(name)} aria-invalid={Boolean(err)} aria-describedby={err ? `${fid}-err` : undefined} required={props.required}>
              <option value="">Select a treatment</option>
              {SERVICE_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <ArrowIcon className="field__chevron" />
          </div>
        ) : props.as === 'textarea' ? (
          <textarea id={fid} name={name} rows={4} value={values[name]} onChange={set(name)} placeholder={hint} />
        ) : (
          <input id={fid} name={name} value={values[name]} onChange={set(name)} aria-invalid={Boolean(err)} aria-describedby={err ? `${fid}-err` : undefined} placeholder={hint} {...props} />
        )}
        {err && (
          <p id={`${fid}-err`} className="field__error" role="alert">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <section id="contact" ref={root} className="section contact" aria-labelledby="contact-title">
      {/* Background floating addon elements with parallax effect */}
      <div className="contact__bg-addons" aria-hidden="true">
        <img className="contact__bg-item contact__bg-item--mirror" src={mirrorImg} alt="" width="300" height="300" loading="lazy" decoding="async" />
        <img className="contact__bg-item contact__bg-item--tester" src={testerImg} alt="" width="260" height="400" loading="lazy" decoding="async" />
        <img className="contact__bg-item contact__bg-item--cutter" src={cutterImg} alt="" width="280" height="340" loading="lazy" decoding="async" />
        <img className="contact__bg-item contact__bg-item--chair" src={chairImg} alt="" width="320" height="460" loading="lazy" decoding="async" />
        <img className="contact__bg-item contact__bg-item--tooth" src={toothHeroImg} alt="" width="240" height="240" loading="lazy" decoding="async" />
      </div>

      <div className="section__inner">
        <header className="contact__head">
          <p className="section__eyebrow contact__eyebrow">
            <span className="contact__eyebrow-dot" aria-hidden="true" />
            Contact
          </p>
          <h2 id="contact-title" className="section__title">
            Book your consultation.
          </h2>
          <p className="section__lede">Tell us a little about what you need. We will call you back to confirm a time, and the first conversation is always free of obligation.</p>
        </header>

        <div className="contact__layout">
          <div className="contact__form-card">
            {status === 'sent' ? (
              <div className="contact__done" role="status" aria-live="polite">
                <span className="contact__done-icon">{ICONS.check}</span>
                <h3>Request received</h3>
                <p>
                  Thank you, {values.name.split(' ')[0]}. We will call {values.phone} within one working day to confirm your appointment.
                </p>
                <button
                  type="button"
                  className="contact__reset"
                  onClick={() => {
                    setValues(EMPTY);
                    setStatus('idle');
                  }}
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form className="contact__form" onSubmit={onSubmit} noValidate>
                <div className="contact__form-head">
                  <h3>Request an appointment</h3>
                  <p>Fields marked * are required.</p>
                </div>
                <div className="contact__grid">
                  {field('name', 'Full name', { type: 'text', autoComplete: 'name', required: true }, 'Jane Doe')}
                  {field('phone', 'Phone', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', required: true }, '+1 555 010 0199')}
                  {field('email', 'Email', { type: 'email', inputMode: 'email', autoComplete: 'email' }, 'jane@example.com')}
                  {field('date', 'Preferred date', { type: 'date', min: new Date().toISOString().slice(0, 10) })}
                  <div className="contact__span">{field('service', 'Treatment', { as: 'select', required: true })}</div>
                  <div className="contact__span">{field('message', 'Anything we should know?', { as: 'textarea' }, 'Symptoms, previous treatment, or questions')}</div>
                </div>
                {status === 'failed' && (
                  <p className="contact__fail" role="alert">
                    Something went wrong and your request was not sent. Please try again{contact.phone ? ` or call ${contact.phone}` : ''}.
                  </p>
                )}
                <div className="contact__submit">
                  <button type="submit" className="btn btn--primary contact__btn" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Request appointment'}
                    <ArrowIcon />
                  </button>
                  <p className="contact__privacy">We only use your details to arrange your visit.</p>
                </div>
              </form>
            )}
          </div>

          <aside className="contact__aside">
            <div className="contact__map">
              <iframe
                src={mapSrc}
                title={`Map showing the location of ${BRAND.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="contact__map-bar">
                <span className="contact__map-pin" aria-hidden="true">
                  {ICONS.pin}
                </span>
                <div className="contact__map-text">
                  <span className="contact__detail-label">Find us</span>
                  <span>{contact.address || BRAND.name}</span>
                </div>
                <a className="contact__map-link" href={directionsHref} target="_blank" rel="noopener">
                  Get directions
                  <ArrowIcon />
                </a>
              </div>
            </div>

            <ol className="contact__steps" aria-label="What happens next">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <span className="contact__step-n" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>

            {details.length > 0 && (
              <ul className="contact__details">
                {details.map((d) => (
                  <li key={d.label}>
                    <span className="contact__detail-icon">{ICONS[d.icon]}</span>
                    <div>
                      <span className="contact__detail-label">{d.label}</span>
                      {d.href ? <a href={d.href}>{d.value}</a> : <span>{d.value}</span>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
