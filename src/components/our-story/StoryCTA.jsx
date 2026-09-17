import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

export default function StoryCTA() {
  const [ref, inView] = useInView(0.2);

  return (
    <section className="relative bg-ink py-28 px-6 overflow-hidden" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(230,180,80,0.10) 0%, rgba(11,11,13,0) 60%)' }}
      />
      <div className="relative max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-px bg-gold mx-auto mb-8"
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-cream/80 text-2xl md:text-3xl italic mb-10"
          style={SERIF}
        >
          This is still the beginning.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <Link
            to="/pledge-wall"
            className="inline-block bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-base uppercase tracking-[0.2em] px-10 py-4 rounded-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/25"
          >
            Sign The Pledge
          </Link>
        </motion.div>
      </div>
    </section>
  );
}