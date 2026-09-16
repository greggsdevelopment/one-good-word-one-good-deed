import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

export default function DraykeStory() {
  const [ref, inView] = useInView(0.15);

  return (
    <section className="relative bg-cream py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
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
          His Story
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-anton text-ink text-4xl sm:text-5xl md:text-6xl leading-[0.95] mb-10"
        >
          A BOY WITH A HEART<br />
          <span className="text-gold-dark">BIGGER THAN HIS YEARS.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="space-y-6 text-ink/85 text-lg md:text-xl leading-relaxed"
          style={SERIF}
        >
          <p>
            Drayke Andrew Hardman was twelve years old, a sixth grader from Tooele, Utah, with
            bright blue eyes and a smile that pulled everyone into its orbit. He was the kid in
            the Pikachu onesie on a hoverboard. The kid hugging puppies like they were treasure.
            The master Lego builder, the jokester, the boy who hugged first and asked questions
            later. He loved his family fiercely, and they loved him more than words will ever hold.
          </p>
          <p>
            For nearly a year, Drayke was bullied at school. His parents did what loving parents
            do. They asked questions, they talked to the school, they checked on his heart. But
            bullying is a weight no child should ever have to carry, and it presses down hardest
            in the quiet, in the places grown-ups cannot always see. On February 10, 2022, that
            weight took Drayke from this world.
          </p>
          <p>
            His parents, Samie and Andy, have carried their unbearable grief into something
            selfless ever since: a warning and a plea to every parent, every teacher, and every
            kid, so that no other family has to live this story. It is with his mother&rsquo;s
            loving permission that we share Drayke with you here.
          </p>
          <p className="text-ink font-medium italic">
            Drayke&rsquo;s life was not his final day. His life was twelve years of light. That is
            what we remember, and that is what we fight for.
          </p>
        </motion.div>
      </div>
    </section>
  );
}