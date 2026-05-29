import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';
import { ArrowRight } from 'lucide-react';

export default function BookJasonBanner() {
  const [ref, inView] = useInView(0.2);

  return (
    <section className="relative bg-ink py-20 px-6 overflow-hidden" ref={ref}>
      {/* Gold glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-gold/8 rounded-full blur-[120px]" />
      </div>
      <div className="grain-overlay" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4"
        >
          School Programs
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-anton text-cream text-5xl sm:text-6xl md:text-7xl leading-[0.92] mb-6"
        >
          BOOK JASON FOR<br />
          <span className="text-gold">YOUR SCHOOL</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-barlow text-cream/60 text-xl max-w-2xl mx-auto mb-10"
        >
          Bring an unforgettable assembly experience to your students. Jason speaks directly to the hearts of young people — on bullying, racism, purpose, and God's love.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/20"
          >
            Book a Visit <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-cream/20 hover:border-cream/50 text-cream font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </section>
  );
}