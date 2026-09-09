import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const PARAGRAPHS = [
  'In 6th grade, the last bell was the worst part of my day.',
  'Everyone else heard it and thought about going home. I heard it and started doing math. Would there be a roof over my head tonight. Would there be anything to eat before school breakfast at 8 the next morning. Some nights the answer was no.',
  'They teased me for my clothes. They teased me because I smelled, and they were right. I didn\u2019t have deodorant.',
  'What none of them knew was that the hours they made unbearable were still the safest hours I had. School was the bad part of a worse day.',
  'Nine months of that. Bullied all the way through the day, then home to more of it.',
  'That is why I stand with Jason. Not because it is a good cause. Because I was that kid, sitting in a building full of people who had no idea, and not one of them ever said anything to me.',
  'No child should ever have to endure that.',
];

export default function CodyStory() {
  const [ref, inView] = useInView(0.05);

  return (
    <section ref={ref} className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/4 rounded-full blur-[120px]" />
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
          The Story
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-anton text-cream text-4xl sm:text-5xl text-center mb-12"
        >
          WHY I&apos;M IN THIS
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

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 + PARAGRAPHS.length * 0.08 }}
          className="font-anton text-gold text-3xl sm:text-4xl leading-tight mt-10"
        >
          One good word. One good deed. Every single day.
        </motion.p>

        <p className="font-barlow-condensed text-cream/35 text-xs tracking-widest uppercase mt-10 text-center">
          Cody Greggs-Dorsey
        </p>
      </div>
    </section>
  );
}