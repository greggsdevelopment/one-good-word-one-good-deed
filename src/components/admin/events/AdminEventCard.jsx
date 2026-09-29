import { useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import { ChevronDown, Pencil, Trash2, MapPin, Clock, Star } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { rsvpTotals, formatEventDate, eventDay, isUpcoming } from '@/lib/rsvpUtils';
import ConfirmDelete from '@/components/admin/events/ConfirmDelete';
import RsvpRoster from '@/components/admin/events/RsvpRoster';

function Stat({ label, value }) {
  return (
    <div className="bg-cream/[0.04] rounded-sm px-3 py-2">
      <p className="font-anton text-gold text-xl leading-none">{value}</p>
      <p className="font-barlow-condensed text-cream/40 text-[10px] uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
}

export default function AdminEventCard({ event, rsvps, onEdit, onChange }) {
  const [open, setOpen] = useState(false);
  const t = rsvpTotals(rsvps);
  const days = isUpcoming(event) ? differenceInCalendarDays(eventDay(event), new Date()) : null;
  const remove = async () => { await base44.entities.Event.delete(event.id); onChange(); };

  return (
    <div className="bg-ink border border-cream/10 rounded-sm p-4 sm:p-5">
      <div className="flex gap-4">
        {event.flyer_url && <img src={event.flyer_url} alt="" className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-sm border border-gold/20 shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-anton text-cream text-lg sm:text-xl tracking-wide">{event.title}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 font-barlow text-cream/50 text-xs">
                <span>{formatEventDate(event)}</span>
                {(event.start_time || event.end_time) && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{[event.start_time, event.end_time].filter(Boolean).join(' to ')}</span>}
                {event.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</span>}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {event.category && <span className="font-barlow-condensed text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-cream/10 text-cream/60">{event.category}</span>}
                {event.featured && <span className="flex items-center gap-1 font-barlow-condensed text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/15 text-gold"><Star className="w-2.5 h-2.5" />Featured</span>}
                {days !== null && <span className="font-barlow-condensed text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300">{days === 0 ? 'Today' : `${days} day${days === 1 ? '' : 's'} away`}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => onEdit(event)} className="text-cream/40 hover:text-gold" aria-label="Edit event"><Pencil className="w-4 h-4" /></button>
              <ConfirmDelete title="Delete event?" description="The event will be removed. Its RSVPs are kept and will appear under Unassigned RSVPs." onConfirm={remove}>
                <button className="text-cream/40 hover:text-red-400" aria-label="Delete event"><Trash2 className="w-4 h-4" /></button>
              </ConfirmDelete>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
        <Stat label="RSVPs" value={t.count} />
        <Stat label="Adults" value={t.adults} />
        <Stat label="Children" value={t.children} />
        <Stat label="Headcount" value={t.headcount} />
        <Stat label="Checked In" value={`${t.checkedIn}/${t.headcount}`} />
      </div>

      <button onClick={() => setOpen(!open)} className="flex items-center gap-1 mt-4 font-barlow-condensed text-gold text-xs uppercase tracking-wider hover:text-gold-dark">
        {open ? 'Hide' : 'View'} RSVP Roster <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <RsvpRoster event={event} rsvps={rsvps} onChange={onChange} />}
    </div>
  );
}