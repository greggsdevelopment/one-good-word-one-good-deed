import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight, ArrowUp, ArrowUpRight, Backpack, CalendarDays, GraduationCap, Handshake, Heart, LifeBuoy, MessageSquareText,
  Phone, RotateCcw, ShoppingBag, ThumbsDown, ThumbsUp,
} from 'lucide-react';
import { INTENT_LABELS } from '@/lib/chat';
import { Avatar, Burst, WordReveal } from './ChatFx';
import HandoffCard from './HandoffCard';

/* ------------------------------------------------------------------ welcome */

const CARDS = {
  book: { icon: GraduationCap, sub: 'K to 12 programs', color: '#F7C948' },
  donate_items: { icon: Backpack, sub: 'What we take', color: '#94C44A' },
  events: { icon: CalendarDays, sub: 'A Night For Drayke', color: '#F59E42' },
  sponsor: { icon: Handshake, sub: 'Levels and perks', color: '#4A9BE8' },
  pledge: { icon: Heart, sub: 'Join the wall', color: '#EF5350' },
  shop: { icon: ShoppingBag, sub: 'Tees and orders', color: '#A06CD5' },
};

export function Welcome({ greeting, first, onIntent }) {
  const reduce = useReducedMotion();
  const order = Object.keys(CARDS).sort((a, b) => (a === first ? -1 : b === first ? 1 : 0));
  const words = ['Hey', 'there.'];
  return (
    <div className="px-5 pt-6 pb-4">
      <h2 className="font-anton text-[2.6rem] leading-[0.95] tracking-tight text-cream">
        {words.map((w, i) => (
          <motion.span
            key={w}
            className="inline-block mr-2"
            initial={reduce ? false : { opacity: 0, y: 24, rotate: 6 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 + i * 0.08 }}
          >
            {w}
          </motion.span>
        ))}
        <br />
        <motion.span
          className="inline-block text-rainbow animate-rainbow-shift"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.33 }}
        >
          HOW CAN WE HELP?
        </motion.span>
      </h2>
      <motion.p
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-3 font-barlow text-[15px] leading-relaxed text-cream/65"
      >
        {greeting || 'Ask about school programs, donating, events or anything on this site. I answer in seconds, and a real person is always one tap away.'}
      </motion.p>

      <motion.div
        className="mt-5 grid grid-cols-2 gap-2.5"
        initial="hide"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } } }}
      >
        {order.map((key) => {
          const c = CARDS[key];
          const Icon = c.icon;
          return (
            <motion.button
              key={key}
              type="button"
              onClick={() => onIntent(key)}
              variants={{ hide: { opacity: 0, y: 18, scale: 0.94 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 24 } } }}
              whileHover={reduce ? undefined : { y: -3 }}
              whileTap={{ scale: 0.96 }}
              className="group relative text-left rounded-2xl p-3.5 bg-white/[0.035] border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.06] transition-colors overflow-hidden"
            >
              <span aria-hidden="true" className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-40 blur-2xl transition-opacity duration-500" style={{ background: c.color }} />
              <span className="relative grid place-items-center w-9 h-9 rounded-xl mb-2.5 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" style={{ background: `${c.color}22`, color: c.color }}>
                <Icon className="w-[18px] h-[18px]" />
              </span>
              <span className="relative block font-barlow-condensed font-semibold uppercase tracking-wide text-[15px] leading-tight text-cream">{INTENT_LABELS[key]}</span>
              <span className="relative block font-barlow text-xs text-cream/45 mt-0.5">{c.sub}</span>
            </motion.button>
          );
        })}
      </motion.div>

      <motion.button
        type="button"
        onClick={() => onIntent('help_now')}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85 }}
        className="mt-3 w-full flex items-center gap-3 rounded-2xl px-4 py-3 border border-rb-red/30 bg-rb-red/[0.07] hover:bg-rb-red/[0.12] text-left transition-colors"
      >
        <LifeBuoy className="w-5 h-5 text-rb-red shrink-0" />
        <span className="font-barlow text-sm text-cream/85">
          Need someone to talk to <span className="text-cream font-semibold">right now?</span>
        </span>
        <ArrowRight className="w-4 h-4 text-cream/40 ml-auto" />
      </motion.button>
    </div>
  );
}

/* ------------------------------------------------------------------ messages */

export function UserMessage({ m }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="flex justify-end pl-12"
      initial={m.fresh && !reduce ? { opacity: 0, x: 24, y: 10, scale: 0.9 } : false}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
    >
      <p className="bg-gold text-ink rounded-2xl rounded-br-md px-4 py-2.5 font-barlow text-[15px] leading-snug whitespace-pre-wrap break-words shadow-lg shadow-black/30">
        {m.content}
      </p>
    </motion.div>
  );
}

function ActionButton({ a, onNavigate, i }) {
  const external = /^https?:/.test(a.href);
  const phone = /^(tel|sms):/.test(a.href);
  const Icon = phone ? Phone : external ? ArrowUpRight : ArrowRight;
  return (
    <motion.button
      type="button"
      onClick={() => onNavigate(a.href)}
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24, delay: i * 0.07 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="group inline-flex items-center gap-1.5 min-h-[40px] rounded-full pl-3.5 pr-3 py-2 bg-white/[0.06] border border-white/15 hover:border-rb-yellow/60 hover:bg-white/[0.1] font-barlow-condensed font-semibold uppercase tracking-wider text-[12px] text-cream transition-colors"
    >
      {a.label}
      <Icon className="w-3.5 h-3.5 text-rb-yellow transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </motion.button>
  );
}

function Feedback({ m, onRate }) {
  const [burst, setBurst] = useState(0);
  const pick = (v) => {
    const next = m.rating === v ? null : v;
    if (next === 'up') setBurst((b) => b + 1);
    onRate(m.id, next);
  };
  const btn = (v, Icon, label) => (
    <motion.button
      type="button"
      onClick={() => pick(v)}
      whileTap={{ scale: 0.8 }}
      aria-label={label}
      aria-pressed={m.rating === v}
      className={`relative grid place-items-center w-10 h-10 -m-1 rounded-full transition-colors ${m.rating === v ? (v === 'up' ? 'text-rb-green bg-rb-green/15' : 'text-rb-red bg-rb-red/15') : 'text-cream/30 hover:text-cream/70 hover:bg-white/5'}`}
    >
      {v === 'up' && burst > 0 && <Burst key={burst} />}
      <motion.span key={`${v}-${m.rating === v}`} initial={{ scale: m.rating === v ? 0.4 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
        <Icon className="w-3.5 h-3.5" />
      </motion.span>
    </motion.button>
  );
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-1 mt-1 ml-1">
      {btn('up', ThumbsUp, 'Helpful')}
      {btn('down', ThumbsDown, 'Not helpful')}
    </motion.div>
  );
}

export function BotMessage({ m, showAvatar, isLast, showHandoff, sending, handoffSent, lastQuestion, onNavigate, onSend, onRate, onHandoff }) {
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(!m.fresh);
  const crisis = Boolean(m.crisis);
  const showExtras = revealed;

  return (
    <motion.div
      className="flex gap-2.5 pr-6"
      initial={m.fresh && !reduce ? { opacity: 0, x: -16, scale: 0.95 } : false}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
    >
      <div className="w-7 shrink-0 pt-0.5">{showAvatar && <Avatar size={28} />}</div>
      <div className="min-w-0 flex-1">
        <div
          className={`relative rounded-2xl rounded-tl-md px-4 py-3 font-barlow text-[15px] leading-relaxed text-cream/90 break-words ${
            crisis
              ? 'bg-rb-red/[0.1] border border-rb-red/40 shadow-[0_0_40px_-12px_rgba(239,83,80,0.6)]'
              : 'bg-white/[0.05] border border-white/[0.08]'
          }`}
        >
          {crisis && (
            <span className="flex items-center gap-1.5 mb-1.5 font-barlow-condensed uppercase tracking-wider text-xs text-rb-red">
              <LifeBuoy className="w-3.5 h-3.5" /> You are not alone
            </span>
          )}
          {revealed ? (
            <WordReveal text={m.content} animate={false} onNavigate={onNavigate} />
          ) : (
            <WordReveal text={m.content} animate onDone={() => setRevealed(true)} onNavigate={onNavigate} />
          )}
        </div>

        {showExtras && m.actions?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {m.actions.map((a, i) => (
              <ActionButton key={a.key || a.href} a={a} i={i} onNavigate={onNavigate} />
            ))}
          </div>
        )}

        {showExtras && showHandoff && (
          <HandoffCard defaultNote={lastQuestion} onSubmit={onHandoff} done={handoffSent} />
        )}

        {showExtras && !crisis && m.source !== 'handoff' && m.id && onRate && <Feedback m={m} onRate={onRate} />}

        <AnimatePresence>
          {showExtras && isLast && !sending && m.suggestions?.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2 mt-2"
              initial="hide"
              animate="show"
              exit={{ opacity: 0 }}
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
            >
              {m.suggestions.map((s) => (
                <motion.button
                  key={s}
                  type="button"
                  onClick={() => onSend({ text: s })}
                  variants={{ hide: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 24 } } }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="min-h-[36px] rounded-full border border-dashed border-white/20 hover:border-rb-blue/70 hover:bg-rb-blue/10 px-3 py-1.5 font-barlow text-[13px] text-cream/75 hover:text-cream transition-colors text-left"
                >
                  {s}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function ErrorMessage({ m, onRetry }) {
  return (
    <motion.div role="alert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, x: [0, -6, 6, -3, 0] }} transition={{ duration: 0.45 }} className="flex gap-2.5 pr-6">
      <div className="w-7 shrink-0" />
      <div className="rounded-2xl px-4 py-3 border border-rb-red/40 bg-rb-red/[0.08] font-barlow text-sm text-cream/85">
        <p>{m.content}</p>
        {m.retry && (
          <button type="button" onClick={() => onRetry(m.retry)} className="mt-2 inline-flex items-center gap-1.5 font-barlow-condensed uppercase tracking-wider text-xs text-rb-yellow hover:text-white">
            <RotateCcw className="w-3.5 h-3.5" /> Try again
          </button>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ composer */

const EXAMPLES = {
  default: ['How do I book an assembly?', 'Can you pick up a backpack donation?', 'When is A Night For Drayke?', 'How do sponsorships work?'],
  '/programs': ['What does the Full Year package include?', 'Can we pay with Title I funds?', 'Do you come to high schools?'],
  '/donate': ['Do you take used coats?', 'Can you pick up in Canton?', 'Are donations tax deductible?'],
  '/shop': ['What sizes does the shirt come in?', 'How much is shipping?', 'Where is my order?'],
  '/events': ['Is the Drayke event free?', 'Can I bring my whole family?', 'Where is it?'],
};

const MAX = 800;

export function Composer({ onSend, sending, page, inputRef, onTalk }) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [ex, setEx] = useState(0);
  const [fly, setFly] = useState(0);
  const key = Object.keys(EXAMPLES).find((k) => k !== 'default' && page.startsWith(k)) || 'default';
  const examples = EXAMPLES[key];

  useEffect(() => {
    if (value || reduce) return undefined;
    const t = setInterval(() => setEx((i) => (i + 1) % examples.length), 3200);
    return () => clearInterval(t);
  }, [value, examples.length, reduce]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value, inputRef]);

  const submit = () => {
    const text = value.trim();
    if (!text || sending) return;
    onSend({ text });
    setValue('');
    setFly((f) => f + 1);
  };

  const canSend = value.trim().length > 0 && !sending;
  const left = MAX - value.length;

  return (
    <div className="px-3 pb-3 pt-2">
      <div className={`relative flex items-end gap-2 rounded-2xl border bg-black/40 pl-4 pr-1.5 py-1.5 transition-all duration-300 ${focused ? 'border-white/25 shadow-[0_0_0_4px_rgba(74,155,232,0.12)]' : 'border-white/10'}`}>
        <div className="relative flex-1 min-w-0 py-1.5">
          <textarea
            ref={inputRef}
            rows={1}
            value={value}
            maxLength={MAX}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                submit();
              }
            }}
            aria-label="Type your question"
            className="block w-full resize-none bg-transparent outline-none focus-visible:outline-none font-barlow text-[16px] leading-6 text-cream placeholder-transparent max-h-[120px]"
            placeholder={examples[ex]}
          />
          {!value && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 py-1.5 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={examples[ex]}
                  className="block font-barlow text-[16px] leading-6 text-cream/35 truncate"
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {examples[ex]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>
        <motion.button
          type="button"
          onClick={submit}
          disabled={!canSend}
          aria-label="Send"
          whileTap={canSend ? { scale: 0.85 } : undefined}
          animate={{ scale: canSend ? 1 : 0.9 }}
          className={`relative shrink-0 grid place-items-center w-10 h-10 rounded-xl overflow-hidden transition-colors ${canSend ? 'bg-gold text-ink' : 'bg-white/[0.06] text-cream/30'}`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={fly}
              initial={{ y: 22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -26, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 26 }}
            >
              <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
      <div className="flex items-center justify-between gap-3 mt-2 px-1">
        <p className="font-barlow text-[11px] text-cream/35">AI answers can be wrong. Double check anything important.</p>
        {left < 150 ? (
          <span className={`font-barlow-condensed text-xs ${left < 40 ? 'text-rb-red' : 'text-cream/40'}`}>{left}</span>
        ) : (
          <button type="button" onClick={onTalk} className="shrink-0 inline-flex items-center gap-1 font-barlow-condensed uppercase tracking-wider text-[11px] text-cream/50 hover:text-rb-yellow transition-colors">
            <MessageSquareText className="w-3.5 h-3.5" /> Talk to a person
          </button>
        )}
      </div>
    </div>
  );
}
