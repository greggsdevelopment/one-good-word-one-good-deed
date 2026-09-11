import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { School, Backpack, PartyPopper, Wrench, ArrowRight } from 'lucide-react';
import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import SponsorshipForm from '@/components/sponsorship/SponsorshipForm';
import { useInView } from '@/hooks/useInView';
import { PUBLIC_SPONSORS } from '@/data/sponsors';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';

const PILLARS = [
  {
    icon: School,
    title: 'Schools that cannot pay',
    body:
      'The buildings that need this most are usually the ones with nothing left in the budget for it. Sponsorship underwrites assemblies, workshops, and full year programs so a principal never has to choose between this and something else her kids need.',
  },
  {
    icon: Backpack,
    title: 'School supplies for kids in need',
    body:
      'Backpacks, notebooks, pencils, and the quiet stuff nobody puts on a supply list. Deodorant. A clean shirt. Kids get picked on for what they do not have, and some of that is fixable for a few dollars a head.',
  },
  {
    icon: PartyPopper,
    title: 'Community events and giveaways',
    body:
      'Back to school giveaways, family nights, block events, and the days where the truck pulls up and something good happens in a neighborhood that was not expecting it. Sponsors put the items in the kids hands.',
  },
  {
    icon: Wrench,
    title: 'Keeping the operation running',
    body:
      'Wristbands, printing, fuel, insurance, the website, and the hours it takes to get in front of principals. Nobody sponsors overhead because it is exciting. They sponsor it because without it none of the rest happens.',
  },
];

const LEVELS = [
  { amount: '$250', name: 'Supply Drop', covers: 'A classroom set of supplies for students who show up without them.' },
  { amount: '$500', name: 'Family Night', covers: 'One evening event so families hear the same language their kids heard.' },
  { amount: '$1,500', name: 'Assembly Underwriter', covers: 'A whole-school assembly and a wristband for every student in the building.' },
  { amount: '$3,200', name: 'Starter Sponsor', covers: 'A full semester in one school: assembly, a workshop round, and staff training.', highlight: true },
  { amount: '$6,500', name: 'Full Year Sponsor', covers: 'All five steps in one building across a full school year, start to finish.' },
];

export default function Sponsorship() {
  const [pillarsRef, pillarsInView] = useInView(0.05);
  const [levelsRef, levelsInView] = useInView(0.05);

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative pt-36 pb-20 md:pt-44 md:pb-24 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold/10 rounded-full blur-[130px]" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-barlow-condensed text-gold text-xs tracking-[0.4em] uppercase mb-5"
            >
              The Sponsorship Program
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-anton text-cream text-6xl sm:text-7xl md:text-8xl leading-[0.9] mb-7"
            >
              PUT YOUR NAME<br />
              <span className="text-gold">ON A SCHOOL.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-barlow text-cream/60 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
            >
              Sponsors are the reason this program ever walks into a school that has no money for it. Your
              money does four things, and we will show you exactly which one it did.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="#apply"
                className="px-10 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
              >
                Apply to Sponsor
              </a>
              <Link
                to="/hall-of-fame"
                className="px-10 py-4 border-2 border-cream/20 hover:border-gold/40 text-cream/70 hover:text-gold font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300"
              >
                See the Hall of Fame
              </Link>
            </motion.div>
          </div>
        </section>

        {/* What it funds */}
        <section ref={pillarsRef} className="relative bg-ink/95 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={pillarsInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="w-16 h-1 bg-gold mb-10 mx-auto origin-center"
            />
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase text-center mb-4"
            >
              Where The Money Goes
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-anton text-cream text-4xl sm:text-5xl text-center mb-14"
            >
              FOUR THINGS. NO MYSTERY.
            </motion.h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {PILLARS.map((pillar, i) => {
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 24 }}
                    animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    className="bg-white/[0.03] border border-white/[0.07] rounded-sm p-7 sm:p-8 hover:border-gold/25 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="font-barlow-condensed text-cream text-2xl font-semibold tracking-wide mb-3">
                      {pillar.title}
                    </h3>
                    <p className="font-barlow text-cream/60 text-base leading-relaxed">{pillar.body}</p>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={pillarsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="bg-gold/10 border border-gold/30 rounded-sm p-7 sm:p-8 mt-6"
            >
              <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-3">
                What you get back
              </p>
              <p className="font-barlow text-cream/70 text-base leading-relaxed">
                Your own page on this site, a card in the Sponsor Hall of Fame, your name in front of every
                family at the schools you fund, and a plain-language report telling you which building your
                money reached and what happened there. No vague thank-you letter. The actual school, the actual
                date, the actual number of students.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Levels */}
        <section ref={levelsRef} className="relative bg-ink py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={levelsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase text-center mb-4"
            >
              Sponsorship Levels
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={levelsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-anton text-cream text-4xl sm:text-5xl text-center mb-6"
            >
              PICK WHAT YOU FUND.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={levelsInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-barlow text-cream/55 text-center text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              These are the real costs of the real program, not invented tiers. Any amount helps, and monthly
              giving at any level is welcome. In-kind donations count too.
            </motion.p>

            <div className="space-y-4">
              {LEVELS.map((level, i) => (
                <motion.div
                  key={level.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={levelsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.07 }}
                  className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 rounded-sm p-6 sm:p-7 border transition-all duration-300 ${
                    level.highlight
                      ? 'bg-gold/10 border-gold/40'
                      : 'bg-white/[0.03] border-white/[0.07] hover:border-gold/25'
                  }`}
                >
                  <div className="sm:w-40 shrink-0">
                    <p className="font-anton text-gold text-3xl leading-none mb-1">{level.amount}</p>
                    <p className="font-barlow-condensed text-cream/50 text-xs tracking-[0.2em] uppercase">
                      {level.name}
                    </p>
                  </div>
                  <p className="font-barlow text-cream/65 text-base leading-relaxed">{level.covers}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={levelsInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="text-center mt-12"
            >
              <Link
                to="/hall-of-fame"
                className="inline-flex items-center gap-2 font-barlow-condensed text-gold hover:text-gold-dark text-sm uppercase tracking-[0.2em] transition-colors"
              >
                {PUBLIC_SPONSORS.length} businesses already did this. See them.
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        <SponsorshipForm />
      </main>

      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}
