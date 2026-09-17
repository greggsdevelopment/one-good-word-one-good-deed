import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import { useInView } from '@/hooks/useInView';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';
const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

const inputClass =
  'w-full bg-white/[0.04] border border-gold/20 rounded-sm px-4 py-3 text-cream placeholder:text-cream/30 font-barlow text-sm focus:outline-none focus:border-gold/50 transition-colors';

function GoldDiamond() {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="h-px w-12 bg-gold/30" />
      <span className="block rotate-45 w-2 h-2 bg-gold" />
      <span className="h-px w-12 bg-gold/30" />
    </div>
  );
}

export default function NightForDraykeRSVP() {
  const [ref, inView] = useInView(0.1);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    adults_attending: '',
    children_attending: '',
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
      await base44.entities.EventRSVP.create({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        adults_attending: form.adults_attending ? Number(form.adults_attending) : 0,
        children_attending: form.children_attending ? Number(form.children_attending) : 0,
        message: form.message.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />

      <main className="relative z-10">
        {/* Event info */}
        <section ref={ref} className="relative pt-28 pb-16 md:pt-36 md:pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold/6 rounded-full blur-[120px]" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-5"
            >
              In Loving Memory of Drayke Andrew Hardman
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-cream text-5xl sm:text-6xl md:text-7xl leading-[0.95] mb-6"
              style={SERIF}
            >
              A Night For Drayke
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <GoldDiamond />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 text-cream/80"
            >
              <span className="flex items-center gap-2">
                <Calendar className="text-gold" size={17} strokeWidth={1.5} />
                <span style={SERIF} className="text-lg">Friday, October 30, 2026</span>
              </span>
              <span className="hidden sm:block w-px h-4 bg-gold/30" />
              <span className="flex items-center gap-2">
                <MapPin className="text-gold" size={17} strokeWidth={1.5} />
                <span style={SERIF} className="text-lg">Location and time to be announced</span>
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.36 }}
              className="text-cream/75 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
              style={SERIF}
            >
              A free community event in loving memory of Drayke Andrew Hardman, May 26, 2009 to
              February 10, 2022. Join us for Drayke's story told by Cody and Jason, trick or treat
              bags for the kids, games, prizes, and community giveaways. Costumes encouraged, come
              as your favorite character. Free to attend, all families welcome. Because one good
              word can change everything.
            </motion.p>
          </div>
        </section>

        {/* RSVP form / confirmation */}
        <section className="relative px-6 pb-24 md:pb-32">
          <div className="max-w-xl mx-auto">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center border border-gold/25 rounded-sm bg-gold/[0.04] p-10 sm:p-14"
              >
                <CheckCircle className="w-14 h-14 text-gold mx-auto mb-5" />
                <h2 className="text-cream text-3xl sm:text-4xl mb-4" style={SERIF}>
                  Thank you for your RSVP.
                </h2>
                <p className="text-cream/75 text-lg leading-relaxed" style={SERIF}>
                  We will send you the location and time as soon as they are confirmed.
                </p>
                <Link
                  to="/events"
                  className="inline-block mt-8 px-6 py-3 border border-gold/30 hover:bg-gold hover:text-ink text-cream/70 font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-all"
                >
                  Back to Events
                </Link>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="border border-gold/25 rounded-sm bg-white/[0.02] p-8 sm:p-10 space-y-4"
              >
                <div className="text-center mb-2">
                  <h2 className="text-cream text-3xl mb-3" style={SERIF}>RSVP to Attend</h2>
                  <GoldDiamond />
                </div>
                <input required placeholder="Full Name *" value={form.full_name} onChange={set('full_name')} className={inputClass} />
                <input required type="email" placeholder="Email Address *" value={form.email} onChange={set('email')} className={inputClass} />
                <input type="tel" placeholder="Phone Number" value={form.phone} onChange={set('phone')} className={inputClass} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" min={0} placeholder="Adults" value={form.adults_attending} onChange={set('adults_attending')} className={inputClass} />
                  <input type="number" min={0} placeholder="Children" value={form.children_attending} onChange={set('children_attending')} className={inputClass} />
                </div>
                <textarea placeholder="Message (optional)" value={form.message} onChange={set('message')} rows={3} className={inputClass} />
                {error && <p className="text-red-400 text-sm font-barlow">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gold hover:bg-gold-dark disabled:opacity-50 text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all"
                >
                  {submitting ? 'Submitting...' : 'Submit RSVP'}
                </button>
              </motion.form>
            )}
          </div>
        </section>
      </main>

      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}