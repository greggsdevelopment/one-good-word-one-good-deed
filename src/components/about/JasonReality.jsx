import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const PARAGRAPHS = [
  'I survived something at 16 that should have ended me. For years I carried it silently, deciding what to do with the fact that I was still here.',
  'Then I started watching what was happening to kids in our schools. The bullying. The racism. The quiet cruelty that builds until a child can no longer carry it.',
  'A friend of my daughters lost her life to bullying. That is when silence stopped being an option for me.',
  'I do not speak in schools because it is a good cause. I speak because I was the kid on that concrete floor, and I know what it costs when nobody shows up.',
  'My faith tells me God\'s love is the answer. So I bring that love into gyms and auditoriums, one word and one deed at a time.',
  'No child should ever have to endure what I endured. And no parent should have to bury a child because the people around them stayed silent.',
];

export default function JasonReality() {
  const [ref, inView] = useInView(0.05);

  return (
    <section ref={ref} className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gold/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
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
          className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase text-center mb-4"
        >
          The Reality
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-anton text-cream text-4xl sm:text-5xl text-center mb-12"
        >
          THE REALITY BEHIND THE REASON
        </motion.h2>

        <div className="space-y-6">
          {PARAGRAPHS.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              className="font-barlow text-cream/70 text-xl sm:text-2xl leading-relaxed"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}