import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import {
  ASSEMBLY_PRICE,
  FAMILY_NIGHT_PRICE,
  LEADERSHIP_PRICE,
  PACKAGES as PRICING_PACKAGES,
  STAFF_PD_PRICE,
  WORKSHOP_ADDITIONAL,
  WORKSHOP_RATE,
  WORKSHOP_THREE_PLUS,
  formatUSD,
} from '@/data/programPricing';

// Every number here comes from src/data/programPricing.js so the published rate
// sheet and the booking wizard's calculator can never disagree.
const RATES = [
  {
    name: 'Whole School Assembly',
    price: formatUSD(ASSEMBLY_PRICE),
    note: '45 minutes. Includes up to two back-to-back sessions the same day and a wristband for every student.',
  },
  {
    name: 'The 10 Second Lab',
    price: formatUSD(WORKSHOP_RATE),
    unit: 'per grade level',
    note: `30 to 45 minutes depending on the age group, priced per grade level. Three grade levels in one visit: ${formatUSD(WORKSHOP_THREE_PLUS)}, then ${formatUSD(WORKSHOP_ADDITIONAL)} for each grade level after that.`,
  },
  {
    name: 'Group Chat Check',
    price: formatUSD(WORKSHOP_RATE),
    unit: 'per grade level',
    note: `45 minutes, priced per grade level. Grades 4 and up; K to 3 run Words Stick instead at the same rate. Three grade levels in one visit: ${formatUSD(WORKSHOP_THREE_PLUS)}, then ${formatUSD(WORKSHOP_ADDITIONAL)} for each grade level after that.`,
  },
  {
    name: 'Student Ambassadors',
    price: formatUSD(LEADERSHIP_PRICE),
    unit: 'per semester',
    note: 'One semester. Full training day for 15 to 20 students plus monthly 30 minute check-ins.',
  },
  {
    name: 'Staff Professional Development',
    price: formatUSD(STAFF_PD_PRICE),
    note: '60 minutes for teachers, paraprofessionals, and support staff. Can run on an existing PD day.',
  },
  {
    name: 'Family Night',
    price: formatUSD(FAMILY_NIGHT_PRICE),
    note: '60 minute evening event, open to the school community.',
  },
];

const PACKAGES = Object.values(PRICING_PACKAGES).map((p) => ({
  name: p.name,
  price: formatUSD(p.price),
  highlight: Boolean(p.highlight),
  badge: p.badge,
  description: p.description,
  features: p.features,
}));

export default function PricingTiers() {
  const [ref, inView] = useInView({ threshold: 0.05 });

  const scrollToBooking = () => {
    const el = document.getElementById('booking-form');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" ref={ref} className="py-24 px-6 bg-black/20 scroll-mt-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-3">Pricing</p>
          <h2 className="font-anton text-cream text-4xl sm:text-5xl tracking-wide mb-4">2026 TO 2027 RATE SHEET</h2>
          <p className="font-barlow text-cream/50 max-w-2xl mx-auto leading-relaxed">
            Flat rates whatever your enrollment. No travel or setup charges anywhere in metro Detroit.
            Every option includes the pre and post student survey and your summary report.
          </p>
        </motion.div>

        {/* Line-item rates */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="border border-cream/10 rounded-sm overflow-hidden mb-14"
        >
          <div className="hidden sm:flex items-center justify-between px-6 py-3 bg-white/[0.04] border-b border-cream/10">
            <span className="font-barlow-condensed text-cream/40 text-xs tracking-[0.3em] uppercase">Program</span>
            <span className="font-barlow-condensed text-cream/40 text-xs tracking-[0.3em] uppercase">Rate</span>
          </div>
          {RATES.map((rate, i) => (
            <div
              key={rate.name}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-8 px-6 py-5 ${
                i < RATES.length - 1 ? 'border-b border-cream/[0.06]' : ''
              } bg-white/[0.02] hover:bg-white/[0.04] transition-colors`}
            >
              <div className="flex-1">
                <p className="font-barlow-condensed text-cream text-xl font-semibold tracking-wide">{rate.name}</p>
                <p className="font-barlow text-cream/50 text-sm leading-relaxed mt-1">{rate.note}</p>
              </div>
              <div className="flex items-baseline gap-2 sm:justify-end shrink-0">
                <span className="font-anton text-gold text-3xl leading-none">{rate.price}</span>
                {rate.unit && <span className="font-barlow text-cream/40 text-xs uppercase tracking-wider">{rate.unit}</span>}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Packages */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase text-center mb-8"
        >
          Packages
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {PACKAGES.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.12 }}
              className={`relative flex flex-col rounded-sm border p-8 transition-all ${
                tier.highlight
                  ? 'bg-gold/10 border-gold/40 shadow-xl shadow-gold/10'
                  : 'bg-white/[0.03] border-cream/10 hover:border-cream/20'
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1 bg-gold text-ink text-xs font-barlow-condensed font-bold px-3 py-1 rounded-full uppercase tracking-wider whitespace-nowrap">
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

        {/* Funding + booking notes */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/[0.03] border border-cream/10 rounded-sm p-6 sm:p-8"
          >
            <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-3">Paying for it</p>
            <p className="font-barlow text-cream/65 text-base leading-relaxed">
              Bullying prevention programming, staff training, and family engagement events are commonly funded
              through Title I and Section 31a at-risk dollars rather than a building's general budget. Tell us
              which fund you are working from and we will format the invoice to match. Sponsor underwriting is
              available where the money is not there. We are backed by local businesses across the region.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.58 }}
            className="bg-gold/10 border border-gold/30 rounded-sm p-6 sm:p-8"
          >
            <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-3">Booking</p>
            <p className="font-barlow text-cream/70 text-base leading-relaxed mb-4">
              Dates fill first for September, October, and May. A signed agreement and a purchase order hold
              your date. Schools can start with the assembly alone and add pieces later.
            </p>
            <button
              onClick={scrollToBooking}
              className="font-barlow-condensed text-gold hover:text-gold-dark text-sm uppercase tracking-wider transition-colors"
            >
              Request dates &rarr;
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}