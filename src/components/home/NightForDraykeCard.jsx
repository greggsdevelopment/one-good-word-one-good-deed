import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Sparkles } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

const HIGHLIGHTS = [
  'Costumes encouraged',
  'Trick or treat bags',
  'Games',
  'Prizes',
  'Community giveaways',
];

function GoldDiamond() {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="h-px w-12 bg-gold/30" />
      <span className="block rotate-45 w-2 h-2 bg-gold" />
      <span className="h-px w-12 bg-gold/30" />
    </div>
  );
}

export default function NightForDraykeCard() {
  const [ref, inView] = useInView(0.15);

  return (
    <section ref={ref} className="relative bg-ink px-6 py-16 md:py-20">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative rounded-sm border border-gold/30 p-8 sm:p-12 overflow-hidden"
        >
          {/* subtle gold glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(230,180,80,0.10) 0%, rgba(11,11,13,0) 60%)' }}
          />

          <div className="relative z-10 text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-5"
            >
              In Loving Memory of Drayke Andrew Hardman
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="text-cream text-4xl sm:text-5xl md:text-6xl leading-[0.95] mb-6"
              style={SERIF}
            >
              A Night For Drayke
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mb-6"
            >
              <GoldDiamond />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.34 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 text-cream/80"
            >
              <span className="flex items-center gap-2">
                <Calendar className="text-gold" size={16} strokeWidth={1.5} />
                <span style={SERIF} className="text-lg">Friday, October 30, 2026</span>
              </span>
              <span className="hidden sm:block w-px h-4 bg-gold/30" />
              <span className="flex items-center gap-2">
                <MapPin className="text-gold" size={16} strokeWidth={1.5} />
                <span style={SERIF} className="text-lg">Location and time to be announced</span>
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.42 }}
              className="text-cream/75 text-lg leading-relaxed max-w-2xl mx-auto mb-6"
              style={SERIF}
            >
              Join us for Drayke's story told by Cody and Jason, an evening of community,
              remembrance, and family fun.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-6"
            >
              {HIGHLIGHTS.map((h) => (
                <li
                  key={h}
                  className="flex items-center gap-2 font-barlow-condensed text-cream/70 text-sm tracking-wide uppercase"
                >
                  <Sparkles className="text-gold" size={13} strokeWidth={1.5} />
                  {h}
                </li>
              ))}
            </motion.ul>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.56 }}
              className="font-barlow-condensed text-cream/60 text-sm tracking-[0.2em] uppercase mb-8"
            >
              Free to attend, all families welcome
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.62 }}
            >
              <Link
                to="/rsvp/night-for-drayke"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-ink font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/25"
              >
                RSVP for A Night For Drayke
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}