import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { SpinRing } from './ChatFx';

/**
 * The floating bubble. It pops in after the page loads, leans toward the
 * cursor, breathes a soft rainbow glow, pings when it wants attention, and
 * turns into a close button while the chat is open.
 */
export default function ChatLauncher({ open, unread, attention, hideOnPhone, onToggle, onIntent }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [hover, setHover] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 250, damping: 18, mass: 0.4 });

  const onMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 10);
    my.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 10);
  };
  const onLeave = () => {
    setHover(false);
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      className={`ogw-chat-launcher fixed right-4 sm:right-6 z-[71] ${hideOnPhone ? 'max-sm:hidden' : ''}`}
      style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px) + var(--chat-lift, 0px))', transition: 'bottom 400ms cubic-bezier(.2,.8,.2,1)' }}
    >
      {/* "Ask us anything" label that slides out on hover */}
      <AnimatePresence>
        {hover && !open && !attention && (
          <motion.span
            initial={{ opacity: 0, x: 12, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="hidden sm:flex absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 items-center whitespace-nowrap rounded-full bg-[#111114]/95 border border-white/10 px-4 py-2 font-barlow-condensed text-sm uppercase tracking-wider text-cream shadow-xl shadow-black/40 backdrop-blur"
          >
            Ask us anything
          </motion.span>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        type="button"
        onClick={onToggle}
        onPointerEnter={() => {
          setHover(true);
          onIntent?.();
        }}
        onFocus={onIntent}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        aria-label={open ? 'Close chat' : unread ? `Open chat, ${unread} new ${unread === 1 ? 'reply' : 'replies'}` : 'Open chat. Ask us anything'}
        aria-expanded={open}
        className="relative block w-[60px] h-[60px] sm:w-16 sm:h-16 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-rb-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        style={{ x, y }}
        initial={reduce ? false : { scale: 0, rotate: -120, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 15, delay: reduce ? 0 : 1.1 }}
        whileHover={reduce ? undefined : { scale: 1.07 }}
        whileTap={{ scale: 0.9 }}
      >
        {/* Breathing glow */}
        <span
          aria-hidden="true"
          className="absolute -inset-4 rounded-full ogw-breathe"
          style={{
            background:
              'radial-gradient(closest-side, rgba(247,201,72,0.55), rgba(239,83,80,0.35) 45%, rgba(74,155,232,0.25) 70%, transparent)',
          }}
        />

        {/* Attention pings */}
        {attention && !reduce &&
          [0, 0.6].map((d) => (
            <span key={d} aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-rb-yellow opacity-0 ogw-ping" style={{ animationDelay: `${d}s` }} />
          ))}

        <SpinRing width={3} speed={open ? 'animate-spin' : 'animate-spin-slow'} glow={false} />

        {/* Face */}
        <span className="absolute inset-[3px] rounded-full bg-[#0b0b0d] overflow-hidden grid place-items-center">
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                className="text-cream"
              >
                <X className="w-6 h-6" />
              </motion.span>
            ) : (
              <motion.span
                key="logo"
                className="relative block w-full h-full"
                initial={{ rotate: 90, scale: 0.4, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0.4, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              >
                <img src="/brand/logo-128.webp" alt="" className="w-full h-full object-cover" draggable={false} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        {/* Speech badge */}
        {!open && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -left-1 grid place-items-center w-6 h-6 rounded-full bg-gold text-ink shadow-lg shadow-black/40 ogw-wiggle"
          >
            <MessageCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
          </span>
        )}

        {/* Unread count */}
        <AnimatePresence>
          {unread > 0 && !open && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 rounded-full bg-rb-red text-white font-barlow-condensed font-bold text-xs grid place-items-center ring-2 ring-black"
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
