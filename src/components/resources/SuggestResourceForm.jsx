import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORIES = ['Crisis', 'Mental Health', 'After-School', 'Anti-Bullying', 'Faith', 'Substance Abuse', 'Other'];

const inputClass = "w-full bg-white/[0.05] border border-cream/10 rounded-sm px-4 py-3 text-cream placeholder:text-cream/25 font-barlow text-sm focus:outline-none focus:border-gold/40 transition-colors";

export default function SuggestResourceForm() {
  const [form, setForm] = useState({ name: '', phone: '', website: '', category: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.ResourceSuggestion.create(form);
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-2">Know a Great Resource?</p>
          <h2 className="font-anton text-cream text-4xl sm:text-5xl tracking-wide mb-3">SUGGEST A RESOURCE</h2>
          <p className="font-barlow text-cream/40 text-sm max-w-md mx-auto">
            Help us grow this directory. Submit a resource and we'll review it for inclusion.
          </p>
        </div>

        <div className="bg-white/[0.03] border border-gold/20 rounded-sm p-8">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="font-anton text-cream text-2xl mb-2">THANK YOU!</h3>
              <p className="font-barlow text-cream/50 text-sm">Your suggestion has been submitted for review.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Resource / Organization Name *" value={form.name} onChange={set('name')} className={inputClass} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input placeholder="Phone Number" value={form.phone} onChange={set('phone')} className={inputClass} />
                <input placeholder="Website URL" value={form.website} onChange={set('website')} className={inputClass} />
              </div>
              <select value={form.category} onChange={set('category')} className={`${inputClass} appearance-none`}>
                <option value="" disabled>Select a Category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea
                placeholder="Additional notes (optional)"
                value={form.notes}
                onChange={set('notes')}
                rows={3}
                className={`${inputClass} resize-none`}
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gold hover:bg-gold-dark disabled:opacity-50 text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all hover:-translate-y-0.5"
              >
                {submitting ? 'Submitting...' : 'Submit Resource'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}