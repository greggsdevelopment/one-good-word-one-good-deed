import { motion } from 'framer-motion';

export default function HeroSection({ logoUrl, pledgeCount }) {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-ink overflow-hidden">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Wide ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(230,180,80,0.10) 0%, rgba(230,180,80,0.04) 45%, transparent 72%)',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-barlow-condensed text-gold text-xs sm:text-sm tracking-[0.35em] uppercase mb-8"
        >
          A Movement of Love Over Hate
        </motion.p>

        {/* Logo with float + gold glow beneath */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
          className="relative flex items-center justify-center mb-10"
        >
          {/* Gold light pool beneath the logo */}
          <div
            className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 w-48 sm:w-64 md:w-80 h-12 rounded-full pointer-events-none blur-2xl"
            style={{
              background: 'radial-gradient(ellipse, rgba(230,180,80,0.55) 0%, rgba(201,146,47,0.25) 50%, transparent 80%)',
            }}
          />

          {/* Soft halo ring around logo */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(230,180,80,0.18) 30%, transparent 72%)',
              transform: 'scale(1.35)',
            }}
          />

          {/* Floating logo */}
          <motion.img
            src={logoUrl}
            alt="One Good Word One Good Deed"
            className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 object-contain drop-shadow-2xl"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-anton text-cream text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight mb-6"
        >
          STAND UP.<br />SPEAK LOVE.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="font-barlow text-cream/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
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
            className="px-8 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/25 w-full sm:w-auto"
          >
            Take the Pledge
          </button>
          <a
            href="https://facebook.com/groups/PLACEHOLDER"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border-2 border-cream/30 hover:border-gold text-cream hover:text-gold font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto text-center"
          >
            Join the Movement
          </a>
        </motion.div>

        {/* Pledge count line */}
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
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink to-transparent pointer-events-none" />
    </section>
  );
}