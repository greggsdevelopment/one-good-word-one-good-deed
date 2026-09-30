import { useMemo } from 'react';

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

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {pieces.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 40 40"
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            transform: `rotate(${p.start}deg)`,
          }}
        >
          <g
            style={{
              transformOrigin: '20px 20px',
              animation: `puzzle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
              '--rot': `${p.rot}deg`,
            }}
          >
            <path d={PIECE} fill={p.color} />
          </g>
        </svg>
      ))}
    </div>
  );
}
