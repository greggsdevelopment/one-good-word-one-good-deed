import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const STATS = [
  { value: '500+', label: 'Students Reached' },
  { value: '50+', label: 'Schools Visited' },
  { value: '98%', label: 'Would Recommend' },
  { value: '$0', label: 'Cost for Qualifying Schools' },
];

export default function ImpactStatsBanner() {
  const [ref, inView] = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-14 px-6 bg-gold/10 border-y border-gold/20">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="font-anton text-gold text-5xl sm:text-6xl leading-none mb-2">{stat.value}</p>
              <p className="font-barlow-condensed text-cream/50 text-sm tracking-wider uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}