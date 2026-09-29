import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { downloadCsv } from './inventoryOps';

const TYPE_STYLE = {
  received: 'bg-green-100 text-green-800',
  distributed: 'bg-blue-100 text-blue-800',
  adjustment: 'bg-ink/10 text-ink/70',
};

export default function HistoryPanel({ transactions }) {
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions
      .filter((t) => type === 'all' || t.type === type)
      .filter((t) => !q || [t.item_name, t.recipient, t.donor_name, t.reason, t.recorded_by].some((v) => (v || '').toLowerCase().includes(q)));
  }, [transactions, type, search]);

  const totals = useMemo(() => {
    const t = { received: 0, distributed: 0 };
    rows.forEach((r) => {
      if (r.type === 'received') t.received += Number(r.change) || 0;
      if (r.type === 'distributed') t.distributed += Math.abs(Number(r.change) || 0);
    });
    return t;
  }, [rows]);

  const exportCsv = () =>
    downloadCsv(`ogwogd-inventory-history-${format(new Date(), 'yyyy-MM-dd')}.csv`, [
      { label: 'Date', value: (r) => r.created_date || '' },
      { label: 'Item', value: 'item_name' },
      { label: 'Type', value: 'type' },
      { label: 'Change', value: 'change' },
      { label: 'On hand after', value: 'quantity_after' },
      { label: 'Donor', value: 'donor_name' },
      { label: 'Given to', value: 'recipient' },
      { label: 'Note', value: 'reason' },
      { label: 'Recorded by', value: 'recorded_by' },
    ], rows);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search item, donor, recipient" className="flex-1 min-w-[200px] bg-white" />
        <select value={type} onChange={(e) => setType(e.target.value)} className="h-9 border border-input rounded-md px-3 text-sm bg-white">
          <option value="all">All types</option>
          <option value="received">Received</option>
          <option value="distributed">Given out</option>
          <option value="adjustment">Corrections</option>
        </select>
        <Button size="sm" variant="outline" onClick={exportCsv} disabled={!rows.length} className="font-barlow-condensed uppercase tracking-wider text-xs gap-1.5">
          <Download className="w-3.5 h-3.5" /> CSV
        </Button>
      </div>

      <p className="font-barlow text-sm text-ash">
        In this view: <span className="text-green-700 font-semibold">{totals.received.toLocaleString()} received</span> ·{' '}
        <span className="text-blue-700 font-semibold">{totals.distributed.toLocaleString()} given out</span>
      </p>

      {rows.length === 0 ? (
        <p className="font-barlow text-ash text-center py-12">No history yet.</p>
      ) : (
        <div className="bg-white border border-ink/10 rounded-sm overflow-x-auto">
          <table className="w-full text-sm font-barlow">
            <thead>
              <tr className="border-b border-ink/10 text-left font-barlow-condensed text-[11px] uppercase tracking-wider text-ash">
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Change</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">After</th>
                <th className="px-4 py-3 hidden md:table-cell">Details</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-ink/5 last:border-0 align-top">
                  <td className="px-4 py-3 whitespace-nowrap text-ink/70">{t.created_date ? format(new Date(t.created_date), 'MMM d, h:mm a') : ''}</td>
                  <td className="px-4 py-3 text-ink">{t.item_name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-barlow-condensed uppercase tracking-wider px-2 py-0.5 rounded-full ${TYPE_STYLE[t.type] || ''}`}>
                      {t.type === 'distributed' ? 'given out' : t.type}
                    </span>
                  </td>
                  <td className={`px-4 py-3 text-right font-semibold ${t.change > 0 ? 'text-green-700' : 'text-red-600'}`}>
                    {t.change > 0 ? `+${t.change}` : t.change}
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell text-ink/60">{t.quantity_after ?? ''}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-ink/60">
                    {[t.donor_name && `From ${t.donor_name}`, t.recipient && `To ${t.recipient}`, t.reason, t.recorded_by && `by ${t.recorded_by}`]
                      .filter(Boolean)
                      .join(' · ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
