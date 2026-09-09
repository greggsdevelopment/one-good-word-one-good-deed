import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';

const STEPS = [
  {
    title: 'The Assembly: "One Good Word"',
    meta: ['45 minutes', 'Whole school', 'Gym or auditorium'],
    description:
      "Jason tells his family's story, students see what bullying and racism cost a real person, and the room learns the 10 second fact above. Ends with the pledge and a wristband every student keeps. Loud, funny in places, honest in others. Not a lecture.",
  },
  {
    title: 'The 10 Second Lab',
    meta: ['45 minutes', 'One grade level at a time'],
    description:
      'Students practice four things they can actually do in the moment: interrupt, redirect, check on the person afterward, and report to an adult. They rehearse the words out loud, in pairs, until saying them stops feeling weird. This is skill practice, not a discussion circle.',
  },
  {
    title: 'Group Chat Check',
    meta: ['45 minutes', 'One grade level at a time', 'Grades 6 to 8'],
    description:
      'Most middle school conflict now starts on a screen at night and walks into the building the next morning. Using anonymous, name-scrubbed examples reviewed in advance with school staff, students map the exact point where a joke turns into harm, and what to do at that point.',
  },
  {
    title: 'Student Ambassadors',
    meta: ['15 to 20 students', 'Training day plus monthly 30 minute check-ins'],
    description:
      'A trained student team nominated by your staff, including students who have been on both sides of the problem. They lead the pledge drive, run lunch table welcomes, and give your counselors an early warning system. This is the piece that keeps the message alive after we drive away.',
  },
  {
    title: 'Staff Session and Family Night',
    meta: ['60 minutes staff', '60 minutes evening family event'],
    description:
      'A professional development hour for teachers, paraprofessionals, bus drivers, and lunch staff on spotting it early and responding consistently. Plus an optional evening event so families hear the same language their kids heard.',
  },
];

export default function WhatWeDoSection() {
  const [ref, inView] = useInView(0.05);

  return (
    <section id="the-program" className="relative bg-ink/95 py-24 px-6 scroll-mt-16" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-1 bg-gold mb-10 mx-auto origin-center"
        />
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase text-center mb-4"
        >
          The Program
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-anton text-cream text-4xl sm:text-5xl text-center mb-6"
        >
          FIVE STEPS. ONE SCHOOL YEAR.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow text-cream/60 text-center text-lg max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          One Good Word...One Good Deed began when founder Jason Lewis watched his daughter get bullied
          and decided that talking about it was not enough. Our message to students is simple enough for a
          sixth grader to repeat on the bus ride home: <span className="text-cream font-semibold">one good word, one good deed.</span> Say
          the thing. Do the thing. Every day, on purpose.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-barlow text-cream/50 text-center text-base max-w-2xl mx-auto mb-16"
        >
          Schools can start with step one and add from there. Most buildings run steps one through three in
          the fall and carry steps four and five through spring.
        </motion.p>

        <ol className="space-y-6">
          {STEPS.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }}
              className="flex gap-5 sm:gap-7 bg-white/[0.03] border border-white/[0.07] rounded-sm p-6 sm:p-8 hover:border-gold/25 transition-all duration-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gold flex items-center justify-center shrink-0">
                <span className="font-anton text-ink text-2xl sm:text-3xl leading-none">{i + 1}</span>
              </div>
              <div>
                <h3 className="font-barlow-condensed text-cream text-2xl font-semibold tracking-wide mb-2">{step.title}</h3>
                <p className="font-barlow-condensed text-gold/80 text-xs tracking-[0.2em] uppercase mb-3">
                  {step.meta.join('  ·  ')}
                </p>
                <p className="font-barlow text-cream/60 text-base leading-relaxed">{step.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gold/10 border border-gold/30 rounded-sm p-6 sm:p-8"
          >
            <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-3">Our honest position</p>
            <p className="font-barlow text-cream/70 text-base leading-relaxed mb-4">
              A single assembly does not fix a school. One-off events do not change behavior on their own,
              because students cannot learn a social skill in one hour any more than they can learn algebra
              in one hour.
            </p>
            <p className="font-barlow text-cream/70 text-base leading-relaxed">
              What the research does support is sustained, multi-level work that reaches the whole school, the
              classroom, and individual students. So we do not sell a one-hour show. We built a five-step
              program, and the assembly is only step one.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.68 }}
            className="bg-white/[0.03] border border-white/[0.1] rounded-sm p-6 sm:p-8 flex flex-col"
          >
            <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-3">Running through all five</p>
            <h3 className="font-barlow-condensed text-cream text-2xl font-semibold tracking-wide mb-3">The Pledge Wall</h3>
            <p className="font-barlow text-cream/60 text-base leading-relaxed mb-6 flex-1">
              Every student who signs adds their name to a wall in your building and to the public pledge wall
              at ogwogd.org. It turns a one-day promise into something students walk past every morning.
            </p>
            <Link
              to="/pledge-wall"
              className="self-start font-barlow-condensed text-gold hover:text-gold-dark text-sm uppercase tracking-wider transition-colors"
            >
              See the public Pledge Wall &rarr;
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}