import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function StoriesTab() {
  const queryClient = useQueryClient();

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: () => base44.entities.Story.list('-created_date', 100),
  });

  const approveStory = useMutation({
    mutationFn: ({ id, approved }) => base44.entities.Story.update(id, { approved }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stories'] }),
  });

  const deleteStory = useMutation({
    mutationFn: (id) => base44.entities.Story.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stories'] }),
  });

  if (isLoading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;
  if (stories.length === 0)
    return <p className="font-barlow text-ash text-center py-12">No stories yet.</p>;

  return (
    <div className="space-y-3">
      {stories.map((s) => (
        <div key={s.id} className="bg-white rounded-sm border border-ink/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <p className="font-barlow font-semibold text-ink">{s.name}</p>
                {s.location && <p className="font-barlow text-ash text-sm">{s.location}</p>}
                <Badge
                  variant={s.approved ? 'default' : 'secondary'}
                  className={`text-xs ${s.approved ? 'bg-green-100 text-green-700 border-green-200' : ''}`}
                >
                  {s.approved ? 'Approved' : 'Pending'}
                </Badge>
              </div>
              <p className="font-barlow text-ink/60 text-sm leading-relaxed">{s.story}</p>
              <p className="font-barlow text-ash text-xs mt-2">{new Date(s.created_date).toLocaleString()}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost" size="icon"
                onClick={() => approveStory.mutate({ id: s.id, approved: !s.approved })}
                title={s.approved ? 'Unapprove' : 'Approve'}
                className={s.approved ? 'text-ash hover:text-red-500' : 'text-ash hover:text-green-600'}
              >
                {s.approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost" size="icon"
                onClick={() => deleteStory.mutate(s.id)}
                className="text-ash hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}