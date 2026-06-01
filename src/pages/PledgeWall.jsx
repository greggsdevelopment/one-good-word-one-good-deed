import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, MapPin, Clock, Search, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import PledgeCard from '@/components/pledge/PledgeCard';
import FeaturedQuotes from '@/components/pledge/FeaturedQuotes';

// Animated counter hook
function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!target || started.current) return;
    started.current = true;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(interval); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target, duration]);
  return count;
}

const COLORS = [
  'border-gold/30 bg-gold/5',
  'border-white/10 bg-white/[0.03]',
  'border-gold/20 bg-gold/[0.04]',
  'border-white/[0.08] bg-white/[0.02]',
];

export default function PledgeWall() {
  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ first_name: '', last_initial: '', city: '', pledge_statement: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedPledge, setSubmittedPledge] = useState(null);
  const [search, setSearch] = useState('');

  const animatedCount = useCountUp(loading ? 0 : pledges.length);

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
    setSubmittedPledge(clean);
    fetchPledges();
  };

  const handleShareDone = () => {
    setSubmitted(false);
    setSubmittedPledge(null);
    setForm({ first_name: '', last_initial: '', city: '', pledge_statement: '' });
  };

  const filteredPledges = pledges.filter(p => {
    if (!p.approved) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.first_name?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q)
    );
  });

  const inputClass = "w-full bg-white/[0.05] border border-white/[0.1] rounded-sm px-4 py-3 text-cream placeholder:text-cream/25 font-barlow text-sm focus:outline-none focus:border-gold/40 transition-colors";

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

        {/* Hero counter — animated */}
        <div className="text-center mb-12">
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
              {loading ? '…' : animatedCount.toLocaleString()}
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

        {/* Featured quotes */}
        <FeaturedQuotes />

        <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start mt-12">

          {/* Left: search + pledge grid */}
          <div>
            {/* Search bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or city..."
                className="w-full pl-11 pr-10 py-3 bg-white/[0.04] border border-cream/10 rounded-sm text-cream placeholder:text-cream/25 font-barlow text-sm focus:outline-none focus:border-gold/30 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {search && (
              <p className="font-barlow text-cream/30 text-xs mb-4">
                {filteredPledges.length} result{filteredPledges.length !== 1 ? 's' : ''} for "{search}"
              </p>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
              </div>
            ) : filteredPledges.length === 0 ? (
              <div className="text-center py-16 text-cream/30 font-barlow">No pledges found matching your search.</div>
            ) : (
              <div className="columns-1 sm:columns-2 gap-4 space-y-4">
                {filteredPledges.map((pledge, i) => (
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
                            <MapPin className="w-3 h-3" />{pledge.city}
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

          {/* Right: form — sticky */}
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
                  <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <PledgeCard pledge={submittedPledge} onClose={handleShareDone} />
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