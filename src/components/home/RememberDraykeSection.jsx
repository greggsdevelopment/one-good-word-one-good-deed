import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sunrise, Sunset } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { HERO_PHOTO } from '@/components/drayke/draykePhotos';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };
const SCRIPT = { fontFamily: "'Great Vibes', cursive" };

export default function RememberDraykeSection() {
  const [ref, inView] = useInView(0.2);

  return (
    <section className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden border-y border-gold/15" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(230,180,80,0.08) 0%, rgba(11,11,13,0) 55%)' }}
      />

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Framed photo */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="p-2 border border-gold/30 rounded-sm">
            <img
              src={HERO_PHOTO}
              alt="Drayke shading his eyes and smiling, 2021"
              className="w-full rounded-sm border border-gold/40"
            />
          </div>
          <span className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-gold" aria-hidden="true" />
          <span className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-gold" aria-hidden="true" />
        </motion.div>

        {/* Text */}
        <div className="text-center md:text-left">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gold text-4xl md:text-5xl mb-2"
            style={SCRIPT}
          >
            Remember
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-anton text-white text-5xl md:text-6xl tracking-wide mb-6"
          >
            DRAYKE
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex items-center justify-center md:justify-start gap-6 text-cream/85 mb-6"
          >
            <span className="flex items-center gap-2">
              <Sunrise className="text-gold" size={18} strokeWidth={1.5} />
              <span style={SERIF} className="text-lg">May 26, 2009</span>
            </span>
            <span className="w-px h-5 bg-gold/30" aria-hidden="true" />
            <span className="flex items-center gap-2">
              <Sunset className="text-gold" size={18} strokeWidth={1.5} />
              <span style={SERIF} className="text-lg">February 10, 2022</span>
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="text-cream/80 text-lg md:text-xl leading-relaxed mb-8"
            style={SERIF}
          >
            Drayke was twelve years old when nearly a year of bullying took him from a family
            that adored him. His story is the reason this movement walks into schools, and the
            reason we will never stop. Come meet the boy behind our why.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Link
              to="/drayke"
              className="inline-block bg-gold hover:bg-gold-dark text-ink font-bold text-sm uppercase tracking-wider px-8 py-3.5 rounded transition-colors"
            >
              Visit Drayke&rsquo;s Memorial
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}