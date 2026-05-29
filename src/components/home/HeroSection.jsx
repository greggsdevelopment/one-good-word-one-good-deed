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

      {/* Radial gold glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(230,180,80,0.15) 0%, rgba(230,180,80,0.05) 40%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-8"
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt="One Good Word One Good Deed"
              className="w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 mx-auto rounded-full object-cover shadow-2xl shadow-gold/20"
            />
          )}
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-barlow-condensed text-gold text-xs sm:text-sm tracking-[0.3em] uppercase mb-4"
        >
          A Movement of Love Over Hate
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-anton text-cream text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight mb-6"
        >
          STAND UP.<br />SPEAK LOVE.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-barlow text-cream/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
        >
          One Good Word...One Good Deed was created to stand up against bullying and racism through God's love. It starts with one word. It grows with one deed.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
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
          transition={{ duration: 0.8, delay: 1.2 }}
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