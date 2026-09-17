import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

const PARAGRAPHS = [
  "You let two fathers you have never met, halfway across the country from Tooele, carry your son's name. We do not take that lightly.",
  "Drayke was a boy who made people laugh, who hugged first and asked questions later, who wore a Pikachu onesie like it was a uniform. So on the night before Halloween we are throwing him the kind of night he would have loved. Kids in costume. Candy in hand. Games and prizes. A room full of families who showed up because of him.",
  "You turned the worst day of your lives into a warning, and that warning reached all the way to Michigan. Because of you, kids here will hear his name, and the parents in that room will go home and ask their own kids a harder question than they asked the night before. That is Drayke still doing what he did best, pulling people in.",
  "Thank you for trusting us with him. We will say one good word in his name on October 30, and then we will keep saying it.",
];

function GoldDiamond() {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="h-px w-12 bg-gold/30" />
      <span className="block rotate-45 w-2 h-2 bg-gold" />
      <span className="h-px w-12 bg-gold/30" />
    </div>
  );
}

export default function LetterToSamieAndAndy() {
  const [ref, inView] = useInView(0.15);

  return (
    <section ref={ref} className="relative bg-ink px-6 py-16 md:py-20">
      <div className="max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-gold text-sm md:text-base tracking-[0.3em] uppercase mb-6"
          style={SERIF}
        >
          To Samie and Andy
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <GoldDiamond />
        </motion.div>

        <div className="max-w-[640px] mx-auto space-y-6">
          {PARAGRAPHS.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.08 }}
              className="text-cream/85 text-lg md:text-xl italic leading-loose"
              style={SERIF}
            >
              {p}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10"
        >
          <p className="text-gold/90 text-lg md:text-xl italic leading-relaxed" style={SERIF}>
            With love and gratitude,
          </p>
          <p className="text-cream text-xl md:text-2xl italic mt-2" style={SERIF}>
            Jason and Cody
          </p>
          <p className="text-cream/70 text-base md:text-lg italic mt-1" style={SERIF}>
            One Good Word, One Good Deed
          </p>
        </motion.div>
      </div>
    </section>
  );
}