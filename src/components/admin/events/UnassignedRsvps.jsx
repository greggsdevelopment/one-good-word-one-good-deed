import { base44 } from '@/api/base44Client';
import { partySize, formatSubmitted } from '@/lib/rsvpUtils';
import { DeleteRsvp } from '@/components/admin/events/RsvpControls';

export default function UnassignedRsvps({ rsvps, events, onChange }) {
  if (rsvps.length === 0) return null;

  const assign = async (rsvp, eventId) => {
    const ev = events.find((e) => e.id === eventId);
    if (!ev) return;
    await base44.entities.EventRSVP.update(rsvp.id, { event_id: ev.id, event_title: ev.title });
    onChange();
  };

  return (
    <div className="bg-ink border border-amber-500/30 rounded-sm p-4 sm:p-5">
      <h3 className="font-anton text-cream text-lg tracking-wide mb-1">UNASSIGNED RSVPS</h3>
      <p className="font-barlow text-cream/40 text-xs mb-4">These RSVPs are not linked to an existing event.</p>
      <div className="space-y-2">
        {rsvps.map((r) => (
          <div key={r.id} className="flex flex-col sm:flex-row sm:items-center gap-2 border-b border-cream/[0.06] pb-2 last:border-0">
            <div className="flex-1 min-w-0">
              <p className="font-barlow text-cream text-sm">{r.full_name} <span className="text-cream/40">· party of {partySize(r)}</span></p>
              <p className="font-barlow text-cream/40 text-xs truncate">{r.email} · {r.event_title || 'No event'} · {formatSubmitted(r)}</p>
            </div>
            <div className="flex items-center gap-3">
              <select defaultValue="" onChange={(e) => assign(r, e.target.value)}
                className="bg-ink border border-cream/15 rounded-sm px-2 py-1.5 text-cream text-xs font-barlow">
                <option value="" disabled>Assign to event</option>
                {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
              </select>
              <DeleteRsvp rsvp={r} onChange={onChange} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}