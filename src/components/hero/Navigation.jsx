import { useEffect, useRef, useState } from 'react';
import { BRAND, bookingLinkProps } from '../../config/brand.js';
import ToothLogo from './ToothLogo.jsx';

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const toggle = useRef(null);

  useEffect(() => {
    if (!open) return;
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
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="nav" data-hero="nav">
      <div className="nav__bar">
        <a className="nav__logo" href="#top" aria-label={`${BRAND.name} — home`}>
          <ToothLogo className="nav__logo-mark" />
        </a>

        <nav className="nav__links" aria-label="Primary">
          <ul>
            {BRAND.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <a className="nav__book" href={BRAND.booking.href} {...bookingLinkProps}>
          {BRAND.booking.label}
        </a>

        <button
          ref={toggle}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__toggle-label">{open ? 'Close' : 'Menu'}</span>
          <span className="nav__toggle-icon" aria-hidden="true" data-open={open} />
        </button>
      </div>

      <div id="mobile-menu" className="nav__panel" hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {BRAND.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={close}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a className="nav__book nav__book--panel" href={BRAND.booking.href} onClick={close} {...bookingLinkProps}>
                {BRAND.booking.label}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
