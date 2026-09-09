import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';

export default function CodyCTA() {
  const [ref, inView] = useInView(0.15);

  return (
    <section ref={ref} className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gold/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-anton text-cream text-4xl sm:text-6xl leading-[0.95] mb-10"
        >
          LET&apos;S KEEP<br />
          <span className="text-gold">BUILDING.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/contact"
            className="px-8 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
          >
            Bring OGWOGD to your school
          </Link>
          <Link
            to="/programs"
            className="px-8 py-4 border-2 border-cream/20 hover:border-gold/50 text-cream/70 hover:text-gold font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300"
          >
            See our programs
          </Link>
        </motion.div>

        <p className="font-barlow-condensed text-cream/40 text-xs tracking-widest uppercase mt-10">
          Cody Greggs-Dorsey &nbsp;|&nbsp; (734) 383-3865
        </p>
      </div>
    </section>
  );
}