import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Check, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_STYLES = {
  confirmed: 'bg-teal-100 text-teal-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
};

export default function OrdersTab() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => base44.entities.BookingRequest.list('-created_date', 200),
  });

  const updateBooking = useMutation({
    mutationFn: ({ id, status }) => base44.entities.BookingRequest.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  const deleteBooking = useMutation({
    mutationFn: (id) => base44.entities.BookingRequest.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  if (isLoading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;
  if (bookings.length === 0) return <p className="font-barlow text-ash text-center py-12">No booking requests yet.</p>;

  return (
    <div className="bg-white rounded-sm border border-ink/5 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink/10 bg-ink/5">
            {['Name / School', 'Email', 'Event / Notes', 'Preferred Date', 'Attendees', 'Status', 'Actions'].map((h) => (
              <th key={h} className="text-left font-barlow-condensed text-ash text-xs uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => {
            const status = b.status || 'pending';
            return (
              <tr key={b.id} className="border-b border-ink/5 hover:bg-ink/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-barlow font-semibold text-ink text-sm">{b.school_name}</p>
                  <p className="font-barlow text-ash text-xs">{b.contact_name}</p>
                </td>
                <td className="px-4 py-3">
                  <a href={`mailto:${b.email}`} className="font-barlow text-gold-dark hover:underline text-xs">
                    {b.email}
                  </a>
                  {b.phone && <p className="font-barlow text-ash text-xs">{b.phone}</p>}
                </td>
                <td className="px-4 py-3 max-w-[200px]">
                  <p className="font-barlow text-ink/60 text-xs leading-relaxed line-clamp-2">{b.message || '—'}</p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="font-barlow text-ink/70 text-xs">
                    {b.preferred_date ? format(new Date(b.preferred_date), 'MMM d, yyyy') : '—'}
                  </p>
                  <p className="font-barlow text-ash text-[10px]">
                    Submitted {format(new Date(b.created_date), 'MMM d')}
                  </p>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="font-barlow text-ink/70 text-sm">{b.num_students ?? '—'}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block text-[10px] font-barlow-condensed uppercase tracking-wider px-2 py-1 rounded-full ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
                    {status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {status !== 'confirmed' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Confirm"
                        onClick={() => updateBooking.mutate({ id: b.id, status: 'confirmed' })}
                        className="w-7 h-7 text-teal-600 hover:bg-teal-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    {status !== 'cancelled' && (
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Cancel"
                        onClick={() => updateBooking.mutate({ id: b.id, status: 'cancelled' })}
                        className="w-7 h-7 text-red-500 hover:bg-red-50"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      title="Delete"
                      onClick={() => deleteBooking.mutate(b.id)}
                      className="w-7 h-7 text-ash hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}