import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast as sonner } from 'sonner';
import { Copy, Mail, Truck, PackageCheck, Download, Search, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ADMIN_SOURCES, SIGNATURE, copyText, downloadCsv, lower, mailto, parseJsonList, timeAgo, useAdminData } from '@/lib/adminData';

const STATUS = [
  { value: 'pending', label: 'To pack', style: 'bg-amber-100 text-amber-800' },
  { value: 'processing', label: 'Packed', style: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Shipped', style: 'bg-teal-100 text-teal-800' },
  { value: 'delivered', label: 'Delivered', style: 'bg-green-100 text-green-800' },
];
const FILTERS = [
  { key: 'open', label: 'Needs shipping', match: (o) => !o.status || o.status === 'pending' || o.status === 'processing' },
  { key: 'shipped', label: 'Shipped', match: (o) => o.status === 'shipped' },
  { key: 'delivered', label: 'Delivered', match: (o) => o.status === 'delivered' },
  { key: 'all', label: 'All', match: () => true },
];
const CARRIERS = ['USPS', 'UPS', 'FedEx', 'Hand delivered'];

const money = (n) => `$${Number(n || 0).toFixed(2)}`;
const shipTo = (o) => [o.customer_name, o.address, [o.city, o.state].filter(Boolean).join(', ') + (o.zip ? ` ${o.zip}` : '')].filter(Boolean).join('\n');

function trackingUrl(carrier, num) {
  if (!num) return null;
  const n = encodeURIComponent(num.trim());
  if (carrier === 'USPS') return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${n}`;
  if (carrier === 'UPS') return `https://www.ups.com/track?tracknum=${n}`;
  if (carrier === 'FedEx') return `https://www.fedex.com/fedextrack/?trknbr=${n}`;
  return null;
}

function shippedEmail(o) {
  const url = trackingUrl(o.carrier, o.tracking_number);
  return mailto(
    o.email,
    `Your One Good Word order ${o.order_number || ''} is on the way`,
    [
      `Hi ${(o.customer_name || '').split(' ')[0] || 'there'},`,
      '',
      'Your order just shipped. Thank you for wearing the message.',
      o.tracking_number ? `\n${o.carrier || 'Tracking'}: ${o.tracking_number}${url ? `\n${url}` : ''}` : '',
      '',
      'Every purchase helps put the program in front of another school.',
      SIGNATURE,
    ].join('\n'),
  );
}

function OrderCard({ order, onSaved }) {
  const [carrier, setCarrier] = useState(order.carrier || 'USPS');
  const [tracking, setTracking] = useState(order.tracking_number || '');
  const [notes, setNotes] = useState(order.admin_notes || '');
  const [busy, setBusy] = useState(false);
  const items = parseJsonList(order.items);
  const status = order.status || 'pending';
  const st = STATUS.find((s) => s.value === status) || STATUS[0];
  const url = trackingUrl(order.carrier, order.tracking_number);

  const save = async (patch, msg) => {
    setBusy(true);
    try {
      await base44.entities.Order.update(order.id, patch);
      if (msg) sonner.success(msg);
      onSaved();
    } catch (err) {
      sonner.error('Could not save', { description: err?.message });
    } finally {
      setBusy(false);
    }
  };

  const markShipped = () =>
    save({ status: 'shipped', carrier, tracking_number: tracking.trim(), shipped_at: new Date().toISOString() }, 'Marked shipped. Send the customer their tracking email.');

  return (
    <div className={`bg-white rounded-sm border p-5 ${status === 'pending' ? 'border-l-4 border-l-gold border-gold/20' : 'border-ink/10'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-barlow font-semibold text-ink text-lg">{order.customer_name}</p>
            <span className="font-barlow-condensed text-ash text-xs tracking-wider">{order.order_number}</span>
            <span className={`text-[10px] font-barlow-condensed uppercase tracking-wider px-2 py-0.5 rounded-full ${st.style}`}>{st.label}</span>
            {order.payment_status && order.payment_status !== 'paid' && (
              <span className="text-[10px] font-barlow-condensed uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700">payment {order.payment_status}</span>
            )}
          </div>
          <p className="font-barlow text-ash text-xs mt-0.5">
            {order.created_date ? format(new Date(order.created_date), 'MMM d, yyyy h:mm a') : ''} · {timeAgo(order.created_date)}
          </p>
        </div>
        <p className="font-anton text-2xl text-ink">{money(order.total)}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-3">
        <div>
          <p className="font-barlow-condensed text-[11px] uppercase tracking-wider text-ash mb-1">Items</p>
          <ul className="font-barlow text-sm text-ink/80 space-y-0.5">
            {items.length ? items.map((i, idx) => (
              <li key={idx}><span className="font-semibold">{i.quantity ?? 1}</span> x {i.name || i.title || i.id}{i.size ? ` (${i.size})` : ''}</li>
            )) : <li className="text-ash">No item detail saved</li>}
          </ul>
        </div>
        <div>
          <p className="font-barlow-condensed text-[11px] uppercase tracking-wider text-ash mb-1 flex items-center gap-2">
            Ship to
            <button
              onClick={async () => sonner[(await copyText(shipTo(order))) ? 'success' : 'error']('Address copied')}
              className="inline-flex items-center gap-1 text-gold-dark hover:underline normal-case tracking-normal"
            >
              <Copy className="w-3 h-3" /> copy label
            </button>
          </p>
          <p className="font-barlow text-sm text-ink/80 whitespace-pre-line">{shipTo(order)}</p>
          <a href={`mailto:${order.email}`} className="font-barlow text-sm text-gold-dark hover:underline">{order.email}</a>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-ink/5 space-y-3">
        {(status === 'pending' || status === 'processing') && (
          <div className="flex flex-wrap items-end gap-2">
            {status === 'pending' && (
              <Button size="sm" variant="outline" disabled={busy} onClick={() => save({ status: 'processing' }, 'Marked packed')} className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5">
                <PackageCheck className="w-3.5 h-3.5" /> Packed
              </Button>
            )}
            <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className="h-9 border border-input rounded-md px-2 text-sm bg-transparent">
              {CARRIERS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <Input placeholder="Tracking number" value={tracking} onChange={(e) => setTracking(e.target.value)} className="h-9 w-56" />
            <Button size="sm" disabled={busy} onClick={markShipped} className="bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider text-xs gap-1.5">
              <Truck className="w-3.5 h-3.5" /> Mark Shipped
            </Button>
          </div>
        )}
        {(status === 'shipped' || status === 'delivered') && (
          <div className="flex flex-wrap items-center gap-3 font-barlow text-sm">
            <span className="text-ash">
              {order.carrier || 'Shipped'} {order.tracking_number || ''}
              {order.shipped_at ? ` · ${format(new Date(order.shipped_at), 'MMM d')}` : ''}
            </span>
            {url && <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gold-dark hover:underline"><ExternalLink className="w-3.5 h-3.5" /> Track</a>}
            <a href={shippedEmail(order)} className="inline-flex items-center gap-1 text-gold-dark hover:underline"><Mail className="w-3.5 h-3.5" /> Email tracking to customer</a>
            {status === 'shipped' && (
              <Button size="sm" variant="outline" disabled={busy} onClick={() => save({ status: 'delivered' }, 'Marked delivered')} className="font-barlow-condensed uppercase tracking-wider text-xs">
                Mark Delivered
              </Button>
            )}
          </div>
        )}
        <div className="flex items-start gap-2">
          <Textarea rows={1} placeholder="Internal notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="text-sm min-h-9" />
          <Button size="sm" variant="outline" disabled={busy || notes === (order.admin_notes || '')} onClick={() => save({ admin_notes: notes }, 'Notes saved')} className="font-barlow-condensed uppercase tracking-wider text-xs">Save</Button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersTab() {
  const qc = useQueryClient();
  const { data, loading } = useAdminData();
  const orders = data.orders;
  const [filter, setFilter] = useState('open');
  const [search, setSearch] = useState('');
  const refresh = () => qc.invalidateQueries({ queryKey: ADMIN_SOURCES.orders.key });

  const counts = useMemo(() => Object.fromEntries(FILTERS.map((f) => [f.key, orders.filter(f.match).length])), [orders]);
  const shown = useMemo(() => {
    const q = lower(search);
    return orders
      .filter(FILTERS.find((f) => f.key === filter).match)
      .filter((o) => !q || [o.customer_name, o.email, o.order_number, o.city, o.tracking_number].some((v) => lower(v).includes(q)));
  }, [orders, filter, search]);

  const revenue = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const month = orders.filter((o) => o.created_date && new Date(o.created_date).getMonth() === new Date().getMonth() && new Date(o.created_date).getFullYear() === new Date().getFullYear());

  if (loading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ['Needs shipping', counts.open, counts.open ? 'text-amber-600' : 'text-ink'],
          ['Orders this month', month.length, 'text-ink'],
          ['Revenue this month', money(month.reduce((s, o) => s + (Number(o.total) || 0), 0)), 'text-ink'],
          ['Revenue all time', money(revenue), 'text-ink'],
        ].map(([label, value, tone]) => (
          <div key={label} className="bg-white rounded-sm p-4 border border-ink/5">
            <p className={`font-anton text-3xl ${tone}`}>{value}</p>
            <p className="font-barlow text-ash text-xs">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-sm font-barlow-condensed text-xs uppercase tracking-wider ${filter === f.key ? 'bg-ink text-cream' : 'bg-white border border-ink/10 text-ink/60 hover:text-ink'}`}>
            {f.label} ({counts[f.key]})
          </button>
        ))}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email, order #, tracking" className="pl-9 bg-white h-9" />
        </div>
        <Button size="sm" variant="outline" disabled={!orders.length} className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5"
          onClick={() => downloadCsv(`ogwogd-orders-${format(new Date(), 'yyyy-MM-dd')}.csv`, [
            { label: 'Date', value: 'created_date' }, { label: 'Order', value: 'order_number' }, { label: 'Status', value: 'status' },
            { label: 'Customer', value: 'customer_name' }, { label: 'Email', value: 'email' }, { label: 'Address', value: 'address' },
            { label: 'City', value: 'city' }, { label: 'State', value: 'state' }, { label: 'ZIP', value: 'zip' },
            { label: 'Items', value: (o) => parseJsonList(o.items).map((i) => `${i.quantity ?? 1} x ${i.name || i.id}`).join('; ') },
            { label: 'Total', value: 'total' }, { label: 'Carrier', value: 'carrier' }, { label: 'Tracking', value: 'tracking_number' },
            { label: 'Shipped', value: 'shipped_at' }, { label: 'Notes', value: 'admin_notes' },
          ], orders)}>
          <Download className="w-3.5 h-3.5" /> CSV
        </Button>
      </div>

      {shown.length === 0 ? (
        <p className="font-barlow text-ash text-center py-12">{orders.length ? 'Nothing here.' : 'No shop orders yet. Paid orders from Stripe land here automatically.'}</p>
      ) : (
        shown.map((o) => <OrderCard key={o.id} order={o} onSaved={refresh} />)
      )}
    </div>
  );
}
