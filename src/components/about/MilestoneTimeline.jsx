import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const MILESTONES = [
  {
    year: '2020',
    title: 'The Idea Is Born',
    body: 'Jason Lewis launches the concept of One Good Word...One Good Deed after witnessing the impact of bullying and racism in his community.',
  },
  {
    year: '2021',
    title: 'LLC Founded',
    body: 'One Good Word...One Good Deed LLC is officially established, formalizing the mission and creating the foundation for growth.',
  },
  {
    year: '2022',
    title: 'First School Visits',
    body: 'Jason begins speaking directly in schools, bringing his anti-bullying and anti-racism message face-to-face with students who need it most.',
  },
  {
    year: '2023',
    title: 'Wayne-Westland Partnership',
    body: 'A landmark partnership is formed with Wayne-Westland Community Schools, opening the doors to thousands of students across the district.',
  },
  {
    year: '2024',
    title: 'Merch & Movement Launch',
    body: 'The movement expands with branded merchandise — shirts, hoodies, coats, and wristbands — giving supporters a way to wear the message daily.',
  },
  {
    year: '2025+',
    title: 'Growing Statewide',
    body: 'The vision: take One Good Word...One Good Deed into every school district in Michigan and beyond, one assembly at a time.',
  },
];

export default function MilestoneTimeline() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="relative bg-ink py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4"
        >
          The Journey
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-anton text-cream text-5xl sm:text-6xl leading-[0.95] mb-16"
        >
          MILESTONES<br />OF THE MOVEMENT.
        </motion.h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[72px] sm:left-[88px] top-0 bottom-0 w-px bg-white/[0.07]" />

          <div className="space-y-12">
            {MILESTONES.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="flex gap-8 items-start"
              >
                {/* Year */}
                <div className="shrink-0 w-16 sm:w-20 text-right">
                  <span className="font-barlow-condensed text-gold font-bold text-sm tracking-wider">
                    {m.year}
                  </span>
                </div>

                {/* Dot */}
                <div className="shrink-0 relative flex items-center justify-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-gold ring-4 ring-ink" />
                </div>

                {/* Content */}
                <div className="pb-4">
                  <h3 className="font-barlow-condensed text-cream font-bold text-xl uppercase tracking-wide mb-2">
                    {m.title}
                  </h3>
                  <p className="font-barlow text-cream/50 text-base leading-relaxed">
                    {m.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}