import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trash2, Mail, Globe, Building2, User, CheckCheck, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SponsorTab() {
  const queryClient = useQueryClient();

  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ['partnerInquiries'],
    queryFn: () => base44.entities.PartnerInquiry.list('-created_date', 200),
  });

  const deleteInquiry = useMutation({
    mutationFn: (id) => base44.entities.PartnerInquiry.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partnerInquiries'] }),
  });

  const markRead = useMutation({
    mutationFn: (id) => base44.entities.PartnerInquiry.update(id, { read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['partnerInquiries'] }),
  });

  if (isLoading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;
  if (inquiries.length === 0)
    return <p className="font-barlow text-ash text-center py-12">No partnership inquiries yet.</p>;

  const unread = inquiries.filter(i => !i.read);
  const read = inquiries.filter(i => i.read);

  return (
    <div className="space-y-6">
      {unread.length > 0 && (
        <div>
          <p className="font-barlow-condensed text-ink/50 text-xs tracking-widest uppercase mb-3">
            New Inquiries ({unread.length})
          </p>
          <div className="space-y-3">
            {unread.map((inq) => (
              <InquiryCard key={inq.id} inq={inq} onMarkRead={() => markRead.mutate(inq.id)} onDelete={() => deleteInquiry.mutate(inq.id)} />
            ))}
          </div>
        </div>
      )}
      {read.length > 0 && (
        <div>
          <p className="font-barlow-condensed text-ink/50 text-xs tracking-widest uppercase mb-3">
            Reviewed ({read.length})
          </p>
          <div className="space-y-3">
            {read.map((inq) => (
              <InquiryCard key={inq.id} inq={inq} onMarkRead={null} onDelete={() => deleteInquiry.mutate(inq.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InquiryCard({ inq, onMarkRead, onDelete }) {
  return (
    <div className={`rounded-sm border p-5 transition-colors ${inq.read ? 'bg-white/60 border-ink/5' : 'bg-white border-gold/20 border-l-4 border-l-gold'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {!inq.read && <Circle className="w-2 h-2 fill-gold text-gold shrink-0" />}
            <Building2 className="w-4 h-4 text-ink/50 shrink-0" />
            <p className="font-barlow font-semibold text-ink">{inq.business_name}</p>
            <span className="flex items-center gap-1 font-barlow text-ash text-sm">
              <User className="w-3.5 h-3.5" /> {inq.contact_person}
            </span>
            {inq.created_date && (
              <span className="font-barlow text-ash text-xs ml-auto">{new Date(inq.created_date).toLocaleString()}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-ink/60 font-barlow mb-2">
            {inq.email && (
              <a href={`mailto:${inq.email}`} className="flex items-center gap-1 text-gold-dark hover:underline">
                <Mail className="w-3.5 h-3.5" /> {inq.email}
              </a>
            )}
            {inq.website && (
              <a href={inq.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gold-dark hover:underline">
                <Globe className="w-3.5 h-3.5" /> {inq.website}
              </a>
            )}
          </div>
          {inq.message && (
            <p className="font-barlow text-ink/70 text-sm leading-relaxed mt-2">{inq.message}</p>
          )}
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