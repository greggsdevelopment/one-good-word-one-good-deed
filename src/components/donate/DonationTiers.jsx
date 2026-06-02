import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { ExternalLink, Zap, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const GOFUNDME_URL = 'https://www.gofundme.com/manage/support-one-good-word-one-good-deeds-mission';

const TIERS = [
  {
    name: 'Seed',
    amount: 10,
    emoji: '🌱',
    tagline: 'Put wristbands on 5 kids',
    impact: 'Wristbands for a classroom',
    description: 'Your $10 puts One Good Word wristbands on five students — a daily reminder to choose kindness.',
  },
  {
    name: 'Supporter',
    amount: 25,
    emoji: '📣',
    tagline: 'Sponsor one classroom presentation',
    impact: 'Printed materials for a school visit',
    description: "Your $25 sponsors a full classroom presentation, giving 30 students a powerful message they won't forget.",
    featured: true,
  },
  {
    name: 'Champion',
    amount: 100,
    emoji: '🏆',
    tagline: 'Bring the full program to a school',
    impact: 'Sponsors a full school assembly',
    description: 'Your $100 helps fund a full school assembly — reaching hundreds of students with Jason\'s life-changing message.',
  },
];

export default function DonationTiers() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="donation-tiers" className="relative bg-cream py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-anton text-ink text-4xl sm:text-5xl text-center mb-4"
        >
          CHOOSE YOUR IMPACT
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow text-ink/50 text-center text-lg max-w-xl mx-auto mb-12"
        >
          Every amount matters. Pick the level that works for you.
        </motion.p>

        {/* Tier cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`rounded-sm p-8 border text-center flex flex-col ${
                tier.featured
                  ? 'bg-ink border-gold/40 shadow-2xl shadow-black/10'
                  : 'bg-white border-ink/10'
              }`}
            >
              {tier.featured && (
                <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-3">Most Impactful</p>
              )}
              <div className="text-4xl mb-4">{tier.emoji}</div>
              <h3 className={`font-anton text-3xl mb-1 ${tier.featured ? 'text-cream' : 'text-ink'}`}>{tier.name}</h3>
              <p className={`font-anton text-5xl mb-1 ${tier.featured ? 'text-gold' : 'text-ink'}`}>
                ${tier.amount}
              </p>

              {/* Impact label */}
              <div className={`inline-flex items-center justify-center gap-1.5 text-xs font-barlow-condensed tracking-wide uppercase px-3 py-1.5 rounded-full mb-4 ${
                tier.featured ? 'bg-gold/15 text-gold' : 'bg-ink/8 text-ink/50'
              }`}>
                = {tier.impact}
              </div>

              <p className={`font-barlow-condensed text-sm tracking-wide uppercase mb-4 ${tier.featured ? 'text-gold/70' : 'text-ink/50'}`}>
                {tier.tagline}
              </p>
              <p className={`font-barlow text-sm leading-relaxed mb-8 flex-1 ${tier.featured ? 'text-cream/60' : 'text-ink/60'}`}>
                {tier.description}
              </p>
              <a
                href={GOFUNDME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3 font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 ${
                  tier.featured
                    ? 'bg-gold hover:bg-gold-dark text-ink hover:shadow-lg hover:shadow-gold/20'
                    : 'bg-ink hover:bg-ink/80 text-cream'
                }`}
              >
                Donate ${tier.amount} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Custom amount — redirect to GoFundMe */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="bg-ink rounded-sm border border-white/[0.07] p-8 max-w-md mx-auto text-center"
        >
          <h3 className="font-anton text-cream text-2xl mb-2">Give Your Own Amount</h3>
          <p className="font-barlow text-cream/50 text-sm mb-6">
            Any amount makes a difference. Donate directly on GoFundMe.
          </p>
          <a
            href={GOFUNDME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-3 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all hover:-translate-y-0.5"
          >
            Donate on GoFundMe <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}