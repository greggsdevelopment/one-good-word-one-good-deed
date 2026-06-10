import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Handshake } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function SponsorInquiryForm() {
  const [ref, inView] = useInView(0.1);
  const [form, setForm] = useState({ business_name: '', contact_person: '', email: '', website: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.PartnerInquiry.create(form);
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section id="partner" className="relative bg-ink py-24 md:py-32 px-4 sm:px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-1 bg-gold mb-10 mx-auto origin-center"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Handshake className="w-10 h-10 text-gold mx-auto mb-4" strokeWidth={1.5} />
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-4">
            Become a Partner
          </p>
          <h2 className="font-anton text-cream text-4xl sm:text-5xl md:text-6xl leading-[0.95] mb-4">
            PARTNER<br /><span className="text-gold">WITH US.</span>
          </h2>
          <p className="font-barlow text-cream/50 text-base max-w-xl mx-auto leading-relaxed">
            Is your business aligned with our mission of spreading love and stopping hate? We'd love to explore a partnership. Fill out the form below and we'll be in touch.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center border border-gold/30 rounded-sm p-12 bg-white/5"
          >
            <p className="font-anton text-gold text-3xl mb-3">THANK YOU!</p>
            <p className="font-barlow text-cream/60 text-base">We received your inquiry and will reach out soon.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-barlow-condensed text-cream/50 text-xs tracking-wider uppercase mb-2">Business Name *</label>
                <input
                  name="business_name"
                  required
                  value={form.business_name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 focus:border-gold/50 text-cream placeholder-cream/20 rounded-sm px-4 py-3 font-barlow text-sm outline-none transition-colors"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block font-barlow-condensed text-cream/50 text-xs tracking-wider uppercase mb-2">Contact Person *</label>
                <input
                  name="contact_person"
                  required
                  value={form.contact_person}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 focus:border-gold/50 text-cream placeholder-cream/20 rounded-sm px-4 py-3 font-barlow text-sm outline-none transition-colors"
                  placeholder="Jane Smith"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-barlow-condensed text-cream/50 text-xs tracking-wider uppercase mb-2">Email Address *</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 focus:border-gold/50 text-cream placeholder-cream/20 rounded-sm px-4 py-3 font-barlow text-sm outline-none transition-colors"
                  placeholder="jane@acme.com"
                />
              </div>
              <div>
                <label className="block font-barlow-condensed text-cream/50 text-xs tracking-wider uppercase mb-2">Website</label>
                <input
                  name="website"
                  type="url"
                  value={form.website}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 focus:border-gold/50 text-cream placeholder-cream/20 rounded-sm px-4 py-3 font-barlow text-sm outline-none transition-colors"
                  placeholder="https://acme.com"
                />
              </div>
            </div>

            <div>
              <label className="block font-barlow-condensed text-cream/50 text-xs tracking-wider uppercase mb-2">Message *</label>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 focus:border-gold/50 text-cream placeholder-cream/20 rounded-sm px-4 py-3 font-barlow text-sm outline-none transition-colors resize-none"
                placeholder="Tell us about your business and how you'd like to partner with us..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm tracking-[0.2em] uppercase px-10 py-4 rounded-sm transition-colors disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Submit Inquiry'}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </section>
  );
}