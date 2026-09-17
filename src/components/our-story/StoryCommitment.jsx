import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

export default function StoryCommitment() {
  const [ref, inView] = useInView(0.2);

  const paragraphs = [
    'Two fathers. Two stories. One same decision: that the kids in our schools deserved someone to show up.',
    'Jason carried the weight of what happened to him, so no other child would have to carry it alone. Cody carried the weight of what he saw happening around him, so the next kid would not face it unheard. Their stories run parallel, and together they became the reason this movement exists.',
    'This is why it matters to us. Not because of a logo or a slogan, but because every child sitting in a classroom, a gym, or an auditorium right now is someone\'s son or daughter.',
    'We are committed to making a change in our community because they showed us it was possible, and because we believe showing up is not optional for any of us either.',
  ];

  return (
    <section className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden" ref={ref}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(230,180,80,0.08) 0%, rgba(11,11,13,0) 65%)' }}
      />
      <div className="relative max-w-2xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="font-barlow-condensed text-gold/70 text-xs tracking-[0.3em] uppercase mb-6"
        >
          Why This Matters
        </motion.p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-12 h-px bg-gold mx-auto mb-10"
        />
        <div className="space-y-7">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.15 }}
              className={`text-cream/85 ${
                i === 0 ? 'text-2xl md:text-3xl italic' : 'text-lg md:text-xl'
              } leading-relaxed`}
              style={SERIF}
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}