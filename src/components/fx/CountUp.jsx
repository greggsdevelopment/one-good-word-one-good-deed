import { useEffect, useRef, useState } from 'react';

/** Counts from 0 to `value` once it scrolls into view. */
export default function CountUp({ value = 0, duration = 1600, className = '' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const run = () => {
      if (reduce) {
        setShown(value);
        return;
      }
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setShown(Math.round(value * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          run();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  // If the value arrives after the count already ran, jump to it.
  useEffect(() => {
    if (started.current) setShown(value);
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString()}
    </span>
  );
}
