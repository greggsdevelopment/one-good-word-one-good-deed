import { useMemo } from 'react';
import { CalendarDays, CalendarPlus, Clock, ExternalLink, MapPin, MessageSquare, Users } from 'lucide-react';
import { SESSION_STATE, downloadText, googleCalendarLink, prettyDate, sessionIcs } from '@/lib/portal';
import { Card, Chip, Empty, GhostButton } from './ui';

function Session({ s, schoolName, past, onAsk }) {
  const d = new Date(`${s.date}T12:00:00`);
  const state = SESSION_STATE[s.status] || SESSION_STATE.proposed;
  return (
    <Card className={`p-4 sm:p-5 flex gap-4 ${past ? 'opacity-70' : ''}`}>
      <div className="shrink-0 w-16 rounded-xl bg-black/50 border border-white/10 text-center py-2">
        <p className="font-barlow-condensed uppercase tracking-wider text-[11px] text-rb-yellow">{s.date ? d.toLocaleDateString('en-US', { month: 'short' }) : 'TBD'}</p>
        <p className="font-anton text-3xl leading-none mt-0.5">{s.date ? d.getDate() : '?'}</p>
        <p className="font-barlow-condensed uppercase tracking-wider text-[10px] text-cream/50 mt-1">{s.date ? d.toLocaleDateString('en-US', { weekday: 'short' }) : ''}</p>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-barlow-condensed font-bold text-lg uppercase tracking-wide">{s.title}</p>
          <Chip tone={state.tone}>{state.label}</Chip>
        </div>
        <div className="mt-1 grid gap-0.5 font-barlow text-sm text-cream/65">
          {(s.start_time || s.end_time) && <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{[s.start_time, s.end_time].filter(Boolean).join(' to ')}</p>}
          {s.location && <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{s.location}</p>}
          {s.grades && <p className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{s.grades}</p>}
        </div>
        {s.notes_for_school && <p className="mt-2 font-barlow text-sm text-cream/80 whitespace-pre-wrap">{s.notes_for_school}</p>}
        {!past && s.date && s.status !== 'cancelled' && (
          <div className="mt-3 flex flex-wrap gap-2">
            <GhostButton onClick={() => downloadText(`${s.title.replace(/[^\w]+/g, '-')}.ics`, sessionIcs(s, schoolName))}>
              <CalendarPlus className="w-4 h-4" /> Add to calendar
            </GhostButton>
            <a href={googleCalendarLink(s, schoolName)} target="_blank" rel="noopener noreferrer" className="min-h-[44px] px-4 rounded-xl border border-white/15 hover:border-white/30 font-barlow-condensed uppercase tracking-wider text-xs text-cream/85 inline-flex items-center gap-2">
              Google Calendar <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <GhostButton onClick={() => onAsk(s)}>
              <MessageSquare className="w-4 h-4" /> Ask to change
            </GhostButton>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function ScheduleTab({ data, go }) {
  const today = data.today;
  const { upcoming, past, tbd } = useMemo(() => {
    const all = data.sessions || [];
    return {
      upcoming: all.filter((s) => s.date && s.date >= today).sort((a, b) => a.date.localeCompare(b.date)),
      past: all.filter((s) => s.date && s.date < today).sort((a, b) => b.date.localeCompare(a.date)),
      tbd: all.filter((s) => !s.date),
    };
  }, [data.sessions, today]);

  const ask = (s) => go('messages', { topic: 'schedule', draft: `About ${s.title} on ${prettyDate(s.date)}: ` });

  if (!(data.sessions || []).length) {
    return (
      <Empty icon={CalendarDays} title="No dates yet">
        Once we set dates together they show up here, ready to add to your calendar.
      </Empty>
    );
  }

  return (
    <div className="space-y-8">
      {upcoming.length > 0 && (
        <section>
          <h2 className="font-barlow-condensed uppercase tracking-[0.2em] text-xs text-cream/50 mb-3">Coming up</h2>
          <div className="space-y-3">{upcoming.map((s) => <Session key={s.id} s={s} schoolName={data.school?.name} onAsk={ask} />)}</div>
        </section>
      )}
      {tbd.length > 0 && (
        <section>
          <h2 className="font-barlow-condensed uppercase tracking-[0.2em] text-xs text-cream/50 mb-3">Date to be set</h2>
          <div className="space-y-3">{tbd.map((s) => <Session key={s.id} s={s} schoolName={data.school?.name} onAsk={ask} />)}</div>
        </section>
      )}
      {past.length > 0 && (
        <section>
          <h2 className="font-barlow-condensed uppercase tracking-[0.2em] text-xs text-cream/50 mb-3">Past</h2>
          <div className="space-y-3">{past.map((s) => <Session key={s.id} s={s} schoolName={data.school?.name} past onAsk={ask} />)}</div>
        </section>
      )}
    </div>
  );
}
