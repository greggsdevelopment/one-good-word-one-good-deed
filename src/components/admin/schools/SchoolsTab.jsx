import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, CalendarDays, MessageSquare, Plus, School, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { lower, useAdminData, useEntityOps } from '@/lib/adminData';
import { detroitToday, money, prettyDate, withBalance } from '@/lib/portal';
import SchoolDetail from './SchoolDetail';

const label = 'font-barlow-condensed text-xs uppercase tracking-wider text-ash block mb-1';

function NewSchoolDialog({ open, onOpenChange, bookings, onCreated }) {
  const schools = useEntityOps('schools');
  const bookingsOps = useEntityOps('bookings');
  const [bookingId, setBookingId] = useState('');
  const [form, setForm] = useState({ name: '', district: '', school_type: 'public', city: '', grade_band: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pickBooking = (id) => {
    setBookingId(id);
    const b = bookings.find((x) => x.id === id);
    if (b) setForm((f) => ({ ...f, name: b.school_name || f.name, district: b.district || f.district, school_type: b.school_type || f.school_type, grade_band: b.grade_band || f.grade_band }));
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('Add the school name');
    setBusy(true);
    try {
      const b = bookings.find((x) => x.id === bookingId);
      const school = await schools.create({
        ...form,
        name: form.name.trim(),
        status: 'active',
        state: 'MI',
        billing_contact_name: b?.billing_contact_name || '',
        billing_email: b?.billing_contact_email || '',
        po_required: b?.payment_route === 'po',
      });
      if (b) await bookingsOps.update(b.id, { school_id: school.id });
      toast.success(`${school.name} added`, { description: b ? 'The booking is linked. Next: invite their staff.' : 'Next: invite their staff.' });
      onCreated(school, b);
      onOpenChange(false);
      setForm({ name: '', district: '', school_type: 'public', city: '', grade_band: '' });
      setBookingId('');
    } catch (err) {
      toast.error('Could not add the school', { description: err?.message });
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  const unlinked = bookings.filter((b) => !b.school_id && b.status !== 'cancelled');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader><DialogTitle className="font-anton tracking-wide">ADD A SCHOOL</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-3">
          {unlinked.length > 0 && (
            <div>
              <span className={label}>Start from a booking (fills in the details)</span>
              <select value={bookingId} onChange={(e) => pickBooking(e.target.value)} className="w-full h-10 rounded-md border border-input bg-white px-3 text-sm">
                <option value="">None</option>
                {unlinked.map((b) => (
                  <option key={b.id} value={b.id}>{b.school_name} · {b.contact_name} · {b.reference || prettyDate(b.created_date)}</option>
                ))}
              </select>
            </div>
          )}
          <div><span className={label}>School name</span><Input value={form.name} onChange={set('name')} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><span className={label}>District</span><Input value={form.district} onChange={set('district')} /></div>
            <div><span className={label}>City</span><Input value={form.city} onChange={set('city')} /></div>
            <div>
              <span className={label}>Type</span>
              <select value={form.school_type} onChange={set('school_type')} className="w-full h-10 rounded-md border border-input bg-white px-3 text-sm">
                {['public', 'charter', 'private', 'faith', 'other'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <span className={label}>Grades</span>
              <select value={form.grade_band} onChange={set('grade_band')} className="w-full h-10 rounded-md border border-input bg-white px-3 text-sm">
                <option value="">Not set</option>
                {['elementary', 'middle', 'high', 'k8', 'k12'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <Button type="submit" disabled={busy} className="w-full bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">
            {busy ? 'Adding...' : 'Add school'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function SchoolsTab({ initialSchool = '' }) {
  const { data } = useAdminData();
  const [selected, setSelected] = useState(initialSchool || null);
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const today = detroitToday();

  const rows = useMemo(() => {
    return data.schools
      .map((s) => {
        const invoices = data.invoices.filter((i) => i.school_id === s.id && i.status !== 'draft' && i.status !== 'void').map((i) => withBalance(i, data.payments, today));
        const next = data.sessions.filter((x) => x.school_id === s.id && x.date && x.date >= today && x.status !== 'cancelled').sort((a, b) => a.date.localeCompare(b.date))[0];
        return {
          ...s,
          members: data.schoolMembers.filter((m) => m.school_id === s.id && m.status !== 'removed'),
          requested: data.schoolMembers.filter((m) => m.school_id === s.id && m.status === 'requested').length,
          balance: invoices.reduce((t, i) => t + i.balance, 0),
          overdue: invoices.some((i) => i.state === 'overdue'),
          next,
          unread: data.portalMessages.filter((m) => m.school_id === s.id && m.author === 'school' && !m.read_by_ogwogd).length,
          openTasks: data.schoolTasks.filter((t) => t.school_id === s.id && !t.done).length,
        };
      })
      .filter((s) => !query.trim() || lower([s.name, s.district, s.city].join(' ')).includes(lower(query)))
      .sort((a, b) => (b.unread + b.requested) - (a.unread + a.requested) || String(a.name).localeCompare(String(b.name)));
  }, [data, query, today]);

  const current = data.schools.find((s) => s.id === selected);
  if (current) return <SchoolDetail school={current} onBack={() => setSelected(null)} />;

  const totalDue = rows.reduce((t, s) => t + s.balance, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-anton text-2xl text-ink tracking-wide">SCHOOLS</h2>
          <p className="font-barlow text-sm text-ash">
            {rows.length} school partner{rows.length === 1 ? '' : 's'} · {money(totalDue)} outstanding. Each school sees only its own portal.
          </p>
        </div>
        <Button onClick={() => setAdding(true)} className="bg-ink text-cream hover:bg-ink/90 font-barlow-condensed uppercase tracking-wider">
          <Plus className="w-4 h-4 mr-1" /> Add school
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-ash absolute left-3 top-1/2 -translate-y-1/2" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search schools" className="pl-9 bg-white" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rows.map((s) => (
          <button key={s.id} type="button" onClick={() => setSelected(s.id)} className="text-left bg-white border border-ink/10 hover:border-ink/40 rounded-sm p-4 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-barlow-condensed font-bold text-lg text-ink tracking-wide truncate">{s.name}</p>
                <p className="font-barlow text-xs text-ash truncate">{[s.district, s.city].filter(Boolean).join(' · ') || 'No district set'}</p>
              </div>
              {s.pending ? null : (
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-barlow-condensed uppercase tracking-wider ${s.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-ink/5 text-ash'}`}>{s.status || 'active'}</span>
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 font-barlow text-sm">
              <div>
                <p className="text-[10px] font-barlow-condensed uppercase tracking-wider text-ash">Balance</p>
                <p className={s.overdue ? 'text-red-600 font-semibold' : 'text-ink'}>{money(s.balance)}{s.overdue ? ' overdue' : ''}</p>
              </div>
              <div>
                <p className="text-[10px] font-barlow-condensed uppercase tracking-wider text-ash">Next date</p>
                <p className="text-ink flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5 text-ash" />{s.next ? prettyDate(s.next.date, { month: 'short', day: 'numeric' }) : 'None'}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-barlow-condensed uppercase tracking-wider">
              <span className="rounded-full bg-ink/5 text-ash px-2 py-0.5">{s.members.length} on portal</span>
              {s.openTasks > 0 && <span className="rounded-full bg-ink/5 text-ash px-2 py-0.5">{s.openTasks} open tasks</span>}
              {s.unread > 0 && <span className="rounded-full bg-violet-100 text-violet-700 px-2 py-0.5 inline-flex items-center gap-1"><MessageSquare className="w-3 h-3" />{s.unread} new</span>}
              {s.requested > 0 && <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{s.requested} access request</span>}
            </div>
          </button>
        ))}
        {!rows.length && (
          <div className="sm:col-span-2 lg:col-span-3 bg-white border border-dashed border-ink/15 rounded-sm p-10 text-center">
            <School className="w-8 h-8 mx-auto text-ash" />
            <p className="mt-3 font-barlow-condensed font-bold uppercase tracking-wider text-ink">No schools yet</p>
            <p className="font-barlow text-sm text-ash mt-1">Add one from a booking request to give their principal a portal.</p>
          </div>
        )}
      </div>

      <NewSchoolDialog open={adding} onOpenChange={setAdding} bookings={data.bookings} onCreated={(s) => setSelected(s.id)} />
    </div>
  );
}

