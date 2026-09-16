import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HeartHandshake, School, Megaphone } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

const ACTIONS = [
  {
    icon: Megaphone,
    title: 'Take the Pledge',
    text: 'Add your name to the wall and promise one good word and one good deed, every day.',
    to: '/pledge-wall',
    cta: 'Sign the Pledge Wall',
  },
  {
    icon: School,
    title: 'Bring Us to Your School',
    text: 'Assemblies and workshops that teach kids what one good word can do before it is too late.',
    to: '/programs',
    cta: 'See School Programs',
  },
  {
    icon: HeartHandshake,
    title: 'Learn the Warning Signs',
    text: 'Know what to watch for, how to listen, and where to turn when a child is hurting.',
    to: '/resources',
    cta: 'Visit Resources',
  },
];

export default function WhyWeRemember() {
  const [ref, inView] = useInView(0.15);

  return (
    <section className="relative bg-cream py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
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
          Why We Do This For Drayke
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-anton text-ink text-4xl sm:text-5xl md:text-6xl leading-[0.95] mb-10"
        >
          ONE GOOD WORD<br />
          <span className="text-gold-dark">COULD HAVE CHANGED EVERYTHING.</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="space-y-6 text-ink/85 text-lg md:text-xl leading-relaxed max-w-3xl mb-16"
          style={SERIF}
        >
          <p>
            One Good Word One Good Deed exists because bullying is not &ldquo;kids being
            kids.&rdquo; It is a weight that stacks up one cruel word at a time, and it can crush
            a child in less than a school year. Our founder started this movement after bullying
            took a fourteen-year-old girl his family loved. Drayke&rsquo;s story is that same
            story, told in another state, in another school, to another family that did
            everything they could. It has to stop.
          </p>
          <p>
            We believe the antidote is not complicated. Hate is loud, so we choose to be louder
            with love. One good word can change a moment. One good deed can change a life. Kids
            like Drayke gave those words away for free, every single day. The least we can do is
            give them back, and teach every kid, in every hallway, to do the same.
          </p>
          <p className="text-ink font-medium">
            We walk into schools so that no child carries what Drayke carried, and no parent
            carries what Samie and Andy carry. Never again. Not on our watch.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {ACTIONS.map((action, i) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + i * 0.15 }}
              className="bg-ink rounded-sm p-8 flex flex-col border border-gold/20"
            >
              <action.icon className="text-gold mb-5" size={30} strokeWidth={1.5} />
              <h3 className="font-anton text-white text-2xl mb-3 tracking-wide">{action.title}</h3>
              <p className="font-barlow text-cream/70 leading-relaxed mb-6 flex-grow">{action.text}</p>
              <Link
                to={action.to}
                className="inline-block bg-gold hover:bg-gold-dark text-ink font-bold text-sm uppercase tracking-wider px-5 py-3 rounded text-center transition-colors"
              >
                {action.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}