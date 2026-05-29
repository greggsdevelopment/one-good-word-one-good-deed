import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { formatDistanceToNow } from 'date-fns';

const PLACEHOLDER_STATEMENTS = [
  'I pledge to speak up when I see someone being bullied.',
  'I pledge to treat everyone with dignity and respect.',
  'I pledge to use my words to build people up, not tear them down.',
  'I pledge to stand against racism in my community.',
  'I pledge to be someone others can count on.',
];

function PledgeCard({ pledge, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.6) }}
      className="bg-white/[0.04] border border-white/[0.08] rounded-sm p-6 hover:border-gold/25 hover:bg-white/[0.06] transition-all duration-300 flex flex-col gap-4"
    >
      {/* Quote */}
      <p className="font-barlow text-cream/75 text-sm leading-relaxed italic flex-1">
        "{pledge.pledge_statement || 'I pledge to spread one good word and one good deed every day.'}"
      </p>

      {/* Divider */}
      <div className="h-px bg-white/[0.07]" />

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
            <span className="font-anton text-gold text-sm">
              {pledge.first_name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-barlow-condensed text-cream font-semibold text-sm tracking-wide">
              {pledge.first_name}{pledge.last_initial ? ` ${pledge.last_initial.toUpperCase()}.` : ''}
            </p>
            {pledge.city && (
              <p className="font-barlow text-cream/35 text-xs">{pledge.city}</p>
            )}
          </div>
        </div>
        <p className="font-barlow text-cream/25 text-xs shrink-0">
          {pledge.created_date
            ? formatDistanceToNow(new Date(pledge.created_date), { addSuffix: true })
            : 'recently'}
        </p>
      </div>
    </motion.div>
  );
}

function PledgeForm({ onSuccess }) {
  const [form, setForm] = useState({ first_name: '', last_initial: '', city: '', pledge_statement: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = { ...form, last_initial: form.last_initial.charAt(0) };
    await base44.entities.Pledge.create(data);
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => onSuccess(data), 1200);
  };

  const inputClass = "w-full bg-white/[0.05] border border-white/[0.1] rounded-sm px-5 py-3.5 text-cream placeholder:text-cream/25 font-barlow text-sm focus:outline-none focus:border-gold/40 transition-colors";

  return (
    <AnimatePresence mode="wait">
      {!submitted ? (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="First Name *" value={form.first_name} onChange={set('first_name')} maxLength={50} className={inputClass} />
            <input placeholder="Last Initial" value={form.last_initial} onChange={set('last_initial')} maxLength={1} className={inputClass} />
          </div>
          <input placeholder="Your City" value={form.city} onChange={set('city')} maxLength={80} className={inputClass} />
          <textarea
            placeholder="Your pledge statement... (e.g. I pledge to speak up when I see someone being bullied.)"
            value={form.pledge_statement}
            onChange={set('pledge_statement')}
            rows={3}
            maxLength={300}
            className={`${inputClass} resize-none`}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gold hover:bg-gold-dark disabled:opacity-50 text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
          >
            {submitting ? 'Signing...' : 'Sign the Pledge'}
          </button>
        </motion.form>
      ) : (
        <motion.div
          key="thanks"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8 flex flex-col items-center gap-3"
        >
          <CheckCircle className="w-14 h-14 text-gold" />
          <h3 className="font-anton text-cream text-2xl">PLEDGE RECEIVED!</h3>
          <p className="font-barlow text-cream/55 text-sm">Your voice has been added to the wall.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PledgeWall() {
  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPledges = async () => {
    const data = await base44.entities.Pledge.list('-created_date', 200);
    setPledges(data);
    setLoading(false);
  };

  useEffect(() => { loadPledges(); }, []);

  const handleNewPledge = (newPledge) => {
    setPledges((p) => [{ ...newPledge, created_date: new Date().toISOString(), id: Math.random() }, ...p]);
  };

  return (
    <div className="min-h-screen bg-ink relative">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors font-barlow-condensed text-sm tracking-wider uppercase">
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
          <p className="font-anton text-cream text-lg tracking-wider">PLEDGE WALL</p>
          <div className="w-24" />
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">

        {/* Hero counter */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4"
          >
            The Movement is Growing
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-flex flex-col items-center mb-6"
          >
            <span className="font-anton text-gold text-8xl sm:text-[10rem] leading-none">
              {loading ? '—' : pledges.length.toLocaleString()}
            </span>
            <span className="font-barlow-condensed text-cream/50 text-sm tracking-[0.3em] uppercase -mt-2">
              Pledges Taken
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-anton text-cream text-4xl sm:text-6xl leading-[0.92] mb-4"
          >
            ONE WORD AT A TIME,<br />
            <span className="text-gold">WE'RE CHANGING THINGS.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-barlow text-cream/50 text-lg max-w-xl mx-auto"
          >
            Every name on this wall represents a choice — a decision to be part of the solution. 
            Add yours today.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* Pledge form — sticky sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-24 bg-white/[0.03] border border-white/[0.08] rounded-sm p-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-gold" />
                <h2 className="font-anton text-cream text-2xl">TAKE THE PLEDGE</h2>
              </div>
              <p className="font-barlow text-cream/45 text-sm mb-6 leading-relaxed">
                Add your name to the wall. Stand with thousands who have committed to one good word and one good deed.
              </p>
              <PledgeForm onSuccess={handleNewPledge} />
            </motion.div>
          </div>

          {/* Pledge grid */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <div className="w-8 h-8 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
              </div>
            ) : pledges.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-barlow text-cream/30 text-lg">Be the first to sign the pledge.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {pledges.map((pledge, i) => (
                  <PledgeCard key={pledge.id} pledge={pledge} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}