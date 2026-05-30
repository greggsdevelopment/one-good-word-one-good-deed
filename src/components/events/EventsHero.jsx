import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export default function EventsHero() {
  return (
    <section className="relative pt-32 pb-16 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-gold" />
            <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase">What's Coming Up</p>
          </div>
          <h1 className="font-anton text-cream text-5xl sm:text-7xl tracking-wide mb-4">
            EVENTS &<br />GATHERINGS
          </h1>
          <p className="font-barlow text-cream/40 max-w-xl text-lg">
            Join us in the community — workshops, school visits, outreach events, and more. Everyone is welcome.
          </p>
        </motion.div>
      </div>
    </section>
  );
}