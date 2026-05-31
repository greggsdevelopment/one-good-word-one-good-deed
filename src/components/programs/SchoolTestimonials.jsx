import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Quote } from 'lucide-react';

const TESTIMONIALS = [];

export default function SchoolTestimonials() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="relative bg-ink py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-anton text-cream text-4xl sm:text-5xl text-center mb-4"
        >
          WHAT SCHOOLS SAY
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-16 h-1 bg-gold mb-16 mx-auto origin-center"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-sm p-8 hover:border-gold/20 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-gold/40 mb-5" />
              <p className="font-barlow text-cream/70 text-base leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div>
                <p className="font-barlow-condensed text-cream font-semibold tracking-wide">{t.name}</p>
                <p className="font-barlow text-cream/40 text-sm">{t.school}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}