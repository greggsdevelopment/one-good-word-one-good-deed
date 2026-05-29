import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trash2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MessagesTab() {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['contactMessages'],
    queryFn: () => base44.entities.ContactMessage.list('-created_date', 100),
  });

  const deleteMsg = useMutation({
    mutationFn: (id) => base44.entities.ContactMessage.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contactMessages'] }),
  });

  if (isLoading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;
  if (messages.length === 0)
    return <p className="font-barlow text-ash text-center py-12">No messages yet.</p>;

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div key={msg.id} className="bg-white rounded-sm border border-ink/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <p className="font-barlow font-semibold text-ink">{msg.name}</p>
                <a href={`mailto:${msg.email}`} className="font-barlow text-gold-dark text-sm hover:underline flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {msg.email}
                </a>
              </div>
              <p className="font-barlow-condensed text-ink/60 text-sm uppercase tracking-wider mb-2">{msg.subject}</p>
              <p className="font-barlow text-ink/70 text-sm leading-relaxed">{msg.message}</p>
              <p className="font-barlow text-ash text-xs mt-2">{new Date(msg.created_date).toLocaleString()}</p>
            </div>
            <Button
              variant="ghost" size="icon"
              onClick={() => deleteMsg.mutate(msg.id)}
              className="text-ash hover:text-red-500 shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}