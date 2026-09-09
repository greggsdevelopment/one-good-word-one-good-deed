import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { MessageCircle, Building2, BarChart3, Scale } from 'lucide-react';

const CARDS = [
  {
    icon: MessageCircle,
    title: 'What students walk away with',
    items: [
      'Four rehearsed things to say or do when they see it happen',
      'A clear line between reporting and "snitching"',
      'Language for naming racist behavior without escalating it',
      'A wristband and a signed pledge',
    ],
  },
  {
    icon: Building2,
    title: 'What the school provides',
    items: [
      'Space, sound system, and a staff contact',
      'Staff supervision during all sessions',
      'Advance review of any student-submitted material',
      'Five minutes at the start to distribute the survey',
    ],
  },
  {
    icon: BarChart3,
    title: 'We measure it, and we hand you the numbers',
    body:
      'Students complete a short anonymous survey before the assembly and again 60 days later: how often they see it, how safe they feel in hallways and on the bus, and whether they believe stepping in works. You receive a plain-language summary you can put in front of your board. If the numbers do not move, you will know that too.',
  },
  {
    icon: Scale,
    title: 'How this supports your existing obligations',
    body:
      'Michigan districts are required under MCL 380.1310b, the Matt Epling Safe School Law, to adopt and implement an anti-bullying policy, and the law encourages that policy to include annual staff training and educational programs for students and parents. Steps one through five slot directly into that framework, with documentation you can keep on file. This is a secular program. It contains no religious content and is appropriate for public school instructional time.',
  },
];

export default function WhatSchoolsGet() {
  const [ref, inView] = useInView(0.05);

  return (
    <section className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="w-16 h-1 bg-gold mb-10 mx-auto origin-center"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4"
          >
            The Details
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-anton text-cream text-5xl sm:text-6xl leading-[0.92] mb-6"
          >
            WHAT THIS LOOKS LIKE<br />
            <span className="text-gold">FOR YOUR BUILDING.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-barlow text-cream/60 text-lg max-w-2xl mx-auto"
          >
            What students leave with, what we need from you, and how you will know whether it worked.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                className="p-7 sm:p-8 bg-white/[0.03] border border-white/[0.07] rounded-sm hover:border-gold/20 transition-all"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-barlow-condensed font-bold text-cream text-xl uppercase tracking-wide">{card.title}</h3>
                </div>
                {card.items ? (
                  <ul className="space-y-2.5">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                        <span className="font-barlow text-cream/65 text-base leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-barlow text-cream/65 text-base leading-relaxed">{card.body}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}