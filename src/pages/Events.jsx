import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import EventsHero from '@/components/events/EventsHero';
import EventCalendar from '@/components/events/EventCalendar';
import EventDetailModal from '@/components/events/EventDetailModal';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('event_date', 100),
  });

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />
      <EventsHero />

      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
          ) : (
            <EventCalendar events={events} onEventClick={setSelectedEvent} />
          )}
        </div>
      </section>

      <FooterSection logoUrl={LOGO_URL} />

      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}