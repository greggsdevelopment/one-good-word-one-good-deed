import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PledgesTab() {
  const queryClient = useQueryClient();

  const { data: pledges = [], isLoading } = useQuery({
    queryKey: ['pledges'],
    queryFn: () => base44.entities.Pledge.list('-created_date', 200),
  });

  const deletePledge = useMutation({
    mutationFn: (id) => base44.entities.Pledge.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pledges'] }),
  });

  const approvePledge = useMutation({
    mutationFn: (id) => base44.entities.Pledge.update(id, { approved: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pledges'] }),
  });

  const rejectPledge = useMutation({
    mutationFn: (id) => base44.entities.Pledge.update(id, { approved: false }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pledges'] }),
  });

  if (isLoading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;
  if (pledges.length === 0)
    return <p className="font-barlow text-ash text-center py-12">No pledges yet.</p>;

  const pending = pledges.filter(p => !p.approved);
  const approved = pledges.filter(p => p.approved);

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div>
          <h3 className="font-barlow-condensed text-ink text-xs tracking-widest uppercase mb-2 text-amber-600">Pending Review ({pending.length})</h3>
          <div className="space-y-2">
            {pending.map((p) => (
              <div key={p.id} className="bg-amber-50 rounded-sm border border-amber-200 p-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-barlow font-semibold text-ink">
                      {p.first_name} {p.last_initial ? `${p.last_initial}.` : ''}
                    </span>
                    {p.city && <span className="font-barlow text-ash text-sm">— {p.city}</span>}
                  </div>
                  {p.pledge_statement && (
                    <p className="font-barlow text-ink/50 text-sm italic">"{p.pledge_statement}"</p>
                  )}
                  <p className="font-barlow text-ash text-xs mt-1">{new Date(p.created_date).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm" variant="ghost"
                    onClick={() => approvePledge.mutate(p.id)}
                    className="text-green-600 hover:bg-green-100"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm" variant="ghost"
                    onClick={() => deletePledge.mutate(p.id)}
                    className="text-red-500 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {approved.length > 0 && (
        <div>
          <h3 className="font-barlow-condensed text-ink text-xs tracking-widest uppercase mb-2 text-green-600">Approved ({approved.length})</h3>
          <div className="space-y-2">
            {approved.map((p) => (
              <div key={p.id} className="bg-white rounded-sm border border-ink/5 p-4 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span className="font-barlow font-semibold text-ink">
                      {p.first_name} {p.last_initial ? `${p.last_initial}.` : ''}
                    </span>
                    {p.city && <span className="font-barlow text-ash text-sm">— {p.city}</span>}
                  </div>
                  {p.pledge_statement && (
                    <p className="font-barlow text-ink/50 text-sm italic">"{p.pledge_statement}"</p>
                  )}
                  <p className="font-barlow text-ash text-xs mt-1">{new Date(p.created_date).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm" variant="ghost"
                    onClick={() => rejectPledge.mutate(p.id)}
                    className="text-ash hover:text-amber-600 hover:bg-amber-100"
                  >
                    <Circle className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm" variant="ghost"
                    onClick={() => deletePledge.mutate(p.id)}
                    className="text-ash hover:text-red-500 hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}