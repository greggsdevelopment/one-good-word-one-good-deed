import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const RAISED = 0;
const GOAL = 10000;
const PCT = Math.round((RAISED / GOAL) * 100);

export default function DonationProgressBar() {
  const [ref, inView] = useInView({ threshold: 0.3 });

  return (
    <section ref={ref} className="py-12 px-6 bg-black/30 border-b border-cream/[0.06]">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-1">Campaign Progress</p>
            <p className="font-anton text-cream text-3xl sm:text-4xl leading-none">
              ${RAISED.toLocaleString()}
              <span className="font-barlow text-cream/30 text-base ml-2">raised</span>
            </p>
          </div>
          <div className="text-right">
            <p className="font-barlow text-cream/30 text-sm mb-0.5">Goal</p>
            <p className="font-barlow-condensed text-cream/60 text-xl">${GOAL.toLocaleString()}</p>
          </div>
        </div>

        {/* Track */}
        <div className="relative h-4 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: `${PCT}%` } : { width: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-dark to-gold rounded-full"
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="font-barlow text-cream/30 text-xs">{PCT}% of goal reached</p>
          <p className="font-barlow text-cream/30 text-xs">${(GOAL - RAISED).toLocaleString()} to go</p>
        </div>
      </div>
    </section>
  );
}