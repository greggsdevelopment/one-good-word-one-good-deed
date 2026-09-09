import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Globe, Handshake, School, Megaphone } from 'lucide-react';

const CARDS = [
  {
    icon: Globe,
    color: '#3b82f6',
    title: 'The website and pledge wall',
    body: 'Built and maintained so every pledge is public and permanent.',
  },
  {
    icon: Handshake,
    color: '#22c55e',
    title: 'Sponsor program',
    body: 'Building the local business network that lets us put this in schools that cannot pay for it.',
  },
  {
    icon: School,
    color: '#f97316',
    title: 'School outreach',
    body: 'Getting the program in front of principals and counselors across Southeast Michigan.',
  },
  {
    icon: Megaphone,
    color: '#ef4444',
    title: 'Content and strategy',
    body: 'Making sure the message travels further than the truck can drive.',
  },
];

export default function WhatIDo() {
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
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-sm p-7 sm:p-8 hover:border-gold/20 transition-all duration-300"
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