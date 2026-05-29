import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Camera } from 'lucide-react';

const PHOTO_SLOTS = [
  { label: 'Jason at a School Assembly' },
  { label: 'Wayne-Westland Partnership Event' },
  { label: 'Community Outreach Program' },
  { label: 'Movement Merch Launch' },
];

export default function PhotoSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="relative bg-cream py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-1 bg-gold mb-10 origin-left"
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="font-barlow-condensed text-gold-dark text-xs tracking-[0.3em] uppercase mb-4"
        >
          In the Community
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-anton text-ink text-5xl sm:text-6xl leading-[0.95] mb-12"
        >
          THE MOVEMENT<br />IN ACTION.
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHOTO_SLOTS.map((slot, i) => (
            <motion.div
              key={slot.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className="aspect-square bg-ink/5 border-2 border-dashed border-ink/15 rounded-sm flex flex-col items-center justify-center gap-3 p-4"
            >
              <Camera className="w-8 h-8 text-ink/20" />
              <p className="font-barlow text-ink/30 text-sm text-center leading-tight">
                {slot.label}
              </p>
              <p className="font-barlow-condensed text-gold-dark/50 text-xs tracking-wider uppercase">
                Photo Coming Soon
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}