import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function PrayerRequestForm() {
  const [form, setForm] = useState({ name: '', prayer: '', anonymous: false });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.prayer.trim()) return;
    setLoading(true);
    await base44.entities.ContactMessage.create({
      name: form.anonymous ? 'Anonymous' : (form.name.trim() || 'Anonymous'),
      email: 'prayer@request.org',
      subject: 'Prayer Request',
      message: form.prayer.trim(),
    });
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section className="relative z-10 py-20 px-6 bg-gradient-to-b from-transparent to-ink/60">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-gold" />
            </div>
          </div>
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-3">You Are Not Alone</p>
          <h2 className="font-anton text-cream text-4xl sm:text-5xl leading-tight mb-4">PRAYER REQUESTS</h2>
          <p className="font-barlow text-cream/50 text-base max-w-md mx-auto">
            Share your prayer request with us. Every request is read and prayed over. You may remain anonymous.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-cream/[0.07] rounded-sm p-8">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
                <h3 className="font-anton text-cream text-2xl mb-2">YOUR REQUEST IS RECEIVED</h3>
                <p className="font-barlow text-cream/50">We are praying for you. You are not alone.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', prayer: '', anonymous: false }); }}
                  className="mt-6 font-barlow-condensed text-sm uppercase tracking-wider text-gold/70 hover:text-gold transition-colors"
                >
                  Submit another request
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Anonymous checkbox */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setForm(f => ({ ...f, anonymous: !f.anonymous }))}
                    className={`w-5 h-5 rounded-sm border flex items-center justify-center transition-all shrink-0 ${
                      form.anonymous ? 'bg-gold border-gold' : 'border-cream/20 hover:border-cream/40'
                    }`}
                  >
                    {form.anonymous && <span className="text-ink text-xs font-bold">✓</span>}
                  </div>
                  <span className="font-barlow text-cream/60 text-sm group-hover:text-cream/80 transition-colors">
                    Submit anonymously
                  </span>
                </label>

                {/* Name */}
                {!form.anonymous && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                    <label className="block font-barlow-condensed text-cream/40 text-xs tracking-widest uppercase mb-2">
                      Your Name (optional)
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="First name or initials"
                      className="w-full px-4 py-3 bg-white/[0.04] border border-cream/10 rounded-sm text-cream placeholder:text-cream/20 font-barlow text-sm focus:outline-none focus:border-gold/30 transition-colors"
                    />
                  </motion.div>
                )}

                {/* Prayer text */}
                <div>
                  <label className="block font-barlow-condensed text-cream/40 text-xs tracking-widest uppercase mb-2">
                    Prayer Request <span className="text-gold">*</span>
                  </label>
                  <textarea
                    value={form.prayer}
                    onChange={(e) => setForm(f => ({ ...f, prayer: e.target.value }))}
                    placeholder="Share what's on your heart..."
                    rows={5}
                    required
                    className="w-full px-4 py-3 bg-white/[0.04] border border-cream/10 rounded-sm text-cream placeholder:text-cream/20 font-barlow text-sm focus:outline-none focus:border-gold/30 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !form.prayer.trim()}
                  className="w-full py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send Prayer Request'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}