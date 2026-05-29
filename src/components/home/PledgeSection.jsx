import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useInView } from '@/hooks/useInView';
import { CheckCircle } from 'lucide-react';

export default function PledgeSection({ pledgeCount, recentPledges, onPledgeCreated }) {
  const [ref, inView] = useInView(0.1);
  const [formData, setFormData] = useState({ name: '', location: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setSubmitting(true);

    const payload = { name: formData.name.trim() };
    if (formData.location.trim()) payload.location = formData.location.trim();
    if (formData.message.trim()) payload.message = formData.message.trim();

    await base44.entities.Pledge.create(payload);
    setSubmitting(false);
    setSubmitted(true);
    onPledgeCreated();
  };

  return (
    <section id="pledge" className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden" ref={ref}>
      <div className="grain-overlay" />

      {/* Subtle gold glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(230,180,80,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-4 text-center"
        >
          Take the Pledge
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-anton text-cream text-4xl sm:text-5xl md:text-6xl text-center mb-12 leading-[0.95]"
        >
          SPEAK IT. LIVE IT.
        </motion.h2>

        {/* Pledge text */}
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="border-l-4 border-gold pl-6 md:pl-8 mb-12 max-w-3xl mx-auto"
        >
          <p className="font-anton text-cream/90 text-xl sm:text-2xl md:text-3xl leading-snug">
            "I pledge to speak one good word and do one good deed. I will stand against bullying and racism, and I will lead with love."
          </p>
        </motion.blockquote>

        {/* Form or Confirmation */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="max-w-lg mx-auto space-y-4"
            >
              <input
                type="text"
                placeholder="Your first name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-white/[0.06] border border-white/10 rounded-sm px-5 py-4 text-cream placeholder:text-cream/30 font-barlow focus:outline-none focus:border-gold/50 transition-colors"
              />
              <input
                type="text"
                placeholder="Last initial or city (optional)"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-white/[0.06] border border-white/10 rounded-sm px-5 py-4 text-cream placeholder:text-cream/30 font-barlow focus:outline-none focus:border-gold/50 transition-colors"
              />
              <textarea
                placeholder="A short message (optional)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full bg-white/[0.06] border border-white/10 rounded-sm px-5 py-4 text-cream placeholder:text-cream/30 font-barlow focus:outline-none focus:border-gold/50 transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={submitting || !formData.name.trim()}
                className="w-full py-4 bg-gold hover:bg-gold-dark disabled:opacity-50 text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/25"
              >
                {submitting ? 'Submitting...' : 'I Take the Pledge'}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-gold mx-auto mb-4" />
              <h3 className="font-anton text-cream text-3xl md:text-4xl mb-2">YOU'RE IN.</h3>
              <p className="font-barlow text-cream/70 text-lg">Welcome to the movement.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live counter */}
        <div className="text-center mt-10">
          <p className="font-barlow-condensed text-ash text-sm tracking-wider uppercase">
            <span className="text-gold font-bold text-2xl">{pledgeCount.toLocaleString()}</span>
            <span className="ml-2">pledges and counting</span>
          </p>
        </div>

        {/* Pledge wall */}
        {recentPledges.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12"
          >
            <p className="font-barlow-condensed text-cream/40 text-xs tracking-[0.2em] uppercase text-center mb-6">
              Recent Pledges
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {recentPledges.map((pledge) => (
                <div
                  key={pledge.id}
                  className="bg-white/[0.04] border border-white/[0.06] rounded-sm px-4 py-2"
                >
                  <span className="font-barlow text-cream/80 text-sm font-medium">{pledge.name}</span>
                  {pledge.location && (
                    <span className="font-barlow text-cream/40 text-sm ml-1.5">from {pledge.location}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}