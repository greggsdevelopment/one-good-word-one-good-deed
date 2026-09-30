import { useEffect, useRef } from 'react';

/**
 * A soft rainbow light that follows the pointer across a section. Desktop
 * only; on touch screens and for reduced motion it simply sits still.
 */
export default function SpotlightHero({ className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const fine = window.matchMedia?.('(pointer: fine)').matches;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;
    const parent = el.parentElement;
    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = parent.getBoundingClientRect();
        el.style.setProperty('--x', `${e.clientX - r.left}px`);
        el.style.setProperty('--y', `${e.clientY - r.top}px`);
      });
    };
    parent.addEventListener('pointermove', onMove);
    return () => {
      parent.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        background:
          'radial-gradient(420px circle at var(--x, 50%) var(--y, 35%), rgba(160,108,213,0.18), rgba(74,155,232,0.10) 35%, transparent 70%)',
      }}
    />
  );
}
