import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

// One slot swaps every STEP_MS, round-robin, so the wall ripples
// instead of blinking all at once.
const STEP_MS = 1100;

function useSlotCount() {
  const read = () => {
    if (typeof window === 'undefined') return 12;
    if (window.innerWidth >= 1024) return 12;
    if (window.innerWidth >= 640) return 8;
    return 4;
  };

  const [count, setCount] = useState(read);

  useEffect(() => {
    const onResize = () => setCount(read());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return count;
}

function WallCard({ pledge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
      transition={{ duration: 1.15, ease: 'easeOut' }}
      className="absolute inset-0 flex flex-col justify-between rounded-sm border border-gold/15 bg-white/[0.03] p-5 overflow-hidden"
    >
      <span className="absolute top-2 right-3 text-gold/20 text-4xl leading-none select-none" style={SERIF} aria-hidden="true">
        &rdquo;
      </span>

      <p
        className="relative text-cream/85 text-[15px] leading-relaxed italic line-clamp-4"
        style={SERIF}
      >
        {pledge.pledge_statement || 'I pledge one good word and one good deed, every day.'}
      </p>

      <div className="relative mt-4 pt-3 border-t border-gold/10">
        <p className="font-barlow-condensed text-cream text-sm font-semibold tracking-wide">
          {pledge.first_name}
          {pledge.last_initial ? ` ${pledge.last_initial}.` : ''}
        </p>
        {pledge.city && (
          <p className="flex items-center gap-1 font-barlow text-gold/60 text-xs mt-0.5">
            <MapPin className="w-3 h-3" />
            {pledge.city}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/**
 * The pledge wall as a cinematic loop: a grid of slots, each holding one real
 * pledge, fading in and out on a staggered rotation until every signee has had
 * their moment on screen.
 */
export default function CinematicWall({ pledges }) {
  const slotCount = useSlotCount();
  const total = pledges.length;

  const [slots, setSlots] = useState([]);
  const cursor = useRef(0);
  const nextIndex = useRef(0);

  // Seed the wall whenever the pool or the visible slot count changes.
  useEffect(() => {
    if (!total) {
      setSlots([]);
      return;
    }
    const visible = Math.min(slotCount, total);
    const seeded = Array.from({ length: visible }, (_, i) => i % total);
    setSlots(seeded);
    cursor.current = 0;
    nextIndex.current = visible % total;
  }, [total, slotCount]);

  // Advance one slot at a time.
  useEffect(() => {
    if (!total || total <= slotCount) return undefined;
    const id = setInterval(() => {
      setSlots((prev) => {
        if (!prev.length) return prev;
        const next = [...prev];
        next[cursor.current % prev.length] = nextIndex.current % total;
        cursor.current += 1;
        nextIndex.current += 1;
        return next;
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, [total, slotCount]);

  if (!total) {
    return (
      <div className="text-center py-24">
        <p className="text-cream/40 text-lg italic" style={SERIF}>
          The wall is waiting for its first name.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {slots.map((pledgeIndex, slot) => {
          const pledge = pledges[pledgeIndex];
          if (!pledge) return null;
          return (
            <div key={slot} className="relative h-44 sm:h-48">
              <AnimatePresence mode="wait">
                <WallCard key={pledge.id || pledgeIndex} pledge={pledge} />
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}