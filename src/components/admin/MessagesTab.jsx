import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trash2, Mail, CheckCheck, Circle } from 'lucide-react';
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

  const markRead = useMutation({
    mutationFn: (id) => base44.entities.ContactMessage.update(id, { read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contactMessages'] }),
  });

  if (isLoading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;
  if (messages.length === 0)
    return <p className="font-barlow text-ash text-center py-12">No messages yet.</p>;

  const unread = messages.filter(m => !m.read);
  const read = messages.filter(m => m.read);

  return (
    <div className="space-y-6">
      {unread.length > 0 && (
        <div>
          <p className="font-barlow-condensed text-ink/50 text-xs tracking-widest uppercase mb-3">
            Unread ({unread.length})
          </p>
          <div className="space-y-3">
            {unread.map((msg) => <MessageCard key={msg.id} msg={msg} onMarkRead={() => markRead.mutate(msg.id)} onDelete={() => deleteMsg.mutate(msg.id)} />)}
          </div>
        </div>
      )}
      {read.length > 0 && (
        <div>
          <p className="font-barlow-condensed text-ink/50 text-xs tracking-widest uppercase mb-3">
            Read ({read.length})
          </p>
          <div className="space-y-3">
            {read.map((msg) => <MessageCard key={msg.id} msg={msg} onMarkRead={null} onDelete={() => deleteMsg.mutate(msg.id)} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function MessageCard({ msg, onMarkRead, onDelete }) {
  return (
    <div className={`rounded-sm border p-5 transition-colors ${msg.read ? 'bg-white/60 border-ink/5' : 'bg-white border-gold/20 border-l-4 border-l-gold'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            {!msg.read && <Circle className="w-2 h-2 fill-gold text-gold shrink-0" />}
            <p className="font-barlow font-semibold text-ink">{msg.name}</p>
            <a href={`mailto:${msg.email}`} className="font-barlow text-gold-dark text-sm hover:underline flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {msg.email}
            </a>
            <span className="font-barlow text-ash text-xs ml-auto">{new Date(msg.created_date).toLocaleString()}</span>
          </div>
          <p className="font-barlow-condensed text-ink/60 text-sm uppercase tracking-wider mb-2">{msg.subject}</p>
          <p className="font-barlow text-ink/70 text-sm leading-relaxed">{msg.message}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onMarkRead && (
            <Button variant="ghost" size="sm" onClick={onMarkRead}
              className="text-gold-dark hover:text-gold font-barlow-condensed text-xs gap-1.5">
              <CheckCheck className="w-3.5 h-3.5" /> Mark as Read
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onDelete}
            className="text-ash hover:text-red-500">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}