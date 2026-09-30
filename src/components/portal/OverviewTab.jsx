import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowRight, CalendarDays, Check, CheckCircle2, ClipboardList, MapPin, MessageSquare, Receipt, Sparkles } from 'lucide-react';
import { BOOKING_STATUS, callPortal, daysUntil, money, portalKey, prettyDate } from '@/lib/portal';
import { Card, CardTitle, Chip } from './ui';

const STEPS = ['new', 'quoted', 'po_received', 'scheduled', 'delivered', 'invoiced', 'paid'];
const stepIndex = (s) => {
  const map = { pending: 'new', contacted: 'new', confirmed: 'scheduled' };
  return STEPS.indexOf(map[s] || s);
};

export default function OverviewTab({ data, schoolId, go }) {
  const qc = useQueryClient();
  const today = data.today;
  const upcoming = useMemo(
    () => (data.sessions || []).filter((s) => s.date && s.date >= today && s.status !== 'cancelled').sort((a, b) => a.date.localeCompare(b.date)),
    [data.sessions, today],
  );
  const next = upcoming[0];
  const openInvoices = (data.invoices || []).filter((i) => i.balance > 0 && i.state !== 'void');
  const balance = openInvoices.reduce((s, i) => s + i.balance, 0);
  const overdue = openInvoices.some((i) => i.state === 'overdue');
  const tasks = data.tasks || [];
  const doneCount = tasks.filter((t) => t.done).length;
  const lastMsg = (data.messages || []).slice(-1)[0];
  const days = next ? daysUntil(next.date, today) : null;

  // Checking off a task shows immediately; the server confirms in the background.
  const toggle = async (task) => {
    const key = portalKey(schoolId);
    const prev = qc.getQueryData(key);
    qc.setQueryData(key, (old) => old && { ...old, tasks: old.tasks.map((t) => (t.id === task.id ? { ...t, done: !task.done } : t)) });
    try {
      await callPortal('completeTask', { school_id: schoolId, task_id: task.id, done: !task.done });
      if (!task.done) toast.success('Checked off', { description: 'Our team has been notified.' });
    } catch (err) {
      qc.setQueryData(key, prev);
      toast.error('Could not save', { description: err.message });
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Next session */}
      <Card className="lg:col-span-2 p-5 relative overflow-hidden">
        <div aria-hidden="true" className="absolute -right-16 -top-16 w-56 h-56 rounded-full opacity-20" style={{ background: 'radial-gradient(closest-side, var(--rb-yellow), transparent)' }} />
        <CardTitle icon={CalendarDays} right={<button type="button" onClick={() => go('schedule')} className="font-barlow-condensed uppercase tracking-wider text-xs text-cream/60 hover:text-cream">Full schedule</button>}>
          Next on the calendar
        </CardTitle>
        {next ? (
          <div className="relative flex items-center gap-5">
            <div className="shrink-0 w-20 h-20 rounded-2xl bg-black/50 border border-white/10 grid place-items-center text-center">
              <div>
                <p className="font-anton text-3xl leading-none">{days <= 0 ? 'TODAY' : days}</p>
                {days > 0 && <p className="font-barlow-condensed uppercase tracking-wider text-[10px] text-cream/60 mt-1">{days === 1 ? 'day' : 'days'}</p>}
              </div>
            </div>
            <div className="min-w-0">
              <p className="font-barlow-condensed font-bold text-xl uppercase tracking-wide">{next.title}</p>
              <p className="font-barlow text-cream/70">
                {prettyDate(next.date)}
                {next.start_time ? ` · ${next.start_time}${next.end_time ? ` to ${next.end_time}` : ''}` : ''}
              </p>
              {next.location && (
                <p className="font-barlow text-sm text-cream/50 flex items-center gap-1 mt-0.5"><MapPin className="w-3.5 h-3.5" />{next.location}</p>
              )}
              <div className="mt-2"><Chip tone={next.status === 'confirmed' ? 'bg-rb-green/15 text-rb-green' : 'bg-rb-yellow/15 text-rb-yellow'}>{next.status === 'confirmed' ? 'Confirmed' : 'Proposed date'}</Chip></div>
            </div>
          </div>
        ) : (
          <p className="font-barlow text-cream/60">No dates on the calendar yet. We will add them here as soon as they are set.</p>
        )}
      </Card>

      {/* Balance */}
      <Card className="p-5">
        <CardTitle icon={Receipt}>Balance</CardTitle>
        <p className={`font-anton text-4xl ${overdue ? 'text-rb-red' : 'text-cream'}`}>{money(balance)}</p>
        <p className="font-barlow text-sm text-cream/55 mt-1">
          {openInvoices.length
            ? `${openInvoices.length} open invoice${openInvoices.length === 1 ? '' : 's'}${overdue ? ', one or more past due' : ''}`
            : 'Nothing due right now.'}
        </p>
        <button type="button" onClick={() => go('billing')} className="mt-4 inline-flex items-center gap-1 font-barlow-condensed uppercase tracking-wider text-xs text-rb-yellow">
          Invoices and payments <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </Card>

      {/* Checklist */}
      <Card className="lg:col-span-2 p-5">
        <CardTitle icon={ClipboardList} right={tasks.length > 0 && <span className="font-barlow text-xs text-cream/50">{doneCount} of {tasks.length} done</span>}>
          Program checklist
        </CardTitle>
        {tasks.length > 0 && (
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-4">
            <motion.div className="h-full rounded-full" style={{ background: 'var(--rainbow)' }} initial={{ width: 0 }} animate={{ width: `${(doneCount / tasks.length) * 100}%` }} transition={{ duration: 0.6 }} />
          </div>
        )}
        {tasks.length ? (
          <ul className="space-y-1.5">
            {tasks.map((t) => {
              const mine = t.owner === 'school';
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => mine && !data.viewingAsAdmin && toggle(t)}
                    disabled={!mine || data.viewingAsAdmin}
                    className={`w-full flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${mine ? 'hover:bg-white/[0.04]' : 'cursor-default'}`}
                  >
                    <span className={`mt-0.5 grid place-items-center w-5 h-5 rounded-md border shrink-0 transition-colors ${t.done ? 'bg-rb-green border-rb-green text-black' : 'border-white/25'}`}>
                      {t.done && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block font-barlow ${t.done ? 'text-cream/45 line-through' : 'text-cream'}`}>{t.title}</span>
                      <span className="block font-barlow text-xs text-cream/45">
                        {mine ? 'Your team' : 'Our team'}
                        {t.due_date && !t.done ? ` · due ${prettyDate(t.due_date, { month: 'short', day: 'numeric' })}` : ''}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="font-barlow text-cream/60">No checklist items yet.</p>
        )}
      </Card>

      {/* Latest message */}
      <Card className="p-5">
        <CardTitle icon={MessageSquare}>Messages</CardTitle>
        {lastMsg ? (
          <>
            <p className="font-barlow text-xs text-cream/45">{lastMsg.author === 'ogwogd' ? 'From our team' : lastMsg.author_name}</p>
            <p className="font-barlow text-cream/85 mt-1 line-clamp-4 whitespace-pre-wrap">{lastMsg.body}</p>
          </>
        ) : (
          <p className="font-barlow text-cream/60">Questions about anything? Message us here and it comes straight to Cody.</p>
        )}
        <button type="button" onClick={() => go('messages')} className="mt-4 inline-flex items-center gap-1 font-barlow-condensed uppercase tracking-wider text-xs text-rb-yellow">
          Open messages <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </Card>

      {/* Program progress */}
      {(data.bookings || []).length > 0 && (
        <Card className="lg:col-span-3 p-5">
          <CardTitle icon={Sparkles}>Where your program stands</CardTitle>
          <div className="space-y-5">
            {data.bookings.map((b) => {
              const at = stepIndex(b.status);
              return (
                <div key={b.id}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-barlow text-cream/80">
                      {b.reference} {b.target_term ? `· ${b.target_term}` : ''} {b.quoted_total ? `· ${money(b.quoted_total)} quoted` : ''}
                    </p>
                    <Chip tone="bg-rb-blue/15 text-rb-blue">{BOOKING_STATUS[b.status] || b.status}</Chip>
                  </div>
                  {b.status !== 'cancelled' && (
                    <ol className="mt-3 grid grid-cols-7 gap-1" aria-label="Program steps">
                      {['Request', 'Quote', 'PO', 'Scheduled', 'Delivered', 'Invoiced', 'Paid'].map((label, i) => (
                        <li key={label} className="text-center">
                          <span className={`block h-1.5 rounded-full ${i <= at ? '' : 'bg-white/[0.08]'}`} style={i <= at ? { background: 'var(--rainbow)' } : undefined} />
                          <span className={`block mt-1.5 font-barlow-condensed uppercase text-[10px] tracking-wider ${i <= at ? 'text-cream/80' : 'text-cream/35'}`}>
                            {i === at && <CheckCircle2 className="inline w-3 h-3 mr-0.5 -mt-0.5" />}
                            {label}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
