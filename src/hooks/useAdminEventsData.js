import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useAdminEventsData() {
  const queryClient = useQueryClient();
  const { data: events = [], isLoading: loadingEvents } = useQuery({
    queryKey: ['admin-events'],
    queryFn: () => base44.entities.Event.list('event_date', 200),
  });
  const { data: rsvps = [], isLoading: loadingRsvps } = useQuery({
    queryKey: ['admin-rsvps'],
    queryFn: () => base44.entities.EventRSVP.list('-created_date', 1000),
  });
  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    queryClient.invalidateQueries({ queryKey: ['admin-rsvps'] });
  };
  return { events, rsvps, loading: loadingEvents || loadingRsvps, refresh };
}