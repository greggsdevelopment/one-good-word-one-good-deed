import { motion } from 'framer-motion';
import { School, BookOpen, MapPin } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const REASONS = [
  {
    icon: School,
    title: 'Reach More Schools',
    desc: 'Thousands of students across Michigan have never heard a message like Jason\'s. Your gift expands access to schools that need it most.',
  },
  {
    icon: BookOpen,
    title: 'Fund Free Programs',
    desc: 'Many Title I and under-resourced schools cannot afford speaker fees. Donations make it possible to give every student this experience at no cost.',
  },
  {
    icon: MapPin,
    title: 'Expand to New Cities',
    desc: 'The movement is growing. With your support, One Good Word One Good Deed can bring its message to cities beyond Southeast Michigan.',
  },
];

export default function WhyWeNeedSupport() {
  const [ref, inView] = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-20 px-6 bg-ink">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-3">Make a Real Difference</p>
          <h2 className="font-anton text-cream text-4xl sm:text-5xl tracking-wide">WHY WE NEED<br />YOUR SUPPORT</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REASONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-white/[0.03] border border-cream/10 hover:border-gold/20 rounded-sm p-8 flex flex-col gap-4 transition-colors"
              >
                <div className="w-12 h-12 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-barlow-condensed text-cream text-xl font-bold tracking-wide">{r.title}</h3>
                <p className="font-barlow text-cream/45 text-sm leading-relaxed">{r.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}