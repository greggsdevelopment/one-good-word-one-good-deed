import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { CAROUSEL_PHOTOS } from './draykePhotos';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };
const SCRIPT = { fontFamily: "'Great Vibes', cursive" };
const AUTOPLAY_MS = 6000;

export default function DraykeCarousel() {
  const [sectionRef, inView] = useInView(0.15);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const count = CAROUSEL_PHOTOS.length;

  const go = useCallback((next) => {
    setIndex((prev) => (prev + next + count) % count);
  }, [count]);

  useEffect(() => {
    if (paused) return undefined;
    timerRef.current = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, go]);

  const photo = CAROUSEL_PHOTOS[index];

  return (
    <section className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden" ref={sectionRef}>
      {/* Soft gold glow behind the frame */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 45%, rgba(230,180,80,0.08) 0%, rgba(11,11,13,0) 60%)' }}
      />

      <div className="relative max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center text-gold text-4xl md:text-5xl mb-3"
          style={SCRIPT}
        >
          His light, in pictures
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center font-barlow-condensed text-cream/60 text-xs tracking-[0.3em] uppercase mb-12"
        >
          Shared by the family who loves him
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
 {/* Ornamental double-line frame with corner flourishes */}
          <div className="relative mx-auto max-w-3xl">
            {/* Soft spotlight glow hugging the frame */}
            <div
              className="absolute -inset-8 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(230,180,80,0.12) 0%, rgba(11,11,13,0) 70%)' }}
              aria-hidden="true"
            />
            <div className="relative border border-gold/35">
              {/* Inner hairline for the double-line effect */}
              <div className="absolute inset-[5px] border border-gold/20 pointer-events-none" aria-hidden="true" />
              <div className="relative bg-black/40">
                <div className="relative h-[58vh] min-h-[380px] max-h-[640px] flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={index}
                      src={photo.src}
                      alt={photo.alt}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="max-h-full max-w-full object-contain"
                    />
                  </AnimatePresence>
                </div>
              </div>

              {/* Corner flourishes — thin filigree L with a small node */}
              <svg className="absolute -top-3 -left-3 text-gold/80" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                <path d="M2 14 V2 H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <circle cx="2" cy="2" r="1.1" fill="currentColor" />
              </svg>
              <svg className="absolute -top-3 -right-3 text-gold/80" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}>
                <path d="M2 14 V2 H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <circle cx="2" cy="2" r="1.1" fill="currentColor" />
              </svg>
              <svg className="absolute -bottom-3 -left-3 text-gold/80" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" style={{ transform: 'scaleY(-1)' }}>
                <path d="M2 14 V2 H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <circle cx="2" cy="2" r="1.1" fill="currentColor" />
              </svg>
              <svg className="absolute -bottom-3 -right-3 text-gold/80" width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true" style={{ transform: 'scale(-1, -1)' }}>
                <path d="M2 14 V2 H14" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <circle cx="2" cy="2" r="1.1" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Arrows — minimal thin gold chevrons, no chrome */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-2 md:-left-8 top-1/2 -translate-y-1/2 text-gold/55 hover:text-gold transition-colors p-1"
            style={SERIF}
          >
            <ChevronLeft size={26} strokeWidth={1} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-2 md:-right-8 top-1/2 -translate-y-1/2 text-gold/55 hover:text-gold transition-colors p-1"
            style={SERIF}
          >
            <ChevronRight size={26} strokeWidth={1} />
          </button>
        </motion.div>

        {/* Caption */}
        <div className="h-16 flex items-center justify-center mt-10">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5 }}
              className="text-cream/85 text-xl md:text-2xl italic text-center px-6"
              style={SERIF}
            >
              {photo.caption}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Diamond pagination */}
        <div className="flex items-center justify-center gap-3 mt-3">
          {CAROUSEL_PHOTOS.map((p, i) => (
            <button
              key={p.alt}
              onClick={() => setIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              className="transition-all duration-300"
            >
              <span
                className={`block rotate-45 transition-all duration-300 ${
                  i === index
                    ? 'w-2.5 h-2.5 bg-gold shadow-[0_0_8px_rgba(230,180,80,0.7)]'
                    : 'w-1.5 h-1.5 bg-cream/25 hover:bg-gold/60'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}