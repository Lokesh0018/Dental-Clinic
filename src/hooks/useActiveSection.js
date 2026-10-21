import { useEffect, useState } from 'react';

/**
 * Returns the href ("#about") of the nav target currently in view, so links can show
 * aria-current. Picks the section whose top is closest above the 40% viewport line.
 */
export function useActiveSection(hrefs) {
  const [active, setActive] = useState('');

  useEffect(() => {
    const targets = hrefs
      .map((h) => (h.startsWith('#') ? document.querySelector(h) : null))
      .filter(Boolean);
    if (!targets.length) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current = '';
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= line) current = `#${el.id}`;
      }
      // past the last section's end → nothing is current
      const last = targets[targets.length - 1];
      if (current === `#${last.id}` && last.getBoundingClientRect().bottom < 0) current = '';
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [hrefs]);

  return active;
}
