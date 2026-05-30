import { motion } from 'framer-motion';
import { Heart, Phone } from 'lucide-react';

export default function ResourcesHero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 rounded-full mb-6"
        >
          <Heart className="w-4 h-4 text-gold" />
          <span className="font-barlow-condensed text-gold text-sm tracking-widest uppercase">You Are Not Alone</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-anton text-cream text-5xl sm:text-6xl lg:text-7xl leading-tight tracking-wide mb-6"
        >
          TEEN RESOURCE <span className="text-gold">MAP</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-barlow text-cream/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8"
        >
          Whether you're in crisis, struggling, or just need someone to talk to — these resources are here for you. 
          Real help. Real people. Right now.
        </motion.p>

        {/* Emergency banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="inline-flex items-center gap-3 bg-red-950/60 border border-red-500/40 rounded-sm px-6 py-4"
        >
          <Phone className="w-5 h-5 text-red-400 shrink-0" />
          <p className="font-barlow-condensed text-red-300 text-base tracking-wide">
            <span className="font-bold text-red-200">IN IMMEDIATE DANGER?</span> Call <a href="tel:911" className="underline hover:text-white transition-colors">911</a> or go to your nearest emergency room.
          </p>
        </motion.div>
      </div>
    </section>
  );
}