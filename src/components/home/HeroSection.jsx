import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SCRIPTURES = [
  {
    verse: '"I can do all things through Christ who strengthens me."',
    ref: 'Philippians 4:13',
  },
  {
    verse: '"Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven."',
    ref: 'Matthew 5:16 (KJV)',
  },
];

export default function HeroSection({ logoUrl, pledgeCount }) {
  const [scriptureIndex, setScriptureIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScriptureIndex(i => (i + 1) % SCRIPTURES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-ink overflow-hidden pt-16">
      {/* Grain overlay */}
      <div className="grain-overlay" style={{ opacity: 0.09 }} />

      {/* Wide ambient background glow — stronger */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(230,180,80,0.18) 0%, rgba(230,180,80,0.07) 40%, transparent 68%)',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-barlow-condensed text-gold text-[11px] sm:text-sm tracking-[0.4em] uppercase mb-6 sm:mb-8"
        >
          A Movement of Love Over Hate
        </motion.p>

        {/* Logo with float + strong gold glow beneath */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: 'easeOut' }}
          className="relative flex items-center justify-center mb-8 sm:mb-10"
        >
          {/* Strong gold pool beneath */}
          <div
            className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-52 sm:w-72 md:w-96 h-14 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(230,180,80,0.70) 0%, rgba(201,146,47,0.35) 50%, transparent 80%)',
              filter: 'blur(18px)',
            }}
          />
          {/* Outer halo */}
          <div
            className="absolute rounded-full pointer-events-none w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px]"
            style={{
              background: 'radial-gradient(circle, rgba(230,180,80,0.22) 0%, rgba(230,180,80,0.06) 55%, transparent 75%)',
            }}
          />

          {/* Floating logo */}
           <motion.img
             src={logoUrl}
             alt="One Good Word One Good Deed"
             className="relative w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 object-cover rounded-full"
            style={{ filter: 'drop-shadow(0 0 32px rgba(230,180,80,0.30))' }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Headline — larger and bolder */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-anton text-white text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] leading-[0.88] tracking-tight mb-5"
          style={{ textShadow: '0 2px 40px rgba(0,0,0,0.8)' }}
        >
          STAND UP.<br />SPEAK LOVE.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="font-barlow text-cream/80 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
        >
          One Good Word...One Good Deed was created to stand up against bullying and racism through God's love. It starts with one word. It grows with one deed.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
        >
          <button
            onClick={() => scrollTo('#pledge')}
            className="px-10 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-xl uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/30 w-full sm:w-auto min-h-[56px]"
          >
            Take the Pledge
          </button>
          <a
            href="https://www.facebook.com/groups/1332878885346719"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 border-2 border-cream/40 hover:border-gold text-cream hover:text-gold font-barlow-condensed font-bold text-xl uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto text-center min-h-[56px] flex items-center justify-center"
          >
            Join the Movement
          </a>
        </motion.div>

        {/* Philippians 4:13 Flashcard */}
        <motion.div
          initial={{ opacity: 0, y: 24, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
          className="relative mx-auto mb-10 w-full max-w-sm"
          style={{ perspective: '800px' }}
        >
          {/* Golden glow pool beneath */}
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4/5 h-8 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(230,180,80,0.75) 0%, rgba(201,146,47,0.35) 55%, transparent 80%)',
              filter: 'blur(14px)',
            }}
          />
          {/* Card */}
          <motion.div
            animate={{ y: [0, -8, 0], rotateX: [0, 3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative rounded-sm border border-gold/30 bg-white/[0.04] backdrop-blur-sm px-7 py-6 text-center"
            style={{
              boxShadow: '0 0 30px rgba(230,180,80,0.18), inset 0 1px 0 rgba(230,180,80,0.15)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Top ornament */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 bg-gold/40" />
              <span className="text-gold text-lg">✦</span>
              <div className="h-px w-10 bg-gold/40" />
            </div>
            <p className="font-barlow-condensed text-gold text-[10px] tracking-[0.35em] uppercase mb-3">Scripture</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={scriptureIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                <p className="font-anton text-cream text-xl sm:text-2xl leading-tight mb-3">
                  {SCRIPTURES[scriptureIndex].verse}
                </p>
                <p className="font-barlow-condensed text-gold/70 text-sm tracking-widest uppercase">
                  {SCRIPTURES[scriptureIndex].ref}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Donation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.25 }}
          className="mt-6 mb-4"
        >
          <a
            href="https://www.gofundme.com/manage/support-one-good-word-one-good-deeds-mission"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-12 py-5 bg-gold hover:bg-gold-dark text-ink font-anton text-2xl sm:text-3xl uppercase tracking-widest rounded-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/40"
            style={{ boxShadow: '0 0 40px rgba(230,180,80,0.35), 0 8px 32px rgba(0,0,0,0.6)' }}
          >
            ❤️ Donate Now
          </a>
          <p className="font-barlow-condensed text-ash text-xs tracking-[0.3em] uppercase mt-3">Support the Mission on GoFundMe</p>
        </motion.div>

        {/* Pledge count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="font-barlow text-ash text-sm tracking-wide"
        >
          Join <span className="text-gold font-semibold">{pledgeCount.toLocaleString()}</span> people standing up.
        </motion.p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-ink to-transparent pointer-events-none" />
    </section>
  );
}