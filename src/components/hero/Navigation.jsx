import { useEffect, useRef, useState } from 'react';
import { BRAND, bookingLinkProps } from '../../config/brand.js';
import { useActiveSection } from '../../hooks/useActiveSection.js';
import ToothLogo from './ToothLogo.jsx';
import ArrowIcon from './ArrowIcon.jsx';

const NAV_HREFS = BRAND.nav.map((i) => i.href);

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_HREFS);
  const toggle = useRef(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const onResize = () => window.innerWidth >= 900 && setOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="nav" data-hero="nav">
      <div className="nav__bar">
        <a className="nav__logo" href="#top" aria-label={`${BRAND.name} — home`}>
          <span className="nav__logo-chip" aria-hidden="true">
            <ToothLogo className="nav__logo-mark" />
          </span>
          <span className="nav__logo-text">{BRAND.shortName}</span>
        </a>

        <nav className="nav__links" aria-label="Primary">
          <ul>
            {BRAND.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} aria-current={active === item.href ? 'true' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="pill" href={BRAND.navCta.href}>
          {BRAND.navCta.label}
          <span className="pill__dot" aria-hidden="true">
            <ArrowIcon />
          </span>
        </a>

        <button
          ref={toggle}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__toggle-icon" aria-hidden="true" data-open={open} />
        </button>
      </div>

      <div className="nav__scrim" hidden={!open} onClick={close} aria-hidden="true" />
      <div id="mobile-menu" className="nav__panel" hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {BRAND.nav.map((item, i) => (
              <li key={item.href} style={{ '--i': i }}>
                <a href={item.href} onClick={close} aria-current={active === item.href ? 'true' : undefined}>
                  {item.label}
                  <ArrowIcon />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a className="btn btn--primary nav__panel-cta" href={BRAND.booking.href} {...bookingLinkProps} onClick={close}>
          {BRAND.booking.label}
          <ArrowIcon />
        </a>
      </div>
    </header>
  );
}
