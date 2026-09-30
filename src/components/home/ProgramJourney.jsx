import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, Megaphone, MessagesSquare, Timer, Users } from 'lucide-react';
import ProgramStepsVisual from './ProgramStepsVisual';

// The five steps of the school-year program (details live on /programs).
const STEPS = [
  {
    title: 'One Good Word Assembly',
    blurb: "Jason's story, the pledge, and a wristband for every student.",
    meta: ['Whole school', '45 min'],
    when: 'Fall',
    icon: Megaphone,
    color: '#EF5350',
    glow: 'rgba(239,83,80,0.30)',
  },
  {
    title: 'The 10 Second Lab',
    blurb: 'Students rehearse the words to interrupt, redirect, check in and report.',
    meta: ['One grade at a time', '45 min'],
    when: 'Fall',
    icon: Timer,
    color: '#F59E42',
    glow: 'rgba(245,158,66,0.28)',
  },
  {
    title: 'Group Chat Check',
    blurb: 'Where a joke turns into harm online, and what to do right then.',
    meta: ['One grade at a time', '45 min'],
    when: 'Fall',
    icon: MessagesSquare,
    color: '#F7C948',
    glow: 'rgba(247,201,72,0.24)',
  },
  {
    title: 'Student Ambassadors',
    blurb: 'A trained student team runs the pledge drive and lunch table welcomes.',
    meta: ['15 to 20 students', 'All year'],
    when: 'Through spring',
    icon: Users,
    color: '#4A9BE8',
    glow: 'rgba(74,155,232,0.30)',
  },
  {
    title: 'Staff PD & Family Night',
    blurb: 'Staff learn to spot it early. Families hear the same words their kids did.',
    meta: ['60 min staff', 'Evening event'],
    when: 'Spring',
    icon: GraduationCap,
    color: '#A06CD5',
    glow: 'rgba(160,108,213,0.32)',
  },
];

const STEP_MS = 3400;

/**
 * Animated stand-in for a photo on the School Programs band: the school year
 * plays through its five steps. A rainbow rail fills node by node, the active
 * step's card slides in, and story-style bars at the bottom time each step.
 * Everything that moves is transform or opacity, so it stays smooth on phones.
 * Pauses off screen and on hover; reduced-motion visitors get the static list.
 */
export default function ProgramJourney() {
  const reduce = useReducedMotion();
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [seen, setSeen] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (reduce) return <ProgramStepsVisual />;

  const running = visible && !hover;
  const step = STEPS[active];
  const Icon = step.icon;
  const fill = active / (STEPS.length - 1);

  return (
    <div
      ref={root}
      className="absolute inset-0 overflow-hidden bg-[#08080a]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Colored light that shifts with each step (stacked layers, only opacity changes). */}
      {STEPS.map((s, i) => (
        <div
          key={s.title}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{ opacity: i === active ? 1 : 0, background: `radial-gradient(90% 70% at 78% 30%, ${s.glow}, transparent 70%)` }}
        />
      ))}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)', backgroundSize: '28px 28px', maskImage: 'radial-gradient(circle at 70% 40%, #000, transparent 75%)', WebkitMaskImage: 'radial-gradient(circle at 70% 40%, #000, transparent 75%)' }} />

      <div className="relative h-full flex flex-col px-5 sm:px-8 pt-6 sm:pt-8 pb-5 sm:pb-7">
        {/* Header row */}
        <div className="flex items-center justify-between gap-3">
          <p className="font-barlow-condensed text-gold text-[10px] sm:text-[11px] tracking-[0.22em] sm:tracking-[0.35em] uppercase whitespace-nowrap truncate">Five steps, one school year</p>
          <div className="relative h-6 min-w-[92px] shrink-0 overflow-hidden rounded-full border border-white/15 bg-white/[0.04]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={step.when}
                initial={{ y: 18, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -18, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 grid place-items-center px-3 font-barlow-condensed text-[10px] uppercase tracking-[0.2em] text-cream/85"
              >
                {step.when}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex-1 min-h-0 flex gap-4 sm:gap-6 mt-5 sm:mt-7">
          {/* The rail */}
          <div className="relative w-9 sm:w-10 shrink-0 flex flex-col justify-between py-1">
            <span aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 top-5 bottom-5 w-[2px] bg-white/10 rounded-full" />
            <span
              aria-hidden="true"
              className="absolute left-1/2 -translate-x-1/2 top-5 bottom-5 w-[2px] rounded-full origin-top"
              style={{
                background: 'linear-gradient(to bottom, #EF5350, #F59E42, #F7C948, #94C44A, #4A9BE8, #A06CD5)',
                transform: `scaleY(${fill})`,
                transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
            {STEPS.map((s, i) => {
              const done = i < active;
              const on = i === active;
              return (
                <motion.span
                  key={s.title}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={seen ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.12 * i, type: 'spring', stiffness: 420, damping: 22 }}
                  className="relative z-10 grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-full font-anton text-[11px] sm:text-xs transition-colors duration-500"
                  style={{
                    background: on ? s.color : done ? '#141418' : '#0c0c0f',
                    color: on ? '#0b0b0d' : done ? s.color : 'rgba(245,240,230,0.35)',
                    boxShadow: on ? `0 0 0 4px ${s.glow}, 0 0 24px ${s.glow}` : `inset 0 0 0 1px ${done ? s.color : 'rgba(255,255,255,0.14)'}`,
                  }}
                >
                  <span className="relative">{String(i + 1).padStart(2, '0')}</span>
                </motion.span>
              );
            })}
          </div>

          {/* The active step */}
          <div className="relative flex-1 min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex flex-col justify-center"
              >
                <span
                  aria-hidden="true"
                  className="font-anton leading-none text-[64px] sm:text-[96px] -ml-1"
                  style={{ color: 'transparent', WebkitTextStroke: `1.5px ${step.color}`, opacity: 0.55 }}
                >
                  {String(active + 1).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-2.5 mt-1 sm:mt-2">
                  <motion.span
                    initial={{ rotate: -25, scale: 0.6 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 0.08 }}
                    className="grid place-items-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0"
                    style={{ background: `${step.color}22`, boxShadow: `inset 0 0 0 1px ${step.color}66` }}
                  >
                    <Icon className="w-[18px] h-[18px] sm:w-5 sm:h-5" style={{ color: step.color }} strokeWidth={2} />
                  </motion.span>
                  <h3 className="font-barlow-condensed font-bold text-cream text-lg sm:text-2xl leading-tight tracking-wide uppercase">{step.title}</h3>
                </div>
                <p className="mt-2.5 sm:mt-3 font-barlow text-cream/70 text-[13px] sm:text-base leading-snug">{step.blurb}</p>
                <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5">
                  {step.meta.map((m) => (
                    <span key={m} className="rounded-full px-2.5 py-1 font-barlow-condensed text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-cream/80 bg-white/[0.05] border border-white/10">
                      {m}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Story-style timers: the running bar decides when the next step plays. */}
        <div className="mt-4 sm:mt-6 grid grid-cols-5 gap-1.5" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={s.title} className="relative h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
              {i < active && <span className="absolute inset-0" style={{ background: s.color }} />}
              {i === active && (
                <span
                  key={`run-${active}`}
                  className="absolute inset-0 origin-left"
                  style={{
                    background: s.color,
                    animation: `ogw-step-fill ${STEP_MS}ms linear forwards`,
                    animationPlayState: running ? 'running' : 'paused',
                  }}
                  onAnimationEnd={() => setActive((a) => (a + 1) % STEPS.length)}
                />
              )}
            </span>
          ))}
        </div>
        <p className="sr-only">
          The program runs in five steps across one school year: {STEPS.map((s) => s.title).join(', ')}.
        </p>
      </div>
    </div>
  );
}
