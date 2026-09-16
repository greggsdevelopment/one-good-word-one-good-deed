import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };
const SCRIPT = { fontFamily: "'Great Vibes', cursive" };

export default function ButterflySection() {
  const [ref, inView] = useInView(0.2);

  return (
    <section
      className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden border-t border-gold/10"
      ref={ref}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(230,180,80,0.1) 0%, rgba(11,11,13,0) 55%)' }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8 text-gold"
          aria-hidden="true"
        >
          <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5c-1.5-3-5.5-4-7.5-2S3 8.5 6 10c-3 1.5-3.5 5-1.5 7s6 1 7.5-2c1.5 3 5.5 4 7.5 2s1.5-5.5-1.5-7c3-1.5 3.5-5 1.5-7s-6-1-7.5 2z" opacity="0.6" />
            <path d="M12 4.5v15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-gold text-4xl md:text-5xl mb-8"
          style={SCRIPT}
        >
          In his own words
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="space-y-6 text-cream/90 text-xl md:text-2xl leading-relaxed"
          style={SERIF}
        >
          <p>
            In a video he shared before he passed, Drayke talked about butterflies. A butterfly,
            he pointed out, can never see its own wings. It carries all that color and never
            knows how beautiful it is. People are the same, he said. We stare at our flaws and
            miss everything good in us. So he gave the world a homework assignment:
          </p>
          <blockquote className="text-white text-2xl md:text-3xl italic">
            &ldquo;Go in the mirror and list out two things you love about yourself.&rdquo;
          </blockquote>
          <p className="text-cream/70 text-lg md:text-xl">
            Every day. At least once a day. Because, in his words, this world has way too much
            negativity.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-12 inline-block border border-gold/40 rounded-sm px-8 py-6 bg-black/30"
        >
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-2">
            Drayke&rsquo;s Mirror Challenge
          </p>
          <p className="text-cream text-lg md:text-xl" style={SERIF}>
            Today, and every day this week: find a mirror, and name two things you love about
            yourself. Then help someone else see theirs.
          </p>
        </motion.div>
      </div>
    </section>
  );
}