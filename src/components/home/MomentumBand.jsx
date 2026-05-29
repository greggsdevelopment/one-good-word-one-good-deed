import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

export default function MomentumBand({ pledgeCount }) {
  const [ref, inView] = useInView(0.3);
  const communityMembers = 271;

  return (
    <section className="relative bg-ink py-20 md:py-24 px-6 overflow-hidden" ref={ref}>
      <div className="grain-overlay" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-10"
        >
          The Movement is Growing
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-20 mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="font-anton text-gold text-6xl md:text-7xl">{pledgeCount.toLocaleString()}</p>
            <p className="font-barlow-condensed text-cream/50 text-sm tracking-[0.2em] uppercase mt-2">Pledges Taken</p>
          </motion.div>

          <div className="hidden sm:block w-px h-20 bg-cream/10" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <p className="font-anton text-gold text-6xl md:text-7xl">{communityMembers.toLocaleString()}</p>
            <p className="font-barlow-condensed text-cream/50 text-sm tracking-[0.2em] uppercase mt-2">Community Members</p>
          </motion.div>
        </div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="font-anton text-cream text-2xl sm:text-3xl md:text-4xl leading-tight"
        >
          THIS IS HOW IT GROWS.<br />
          <span className="text-gold">ONE PERSON AT A TIME.</span>
        </motion.h3>
      </div>
    </section>
  );
}