/**
 * Stops the page scrolling behind a menu. Deliberately simple (overflow only):
 * pinning <body> with position:fixed makes scroll-driven UI (hero, sticky nav,
 * active-section tracking) see a jump to the top and re-run, which reads as a
 * page refresh on phones. Overlays that scroll should own their own scrolling
 * instead (see .smodal in service-modal.css).
 */
export function lockScroll() {
  const body = document.body.style;
  const prev = body.overflow;
  body.overflow = 'hidden';
  return () => {
    body.overflow = prev;
  };
}
