import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { isAfter, parseISO, startOfDay } from 'date-fns';
import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import EventsHero from '@/components/events/EventsHero';
import EventCard from '@/components/events/EventCard';
import { Calendar } from 'lucide-react';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';

const CATEGORIES = ['All', 'Community Outreach', 'Workshop', 'Gathering', 'School Visit', 'Speaking Engagement', 'Other'];

export default function Events() {
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => base44.entities.Event.list('event_date', 100),
  });

  const today = startOfDay(new Date());

  const upcoming = events
    .filter(e => !isAfter(today, parseISO(e.event_date)))
    .filter(e => activeCategory === 'All' || e.category === activeCategory)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(a.event_date) - new Date(b.event_date);
    });

  const past = events
    .filter(e => isAfter(today, parseISO(e.event_date)))
    .filter(e => activeCategory === 'All' || e.category === activeCategory)
    .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />
      <EventsHero />

      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-colors ${
                  activeCategory === cat
                    ? 'bg-gold text-ink font-bold'
                    : 'bg-white/5 text-cream/50 hover:text-cream border border-cream/10 hover:border-cream/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Upcoming events */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
          ) : upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 border border-cream/10 rounded-sm"
            >
              <Calendar className="w-10 h-10 text-cream/20 mx-auto mb-4" />
              <p className="font-barlow-condensed text-cream/30 text-xl tracking-wide uppercase">No upcoming events</p>
              <p className="font-barlow text-cream/20 text-sm mt-2">Check back soon — we're always planning something new.</p>
            </motion.div>
          )}

          {/* Past events */}
          {past.length > 0 && (
            <div className="mt-20">
              <p className="font-barlow-condensed text-cream/30 text-xs tracking-[0.3em] uppercase mb-6">Past Events</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-50">
                {past.map((event, i) => (
                  <EventCard key={event.id} event={event} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}