import { motion } from 'framer-motion';

const PILLS = ['Grades K to 12', 'Assembly', 'Workshops', 'Student Leaders', 'Staff Training', 'Family Night'];

export default function ProgramsHero() {
  const scrollTo = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-ink min-h-[70vh] flex items-center justify-center px-6 py-32 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-6"
        >
          School Program Guide
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-anton text-cream text-6xl sm:text-8xl md:text-9xl leading-[0.9] mb-8"
        >
          KINDNESS<br />
          <span className="text-gold">IS A SKILL.</span><br />
          WE TEACH IT.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="font-barlow text-cream/60 text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          A bullying and racism prevention program for Michigan public schools, elementary through high
          school. Five steps across one school year, built to move students from watching to acting.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {PILLS.map((pill) => (
            <span
              key={pill}
              className="px-4 py-1.5 border border-cream/20 rounded-full font-barlow-condensed text-cream/70 text-sm tracking-wider uppercase"
            >
              {pill}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => scrollTo('#booking-form')}
            className="px-10 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
          >
            Book a Program
          </button>
          <a
            href="#the-program"
            onClick={(e) => { e.preventDefault(); scrollTo('#the-program'); }}
            className="px-10 py-4 border-2 border-cream/20 hover:border-gold/40 text-cream/70 hover:text-gold font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300"
          >
            See the Five Steps
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink to-transparent pointer-events-none" />
    </section>
  );
}