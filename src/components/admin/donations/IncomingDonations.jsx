import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { base44 } from '@/api/base44Client';
import { Mail, Phone, MapPin, Truck, Navigation, Trash2, CalendarClock, PackageCheck, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast as sonner } from 'sonner';
import ReceiveDialog from './ReceiveDialog';
import { downloadCsv } from './inventoryOps';

const STATUS_STYLE = {
  new: 'bg-amber-100 text-amber-800',
  scheduled: 'bg-blue-100 text-blue-800',
  received: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-700',
  cancelled: 'bg-ink/10 text-ash',
};

const FILTERS = [
  { key: 'open', label: 'Open', match: (d) => d.status === 'new' || d.status === 'scheduled' || !d.status },
  { key: 'new', label: 'New', match: (d) => d.status === 'new' || !d.status },
  { key: 'scheduled', label: 'Scheduled', match: (d) => d.status === 'scheduled' },
  { key: 'received', label: 'Received', match: (d) => d.status === 'received' },
  { key: 'closed', label: 'Declined / Cancelled', match: (d) => d.status === 'declined' || d.status === 'cancelled' },
  { key: 'all', label: 'All', match: () => true },
];

const fullAddress = (d) => [d.address_line, d.city, [d.state, d.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
const toLocalInput = (iso) => (iso ? format(new Date(iso), "yyyy-MM-dd'T'HH:mm") : '');
const itemsSummary = (d) => (d.items || []).map((i) => `${i.quantity} x ${i.category}${i.description ? ` (${i.description})` : ''}, ${i.condition}`).join('; ');

function DonationCard({ donation, inventory, recordedBy, onChange }) {
  const [when, setWhen] = useState(toLocalInput(donation.scheduled_for));
  const [notes, setNotes] = useState(donation.admin_notes || '');
  const [receiving, setReceiving] = useState(false);
  const [busy, setBusy] = useState(false);

  const patch = async (data, msg) => {
    setBusy(true);
    try {
      await base44.entities.ItemDonation.update(donation.id, data);
      if (msg) sonner.success(msg);
      onChange();
    } catch (err) {
      sonner.error('Could not save', { description: err?.message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete ${donation.donor_name}'s donation record? Inventory history is kept.`)) return;
    setBusy(true);
    try {
      await base44.entities.ItemDonation.delete(donation.id);
      onChange();
    } finally {
      setBusy(false);
    }
  };

  const addr = fullAddress(donation);
  const status = donation.status || 'new';
  const open = status === 'new' || status === 'scheduled';
  const totalUnits = (donation.items || []).reduce((s, i) => s + (Number(i.quantity) || 0), 0);

  return (
    <div className={`bg-white rounded-sm border p-5 ${status === 'new' ? 'border-l-4 border-l-gold border-gold/20' : 'border-ink/10'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-barlow font-semibold text-ink text-lg">{donation.donor_name}</p>
            <span className={`text-[10px] font-barlow-condensed uppercase tracking-wider px-2 py-0.5 rounded-full ${STATUS_STYLE[status]}`}>{status}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-barlow-condensed uppercase tracking-wider text-ash">
              {donation.delivery_method === 'pickup' ? <Truck className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
              {donation.delivery_method === 'pickup' ? 'Pickup' : 'Drop-off'}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-barlow mt-1">
            <a href={`mailto:${donation.email}`} className="flex items-center gap-1 text-gold-dark hover:underline"><Mail className="w-3.5 h-3.5" /> {donation.email}</a>
            {donation.phone && <a href={`tel:${donation.phone}`} className="flex items-center gap-1 text-gold-dark hover:underline"><Phone className="w-3.5 h-3.5" /> {donation.phone}</a>}
          </div>
        </div>
        <p className="font-barlow text-ash text-xs">{donation.created_date ? format(new Date(donation.created_date), 'MMM d, yyyy h:mm a') : ''}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p className="font-barlow-condensed text-[11px] uppercase tracking-wider text-ash mb-1">Items ({totalUnits} units)</p>
          <ul className="font-barlow text-sm text-ink/80 space-y-0.5">
            {(donation.items || []).map((i, idx) => (
              <li key={idx}>
                <span className="font-semibold">{i.quantity}</span> x {i.category}
                {i.description ? <span className="text-ink/60"> ({i.description})</span> : null}
                <span className="text-ash"> · {i.condition}</span>
              </li>
            ))}
          </ul>
          {donation.notes && <p className="font-barlow text-sm text-ink/60 mt-2 italic">"{donation.notes}"</p>}
        </div>
        <div className="space-y-1 font-barlow text-sm text-ink/80">
          {donation.delivery_method === 'pickup' && (
            <>
              <p>{addr}</p>
              {donation.distance_miles != null && <p className="text-ash">{donation.distance_miles} miles from Westland</p>}
              {donation.pickup_window && <p><span className="text-ash">Best time:</span> {donation.pickup_window}</p>}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addr)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-gold-dark hover:underline"
              >
                <Navigation className="w-3.5 h-3.5" /> Directions
              </a>
            </>
          )}
          {donation.scheduled_for && <p><span className="text-ash">Scheduled:</span> {format(new Date(donation.scheduled_for), 'EEE MMM d, h:mm a')}</p>}
          {donation.received_at && <p><span className="text-ash">Received:</span> {format(new Date(donation.received_at), 'MMM d, yyyy')}</p>}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-ink/5 space-y-3">
        {open && (
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <span className="font-barlow-condensed text-[11px] uppercase tracking-wider text-ash block mb-1">
                {donation.delivery_method === 'pickup' ? 'Pickup time' : 'Drop-off time'}
              </span>
              <Input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="h-9 w-56" />
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={busy || !when}
              onClick={() => patch({ status: 'scheduled', scheduled_for: new Date(when).toISOString() }, 'Scheduled')}
              className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5"
            >
              <CalendarClock className="w-3.5 h-3.5" /> {status === 'scheduled' ? 'Reschedule' : 'Schedule'}
            </Button>
            <Button
              size="sm"
              disabled={busy}
              onClick={() => setReceiving(true)}
              className="bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider text-xs gap-1.5"
            >
              <PackageCheck className="w-3.5 h-3.5" /> Received
            </Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => patch({ status: 'declined' }, 'Declined')} className="font-barlow-condensed uppercase tracking-wider text-xs text-ash gap-1">
              <X className="w-3.5 h-3.5" /> Decline
            </Button>
            <Button size="sm" variant="ghost" disabled={busy} onClick={() => patch({ status: 'cancelled' }, 'Cancelled')} className="font-barlow-condensed uppercase tracking-wider text-xs text-ash">
              Donor cancelled
            </Button>
          </div>
        )}
        {!open && status !== 'received' && (
          <Button size="sm" variant="outline" disabled={busy} onClick={() => patch({ status: 'new' }, 'Reopened')} className="font-barlow-condensed uppercase tracking-wider text-xs">
            Reopen
          </Button>
        )}
        <div className="flex items-start gap-2">
          <Textarea rows={1} placeholder="Internal notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="text-sm min-h-9" />
          <Button size="sm" variant="outline" disabled={busy || notes === (donation.admin_notes || '')} onClick={() => patch({ admin_notes: notes }, 'Notes saved')} className="font-barlow-condensed uppercase tracking-wider text-xs">
            Save
          </Button>
          <Button size="icon" variant="ghost" disabled={busy} onClick={remove} className="text-ash hover:text-red-500 shrink-0" aria-label="Delete">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {receiving && (
        <ReceiveDialog donation={donation} inventory={inventory} recordedBy={recordedBy} onClose={() => setReceiving(false)} onDone={onChange} />
      )}
    </div>
  );
}

export default function IncomingDonations({ donations, inventory, recordedBy, onChange }) {
  const [filter, setFilter] = useState('open');
  const counts = useMemo(() => Object.fromEntries(FILTERS.map((f) => [f.key, donations.filter(f.match).length])), [donations]);
  const shown = donations.filter(FILTERS.find((f) => f.key === filter).match);

  const exportCsv = () =>
    downloadCsv(`ogwogd-donation-offers-${format(new Date(), 'yyyy-MM-dd')}.csv`, [
      { label: 'Submitted', value: (d) => d.created_date || '' },
      { label: 'Status', value: 'status' },
      { label: 'Donor', value: 'donor_name' },
      { label: 'Email', value: 'email' },
      { label: 'Phone', value: 'phone' },
      { label: 'Method', value: 'delivery_method' },
      { label: 'Address', value: fullAddress },
      { label: 'Miles', value: 'distance_miles' },
      { label: 'Best time', value: 'pickup_window' },
      { label: 'Scheduled', value: 'scheduled_for' },
      { label: 'Received', value: 'received_at' },
      { label: 'Items', value: itemsSummary },
      { label: 'Donor notes', value: 'notes' },
      { label: 'Admin notes', value: 'admin_notes' },
    ], donations);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-sm font-barlow-condensed text-xs uppercase tracking-wider transition-colors ${
                filter === f.key ? 'bg-ink text-cream' : 'bg-white border border-ink/10 text-ink/60 hover:text-ink'
              }`}
            >
              {f.label} ({counts[f.key]})
            </button>
          ))}
        </div>
        <Button size="sm" variant="outline" onClick={exportCsv} disabled={!donations.length} className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </Button>
      </div>
      {shown.length === 0 ? (
        <p className="font-barlow text-ash text-center py-12">Nothing here yet.</p>
      ) : (
        shown.map((d) => <DonationCard key={d.id} donation={d} inventory={inventory} recordedBy={recordedBy} onChange={onChange} />)
      )}
    </div>
  );
}
