import { useEffect, useState } from 'react';
import { BRAND, bookingLinkProps } from '../config/brand.js';
import ToothLogo from './hero/ToothLogo.jsx';
import ArrowIcon from './hero/ArrowIcon.jsx';

/**
 * Compact floating nav that appears once the hero's own nav has scrolled away, so navigation
 * and booking stay one tap away on the rest of the page. Inert (not focusable, not announced)
 * while hidden.
 */
export default function StickyNav() {
  const [visible, setVisible] = useState(false);

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
        <ToothLogo className="sticky-nav__mark" />
        <span>{BRAND.shortName}</span>
      </a>
      <nav className="sticky-nav__links" aria-label="Sections">
        <ul>
          {BRAND.nav.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
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
