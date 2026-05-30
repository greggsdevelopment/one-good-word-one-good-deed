import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const TIERS = [
  {
    name: 'School Assembly',
    price: '$500',
    highlight: false,
    description: 'A powerful, high-energy keynote that leaves students inspired to choose kindness.',
    features: [
      'Up to 300 students',
      '60-minute keynote address',
      'Live Q&A with Jason',
      'Digital resource pack for students',
      'Post-visit follow-up email',
    ],
  },
  {
    name: 'Half-Day Workshop',
    price: '$1,200',
    highlight: true,
    badge: 'Most Popular',
    description: 'A deeper dive with interactive activities and small-group sessions.',
    features: [
      'Up to 150 students',
      '3-hour immersive session',
      'Interactive group activities',
      'Anti-bullying curriculum materials',
      'Follow-up resource toolkit',
      'Teacher debrief included',
    ],
  },
  {
    name: 'Full Partnership',
    price: '$3,500',
    period: '/ semester',
    highlight: false,
    description: 'Full school integration — ongoing presence, training, and curriculum alignment.',
    features: [
      'Unlimited school visits',
      'Curriculum integration support',
      'Teacher & staff training session',
      'Monthly check-in calls',
      'Custom messaging for your school',
      'Priority scheduling',
    ],
  },
];

export default function PricingTiers() {
  const [ref, inView] = useInView({ threshold: 0.1 });

  const scrollToBooking = () => {
    const el = document.getElementById('booking-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="py-24 px-6 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-3">Investment in Your Students</p>
          <h2 className="font-anton text-cream text-4xl sm:text-5xl tracking-wide mb-4">PROGRAM PACKAGES</h2>
          <p className="font-barlow text-cream/40 max-w-xl mx-auto">
            Every package is tailored to your school's needs. Title I schools may qualify for fee waivers — just ask.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className={`relative flex flex-col rounded-sm border p-8 transition-all ${
                tier.highlight
                  ? 'bg-gold/10 border-gold/40 shadow-xl shadow-gold/10'
                  : 'bg-white/[0.03] border-cream/10 hover:border-cream/20'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 bg-gold text-ink text-xs font-barlow-condensed font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-ink" /> {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <p className={`font-barlow-condensed text-xs tracking-[0.3em] uppercase mb-2 ${tier.highlight ? 'text-gold' : 'text-cream/40'}`}>
                  {tier.name}
                </p>
                <div className="flex items-end gap-1 mb-3">
                  <span className="font-anton text-cream text-5xl leading-none">{tier.price}</span>
                  {tier.period && <span className="font-barlow text-cream/40 text-sm pb-1">{tier.period}</span>}
                </div>
                <p className="font-barlow text-cream/50 text-sm leading-relaxed">{tier.description}</p>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlight ? 'text-gold' : 'text-cream/40'}`} />
                    <span className="font-barlow text-cream/70 text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToBooking}
                className={`w-full py-3.5 font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all hover:-translate-y-0.5 ${
                  tier.highlight
                    ? 'bg-gold hover:bg-gold-dark text-ink shadow-lg shadow-gold/20'
                    : 'bg-gold/15 hover:bg-gold/25 text-gold border border-gold/30'
                }`}
              >
                Book Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}