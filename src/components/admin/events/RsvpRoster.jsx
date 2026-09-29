import { useMemo, useState } from 'react';
import { Search, Copy, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { partySize, downloadRosterCsv } from '@/lib/rsvpUtils';
import RsvpTable from '@/components/admin/events/RsvpTable';

const SORTS = {
  newest: (a, b) => (b.created_date || '').localeCompare(a.created_date || ''),
  oldest: (a, b) => (a.created_date || '').localeCompare(b.created_date || ''),
  name: (a, b) => (a.full_name || '').localeCompare(b.full_name || ''),
  party: (a, b) => partySize(b) - partySize(a),
};
const btn = 'flex items-center gap-1.5 px-3 py-2 border border-gold/30 hover:bg-gold hover:text-ink text-gold font-barlow-condensed text-xs uppercase tracking-wider rounded-sm transition-colors';

export default function RsvpRoster({ event, rsvps, onChange }) {
  const { toast } = useToast();
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('newest');

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rsvps
      .filter((r) => !term || [r.full_name, r.email, r.phone].some((v) => (v || '').toLowerCase().includes(term)))
      .sort(SORTS[sort]);
  }, [rsvps, q, sort]);

  const copyEmails = async () => {
    const emails = [...new Set(rsvps.map((r) => r.email).filter(Boolean))].join(', ');
    await navigator.clipboard.writeText(emails);
    toast({ title: 'Emails copied', description: `${emails ? emails.split(', ').length : 0} addresses copied to clipboard.` });
  };

  return (
    <div className="border-t border-cream/10 pt-4 mt-4 space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cream/30 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, or phone"
            className="w-full bg-cream/[0.04] border border-cream/10 rounded-sm pl-9 pr-3 py-2 text-cream text-sm font-barlow placeholder:text-cream/30 focus:outline-none focus:border-gold/40" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)}
          className="bg-ink border border-cream/10 rounded-sm px-3 py-2 text-cream text-sm font-barlow-condensed uppercase tracking-wider">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name</option>
          <option value="party">Party size</option>
        </select>
        <button onClick={copyEmails} className={btn}><Copy className="w-3.5 h-3.5" /> Copy Emails</button>
        <button onClick={() => downloadRosterCsv(event, rsvps)} className={btn}><Download className="w-3.5 h-3.5" /> Export CSV</button>
      </div>
      {shown.length === 0
        ? <p className="font-barlow text-cream/40 text-sm py-4 text-center">{rsvps.length ? 'No RSVPs match your search.' : 'No RSVPs yet.'}</p>
        : <RsvpTable rsvps={shown} onChange={onChange} />}
    </div>
  );
}