import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const FAMILY_PHOTO =
  'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/568d1bbd9_attysi1vemRmZPULSef0NF0hQzYSAkySINEev8acHNtOgE.jpg';

export default function FamilyCard() {
  const [ref, inView] = useInView(0.1);

  return (
    <section ref={ref} className="relative bg-ink px-6 pb-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-sm border border-gold/25 bg-gold/[0.04] p-8 sm:p-12 overflow-hidden"
        >
          {/* Subtle glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gold/8 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-11 h-11 rounded-sm border border-gold/30 bg-gold/10 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-gold" />
              </span>
              <p className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase">
                The Reason He Fights
              </p>
            </div>

            <h3 className="font-anton text-cream text-3xl sm:text-4xl tracking-wide mb-5">
              HIS FAMILY.
            </h3>

            <p className="font-barlow text-cream/70 text-base sm:text-lg leading-relaxed mb-8">
              Every word Jason speaks. Every school he visits. Every life he touches - it is all for them.
              The survival that once felt like a miracle became a mission the day he became a father,
              and it deepened the day a friend of his daughters lost her life to bullying.
            </p>

            <div className="rounded-sm overflow-hidden aspect-[3/4] max-w-xs mx-auto">
              <img
                src={FAMILY_PHOTO}
                alt="Jason with his family"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}