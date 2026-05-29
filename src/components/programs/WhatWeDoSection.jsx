import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Users, BookOpen, Home, Star } from 'lucide-react';

const SERVICES = [
  {
    icon: Users,
    title: 'School Assemblies',
    description: 'High-energy, whole-school assemblies that speak directly to students about the real impact of bullying and racism — and what one good word can do.',
  },
  {
    icon: BookOpen,
    title: 'Classroom Presentations',
    description: 'Smaller, interactive classroom sessions where Jason goes deeper with students, facilitating honest conversations and building empathy.',
  },
  {
    icon: Home,
    title: 'Community Events',
    description: 'Available for church groups, after-school programs, youth organizations, and community-wide events that serve young people.',
  },
  {
    icon: Star,
    title: 'Leadership Workshops',
    description: 'Half-day or full-day workshops for student leaders, building the next generation of positive voices in their schools and communities.',
  },
];

export default function WhatWeDoSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="relative bg-ink/95 py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-1 bg-gold mb-10 mx-auto origin-center"
        />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-anton text-cream text-4xl sm:text-5xl text-center mb-4"
        >
          WHAT JASON DOES
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow text-cream/50 text-center text-lg max-w-2xl mx-auto mb-16"
        >
          Flexible formats designed to meet your school or organization where you are.
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-sm p-6 hover:border-gold/25 transition-all duration-300"
            >
              <s.icon className="w-8 h-8 text-gold mb-4" />
              <h3 className="font-barlow-condensed text-cream text-xl font-semibold tracking-wide mb-3">{s.title}</h3>
              <p className="font-barlow text-cream/50 text-sm leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}