import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { ChevronDown, Minus, RotateCcw } from 'lucide-react';
import { INTENT_LABELS } from '@/lib/chat';
import { Aurora, Avatar, TypingDots } from './ChatFx';
import { BotMessage, Composer, ErrorMessage, UserMessage, Welcome } from './ChatParts';

const INTENT_TEXTS = new Set(Object.values(INTENT_LABELS).map((l) => l.toLowerCase()));

/**
 * The chat window. On a computer it grows out of the bubble in the corner; on
 * a phone it slides up as a full-screen sheet you can drag back down.
 */
export default function ChatPanel({ open, isPhone, settings, ctx, state, onClose, onSend, onHandoff, onRate, onReset, onNavigate }) {
  const reduce = useReducedMotion();
  // Swipe the header down to close on phones.
  const dragY = useMotionValue(0);
  const swipe = useRef(null);
  const inputRef = useRef(null);
  const sectionRef = useRef(null);
  const closeRef = useRef(null);
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const pinned = useRef(true);
  const lastTop = useRef(0);
  const hasMessages = useRef(false);
  const [showJump, setShowJump] = useState(false);
  const { messages, sending, handoffSent } = state;
  const visible = messages.filter((m) => !m.hidden);
  hasMessages.current = visible.length > 0;
  const name = String(settings.assistant_name || 'OGWOGD Guide').slice(0, 40);

  const lastBotId = useMemo(() => [...visible].reverse().find((m) => m.role === 'assistant')?.id, [visible]);
  const lastHandoffId = useMemo(() => [...visible].reverse().find((m) => m.role === 'assistant' && m.handoff)?.id, [visible]);
  const lastQuestion = useMemo(() => {
    const q = [...visible].reverse().find((m) => m.role === 'user' && !INTENT_TEXTS.has(String(m.content).toLowerCase()));
    return q ? String(q.content).slice(0, 600) : '';
  }, [visible]);
  const liveText = useMemo(() => [...visible].reverse().find((m) => m.role === 'assistant' && m.fresh)?.content || '', [visible]);

  useEffect(() => {
    if (open) dragY.set(0);
  }, [open, dragY]);

  const onHeaderDown = (e) => {
    if (!isPhone || reduce || e.target.closest('button')) return;
    swipe.current = { y: e.clientY, t: performance.now(), id: e.pointerId };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onHeaderMove = (e) => {
    if (!swipe.current || swipe.current.id !== e.pointerId) return;
    dragY.set(Math.max(0, e.clientY - swipe.current.y));
  };
  const onHeaderUp = (e) => {
    if (!swipe.current) return;
    const dy = Math.max(0, e.clientY - swipe.current.y);
    const v = dy / Math.max(1, performance.now() - swipe.current.t);
    swipe.current = null;
    if (dy > 120 || (dy > 30 && v > 0.6)) onClose();
    else animate(dragY, 0, { type: 'spring', stiffness: 500, damping: 35 });
  };

  // Escape closes; focus the box when the window opens on a computer.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      // On a phone the chat is full screen, so keep Tab inside it.
      if (e.key === 'Tab' && isPhone && sectionRef.current) {
        const items = [...sectionRef.current.querySelectorAll('button:not([disabled]), a[href], textarea, input')].filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (!sectionRef.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    // Computer: straight to the text box. Phone: onto the close button, so the keyboard does not pop up uninvited.
    const t = setTimeout(() => (isPhone ? closeRef.current : inputRef.current)?.focus({ preventScroll: true }), 380);
    return () => {
      document.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, isPhone, onClose]);

  // Stick to the newest message while the visitor is at the bottom, even as a
  // reply grows word by word.
  const toBottom = (smooth) => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth && !reduce ? 'smooth' : 'auto' });
  };
  useLayoutEffect(() => {
    if (!open) return undefined;
    // The welcome screen starts at the top; a conversation starts at the newest message.
    pinned.current = visible.length > 0;
    if (pinned.current) toBottom(false);
    const el = contentRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => {
      if (pinned.current) {
        toBottom(false);
        return;
      }
      const sc = scrollRef.current;
      const away = sc ? sc.scrollHeight - sc.scrollTop - sc.clientHeight : 0;
      // Offer the jump only in a conversation, and only when new content is out of view.
      setShowJump(hasMessages.current && away > 120);
    });
    ro.observe(el);
    return () => ro.disconnect();
     
  }, [open]);
  useEffect(() => {
    const last = visible[visible.length - 1];
    if (last?.role === 'user') {
      pinned.current = true;
      toBottom(true);
    }
     
  }, [visible.length]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    // Only the visitor scrolling up unpins; our own smooth scroll only moves down.
    if (el.scrollTop < lastTop.current - 4 && !near) pinned.current = false;
    if (near) {
      pinned.current = true;
      setShowJump(false);
    }
    lastTop.current = el.scrollTop;
  };

  const desktopMotion = {
    initial: { opacity: 0, y: 30, scale: 0.88, clipPath: 'circle(8% at 92% 100%)' },
    animate: { opacity: 1, y: 0, scale: 1, clipPath: 'circle(150% at 92% 100%)' },
    exit: { opacity: 0, y: 24, scale: 0.9, clipPath: 'circle(8% at 92% 100%)' },
    transition: { type: 'spring', stiffness: 260, damping: 28, clipPath: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
  };
  const phoneMotion = {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { type: 'spring', stiffness: 300, damping: 34 },
  };
  const m = reduce ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } } : isPhone ? phoneMotion : desktopMotion;

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          ref={sectionRef}
          key="panel"
          role="dialog"
          aria-modal={isPhone ? 'true' : 'false'}
          aria-label={`Chat with ${name}`}
          className={
            isPhone
              ? 'fixed inset-0 z-[72] flex flex-col bg-[#09090b]'
              : 'fixed right-6 z-[70] w-[400px] flex flex-col rounded-[26px] overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85)]'
          }
          style={
            isPhone
              ? { height: '100dvh', paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }
              : { bottom: 'calc(6.25rem + var(--chat-lift, 0px))', height: 'min(660px, calc(100dvh - 8.5rem))', originX: 1, originY: 1 }
          }
          {...m}
        >
          {/* Turning rainbow edge (computer only) */}
          {!isPhone && (
            <span aria-hidden="true" className="absolute inset-0 rounded-[26px] overflow-hidden">
              <span className="absolute -inset-[40%] animate-spin-slow opacity-80" style={{ background: 'var(--rainbow-conic)' }} />
            </span>
          )}

          <motion.div
            className={`relative flex flex-col flex-1 min-h-0 bg-[#09090b] overflow-hidden ${isPhone ? '' : 'm-[1.5px] rounded-[24.5px]'}`}
            style={isPhone ? { y: dragY } : undefined}
          >
            <Aurora />

            {/* Header */}
            <header
              className="relative z-10 flex items-center gap-3 px-4 pt-3 pb-3 border-b border-white/[0.07] bg-black/30 backdrop-blur-xl touch-none select-none"
              onPointerDown={onHeaderDown}
              onPointerMove={onHeaderMove}
              onPointerUp={onHeaderUp}
              onPointerCancel={onHeaderUp}
            >
              {isPhone && <span aria-hidden="true" className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20" />}
              <Avatar size={40} />
              <div className="min-w-0 flex-1 pt-1">
                <p className="font-anton text-lg tracking-wide text-cream leading-none truncate">{name.toUpperCase()}</p>
                <p className="mt-1 flex items-center gap-1.5 font-barlow text-xs text-cream/55">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-rb-green animate-ping opacity-60" />
                    <span className="relative w-2 h-2 rounded-full bg-rb-green" />
                  </span>
                  {sending ? 'Typing...' : 'Online · answers in seconds'}
                </p>
              </div>
              {visible.length > 0 && (
                <motion.button
                  type="button"
                  onClick={onReset}
                  whileTap={{ rotate: -180, scale: 0.9 }}
                  className="grid place-items-center w-9 h-9 rounded-full text-cream/50 hover:text-cream hover:bg-white/10 transition-colors"
                  aria-label="Start a new chat"
                  title="New chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
              )}
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="grid place-items-center w-9 h-9 rounded-full text-cream/60 hover:text-cream hover:bg-white/10 transition-colors"
                aria-label="Minimize chat"
              >
                {isPhone ? <ChevronDown className="w-5 h-5" /> : <Minus className="w-4 h-4" />}
              </button>
            </header>

            {/* Rainbow line: calm when idle, racing while thinking */}
            <div aria-hidden="true" className="relative z-10 h-[2px] overflow-hidden bg-white/[0.04]">
              <motion.div
                className="absolute inset-y-0 w-[200%]"
                style={{ background: 'var(--rainbow-loop)' }}
                animate={reduce ? { x: 0, opacity: 0.6 } : { x: ['-50%', '0%'], opacity: sending ? 1 : 0.45 }}
                transition={{ x: { duration: sending ? 1.1 : 6, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.3 } }}
              />
            </div>

            {/* Conversation */}
            <div ref={scrollRef} onScroll={onScroll} className="relative z-10 flex-1 min-h-0 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
              <div ref={contentRef}>
                {visible.length === 0 ? (
                  <Welcome greeting={settings.greeting} first={ctx.first} onIntent={(intent) => onSend({ intent })} />
                ) : (
                  <div className="px-3.5 py-4 space-y-3">
                    {visible.map((msg, i) => {
                      const prev = visible[i - 1];
                      if (msg.role === 'user') return <UserMessage key={msg.id} m={msg} />;
                      if (msg.role === 'error') return <ErrorMessage key={msg.id} m={msg} onRetry={(input) => onSend(input, { resend: true })} />;
                      return (
                        <BotMessage
                          key={msg.id}
                          m={msg}
                          showAvatar={prev?.role !== 'assistant'}
                          isLast={msg.id === lastBotId}
                          showHandoff={msg.id === lastHandoffId}
                          sending={sending}
                          handoffSent={handoffSent}
                          lastQuestion={lastQuestion}
                          onNavigate={onNavigate}
                          onSend={onSend}
                          onRate={onRate}
                          onHandoff={onHandoff}
                        />
                      );
                    })}
                    <AnimatePresence>
                      {sending && (
                        <motion.div
                          key="typing"
                          className="flex gap-2.5 items-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        >
                          <Avatar size={28} />
                          <div className="rounded-2xl rounded-tl-md px-4 py-3 bg-white/[0.05] border border-white/[0.08]">
                            <TypingDots />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Jump to newest */}
            <AnimatePresence>
              {showJump && (
                <motion.button
                  type="button"
                  onClick={() => {
                    pinned.current = true;
                    setShowJump(false);
                    toBottom(true);
                  }}
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  className="absolute z-20 left-1/2 -translate-x-1/2 bottom-[112px] inline-flex items-center gap-1 rounded-full bg-cream text-ink px-3 py-1.5 font-barlow-condensed uppercase tracking-wider text-xs shadow-xl"
                >
                  <ChevronDown className="w-3.5 h-3.5" /> Newest
                </motion.button>
              )}
            </AnimatePresence>

            <div className="relative z-10 border-t border-white/[0.07] bg-black/40 backdrop-blur-xl">
              <Composer
                onSend={onSend}
                sending={sending}
                page={ctx.page || (typeof window !== 'undefined' ? window.location.pathname : '/')}
                inputRef={inputRef}
                onTalk={() => onSend({ intent: 'talk_person' })}
              />
            </div>

            {/* Screen readers hear each full reply once */}
            <p className="sr-only" aria-live="polite">{liveText}</p>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
