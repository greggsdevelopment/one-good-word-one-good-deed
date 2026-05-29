import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trash2, Phone, Mail, Calendar, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function BookingTab() {
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => base44.entities.BookingRequest.list('-created_date', 100),
  });

  const deleteBooking = useMutation({
    mutationFn: (id) => base44.entities.BookingRequest.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  if (isLoading) return <p className="font-barlow text-ash py-8 text-center">Loading...</p>;

  if (bookings.length === 0)
    return <p className="font-barlow text-ash text-center py-12">No booking requests yet.</p>;

  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div key={b.id} className="bg-white rounded-sm border border-ink/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-3">
                <h3 className="font-barlow font-bold text-ink text-lg">{b.school_name}</h3>
                {b.preferred_date && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(b.preferred_date), 'MMM d, yyyy')}
                  </Badge>
                )}
                {b.num_students && (
                  <Badge variant="secondary" className="text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    {b.num_students} students
                  </Badge>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mb-3">
                <p className="font-barlow text-ink/70 text-sm flex items-center gap-1.5">
                  <span className="text-ash">Contact:</span> {b.contact_name}
                </p>
                {b.email && (
                  <a href={`mailto:${b.email}`} className="font-barlow text-sm flex items-center gap-1.5 text-gold-dark hover:underline">
                    <Mail className="w-3.5 h-3.5" /> {b.email}
                  </a>
                )}
                {b.phone && (
                  <a href={`tel:${b.phone}`} className="font-barlow text-sm flex items-center gap-1.5 text-gold-dark hover:underline">
                    <Phone className="w-3.5 h-3.5" /> {b.phone}
                  </a>
                )}
              </div>
              {b.message && (
                <div className="bg-cream/60 rounded-sm p-3 mt-2">
                  <p className="font-barlow text-ink/60 text-sm flex gap-2">
                    <MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-ash" />
                    {b.message}
                  </p>
                </div>
              )}
              <p className="font-barlow text-ash text-xs mt-3">
                Received {new Date(b.created_date).toLocaleString()}
              </p>
            </div>
            <Button
              variant="ghost" size="icon"
              onClick={() => deleteBooking.mutate(b.id)}
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