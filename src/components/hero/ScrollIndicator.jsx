export default function ScrollIndicator({ target = '#about' }) {
  const onClick = (e) => {
    const el = document.querySelector(target);
    if (!el) return;
    e.preventDefault();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', target);
  };

  return (
    <a className="scroll-cue" href={target} onClick={onClick} aria-label="Scroll to the next section">
      <svg className="scroll-cue__arrow" viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
        <path d="M8 2.5v10M3.5 8.5 8 13l4.5-4.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}
