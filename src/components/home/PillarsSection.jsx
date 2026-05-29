import { motion } from 'framer-motion';
import { ShieldOff, Heart, Users } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const PILLARS = [
  {
    icon: ShieldOff,
    title: 'Stop Bullying',
    text: 'Silence protects the bully, never the bullied. We equip people to speak up, step in, and stand beside anyone being targeted.',
  },
  {
    icon: Users,
    title: 'Stop Racism',
    text: "We see every person as made in God's image, equal in worth and dignity. We confront prejudice with truth, grace, and unshakable resolve.",
  },
  {
    icon: Heart,
    title: "Through God's Love",
    text: 'Love is our strategy and our standard. Every word we speak and every deed we do flows from the love we were freely given.',
  },
];

export default function PillarsSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="pillars" className="relative bg-ink py-24 md:py-32 px-4 sm:px-6 overflow-hidden" ref={ref}>
      <div className="grain-overlay" style={{ opacity: 0.09 }} />

      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-4 text-center"
        >
          Three Pillars
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-anton text-cream text-4xl sm:text-5xl md:text-6xl text-center mb-12 md:mb-16 leading-[0.95]"
        >
          WHAT WE STAND FOR
        </motion.h2>

        {/* Stack on mobile, 3-col on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-5 md:gap-8">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
              className="group bg-white/[0.03] border border-white/[0.07] rounded-sm p-7 sm:p-9 md:p-10 hover:bg-white/[0.06] hover:border-gold/25 transition-all duration-500 hover:-translate-y-1 active:scale-[0.99]"
            >
              <pillar.icon
                className="w-10 h-10 text-gold mb-5 group-hover:scale-110 transition-transform duration-300"
                strokeWidth={1.5}
              />
              <h3 className="font-anton text-cream text-2xl md:text-3xl mb-3 leading-tight">{pillar.title}</h3>
              <p className="font-barlow text-cream/60 text-base leading-relaxed">{pillar.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}