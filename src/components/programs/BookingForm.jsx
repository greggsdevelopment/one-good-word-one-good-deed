import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { CheckCircle, School, User, Mail, Phone, Calendar, Users } from 'lucide-react';

export default function BookingForm() {
  const [form, setForm] = useState({
    school_name: '',
    contact_name: '',
    email: '',
    phone: '',
    preferred_date: '',
    num_students: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.BookingRequest.create({
      ...form,
      num_students: form.num_students ? Number(form.num_students) : undefined,
    });
    setSubmitting(false);
    setSubmitted(true);
  };

  const inputClass =
    'w-full bg-white/[0.05] border border-white/[0.1] focus:border-gold/50 rounded-sm px-5 py-4 text-cream placeholder:text-cream/25 font-barlow text-sm outline-none transition-colors';

  return (
    <section id="booking-form" className="relative bg-ink py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-16 h-1 bg-gold mb-10 mx-auto origin-center"
          />
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4">
            Request a Booking
          </p>
          <h2 className="font-anton text-cream text-5xl sm:text-6xl leading-[0.92] mb-6">
            LET'S BRING<br />
            <span className="text-gold">JASON TO</span><br />
            YOUR SCHOOL.
          </h2>
          <p className="font-barlow text-cream/50 text-base max-w-lg mx-auto">
            Fill out the form below and Jason will personally respond within 24–48 hours to discuss your program.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* Row 1 */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="relative">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="School Name *"
                    value={form.school_name}
                    onChange={set('school_name')}
                    required
                    className={`${inputClass} pl-11`}
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={form.contact_name}
                    onChange={set('contact_name')}
                    required
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={form.email}
                    onChange={set('email')}
                    required
                    className={`${inputClass} pl-11`}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={set('phone')}
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 pointer-events-none" />
                  <input
                    type="date"
                    placeholder="Preferred Date"
                    value={form.preferred_date}
                    onChange={set('preferred_date')}
                    className={`${inputClass} pl-11 [color-scheme:dark]`}
                  />
                </div>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/20 pointer-events-none" />
                  <input
                    type="number"
                    placeholder="Estimated # of Students"
                    value={form.num_students}
                    onChange={set('num_students')}
                    min="1"
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              {/* Message */}
              <textarea
                placeholder="Tell us about your school and what you're hoping to achieve..."
                value={form.message}
                onChange={set('message')}
                rows={5}
                className={`${inputClass} resize-none`}
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-5 bg-gold hover:bg-gold-dark disabled:opacity-50 text-ink font-barlow-condensed font-bold text-xl uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
              >
                {submitting ? 'Sending Request...' : 'Submit Booking Request'}
              </button>

              <p className="text-center font-barlow text-cream/25 text-xs">
                No commitment required. Jason will reach out within 24–48 hours.
              </p>
            </motion.form>
          ) : (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-8 bg-white/[0.03] border border-gold/20 rounded-sm"
            >
              <CheckCircle className="w-20 h-20 text-gold mx-auto mb-6" />
              <h3 className="font-anton text-cream text-4xl mb-3">REQUEST RECEIVED!</h3>
              <p className="font-barlow text-cream/60 text-lg max-w-md mx-auto leading-relaxed">
                Thank you for reaching out. Jason will personally review your request and 
                get back to you within 24–48 hours.
              </p>
              <p className="font-barlow-condensed text-gold text-sm tracking-wider uppercase mt-6">
                One Good Word. One Good Deed.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}