import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Footprints, Users, Heart, Handshake, Flame } from 'lucide-react';

const CARDS = [
  {
    icon: Footprints,
    color: '#f59e0b',
    title: 'Boots On The Ground',
    body: 'Out in the community every single day, meeting people where they are and doing the work that does not get filmed.',
  },
  {
    icon: Users,
    color: '#22c55e',
    title: 'Community Networking',
    body: 'Networks everywhere he goes and unapologetically spreads One Good Word, One Good Deed to anyone who will listen.',
  },
  {
    icon: Heart,
    color: '#ef4444',
    title: 'Speaking From The Heart',
    body: 'Tells his story straight, unfiltered and raw, because it means that much to him. No script, no polish, just the truth about why this matters.',
  },
  {
    icon: Handshake,
    color: '#3b82f6',
    title: 'Local Business Partnerships',
    body: 'Builds relationships with local businesses and turns conversations into the sponsorships that put this program in schools that cannot pay for it.',
  },
  {
    icon: Flame,
    color: '#f97316',
    title: 'The Spark That Lit The Flame',
    body: 'This started with him. Everything One Good Word, One Good Deed has become traces back to one father who refused to let it go.',
  },
];

export default function WhatIDoForOGWOGD() {
  const [ref, inView] = useInView(0.05);

  return (
    <section ref={ref} className="relative bg-ink/95 py-24 md:py-32 px-6 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="w-16 h-1 bg-gold mb-8 mx-auto origin-center"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4"
          >
            My Role
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-anton text-cream text-4xl sm:text-5xl leading-[0.95] mb-4"
          >
            WHAT I DO FOR OGWOGD
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            const isLast = i === CARDS.length - 1;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                className={`bg-white/[0.03] border border-white/[0.07] rounded-sm p-7 sm:p-8 hover:border-gold/20 transition-all duration-300 ${
                  isLast ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-sm bg-white/[0.04] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <h3 className="font-barlow-condensed font-bold text-cream text-xl uppercase tracking-wide">{card.title}</h3>
                </div>
                <p className="font-barlow text-cream/65 text-base leading-relaxed">{card.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}