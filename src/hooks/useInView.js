import { useEffect, useState } from 'react';

/**
 * True while `ref`'s element intersects the viewport. Used to pause looping
 * animations (canvas frames, CSS keyframes) while their section is off-screen.
 * `initial` is the value before the first observation; browsers without
 * IntersectionObserver keep it forever, so pass true where motion must not be stuck off.
 */
export function useInView(ref, { rootMargin = '0px', initial = true } = {}) {
  const [inView, setInView] = useState(initial);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}
