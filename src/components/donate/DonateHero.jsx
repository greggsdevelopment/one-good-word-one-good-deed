import { motion } from 'framer-motion';

const GOFUNDME_URL = 'https://www.gofundme.com/f/support-one-good-word-one-good-deeds-mission';

export default function DonateHero() {
  return (
    <section className="relative bg-ink pt-28 pb-20 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
      </div>
      <div className="grain-overlay" />
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4"
        >
          Support the Movement
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-anton text-cream text-6xl sm:text-8xl leading-[0.9] mb-6"
        >
          YOUR GIFT<br />
          <span className="text-gold">CHANGES</span><br />
          A KID'S LIFE.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-barlow text-cream/60 text-lg max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          Every dollar you give helps Jason reach more students — putting wristbands on more wrists, 
          funding more school visits, and spreading the message that one good word really does change everything.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-barlow text-cream/35 text-base max-w-xl mx-auto mb-10"
        >
          "If we can change how one child thinks about another child, we can change a generation."
          <br /><span className="text-gold/60 text-sm">— Jason Lewis</span>
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          href={GOFUNDME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
        >
          Make a Donation
        </motion.a>
      </div>
    </section>
  );
}