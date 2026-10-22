import { useEffect, useRef, useState } from 'react';
import { BRAND, bookingLinkProps } from '../config/brand.js';
import ToothLogo from './hero/ToothLogo.jsx';
import ArrowIcon from './hero/ArrowIcon.jsx';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { useNavIndicator } from '../hooks/useNavIndicator.js';
import { lockScroll } from '../hooks/useScrollLock.js';

const NAV_HREFS = BRAND.nav.map((i) => i.href);

/**
 * Compact floating nav that appears once the hero's own nav has scrolled away, so navigation
 * and booking stay one tap away on the rest of the page. Inert (not focusable, not announced)
 * while hidden. Below 900px the section links collapse into a menu button + dropdown panel.
 */
export default function StickyNav() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_HREFS);
  const list = useRef(null);
  const toggle = useRef(null);
  useNavIndicator(list, active);

  useEffect(() => {
    const heroNav = document.querySelector('[data-hero="nav"]');
    if (!heroNav || !('IntersectionObserver' in window)) return;
    // visible only when the hero nav is above the viewport (not when the page is scrolled to the top)
    const io = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting && e.boundingClientRect.bottom < 0));
    io.observe(heroNav);
    return () => io.disconnect();
  }, []);

  // the menu cannot outlive the bar it hangs from
  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  useEffect(() => {
    if (!open) return;
    const unlock = lockScroll();
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
      unlock();
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky-nav" data-visible={visible || undefined} data-open={open || undefined} inert={!visible}>
      <a className="sticky-nav__logo" href="#top" aria-label={`${BRAND.name} — back to top`} onClick={close}>
        <span className="sticky-nav__chip" aria-hidden="true">
          <ToothLogo className="sticky-nav__mark" />
        </span>
        <span>{BRAND.shortName}</span>
      </a>
      <nav className="sticky-nav__links" aria-label="Sections">
        <ul ref={list}>
          {BRAND.nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} aria-current={active === item.href ? 'true' : undefined}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <a className="btn btn--primary sticky-nav__cta" href={BRAND.booking.href} {...bookingLinkProps} onClick={close}>
        {BRAND.booking.shortLabel}
        <ArrowIcon />
      </a>
      <button
        ref={toggle}
        type="button"
        className="nav__toggle sticky-nav__toggle"
        aria-expanded={open}
        aria-controls="sticky-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="nav__toggle-icon" aria-hidden="true" data-open={open} />
      </button>

      <div className="nav__scrim" hidden={!open} onClick={close} aria-hidden="true" />
      <div id="sticky-menu" className="nav__panel sticky-nav__panel" hidden={!open}>
        <nav aria-label="Sections">
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
      </div>
    </header>
  );
}
