import { motion } from 'framer-motion';

export default function AboutHero() {
  return (
    <section className="relative min-h-[60vh] flex items-end pb-20 pt-40 px-6 overflow-hidden bg-ink">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4"
        >
          About the Founder
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-anton text-cream text-6xl sm:text-8xl md:text-9xl leading-[0.9] mb-6"
        >
          JASON<br />
          <span className="text-gold">LEWIS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-barlow text-cream/60 text-xl max-w-2xl leading-relaxed"
        >
          Founder of One Good Word...One Good Deed LLC — a movement born from pain, 
          driven by faith, and dedicated to ending bullying and racism in schools and communities.
        </motion.p>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ink to-transparent" />
    </section>
  );
}