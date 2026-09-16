import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Clock, Search, X, ChevronDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import CinematicWall from '@/components/pledge/CinematicWall';
import PledgeCard from '@/components/pledge/PledgeCard';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';
const SERIF = { fontFamily: "'Cormorant Garamond', serif" };
const SCRIPT = { fontFamily: "'Great Vibes', cursive" };

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!target || started.current) return undefined;
    started.current = true;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target, duration]);

  return count;
}

export default function PledgeWall() {
  const [pledges, setPledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ first_name: '', last_initial: '', city: '', pledge_statement: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedPledge, setSubmittedPledge] = useState(null);
  const [search, setSearch] = useState('');
  const [browseOpen, setBrowseOpen] = useState(false);

  const animatedCount = useCountUp(loading ? 0 : pledges.length);

  useEffect(() => {
    document.title = 'Pledge Wall | One Good Word One Good Deed';
  }, []);

  const fetchPledges = async () => {
    try {
      const data = await base44.entities.Pledge.filter({ approved: true }, '-created_date', 500);
      setPledges(data);
    } catch (err) {
      console.error('Could not load pledges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPledges();
  }, []);

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

  const query = search.trim().toLowerCase();
  const filteredPledges = query
    ? pledges.filter(
        (p) =>
          p.first_name?.toLowerCase().includes(query) ||
          p.city?.toLowerCase().includes(query)
      )
    : pledges;

  const showGrid = Boolean(query) || browseOpen;

  const inputClass =
    'w-full bg-white/[0.05] border border-white/[0.1] rounded-sm px-4 py-3 text-cream placeholder:text-cream/25 font-barlow text-sm focus:outline-none focus:border-gold/40 transition-colors';

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />

      {/* Hero counter */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 20%, rgba(230,180,80,0.13) 0%, rgba(11,11,13,0) 60%)',
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-gold text-4xl md:text-5xl mb-3"
            style={SCRIPT}
          >
            The Pledge Wall
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="inline-flex items-center gap-5 mb-3"
          >
            <div className="w-10 md:w-16 h-px bg-gold/40" />
            <span className="font-anton text-gold text-6xl sm:text-8xl md:text-9xl leading-none">
              {loading ? '···' : animatedCount.toLocaleString()}
            </span>
            <div className="w-10 md:w-16 h-px bg-gold/40" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-anton text-cream text-3xl sm:text-4xl md:text-5xl leading-tight mb-6"
          >
            PEOPLE HAVE MADE<br />THE PROMISE.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-cream/70 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={SERIF}
          >
            One good word. One good deed. Every name below belongs to someone who
            decided to be louder with love than the world is with hate. Watch them
            come through.
          </motion.p>
        </div>
      </section>

      {/* The cinematic wall */}
      <section className="relative px-6 pb-8">
        <div className="relative z-10 max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
          ) : (
            <CinematicWall pledges={pledges} />
          )}
        </div>
      </section>

      {/* Search + browse */}
      <section className="relative px-6 py-16 border-t border-gold/10 mt-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find your pledge by name or city..."
                className="w-full pl-11 pr-10 py-3.5 bg-white/[0.04] border border-cream/10 rounded-sm text-cream placeholder:text-cream/25 font-barlow text-sm focus:outline-none focus:border-gold/40 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setBrowseOpen((v) => !v)}
              className="flex items-center justify-center gap-2 px-6 py-3.5 border border-gold/30 hover:border-gold/60 text-gold font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-colors"
            >
              {browseOpen ? 'Hide the full list' : `Browse all ${pledges.length.toLocaleString()}`}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${browseOpen ? 'rotate-180' : ''}`}
              />
            </button>
          </div>

          {query && (
            <p className="font-barlow text-cream/40 text-sm mb-6">
              {filteredPledges.length} result{filteredPledges.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </p>
          )}

          <AnimatePresence initial={false}>
            {showGrid && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                {filteredPledges.length === 0 ? (
                  <div className="text-center py-16 text-cream/30 font-barlow">
                    No pledges match that search.
                  </div>
                ) : (
                  <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {filteredPledges.map((pledge) => (
                      <div
                        key={pledge.id}
                        className="break-inside-avoid rounded-sm border border-gold/15 bg-white/[0.03] p-5 hover:border-gold/40 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-gold/50 mb-3" />
                        {pledge.pledge_statement && (
                          <p className="text-cream/80 text-[15px] leading-relaxed mb-4 italic" style={SERIF}>
                            &ldquo;{pledge.pledge_statement}&rdquo;
                          </p>
                        )}
                        <div className="flex items-end justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-barlow-condensed text-cream font-semibold tracking-wide text-sm">
                              {pledge.first_name}
                              {pledge.last_initial ? ` ${pledge.last_initial}.` : ''}
                            </p>
                            {pledge.city && (
                              <p className="flex items-center gap-1 font-barlow text-cream/35 text-xs mt-0.5">
                                <MapPin className="w-3 h-3" />
                                {pledge.city}
                              </p>
                            )}
                          </div>
                          {pledge.created_date && (
                            <p className="flex items-center gap-1 font-barlow text-cream/25 text-xs">
                              <Clock className="w-3 h-3" />
                              {format(new Date(pledge.created_date), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Sign the pledge */}
      <section id="sign" className="relative px-6 py-20 border-t border-gold/10 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(230,180,80,0.12) 0%, rgba(11,11,13,0) 60%)',
          }}
        />
        <div className="relative z-10 max-w-xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold text-4xl md:text-5xl mb-3" style={SCRIPT}>
              Add your name
            </p>
            <p className="text-cream/70 text-lg leading-relaxed" style={SERIF}>
              Your pledge joins the wall above and cycles through it, in your own words,
              for everyone who visits.
            </p>
          </div>

          <div className="bg-white/[0.03] border border-gold/25 rounded-sm p-7 sm:p-9">
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
                  <p className="font-barlow text-cream/30 text-xs text-center leading-relaxed">
                    Pledges appear on the wall once approved. Only your first name and
                    last initial are ever shown.
                  </p>
                </motion.form>
              ) : (
                <motion.div key="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <PledgeCard pledge={submittedPledge} onClose={handleShareDone} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}