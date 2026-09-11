import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Phone } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { base44 } from '@/api/base44Client';

const LEVELS = [
  'Supply Drop — $250',
  'Family Night — $500',
  'Assembly Underwriter — $1,500',
  'Starter Package for one school — $3,200',
  'Full Year for one school — $6,500',
  'Monthly giving, any amount',
  'In-kind goods or services',
  'Not sure yet, let’s talk',
];

const FOCUS = [
  'Put the program in a school that cannot afford it',
  'School supplies for kids who need them',
  'Community events and giveaways',
  'Keep the day to day operation running',
  'Wherever it is needed most',
];

export default function SponsorshipForm() {
  const [ref, inView] = useInView(0.05);
  const [form, setForm] = useState({
    business_name: '',
    contact_person: '',
    email: '',
    phone: '',
    website: '',
    city: '',
    sponsorship_level: '',
    funding_focus: '',
    school_of_interest: '',
    in_kind: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await base44.entities.SponsorshipApplication.create({ ...form, status: 'new' });
      setSubmitted(true);
    } catch (err) {
      console.error('Sponsorship application failed:', err);
      setError(
        'Something went wrong sending that. Email greggsdevelopment@gmail.com or call (734) 383-3865 and we will take it down by hand.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-ink border border-white/[0.1] rounded-sm px-5 py-4 text-cream placeholder:text-cream/25 font-barlow focus:outline-none focus:border-gold/40 transition-colors';
  const selectClass = `${inputClass} cursor-pointer`;

  if (submitted) {
    return (
      <section id="apply" className="relative bg-cream py-24 px-6 scroll-mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-gold-dark mx-auto mb-6" />
          <h2 className="font-anton text-ink text-4xl sm:text-5xl mb-4">APPLICATION RECEIVED.</h2>
          <p className="font-barlow text-ink/60 text-lg leading-relaxed mb-8">
            Cody reviews every one of these personally and gets back to you within two business days with the
            sponsor packet and a short call time. If it is urgent, call.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center font-barlow-condensed text-ink/70 text-base tracking-wider uppercase">
            <a href="tel:7343833865" className="flex items-center justify-center gap-2 hover:text-gold-dark transition-colors">
              <Phone className="w-4 h-4" /> (734) 383-3865
            </a>
            <a
              href="mailto:greggsdevelopment@gmail.com"
              className="flex items-center justify-center gap-2 hover:text-gold-dark transition-colors"
            >
              <Mail className="w-4 h-4" /> greggsdevelopment@gmail.com
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="apply" className="relative bg-cream py-24 px-6 scroll-mt-16" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-anton text-ink text-4xl sm:text-5xl text-center mb-4"
        >
          SPONSORSHIP APPLICATION
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow text-ink/55 text-center text-lg max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Five minutes. No commitment on this form. You tell us what you are thinking, we send back exactly
          what your money would pay for and where your name would show up.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="bg-ink rounded-sm p-7 sm:p-10 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <input
              required
              className={inputClass}
              placeholder="Business or Sponsor Name *"
              value={form.business_name}
              onChange={set('business_name')}
            />
            <input
              required
              className={inputClass}
              placeholder="Your Name *"
              value={form.contact_person}
              onChange={set('contact_person')}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <input
              required
              type="email"
              className={inputClass}
              placeholder="Email *"
              value={form.email}
              onChange={set('email')}
            />
            <input
              type="tel"
              className={inputClass}
              placeholder="Phone"
              value={form.phone}
              onChange={set('phone')}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <input
              className={inputClass}
              placeholder="Website or Social Page"
              value={form.website}
              onChange={set('website')}
            />
            <input
              className={inputClass}
              placeholder="City"
              value={form.city}
              onChange={set('city')}
            />
          </div>

          <select className={selectClass} value={form.sponsorship_level} onChange={set('sponsorship_level')}>
            <option value="">What level are you considering?</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select className={selectClass} value={form.funding_focus} onChange={set('funding_focus')}>
            <option value="">What do you most want it to pay for?</option>
            {FOCUS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          <input
            className={inputClass}
            placeholder="A school or district you want to sponsor (optional)"
            value={form.school_of_interest}
            onChange={set('school_of_interest')}
          />

          <input
            className={inputClass}
            placeholder="Goods or services you could donate instead of cash (optional)"
            value={form.in_kind}
            onChange={set('in_kind')}
          />

          <textarea
            rows={4}
            className={inputClass}
            placeholder="Anything else we should know"
            value={form.message}
            onChange={set('message')}
          />

          {error && (
            <p className="font-barlow text-red-400 text-sm leading-relaxed">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-10 py-4 bg-gold hover:bg-gold-dark disabled:opacity-50 disabled:cursor-not-allowed text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300"
          >
            {submitting ? 'Sending...' : 'Send Application'}
          </button>

          <p className="font-barlow text-cream/35 text-xs leading-relaxed text-center">
            One Good Word...One Good Deed is a Michigan LLC, not a registered 501(c)(3). Sponsorship is a
            business marketing expense, not a charitable tax deduction. Check with your accountant about how
            to treat it.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
