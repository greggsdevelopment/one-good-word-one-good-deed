import { useEffect, useMemo, useRef } from 'react';

const COLORS = ['var(--rb-red)', 'var(--rb-orange)', 'var(--rb-yellow)', 'var(--rb-green)', 'var(--rb-blue)', 'var(--rb-purple)'];

// A single jigsaw piece, the same shape language as the logo ring.
const PIECE = 'M10 4h7a4 4 0 1 1 6 0h7v7a4 4 0 1 0 0 6v7h-7a4 4 0 1 1-6 0h-7v-7a4 4 0 1 0 0-6z';

// Small deterministic generator so the layout is the same every render.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Puzzle pieces drifting slowly in the background, echoing the logo ring.
 * Purely decorative; hidden from screen readers and frozen for reduced motion.
 */
export default function PuzzleField({ count = 16, seed = 7, className = '', maxOpacity = 0.28 }) {
  const pieces = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: count }, (_, i) => ({
      left: r() * 100,
      top: r() * 100,
      size: 18 + r() * 38,
      color: COLORS[i % COLORS.length],
      opacity: 0.08 + r() * (maxOpacity - 0.08),
      duration: 14 + r() * 16,
      delay: -r() * 20,
      dx: (r() - 0.5) * 60,
      dy: (r() - 0.5) * 60,
      rot: (r() - 0.5) * 90,
      start: r() * 360,
    }));
  }, [count, seed, maxOpacity]);

  // Drift with the Web Animations API on plain boxes, with fixed numbers: the
  // browser's compositor runs these off the main thread, so they cost nothing
  // while scrolling. (Animating inside the SVG, or with CSS variables in the
  // keyframes, forced a repaint of every piece on every frame.)
  const root = useRef(null);
  useEffect(() => {
    const el = root.current;
    if (!el || !el.animate) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const anims = [...el.children].map((child, i) => {
      const p = pieces[i];
      return child.animate(
        [
          { transform: 'translate3d(0,0,0) rotate(0deg)' },
          { transform: `translate3d(${p.dx.toFixed(1)}px, ${p.dy.toFixed(1)}px, 0) rotate(${p.rot.toFixed(1)}deg)` },
          { transform: 'translate3d(0,0,0) rotate(0deg)' },
        ],
        { duration: p.duration * 1000, delay: p.delay * 1000, iterations: Infinity, easing: 'ease-in-out' },
      );
    });
    return () => anims.forEach((a) => a.cancel());
  }, [pieces]);

  return (
    <div ref={root} aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {pieces.map((p, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, opacity: p.opacity }}
        >
          <svg viewBox="0 0 40 40" width={p.size} height={p.size} style={{ transform: `rotate(${p.start}deg)` }}>
            <path d={PIECE} fill={p.color} />
          </svg>
        </div>
      ))}
    </div>
  );
}
