import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const STATS = [
  { value: 500, suffix: '+', label: 'Students Reached', prefix: '' },
  { value: 12, suffix: '+', label: 'Schools Visited', prefix: '' },
  { value: 1, suffix: ' in 5', label: 'Students Bullied', prefix: '' },
  { value: 2000, suffix: '+', label: 'Wristbands Distributed', prefix: '' },
];

function AnimatedNumber({ target, suffix, prefix, inView }) {
  const [count, setCount] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [inView, target]);

  return (
    <span className="font-anton text-gold text-5xl sm:text-6xl leading-none tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export default function ImpactCounters() {
  const [ref, inView] = useInView(0.2);

  return (
    <section className="relative bg-ink py-20 md:py-28 px-6 overflow-hidden" ref={ref}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-1 bg-gold mb-10 mx-auto origin-center"
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-12 text-center"
        >
          Our Impact
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-sm overflow-hidden">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-ink flex flex-col items-center justify-center py-12 px-6 text-center gap-3 hover:bg-white/[0.03] transition-colors"
            >
              <AnimatedNumber
                target={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
                inView={inView}
              />
              <p className="font-barlow-condensed text-cream/50 text-sm tracking-wider uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}