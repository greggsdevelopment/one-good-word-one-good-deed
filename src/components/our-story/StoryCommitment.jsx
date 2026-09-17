import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

const PARAGRAPHS = [
  'In 1992, a 16-year-old boy was beaten, shot through the face, and left for dead on a concrete floor. Two strangers found him, put him in a car, and drove him to an emergency room. He should not have lived to tell the story. His name is Jason, and he did.',
  'Years later, in a sixth-grade classroom not far away, another boy heard the last bell and started doing math - whether there would be a roof over his head that night, whether there would be anything to eat before school breakfast the next morning. The kids around him teased him for the way he smelled, and they were right; he did not own deodorant. Not one of them ever said a kind word to him. His name is Cody, and he sat in that building full of people who had no idea.',
  'One survived a night that should have ended him. The other survived a childhood that tried to erase him. Two fathers, two stories, one same decision: that the kids in our schools deserved someone to show up.',
  'This is why it matters to us. Not because of a logo or a slogan, but because every child sitting in a classroom, a gym, or an auditorium right now is someone\'s son or daughter, and too many of them are doing the same quiet math, fighting the same silent fight, with no one around them saying anything at all.',
  'We are committed to making a change in our community because Jason and Cody showed us it was possible, and because we believe showing up is not optional for any of us either.',
];

export default function StoryCommitment() {
  const [ref, inView] = useInView(0.2);

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
          {PARAGRAPHS.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.12 }}
              className={`text-cream/85 leading-relaxed ${
                i === 2 ? 'text-2xl md:text-3xl italic' : 'text-lg md:text-xl'
              }`}
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