import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trash2 } from 'lucide-react';
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

  if (isLoading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;
  if (pledges.length === 0)
    return <p className="font-barlow text-ash text-center py-12">No pledges yet.</p>;

  return (
    <div className="space-y-2">
      {pledges.map((p) => (
        <div key={p.id} className="bg-white rounded-sm border border-ink/5 p-4 flex items-start justify-between gap-4">
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
          <Button
            variant="ghost" size="icon"
            onClick={() => deletePledge.mutate(p.id)}
            className="text-ash hover:text-red-500 shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}