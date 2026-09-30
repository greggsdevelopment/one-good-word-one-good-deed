import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { toast as sonner } from 'sonner';
import { Search, Copy, Download, Mail, Phone, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { copyText, downloadCsv, isPrayer, lower, timeAgo, useAdminData } from '@/lib/adminData';

// Everyone who has touched the site, merged by email address.
export const ROLES = {
  subscriber: { label: 'Newsletter', style: 'bg-slate-100 text-slate-700' },
  customer: { label: 'Customer', style: 'bg-orange-100 text-orange-800' },
  school: { label: 'School contact', style: 'bg-blue-100 text-blue-800' },
  sponsor: { label: 'Sponsor', style: 'bg-green-100 text-green-800' },
  donor: { label: 'Item donor', style: 'bg-amber-100 text-amber-800' },
  attendee: { label: 'RSVP', style: 'bg-teal-100 text-teal-800' },
  messaged: { label: 'Messaged', style: 'bg-violet-100 text-violet-800' },
};

export function buildPeople(data) {
  const map = new Map();
  const touch = (email, { name, phone, role, when, detail, money = 0 }) => {
    const key = lower(email);
    if (!key || !key.includes('@')) return;
    const p = map.get(key) || { email: key, name: '', phone: '', roles: new Set(), first: null, last: null, count: 0, spent: 0, activity: [] };
    if (name && !p.name) p.name = name;
    if (phone && !p.phone) p.phone = phone;
    p.roles.add(role);
    p.count += 1;
    p.spent += money;
    if (when) {
      if (!p.first || when < p.first) p.first = when;
      if (!p.last || when > p.last) p.last = when;
    }
    p.activity.push({ role, when, detail });
    map.set(key, p);
  };

  data.subscribers.forEach((s) => touch(s.email, { role: 'subscriber', when: s.created_date, detail: 'Joined the newsletter' }));
  data.orders.forEach((o) => touch(o.email, { name: o.customer_name, role: 'customer', when: o.created_date, detail: `Order ${o.order_number || ''} $${Number(o.total || 0).toFixed(2)}`, money: Number(o.total) || 0 }));
  data.bookings.forEach((b) => touch(b.email, { name: b.contact_name, phone: b.phone, role: 'school', when: b.created_date, detail: `Booking request: ${b.school_name || ''}` }));
  data.sponsors.forEach((a) => touch(a.email, { name: a.contact_person, phone: a.phone, role: 'sponsor', when: a.created_date, detail: `Sponsor application: ${a.business_name || ''}` }));
  data.itemDonations.forEach((d) => touch(d.email, { name: d.donor_name, phone: d.phone, role: 'donor', when: d.created_date, detail: `Item donation (${(d.items || []).reduce((s, i) => s + (Number(i.quantity) || 0), 0)} items)` }));
  data.rsvps.forEach((r) => touch(r.email, { name: r.full_name, phone: r.phone, role: 'attendee', when: r.created_date, detail: `RSVP: ${r.event_title || 'event'}` }));
  data.messages.forEach((m) => touch(m.email, { name: m.name, role: 'messaged', when: m.created_date, detail: isPrayer(m) ? 'Prayer request' : `Message: ${m.subject || ''}` }));

  return [...map.values()]
    .map((p) => ({ ...p, roles: [...p.roles], activity: p.activity.sort((a, b) => String(b.when).localeCompare(String(a.when))) }))
    .sort((a, b) => String(b.last).localeCompare(String(a.last)));
}

export default function PeopleTab() {
  const { data, loading } = useAdminData();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [open, setOpen] = useState(null);

  const people = useMemo(() => buildPeople(data), [data]);
  const shown = useMemo(() => {
    const q = lower(search);
    return people
      .filter((p) => role === 'all' || p.roles.includes(role))
      .filter((p) => !q || [p.email, p.name, p.phone].some((v) => lower(v).includes(q)));
  }, [people, search, role]);

  const roleCounts = useMemo(() => {
    const c = { all: people.length };
    Object.keys(ROLES).forEach((r) => { c[r] = people.filter((p) => p.roles.includes(r)).length; });
    return c;
  }, [people]);

  const copyEmails = async () => {
    const ok = await copyText(shown.map((p) => p.email).join(', '));
    if (ok) sonner.success(`Copied ${shown.length} email${shown.length === 1 ? '' : 's'}`, { description: 'Paste into BCC so nobody sees the others.' });
    else sonner.error('Could not copy');
  };

  if (loading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;

  return (
    <div className="space-y-4">
      <p className="font-barlow text-sm text-ash">
        Everyone who has signed up, bought, booked, sponsored, donated, RSVPed or written in, merged into one list by email.
      </p>

      <div className="flex flex-wrap gap-1.5">
        {[['all', 'Everyone'], ...Object.entries(ROLES).map(([k, v]) => [k, v.label])].map(([k, label]) => (
          <button key={k} onClick={() => setRole(k)}
            className={`px-3 py-1.5 rounded-sm font-barlow-condensed text-xs uppercase tracking-wider ${role === k ? 'bg-ink text-cream' : 'bg-white border border-ink/10 text-ink/60 hover:text-ink'}`}>
            {label} ({roleCounts[k] || 0})
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email or phone" className="pl-9 bg-white h-9" />
        </div>
        <Button size="sm" variant="outline" disabled={!shown.length} onClick={copyEmails} className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5 h-9">
          <Copy className="w-3.5 h-3.5" /> Copy {shown.length} emails
        </Button>
        <Button size="sm" variant="outline" disabled={!shown.length} className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5 h-9"
          onClick={() => downloadCsv(`ogwogd-people-${role}-${format(new Date(), 'yyyy-MM-dd')}.csv`, [
            { label: 'Name', value: 'name' }, { label: 'Email', value: 'email' }, { label: 'Phone', value: 'phone' },
            { label: 'Roles', value: (p) => p.roles.map((r) => ROLES[r]?.label || r).join('; ') },
            { label: 'Interactions', value: 'count' }, { label: 'Spent', value: (p) => p.spent.toFixed(2) },
            { label: 'First seen', value: 'first' }, { label: 'Last seen', value: 'last' },
          ], shown)}>
          <Download className="w-3.5 h-3.5" /> CSV
        </Button>
      </div>

      {shown.length === 0 ? (
        <p className="font-barlow text-ash text-center py-12"><Users className="w-5 h-5 inline mr-1" /> {people.length ? 'No one matches.' : 'No contacts yet.'}</p>
      ) : (
        <div className="bg-white border border-ink/10 rounded-sm overflow-x-auto">
          <table className="w-full text-sm font-barlow">
            <thead>
              <tr className="border-b border-ink/10 text-left font-barlow-condensed text-[11px] uppercase tracking-wider text-ash">
                <th className="px-4 py-3">Person</th>
                <th className="px-4 py-3">Roles</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Touches</th>
                <th className="px-4 py-3 hidden md:table-cell">Last seen</th>
                <th className="px-4 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {shown.slice(0, 300).map((p) => (
                <FragmentRow key={p.email} p={p} open={open === p.email} onToggle={() => setOpen(open === p.email ? null : p.email)} />
              ))}
            </tbody>
          </table>
          {shown.length > 300 && <p className="px-4 py-3 font-barlow text-xs text-ash">Showing the 300 most recent. Search or use CSV for the rest.</p>}
        </div>
      )}
    </div>
  );
}

function FragmentRow({ p, open, onToggle }) {
  return (
    <>
      <tr className="border-b border-ink/5 hover:bg-ink/[0.02] cursor-pointer" onClick={onToggle}>
        <td className="px-4 py-3">
          <p className="font-semibold text-ink">{p.name || p.email.split('@')[0]}</p>
          <p className="text-xs text-ash">{p.email}{p.phone ? ` · ${p.phone}` : ''}</p>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1">
            {p.roles.map((r) => (
              <span key={r} className={`text-[10px] font-barlow-condensed uppercase tracking-wider px-2 py-0.5 rounded-full ${ROLES[r]?.style || ''}`}>{ROLES[r]?.label || r}</span>
            ))}
          </div>
        </td>
        <td className="px-4 py-3 text-right hidden sm:table-cell text-ink/70">{p.count}{p.spent > 0 ? ` · $${p.spent.toFixed(0)}` : ''}</td>
        <td className="px-4 py-3 hidden md:table-cell text-ink/60">{timeAgo(p.last)}</td>
        <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <a href={`mailto:${p.email}`} className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-ink/5 text-gold-dark" aria-label={`Email ${p.email}`}><Mail className="w-4 h-4" /></a>
          {p.phone && <a href={`tel:${p.phone}`} className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-ink/5 text-gold-dark" aria-label={`Call ${p.phone}`}><Phone className="w-4 h-4" /></a>}
        </td>
      </tr>
      {open && (
        <tr className="bg-ink/[0.02] border-b border-ink/5">
          <td colSpan={5} className="px-4 py-3">
            <ul className="space-y-1">
              {p.activity.map((a, i) => (
                <li key={i} className="font-barlow text-sm text-ink/80">
                  <span className="text-ash text-xs mr-2">{a.when ? format(new Date(a.when), 'MMM d, yyyy') : ''}</span>
                  {a.detail}
                </li>
              ))}
            </ul>
          </td>
        </tr>
      )}
    </>
  );
}
