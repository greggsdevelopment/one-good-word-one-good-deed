import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Check } from 'lucide-react';

const TIERS = [
  {
    name: 'Assembly',
    tagline: 'Full School Impact',
    price: 'Contact for Pricing',
    highlight: false,
    features: [
      '30–60 minute assembly',
      'Up to entire school population',
      'Wristbands for all students',
      'Q&A session included',
      'Photo opportunities',
      'Take-home pledge cards',
    ],
    cta: 'Book Assembly',
  },
  {
    name: 'Classroom',
    tagline: 'Deep Engagement',
    price: 'Contact for Pricing',
    highlight: true,
    badge: 'Most Popular',
    features: [
      '30-minute classroom sessions',
      'Up to 3 classrooms per visit',
      'Interactive discussion format',
      'Wristbands for all students',
      'Reflection worksheets',
      'Follow-up resources for teachers',
    ],
    cta: 'Book Classroom Visit',
  },
  {
    name: 'Full Day',
    tagline: 'Complete Transformation',
    price: 'Contact for Pricing',
    highlight: false,
    features: [
      'Morning assembly + afternoon workshops',
      'Student leader workshop included',
      'Staff training session',
      'Wristbands + merch bundle',
      'Custom program curriculum',
      'Ongoing support resources',
    ],
    cta: 'Book Full Day',
  },
];

export default function PricingTiers() {
  const [ref, inView] = useInView(0.1);

  const scrollToForm = () => {
    document.querySelector('#booking-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative bg-cream py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="w-16 h-1 bg-gold-dark mb-10 mx-auto origin-center"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="font-barlow-condensed text-gold-dark text-xs tracking-[0.35em] uppercase mb-4"
          >
            Programs &amp; Pricing
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-anton text-ink text-5xl sm:text-6xl leading-[0.92] mb-6"
          >
            FIND THE RIGHT<br />FIT FOR YOUR SCHOOL.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="font-barlow text-ink/60 text-lg max-w-xl mx-auto"
          >
            Every school is different. Jason works with you to create the right program 
            at the right budget. Reach out to get a custom quote.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              className={`relative rounded-sm p-8 flex flex-col ${
                tier.highlight
                  ? 'bg-ink border-2 border-gold/50 shadow-xl shadow-gold/10'
                  : 'bg-white border border-ink/10'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-ink font-barlow-condensed font-bold text-xs uppercase tracking-wider rounded-full">
                  {tier.badge}
                </div>
              )}

              <p className={`font-barlow-condensed text-xs tracking-[0.25em] uppercase mb-2 ${tier.highlight ? 'text-gold/70' : 'text-ink/40'}`}>
                {tier.tagline}
              </p>
              <h3 className={`font-anton text-4xl mb-2 ${tier.highlight ? 'text-cream' : 'text-ink'}`}>
                {tier.name}
              </h3>
              <p className={`font-barlow-condensed text-lg font-bold uppercase tracking-wide mb-8 ${tier.highlight ? 'text-gold' : 'text-gold-dark'}`}>
                {tier.price}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${tier.highlight ? 'text-gold' : 'text-gold-dark'}`} />
                    <span className={`font-barlow text-sm leading-snug ${tier.highlight ? 'text-cream/70' : 'text-ink/70'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToForm}
                className={`w-full py-3.5 font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 ${
                  tier.highlight
                    ? 'bg-gold hover:bg-gold-dark text-ink hover:shadow-lg hover:shadow-gold/20'
                    : 'bg-ink hover:bg-ink/85 text-cream'
                }`}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center font-barlow text-ink/40 text-sm mt-8"
        >
          Non-profit and Title I school discounts available. Jason never turns a school away due to budget.
        </motion.p>
      </div>
    </section>
  );
}