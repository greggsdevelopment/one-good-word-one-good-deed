import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';

const STATS = [
  { value: '1 in 5', label: 'students ages 12 to 18 report being bullied at school during the school year' },
  { value: '88%', label: 'of bullying episodes happen with other students watching' },
  { value: '10 sec', label: 'is how fast bullying stops when a peer steps in, in most cases' },
];

export default function ImpactStatsBanner() {
  const [ref, inView] = useInView({ threshold: 0.2 });

  return (
    <section ref={ref} className="py-16 px-6 bg-gold/10 border-y border-gold/20">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase text-center mb-10"
        >
          The problem your building already knows about
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.value}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <p className="font-anton text-gold text-5xl sm:text-6xl leading-none mb-3">{stat.value}</p>
              <p className="font-barlow text-cream/60 text-sm leading-relaxed max-w-[240px] mx-auto">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-12 bg-ink/60 border border-gold/20 rounded-sm p-6 sm:p-8 text-center"
        >
          <p className="font-barlow-condensed text-cream text-xl sm:text-2xl font-semibold tracking-wide mb-3">
            The most underused resource in your school is already sitting in the gym.
          </p>
          <p className="font-barlow text-cream/60 text-base leading-relaxed max-w-2xl mx-auto">
            Adults are not present for most of it. Students are. Our entire program is built to move the
            average student from watching to acting, and to give them words they can actually say out loud
            in a hallway without losing status.
          </p>
        </motion.div>

        <p className="font-barlow text-cream/35 text-xs leading-relaxed text-center max-w-3xl mx-auto mt-8">
          Sources: National Center for Education Statistics, School Crime Supplement (2021 to 2022 school year);
          Hawkins, Pepler and Craig (2001), Social Development, which found peers present in 88 percent of
          bullying episodes, intervening in 19 percent of them, and that when they did intervene bullying
          stopped within 10 seconds in 57 percent of cases.
        </p>
      </div>
    </section>
  );
}