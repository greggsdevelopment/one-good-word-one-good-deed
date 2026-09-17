import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const PARAGRAPHS = [
  'There were nights growing up when my family didn\u2019t have a roof over our heads. Five of us slept in a car. We stayed in a tent. We moved between hotel rooms when we could scrape the money together. And the next morning, I still had to go to school.',
  'I sat in classrooms hungry, running on no sleep, quietly breaking apart on the inside, while my appearance, the same clothes, the exhaustion on my face, told everyone exactly what was happening at home before I ever said a word.',
  'Kids don\u2019t need you to explain your situation to target you for it. They just need a reason, and I gave them one just by showing up. That\u2019s where the bullying started for me. Not because of something I did, but because of something I couldn\u2019t hide: the reality I was living in.',
  'I didn\u2019t have the language for it then, but I understand it now. Bullying doesn\u2019t just attack who you are, it attacks you when you\u2019re already at your lowest, when you have the least left to fight back with. I know that firsthand because I lived it, hungry, exhausted, and alone in a room full of people.',
  'That\u2019s part of why this work matters so much to me now. Fathers Fight Back, Grounded Kings, One Good Word One Good Deed, none of it is theoretical for me. I built these things because I know what it costs a kid to walk into a building every day already broken down, and I know what it means when nobody steps in.',
  'I didn\u2019t have someone show up for me back then. So now, I show up for everyone I can.',
];

export default function RealityBehindReason() {
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