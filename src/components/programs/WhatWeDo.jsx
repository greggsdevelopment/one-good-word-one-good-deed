import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Users, BookOpen, Presentation, Heart } from 'lucide-react';

const PROGRAMS = [
  {
    icon: Presentation,
    title: 'School Assemblies',
    description:
      'High-energy full-school assemblies for K-12 that deliver an unforgettable message about stopping bullying and racism. Jason speaks from lived experience — students connect immediately.',
    details: ['30–60 minute format', 'K–12 all grade levels', 'Up to 1,000+ students', 'Q&A included'],
  },
  {
    icon: BookOpen,
    title: 'Classroom Visits',
    description:
      'Smaller, more intimate 30-minute sessions that go deeper. Jason engages students in honest conversations about kindness, empathy, and what it means to be an upstander.',
    details: ['1–2 classrooms per visit', 'Interactive discussion format', 'Great for follow-up after assembly', 'Grades 4–12'],
  },
  {
    icon: Users,
    title: 'Leadership Workshops',
    description:
      'Half-day or full-day workshops for student leaders, peer mentors, and school staff. Equips students with tools to lead positive change in their school culture.',
    details: ['Half-day or full-day', 'Student leader focused', 'Staff training available', 'Customizable curriculum'],
  },
  {
    icon: Heart,
    title: 'Community Events',
    description:
      'Jason is available for church youth groups, community centers, nonprofits, and faith-based organizations. He brings the same powerful message wherever young people gather.',
    details: ['Evenings & weekends available', 'Faith-based approach', 'All ages welcome', 'Virtual option available'],
  },
];

export default function WhatWeDo() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="what-we-do" className="relative bg-cream py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="w-16 h-1 bg-gold-dark mb-10 mx-auto origin-center"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-barlow-condensed text-gold-dark text-xs tracking-[0.35em] uppercase mb-4"
          >
            What Jason Does
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-anton text-ink text-5xl sm:text-6xl leading-[0.92] mb-6"
          >
            PROGRAMS THAT<br />MAKE AN IMPACT.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-barlow text-ink/60 text-lg max-w-2xl mx-auto"
          >
            Every program is tailored to your school's needs and delivered with passion, 
            authenticity, and God's love.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROGRAMS.map((prog, i) => {
            const Icon = prog.icon;
            return (
              <motion.div
                key={prog.title}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                className="bg-ink rounded-sm p-8 flex flex-col"
              >
                <div className="w-12 h-12 rounded-sm bg-gold/10 flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <h3 className="font-anton text-cream text-2xl mb-3">{prog.title}</h3>
                <p className="font-barlow text-cream/50 text-sm leading-relaxed mb-6 flex-1">{prog.description}</p>
                <ul className="space-y-2">
                  {prog.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 font-barlow-condensed text-gold/70 text-xs uppercase tracking-wider">
                      <span className="w-1 h-1 bg-gold/50 rounded-full shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}