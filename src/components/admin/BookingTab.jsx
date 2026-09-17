import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trash2, Phone, Mail, Calendar, Users, FileText, Building2, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { formatUSD } from '@/data/programPricing';

const PIPELINE = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'po_received', label: 'PO received' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'invoiced', label: 'Invoiced' },
  { value: 'paid', label: 'Paid' },
  { value: 'cancelled', label: 'Cancelled' },
];

const STATUS_STYLE = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-slate-50 text-slate-700 border-slate-200',
  quoted: 'bg-amber-50 text-amber-700 border-amber-200',
  po_received: 'bg-violet-50 text-violet-700 border-violet-200',
  scheduled: 'bg-teal-50 text-teal-700 border-teal-200',
  delivered: 'bg-teal-50 text-teal-700 border-teal-200',
  invoiced: 'bg-orange-50 text-orange-700 border-orange-200',
  paid: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const BAND_LABEL = { elementary: 'Elementary K-5', middle: 'Middle 6-8', high: 'High 9-12' };
const TYPE_LABEL = {
  public_district: 'Public district',
  charter: 'Charter',
  private: 'Private',
  faith_based: 'Faith-based',
  other: 'Other',
};

function parseLines(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function fmtDate(value) {
  if (!value) return null;
  try {
    return format(new Date(value), 'MMM d, yyyy');
  } catch {
    return value;
  }
}

function quoteEmail(b, lines) {
  const body = [
    `Hi ${b.contact_name || 'there'},`,
    '',
    `Thanks for reaching out about One Good Word One Good Deed at ${b.school_name}.`,
    '',
    'Here is what you selected:',
    ...lines.map((l) => `  - ${l.name}${l.detail ? ` (${l.detail})` : ''}: ${formatUSD(l.amount)}`),
    '',
    `Estimated total: ${formatUSD(b.quoted_total || 0)}`,
    '',
    b.payment_route === 'po'
      ? 'I have attached a W-9 and a formal quote so your business office can issue a purchase order.'
      : 'I have attached an invoice you can pay by card or bank transfer.',
    '',
    'Let me know which of your dates still works and I will hold it.',
    '',
    'Cody Greggs-Dorsey',
    '(734) 383-3865',
  ].join('\n');
  return `mailto:${b.email}?subject=${encodeURIComponent(
    `One Good Word program for ${b.school_name}`,
  )}&body=${encodeURIComponent(body)}`;
}

export default function BookingTab() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => base44.entities.BookingRequest.list('-created_date', 100),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['bookings'] });

  const updateBooking = useMutation({
    mutationFn: ({ id, ...patch }) => base44.entities.BookingRequest.update(id, patch),
    onSuccess: invalidate,
  });

  const deleteBooking = useMutation({
    mutationFn: (id) => base44.entities.BookingRequest.delete(id),
    onSuccess: invalidate,
  });

  if (isLoading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;

  if (bookings.length === 0)
    return <p className="font-barlow text-ash text-center py-12">No booking requests yet.</p>;

  const pipelineValue = formatUSD(
    bookings
      .filter((b) => !['paid', 'cancelled'].includes(b.status))
      .reduce((sum, b) => sum + (Number(b.quoted_total) || 0), 0),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white rounded-sm border border-ink/5 px-5 py-4">
        <p className="font-barlow text-ink/60 text-sm">
          {bookings.length} request{bookings.length === 1 ? '' : 's'}
        </p>
        <p className="font-barlow text-ink/60 text-sm">
          Open pipeline <span className="font-barlow-condensed text-ink text-lg ml-2">{pipelineValue}</span>
        </p>
      </div>

      {bookings.map((b) => {
        const lines = parseLines(b.line_items);
        const dates = [b.date_window_1, b.date_window_2, b.date_window_3]
          .concat(lines.length ? [] : [b.preferred_date])
          .filter(Boolean);

        return (
          <div key={b.id} className="bg-white rounded-sm border border-ink/5 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <h3 className="font-barlow font-bold text-ink text-lg">{b.school_name}</h3>
                  {b.reference && (
                    <span className="font-barlow-condensed text-ash text-xs tracking-wider">{b.reference}</span>
                  )}
                  <Badge variant="outline" className={`text-xs ${STATUS_STYLE[b.status] || ''}`}>
                    {PIPELINE.find((p) => p.value === b.status)?.label || b.status || 'New'}
                  </Badge>
                  {b.quoted_total > 0 && (
                    <span className="font-barlow-condensed text-ink text-base">{formatUSD(b.quoted_total)}</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {b.grade_band && (
                    <Badge variant="secondary" className="text-xs">{BAND_LABEL[b.grade_band] || b.grade_band}</Badge>
                  )}
                  {b.school_type && (
                    <Badge variant="secondary" className="text-xs">
                      <Building2 className="w-3 h-3 mr-1" />
                      {TYPE_LABEL[b.school_type] || b.school_type}
                    </Badge>
                  )}
                  {b.num_students > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {b.num_students} students
                    </Badge>
                  )}
                  {b.target_term && <Badge variant="secondary" className="text-xs">{b.target_term}</Badge>}
                  {b.needs_w9 && (
                    <Badge variant="outline" className="text-xs border-amber-200 text-amber-700 bg-amber-50">
                      W-9 requested
                    </Badge>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-2 mb-3">
                  <p className="font-barlow text-ink/70 text-sm">
                    <span className="text-ash">Contact:</span> {b.contact_name}
                    {b.contact_role ? `, ${b.contact_role}` : ''}
                  </p>
                  {b.district && (
                    <p className="font-barlow text-ink/70 text-sm">
                      <span className="text-ash">District:</span> {b.district}
                    </p>
                  )}
                  {b.email && (
                    <a href={`mailto:${b.email}`} className="font-barlow text-sm flex items-center gap-1.5 text-gold-dark hover:underline">
                      <Mail className="w-3.5 h-3.5" /> {b.email}
                    </a>
                  )}
                  {b.phone && (
                    <a href={`tel:${b.phone}`} className="font-barlow text-sm flex items-center gap-1.5 text-gold-dark hover:underline">
                      <Phone className="w-3.5 h-3.5" /> {b.phone}
                    </a>
                  )}
                </div>

                {dates.length > 0 && (
                  <p className="font-barlow text-ink/60 text-sm flex items-center gap-2 flex-wrap mb-3">
                    <Calendar className="w-3.5 h-3.5 text-ash" />
                    {dates.map(fmtDate).join('  /  ')}
                  </p>
                )}

                {lines.length > 0 && (
                  <div className="bg-cream/60 rounded-sm p-3 mb-3">
                    <p className="font-barlow-condensed text-ash text-xs tracking-widest uppercase mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Selected
                      {b.package_type && b.package_type !== 'custom' ? ` (${b.package_type.replace('_', ' ')} package)` : ''}
                    </p>
                    {lines.map((l, i) => (
                      <div key={`${l.key || l.name}-${i}`} className="flex justify-between gap-4 py-0.5">
                        <span className="font-barlow text-ink/70 text-sm">
                          {l.name}
                          {l.detail ? <span className="text-ash"> ({l.detail})</span> : null}
                        </span>
                        <span className="font-barlow-condensed text-ink/80 text-sm shrink-0">{formatUSD(l.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {(b.payment_route || b.po_number || b.billing_contact_email) && (
                  <div className="bg-cream/60 rounded-sm p-3 mb-3">
                    <p className="font-barlow-condensed text-ash text-xs tracking-widest uppercase mb-2 flex items-center gap-1.5">
                      <Receipt className="w-3.5 h-3.5" />
                      {b.payment_route === 'po' ? 'Purchase order' : 'Direct invoice'}
                    </p>
                    <div className="font-barlow text-ink/70 text-sm space-y-0.5">
                      {b.po_number && <p>PO {b.po_number}</p>}
                      {b.billing_contact_name && <p>{b.billing_contact_name}</p>}
                      {b.billing_contact_email && (
                        <a href={`mailto:${b.billing_contact_email}`} className="text-gold-dark hover:underline">
                          {b.billing_contact_email}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {b.message && (
                  <div className="bg-cream/60 rounded-sm p-3 mb-3">
                    <p className="font-barlow text-ink/60 text-sm whitespace-pre-line">{b.message}</p>
                  </div>
                )}

                <div className="flex items-center gap-3 flex-wrap mt-4">
                  <select
                    value={b.status || 'new'}
                    onChange={(e) => updateBooking.mutate({ id: b.id, status: e.target.value })}
                    className="font-barlow text-sm border border-ink/15 rounded-sm px-3 py-2 bg-white text-ink/80 cursor-pointer"
                  >
                    {PIPELINE.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>

                  {b.email && (
                    <a
                      href={quoteEmail(b, lines)}
                      className="font-barlow-condensed text-xs uppercase tracking-wider px-4 py-2 border border-ink/15 hover:border-gold-dark/50 text-ink/60 hover:text-gold-dark rounded-sm transition-all"
                    >
                      Send quote email
                    </a>
                  )}

                  <p className="font-barlow text-ash text-xs ml-auto">
                    {new Date(b.created_date).toLocaleString()}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteBooking.mutate(b.id)}
                className="text-ash hover:text-red-500 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
