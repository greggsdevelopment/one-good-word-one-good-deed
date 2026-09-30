import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, ChevronRight, FileText, LifeBuoy, Loader2, LogIn, LogOut, Mail, School, Shield, ShieldCheck, Trash2, UserRound,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { callPortal } from '@/lib/portal';

function Row({ to, href, icon: Icon, title, sub, danger, onClick }) {
  const inner = (
    <>
      <span className={`grid place-items-center w-10 h-10 rounded-xl shrink-0 ${danger ? 'bg-rb-red/10 text-rb-red' : 'bg-white/[0.06] text-cream/80'}`}>
        <Icon className="w-5 h-5" />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className={`block font-barlow-condensed font-semibold uppercase tracking-wide ${danger ? 'text-rb-red' : 'text-cream'}`}>{title}</span>
        {sub && <span className="block font-barlow text-sm text-cream/50 truncate">{sub}</span>}
      </span>
      <ChevronRight className="w-4 h-4 text-cream/30 shrink-0" />
    </>
  );
  const cls = 'w-full flex items-center gap-3 px-4 py-3.5 min-h-[64px] hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors';
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  if (href) return <a href={href} className={cls}>{inner}</a>;
  return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

function Group({ title, children }) {
  return (
    <section className="mt-6">
      {title && <h2 className="px-1 mb-2 font-barlow-condensed uppercase tracking-[0.2em] text-xs text-cream/45">{title}</h2>}
      <div className="rounded-2xl border border-white/10 bg-[#0e0e11] divide-y divide-white/[0.06] overflow-hidden">{children}</div>
    </section>
  );
}

function DeleteDialog({ open, onClose }) {
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);
  const latest = useRef({ busy, result, onClose });
  latest.current = { busy, result, onClose };

  // Escape closes (not mid-delete or after it finished); focus starts in the confirm box.
  useEffect(() => {
    if (!open) return undefined;
    const before = document.activeElement;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e) => {
      const l = latest.current;
      if (e.key === 'Escape' && !l.busy && !l.result) l.onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      if (before && typeof before.focus === 'function' && document.contains(before)) before.focus();
    };
  }, [open]);

  const run = async () => {
    setBusy(true);
    setError('');
    try {
      const res = await base44.functions.invoke('deleteMyAccount', { confirm: 'DELETE' });
      const data = res?.data ?? res;
      if (!data?.success) throw new Error(data?.message || 'Could not delete the account.');
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Could not delete the account. Try again, or email greggsdevelopment@gmail.com.');
    } finally {
      setBusy(false);
    }
  };

  const finish = () => {
    try {
      base44.auth.logout('/');
    } catch {
      window.location.href = '/';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[95] bg-black/70 flex items-end sm:items-center justify-center p-4 pt-[max(1rem,var(--safe-top))] pb-[max(1rem,var(--safe-bottom))]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !busy && !result && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="del-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0e11] p-6 text-cream"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            {result ? (
              <div className="text-center">
                <ShieldCheck className="w-10 h-10 mx-auto text-rb-green" />
                <h2 id="del-title" className="font-anton text-2xl tracking-wide mt-3">{result.account_removed === false ? 'DELETION STARTED' : 'ACCOUNT DELETED'}</h2>
                <p className="font-barlow text-cream/70 mt-2">{result.message}</p>
                <button type="button" onClick={finish} className="mt-6 w-full min-h-[48px] rounded-xl bg-gold text-ink font-barlow-condensed font-bold uppercase tracking-wider">
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 id="del-title" className="font-anton text-2xl tracking-wide">DELETE YOUR ACCOUNT?</h2>
                <div className="font-barlow text-sm text-cream/75 mt-3 space-y-2">
                  <p>This permanently removes your sign-in and your personal details, including:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your school portal access</li>
                    <li>Chat conversations, newsletter signup, RSVPs, messages and forms sent under your email</li>
                    <li>Your name on portal messages, and your contact details on bookings and uploaded files</li>
                  </ul>
                  <p>Records we must keep for taxes stay: your school's invoices and payments, and shop orders (with your email removed). This cannot be undone.</p>
                </div>
                <label className="block mt-4 font-barlow-condensed uppercase tracking-wider text-xs text-cream/60" htmlFor="del-confirm">
                  Type DELETE to confirm
                </label>
                <input
                  ref={inputRef}
                  id="del-confirm"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  autoCapitalize="characters"
                  autoComplete="off"
                  className="mt-1.5 w-full rounded-xl bg-black/40 border border-white/15 focus:border-rb-red/70 outline-none px-4 py-3 font-barlow text-cream"
                />
                {error && <p role="alert" className="mt-3 font-barlow text-sm text-rb-red">{error}</p>}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button type="button" onClick={onClose} disabled={busy} className="min-h-[48px] rounded-xl border border-white/15 font-barlow-condensed uppercase tracking-wider">
                    Keep account
                  </button>
                  <button
                    type="button"
                    onClick={run}
                    disabled={typed.trim().toUpperCase() !== 'DELETE' || busy}
                    className="min-h-[48px] rounded-xl bg-rb-red text-white font-barlow-condensed font-bold uppercase tracking-wider disabled:opacity-40 inline-flex items-center justify-center gap-2"
                  >
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Account() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data: me, isLoading } = useQuery({
    queryKey: ['account-me'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
  });
  const { data: portal } = useQuery({
    queryKey: ['portal-me'],
    enabled: Boolean(me),
    queryFn: () => callPortal('me').catch(() => ({ schools: [] })),
    staleTime: 60_000,
  });

  const schools = portal?.schools || [];
  const initials = String(me?.full_name || me?.email || '?')
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

  return (
    <div className="min-h-screen bg-black text-cream">
      <div className="max-w-xl mx-auto px-5 pt-8 pb-16">
        <h1 className="font-anton text-4xl tracking-wide">ACCOUNT</h1>

        {isLoading ? (
          <div className="mt-10 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-cream/50" /></div>
        ) : me ? (
          <>
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0e0e11] p-5 select-text">
              <span className="relative grid place-items-center w-14 h-14 rounded-full bg-black shrink-0">
                <span aria-hidden="true" className="absolute -inset-[2px] rounded-full animate-spin-slow" style={{ background: 'var(--rainbow-conic)' }} />
                <span className="relative grid place-items-center w-full h-full rounded-full bg-black font-anton text-xl">{initials}</span>
              </span>
              <div className="min-w-0">
                <p className="font-barlow-condensed font-bold text-xl uppercase tracking-wide truncate">{me.full_name || 'Your account'}</p>
                <p className="font-barlow text-sm text-cream/60 truncate">{me.email}</p>
              </div>
            </div>

            {(schools.length > 0 || me.role === 'admin') && (
              <Group title="Your tools">
                {schools.map((s) => (
                  <Row key={s.id} to={`/portal?school=${s.id}`} icon={School} title={`${s.name} portal`} sub="Schedule, invoices, documents and messages" />
                ))}
                {me.role === 'admin' && <Row to="/admin" icon={Shield} title="Admin" sub="Run the site and the business" />}
              </Group>
            )}
            {schools.length === 0 && me.role !== 'admin' && (
              <p className="mt-6 rounded-2xl border border-white/10 bg-[#0e0e11] p-5 font-barlow text-sm text-cream/70">
                Your account is not linked to a school yet. If you were invited, make sure you signed up with the same email the invitation went to, or{' '}
                <Link to="/contact" className="underline underline-offset-2">contact us</Link>.
              </p>
            )}
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-[#0e0e11] p-6">
            <UserRound className="w-8 h-8 text-cream/60" />
            <p className="font-barlow-condensed font-bold text-xl uppercase tracking-wide mt-3">For school partners and our team</p>
            <p className="font-barlow text-cream/65 mt-1">
              Schools we work with get a private portal for their schedule, invoices, documents and messages. Accounts are by invitation.
            </p>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              <Link to="/login" className="min-h-[48px] rounded-xl bg-gold text-ink font-barlow-condensed font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2">
                <LogIn className="w-4 h-4" /> Sign in
              </Link>
              <Link to="/programs" className="min-h-[48px] rounded-xl border border-white/15 font-barlow-condensed uppercase tracking-wider inline-flex items-center justify-center gap-2">
                Book a program <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        <Group title="Help">
          <Row to="/contact" icon={Mail} title="Contact us" sub="greggsdevelopment@gmail.com · (734) 383-3865" />
          <Row to="/resources" icon={LifeBuoy} title="Help and resources" sub="Crisis lines and support, any time" />
        </Group>

        <Group title="Legal">
          <Row to="/privacy" icon={ShieldCheck} title="Privacy Policy" />
          <Row to="/terms" icon={FileText} title="Terms of Use" />
        </Group>

        {me && (
          <Group title="Account">
            <Row icon={LogOut} title="Sign out" onClick={() => base44.auth.logout('/')} />
            {me.role !== 'admin' ? (
              <Row icon={Trash2} title="Delete account" sub="Permanently remove your account and personal details" danger onClick={() => setConfirmDelete(true)} />
            ) : (
              <p className="px-4 py-3.5 font-barlow text-sm text-cream/50">Team admin accounts are removed from the Base44 dashboard so the site always keeps an admin.</p>
            )}
          </Group>
        )}

        <p className="mt-8 text-center font-barlow text-xs text-cream/35">One Good Word...One Good Deed LLC · Michigan</p>
      </div>
      <DeleteDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} />
    </div>
  );
}
