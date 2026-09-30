import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartHandshake, ArrowRight } from 'lucide-react';
import RainbowRing from '@/components/fx/RainbowRing';
import PuzzleField from '@/components/fx/PuzzleField';
import SpotlightHero from '@/components/fx/SpotlightHero';
import CountUp from '@/components/fx/CountUp';

const SCRIPTURES = [
  {
    verse: '"I can do all things through Christ who strengthens me."',
    ref: 'Philippians 4:13',
  },
  {
    verse: '"Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven."',
    ref: 'Matthew 5:16 (KJV)',
  },
];

const rise = (delay, y = 24) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] },
});

export default function HeroSection({ logoUrl, pledgeCount }) {
  const [scriptureIndex, setScriptureIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setScriptureIndex((i) => (i + 1) % SCRIPTURES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-black overflow-hidden pt-24 pb-20 lg:pt-20">
      {/* Color field: the logo's ring colors as soft light */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[620px] h-[620px] rounded-full blur-[140px] opacity-[0.22]" style={{ background: 'var(--rb-red)' }} />
        <div className="absolute top-1/4 -right-48 w-[640px] h-[640px] rounded-full blur-[150px] opacity-[0.22]" style={{ background: 'var(--rb-blue)' }} />
        <div className="absolute -bottom-56 left-1/4 w-[640px] h-[640px] rounded-full blur-[160px] opacity-[0.2]" style={{ background: 'var(--rb-purple)' }} />
        <div className="absolute top-1/2 left-1/2 w-[420px] h-[420px] rounded-full blur-[140px] opacity-[0.12]" style={{ background: 'var(--rb-yellow)' }} />
      </div>
      <PuzzleField count={18} seed={11} />
      <SpotlightHero />
      <div className="grain-overlay" style={{ opacity: 0.08 }} />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-10 items-center">
          {/* Logo, first on phones */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[30rem] lg:h-[30rem] animate-float">
              <RainbowRing />
              <img
                src={logoUrl}
                alt="One Good Word One Good Deed logo: two hands clasped over a rainbow puzzle heart, Stop Bullying, Stop Racism"
                className="relative w-full h-full rounded-full object-cover"
                style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.65))' }}
              />
            </div>
          </motion.div>

          {/* Message */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <motion.p {...rise(0.25, 16)} className="inline-flex items-center gap-3 font-barlow-condensed text-cream/80 text-[11px] sm:text-sm tracking-[0.4em] uppercase mb-6">
              <span className="rainbow-rule w-8 rounded-full" aria-hidden="true" />
              A Movement of Love Over Hate
            </motion.p>

            <motion.h1
              {...rise(0.4, 36)}
              className="font-anton text-white text-[3.6rem] leading-[0.88] sm:text-8xl lg:text-[8.5rem] tracking-tight mb-6"
            >
              STAND UP.
              <br />
              <span className="text-gold">SPEAK LOVE.</span>
            </motion.h1>

            <motion.p {...rise(0.6)} className="font-barlow text-cream/75 text-base sm:text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed mb-9">
              One Good Word...One Good Deed was created to stand up against bullying and racism through God's love.
              It starts with one word. It grows with one deed.
            </motion.p>

            <motion.div {...rise(0.75)} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-10">
              <Link
                to="/pledge-wall"
                className="group w-full sm:w-auto min-h-[56px] inline-flex items-center justify-center gap-2 px-9 py-4 bg-gold text-ink font-barlow-condensed font-bold text-xl uppercase tracking-wider rounded-sm hover:-translate-y-1"
              >
                Take the Pledge <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/donate"
                className="rainbow-border w-full sm:w-auto min-h-[56px] inline-flex items-center justify-center gap-2 px-9 py-4 rounded-sm text-cream font-barlow-condensed font-bold text-xl uppercase tracking-wider bg-white/[0.03] hover:bg-white/[0.07] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
              >
                <HeartHandshake className="w-5 h-5" /> Donate
              </Link>
            </motion.div>
            <motion.p {...rise(0.82, 10)} className="-mt-6 mb-10 font-barlow text-sm text-cream/50">
              Or{' '}
              <a href="https://www.facebook.com/groups/1332878885346719" target="_blank" rel="noopener noreferrer" className="text-cream/80 underline decoration-rb-purple decoration-2 underline-offset-4 hover:text-white">
                join the movement on Facebook
              </a>
            </motion.p>

            {/* Proof + scripture */}
            <motion.div {...rise(0.9)} className="grid sm:grid-cols-[auto_1fr] gap-4 sm:gap-6 items-stretch max-w-xl mx-auto lg:mx-0">
              <Link to="/pledge-wall" className="rainbow-border rounded-sm bg-white/[0.03] backdrop-blur-sm px-6 py-4 text-center sm:text-left glow-hover">
                <p className="font-anton text-4xl sm:text-5xl leading-none text-rainbow">
                  <CountUp value={pledgeCount} />
                </p>
                <p className="font-barlow-condensed text-cream/60 text-xs tracking-[0.25em] uppercase mt-2">People have taken the pledge</p>
              </Link>

              <div className="rainbow-border rounded-sm bg-white/[0.03] backdrop-blur-sm px-6 py-4 text-center sm:text-left">
                <p className="font-barlow-condensed text-gold text-[10px] tracking-[0.35em] uppercase mb-2">Scripture</p>
                <div className="relative h-24 sm:h-[5.5rem]">
                  {SCRIPTURES.map((s, i) => (
                    <motion.div
                      key={s.ref}
                      initial={false}
                      animate={{ opacity: i === scriptureIndex ? 1 : 0, y: i === scriptureIndex ? 0 : 8 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute inset-0"
                      aria-hidden={i !== scriptureIndex}
                    >
                      <p className="font-barlow text-cream text-sm sm:text-base leading-snug italic">{s.verse}</p>
                      <p className="font-barlow-condensed text-cream/50 text-xs tracking-widest uppercase mt-2">{s.ref}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
