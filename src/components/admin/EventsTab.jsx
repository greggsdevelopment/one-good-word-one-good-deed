import { useMemo, useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { useAdminEventsData } from '@/hooks/useAdminEventsData';
import { isUpcoming } from '@/lib/rsvpUtils';
import EventForm from '@/components/admin/events/EventForm';
import AdminEventCard from '@/components/admin/events/AdminEventCard';
import UnassignedRsvps from '@/components/admin/events/UnassignedRsvps';

export default function EventsTab() {
  const { events, rsvps, loading, refresh } = useAdminEventsData();
  const [editing, setEditing] = useState(null);
  const [showPast, setShowPast] = useState(false);

  const { upcoming, past, byEvent, unassigned } = useMemo(() => {
    const ids = new Set(events.map((e) => e.id));
    const byEvent = {};
    const unassigned = [];
    rsvps.forEach((r) => {
      if (r.event_id && ids.has(r.event_id)) (byEvent[r.event_id] ||= []).push(r);
      else unassigned.push(r);
    });
    const upcoming = events.filter(isUpcoming).sort((a, b) => a.event_date.localeCompare(b.event_date));
    const past = events.filter((e) => !isUpcoming(e)).sort((a, b) => (b.event_date || '').localeCompare(a.event_date || ''));
    return { upcoming, past, byEvent, unassigned };
  }, [events, rsvps]);

  if (loading) {
    return <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;
  }

  const card = (e) => <AdminEventCard key={e.id} event={e} rsvps={byEvent[e.id] || []} onEdit={setEditing} onChange={refresh} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-anton text-ink text-2xl tracking-wide">EVENTS & RSVPS</h2>
        <button onClick={() => setEditing({})} className="flex items-center gap-1.5 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-sm transition-colors">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      <section className="space-y-3">
        <p className="font-barlow-condensed text-ash text-xs uppercase tracking-widest">Upcoming ({upcoming.length})</p>
        {upcoming.length ? upcoming.map(card) : <p className="font-barlow text-ash text-sm">No upcoming events.</p>}
      </section>

      {past.length > 0 && (
        <section className="space-y-3">
          <button onClick={() => setShowPast(!showPast)} className="flex items-center gap-1 font-barlow-condensed text-ash hover:text-ink text-xs uppercase tracking-widest">
            Past ({past.length}) <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPast ? 'rotate-180' : ''}`} />
          </button>
          {showPast && past.map(card)}
        </section>
      )}

      <UnassignedRsvps rsvps={unassigned} events={events} onChange={refresh} />

      {editing && <EventForm event={editing} open onClose={() => setEditing(null)} onSaved={refresh} />}
    </div>
  );
}