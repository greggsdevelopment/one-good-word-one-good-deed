import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, CheckCircle, MapPin, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';

export default function PledgeWall() {
  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ first_name: '', last_initial: '', city: '', pledge_statement: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchPledges = async () => {
    const data = await base44.entities.Pledge.list('-created_date', 200);
    setPledges(data);
    setLoading(false);
  };

  useEffect(() => { fetchPledges(); }, []);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const clean = { ...form, last_initial: form.last_initial.charAt(0).toUpperCase() };
    await base44.entities.Pledge.create(clean);
    setSubmitting(false);
    setSubmitted(true);
    fetchPledges();
  };

  const inputClass = "w-full bg-white/[0.05] border border-white/[0.1] rounded-sm px-4 py-3 text-cream placeholder:text-cream/25 font-barlow text-sm focus:outline-none focus:border-gold/40 transition-colors";

  const COLORS = [
    'border-gold/30 bg-gold/5',
    'border-white/10 bg-white/[0.03]',
    'border-gold/20 bg-gold/[0.04]',
    'border-white/[0.08] bg-white/[0.02]',
  ];

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
          <Link to="/shop" className="px-4 py-2 border border-gold/30 hover:border-gold/60 text-gold font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-all hidden sm:block">
            Shop Merch
          </Link>
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
            A Global Community
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-px bg-gold/40" />
            <span className="font-anton text-gold text-7xl sm:text-9xl leading-none">
              {loading ? '...' : pledges.length.toLocaleString()}
            </span>
            <div className="w-12 h-px bg-gold/40" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-anton text-cream text-4xl sm:text-5xl mb-4"
          >
            PEOPLE HAVE TAKEN<br />THE PLEDGE.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-barlow text-cream/50 text-lg max-w-xl mx-auto"
          >
            Join thousands who have committed to choosing kindness — one good word, one good deed at a time.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">

          {/* Pledge grid */}
          <div>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 lg:columns-2 gap-4 space-y-4">
                {pledges.map((pledge, i) => (
                  <motion.div
                    key={pledge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.6) }}
                    className={`break-inside-avoid rounded-sm border p-5 ${COLORS[i % COLORS.length]}`}
                  >
                    <Heart className="w-4 h-4 text-gold/50 mb-3" />
                    {pledge.pledge_statement && (
                      <p className="font-barlow text-cream/80 text-sm leading-relaxed mb-4 italic">
                        "{pledge.pledge_statement}"
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-barlow-condensed text-cream font-semibold tracking-wide text-sm">
                          {pledge.first_name}{pledge.last_initial ? ` ${pledge.last_initial}.` : ''}
                        </p>
                        {pledge.city && (
                          <p className="flex items-center gap-1 font-barlow text-cream/35 text-xs mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {pledge.city}
                          </p>
                        )}
                      </div>
                      <p className="flex items-center gap-1 font-barlow text-cream/25 text-xs">
                        <Clock className="w-3 h-3" />
                        {format(new Date(pledge.created_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Pledge form — sticky */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white/[0.03] border border-gold/20 rounded-sm p-8">
              <div className="w-10 h-1 bg-gold mb-6" />
              <h2 className="font-anton text-cream text-3xl mb-2">TAKE THE PLEDGE</h2>
              <p className="font-barlow text-cream/50 text-sm mb-8 leading-relaxed">
                Add your name to the wall. Your commitment matters.
              </p>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form key="form" exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input required placeholder="First Name *" value={form.first_name} onChange={set('first_name')} className={inputClass} />
                      <input required placeholder="Last Initial *" maxLength={1} value={form.last_initial} onChange={set('last_initial')} className={inputClass} />
                    </div>
                    <input placeholder="City (optional)" value={form.city} onChange={set('city')} className={inputClass} />
                    <textarea
                      required
                      placeholder="I pledge to... *"
                      value={form.pledge_statement}
                      onChange={set('pledge_statement')}
                      rows={4}
                      className={`${inputClass} resize-none`}
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 bg-gold hover:bg-gold-dark disabled:opacity-50 text-ink font-barlow-condensed font-bold text-base uppercase tracking-wider rounded-sm transition-all hover:-translate-y-0.5"
                    >
                      {submitting ? 'Adding Your Pledge...' : 'Add My Pledge'}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <CheckCircle className="w-14 h-14 text-gold mx-auto mb-4" />
                    <h3 className="font-anton text-cream text-2xl mb-2">PLEDGE ADDED!</h3>
                    <p className="font-barlow text-cream/50 text-sm">Your name is now on the wall.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}