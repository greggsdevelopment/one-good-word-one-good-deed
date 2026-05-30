import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const FEATURED = [
  {
    quote: "I pledge to speak up every time I see someone being bullied — even when it's hard.",
    name: 'Aaliyah T.', city: 'Detroit, MI',
  },
  {
    quote: "I promise to see the humanity in every person I meet, no matter our differences.",
    name: 'Marcus W.', city: 'Troy, MI',
  },
  {
    quote: "I pledge to teach my children that one kind word can truly change someone's entire day.",
    name: 'Denise R.', city: 'Pontiac, MI',
  },
];

export default function FeaturedQuotes() {
  const [ref, inView] = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-16 px-6 border-b border-cream/[0.06] bg-black/20">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase text-center mb-10"
        >
          What Others Are Saying
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURED.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col gap-4"
            >
              <p className="font-barlow text-gold text-xl italic leading-relaxed">
                "{q.quote}"
              </p>
              <p className="font-barlow-condensed text-cream/50 text-sm tracking-wide">
                — {q.name}{q.city ? `, ${q.city}` : ''}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}