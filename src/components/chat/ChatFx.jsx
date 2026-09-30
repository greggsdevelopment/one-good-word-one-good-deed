import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const RB = ['#EF5350', '#F59E42', '#F7C948', '#94C44A', '#4A9BE8', '#A06CD5'];

/** A thin ring in the logo colors that slowly turns around a round element. */
export function SpinRing({ width = 2, speed = 'animate-spin-slow', glow = true, className = '' }) {
  const mask = `radial-gradient(farthest-side, transparent calc(100% - ${width}px), #000 calc(100% - ${width}px))`;
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {glow && <span className={`absolute -inset-1 rounded-full ${speed} opacity-60 blur-md`} style={{ background: 'var(--rainbow-conic)' }} />}
      <span className={`absolute inset-0 rounded-full ${speed}`} style={{ background: 'var(--rainbow-conic)', WebkitMask: mask, mask }} />
    </span>
  );
}

/** The round logo avatar with its living ring. */
export function Avatar({ size = 36, ring = true, className = '' }) {
  return (
    <span className={`relative inline-flex shrink-0 rounded-full ${className}`} style={{ width: size, height: size }}>
      {ring && <SpinRing width={Math.max(1.5, size / 22)} glow={size > 30} />}
      <img
        src="/brand/logo-128.webp"
        alt=""
        width={size}
        height={size}
        className="relative rounded-full object-cover bg-black"
        style={{ width: size - (ring ? 4 : 0), height: size - (ring ? 4 : 0), margin: ring ? 2 : 0 }}
        draggable={false}
      />
    </span>
  );
}

/** Soft color light drifting behind the panel. */
export function Aurora() {
  const reduce = useReducedMotion();
  const blobs = [
    { c: 'var(--rb-purple)', s: 320, x: [-60, 40, -60], y: [-80, 20, -80], top: '-12%', left: '-20%', d: 22 },
    { c: 'var(--rb-blue)', s: 300, x: [40, -50, 40], y: [0, 60, 0], top: '30%', left: '55%', d: 26 },
    { c: 'var(--rb-red)', s: 260, x: [0, 50, 0], y: [40, -30, 40], top: '70%', left: '-10%', d: 30 },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: b.s, height: b.s, top: b.top, left: b.left, background: b.c, filter: 'blur(90px)', opacity: 0.16 }}
          animate={reduce ? undefined : { x: b.x, y: b.y }}
          transition={{ duration: b.d, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <div className="grain-overlay" style={{ opacity: 0.05 }} />
    </div>
  );
}

/** Three dots bouncing in the logo colors, with a status line that changes. */
const THINKING = ['Reading your question', 'Checking the site', 'Writing an answer'];
export function TypingDots() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % THINKING.length), 1600);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-3" role="status" aria-label="The assistant is typing">
      <span className="sr-only">Typing</span>
      <span className="flex items-end gap-1 h-4">
        {[RB[0], RB[2], RB[4]].map((c, k) => (
          <motion.span
            key={c}
            className="block w-2 h-2 rounded-full"
            style={{ background: c, boxShadow: `0 0 10px ${c}` }}
            animate={{ y: [0, -6, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: k * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </span>
      <motion.span
        key={i}
        aria-hidden="true"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-barlow text-xs text-cream/50"
      >
        {THINKING[i]}...
      </motion.span>
    </div>
  );
}

/** Small burst of colored sparks, for a thumbs up or a sent message. */
export function Burst({ count = 10, radius = 26, size = 5 }) {
  const parts = useMemo(
    () => Array.from({ length: count }, (_, i) => ({ a: (i / count) * Math.PI * 2 + Math.random() * 0.4, r: radius * (0.7 + Math.random() * 0.5), c: RB[i % RB.length] })),
    [count, radius],
  );
  return (
    <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ width: size, height: size, background: p.c, marginLeft: -size / 2, marginTop: -size / 2 }}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{ x: Math.cos(p.a) * p.r, y: Math.sin(p.a) * p.r, scale: 0, opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        />
      ))}
    </span>
  );
}

/** Confetti that falls across a card when a message reaches the team. */
export function Confetti({ pieces = 36 }) {
  const reduce = useReducedMotion();
  const parts = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        x: (Math.random() - 0.5) * 340,
        y: 140 + Math.random() * 160,
        r: (Math.random() - 0.5) * 720,
        d: 0.9 + Math.random() * 0.8,
        w: 5 + Math.random() * 5,
        c: RB[i % RB.length],
        round: Math.random() > 0.6,
      })),
    [pieces],
  );
  if (reduce) return null;
  return (
    <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-6 z-10">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ width: p.w, height: p.round ? p.w : p.w * 0.45, background: p.c, borderRadius: p.round ? '50%' : 1 }}
          initial={{ x: 0, y: -10, rotate: 0, opacity: 1 }}
          animate={{ x: p.x, y: [-10, -60 - Math.random() * 40, p.y], rotate: p.r, opacity: [1, 1, 0] }}
          transition={{ duration: p.d + 0.6, ease: 'easeOut', times: [0, 0.3, 1] }}
        />
      ))}
    </span>
  );
}

/** A check mark that draws itself inside a glowing circle. */
export function DrawCheck({ size = 56 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 16 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ogw-check" x1="0" y1="0" x2="1" y2="1">
          {RB.map((c, i) => (
            <stop key={c} offset={`${(i / (RB.length - 1)) * 100}%`} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      <motion.circle cx="28" cy="28" r="25" fill="none" stroke="url(#ogw-check)" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }} />
      <motion.path d="M17 29 L25 37 L40 20" fill="none" stroke="#f5f1e8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.45, ease: 'easeOut' }} />
    </motion.svg>
  );
}

/* ------------------------------------------------------------------ text */

// Emails, US phone numbers, 988, and site paths become tappable.
const TOKEN = /([^\s@]+@[^\s@]+\.[a-z]{2,})|(\b1-\d{3}-\d{3}-\d{4}\b|\(\d{3}\)\s?\d{3}-\d{4}|\b\d{3}-\d{3}-\d{4}\b)|(\b988\b)|(\s\/(?:programs|donate|events|shop|sponsorship|hall-of-fame|resources|contact|about-cody|about|stories|pledge-wall|drayke)(?![\w-]))/gi;

function linkify(text, onNavigate) {
  const out = [];
  let last = 0;
  let m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [whole, email, phone, crisis, path] = m;
    const cls = 'underline decoration-rb-blue/70 decoration-2 underline-offset-2 hover:text-white';
    if (email) out.push(<a key={m.index} href={`mailto:${email.replace(/[.,]$/, '')}`} className={cls}>{email}</a>);
    else if (phone) out.push(<a key={m.index} href={`tel:${phone.replace(/[^\d]/g, '')}`} className={cls}>{phone}</a>);
    else if (crisis) out.push(<a key={m.index} href="tel:988" className={cls}>988</a>);
    else if (path) {
      const p = path.trim();
      out.push(' ');
      out.push(<button key={m.index} type="button" onClick={() => onNavigate?.(p)} className={cls}>{p}</button>);
    } else out.push(whole);
    last = m.index + whole.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/**
 * Reveals a reply word by word, like it is being written, then calls onDone.
 * Screen readers get the full text at once through the live region instead.
 */
export function WordReveal({ text, animate, onDone, onNavigate }) {
  const reduce = useReducedMotion();
  const play = animate && !reduce;
  const words = useMemo(() => String(text).split(/(\s+)/), [text]);
  const count = words.filter((w) => w.trim()).length || 1;
  const step = Math.min(0.035, 1.5 / count);

  useEffect(() => {
    if (!play) {
      onDone?.();
      return undefined;
    }
    const t = setTimeout(() => onDone?.(), (count * step + 0.25) * 1000);
    return () => clearTimeout(t);
     
  }, [play]);

  if (!play) return <span className="whitespace-pre-wrap">{linkify(String(text), onNavigate)}</span>;

  let k = 0;
  return (
    <span className="whitespace-pre-wrap" aria-hidden="true">
      {words.map((w, i) => {
        if (!w.trim()) return w;
        const idx = k++;
        return (
          <motion.span
            key={i}
            className="inline-block"
            initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.28, delay: idx * step, ease: 'easeOut' }}
          >
            {w}
          </motion.span>
        );
      })}
    </span>
  );
}

export { linkify };
