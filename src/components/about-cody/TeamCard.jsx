import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';
import { ArrowRight } from 'lucide-react';

export default function TeamCard() {
  const [ref, inView] = useInView(0.15);

  return (
    <section ref={ref} className="relative bg-ink py-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white/[0.03] border border-white/[0.07] rounded-sm p-8 sm:p-10 text-center"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-1 bg-gold mb-8 mx-auto origin-center"
        />
        <p className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4">
          The Team
        </p>
        <h3 className="font-anton text-cream text-3xl sm:text-4xl mb-4">
          The team behind the movement
        </h3>
        <p className="font-barlow text-cream/55 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
          Meet the people turning one good word into lasting change for kids across metro Detroit.
        </p>
        <Link
          to="/about-cody"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
        >
          Meet Cody <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}