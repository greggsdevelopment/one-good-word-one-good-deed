import { partySize, formatSubmitted } from '@/lib/rsvpUtils';
import { CheckInToggle, NotesField, NotifiedIcon, DeleteRsvp } from '@/components/admin/events/RsvpControls';

const th = 'text-left font-barlow-condensed text-[11px] uppercase tracking-wider text-cream/40 px-2 py-2';
const td = 'px-2 py-2 align-top font-barlow text-sm text-cream/80';

export default function RsvpTable({ rsvps, onChange }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-cream/10">
            <tr>
              {['Name', 'Contact', 'Adults', 'Kids', 'Party', 'Message', 'Submitted', 'Email', 'In', 'Notes', ''].map((h) => <th key={h} className={th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rsvps.map((r) => (
              <tr key={r.id} className="border-b border-cream/[0.06]">
                <td className={`${td} text-cream font-medium`}>{r.full_name}</td>
                <td className={td}>
                  <a href={`mailto:${r.email}`} className="text-gold hover:underline block">{r.email}</a>
                  {r.phone && <a href={`tel:${r.phone}`} className="text-cream/50 hover:text-gold text-xs">{r.phone}</a>}
                </td>
                <td className={td}>{r.adults_attending ?? 0}</td>
                <td className={td}>{r.children_attending ?? 0}</td>
                <td className={`${td} text-gold font-bold`}>{partySize(r)}</td>
                <td className={`${td} max-w-[180px] text-xs text-cream/60`}>{r.message}</td>
                <td className={`${td} text-xs text-cream/50 whitespace-nowrap`}>{formatSubmitted(r)}</td>
                <td className={td}><NotifiedIcon rsvp={r} /></td>
                <td className={td}><CheckInToggle rsvp={r} onChange={onChange} /></td>
                <td className={td}><NotesField rsvp={r} onChange={onChange} /></td>
                <td className={td}><DeleteRsvp rsvp={r} onChange={onChange} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {rsvps.map((r) => (
          <div key={r.id} className="border border-cream/10 rounded-sm p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-barlow text-cream font-medium">{r.full_name}</p>
                <a href={`mailto:${r.email}`} className="text-gold text-sm block truncate">{r.email}</a>
                {r.phone && <a href={`tel:${r.phone}`} className="text-cream/50 text-sm">{r.phone}</a>}
              </div>
              <div className="flex items-center gap-3"><NotifiedIcon rsvp={r} /><DeleteRsvp rsvp={r} onChange={onChange} /></div>
            </div>
            <p className="font-barlow-condensed text-xs uppercase tracking-wider text-cream/50">
              {r.adults_attending ?? 0} adults · {r.children_attending ?? 0} kids · <span className="text-gold">party of {partySize(r)}</span>
            </p>
            {r.message && <p className="font-barlow text-xs text-cream/60">{r.message}</p>}
            <p className="font-barlow text-[11px] text-cream/35">{formatSubmitted(r)}</p>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 font-barlow-condensed text-xs uppercase text-cream/50"><CheckInToggle rsvp={r} onChange={onChange} /> Checked In</label>
              <NotesField rsvp={r} onChange={onChange} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}