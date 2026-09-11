import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Crown } from 'lucide-react';
import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import { useInView } from '@/hooks/useInView';
import { PUBLIC_SPONSORS } from '@/data/sponsors';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';

function SponsorCard({ sponsor, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.06 }}
    >
      <Link
        to={sponsor.to}
        className="hof-card group relative flex flex-col h-full bg-white/[0.03] border border-white/[0.08] rounded-sm p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-2xl hover:shadow-black/50"
      >
        {/* accent wash */}
        <div
          className="absolute -top-24 -right-24 w-56 h-56 rounded-full blur-[70px] opacity-15 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"
          style={{ background: sponsor.accent }}
        />
        {/* top accent rule */}
        <div
          className="absolute top-0 left-0 h-[3px] w-0 group-hover:w-full transition-all duration-500"
          style={{ background: sponsor.accent }}
        />

        <div className="relative z-10 flex items-start gap-4 mb-5">
          <div
            className="w-14 h-14 shrink-0 rounded-sm flex items-center justify-center border"
            style={{
              borderColor: `${sponsor.accent}55`,
              background: `linear-gradient(135deg, ${sponsor.accent}22 0%, transparent 100%)`,
            }}
          >
            <span className="font-anton text-xl leading-none" style={{ color: sponsor.accent }}>
              {sponsor.monogram}
            </span>
          </div>
          <div className="min-w-0">
            <p
              className="font-barlow-condensed text-[11px] tracking-[0.28em] uppercase mb-1.5"
              style={{ color: sponsor.accent }}
            >
              {sponsor.category}
            </p>
            <h3 className="font-anton text-cream text-2xl leading-tight tracking-wide">{sponsor.name}</h3>
          </div>
        </div>

        <p className="relative z-10 font-barlow text-cream/55 text-base leading-relaxed flex-1">
          {sponsor.blurb}
        </p>

        <div className="relative z-10 mt-6 pt-5 border-t border-white/[0.07] flex items-center justify-between gap-4">
          <span className="font-barlow-condensed text-cream/35 text-xs tracking-[0.2em] uppercase">
            {sponsor.location}
          </span>
          <span className="font-barlow-condensed text-gold text-xs tracking-[0.2em] uppercase flex items-center gap-1.5 group-hover:gap-3 transition-all duration-300">
            View
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function HallOfFame() {
  const [gridRef, gridInView] = useInView(0.02);

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[820px] h-[420px] bg-gold/10 rounded-full blur-[130px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-gold/30 bg-gold/10 mb-8"
            >
              <Crown className="w-7 h-7 text-gold" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-barlow-condensed text-gold text-xs tracking-[0.4em] uppercase mb-5"
            >
              The People Who Made It Possible
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-anton text-cream text-6xl sm:text-7xl md:text-8xl leading-[0.9] mb-7"
            >
              SPONSOR<br />
              <span className="text-gold">HALL OF FAME</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="font-barlow text-cream/60 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto"
            >
              Every assembly, every wristband, every school that could not have paid for this on its own.
              None of it happens without local businesses that decided these kids were worth it. Click any
              name to see who they are and what they do.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex items-center justify-center gap-4 mt-10"
            >
              <span className="h-px w-12 bg-gold/30" />
              <span className="font-anton text-gold text-4xl leading-none">{PUBLIC_SPONSORS.length}</span>
              <span className="font-barlow-condensed text-cream/45 text-xs tracking-[0.25em] uppercase text-left leading-tight">
                Businesses<br />Standing With Us
              </span>
              <span className="h-px w-12 bg-gold/30" />
            </motion.div>
          </div>
        </section>

        {/* Grid */}
        <section ref={gridRef} className="relative px-6 pb-24">
          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PUBLIC_SPONSORS.map((sponsor, i) => (
              <SponsorCard key={sponsor.to} sponsor={sponsor} index={i} inView={gridInView} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative bg-cream py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-barlow-condensed text-gold-dark text-xs tracking-[0.35em] uppercase mb-4">
              Your Name Belongs Here
            </p>
            <h2 className="font-anton text-ink text-4xl sm:text-5xl leading-[0.95] mb-6">
              PUT YOUR BUSINESS<br />BEHIND A SCHOOL.
            </h2>
            <p className="font-barlow text-ink/60 text-lg leading-relaxed max-w-xl mx-auto mb-10">
              Sponsorship pays for programs in buildings that cannot afford them, school supplies for kids who
              show up without them, community giveaway events, and the day to day work of keeping this running.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/sponsorship"
                className="px-10 py-4 bg-ink hover:bg-ink/85 text-cream font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5"
              >
                Become a Sponsor
              </Link>
              <Link
                to="/contact"
                className="px-10 py-4 border-2 border-ink/20 hover:border-ink/50 text-ink/70 hover:text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300"
              >
                Talk to Cody First
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}
