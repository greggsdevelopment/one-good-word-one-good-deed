import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Quote } from 'lucide-react';

const VOICES = [
  {
    quote: "Jason's presentation changed the way I think about my words. I used to say things without thinking. Now I pause and ask myself — is this a good word?",
    name: "Marcus T.",
    role: "8th Grade Student",
    school: "Troy Middle School",
  },
  {
    quote: "I've seen a hundred assemblies. This was different. My students were still talking about it a week later. The message truly landed.",
    name: "Ms. Patricia L.",
    role: "7th Grade English Teacher",
    school: "Rochester Hills Academy",
  },
  {
    quote: "I wore my wristband every single day. It reminds me to do one kind thing before I go home. It became a habit.",
    name: "Aaliyah M.",
    role: "10th Grade Student",
    school: "Oak Park High School",
  },
  {
    quote: "As a principal, I'm always looking for programs with real, lasting impact. Jason's visit reduced disciplinary incidents noticeably in the following weeks.",
    name: "Dr. Kevin R.",
    role: "School Principal",
    school: "Ferndale K-8",
  },
  {
    quote: "I never thought about how my words affected other people until Jason told his story. I went home and apologized to my little brother that same night.",
    name: "Darius W.",
    role: "6th Grade Student",
    school: "Berkley Elementary",
  },
  {
    quote: "The faith-based component resonated deeply with our community. Jason spoke truth without preaching. The students listened — really listened.",
    name: "Coach Tamara S.",
    role: "Athletic Director",
    school: "Bishop Foley High",
  },
  {
    quote: "What I loved most was the pledge. My class made it their own. They hold each other accountable now in ways I never could have manufactured as a teacher.",
    name: "Mr. James O.",
    role: "5th Grade Teacher",
    school: "Madison Elementary",
  },
  {
    quote: "He made me feel like my story mattered. Like I could be the one to change the culture at my school. That's a big deal when you're 14.",
    name: "Sophie K.",
    role: "9th Grade Student",
    school: "Clawson High School",
  },
];

function TestimonialCard({ voice }) {
  return (
    <div className="flex-shrink-0 w-80 md:w-96 bg-white/[0.04] border border-white/[0.07] rounded-sm p-7 mx-3 hover:border-gold/20 transition-all duration-300 group">
      <Quote className="w-6 h-6 text-gold/40 mb-4 group-hover:text-gold/60 transition-colors" />
      <p className="font-barlow text-cream/75 text-sm leading-relaxed mb-6 italic">
        &ldquo;{voice.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
          <span className="font-anton text-gold text-sm">{voice.name.charAt(0)}</span>
        </div>
        <div>
          <p className="font-barlow-condensed text-cream font-semibold text-sm tracking-wide">{voice.name}</p>
          <p className="font-barlow text-cream/40 text-xs">{voice.role} — {voice.school}</p>
        </div>
      </div>
    </div>
  );
}

function InfiniteTrack({ voices, direction = 1, speed = 40 }) {
  const trackRef = useRef(null);
  const posRef = useRef(0);
  const animRef = useRef(null);
  const doubled = [...voices, ...voices];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cardWidth = 340 + 24; // card width + gap (mx-3 = 12px each side)
    const totalWidth = cardWidth * voices.length;

    const animate = () => {
      posRef.current += (0.5 * direction);
      if (direction > 0 && posRef.current >= totalWidth) posRef.current -= totalWidth;
      if (direction < 0 && posRef.current <= 0) posRef.current += totalWidth;
      track.style.transform = `translateX(-${posRef.current}px)`;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [voices.length, direction]);

  return (
    <div className="overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
      <div ref={trackRef} className="flex will-change-transform">
        {doubled.map((voice, i) => (
          <TestimonialCard key={i} voice={voice} />
        ))}
      </div>
    </div>
  );
}

export default function VoicesOfChange() {
  const [ref, inView] = useInView(0.1);
  const row1 = VOICES.slice(0, 4);
  const row2 = VOICES.slice(4, 8);

  return (
    <section className="relative bg-ink py-24 md:py-32 overflow-hidden" ref={ref}>
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16 px-6">
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
            Real Impact. Real People.
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-anton text-cream text-5xl sm:text-6xl md:text-7xl leading-[0.92] mb-6"
          >
            VOICES OF<br />
            <span className="text-gold">CHANGE</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-barlow text-cream/50 text-lg max-w-xl mx-auto"
          >
            Students and educators share how one assembly sparked a lasting shift in culture and kindness.
          </motion.p>
        </div>

        {/* Scrolling rows */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col gap-5"
        >
          <InfiniteTrack voices={row1} direction={1} />
          <InfiniteTrack voices={row2} direction={-1} />
        </motion.div>
      </div>
    </section>
  );
}