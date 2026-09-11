import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Backpack, Users, GraduationCap } from 'lucide-react';

const BANDS = [
  {
    key: 'elementary',
    label: 'Elementary',
    grades: 'Grades K to 5',
    icon: Backpack,
    headline: 'Before it becomes a habit.',
    summary:
      'At this age the behavior is still forming. Kids are learning what words do to people, and they can still be taught the difference between telling and tattling before they decide that adults are useless.',
    steps: [
      {
        title: 'The Assembly: "One Good Word"',
        meta: ['30 minutes', 'Whole school', 'Age-appropriate version'],
        description:
          'Jason tells his story at a level built for young students, with no graphic detail. The focus is name-calling, being left out at recess, and what it feels like to be the kid nobody saves a seat for. Ends with the pledge and a wristband for every student.',
      },
      {
        title: 'The Playground Lab',
        meta: ['30 minutes', 'One grade level at a time'],
        description:
          'Three moves, rehearsed out loud until they stop feeling weird: say something to the person being picked on, bring them into what you are doing, and tell an adult. Most of this hour is spent on the difference between tattling and telling, because that is the belief that decides whether a nine year old ever reports anything again.',
      },
      {
        title: 'Words Stick',
        meta: ['30 minutes', 'Grades K to 3'],
        description:
          'A hands-on lesson on what a word does after it leaves your mouth. Replaces the Group Chat Check for students who are not online yet. Grades 4 and 5 run the Group Chat Check instead, built around the games and group chats they actually use.',
      },
      {
        title: 'The Kindness Crew',
        meta: ['15 to 20 students', 'Training day plus monthly check-ins'],
        description:
          'Your student team, nominated by staff. They run the buddy bench, the lunch table welcome, and the pledge drive. Younger students copy slightly older students faster than they copy any adult in the building, and this is how you use that.',
      },
      {
        title: 'Staff Session and Family Night',
        meta: ['60 minutes staff', '60 minute evening family event'],
        description:
          'Teachers, paraprofessionals, lunch staff, and bus drivers on catching the early patterns: exclusion, repeat targets, and the kid whose behavior changed three weeks ago. Plus an evening event so families hear the same words their kids heard.',
      },
    ],
  },
  {
    key: 'middle',
    label: 'Middle School',
    grades: 'Grades 6 to 8',
    icon: Users,
    headline: 'The hardest three years in the building.',
    summary:
      'This is where it peaks. Social rank is the whole game, phones are in every pocket, and most of the conflict that walks into your building in the morning started on a screen the night before.',
    steps: [
      {
        title: 'The Assembly: "One Good Word"',
        meta: ['45 minutes', 'Whole school', 'Gym or auditorium'],
        description:
          "Jason tells his story, students see what bullying and racism cost a real person, and the room learns what ten seconds of somebody else's courage is worth. Ends with the pledge and a wristband every student keeps. Loud, funny in places, honest in others. Not a lecture.",
      },
      {
        title: 'The 10 Second Lab',
        meta: ['45 minutes', 'One grade level at a time'],
        description:
          'Students practice four things they can actually do in the moment: interrupt, redirect, check on the person afterward, and report to an adult. They rehearse the words out loud, in pairs, until saying them stops feeling weird. This is skill practice, not a discussion circle.',
      },
      {
        title: 'Group Chat Check',
        meta: ['45 minutes', 'One grade level at a time'],
        description:
          'Using anonymous, name-scrubbed examples reviewed in advance with school staff, students map the exact point where a joke turns into harm, and what to do at that point.',
      },
      {
        title: 'Student Ambassadors',
        meta: ['15 to 20 students', 'Training day plus monthly 30 minute check-ins'],
        description:
          'A trained student team nominated by your staff, including students who have been on both sides of the problem. They lead the pledge drive, run lunch table welcomes, and give your counselors an early warning system.',
      },
      {
        title: 'Staff Session and Family Night',
        meta: ['60 minutes staff', '60 minute evening family event'],
        description:
          'A professional development hour for teachers, paraprofessionals, bus drivers, and lunch staff on spotting it early and responding consistently. Plus an optional evening event so families hear the same language their kids heard.',
      },
    ],
  },
  {
    key: 'high',
    label: 'High School',
    grades: 'Grades 9 to 12',
    icon: GraduationCap,
    headline: 'Old enough for the whole truth.',
    summary:
      'High schoolers can smell a scripted assembly from the parking lot. So they get the unedited story, the adult consequences, and a conversation about the thing most of them already know is happening and have decided is not their problem.',
    steps: [
      {
        title: 'The Assembly: "One Good Word"',
        meta: ['50 minutes', 'Whole school or by class', 'Unedited version'],
        description:
          'The full story, told straight, including what it cost afterward. Students see a grown man who is still carrying what happened to him at sixteen. Then the turn: the words traded in these hallways are not harmless, and the person deciding how today goes for somebody else is usually a student, not an adult.',
      },
      {
        title: 'The 10 Second Lab',
        meta: ['45 minutes', 'One grade level at a time'],
        description:
          'Built around the bystander problem in a building where everyone has an audience. Students rehearse interrupting without turning it into a fight, checking on somebody privately afterward, and naming racist behavior out loud without escalating the room.',
      },
      {
        title: 'Group Chat Check',
        meta: ['45 minutes', 'One grade level at a time'],
        description:
          'Screenshots, group chats, burner accounts, and what happens when something gets forwarded past the people it was meant for. Includes the part nobody tells them: what follows you onto a job application, a scholarship, and a police report after you turn seventeen.',
      },
      {
        title: 'Student Leaders',
        meta: ['15 to 20 students', 'Training day plus monthly 30 minute check-ins'],
        description:
          'Upperclassmen trained to carry this into freshman orientation, athletics, and clubs. They run the pledge drive, own the culture of their own teams, and give your counseling office a line of sight into what staff never see.',
      },
      {
        title: 'Staff Session and Family Night',
        meta: ['60 minutes staff', '60 minute evening family event'],
        description:
          'A PD hour for teachers, coaches, security, and support staff on responding consistently instead of case by case. Plus an evening event for families, who usually find out last.',
      },
    ],
  },
];

export default function GradeBands() {
  const [ref, inView] = useInView(0.05);
  const [active, setActive] = useState('middle');
  const band = BANDS.find((b) => b.key === active);

  return (
    <section id="grade-bands" className="relative bg-ink py-24 px-6 scroll-mt-16" ref={ref}>
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
          Every Grade Level
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-anton text-cream text-4xl sm:text-5xl text-center mb-6"
        >
          K THROUGH 12.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow text-cream/60 text-center text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          Same five steps, same message, three different rooms. A second grader and a junior do not need the
          same hour, so they do not get the same hour. Pick your building below.
        </motion.p>

        {/* Band selector */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-12">
          {BANDS.map((b) => {
            const Icon = b.icon;
            const isActive = b.key === active;
            return (
              <button
                key={b.key}
                onClick={() => setActive(b.key)}
                aria-pressed={isActive}
                className={`flex items-center justify-center gap-3 px-6 py-4 rounded-sm border transition-all duration-300 ${
                  isActive
                    ? 'bg-gold border-gold text-ink'
                    : 'bg-white/[0.03] border-white/[0.1] text-cream/60 hover:border-gold/40 hover:text-cream'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-left">
                  <span className="block font-barlow-condensed font-bold text-lg tracking-wider uppercase leading-none">
                    {b.label}
                  </span>
                  <span
                    className={`block font-barlow-condensed text-xs tracking-[0.2em] uppercase mt-1 ${
                      isActive ? 'text-ink/70' : 'text-cream/40'
                    }`}
                  >
                    {b.grades}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={band.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="text-center mb-10">
              <h3 className="font-anton text-gold text-3xl sm:text-4xl mb-4">{band.headline}</h3>
              <p className="font-barlow text-cream/60 text-lg max-w-2xl mx-auto leading-relaxed">
                {band.summary}
              </p>
            </div>

            <ol className="space-y-6">
              {band.steps.map((step, i) => (
                <li
                  key={step.title}
                  className="flex gap-5 sm:gap-7 bg-white/[0.03] border border-white/[0.07] rounded-sm p-6 sm:p-8 hover:border-gold/25 transition-all duration-300"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gold flex items-center justify-center shrink-0">
                    <span className="font-anton text-ink text-2xl sm:text-3xl leading-none">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-barlow-condensed text-cream text-2xl font-semibold tracking-wide mb-2">
                      {step.title}
                    </h4>
                    <p className="font-barlow-condensed text-gold/80 text-xs tracking-[0.2em] uppercase mb-3">
                      {step.meta.join('  ·  ')}
                    </p>
                    <p className="font-barlow text-cream/60 text-base leading-relaxed">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>
        </AnimatePresence>

        <p className="font-barlow text-cream/45 text-center text-base max-w-2xl mx-auto mt-12 leading-relaxed">
          K-8 buildings run the elementary version for grades K to 5 and the middle school version for grades 6
          to 8 on the same visit. Flat rates cover buildings up to 900 students either way.
        </p>
      </div>
    </section>
  );
}
