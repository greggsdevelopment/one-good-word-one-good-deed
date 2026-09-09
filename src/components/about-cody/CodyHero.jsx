import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const CODY_PHOTO = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/3dba51ee3_image.png';

const RAINBOW_BORDER = 'linear-gradient(135deg, #ef4444 0%, #f97316 20%, #eab308 40%, #22c55e 60%, #3b82f6 80%, #a855f7 100%)';

export default function CodyHero() {
  const [ref, inView] = useInView(0.1);

  return (
    <section ref={ref} className="relative bg-ink pt-28 pb-20 md:pt-36 md:pb-28 px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Photo column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="order-1 flex justify-center md:justify-start"
        >
          <div
            className="p-[3px] rounded-2xl w-full max-w-sm"
            style={{ background: RAINBOW_BORDER }}
          >
            <div className="rounded-[14px] bg-ink p-2">
              <img
                src={CODY_PHOTO}
                alt="Cody Greggs-Dorsey, Digital Director of One Good Word One Good Deed"
                className="w-full h-auto rounded-lg object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Text column */}
        <div className="order-2 text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4"
          >
            Digital Director
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-anton text-cream text-5xl sm:text-6xl md:text-7xl leading-[0.95] mb-5"
          >
            CODY<br />
            <span className="text-gold">GREGGS-DORSEY</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-barlow-condensed text-cream/70 text-xl sm:text-2xl font-semibold tracking-wide mb-6"
          >
            Founder of Greggs Development. Builder of the digital side of One Good Word...One Good Deed.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-barlow text-cream/55 text-base sm:text-lg leading-relaxed max-w-xl mx-auto md:mx-0"
          >
            When Jason started this movement, it was a Facebook group and a few t-shirts. I came in to build
            everything around it: the website, the pledge wall, the sponsor program, the content, and the
            systems that let it reach schools across metro Detroit. A message this important deserves reach
            that matches its weight.
          </motion.p>
        </div>
      </div>
    </section>
  );
}