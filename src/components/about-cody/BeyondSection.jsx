import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

export default function BeyondSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section ref={ref} className="relative bg-ink py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-1 bg-gold mb-8 mx-auto origin-center"
        />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4"
        >
          Beyond OGWOGD
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow text-cream/65 text-lg sm:text-xl leading-relaxed"
        >
          Cody is the founder of Greggs Development, a web design and AI solutions company in metro Detroit, and a father.
          He also runs a nonprofit focused on peer mentorship and brotherhood for men.
        </motion.p>
      </div>
    </section>
  );
}