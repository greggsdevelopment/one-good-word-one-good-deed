import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Phone, Plus, Trash2, Truck, MapPin, PackageCheck } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import { base44 } from '@/api/base44Client';
import { ITEM_CATEGORIES, ITEM_CONDITIONS, PICKUP_ORIGIN_LABEL } from '@/lib/donations';

const blankItem = () => ({ category: '', description: '', quantity: 1, condition: 'New' });

const inputClass =
  'w-full bg-ink border border-white/[0.1] rounded-sm px-4 py-3.5 text-cream placeholder:text-cream/25 font-barlow focus:outline-none focus:border-gold/40 transition-colors';

function readError(err) {
  return err?.response?.data || err?.data || null;
}

export default function ItemDonationForm({ settings }) {
  const [ref, inView] = useInView(0.05);
  const pickupOpen = settings.pickup_enabled;
  const radius = settings.pickup_radius_miles;
  const needs = Array.isArray(settings.needs) ? settings.needs.filter(Boolean) : [];

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
  const [items, setItems] = useState([blankItem()]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const setItem = (idx, field) => (e) =>
    setItems((list) => list.map((it, i) => (i === idx ? { ...it, [field]: e.target.value } : it)));
  const addItem = () => setItems((list) => (list.length >= 25 ? list : [...list, blankItem()]));
  const removeItem = (idx) => setItems((list) => (list.length === 1 ? list : list.filter((_, i) => i !== idx)));

  const isPickup = form.delivery_method === 'pickup';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        ...form,
        items: items.map((it) => ({ ...it, quantity: Number(it.quantity) })),
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
          <h2 className="font-anton text-ink text-4xl sm:text-5xl mb-4">THANK YOU. WE GOT IT.</h2>
          <p className="font-barlow text-ink/60 text-lg leading-relaxed mb-8">
            {isPickup
              ? 'We will call or text within two business days to lock in a pickup time.'
              : 'We will reach out within two business days to set a drop-off time and place.'}{' '}
            If something changes, just reach out.
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
          Backpacks, school supplies, clothes, coats, hygiene items, books and more. Tell us what you have
          {pickupOpen ? ` and we will come get it anywhere within ${radius} miles of ${PICKUP_ORIGIN_LABEL}, ` : ' '}
          or drop it off with us.
        </motion.p>

        {/* How it works */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: PackageCheck, title: 'Tell us what you have', body: 'List the items below. Takes two minutes.' },
            pickupOpen
              ? { icon: Truck, title: `Free pickup in ${radius} miles`, body: `We come to you anywhere within ${radius} miles of ${PICKUP_ORIGIN_LABEL}.` }
              : { icon: MapPin, title: 'Drop it off', body: 'We set a time and place that works for you.' },
            { icon: CheckCircle, title: 'It goes to kids', body: 'Handed out at schools, family nights and community events.' },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-white border border-ink/10 rounded-sm p-5">
              <Icon className="w-6 h-6 text-gold-dark mb-3" />
              <p className="font-barlow-condensed text-ink font-bold text-lg tracking-wide">{title}</p>
              <p className="font-barlow text-ink/55 text-sm leading-relaxed mt-1">{body}</p>
            </div>
          ))}
        </div>

        {needs.length > 0 && (
          <div className="bg-ink rounded-sm p-6 sm:p-8 mb-10">
            <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-4">What we need most right now</p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
              {needs.map((n) => (
                <li key={n} className="font-barlow text-cream/80 flex gap-2">
                  <span className="text-gold">•</span> {n}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-ink rounded-sm p-6 sm:p-10 space-y-8" noValidate={false}>
          {/* Honeypot, hidden from people */}
          <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
            </label>
          </div>

          {/* Items */}
          <div>
            <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-4">1. What are you donating?</p>
            <div className="space-y-3">
              {items.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-3 items-start bg-white/[0.02] border border-white/[0.06] rounded-sm p-3">
                  <select
                    required
                    aria-label="Category"
                    className={`${inputClass} col-span-12 sm:col-span-4 cursor-pointer`}
                    value={it.category}
                    onChange={setItem(idx, 'category')}
                  >
                    <option value="">Category *</option>
                    {ITEM_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    aria-label="Description"
                    required={it.category === 'Other'}
                    className={`${inputClass} col-span-12 sm:col-span-4`}
                    placeholder={it.category === 'Other' ? 'What is it? *' : 'Details (size, type, etc.)'}
                    maxLength={200}
                    value={it.description}
                    onChange={setItem(idx, 'description')}
                  />
                  <input
                    required
                    aria-label="Quantity"
                    type="number"
                    min={1}
                    max={1000}
                    step={1}
                    className={`${inputClass} col-span-4 sm:col-span-1 px-2 text-center`}
                    value={it.quantity}
                    onChange={setItem(idx, 'quantity')}
                  />
                  <select
                    aria-label="Condition"
                    className={`${inputClass} col-span-6 sm:col-span-2 cursor-pointer px-2`}
                    value={it.condition}
                    onChange={setItem(idx, 'condition')}
                  >
                    {ITEM_CONDITIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    disabled={items.length === 1}
                    aria-label="Remove item"
                    className="col-span-2 sm:col-span-1 h-[52px] flex items-center justify-center text-cream/40 hover:text-red-400 disabled:opacity-20 disabled:hover:text-cream/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addItem}
              disabled={items.length >= 25}
              className="mt-3 inline-flex items-center gap-1.5 font-barlow-condensed text-gold hover:text-gold-dark text-sm uppercase tracking-wider disabled:opacity-40"
            >
              <Plus className="w-4 h-4" /> Add another item
            </button>
            <p className="font-barlow text-cream/35 text-xs mt-2">
              Please make sure clothing and shoes are clean and in good shape.
            </p>
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
            {submitting ? (isPickup ? 'Checking address...' : 'Sending...') : isPickup ? 'Request Pickup' : 'Send Donation Offer'}
          </button>
          <p className="font-barlow text-cream/35 text-xs text-center leading-relaxed">
            Your address and phone are only used to coordinate this donation. We never share them.
          </p>
        </form>
      </div>
    </section>
  );
}
