import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Sparkles, Package, TrendingUp, Camera, BookHeart, Award } from 'lucide-react';

const INCLUSIONS = [
  {
    icon: Sparkles,
    title: 'Live Motivational Presentation',
    description: "A powerful, story-driven presentation tailored to your school's grade levels and current challenges.",
  },
  {
    icon: Package,
    title: 'Awareness Wristbands',
    description: 'Every student receives an "One Good Word One Good Deed" silicone wristband — a daily reminder to choose kindness.',
  },
  {
    icon: BookHeart,
    title: 'Take-Home Resources',
    description: 'Printed pledge cards, reflection sheets, and challenge prompts students can use beyond the assembly.',
  },
  {
    icon: Camera,
    title: 'Photo Opportunities',
    description: "Staff and students can take photos with Jason. Shareable content for your school's social media.",
  },
  {
    icon: Award,
    title: 'Merchandise Options',
    description: 'Optional bundled merch packages — shirts, hoodies, and more — available for purchase at a school discount.',
  },
  {
    icon: TrendingUp,
    title: 'Measurable Culture Impact',
    description: "Schools report a visible shift in student attitude and behavior following Jason's visits. The message sticks.",
  },
];

export default function WhatSchoolsGet() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
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
            What Your School Gets
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-anton text-cream text-5xl sm:text-6xl leading-[0.92] mb-6"
          >
            MORE THAN A<br />
            <span className="text-gold">SPEAKER.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-barlow text-cream/60 text-lg max-w-2xl mx-auto"
          >
            Every engagement includes tangible takeaways your students and staff will carry long after Jason leaves the building.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INCLUSIONS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                className="flex gap-5 p-6 bg-white/[0.03] border border-white/[0.07] rounded-sm hover:border-gold/20 transition-all"
              >
                <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-barlow-condensed font-bold text-cream text-lg uppercase tracking-wide mb-2">{item.title}</h3>
                  <p className="font-barlow text-cream/50 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}