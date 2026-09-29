import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Phone, Plus, Trash2, Truck, MapPin, ClipboardCheck, Ban } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { base44 } from '@/api/base44Client';
import { OTHER_NEED_ID, PICKUP_ORIGIN_LABEL, capFor, conditionsFor } from '@/lib/donations';

const inputClass =
  'w-full bg-ink border border-white/[0.1] rounded-sm px-4 py-3.5 text-cream placeholder:text-cream/25 font-barlow focus:outline-none focus:border-gold/40 transition-colors';

function readError(err) {
  return err?.response?.data || err?.data || null;
}

function groupByCategory(needs) {
  const groups = new Map();
  for (const n of needs) {
    if (!groups.has(n.category)) groups.set(n.category, []);
    groups.get(n.category).push(n);
  }
  return [...groups.entries()];
}

export default function ItemDonationForm({ settings, needs = [] }) {
  const [ref, inView] = useInView(0.05);
  const pickupOpen = settings.pickup_enabled;
  const allowOther = settings.allow_other_items === true;
  const radius = settings.pickup_radius_miles;
  const notAccepted = Array.isArray(settings.not_accepted) ? settings.not_accepted.filter(Boolean) : [];

  const openNeeds = useMemo(() => needs.filter((n) => (n.status || 'open') === 'open'), [needs]);
  const fullNeeds = useMemo(() => needs.filter((n) => n.status === 'full'), [needs]);
  const needById = useMemo(() => new Map(openNeeds.map((n) => [n.id, n])), [openNeeds]);
  const grouped = useMemo(() => groupByCategory(openNeeds), [openNeeds]);
  const canOffer = openNeeds.length > 0 || allowOther;

  const blankLine = () => ({ need_id: '', description: '', quantity: 1, condition: 'New' });

  const [form, setForm] = useState({
    donor_name: '',
    email: '',
    phone: '',
    delivery_method: pickupOpen ? 'pickup' : 'dropoff',
    address_line: '',
    city: '',
    state: 'MI',
    zip: '',
    pickup_window: '',
    notes: '',
    website: '',
  });
  const [lines, setLines] = useState([blankLine()]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const setLine = (idx, patch) => setLines((list) => list.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  const chooseNeed = (idx) => (e) => {
    const need_id = e.target.value;
    const need = needById.get(need_id);
    const allowed = need ? conditionsFor(need) : ['New'];
    setLine(idx, { need_id, condition: allowed[0], quantity: 1 });
  };
  const addLine = () => setLines((list) => (list.length >= 25 ? list : [...list, blankLine()]));
  const removeLine = (idx) => setLines((list) => (list.length === 1 ? list : list.filter((_, i) => i !== idx)));

  const isPickup = form.delivery_method === 'pickup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        items: lines.map((l) => ({ ...l, quantity: Number(l.quantity) })),
      };
      const response = await base44.functions.invoke('submitItemDonation', payload);
      const data = response?.data ?? response;
      if (data?.success) {
        setSubmitted(true);
        document.getElementById('give-items')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        setError({ message: data?.message || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      const data = readError(err);
      setError({
        code: data?.error,
        message:
          data?.message ||
          'Something went wrong sending that. Call (734) 383-3865 or email greggsdevelopment@gmail.com and we will take it down by hand.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const switchToDropoff = () => {
    setForm((p) => ({ ...p, delivery_method: 'dropoff' }));
    setError(null);
  };

  if (submitted) {
    return (
      <section id="give-items" className="relative bg-cream py-24 px-6 scroll-mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-gold-dark mx-auto mb-6" />
          <h2 className="font-anton text-ink text-4xl sm:text-5xl mb-4">THANK YOU. WE'LL BE IN TOUCH.</h2>
          <p className="font-barlow text-ink/60 text-lg leading-relaxed mb-8">
            We look at every offer before we say yes. Expect a call, text or email within two business days
            telling you whether we can take it{isPickup ? ' and locking in a pickup time' : ' and setting a drop-off time and place'}.
            Please hold the items until you hear from us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center font-barlow-condensed text-ink/70 text-base tracking-wider uppercase">
            <a href="tel:7343833865" className="flex items-center justify-center gap-2 hover:text-gold-dark transition-colors">
              <Phone className="w-4 h-4" /> (734) 383-3865
            </a>
            <a href="mailto:greggsdevelopment@gmail.com" className="flex items-center justify-center gap-2 hover:text-gold-dark transition-colors">
              <Mail className="w-4 h-4" /> greggsdevelopment@gmail.com
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="give-items" ref={ref} className="relative bg-cream py-24 px-6 scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-barlow-condensed text-gold-dark text-xs tracking-[0.3em] uppercase mb-3 text-center"
        >
          Donate Items
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-anton text-ink text-4xl sm:text-5xl text-center mb-4"
        >
          GIVE WHAT KIDS NEED
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow text-ink/55 text-center text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We keep a short list of what kids actually need and only take items from it, in the condition
          listed. Every offer is reviewed before we say yes.
          {pickupOpen ? ` If we can take it, we pick up free anywhere within ${radius} miles of ${PICKUP_ORIGIN_LABEL}, or you drop it off.` : ' If we can take it, we will set a drop-off time with you.'}
        </motion.p>

        {/* Accepted and not accepted */}
        <div className="grid md:grid-cols-5 gap-4 mb-10">
          <div className="md:col-span-3 bg-ink rounded-sm p-6 sm:p-8">
            <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" /> What we are taking right now
            </p>
            {openNeeds.length === 0 ? (
              <p className="font-barlow text-cream/60">We are set on everything for the moment. Thank you.</p>
            ) : (
              <ul className="space-y-3">
                {openNeeds.map((n) => (
                  <li key={n.id} className="font-barlow text-cream/85 leading-snug">
                    <span className="font-semibold">{n.name}</span>
                    <span className="text-cream/45 text-sm"> · {conditionsFor(n).join(', ').toLowerCase()}</span>
                    {n.details && <span className="block text-cream/50 text-sm">{n.details}</span>}
                  </li>
                ))}
              </ul>
            )}
            {fullNeeds.length > 0 && (
              <p className="font-barlow text-cream/40 text-sm mt-5 pt-4 border-t border-white/[0.06]">
                Covered for now, thank you: {fullNeeds.map((n) => n.name).join(', ')}.
              </p>
            )}
          </div>
          <div className="md:col-span-2 bg-white border border-ink/10 rounded-sm p-6">
            <p className="font-barlow-condensed text-ink/60 text-xs tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
              <Ban className="w-4 h-4" /> What we cannot take
            </p>
            <ul className="space-y-2">
              {notAccepted.map((n) => (
                <li key={n} className="font-barlow text-ink/70 text-sm leading-snug flex gap-2">
                  <span className="text-ink/30">•</span> {n}
                </li>
              ))}
              <li className="font-barlow text-ink/70 text-sm leading-snug flex gap-2">
                <span className="text-ink/30">•</span> Anything not on the list{allowOther ? ', unless we approve it first' : ''}
              </li>
            </ul>
          </div>
        </div>

        {!canOffer ? (
          <div className="bg-white border border-ink/10 rounded-sm p-8 text-center">
            <p className="font-barlow text-ink/70 text-lg leading-relaxed">
              Our list is empty right now, so we are not taking item offers at the moment. Check back soon, or
              give money below to keep the program in schools.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-ink rounded-sm p-6 sm:p-10 space-y-8">
            {/* Honeypot, hidden from people */}
            <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
              </label>
            </div>

            {/* Items */}
            <div>
              <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-4">1. What are you offering?</p>
              <div className="space-y-3">
                {lines.map((line, idx) => {
                  const need = needById.get(line.need_id);
                  const isOther = line.need_id === OTHER_NEED_ID;
                  const allowed = need ? conditionsFor(need) : isOther ? ['New', 'Like new', 'Gently used'] : ['New'];
                  const cap = need ? capFor(need) : 1000;
                  return (
                    <div key={idx} className="bg-white/[0.02] border border-white/[0.06] rounded-sm p-3">
                      <div className="grid grid-cols-12 gap-3 items-start">
                        <select
                          required
                          aria-label="Item"
                          className={`${inputClass} col-span-12 sm:col-span-5 cursor-pointer`}
                          value={line.need_id}
                          onChange={chooseNeed(idx)}
                        >
                          <option value="">Pick an item from our list *</option>
                          {grouped.map(([cat, list]) => (
                            <optgroup key={cat} label={cat}>
                              {list.map((n) => (
                                <option key={n.id} value={n.id}>{n.name}</option>
                              ))}
                            </optgroup>
                          ))}
                          {allowOther && (
                            <optgroup label="Not on the list">
                              <option value={OTHER_NEED_ID}>Something else (we will review it)</option>
                            </optgroup>
                          )}
                        </select>
                        <input
                          aria-label="Details"
                          required={isOther}
                          className={`${inputClass} col-span-12 sm:col-span-3`}
                          placeholder={isOther ? 'What is it? *' : 'Sizes or details'}
                          maxLength={200}
                          value={line.description}
                          onChange={(e) => setLine(idx, { description: e.target.value })}
                        />
                        <input
                          required
                          aria-label="Quantity"
                          type="number"
                          min={1}
                          max={cap}
                          step={1}
                          className={`${inputClass} col-span-4 sm:col-span-1 px-2 text-center`}
                          value={line.quantity}
                          onChange={(e) => setLine(idx, { quantity: e.target.value })}
                        />
                        <select
                          aria-label="Condition"
                          className={`${inputClass} col-span-6 sm:col-span-2 cursor-pointer px-2`}
                          value={allowed.includes(line.condition) ? line.condition : allowed[0]}
                          onChange={(e) => setLine(idx, { condition: e.target.value })}
                        >
                          {allowed.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeLine(idx)}
                          disabled={lines.length === 1}
                          aria-label="Remove item"
                          className="col-span-2 sm:col-span-1 h-[52px] flex items-center justify-center text-cream/40 hover:text-red-400 disabled:opacity-20 disabled:hover:text-cream/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {need && (need.details || cap < 1000) && (
                        <p className="font-barlow text-cream/40 text-xs mt-2 px-1">
                          {need.details}
                          {need.details && cap < 1000 ? ' ' : ''}
                          {cap < 1000 ? `Up to ${cap} per donation.` : ''}
                        </p>
                      )}
                      {isOther && (
                        <p className="font-barlow text-gold/70 text-xs mt-2 px-1">
                          Items not on the list are only taken if we say yes first. Please describe it clearly.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={addLine}
                disabled={lines.length >= 25}
                className="mt-3 inline-flex items-center gap-1.5 font-barlow-condensed text-gold hover:text-gold-dark text-sm uppercase tracking-wider disabled:opacity-40"
              >
                <Plus className="w-4 h-4" /> Add another item
              </button>
            </div>

            {/* Delivery */}
            <div>
              <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-4">2. Pickup or drop-off?</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  pickupOpen && {
                    value: 'pickup',
                    icon: Truck,
                    title: 'Pick it up from me',
                    body: `Free, within ${radius} miles of ${PICKUP_ORIGIN_LABEL}`,
                  },
                  { value: 'dropoff', icon: MapPin, title: 'I will drop it off', body: 'We will set a time and place with you' },
                ]
                  .filter(Boolean)
                  .map(({ value, icon: Icon, title, body }) => {
                    const active = form.delivery_method === value;
                    return (
                      <button
                        type="button"
                        key={value}
                        onClick={() => {
                          setForm((p) => ({ ...p, delivery_method: value }));
                          setError(null);
                        }}
                        aria-pressed={active}
                        className={`text-left rounded-sm border p-4 flex gap-3 transition-colors ${
                          active ? 'border-gold bg-gold/10' : 'border-white/[0.1] hover:border-gold/30'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${active ? 'text-gold' : 'text-cream/40'}`} />
                        <span>
                          <span className="block font-barlow-condensed text-cream font-bold tracking-wide">{title}</span>
                          <span className="block font-barlow text-cream/50 text-sm">{body}</span>
                        </span>
                      </button>
                    );
                  })}
              </div>
              {!pickupOpen && (
                <p className="font-barlow text-cream/45 text-sm mt-3">Pickups are paused right now. Drop-offs are still open.</p>
              )}
              {!isPickup && settings.dropoff_instructions && (
                <p className="font-barlow text-cream/55 text-sm mt-3 leading-relaxed">{settings.dropoff_instructions}</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-4">3. How do we reach you?</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <input required className={inputClass} placeholder="Your Name *" autoComplete="name" value={form.donor_name} onChange={set('donor_name')} />
                <input required type="email" className={inputClass} placeholder="Email *" autoComplete="email" value={form.email} onChange={set('email')} />
                <input
                  required={isPickup}
                  type="tel"
                  className={inputClass}
                  placeholder={isPickup ? 'Phone *' : 'Phone'}
                  autoComplete="tel"
                  value={form.phone}
                  onChange={set('phone')}
                />
                {isPickup && (
                  <input className={inputClass} placeholder="Best days and times for pickup" value={form.pickup_window} onChange={set('pickup_window')} />
                )}
              </div>

              {isPickup && (
                <div className="grid grid-cols-6 gap-4 mt-4">
                  <input
                    required
                    className={`${inputClass} col-span-6`}
                    placeholder="Pickup street address *"
                    autoComplete="street-address"
                    value={form.address_line}
                    onChange={set('address_line')}
                  />
                  <input required className={`${inputClass} col-span-6 sm:col-span-3`} placeholder="City *" autoComplete="address-level2" value={form.city} onChange={set('city')} />
                  <input className={`${inputClass} col-span-2 sm:col-span-1`} placeholder="State" autoComplete="address-level1" value={form.state} onChange={set('state')} maxLength={2} />
                  <input
                    required
                    inputMode="numeric"
                    pattern="\d{5}(-\d{4})?"
                    className={`${inputClass} col-span-4 sm:col-span-2`}
                    placeholder="ZIP *"
                    autoComplete="postal-code"
                    value={form.zip}
                    onChange={set('zip')}
                  />
                </div>
              )}

              <textarea
                rows={3}
                className={`${inputClass} mt-4`}
                placeholder="Anything else? (gate code, where the items will be, questions)"
                value={form.notes}
                onChange={set('notes')}
              />
            </div>

            {error && (
              <div className="rounded-sm border border-red-400/30 bg-red-500/10 p-4">
                <p className="font-barlow text-red-300 text-sm leading-relaxed">{error.message}</p>
                {(error.code === 'out_of_range' || error.code === 'address_not_found' || error.code === 'pickup_closed') && (
                  <button
                    type="button"
                    onClick={switchToDropoff}
                    className="mt-3 font-barlow-condensed text-gold hover:text-gold-dark text-sm uppercase tracking-wider"
                  >
                    Switch to drop-off →
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-10 py-4 bg-gold hover:bg-gold-dark disabled:opacity-50 disabled:cursor-not-allowed text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300"
            >
              {submitting ? (isPickup ? 'Checking address...' : 'Sending...') : 'Send Offer for Review'}
            </button>
            <p className="font-barlow text-cream/35 text-xs text-center leading-relaxed">
              Sending an offer does not commit us to take it. We reply within two business days either way.
              Your address and phone are only used to coordinate this donation. We never share them.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
