import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Heart, School, Users } from 'lucide-react';

const PILLARS = [
  {
    icon: Heart,
    title: 'Born From Personal Pain',
    body: 'Jason Lewis witnessed firsthand the devastating effects of bullying and racism — not just on individuals, but on entire communities. After seeing too many young lives diminished by hate, he knew silence was no longer an option.',
  },
  {
    icon: School,
    title: 'Taking It to the Schools',
    body: 'Jason\'s mission is simple: go directly into classrooms, gyms, and auditoriums to speak with students. His message — that one kind word and one good deed can change everything — resonates with kids of all ages and backgrounds.',
  },
  {
    icon: Users,
    title: 'A Community-Wide Movement',
    body: 'Partnering with Wayne-Westland Community Schools and expanding outward, Jason is building a network of change-makers who believe that love, God, and action are more powerful than hate.',
  },
];

export default function FoundingStory() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="relative bg-cream py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-1 bg-gold mb-10 origin-left"
        />

        <div className="grid md:grid-cols-2 gap-16 items-start mb-20">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-barlow-condensed text-gold-dark text-xs tracking-[0.3em] uppercase mb-4"
            >
              The Founding Story
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-anton text-ink text-5xl sm:text-6xl leading-[0.95] mb-6"
            >
              WHY JASON<br />STARTED THIS.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-5"
          >
            <p className="font-barlow text-ink/70 text-lg leading-relaxed">
              One Good Word...One Good Deed was not born in a boardroom. It was born in the 
              heart of a man who refused to let hatred win. Jason Lewis saw the way bullying 
              and racism were tearing apart the young people around him — stealing confidence, 
              crushing dreams, and in the worst cases, taking lives.
            </p>
            <p className="font-barlow text-ink/70 text-lg leading-relaxed">
              Grounded in his Christian faith, Jason believed that God's love was the antidote — 
              and that every person has the power to make a difference with a single kind word 
              and a single good deed. So he built a movement around exactly that.
            </p>
            <p className="font-barlow text-ink/70 text-lg leading-relaxed">
              Today, he takes that message into schools, churches, and community events, 
              partnering with educators and leaders to create environments where every student 
              feels safe, valued, and seen.
            </p>
          </motion.div>
        </div>

        {/* Partnership highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-ink rounded-sm p-8 md:p-12 mb-20 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-gold to-transparent" />
          <div className="relative z-10">
            <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-3">
              Official Partnership
            </p>
            <h3 className="font-anton text-cream text-3xl sm:text-4xl mb-4 leading-tight">
              WAYNE-WESTLAND<br />COMMUNITY SCHOOLS
            </h3>
            <p className="font-barlow text-cream/60 text-lg max-w-2xl leading-relaxed">
              Jason's partnership with Wayne-Westland Community Schools represents a landmark 
              commitment to bringing anti-bullying and anti-racism education directly into the 
              classroom. Through assemblies, workshops, and ongoing engagement, the movement 
              is reaching thousands of students across the district.
            </p>
          </div>
        </motion.div>

        {/* Three pillars */}
        <div className="grid md:grid-cols-3 gap-8">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="border-t border-ink/10 pt-6"
            >
              <pillar.icon className="w-6 h-6 text-gold-dark mb-4" />
              <h4 className="font-barlow-condensed text-ink font-bold text-lg uppercase tracking-wide mb-3">
                {pillar.title}
              </h4>
              <p className="font-barlow text-ink/60 text-base leading-relaxed">
                {pillar.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}