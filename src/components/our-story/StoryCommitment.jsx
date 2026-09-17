import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

const JASON_PARAGRAPHS = [
  'In 1992, a 16-year-old boy was jumped outside a late-night coney island on Detroit\'s Southwest side. They beat him until he could not see out of his left eye, hurt him in ways no one should have to survive, and left him broken on a concrete floor. Two girls found him, told him he was going to make it, and drove him to an emergency room. His own mother could barely recognize him. He should not be here to tell this story. His name is Jason, and he did.',
  'Years later, a friend of his daughters lost her life to bullying. The survival that once felt like a miracle became a mission. Now every word he speaks, every school he walks into, is for his daughters and for her, so no family ever has to bury a child because no one showed up.',
];

const CODY_PARAGRAPHS = [
  'In a classroom not far away, another boy was living a reality no one could see. Nights with no roof, five of them sleeping in a car, in a tent, moving between hotel rooms when they could scrape the money together. And the next morning, he still had to go to school. He sat there hungry, running on no sleep, quietly breaking apart on the inside, while the same clothes and the exhaustion on his face told everyone exactly what was happening at home. The bullying started not because of something he did, but because of something he could not hide. His name is Cody, and he was alone in a room full of people.',
];

const CLOSING_PARAGRAPHS = [
  'One survived a night that should have ended him. The other survived a childhood that tried to erase him. Two fathers, two stories, one same decision: that the kids in our schools deserved someone to show up.',
  'This is why it matters to us. Not because of a logo or a slogan, but because every child sitting in a classroom, a gym, or an auditorium right now is someone\'s son or daughter, and too many of them are doing the same quiet math, fighting the same silent fight, with no one around them saying anything at all.',
  'We are committed to making a change in our community because Jason and Cody showed us it was possible, and because we believe showing up is not optional for any of us either.',
];

const ITEMS = [
  ...JASON_PARAGRAPHS.map((text) => ({ type: 'para', text })),
  { type: 'diamond' },
  ...CODY_PARAGRAPHS.map((text) => ({ type: 'para', text })),
  ...CLOSING_PARAGRAPHS.map((text) => ({ type: 'para', text })),
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
          {ITEMS.map((item, i) =>
            item.type === 'diamond' ? (
              <motion.div
                key={`diamond-${i}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.12 }}
                className="flex items-center justify-center gap-4 pt-2"
              >
                <span className="h-px w-10 bg-gold/30" />
                <span className="block rotate-45 w-2.5 h-2.5 bg-gold/70" />
                <span className="h-px w-10 bg-gold/30" />
              </motion.div>
            ) : (
              <motion.p
                key={`para-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.12 }}
                className="text-cream/85 leading-relaxed text-lg md:text-xl"
                style={SERIF}
              >
                {item.text}
              </motion.p>
            )
          )}
        </div>
      </div>
    </section>
  );
}