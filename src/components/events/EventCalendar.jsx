import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, format, isSameMonth, isSameDay, parseISO, isToday,
  addMonths, subMonths,
} from 'date-fns';

const CATEGORY_DOT_COLORS = {
  'Community Outreach': 'bg-teal-400',
  'Workshop': 'bg-gold',
  'Gathering': 'bg-purple-400',
  'School Visit': 'bg-blue-400',
  'Speaking Engagement': 'bg-orange-400',
  'Other': 'bg-cream/40',
};

const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function EventCalendar({ events, onEventClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getEventsForDay = (day) =>
    events.filter(e => isSameDay(parseISO(e.event_date), day));

  return (
    <div className="bg-white/[0.03] border border-cream/10 rounded-sm overflow-hidden">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-cream/10">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 text-cream/40 hover:text-gold transition-colors rounded-sm hover:bg-white/5"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <motion.h2
          key={format(currentMonth, 'yyyy-MM')}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-anton text-cream text-2xl tracking-wider"
        >
          {format(currentMonth, 'MMMM yyyy').toUpperCase()}
        </motion.h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 text-cream/40 hover:text-gold transition-colors rounded-sm hover:bg-white/5"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-cream/10">
        {DAY_HEADERS.map(d => (
          <div key={d} className="py-3 text-center font-barlow-condensed text-cream/30 text-xs tracking-widest uppercase">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);

          return (
            <div
              key={idx}
              className={`min-h-[80px] sm:min-h-[100px] p-1.5 sm:p-2 border-b border-r border-cream/[0.06] flex flex-col
                ${!inMonth ? 'opacity-25' : ''}
                ${idx % 7 === 6 ? 'border-r-0' : ''}
              `}
            >
              {/* Day number */}
              <span className={`text-xs sm:text-sm font-barlow-condensed self-start w-6 h-6 flex items-center justify-center rounded-full mb-1
                ${today ? 'bg-gold text-ink font-bold' : 'text-cream/50'}
              `}>
                {format(day, 'd')}
              </span>

              {/* Event dots / badges */}
              <div className="flex flex-col gap-0.5 flex-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="w-full text-left group"
                  >
                    <div className="flex items-center gap-1 px-1 py-0.5 rounded-sm hover:bg-white/10 transition-colors">
                      <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${CATEGORY_DOT_COLORS[event.category] || 'bg-cream/40'}`} />
                      <span className="font-barlow text-cream/70 text-[10px] sm:text-xs leading-tight truncate group-hover:text-gold transition-colors">
                        {event.title}
                      </span>
                    </div>
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <span className="font-barlow text-cream/30 text-[10px] px-1">+{dayEvents.length - 3} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}