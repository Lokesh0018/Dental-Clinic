import { useEffect, useRef, useState } from 'react';
import { BRAND, bookingLinkProps } from '../config/brand.js';
import ToothLogo from './hero/ToothLogo.jsx';
import ArrowIcon from './hero/ArrowIcon.jsx';
import { useActiveSection } from '../hooks/useActiveSection.js';
import { useNavIndicator } from '../hooks/useNavIndicator.js';

const NAV_HREFS = BRAND.nav.map((i) => i.href);


/**
 * Compact floating nav that appears once the hero's own nav has scrolled away, so navigation
 * and booking stay one tap away on the rest of the page. Inert (not focusable, not announced)
 * while hidden.
 */
export default function StickyNav() {
  const [visible, setVisible] = useState(false);
  const active = useActiveSection(NAV_HREFS);
  const list = useRef(null);
  useNavIndicator(list, active);

  useEffect(() => {
    const heroNav = document.querySelector('[data-hero="nav"]');
    if (!heroNav || !('IntersectionObserver' in window)) return;
    // visible only when the hero nav is above the viewport (not when the page is scrolled to the top)
    const io = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting && e.boundingClientRect.bottom < 0));
    io.observe(heroNav);
    return () => io.disconnect();
  }, []);

  return (
    <header className="sticky-nav" data-visible={visible || undefined} inert={!visible}>
      <a className="sticky-nav__logo" href="#top" aria-label={`${BRAND.name} — back to top`}>
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
      <a className="btn btn--primary sticky-nav__cta" href={BRAND.booking.href} {...bookingLinkProps}>
        {BRAND.booking.shortLabel}
        <ArrowIcon />
      </a>
    </header>
  );
}
