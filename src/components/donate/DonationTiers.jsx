import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { base44 } from '@/api/base44Client';
import { Loader2, RefreshCw, Zap } from 'lucide-react';

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
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(null);
  const [frequency, setFrequency] = useState('one-time'); // 'one-time' | 'monthly'

  const handleDonate = async (amount) => {
    if (window.self !== window.top) {
      alert('Donations are only available from the published app. Please open the app in a new tab.');
      return;
    }
    setLoading(amount);
    const label = frequency === 'monthly' ? 'Monthly Donation' : 'Donation';
    const res = await base44.functions.invoke('createCheckout', {
      items: [{ name: `${label} — One Good Word One Good Deed`, price: Math.round(amount * 100), quantity: 1, image: '' }],
      successUrl: `${window.location.origin}/donate?success=true&amount=${amount}`,
      cancelUrl: `${window.location.origin}/donate`,
    });
    setLoading(null);
    if (res.data?.url) window.location.href = res.data.url;
  };

  const handleCustom = () => {
    const val = parseFloat(customAmount);
    if (!val || val < 1) return;
    handleDonate(val);
  };

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
          className="font-barlow text-ink/50 text-center text-lg max-w-xl mx-auto mb-8"
        >
          Every amount matters. Pick the level that works for you.
        </motion.p>

        {/* One-time / Monthly toggle */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center mb-12"
        >
          <div className="flex bg-ink/8 border border-ink/15 rounded-sm p-1 gap-1">
            <button
              onClick={() => setFrequency('one-time')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-sm font-barlow-condensed text-sm uppercase tracking-wider transition-all ${
                frequency === 'one-time'
                  ? 'bg-ink text-cream shadow-sm'
                  : 'text-ink/50 hover:text-ink/70'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> One-Time
            </button>
            <button
              onClick={() => setFrequency('monthly')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-sm font-barlow-condensed text-sm uppercase tracking-wider transition-all ${
                frequency === 'monthly'
                  ? 'bg-gold text-ink shadow-sm font-bold'
                  : 'text-ink/50 hover:text-ink/70'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Monthly
            </button>
          </div>
        </motion.div>

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
                {frequency === 'monthly' && <span className="font-barlow text-lg">/mo</span>}
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
              <button
                onClick={() => handleDonate(tier.amount)}
                disabled={loading === tier.amount}
                className={`w-full py-3 font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60 ${
                  tier.featured
                    ? 'bg-gold hover:bg-gold-dark text-ink hover:shadow-lg hover:shadow-gold/20'
                    : 'bg-ink hover:bg-ink/80 text-cream'
                }`}
              >
                {loading === tier.amount ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {frequency === 'monthly' ? `Give $${tier.amount}/mo` : `Donate $${tier.amount}`}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Custom amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="bg-ink rounded-sm border border-white/[0.07] p-8 max-w-md mx-auto text-center"
        >
          <h3 className="font-anton text-cream text-2xl mb-2">Give Your Own Amount</h3>
          <p className="font-barlow text-cream/50 text-sm mb-6">
            Any amount makes a difference.{frequency === 'monthly' && ' Billed monthly.'}
          </p>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40 font-barlow text-lg">$</span>
              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-white/[0.05] border border-white/[0.1] rounded-sm text-cream font-barlow focus:outline-none focus:border-gold/40 transition-colors"
              />
            </div>
            <button
              onClick={handleCustom}
              disabled={!customAmount || parseFloat(customAmount) < 1 || loading === parseFloat(customAmount)}
              className="px-6 py-3 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all disabled:opacity-40 flex items-center gap-2"
            >
              {loading && loading === parseFloat(customAmount) ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Give
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}