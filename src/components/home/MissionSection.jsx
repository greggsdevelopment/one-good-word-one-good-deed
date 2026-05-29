import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

export default function MissionSection() {
  const [ref, inView] = useInView(0.2);

  return (
    <section id="mission" className="relative bg-cream py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        {/* Gold divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-1 bg-gold mb-10 origin-left"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow-condensed text-gold-dark text-xs tracking-[0.3em] uppercase mb-6"
        >
          Our Mission
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-anton text-ink text-4xl sm:text-5xl md:text-6xl leading-[0.95] mb-8"
        >
          HATE IS LOUD.<br />
          WE CHOOSE TO BE<br />
          <span className="text-gold-dark">LOUDER WITH LOVE.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="font-barlow text-ink/80 text-lg md:text-xl leading-relaxed max-w-3xl"
        >
          We believe one good word can change a moment, and one good deed can change a life. We exist to confront bullying and racism head-on. Not with anger, but with the kind of love that refuses to back down. This is bigger than a hashtag. It is a daily choice to lift people up, defend the vulnerable, and lead with the love God showed us first.
        </motion.p>
      </div>
    </section>
  );
}