import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { INTENT_LABELS } from '@/lib/chat';
import { Avatar } from './ChatFx';

/** Types the line out one character at a time. */
function useTyped(text, active) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) {
      setN(0);
      return undefined;
    }
    if (reduce) {
      setN(text.length);
      return undefined;
    }
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) clearInterval(t);
    }, 22);
    return () => clearInterval(t);
  }, [text, active, reduce]);
  return text.slice(0, n);
}

/** The small nudge that pops out of the bubble once per visit. */
export default function ChatTeaser({ show, text, chips = [], onOpen, onChip, onClose }) {
  const typed = useTyped(text || '', show);
  const done = typed.length >= (text || '').length;

  return (
    <AnimatePresence>
      {show && text && (
        <motion.div
          className="ogw-chat-teaser fixed right-4 sm:right-6 z-[71] w-[min(300px,calc(100vw-2rem))] origin-bottom-right"
          style={{ bottom: 'calc(5.5rem + max(var(--tabbar-h, 0px), env(safe-area-inset-bottom, 0px)) + var(--chat-lift, 0px))' }}
          initial={{ opacity: 0, scale: 0.5, y: 30, rotate: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          role="dialog"
          aria-label="Chat suggestion"
        >
          <div className="relative rounded-2xl p-[1px] overflow-hidden shadow-2xl shadow-black/60">
            <span aria-hidden="true" className="absolute -inset-[60%] animate-spin-slow ogw-spin-layer" style={{ background: 'var(--rainbow-conic)' }} />
            <div className="relative rounded-[15px] bg-[#0f0f12] p-4 pr-9">
              <button
                type="button"
                onClick={onClose}
                aria-label="Dismiss"
                className="absolute top-2.5 right-2.5 w-7 h-7 grid place-items-center rounded-full text-cream/40 hover:text-cream hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <button type="button" onClick={onOpen} className="flex items-start gap-3 text-left">
                <Avatar size={34} />
                <span className="font-barlow text-[15px] leading-snug text-cream min-h-[3.6em]">
                  {typed}
                  {!done && <span className="inline-block w-[2px] h-[1em] -mb-[2px] ml-0.5 bg-rb-yellow animate-pulse" aria-hidden="true" />}
                </span>
              </button>
              <motion.div
                className="flex flex-wrap gap-2 mt-3 pl-[46px]"
                initial="hide"
                animate={done ? 'show' : 'hide'}
                variants={{ show: { transition: { staggerChildren: 0.08 } } }}
              >
                {chips.map((c) => (
                  <motion.button
                    key={c}
                    type="button"
                    onClick={() => onChip(c)}
                    variants={{ hide: { opacity: 0, y: 8, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/[0.1] hover:border-white/30 px-3 py-1.5 font-barlow-condensed text-xs uppercase tracking-wider text-cream/90 transition-colors"
                  >
                    {INTENT_LABELS[c]}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </div>
          {/* Tail pointing at the bubble */}
          <span aria-hidden="true" className="absolute -bottom-1.5 right-7 w-3 h-3 rotate-45 bg-[#0f0f12] border-r border-b border-white/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
