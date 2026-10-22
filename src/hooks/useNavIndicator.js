import { useLayoutEffect } from 'react';

/**
 * Drives the sliding "active" pill behind nav links. Measures the link with
 * aria-current inside `listRef` (a <ul>) and writes its offset/width to CSS
 * custom properties on the list, so the pill can glide between items with a
 * transform transition instead of re-layout. Hides the pill when nothing is current.
 */
export function useNavIndicator(listRef, active) {
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const measure = () => {
      const link = list.querySelector('a[aria-current="true"]');
      if (!link) {
        list.removeAttribute('data-has-active');
        return;
      }
      const lr = link.getBoundingClientRect();
      const ur = list.getBoundingClientRect();
      list.style.setProperty('--ind-x', `${lr.left - ur.left}px`);
      list.style.setProperty('--ind-w', `${lr.width}px`);
      list.setAttribute('data-has-active', '');
    };

    measure();
    const ro = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;
    ro?.observe(list);
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [listRef, active]);
}
