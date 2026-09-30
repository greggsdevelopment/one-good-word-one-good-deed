import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Flag, Loader2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { getHumanToken } from '@/lib/turnstile';

/**
 * Pledge Wall moderation for visitors (Apple 1.2, Google Play UGC):
 * - Report: sends the pledge to our review queue and hides it for everyone.
 * - Block: hides every pledge from that person on this device.
 */

const HIDDEN = 'ogw-hidden-pledges';
const DEVICE = 'ogw-device-id';

/** A random ID for this browser, sent with pledges so a poster can be blocked without tracking their network. */
export function deviceId() {
  try {
    let v = window.localStorage.getItem(DEVICE);
    if (!v) {
      v = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`).replace(/[^A-Za-z0-9-]/g, '');
      window.localStorage.setItem(DEVICE, v);
    }
    return v;
  } catch {
    return undefined;
  }
}
const BLOCKED = 'ogw-blocked-pledgers';

function readList(key) {
  try {
    const v = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function writeList(key, list) {
  try {
    window.localStorage.setItem(key, JSON.stringify(list.slice(-500)));
  } catch {
    // storage blocked: the choice still applies until the page reloads
  }
}

/** Visitor-side filters: pledges they reported and people they blocked. */
export function useModeration() {
  const [hidden, setHidden] = useState(() => readList(HIDDEN));
  const [blocked, setBlocked] = useState(() => readList(BLOCKED));
  const hide = useCallback((id) => {
    setHidden((h) => {
      const next = [...new Set([...h, id])];
      writeList(HIDDEN, next);
      return next;
    });
  }, []);
  const block = useCallback((tag) => {
    if (!tag) return;
    setBlocked((b) => {
      const next = [...new Set([...b, tag])];
      writeList(BLOCKED, next);
      return next;
    });
  }, []);
  const visible = useCallback(
    (list) => (list || []).filter((p) => !hidden.includes(p.id) && !(p.submitter_tag && blocked.includes(p.submitter_tag))),
    [hidden, blocked],
  );
  return { visible, hide, block };
}

const REASONS = [
  ['bullying_or_hate', 'Bullying, hate or threats'],
  ['personal_info', 'Shares someone\'s personal information'],
  ['inappropriate', 'Inappropriate or offensive'],
  ['spam', 'Spam or advertising'],
  ['other', 'Something else'],
];

/** Small flag button for a pledge. */
export function ReportButton({ onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Report or block this pledge"
      className={`inline-flex items-center justify-center min-w-[44px] min-h-[44px] -m-1 rounded-full text-cream/35 hover:text-rb-red hover:bg-white/5 transition-colors ${className}`}
    >
      <Flag className="w-3.5 h-3.5" />
    </button>
  );
}

export function ReportSheet({ pledge, onClose, onHide, onBlock }) {
  const [reason, setReason] = useState('bullying_or_hate');
  const [details, setDetails] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [busy, setBusy] = useState(false);
  const panelRef = useRef(null);
  const latest = useRef({ busy, onClose });
  latest.current = { busy, onClose };
  const openId = pledge?.id;

  // Escape closes; focus moves into the sheet and returns to the flag button after.
  // Runs once per opened pledge (not per render) so typing never steals focus.
  useEffect(() => {
    if (!openId) return undefined;
    const before = document.activeElement;
    const t = setTimeout(() => panelRef.current?.querySelector('input[type="radio"]:checked')?.focus(), 60);
    const onKey = (e) => {
      if (e.key === 'Escape' && !latest.current.busy) latest.current.onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      if (before && typeof before.focus === 'function' && document.contains(before)) before.focus();
    };
  }, [openId]);

  const submit = async () => {
    setBusy(true);
    try {
      const turnstile_token = await getHumanToken('report');
      const res = await base44.functions.invoke('reportContent', { kind: 'pledge', target_id: pledge.id, reason, details, turnstile_token });
      const data = res?.data ?? res;
      if (!data?.success) throw new Error(data?.message);
      onHide(pledge.id);
      if (alsoBlock) onBlock(pledge.submitter_tag);
      toast.success('Thank you for reporting', { description: 'It is hidden while our team reviews it, usually within one business day.' });
      onClose();
    } catch (err) {
      // Even if the report did not go through, stop showing it to this visitor.
      onHide(pledge.id);
      if (alsoBlock) onBlock(pledge.submitter_tag);
      toast.error('Report not sent', {
        description: (err?.humanCheck && err.message) || err?.response?.data?.message || 'We hid it for you. Please email greggsdevelopment@gmail.com so our team can review it.',
      });
      onClose();
    } finally {
      setBusy(false);
    }
  };

  const blockOnly = () => {
    onBlock(pledge.submitter_tag);
    onHide(pledge.id);
    toast.success('Blocked', { description: 'You will not see pledges from this person on this device.' });
    onClose();
  };

  return (
    <AnimatePresence>
      {pledge && (
        <motion.div
          className="fixed inset-0 z-[95] bg-black/70 flex items-end sm:items-center justify-center p-4 pt-[max(1rem,var(--safe-top))] pb-[max(1rem,var(--safe-bottom))]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !busy && onClose()}
          data-no-ptr
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0e0e11] p-6 text-cream"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={onClose} aria-label="Close" className="absolute top-3 right-3 grid place-items-center w-10 h-10 rounded-full text-cream/50 hover:text-cream hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
            <h2 id="report-title" className="font-anton text-2xl tracking-wide pr-10">REPORT THIS PLEDGE</h2>
            <p className="font-barlow text-sm text-cream/60 mt-1 line-clamp-2 italic">&ldquo;{pledge.pledge_statement}&rdquo;</p>
            <fieldset className="mt-4 space-y-1.5">
              <legend className="sr-only">Reason</legend>
              {REASONS.map(([value, label]) => (
                <label key={value} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer border ${reason === value ? 'border-rb-red/50 bg-rb-red/[0.07]' : 'border-transparent hover:bg-white/[0.04]'}`}>
                  <input type="radio" name="reason" value={value} checked={reason === value} onChange={() => setReason(value)} className="accent-[#EF5350] w-4 h-4" />
                  <span className="font-barlow text-[15px]">{label}</span>
                </label>
              ))}
            </fieldset>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="Anything else we should know? (optional)"
              className="mt-3 w-full rounded-xl bg-black/40 border border-white/15 focus:border-white/30 outline-none px-4 py-3 font-barlow text-cream placeholder:text-cream/30 resize-none"
            />
            {pledge.submitter_tag && (
              <label className="mt-3 flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={alsoBlock} onChange={(e) => setAlsoBlock(e.target.checked)} className="w-4 h-4 accent-[#EF5350]" />
                <span className="font-barlow text-sm text-cream/75">Also block this person (hide all their pledges for me)</span>
              </label>
            )}
            <div className="mt-5 grid gap-2">
              <button type="button" onClick={submit} disabled={busy} className="min-h-[48px] rounded-xl bg-rb-red text-white font-barlow-condensed font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 disabled:opacity-50">
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Flag className="w-4 h-4" />} Send report
              </button>
              {pledge.submitter_tag && (
                <button type="button" onClick={blockOnly} disabled={busy} className="min-h-[44px] rounded-xl border border-white/15 font-barlow-condensed uppercase tracking-wider text-sm">
                  Just block this person
                </button>
              )}
            </div>
            <p className="mt-4 font-barlow text-xs text-cream/45">
              Reported pledges are usually hidden right away and reviewed by our team. See our <Link to="/terms#community" className="underline">Community Guidelines</Link>, or
              contact us at greggsdevelopment@gmail.com.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
