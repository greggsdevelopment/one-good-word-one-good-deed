import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';

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
          One Good Word...One Good Deed began when founder Jason Lewis watched his daughter's friend get bullied
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
          the fall and carry steps four and five through spring. The five steps below are shaped differently for
          elementary, middle, and high school, so pick your grade band and read the version your students would
          actually get.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-6">
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