import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

export default function OurStoryHero() {
  const [ref, inView] = useInView(0.2);

  return (
    <section className="relative bg-ink pt-36 pb-24 px-6 overflow-hidden" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(230,180,80,0.08) 0%, rgba(11,11,13,0) 60%)' }}
      />
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-6"
        >
          One Good Word, One Good Deed
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-cream text-5xl sm:text-6xl md:text-7xl mb-6 italic"
          style={SERIF}
        >
          Our Story
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-16 h-px bg-gold mx-auto mb-6"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-cream/70 text-xl md:text-2xl italic"
          style={SERIF}
        >
          How two fathers turned one conversation into a movement.
        </motion.p>
      </div>
    </section>
  );
}