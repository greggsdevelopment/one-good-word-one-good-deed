import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, ExternalLink, Star, CheckCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { base44 } from '@/api/base44Client';

const CATEGORY_COLORS = {
  'Community Outreach': 'bg-teal-500/20 text-teal-300',
  'Workshop': 'bg-gold/20 text-gold',
  'Gathering': 'bg-purple-500/20 text-purple-300',
  'School Visit': 'bg-blue-500/20 text-blue-300',
  'Speaking Engagement': 'bg-orange-500/20 text-orange-300',
  'Other': 'bg-white/10 text-cream/50',
};

const inputClass = "w-full bg-white/[0.05] border border-cream/10 rounded-sm px-4 py-3 text-cream placeholder:text-cream/25 font-barlow text-sm focus:outline-none focus:border-gold/40 transition-colors";

export default function EventDetailModal({ event, onClose }) {
  const [form, setForm] = useState({ contact_name: '', email: '', phone: '', num_students: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!event) return null;

  const date = parseISO(event.event_date);
  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.BookingRequest.create({
      school_name: `RSVP: ${event.title}`,
      contact_name: form.contact_name,
      email: form.email,
      phone: form.phone,
      preferred_date: event.event_date,
      num_students: form.num_students ? Number(form.num_students) : undefined,
      message: `RSVP for event: ${event.title} on ${format(date, 'MMMM d, yyyy')}`,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  const content = (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0f0f12] border border-cream/10 rounded-sm shadow-2xl"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-cream/40 hover:text-cream transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6 sm:p-8">
            {/* Event details */}
            <div className="mb-6">
              {event.featured && (
                <div className="flex items-center gap-1 text-gold text-xs font-barlow-condensed tracking-wider uppercase mb-3">
                  <Star className="w-3 h-3 fill-gold" /> Featured Event
                </div>
              )}
              <span className={`text-xs font-barlow-condensed px-2 py-0.5 rounded-full tracking-wide ${CATEGORY_COLORS[event.category] || CATEGORY_COLORS['Other']}`}>
                {event.category}
              </span>
              <h2 className="font-anton text-cream text-2xl sm:text-3xl mt-3 mb-4 leading-tight">{event.title}</h2>

              {/* Meta */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2 text-cream/50 text-sm font-barlow">
                  <Calendar className="w-4 h-4 text-gold shrink-0" />
                  {format(date, 'EEEE, MMMM d, yyyy')}
                </div>
                {(event.start_time || event.end_time) && (
                  <div className="flex items-center gap-2 text-cream/50 text-sm font-barlow">
                    <Clock className="w-4 h-4 text-gold shrink-0" />
                    {event.start_time}{event.end_time ? ` – ${event.end_time}` : ''}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 text-cream/50 text-sm font-barlow">
                    <MapPin className="w-4 h-4 text-gold shrink-0" />
                    {event.location}
                  </div>
                )}
              </div>

              {event.description && (
                <p className="font-barlow text-cream/60 text-sm leading-relaxed">{event.description}</p>
              )}

              {event.registration_url && (
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-4 text-gold hover:text-gold-dark font-barlow-condensed text-sm tracking-wider uppercase transition-colors"
                >
                  External Registration <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-cream/10 mb-6" />

            {/* RSVP Form */}
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h3 className="font-barlow-condensed text-cream text-lg tracking-widest uppercase mb-4">RSVP for This Event</h3>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      required
                      placeholder="Your Name *"
                      value={form.contact_name}
                      onChange={set('contact_name')}
                      className={inputClass}
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email Address *"
                      value={form.email}
                      onChange={set('email')}
                      className={inputClass}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={set('phone')}
                      className={inputClass}
                    />
                    <input
                      type="number"
                      min={1}
                      placeholder="Number Attending"
                      value={form.num_students}
                      onChange={set('num_students')}
                      className={inputClass}
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 bg-gold hover:bg-gold-dark disabled:opacity-50 text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all"
                    >
                      {submitting ? 'Submitting...' : 'Submit RSVP'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-14 h-14 text-gold mx-auto mb-4" />
                  <h3 className="font-anton text-cream text-2xl mb-2">YOU'RE REGISTERED!</h3>
                  <p className="font-barlow text-cream/50 text-sm">We'll be in touch with event details closer to the date.</p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2.5 border border-cream/20 hover:border-gold/40 text-cream/60 hover:text-gold font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-all"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}