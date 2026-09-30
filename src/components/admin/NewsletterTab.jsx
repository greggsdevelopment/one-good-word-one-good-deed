import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { toast as sonner } from 'sonner';
import { Copy, Download, Search, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ADMIN_SOURCES, copyText, downloadCsv, lower, useAdminData } from '@/lib/adminData';

export default function NewsletterTab() {
  const qc = useQueryClient();
  const { data, loading } = useAdminData();
  const [search, setSearch] = useState('');
  const subscribers = data.subscribers;

  // Same address submitted twice only counts once.
  const unique = useMemo(() => {
    const seen = new Set();
    return subscribers.filter((s) => {
      const k = lower(s.email);
      if (!k || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [subscribers]);
  const dupes = subscribers.length - unique.length;
  const shown = unique.filter((s) => !lower(search) || lower(s.email).includes(lower(search)));
  const last30 = unique.filter((s) => s.created_date && new Date(s.created_date) >= subDays(new Date(), 30)).length;

  const remove = async (s) => {
    if (!window.confirm(`Remove ${s.email} from the list?`)) return;
    const all = subscribers.filter((x) => lower(x.email) === lower(s.email));
    await Promise.all(all.map((x) => base44.entities.NewsletterSubscriber.delete(x.id)));
    sonner.success('Removed');
    qc.invalidateQueries({ queryKey: ADMIN_SOURCES.subscribers.key });
  };

  const copyAll = async () => {
    const ok = await copyText(shown.map((s) => s.email).join(', '));
    if (ok) sonner.success(`Copied ${shown.length} emails`, { description: 'Paste into BCC, never To or CC.' });
    else sonner.error('Could not copy');
  };

  if (loading) return <div className="py-12 text-center font-barlow text-ash">Loading subscribers...</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[['Subscribers', unique.length], ['New in 30 days', last30], ['Duplicate signups ignored', dupes]].map(([l, v]) => (
          <div key={l} className="bg-white rounded-sm p-4 border border-ink/5">
            <p className="font-anton text-3xl text-ink">{v}</p>
            <p className="font-barlow text-ash text-xs">{l}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search email" className="pl-9 bg-white h-9" />
        </div>
        <Button size="sm" variant="outline" disabled={!shown.length} onClick={copyAll} className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5 h-9">
          <Copy className="w-3.5 h-3.5" /> Copy all for BCC
        </Button>
        <Button size="sm" variant="outline" disabled={!shown.length} className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5 h-9"
          onClick={() => downloadCsv(`ogwogd-newsletter-${format(new Date(), 'yyyy-MM-dd')}.csv`, [{ label: 'Email', value: 'email' }, { label: 'Subscribed', value: 'created_date' }], shown)}>
          <Download className="w-3.5 h-3.5" /> CSV (Mailchimp ready)
        </Button>
      </div>

      <div className="bg-white border border-ink/5 rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 border-b border-ink/5">
            <tr>
              <th className="text-left px-4 py-3 font-barlow-condensed text-ash text-xs tracking-widest uppercase">Email</th>
              <th className="text-left px-4 py-3 font-barlow-condensed text-ash text-xs tracking-widest uppercase">Subscribed</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {shown.length === 0 ? (
              <tr><td colSpan={3} className="px-4 py-10 text-center font-barlow text-ash">No subscribers yet.</td></tr>
            ) : (
              shown.map((s) => (
                <tr key={s.id} className="border-b border-ink/5 last:border-0 hover:bg-ink/[0.02]">
                  <td className="px-4 py-3 font-barlow text-ink"><a href={`mailto:${s.email}`} className="hover:underline">{s.email}</a></td>
                  <td className="px-4 py-3 font-barlow text-ash">{s.created_date ? format(new Date(s.created_date), 'MMM d, yyyy') : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="icon" variant="ghost" onClick={() => remove(s)} className="h-8 w-8 text-ash hover:text-red-500" aria-label={`Remove ${s.email}`}><Trash2 className="w-4 h-4" /></Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
