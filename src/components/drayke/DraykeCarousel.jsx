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
          {/* Ornamental double frame */}
          <div className="relative mx-auto max-w-3xl p-2 md:p-3 border border-gold/30 rounded-sm">
            <div className="border border-gold/50 rounded-sm bg-black/40">
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

            {/* Corner accents */}
            <span className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-gold" aria-hidden="true" />
            <span className="absolute -top-px -right-px w-6 h-6 border-t-2 border-r-2 border-gold" aria-hidden="true" />
            <span className="absolute -bottom-px -left-px w-6 h-6 border-b-2 border-l-2 border-gold" aria-hidden="true" />
            <span className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-gold" aria-hidden="true" />
          </div>

          {/* Arrows */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 bg-ink/70 hover:bg-gold hover:text-ink text-gold border border-gold/40 rounded-full p-2.5 transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 bg-ink/70 hover:bg-gold hover:text-ink text-gold border border-gold/40 rounded-full p-2.5 transition-colors"
          >
            <ChevronRight size={22} />
          </button>
        </motion.div>

        {/* Caption */}
        <div className="h-16 flex items-center justify-center mt-6">
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

        {/* Dots */}
        <div className="flex items-center justify-center gap-2.5 mt-2">
          {CAROUSEL_PHOTOS.map((p, i) => (
            <button
              key={p.alt}
              onClick={() => setIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === index ? 'w-6 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-cream/30 hover:bg-cream/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}