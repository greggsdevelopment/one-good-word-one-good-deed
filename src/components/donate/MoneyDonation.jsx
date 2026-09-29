import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const USES = [
  'Wristbands every student gets after an assembly',
  'Programs for schools that cannot afford them',
  'Supplies and giveaways at community events',
  'Printing, fuel, and the costs of showing up',
];

export default function MoneyDonation({ gofundmeUrl }) {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="give-money" ref={ref} className="relative bg-ink py-24 px-6 scroll-mt-16">
      <div className="max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-3"
        >
          Give Money
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-anton text-cream text-4xl sm:text-5xl tracking-wide mb-5"
        >
          ANY AMOUNT HELPS
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow text-cream/55 text-lg leading-relaxed mb-8"
        >
          Money gifts go through our GoFundMe and pay for the work that keeps this moving:
        </motion.p>

        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="grid sm:grid-cols-2 gap-3 text-left mb-10"
        >
          {USES.map((u) => (
            <li
              key={u}
              className="bg-white/[0.03] border border-cream/10 rounded-sm px-5 py-4 font-barlow text-cream/70 text-sm leading-relaxed"
            >
              {u}
            </li>
          ))}
        </motion.ul>

        <motion.a
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          href={gofundmeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
        >
          Give on GoFundMe <ExternalLink className="w-4 h-4" />
        </motion.a>
      </div>
    </section>
  );
}
