import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ExternalLink, Star } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const CATEGORY_COLORS = {
  'Community Outreach': 'bg-teal-500/20 text-teal-300',
  'Workshop': 'bg-gold/20 text-gold',
  'Gathering': 'bg-purple-500/20 text-purple-300',
  'School Visit': 'bg-blue-500/20 text-blue-300',
  'Speaking Engagement': 'bg-orange-500/20 text-orange-300',
  'Other': 'bg-white/10 text-cream/50',
};

export default function EventCard({ event, index }) {
  const date = parseISO(event.event_date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={`relative bg-white/3 border rounded-sm p-6 flex flex-col gap-4 transition-colors ${
        event.featured ? 'border-gold/40 bg-gold/5' : 'border-cream/10 hover:border-cream/20'
      }`}
    >
      {event.featured && (
        <div className="absolute top-4 right-4 flex items-center gap-1 text-gold text-xs font-barlow-condensed tracking-wider uppercase">
          <Star className="w-3 h-3 fill-gold" /> Featured
        </div>
      )}

      {/* Date block */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-14 h-14 bg-gold/10 border border-gold/20 rounded-sm flex flex-col items-center justify-center">
          <span className="font-barlow-condensed text-gold font-bold text-xl leading-none">
            {format(date, 'd')}
          </span>
          <span className="font-barlow-condensed text-gold/60 text-xs tracking-widest uppercase">
            {format(date, 'MMM')}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-xs font-barlow-condensed px-2 py-0.5 rounded-full tracking-wide ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS['Other']}`}>
            {event.category}
          </span>
          <h3 className="font-barlow-condensed text-cream font-bold text-xl leading-tight mt-2">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1.5">
        {(event.start_time || event.end_time) && (
          <div className="flex items-center gap-2 text-cream/40 text-sm font-barlow">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            {event.start_time}{event.end_time ? ` – ${event.end_time}` : ''}
          </div>
        )}
        {event.location && (
          <div className="flex items-center gap-2 text-cream/40 text-sm font-barlow">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {event.location}
          </div>
        )}
      </div>

      {event.description && (
        <p className="font-barlow text-cream/50 text-sm leading-relaxed">{event.description}</p>
      )}

      {event.registration_url && (
        <a
          href={event.registration_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto self-start flex items-center gap-1.5 px-4 py-2 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-colors"
        >
          RSVP / Register <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </motion.div>
  );
}