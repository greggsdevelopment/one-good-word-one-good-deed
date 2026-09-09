import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Mail, CalendarCheck } from 'lucide-react';

export default function BookingCTA() {
  const [ref, inView] = useInView(0.15);

  const scrollToContact = () => {
    window.location.href = '/#contact';
  };

  return (
    <section className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden" ref={ref}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gold/6 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
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
          className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4"
        >
          Book Jason
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-anton text-cream text-5xl sm:text-7xl leading-[0.92] mb-6"
        >
          BRING THE<br />
          <span className="text-gold">MOVEMENT</span><br />
          TO YOUR SCHOOL.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-barlow text-cream/60 text-lg max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          Jason is available for school assemblies, church events, community programs, 
          and leadership workshops. He brings an authentic, faith-driven message that 
          connects with students of all ages.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="font-barlow text-cream/40 text-base max-w-xl mx-auto mb-12"
        >
          Whether it's a 30-minute assembly or a full-day workshop — Jason will show up, 
          speak truth, and leave your students inspired to be the change.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={scrollToContact}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
          >
            <CalendarCheck className="w-5 h-5" />
            Book a School Visit
          </button>
          <a
            href="mailto:greggsdevelopment@gmail.com"
            className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-cream/20 hover:border-gold/50 text-cream/70 hover:text-gold font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
            Email Us Directly
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-10 pt-10 border-t border-white/[0.06] grid sm:grid-cols-3 gap-6 text-center"
        >
          {[
            { stat: 'K-12', label: 'All Grade Levels' },
            { stat: 'Faith-Based', label: 'God-Centered Message' },
            { stat: 'Free & Paid', label: 'Flexible Options' },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-anton text-gold text-2xl mb-1">{item.stat}</p>
              <p className="font-barlow-condensed text-cream/40 text-sm uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}