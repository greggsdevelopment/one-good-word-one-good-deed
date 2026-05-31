import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { base44 } from '@/api/base44Client';
import { CheckCircle, CalendarCheck, Mail, Phone } from 'lucide-react';

const PROGRAM_TYPES = [
  'School Assembly ($500)',
  'Half-Day Workshop ($1,200)',
  'Full Partnership Package ($3,500/semester)',
  'Other / Not Sure Yet',
];

export default function BookingForm() {
  const [ref, inView] = useInView(0.1);
  const [form, setForm] = useState({
    program_type: '',
    school_name: '',
    contact_name: '',
    principal_name: '',
    email: '',
    phone: '',
    preferred_date: '',
    num_students: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const record = await base44.entities.BookingRequest.create({
      school_name: form.school_name,
      contact_name: form.contact_name,
      email: form.email,
      phone: form.phone,
      preferred_date: form.preferred_date,
      num_students: form.num_students ? Number(form.num_students) : undefined,
      message: `Program Type: ${form.program_type}\nPrincipal: ${form.principal_name}\n\n${form.message}`,
    });
    setSubmitting(false);
    setSubmitted(record);
  };

  const inputClass = "w-full bg-ink border border-white/[0.1] rounded-sm px-5 py-4 text-cream placeholder:text-cream/25 font-barlow focus:outline-none focus:border-gold/40 transition-colors";
  const selectClass = `${inputClass} cursor-pointer`;

  return (
    <section id="booking-form" className="relative bg-cream py-24 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-anton text-ink text-4xl sm:text-5xl text-center mb-4"
        >
          BOOK A VISIT
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow text-ink/50 text-center text-lg max-w-xl mx-auto mb-12"
        >
          Fill out the form below and Jason will get back to you within 48 hours to discuss scheduling.
        </motion.p>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Program Type */}
              <div>
                <label className="block font-barlow-condensed text-ink/50 text-xs tracking-widest uppercase mb-2">Program Type *</label>
                <select required value={form.program_type} onChange={set('program_type')} className={selectClass}>
                  <option value="" disabled>Select a program...</option>
                  {PROGRAM_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-ink text-cream">{t}</option>
                  ))}
                </select>
              </div>

              {/* School + Principal */}
              <div className="grid sm:grid-cols-2 gap-4">
                <input required placeholder="School Name *" value={form.school_name} onChange={set('school_name')} className={inputClass} />
                <input placeholder="Principal's Name" value={form.principal_name} onChange={set('principal_name')} className={inputClass} />
              </div>

              {/* Contact + Email */}
              <div className="grid sm:grid-cols-2 gap-4">
                <input required placeholder="Your Name (Contact) *" value={form.contact_name} onChange={set('contact_name')} className={inputClass} />
                <input required type="email" placeholder="Email Address *" value={form.email} onChange={set('email')} className={inputClass} />
              </div>

              {/* Phone + Date */}
              <div className="grid sm:grid-cols-2 gap-4">
                <input type="tel" placeholder="Phone Number" value={form.phone} onChange={set('phone')} className={inputClass} />
                <div>
                  <label className="block font-barlow-condensed text-ink/40 text-xs tracking-widest uppercase mb-1.5">Preferred Date</label>
                  <input type="date" value={form.preferred_date} onChange={set('preferred_date')} className={inputClass} />
                </div>
              </div>

              {/* Attendance */}
              <input
                type="number"
                placeholder="Expected Attendance (# of students)"
                value={form.num_students}
                onChange={set('num_students')}
                className={inputClass}
                min={1}
              />

              {/* Notes */}
              <textarea
                rows={5}
                placeholder="Budget considerations, special requests, or notes about your school..."
                value={form.message}
                onChange={set('message')}
                className={`${inputClass} resize-none`}
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-ink hover:bg-ink/90 disabled:opacity-50 text-cream font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all hover:-translate-y-0.5"
              >
                {submitting ? 'Sending Request...' : 'Submit Booking Request'}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="py-10"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-5">
                  <CheckCircle className="w-8 h-8 text-gold-dark" />
                </div>
                <h3 className="font-anton text-ink text-4xl mb-2">REQUEST RECEIVED.</h3>
                <p className="font-barlow text-ink/60 text-base">Your booking request has been submitted successfully.</p>
                {submitted?.id && (
                  <p className="font-barlow-condensed text-ink/40 text-xs tracking-widest uppercase mt-2">
                    Reference: <span className="text-ink/60">{submitted.id.slice(0, 8).toUpperCase()}</span>
                  </p>
                )}
              </div>

              {/* Next steps */}
              <div className="bg-ink rounded-sm border border-ink/10 p-6 space-y-4 mb-6">
                <p className="font-barlow-condensed text-cream/50 text-xs tracking-widest uppercase mb-4">What Happens Next</p>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-barlow-condensed text-gold text-xs font-bold">1</span>
                  </div>
                  <p className="font-barlow text-cream/60 text-sm leading-relaxed">Jason reviews your request and checks availability for your preferred date.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-barlow-condensed text-gold text-xs font-bold">2</span>
                  </div>
                  <p className="font-barlow text-cream/60 text-sm leading-relaxed">You'll receive a follow-up email or call within <strong className="text-cream/80">48 hours</strong> to confirm details.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-barlow-condensed text-gold text-xs font-bold">3</span>
                  </div>
                  <p className="font-barlow text-cream/60 text-sm leading-relaxed">Once confirmed, you'll get a full program overview and preparation guide for your school.</p>
                </div>
              </div>

              {/* Contact info */}
              <div className="flex flex-col sm:flex-row gap-3 text-center">
                <a href="mailto:1goodword1gooddeedllc@gmail.com" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-ink/15 hover:border-gold-dark/40 rounded-sm text-ink/50 hover:text-gold-dark font-barlow-condensed text-xs tracking-wider uppercase transition-all">
                  <Mail className="w-3.5 h-3.5" /> Email Us
                </a>
                <a href="tel:2488089373" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-ink/15 hover:border-gold-dark/40 rounded-sm text-ink/50 hover:text-gold-dark font-barlow-condensed text-xs tracking-wider uppercase transition-all">
                  <Phone className="w-3.5 h-3.5" /> (248) 808-9373
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}