import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { RotateCw } from 'lucide-react';

const TRIGGER = 70;
const MAX = 120;

/**
 * Pull down at the top of any page to refresh it, like a native app. The
 * browser's own bounce is turned off in CSS, so this is the only pull gesture.
 * Ignored inside dialogs, the chat, form fields, and anything marked
 * data-no-ptr, and while a full-screen panel has locked the page.
 */
export default function PullToRefresh({ onRefresh }) {
  const pull = useMotionValue(0);
  const rotate = useTransform(pull, [0, MAX], [0, 300]);
  const opacity = useTransform(pull, [0, 24, TRIGGER], [0, 0.6, 1]);
  const [busy, setBusy] = useState(false);
  const [armed, setArmed] = useState(false);
  const busyRef = useRef(false);
  const cb = useRef(onRefresh);
  cb.current = onRefresh;

  useEffect(() => {
    if (!('ontouchstart' in window)) return undefined;
    let startY = null;
    let dist = 0;
    const blocked = (target) =>
      document.body.style.overflow === 'hidden' ||
      Boolean(target?.closest?.('[data-no-ptr], [role="dialog"], input, textarea, select, [contenteditable="true"]'));

    const onStart = (e) => {
      startY = null;
      if (busyRef.current || e.touches.length !== 1 || window.scrollY > 0 || blocked(e.target)) return;
      startY = e.touches[0].clientY;
      dist = 0;
    };
    const onMove = (e) => {
      if (startY === null) return;
      const dy = e.touches[0].clientY - startY;
      if (dy <= 0 || window.scrollY > 0) {
        dist = 0;
        pull.set(0);
        setArmed(false);
        return;
      }
      dist = Math.min(MAX, dy * 0.5);
      pull.set(dist);
      setArmed(dist >= TRIGGER);
    };
    const onEnd = async () => {
      if (startY === null) return;
      startY = null;
      if (dist >= TRIGGER) {
        busyRef.current = true;
        setBusy(true);
        pull.set(56);
        try {
          await Promise.all([cb.current?.(), new Promise((r) => setTimeout(r, 700))]);
        } finally {
          busyRef.current = false;
          setBusy(false);
          setArmed(false);
          pull.set(0);
        }
      } else {
        pull.set(0);
        setArmed(false);
      }
      dist = 0;
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    window.addEventListener('touchcancel', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
      window.removeEventListener('touchcancel', onEnd);
    };
  }, [pull]);

  return (
    <motion.div
      aria-hidden={!busy}
      role={busy ? 'status' : undefined}
      aria-label={busy ? 'Refreshing' : undefined}
      className="pointer-events-none fixed left-1/2 z-[80] -ml-5"
      style={{ top: 'calc(env(safe-area-inset-top, 0px) + 14px)', y: pull, opacity }}
    >
      <span className={`grid place-items-center w-10 h-10 rounded-full bg-[#0b0b0d] border shadow-xl shadow-black/60 transition-colors ${armed || busy ? 'border-rb-yellow text-rb-yellow' : 'border-white/15 text-cream/70'}`}>
        <motion.span style={{ rotate }} className={busy ? 'animate-spin' : ''}>
          <RotateCw className="w-5 h-5" />
        </motion.span>
      </span>
    </motion.div>
  );
}
