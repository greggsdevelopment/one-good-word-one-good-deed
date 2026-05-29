import { motion } from 'framer-motion';

export default function HeroSection({ logoUrl, pledgeCount }) {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-ink overflow-hidden">
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
            className="absolute rounded-full pointer-events-none w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px]"
            style={{
              background: 'radial-gradient(circle, rgba(230,180,80,0.22) 0%, rgba(230,180,80,0.06) 55%, transparent 75%)',
            }}
          />

          {/* Floating logo */}
          <motion.img
            src={logoUrl}
            alt="One Good Word One Good Deed"
            className="relative w-44 h-44 sm:w-60 sm:h-60 md:w-80 md:h-80 object-contain"
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
            href="https://facebook.com/groups/PLACEHOLDER"
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 border-2 border-cream/40 hover:border-gold text-cream hover:text-gold font-barlow-condensed font-bold text-xl uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto text-center min-h-[56px] flex items-center justify-center"
          >
            Join the Movement
          </a>
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