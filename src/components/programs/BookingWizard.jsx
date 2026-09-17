import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { base44 } from '@/api/base44Client';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  Mail,
  Minus,
  Phone,
  Plus,
} from 'lucide-react';
import {
  BAND_GRADE_LEVEL_MAX,
  COMPONENT_ORDER,
  GRADE_BANDS,
  PACKAGES,
  buildQuote,
  formatUSD,
} from '@/data/programPricing';

// Schools do not buy a $6,500 program by entering a card. This wizard lets a
// principal configure exactly what they want, see a real itemized number, and
// send a complete request. No payment is taken here. Cody sends an invoice,
// against a purchase order for districts or directly for private schools.

const SCHOOL_TYPES = [
  { value: 'public_district', label: 'Public school district', route: 'po' },
  { value: 'charter', label: 'Charter or academy', route: 'po' },
  { value: 'private', label: 'Private school', route: 'invoice' },
  { value: 'faith_based', label: 'Faith-based school', route: 'invoice' },
  { value: 'other', label: 'Other', route: 'invoice' },
];

const TERMS = [
  'Fall 2026',
  'Winter 2027',
  'Spring 2027',
  'Fall 2027',
  'Flexible, whatever you have open',
];

const STEPS = ['Grade band', 'Program', 'School', 'Dates', 'Billing', 'Review'];

const emptyForm = {
  gradeBand: '',
  mode: 'custom',
  packageKey: '',
  items: {
    assembly: false,
    workshop_one: 0,
    workshop_two: 0,
    leadership: false,
    staff_pd: false,
    family_night: false,
  },
  school_name: '',
  school_type: '',
  district: '',
  enrollment: '',
  principal_name: '',
  contact_name: '',
  contact_role: '',
  email: '',
  phone: '',
  target_term: '',
  date_window_1: '',
  date_window_2: '',
  date_window_3: '',
  payment_route: '',
  po_number: '',
  billing_contact_name: '',
  billing_contact_email: '',
  needs_w9: false,
  message: '',
};

export default function BookingWizard() {
  const [ref, inView] = useInView(0.05);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [error, setError] = useState('');

  const set = (field) => (e) => {
    const value = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [field]: value }));
  };

  const setItem = (key, value) =>
    setForm((p) => ({ ...p, items: { ...p.items, [key]: value } }));

  const quote = useMemo(
    () => buildQuote({ gradeBand: form.gradeBand, mode: form.mode, packageKey: form.packageKey, items: form.items }),
    [form.gradeBand, form.mode, form.packageKey, form.items],
  );

  const band = form.gradeBand ? GRADE_BANDS[form.gradeBand] : null;
  const maxLevels = BAND_GRADE_LEVEL_MAX[form.gradeBand] || 6;

  // If someone builds a selection that a package already covers for less, say so
  // rather than letting them find out on the rate sheet after they have sent it.
  const betterPackage = useMemo(() => {
    if (form.mode !== 'custom') return null;
    const it = form.items;
    const w1 = Number(it.workshop_one) || 0;
    const w2 = Number(it.workshop_two) || 0;
    const coveredByFullYear =
      it.assembly && it.leadership && it.staff_pd && it.family_night &&
      w1 >= 1 && w1 <= 3 && w2 >= 1 && w2 <= 3;
    if (coveredByFullYear && quote.total > PACKAGES.full_year.price) return PACKAGES.full_year;
    return null;
  }, [form.mode, form.items, quote.total]);

  const canAdvance = () => {
    if (step === 0) return Boolean(form.gradeBand);
    if (step === 1) return quote.total > 0;
    if (step === 2) {
      return Boolean(form.school_name && form.school_type && form.contact_name && form.email);
    }
    if (step === 3) return Boolean(form.target_term);
    if (step === 4) return Boolean(form.payment_route);
    return true;
  };

  const goNext = () => {
    if (!canAdvance()) return;
    // Pre-fill the billing route from the school type the first time through.
    if (step === 2 && !form.payment_route) {
      const match = SCHOOL_TYPES.find((t) => t.value === form.school_type);
      if (match) setForm((p) => ({ ...p, payment_route: match.route }));
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setError('');
    setSubmitting(true);
    try {
      const reference = `OGW-B-${Date.now().toString(36).toUpperCase()}`;
      const record = await base44.entities.BookingRequest.create({
        school_name: form.school_name,
        contact_name: form.contact_name,
        email: form.email,
        phone: form.phone,
        preferred_date: form.date_window_1 || undefined,
        num_students: form.enrollment ? Number(form.enrollment) : undefined,
        message: form.message,
        status: 'new',
        reference,
        grade_band: form.gradeBand,
        school_type: form.school_type,
        district: form.district,
        principal_name: form.principal_name,
        contact_role: form.contact_role,
        package_type: form.mode === 'package' ? form.packageKey : 'custom',
        line_items: JSON.stringify(quote.lines),
        quoted_total: quote.total,
        target_term: form.target_term,
        date_window_1: form.date_window_1 || undefined,
        date_window_2: form.date_window_2 || undefined,
        date_window_3: form.date_window_3 || undefined,
        payment_route: form.payment_route,
        po_number: form.po_number,
        billing_contact_name: form.billing_contact_name,
        billing_contact_email: form.billing_contact_email,
        needs_w9: Boolean(form.needs_w9),
      });
      setSubmitted({ ...record, reference });
    } catch (err) {
      console.error('Booking request failed', err);
      setError(
        'We could not send that. Please try again, or email greggsdevelopment@gmail.com and we will pick it up from there.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-ink border border-white/[0.1] rounded-sm px-5 py-4 text-cream placeholder:text-cream/25 font-barlow focus:outline-none focus:border-gold/40 transition-colors';
  const labelClass =
    'block font-barlow-condensed text-ink/50 text-xs tracking-widest uppercase mb-2';

  if (submitted) {
    return (
      <section id="booking-form" className="relative bg-cream py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-gold-dark" />
            </div>
            <h3 className="font-anton text-ink text-4xl mb-2">REQUEST RECEIVED.</h3>
            <p className="font-barlow text-ink/60 text-base">
              We have your program selection and your dates.
            </p>
            <p className="font-barlow-condensed text-ink/40 text-xs tracking-widest uppercase mt-3">
              Reference: <span className="text-ink/70">{submitted.reference}</span>
            </p>
          </div>

          <div className="bg-white border border-ink/10 rounded-sm p-6 mb-6">
            <p className="font-barlow-condensed text-ink/40 text-xs tracking-widest uppercase mb-4">
              What you asked for
            </p>
            {quote.lines.map((line) => (
              <div key={line.key} className="flex justify-between items-start gap-4 py-2 border-b border-ink/5 last:border-0">
                <div>
                  <p className="font-barlow text-ink/80 text-sm">{line.name}</p>
                  {line.detail && <p className="font-barlow text-ink/40 text-xs">{line.detail}</p>}
                </div>
                <p className="font-barlow-condensed text-ink text-sm shrink-0">{formatUSD(line.amount)}</p>
              </div>
            ))}
            <div className="flex justify-between items-center pt-4 mt-2 border-t border-ink/10">
              <p className="font-barlow-condensed text-ink/50 text-xs tracking-widest uppercase">Estimated total</p>
              <p className="font-anton text-ink text-2xl">{formatUSD(quote.total)}</p>
            </div>
            <p className="font-barlow text-ink/40 text-xs mt-3">
              This is an estimate from the published rate sheet, not an invoice. Final pricing is confirmed on the call.
            </p>
          </div>

          <div className="bg-ink rounded-sm p-6 space-y-4 mb-6">
            <p className="font-barlow-condensed text-cream/50 text-xs tracking-widest uppercase mb-4">What happens next</p>
            {[
              'We review your selection and check dates against your windows.',
              'We reach out to set up a 20 minute call about what you are seeing in your building.',
              form.payment_route === 'po'
                ? 'You get a one-page plan, a formal quote and a W-9 so your business office can cut a purchase order.'
                : 'You get a one-page plan and an invoice you can pay by card or bank transfer.',
            ].map((text, i) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-barlow-condensed text-gold text-xs font-bold">{i + 1}</span>
                </div>
                <p className="font-barlow text-cream/60 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href="mailto:greggsdevelopment@gmail.com" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-ink/15 hover:border-gold-dark/40 rounded-sm text-ink/50 hover:text-gold-dark font-barlow-condensed text-xs tracking-wider uppercase transition-all">
              <Mail className="w-3.5 h-3.5" /> greggsdevelopment@gmail.com
            </a>
            <a href="tel:7343833865" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-ink/15 hover:border-gold-dark/40 rounded-sm text-ink/50 hover:text-gold-dark font-barlow-condensed text-xs tracking-wider uppercase transition-all">
              <Phone className="w-3.5 h-3.5" /> (734) 383-3865
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking-form" className="relative bg-cream py-24 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-anton text-ink text-4xl sm:text-5xl text-center mb-4"
        >
          BUILD YOUR PROGRAM
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow text-ink/50 text-center text-lg max-w-xl mx-auto mb-10"
        >
          Pick what fits your building and see the number as you go. Nothing is charged here and nothing is
          committed. You get a plan, a quote and dates.
        </motion.p>

        {/* Step rail */}
        <div className="flex items-center justify-between mb-10 gap-1">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-2">
              <div
                className={`w-full h-1 rounded-full transition-colors ${
                  i <= step ? 'bg-gold-dark' : 'bg-ink/10'
                }`}
              />
              <span
                className={`font-barlow-condensed text-[10px] sm:text-xs tracking-wider uppercase transition-colors ${
                  i === step ? 'text-ink' : 'text-ink/30'
                }`}
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
          >
            {/* Step 1: grade band */}
            {step === 0 && (
              <div className="space-y-3">
                <p className={labelClass}>Which building are we coming to?</p>
                {Object.values(GRADE_BANDS).map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, gradeBand: b.key }))}
                    className={`w-full text-left p-5 rounded-sm border transition-all ${
                      form.gradeBand === b.key
                        ? 'border-gold-dark bg-white shadow-sm'
                        : 'border-ink/10 bg-white/50 hover:border-ink/25'
                    }`}
                  >
                    <p className="font-anton text-ink text-xl tracking-wide">{b.label}</p>
                    <p className="font-barlow text-ink/50 text-sm">{b.grades}</p>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: program selection */}
            {step === 1 && band && (
              <div className="space-y-6">
                <div className="flex gap-2">
                  {[
                    { key: 'custom', label: 'Build it yourself' },
                    { key: 'package', label: 'Use a package' },
                  ].map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, mode: m.key }))}
                      className={`flex-1 py-3 rounded-sm border font-barlow-condensed text-sm uppercase tracking-wider transition-all ${
                        form.mode === m.key
                          ? 'border-gold-dark bg-white text-ink'
                          : 'border-ink/10 bg-white/40 text-ink/40 hover:text-ink/70'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {form.mode === 'package' ? (
                  <div className="space-y-3">
                    {Object.values(PACKAGES).map((pkg) => (
                      <button
                        key={pkg.key}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, packageKey: pkg.key }))}
                        className={`w-full text-left p-5 rounded-sm border transition-all ${
                          form.packageKey === pkg.key
                            ? 'border-gold-dark bg-white shadow-sm'
                            : 'border-ink/10 bg-white/50 hover:border-ink/25'
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-3 mb-1">
                          <p className="font-anton text-ink text-xl tracking-wide">{pkg.name}</p>
                          <p className="font-anton text-gold-dark text-xl">{formatUSD(pkg.price)}</p>
                        </div>
                        <p className="font-barlow text-ink/50 text-sm mb-3">{pkg.description}</p>
                        <ul className="space-y-1">
                          {pkg.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 font-barlow text-ink/60 text-xs">
                              <Check className="w-3 h-3 text-gold-dark shrink-0 mt-0.5" /> {f}
                            </li>
                          ))}
                        </ul>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {COMPONENT_ORDER.map((key) => {
                      const c = band.components[key];
                      if (!c) return null;

                      if (c.tiered) {
                        const levels = Number(form.items[key]) || 0;
                        return (
                          <div key={key} className="p-5 rounded-sm border border-ink/10 bg-white/50">
                            <div className="flex items-start justify-between gap-4 mb-1">
                              <div>
                                <p className="font-barlow font-semibold text-ink">{c.name}</p>
                                <p className="font-barlow text-ink/40 text-xs">{c.meta}</p>
                              </div>
                              <p className="font-barlow-condensed text-ink text-sm shrink-0">
                                {levels > 0 ? formatUSD(buildQuote({
                                  gradeBand: form.gradeBand,
                                  mode: 'custom',
                                  items: { [key]: levels },
                                }).total) : '-'}
                              </p>
                            </div>
                            {c.note && <p className="font-barlow text-ink/40 text-xs mb-3">{c.note}</p>}
                            <div className="flex items-center gap-3 mt-3">
                              <span className="font-barlow-condensed text-ink/40 text-xs tracking-wider uppercase">
                                Grade levels
                              </span>
                              <button
                                type="button"
                                onClick={() => setItem(key, Math.max(0, levels - 1))}
                                className="w-7 h-7 rounded-sm border border-ink/15 flex items-center justify-center text-ink/50 hover:text-ink hover:border-ink/40 transition-all"
                                aria-label={`Fewer grade levels for ${c.name}`}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="font-barlow-condensed text-ink w-6 text-center">{levels}</span>
                              <button
                                type="button"
                                onClick={() => setItem(key, Math.min(maxLevels, levels + 1))}
                                className="w-7 h-7 rounded-sm border border-ink/15 flex items-center justify-center text-ink/50 hover:text-ink hover:border-ink/40 transition-all"
                                aria-label={`More grade levels for ${c.name}`}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      }

                      const on = Boolean(form.items[key]);
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setItem(key, !on)}
                          className={`w-full text-left p-5 rounded-sm border transition-all flex items-start justify-between gap-4 ${
                            on ? 'border-gold-dark bg-white shadow-sm' : 'border-ink/10 bg-white/50 hover:border-ink/25'
                          }`}
                        >
                          <div>
                            <p className="font-barlow font-semibold text-ink">{c.name}</p>
                            <p className="font-barlow text-ink/40 text-xs">{c.meta}</p>
                          </div>
                          <p className="font-barlow-condensed text-ink text-sm shrink-0">{formatUSD(c.price)}</p>
                        </button>
                      );
                    })}

                    {betterPackage && (
                      <div className="p-5 rounded-sm border border-gold-dark/40 bg-gold/5">
                        <p className="font-barlow text-ink text-sm leading-relaxed mb-3">
                          Everything you have picked is included in the{' '}
                          <strong>{betterPackage.name} package</strong> for up to three grade levels, at{' '}
                          {formatUSD(betterPackage.price)}. That is{' '}
                          {formatUSD(quote.total - betterPackage.price)} less than building it this way.
                        </p>
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, mode: 'package', packageKey: betterPackage.key }))}
                          className="font-barlow-condensed text-xs uppercase tracking-wider px-4 py-2 bg-ink text-cream rounded-sm hover:bg-ink/90 transition-all"
                        >
                          Switch to the {betterPackage.name} package
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: school and contact */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>School name *</label>
                  <input value={form.school_name} onChange={set('school_name')} className={inputClass} placeholder="Your school name" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>School type *</label>
                    <select value={form.school_type} onChange={set('school_type')} className={`${inputClass} cursor-pointer`}>
                      <option value="" disabled>Select...</option>
                      {SCHOOL_TYPES.map((t) => (
                        <option key={t.value} value={t.value} className="bg-ink text-cream">{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>District</label>
                    <input value={form.district} onChange={set('district')} className={inputClass} placeholder="Your district" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Building enrollment</label>
                    <input type="number" min={1} value={form.enrollment} onChange={set('enrollment')} className={inputClass} placeholder="Number of students" />
                  </div>
                  <div>
                    <label className={labelClass}>Principal</label>
                    <input value={form.principal_name} onChange={set('principal_name')} className={inputClass} placeholder="Principal's name" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Your name *</label>
                    <input value={form.contact_name} onChange={set('contact_name')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Your role</label>
                    <input value={form.contact_role} onChange={set('contact_role')} className={inputClass} placeholder="Principal, counselor, dean" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" value={form.email} onChange={set('email')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="tel" value={form.phone} onChange={set('phone')} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: dates */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>When are you aiming for? *</label>
                  <select value={form.target_term} onChange={set('target_term')} className={`${inputClass} cursor-pointer`}>
                    <option value="" disabled>Select a term...</option>
                    {TERMS.map((t) => (
                      <option key={t} value={t} className="bg-ink text-cream">{t}</option>
                    ))}
                  </select>
                </div>
                <p className="font-barlow text-ink/50 text-sm">
                  Give us three dates that would work. One date almost never survives a school calendar, and three
                  means we can usually confirm on the first call instead of the third.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  {['date_window_1', 'date_window_2', 'date_window_3'].map((key, i) => (
                    <div key={key}>
                      <label className={labelClass}>{`Option ${i + 1}`}</label>
                      <input type="date" value={form[key]} onChange={set(key)} className={inputClass} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className={labelClass}>Anything we should know</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={set('message')}
                    className={`${inputClass} resize-none`}
                    placeholder="What are you seeing in your building? Which fund are you working from (Title I, Section 31a, general)?"
                  />
                </div>
              </div>
            )}

            {/* Step 5: billing */}
            {step === 4 && (
              <div className="space-y-4">
                <p className={labelClass}>How does your school pay? *</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { value: 'po', title: 'Purchase order', body: 'Your business office issues a PO and we invoice against it. Standard for districts.' },
                    { value: 'invoice', title: 'Direct invoice', body: 'We send an invoice you pay by card or bank transfer. No PO needed.' },
                  ].map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, payment_route: o.value }))}
                      className={`text-left p-5 rounded-sm border transition-all ${
                        form.payment_route === o.value
                          ? 'border-gold-dark bg-white shadow-sm'
                          : 'border-ink/10 bg-white/50 hover:border-ink/25'
                      }`}
                    >
                      <p className="font-barlow font-semibold text-ink mb-1">{o.title}</p>
                      <p className="font-barlow text-ink/50 text-xs leading-relaxed">{o.body}</p>
                    </button>
                  ))}
                </div>

                {form.payment_route === 'po' && (
                  <div>
                    <label className={labelClass}>PO number, if you already have one</label>
                    <input value={form.po_number} onChange={set('po_number')} className={inputClass} placeholder="Leave blank if not issued yet" />
                  </div>
                )}

                {form.payment_route && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>
                          {form.payment_route === 'po' ? 'Business office contact' : 'Billing contact'}
                        </label>
                        <input value={form.billing_contact_name} onChange={set('billing_contact_name')} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Billing email</label>
                        <input type="email" value={form.billing_contact_email} onChange={set('billing_contact_email')} className={inputClass} />
                      </div>
                    </div>
                    <label className="flex items-center gap-3 p-4 rounded-sm border border-ink/10 bg-white/50 cursor-pointer">
                      <input type="checkbox" checked={form.needs_w9} onChange={set('needs_w9')} className="w-4 h-4 accent-gold-dark" />
                      <span className="font-barlow text-ink/70 text-sm">
                        Send a W-9 with the quote. Most districts need one before they can set us up as a vendor.
                      </span>
                    </label>
                  </>
                )}
              </div>
            )}

            {/* Step 6: review */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="bg-white border border-ink/10 rounded-sm p-6">
                  <p className="font-barlow-condensed text-ink/40 text-xs tracking-widest uppercase mb-4">Your program</p>
                  {quote.lines.map((line) => (
                    <div key={line.key} className="flex justify-between items-start gap-4 py-2 border-b border-ink/5 last:border-0">
                      <div>
                        <p className="font-barlow text-ink/80 text-sm">{line.name}</p>
                        {line.detail && <p className="font-barlow text-ink/40 text-xs">{line.detail}</p>}
                      </div>
                      <p className="font-barlow-condensed text-ink text-sm shrink-0">{formatUSD(line.amount)}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 mt-2 border-t border-ink/10">
                    <p className="font-barlow-condensed text-ink/50 text-xs tracking-widest uppercase">Estimated total</p>
                    <p className="font-anton text-ink text-3xl">{formatUSD(quote.total)}</p>
                  </div>
                  <p className="font-barlow text-ink/40 text-xs mt-3">
                    An estimate from the published rate sheet, not an invoice. Nothing is charged and nothing is
                    committed until you have a quote in writing.
                  </p>
                </div>

                <div className="bg-white/60 border border-ink/10 rounded-sm p-6 grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  {[
                    ['School', form.school_name],
                    ['Grade band', band ? `${band.label}, ${band.grades}` : ''],
                    ['Contact', form.contact_name],
                    ['Email', form.email],
                    ['Target term', form.target_term],
                    ['Billing', form.payment_route === 'po' ? 'Purchase order' : 'Direct invoice'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3 py-1 border-b border-ink/5">
                      <span className="font-barlow-condensed text-ink/40 text-xs tracking-wider uppercase">{k}</span>
                      <span className="font-barlow text-ink/70 text-sm text-right">{v || '-'}</span>
                    </div>
                  ))}
                </div>

                {error && <p className="font-barlow text-red-600 text-sm">{error}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Running total + nav */}
        <div className="mt-8 pt-6 border-t border-ink/10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-3 font-barlow-condensed text-sm uppercase tracking-wider text-ink/40 hover:text-ink disabled:opacity-0 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {quote.total > 0 && step < 5 && (
            <div className="text-right">
              <p className="font-barlow-condensed text-ink/40 text-[10px] tracking-widest uppercase">Running total</p>
              <p className="font-anton text-ink text-xl leading-tight">{formatUSD(quote.total)}</p>
            </div>
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance()}
              className="flex items-center gap-2 px-7 py-4 bg-ink hover:bg-ink/90 disabled:opacity-30 text-cream font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-7 py-4 bg-ink hover:bg-ink/90 disabled:opacity-50 text-cream font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all"
            >
              {submitting ? 'Sending...' : 'Send Request'}
            </button>
          )}
        </div>

        <div className="mt-10 pt-8 border-t border-ink/10 text-center">
          <p className="font-barlow-condensed text-ink/40 text-xs tracking-widest uppercase mb-3">Prefer to talk first?</p>
          <p className="font-barlow text-ink/70 text-base">
            <span className="font-semibold text-ink">Cody Greggs-Dorsey</span>
            <span className="mx-2 text-ink/30">|</span>
            <a href="tel:7343833865" className="hover:text-gold-dark transition-colors">(734) 383-3865</a>
            <span className="mx-2 text-ink/30">|</span>
            <a href="mailto:greggsdevelopment@gmail.com" className="hover:text-gold-dark transition-colors">greggsdevelopment@gmail.com</a>
          </p>
        </div>
      </div>
    </section>
  );
}