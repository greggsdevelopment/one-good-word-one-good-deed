import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { HERO_PHOTO } from './draykePhotos';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };
const VIDEO_ID = 'bIB8EWqCPrQ';
const EMBED_SRC = `https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`;

const DEDICATION =
  'Some kids get a whole lifetime of songs. Drayke got twelve years. This one is his. We play it for the boy in the Pikachu onesie, the Lego builder, the kid who hugged first and asked questions later, and for Samie and Andy, who turned the worst day of their lives into a warning that protects other families. Sit with it for a minute, then go say one good word to a kid who needs it.';

function CornerFlourish({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 14 V2 H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <circle cx="2" cy="2" r="1.1" fill="currentColor" />
    </svg>
  );
}

export default function MemorialSong() {
  const [ref, inView] = useInView(0.15);
  const [playing, setPlaying] = useState(false);

  return (
    <section ref={ref} className="relative bg-ink py-20 md:py-28 px-6 overflow-hidden">
      {/* Soft gold glow behind the panel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(230,180,80,0.08) 0%, rgba(11,11,13,0) 60%)' }}
      />

      <div className="relative max-w-2xl mx-auto text-center">
        {/* Serif eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-gold text-sm md:text-base tracking-[0.4em] uppercase mb-5"
          style={SERIF}
        >
          Our Song For Drayke
        </motion.p>

        {/* Dedication paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-cream/75 text-base md:text-lg leading-relaxed italic mx-auto mb-8"
          style={{ ...SERIF, maxWidth: '640px' }}
        >
          {DEDICATION}
        </motion.p>

        {/* Small gold diamond accent */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <span className="h-px w-8 bg-gold/30" />
          <span className="block rotate-45 w-1.5 h-1.5 bg-gold/70" />
          <span className="h-px w-8 bg-gold/30" />
        </motion.div>

        {/* Ornamental double-line frame */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto"
        >
          {/* Soft spotlight glow hugging the frame */}
          <div
            className="absolute -inset-6 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(230,180,80,0.12) 0%, rgba(11,11,13,0) 70%)' }}
            aria-hidden="true"
          />
          <div className="relative border border-gold/35">
            {/* Inner hairline for the double-line effect (poster only, never over the iframe) */}
            {!playing && (
              <div className="absolute inset-[5px] border border-gold/20 pointer-events-none" aria-hidden="true" />
            )}
            <div className="relative bg-black/40 aspect-video overflow-hidden">
              {playing ? (
                <iframe
                  src={EMBED_SRC}
                  title="Ed Sheeran - Supermarket Flowers [Official Audio]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              ) : (
                <button
                  onClick={() => setPlaying(true)}
                  aria-label="Play Supermarket Flowers by Ed Sheeran"
                  className="group relative block w-full h-full"
                >
                  {/* Poster image with slow Ken Burns */}
                  <motion.img
                    src={HERO_PHOTO}
                    alt="Drayke shading his eyes and smiling, 2021"
                    className="absolute inset-0 w-full h-full object-cover"
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* Soft dark gradient scrim over the lower portion */}
                  <span
                    className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(11,11,13,0.85) 0%, rgba(11,11,13,0) 100%)' }}
                    aria-hidden="true"
                  />
                  {/* Large circular gold play button centered over the photo */}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gold/95 shadow-[0_0_30px_rgba(230,180,80,0.45)] transition-transform duration-300 group-hover:scale-105">
                      <span className="absolute inset-0 rounded-full border border-gold/40 scale-110" aria-hidden="true" />
                      <svg width="24" height="28" viewBox="0 0 24 28" fill="none" aria-hidden="true">
                        <path d="M3 3 L22 14 L3 25 Z" fill="#0b0b0d" stroke="#0b0b0d" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </span>
                </button>
              )}
            </div>

            {/* Corner flourishes */}
            <CornerFlourish className="absolute -top-3 -left-3 text-gold/80" />
            <CornerFlourish className="absolute -top-3 -right-3 text-gold/80" style={{ transform: 'scaleX(-1)' }} />
            <CornerFlourish className="absolute -bottom-3 -left-3 text-gold/80" style={{ transform: 'scaleY(-1)' }} />
            <CornerFlourish className="absolute -bottom-3 -right-3 text-gold/80" style={{ transform: 'scale(-1, -1)' }} />
          </div>
        </motion.div>

        {/* Italic serif caption */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-cream/80 text-lg md:text-xl italic mt-8"
          style={SERIF}
        >
          Supermarket Flowers by Ed Sheeran
        </motion.p>
      </div>
    </section>
  );
}