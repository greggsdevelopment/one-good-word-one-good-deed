import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Send, UserRound } from 'lucide-react';
import { Confetti, DrawCheck } from './ChatFx';

const field =
  'w-full rounded-xl bg-black/40 border border-white/10 focus:border-rb-blue/70 focus:ring-2 focus:ring-rb-blue/20 outline-none px-3.5 py-2.5 font-barlow text-[16px] text-cream placeholder:text-cream/35 transition-colors';

/** "Talk to a person": collects a way to reach the visitor and emails the team. */
export default function HandoffCard({ defaultNote = '', onSubmit, done }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: defaultNote });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [sentTo, setSentTo] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (form.name.trim().length < 2) return setError({ field: 'name', message: 'Please add your name.' });
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(form.email.trim())) return setError({ field: 'email', message: 'Please add an email we can reply to.' });
    setBusy(true);
    try {
      await onSubmit({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), note: form.note.trim() });
      setSentTo(form.email.trim());
    } catch (err) {
      setError({ field: err.field, message: err.message });
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  const sent = Boolean(sentTo) || done;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="relative mt-3 rounded-2xl p-[1px] overflow-hidden"
    >
      <span aria-hidden="true" className="absolute -inset-[80%] animate-spin-slower opacity-70" style={{ background: 'var(--rainbow-conic)' }} />
      <div className="relative rounded-[15px] bg-[#0e0e11] p-4">
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative flex flex-col items-center text-center py-3">
              {sentTo && <Confetti />}
              <DrawCheck />
              <p className="mt-3 font-anton text-xl tracking-wide text-cream">SENT TO OUR TEAM</p>
              <p className="mt-1 font-barlow text-sm text-cream/60">
                {sentTo ? <>We will reply to <span className="text-cream">{sentTo}</span>, usually within two business days.</> : 'We have your details and will be in touch.'}
              </p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={submit} exit={{ opacity: 0, scale: 0.97 }} className="space-y-2.5" noValidate>
              <div className="flex items-center gap-2 mb-1">
                <span className="grid place-items-center w-7 h-7 rounded-full bg-rb-blue/15 text-rb-blue">
                  <UserRound className="w-4 h-4" />
                </span>
                <p className="font-barlow-condensed uppercase tracking-wider text-sm text-cream">Talk to a person</p>
              </div>
              <input className={`${field} ${error?.field === 'name' ? 'border-rb-red/70' : ''}`} placeholder="Your name *" autoComplete="name" value={form.name} onChange={set('name')} aria-label="Your name" maxLength={80} />
              <input className={`${field} ${error?.field === 'email' ? 'border-rb-red/70' : ''}`} placeholder="Email *" type="email" autoComplete="email" inputMode="email" value={form.email} onChange={set('email')} aria-label="Email" maxLength={120} />
              <input className={`${field} ${error?.field === 'phone' ? 'border-rb-red/70' : ''}`} placeholder="Phone (optional)" type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set('phone')} aria-label="Phone, optional" maxLength={30} />
              <textarea className={`${field} resize-none`} rows={2} placeholder="What can we help with?" value={form.note} onChange={set('note')} aria-label="What can we help with?" maxLength={1000} />
              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="font-barlow text-sm text-rb-red" role="alert">
                    {error.message}
                  </motion.p>
                )}
              </AnimatePresence>
              <motion.button
                type="submit"
                disabled={busy}
                whileTap={{ scale: 0.97 }}
                className="w-full min-h-[44px] rounded-xl bg-gold text-ink font-barlow-condensed font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {busy ? 'Sending' : 'Send to our team'}
              </motion.button>
              <p className="font-barlow text-[11px] text-cream/40 text-center">Only used to answer you. We never share it.</p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
