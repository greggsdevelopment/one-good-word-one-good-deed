import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast as sonner } from 'sonner';
import { Mail, Phone, Globe, Building2, Download, Search, Trash2, AlertTriangle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ADMIN_SOURCES, SIGNATURE, businessDaysSince, downloadCsv, lower, mailto, timeAgo, useAdminData } from '@/lib/adminData';

const STAGES = [
  { value: 'new', label: 'New', style: 'bg-amber-100 text-amber-800' },
  { value: 'contacted', label: 'Contacted', style: 'bg-blue-100 text-blue-800' },
  { value: 'active', label: 'Active sponsor', style: 'bg-green-100 text-green-800' },
  { value: 'declined', label: 'Declined', style: 'bg-ink/10 text-ash' },
];

const money = (n) => `$${Number(n || 0).toLocaleString()}`;

function followUpEmail(a) {
  return mailto(
    a.email,
    `Sponsoring One Good Word...One Good Deed`,
    [
      `Hi ${(a.contact_person || '').split(' ')[0] || 'there'},`,
      '',
      `Thank you for applying to sponsor One Good Word...One Good Deed${a.business_name ? ` on behalf of ${a.business_name}` : ''}.`,
      a.sponsorship_level ? `You mentioned ${a.sponsorship_level}.` : null,
      a.funding_focus ? `You want it to go toward: ${a.funding_focus.toLowerCase()}.` : null,
      '',
      'I would love 15 minutes to walk you through exactly what that pays for and where your name shows up. What does your week look like?',
      SIGNATURE,
    ].filter((l) => l !== null).join('\n'),
  );
}

function thankYouEmail(a) {
  return mailto(
    a.email,
    `Welcome to the One Good Word sponsor family`,
    [
      `Hi ${(a.contact_person || '').split(' ')[0] || 'there'},`,
      '',
      `Thank you${a.business_name ? ` and everyone at ${a.business_name}` : ''} for standing with us. Your support goes straight to the kids.`,
      '',
      'Please send your logo (PNG with a transparent background if you have it) and a line or two about your business, and we will get you onto the Sponsor Hall of Fame at ogwogd.org/hall-of-fame.',
      SIGNATURE,
    ].join('\n'),
  );
}

function AppCard({ app, onSaved }) {
  const [notes, setNotes] = useState(app.admin_notes || '');
  const [amount, setAmount] = useState(app.amount_committed ?? '');
  const [busy, setBusy] = useState(false);
  const stage = app.status || 'new';
  const st = STAGES.find((s) => s.value === stage) || STAGES[0];
  const overdue = stage === 'new' && businessDaysSince(app.created_date) >= 2;

  const save = async (patch, msg) => {
    setBusy(true);
    try {
      await base44.entities.SponsorshipApplication.update(app.id, { read: true, ...patch });
      if (msg) sonner.success(msg);
      onSaved();
    } catch (err) {
      sonner.error('Could not save', { description: err?.message });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete the application from ${app.business_name}?`)) return;
    await base44.entities.SponsorshipApplication.delete(app.id);
    onSaved();
  };

  return (
    <div className={`bg-white rounded-sm border p-5 ${stage === 'new' ? 'border-l-4 border-l-gold border-gold/20' : 'border-ink/10'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Building2 className="w-4 h-4 text-ink/50" />
            <p className="font-barlow font-semibold text-ink text-lg">{app.business_name}</p>
            <span className={`text-[10px] font-barlow-condensed uppercase tracking-wider px-2 py-0.5 rounded-full ${st.style}`}>{st.label}</span>
            {overdue && (
              <span className="inline-flex items-center gap-1 text-[10px] font-barlow-condensed uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                <AlertTriangle className="w-3 h-3" /> reply overdue
              </span>
            )}
          </div>
          <p className="font-barlow text-sm text-ink/70 mt-0.5">{app.contact_person}{app.city ? ` · ${app.city}` : ''}</p>
        </div>
        <p className="font-barlow text-ash text-xs">{app.created_date ? format(new Date(app.created_date), 'MMM d, yyyy') : ''} · {timeAgo(app.created_date)}</p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm font-barlow mt-2">
        {app.email && <a href={`mailto:${app.email}`} className="flex items-center gap-1 text-gold-dark hover:underline"><Mail className="w-3.5 h-3.5" /> {app.email}</a>}
        {app.phone && <a href={`tel:${app.phone}`} className="flex items-center gap-1 text-gold-dark hover:underline"><Phone className="w-3.5 h-3.5" /> {app.phone}</a>}
        {app.website && <a href={/^https?:/.test(app.website) ? app.website : `https://${app.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gold-dark hover:underline"><Globe className="w-3.5 h-3.5" /> {app.website}</a>}
      </div>

      <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-1 font-barlow text-sm mt-3">
        {[
          ['Level', app.sponsorship_level],
          ['Wants it to fund', app.funding_focus],
          ['School of interest', app.school_of_interest],
          ['In-kind', app.in_kind],
        ].filter(([, v]) => v).map(([k, v]) => (
          <div key={k}><dt className="inline text-ash">{k}: </dt><dd className="inline text-ink/80">{v}</dd></div>
        ))}
      </dl>
      {app.message && <p className="font-barlow text-sm text-ink/70 mt-2 italic">"{app.message}"</p>}

      <div className="mt-4 pt-4 border-t border-ink/5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <select value={stage} disabled={busy} onChange={(e) => save({ status: e.target.value }, `Moved to ${STAGES.find((s) => s.value === e.target.value)?.label}`)}
            className="h-9 border border-input rounded-md px-2 text-sm bg-transparent">
            {STAGES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          <a href={followUpEmail(app)} onClick={() => stage === 'new' && save({ status: 'contacted' })}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-ink/15 font-barlow-condensed uppercase tracking-wider text-xs hover:bg-ink/5">
            <Mail className="w-3.5 h-3.5" /> Follow-up email
          </a>
          <a href={thankYouEmail(app)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-ink/15 font-barlow-condensed uppercase tracking-wider text-xs hover:bg-ink/5">
            <Mail className="w-3.5 h-3.5" /> Welcome email
          </a>
          <div className="flex items-center gap-1 ml-auto">
            <span className="font-barlow text-xs text-ash">Committed $</span>
            <Input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} className="h-9 w-28" />
            <Button size="sm" variant="outline" disabled={busy || String(amount) === String(app.amount_committed ?? '')}
              onClick={() => save({ amount_committed: amount === '' ? null : Number(amount) }, 'Amount saved')}
              className="font-barlow-condensed uppercase tracking-wider text-xs">Save</Button>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Textarea rows={1} placeholder="Internal notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="text-sm min-h-9" />
          <Button size="sm" variant="outline" disabled={busy || notes === (app.admin_notes || '')} onClick={() => save({ admin_notes: notes }, 'Notes saved')} className="font-barlow-condensed uppercase tracking-wider text-xs">Save</Button>
          <Button size="icon" variant="ghost" onClick={remove} className="text-ash hover:text-red-500 shrink-0" aria-label="Delete"><Trash2 className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
}

export default function SponsorTab() {
  const qc = useQueryClient();
  const { data, loading } = useAdminData();
  const apps = data.sponsors;
  const [stage, setStage] = useState('open');
  const [search, setSearch] = useState('');
  const refresh = () => qc.invalidateQueries({ queryKey: ADMIN_SOURCES.sponsors.key });

  // Older inquiries from the retired partner form, if any exist.
  const { data: legacy = [] } = useQuery({
    queryKey: ['partnerInquiries'],
    queryFn: async () => {
      try {
        return await base44.entities.PartnerInquiry.list('-created_date', 200);
      } catch {
        return [];
      }
    },
  });

  const filters = [
    { key: 'open', label: 'Open', match: (a) => !a.status || a.status === 'new' || a.status === 'contacted' },
    ...STAGES.map((s) => ({ key: s.value, label: s.label, match: (a) => (a.status || 'new') === s.value })),
    { key: 'all', label: 'All', match: () => true },
  ];
  const counts = useMemo(() => Object.fromEntries(filters.map((f) => [f.key, apps.filter(f.match).length])), [apps]);
  const shown = apps
    .filter(filters.find((f) => f.key === stage).match)
    .filter((a) => !lower(search) || [a.business_name, a.contact_person, a.email, a.city].some((v) => lower(v).includes(lower(search))));

  const committed = apps.filter((a) => a.status === 'active').reduce((s, a) => s + (Number(a.amount_committed) || 0), 0);

  if (loading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ['New applications', counts.new, counts.new ? 'text-amber-600' : 'text-ink'],
          ['In conversation', counts.contacted, 'text-ink'],
          ['Active sponsors', counts.active, 'text-green-700'],
          ['Committed by active sponsors', money(committed), 'text-ink'],
        ].map(([label, value, tone]) => (
          <div key={label} className="bg-white rounded-sm p-4 border border-ink/5">
            <p className={`font-anton text-3xl ${tone}`}>{value}</p>
            <p className="font-barlow text-ash text-xs">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button key={f.key} onClick={() => setStage(f.key)}
            className={`px-3 py-1.5 rounded-sm font-barlow-condensed text-xs uppercase tracking-wider ${stage === f.key ? 'bg-ink text-cream' : 'bg-white border border-ink/10 text-ink/60 hover:text-ink'}`}>
            {f.label} ({counts[f.key]})
          </button>
        ))}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Business, contact, email, city" className="pl-9 bg-white h-9" />
        </div>
        <Button size="sm" variant="outline" disabled={!apps.length} className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5"
          onClick={() => downloadCsv(`ogwogd-sponsors-${format(new Date(), 'yyyy-MM-dd')}.csv`, [
            { label: 'Submitted', value: 'created_date' }, { label: 'Status', value: 'status' }, { label: 'Business', value: 'business_name' },
            { label: 'Contact', value: 'contact_person' }, { label: 'Email', value: 'email' }, { label: 'Phone', value: 'phone' },
            { label: 'City', value: 'city' }, { label: 'Level', value: 'sponsorship_level' }, { label: 'Focus', value: 'funding_focus' },
            { label: 'School', value: 'school_of_interest' }, { label: 'In-kind', value: 'in_kind' }, { label: 'Committed', value: 'amount_committed' },
            { label: 'Notes', value: 'admin_notes' },
          ], apps)}>
          <Download className="w-3.5 h-3.5" /> CSV
        </Button>
      </div>

      {shown.length === 0 ? (
        <p className="font-barlow text-ash text-center py-12">{apps.length ? 'Nothing here.' : 'No sponsorship applications yet. They come from ogwogd.org/sponsorship.'}</p>
      ) : (
        shown.map((a) => <AppCard key={a.id} app={a} onSaved={refresh} />)
      )}

      {legacy.length > 0 && (
        <details className="bg-white border border-ink/10 rounded-sm p-4">
          <summary className="font-barlow-condensed text-xs uppercase tracking-wider text-ash cursor-pointer">Older partner inquiries ({legacy.length})</summary>
          <ul className="mt-3 space-y-2">
            {legacy.map((l) => (
              <li key={l.id} className="font-barlow text-sm text-ink/80">
                <span className="font-semibold">{l.business_name}</span> · {l.contact_person} · <a href={`mailto:${l.email}`} className="text-gold-dark hover:underline">{l.email}</a>
                {l.message ? <span className="text-ash"> · {l.message}</span> : null}
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
