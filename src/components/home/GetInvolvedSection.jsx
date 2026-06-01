import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Users, Share2, Sparkles } from 'lucide-react';

const ACTIONS = [
  {
    icon: Users,
    title: 'Join the Group',
    text: 'Connect with hundreds of people who believe love wins. Join our Facebook community and be part of the conversation.',
    link: 'https://www.facebook.com/groups/1332878885346719',
    linkLabel: 'Join on Facebook',
  },
  {
    icon: Share2,
    title: 'Share the Message',
    text: 'Spread the mission. Share this page, tell a friend, and tag us. Every share puts love in front of someone who needs it.',
    link: null,
    linkLabel: null,
  },
  {
    icon: Sparkles,
    title: 'Be the Example',
    text: 'Say the good word. Do the good deed. Every single day. The movement only works when we live it out loud.',
    link: null,
    linkLabel: null,
  },
];

export default function GetInvolvedSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="involved" className="relative bg-cream py-24 md:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-1 bg-gold mb-10 mx-auto origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-barlow-condensed text-gold-dark text-xs tracking-[0.3em] uppercase mb-4 text-center"
        >
          Get Involved
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-anton text-ink text-4xl sm:text-5xl md:text-6xl text-center mb-12 md:mb-16 leading-[0.95]"
        >
          DO SOMETHING<br /><span className="text-gold-dark">ABOUT IT.</span>
        </motion.h2>

        {/* Stack on mobile, 3-col on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-5 md:gap-8">
          {ACTIONS.map((action, i) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
              className="group bg-white border border-ink/5 rounded-sm p-7 sm:p-9 md:p-10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 active:scale-[0.99]"
            >
              <action.icon
                className="w-10 h-10 text-gold-dark mb-5 group-hover:scale-110 transition-transform duration-300"
                strokeWidth={1.5}
              />
              <h3 className="font-anton text-ink text-2xl mb-3">{action.title}</h3>
              <p className="font-barlow text-ink/60 text-base leading-relaxed mb-5">{action.text}</p>
              {action.link && (
                <a
                  href={action.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block font-barlow-condensed text-gold-dark hover:text-gold text-sm tracking-wider uppercase font-semibold transition-colors py-1"
                >
                  {action.linkLabel} →
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}