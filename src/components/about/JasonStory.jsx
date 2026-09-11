import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const STORY_PARAGRAPHS = [
  "In 1992 I was 16 years old, living on my own on Detroit's Southwest side, running with a rough crowd. One night after leaving a party I stopped at a late night coney island. A group of men followed me out. They jumped me, beat me until I could not see out of my left eye, then dragged me to an upstairs apartment.",
  "What happened in that apartment I would not wish on anyone.",
  "I was beaten with a cast iron skillet. Shot through the face with a 22 caliber pistol. A razor blade was used to carve a tattoo off my arm. Cigarettes put out on my face. Then someone looked me in the eye, showed me a bullet, and told me it was time to play Russian Roulette.",
  "At that point I was praying they would just kill me so the pain would stop.",
  "They threw me down a flight of wooden stairs onto concrete. Broken. Beaten. Shot. I could not move. My body would not respond to my mind.",
  "Then two girls found me. Told me I was going to make it. Put me in a car and took me to an emergency room.",
  "I was so badly damaged my own mother could barely recognize me.",
  "I should not be here to tell you this story.",
];

export default function JasonStory() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden" ref={ref}>
      <div className="grain-overlay" />
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Label */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-1 bg-gold mb-10 origin-left"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-4"
        >
          In His Own Words
        </motion.p>

        {/* Opening statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <p className="font-barlow-condensed text-cream/50 text-sm tracking-wider uppercase mb-3">My name is Jason. And I need to tell you something.</p>
          <p className="font-anton text-gold text-4xl sm:text-5xl leading-tight">
            THE DEVIL IS A LIAR.<br />GOD IS GOOD.
          </p>
          <p className="font-barlow-condensed text-cream/40 text-sm tracking-wider uppercase mt-3">Never a question in my mind.</p>
        </motion.div>

        {/* Story paragraphs */}
        <div className="space-y-6">
          {STORY_PARAGRAPHS.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              className={`font-barlow leading-relaxed text-lg ${
                para === "What happened in that apartment I would not wish on anyone." ||
                para === "At that point I was praying they would just kill me so the pain would stop." ||
                para === "I should not be here to tell you this story."
                  ? 'text-cream/50 italic'
                  : 'text-cream/75'
              }`}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* BUT GOD — closing statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-16 border-t border-gold/20 pt-12 text-center"
        >
          <p className="font-anton text-gold text-6xl sm:text-7xl tracking-wide">BUT GOD.</p>
          <p className="font-barlow text-cream/40 text-base mt-4 max-w-md mx-auto leading-relaxed">
            This story is why Jason Lewis walks into schools, gyms, and auditoriums — so no young person ever feels as alone as he did on that concrete floor.
          </p>
        </motion.div>

        {/* Family photos */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mt-20"
        >
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-2 text-center">The Reason He Fights</p>
          <p className="font-anton text-cream text-3xl sm:text-4xl text-center mb-10">HIS FAMILY.</p>
          <div className="max-w-md mx-auto">
            <div className="rounded-sm overflow-hidden aspect-[3/4]">
              <img
                src="https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/568d1bbd9_attysi1vemRmZPULSef0NF0hQzYSAkySINEev8acHNtOgE.jpg"
                alt="Jason's kids"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <p className="font-barlow text-cream/30 text-sm text-center mt-6 italic">
            Every word he speaks. Every school he visits. Every life he touches — it's all for them.
          </p>
        </motion.div>
      </div>
    </section>
  );
}