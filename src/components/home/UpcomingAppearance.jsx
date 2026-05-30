import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export default function UpcomingAppearance() {
  const [ref, inView] = useInView(0.15);

  return (
    <section ref={ref} className="py-16 px-6 bg-ink">
      <div className="max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-6 text-center"
        >
          Upcoming Appearance
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative border border-gold/30 bg-gradient-to-br from-gold/5 to-transparent rounded-sm p-8 sm:p-10 overflow-hidden"
        >
          {/* Corner accent */}
          <div className="absolute top-0 left-0 w-1 h-full bg-gold" />
          <div className="absolute top-0 left-0 w-24 h-1 bg-gold" />

          <div className="pl-4">
            <span className="inline-block font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase bg-gold/10 border border-gold/20 px-3 py-1 rounded-full mb-5">
              Next School Visit
            </span>

            <h2 className="font-anton text-cream text-3xl sm:text-4xl tracking-wide mb-4">
              DETROIT LEADERSHIP ACADEMY
            </h2>

            <div className="flex flex-wrap gap-5 mb-8">
              <div className="flex items-center gap-2 text-cream/60 font-barlow text-sm">
                <Calendar className="w-4 h-4 text-gold shrink-0" />
                June 15, 2026
              </div>
              <div className="flex items-center gap-2 text-cream/60 font-barlow text-sm">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                Detroit, MI
              </div>
            </div>

            <Link
              to="/programs"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
            >
              Book Your School
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}