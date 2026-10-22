import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BRAND, bookingLinkProps } from '../../config/brand.js';
import ArrowIcon from '../hero/ArrowIcon.jsx';
import '../../styles/service-modal.css';

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="m5 12 4.5 4.5L19 7" />
  </svg>
);

/* Drag-to-compare: a transparent range input sits over the frame, so the
   divider moves with mouse, touch, and arrow keys without custom pointer code. */
function BeforeAfter({ before, after, title }) {
  const [pos, setPos] = useState(50);
  return (
    <figure className="cmp" style={{ '--pos': `${pos}%` }}>
      <div className="cmp__frame">
        <img className="cmp__img" src={after} alt={`${title}: after treatment`} draggable="false" />
        <img className="cmp__img cmp__img--before" src={before} alt={`${title}: before treatment`} draggable="false" />
        <span className="cmp__tag cmp__tag--before" aria-hidden="true">Before</span>
        <span className="cmp__tag cmp__tag--after" aria-hidden="true">After</span>
        <span className="cmp__divider" aria-hidden="true">
          <span className="cmp__knob">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
            </svg>
          </span>
        </span>
        <input
          type="range"
          className="cmp__range"
          min="0"
          max="100"
          step="0.5"
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`${title}: drag to compare before and after`}
          aria-valuetext={`${Math.round(pos)}% before`}
        />
      </div>
      <figcaption className="cmp__hint">Drag the handle to compare</figcaption>
    </figure>
  );
}

export default function ServiceModal({ service, index, icon, onClose }) {
  const ref = useRef(null);
  const open = Boolean(service);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!service) return null;

  return createPortal(
    <dialog
      ref={ref}
      className="smodal"
      aria-labelledby="smodal-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <article className="smodal__card">
        <button type="button" className="smodal__close" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <div className="smodal__media">
          <BeforeAfter before={service.before} after={service.after} title={service.title} />
        </div>

        <div className="smodal__body">
          <header className="smodal__head">
            <span className="smodal__icon">{icon}</span>
            <div>
              <p className="smodal__eyebrow">Service {String(index + 1).padStart(2, '0')}</p>
              <h2 id="smodal-title">{service.title}</h2>
            </div>
          </header>

          <p className="smodal__lede">{service.detail}</p>

          <dl className="smodal__stats" aria-label={`${service.title} at a glance`}>
            {service.stats.map((s) => (
              <div key={s.label} className="smodal__stat">
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="smodal__includes" aria-label={`${service.title} includes`}>
            {service.includes.map((t) => (
              <li key={t}>
                <CheckIcon />
                {t}
              </li>
            ))}
          </ul>

          <div className="smodal__actions">
            {/* close first so the anchor scroll lands on an unlocked page */}
            <a className="btn btn--primary" href={BRAND.booking.href} {...bookingLinkProps} onClick={onClose}>
              Ask about {service.title.toLowerCase()}
              <ArrowIcon />
            </a>
          </div>
        </div>
      </article>
    </dialog>,
    document.body,
  );
}
