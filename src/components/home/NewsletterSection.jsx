import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useInView } from '@/hooks/useInView';
import { CheckCircle } from 'lucide-react';

export default function NewsletterSection() {
  const [ref, inView] = useInView(0.15);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    await base44.entities.NewsletterSubscriber.create({ email });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section className="relative bg-gold py-20 px-6 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '256px 256px' }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="font-anton text-ink text-4xl sm:text-5xl leading-[0.92] mb-4"
        >
          JOIN THE MOVEMENT
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-barlow text-ink/70 text-lg mb-10"
        >
          Get updates, stories, and ways to make a difference — delivered to your inbox.
        </motion.p>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-4 bg-ink text-cream placeholder:text-cream/30 font-barlow rounded-sm focus:outline-none focus:ring-2 focus:ring-ink/40"
              />
              <button
                type="submit"
                disabled={submitting}
                className="px-7 py-4 bg-ink hover:bg-ink/80 disabled:opacity-50 text-cream font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 text-ink"
            >
              <div className="flex items-center gap-2 font-barlow text-lg font-semibold">
                <CheckCircle className="w-6 h-6" />
                <span>Thanks for subscribing! Check your email.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}