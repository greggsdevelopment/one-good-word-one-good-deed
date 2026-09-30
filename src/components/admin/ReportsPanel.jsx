import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Ban, Flag, RotateCcw, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { timeAgo, useAdminData, useEntityOps } from '@/lib/adminData';

const REASON = {
  bullying_or_hate: 'Bullying, hate or threats',
  personal_info: 'Personal information',
  inappropriate: 'Inappropriate',
  spam: 'Spam',
  other: 'Other',
};

/** Visitor reports on the Pledge Wall. Reported pledges are already hidden. */
export default function ReportsPanel() {
  const qc = useQueryClient();
  const { data } = useAdminData();
  const reports = useEntityOps('reports');
  const open = data.reports.filter((r) => (r.status || 'new') === 'new');
  const blocked = useQuery({ queryKey: ['blocked-submitters'], queryFn: () => base44.entities.BlockedSubmitter.list('-created_date', 200).catch(() => []) });
  const pledgeFor = (r) => data.pledges.find((p) => p.id === r.target_id);
  const refreshPledges = () => qc.invalidateQueries({ queryKey: ['pledges'] });
  const allFor = (r) => open.filter((x) => x.target_id === r.target_id);
  // One card per pledge, however many reports it got.
  const grouped = [...new Map(open.map((r) => [r.target_id, r])).values()];

  const settle = async (r, status) => {
    for (const x of allFor(r)) await reports.update(x.id, { status, reviewed_at: new Date().toISOString() });
  };
  const keep = async (r) => {
    try {
      await base44.entities.Pledge.update(r.target_id, { approved: true, hidden_reason: '' });
      await settle(r, 'kept');
      refreshPledges();
      toast.success('Pledge is back on the wall');
    } catch (err) {
      toast.error('Could not restore it', { description: err?.message });
    }
  };
  const remove = async (r, ban) => {
    try {
      const p = pledgeFor(r);
      if (ban && p?.submitter_tag) {
        await base44.entities.BlockedSubmitter.create({ tag: p.submitter_tag, reason: REASON[r.reason] || r.reason });
        qc.invalidateQueries({ queryKey: ['blocked-submitters'] });
      }
      if (p) await base44.entities.Pledge.delete(p.id);
      await settle(r, 'removed');
      refreshPledges();
      toast.success(ban ? 'Removed, and that device can no longer post' : 'Pledge removed');
    } catch (err) {
      toast.error('Could not remove it', { description: err?.message });
    }
  };

  if (!grouped.length && !(blocked.data || []).length) return null;

  return (
    <div className="space-y-3">
      {grouped.length > 0 && (
        <div className="rounded-sm border border-red-200 bg-red-50 p-4">
          <p className="font-barlow-condensed uppercase tracking-wider text-xs text-red-700 flex items-center gap-2 mb-2"><Flag className="w-4 h-4" /> Reported by visitors ({grouped.length}), hidden until you decide</p>
          <div className="space-y-2">
            {grouped.map((r) => {
              const p = pledgeFor(r);
              const n = allFor(r).length;
              return (
                <div key={r.id} className="bg-white rounded-sm border border-red-100 p-3">
                  <p className="font-barlow text-ink italic">&ldquo;{p?.pledge_statement || r.target_preview}&rdquo;</p>
                  <p className="font-barlow text-xs text-ash mt-1">
                    {p ? `${p.first_name || ''} ${p.last_initial || ''}${p.city ? `, ${p.city}` : ''} · ` : 'Pledge already deleted · '}
                    {REASON[r.reason] || r.reason}{n > 1 ? ` (${n} reports)` : ''}{r.details ? ` · "${r.details}"` : ''} · {timeAgo(r.created_date)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {p && <Button size="sm" variant="outline" onClick={() => keep(r)}><RotateCcw className="w-3.5 h-3.5 mr-1" /> It is fine, put it back</Button>}
                    <Button size="sm" variant="outline" className="text-red-700" onClick={() => remove(r, false)}><Trash2 className="w-3.5 h-3.5 mr-1" /> Remove</Button>
                    {p?.submitter_tag && <Button size="sm" className="bg-red-700 hover:bg-red-800 text-white" onClick={() => remove(r, true)}><Ban className="w-3.5 h-3.5 mr-1" /> Remove and block poster</Button>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {(blocked.data || []).length > 0 && (
        <details className="rounded-sm border border-ink/10 bg-white p-3 font-barlow text-sm">
          <summary className="cursor-pointer font-barlow-condensed uppercase tracking-wider text-xs text-ash">Blocked posters ({blocked.data.length})</summary>
          <ul className="mt-2 space-y-1">
            {blocked.data.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-2">
                <span className="text-ink">{b.tag} <span className="text-ash">· {b.reason}</span></span>
                <Button size="sm" variant="ghost" onClick={() => base44.entities.BlockedSubmitter.delete(b.id).then(() => qc.invalidateQueries({ queryKey: ['blocked-submitters'] }))}>Unblock</Button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
