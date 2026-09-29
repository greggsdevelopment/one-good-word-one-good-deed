import { motion } from 'framer-motion';
import { Backpack, HeartHandshake } from 'lucide-react';

export default function DonateHero({ itemsOpen, moneyOpen }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
          Kids get picked on for what they do not have. A backpack, a warm coat, a clean shirt, supplies on the
          first day. Give the things families need, or give money that keeps the program in schools.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-barlow text-cream/35 text-base max-w-xl mx-auto mb-10"
        >
          "If we can change how one child thinks about another child, we can change a generation."
          <br /><span className="text-gold/60 text-sm">- Jason Lewis</span>
        </motion.p>

        {(itemsOpen || moneyOpen) && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {itemsOpen && (
              <button
                type="button"
                onClick={() => scrollTo('give-items')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
              >
                <Backpack className="w-5 h-5" /> Donate Items
              </button>
            )}
            {moneyOpen && (
              <button
                type="button"
                onClick={() => scrollTo('give-money')}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 ${
                  itemsOpen
                    ? 'border border-gold/40 text-gold hover:bg-gold/10'
                    : 'bg-gold hover:bg-gold-dark text-ink hover:shadow-lg hover:shadow-gold/20'
                }`}
              >
                <HeartHandshake className="w-5 h-5" /> Give Money
              </button>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
