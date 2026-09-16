import { motion } from 'framer-motion';
import { Sunrise, Sunset, ChevronDown } from 'lucide-react';
import { HERO_PHOTO } from './draykePhotos';

const SCRIPT = { fontFamily: "'Great Vibes', cursive" };
const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

function FloatingButterfly({ delay = 0, left = '10%', size = 22, duration = 14 }) {
  return (
    <motion.div
      className="absolute pointer-events-none text-gold/40"
      style={{ left, bottom: '-5%' }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: '-110vh',
        x: [0, 30, -20, 25, 0],
        opacity: [0, 0.8, 0.8, 0.5, 0],
        rotate: [0, 12, -10, 8, 0],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 5c-1.5-3-5.5-4-7.5-2S3 8.5 6 10c-3 1.5-3.5 5-1.5 7s6 1 7.5-2c1.5 3 5.5 4 7.5 2s1.5-5.5-1.5-7c3-1.5 3.5-5 1.5-7s-6-1-7.5 2z" opacity="0.55" />
        <path d="M12 4.5v15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
}

export default function DraykeHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink">
      {/* Background photo, softly veiled */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_PHOTO})`, filter: 'grayscale(35%)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/95 via-ink/80 to-ink" />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 42%, rgba(230,180,80,0.14) 0%, rgba(11,11,13,0) 55%)' }}
      />

      {/* Drifting butterflies */}
      <FloatingButterfly delay={0} left="8%" size={20} duration={16} />
      <FloatingButterfly delay={4} left="22%" size={14} duration={19} />
      <FloatingButterfly delay={9} left="72%" size={18} duration={17} />
      <FloatingButterfly delay={2} left="88%" size={13} duration={21} />
      <FloatingButterfly delay={12} left="48%" size={16} duration={18} />

      <div className="relative z-10 text-center px-6 py-32 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
          className="text-gold text-5xl sm:text-6xl md:text-7xl mb-2"
          style={SCRIPT}
        >
          Remember
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-anton text-white text-5xl sm:text-6xl md:text-8xl tracking-wide leading-none mb-6"
        >
          DRAYKE
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="text-cream/90 text-xl md:text-2xl italic mb-10"
          style={SERIF}
        >
          Drayke Andrew Hardman
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="w-24 h-px bg-gold/70 mx-auto mb-10"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14 mb-12"
        >
          <div className="flex items-center gap-3 text-cream">
            <Sunrise className="text-gold" size={26} strokeWidth={1.5} />
            <div className="text-left">
              <p className="font-barlow-condensed text-gold text-[11px] tracking-[0.35em] uppercase">Sunrise</p>
              <p className="text-lg md:text-xl" style={SERIF}>May 26, 2009</p>
            </div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-gold/30" />
          <div className="flex items-center gap-3 text-cream">
            <Sunset className="text-gold" size={26} strokeWidth={1.5} />
            <div className="text-left">
              <p className="font-barlow-condensed text-gold text-[11px] tracking-[0.35em] uppercase">Sunset</p>
              <p className="text-lg md:text-xl" style={SERIF}>February 10, 2022</p>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.7 }}
          className="text-cream/80 text-lg md:text-xl tracking-wide"
          style={SERIF}
        >
          Forever twelve. Forever loved. Forever the reason we fight.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 2.2, duration: 1 }, y: { repeat: Infinity, duration: 2 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold/70"
        aria-hidden="true"
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  );
}