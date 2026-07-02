// Raffle section component
import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

export default function RaffleSection() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_contact: 'email',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await base44.entities.RaffleEntry.create({
        ...form,
        status: 'pending',
        ticket_number: null,
        amount: 5,
        created_date: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <section id="raffle" className="py-20 bg-ink relative overflow-hidden">
      <div className="grain-overlay absolute inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 rounded-full border border-gold text-gold text-xs tracking-widest uppercase mb-4">
            Raffle
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            Enter the Raffle
          </h2>
          <p className="text-cream/70 max-w-xl mx-auto text-lg">
            Purchase a raffle ticket for <span className="text-gold font-semibold">$5</span> and support One Good Word One Good Deed.
            Once payment is confirmed, your unique 4-digit ticket number will be sent to you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          {submitted ? (
            <div className="bg-gold/10 border border-gold/30 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-gold mb-3">You're Almost In!</h3>
              <p className="text-cream/80 mb-4">
                Thank you for entering! To complete your entry, please submit your $5 payment via the link below.
              </p>
              <p className="text-cream/70 text-sm mb-6">
                Once your payment is marked as received, {form.preferred_contact === 'email' ? 'an email' : 'a text message'} will be sent to you with your unique 4-digit ticket number. Good luck!
              </p>
              <a
                href="https://www.gofundme.com/f/support-one-good-word-one-good-deeds-mission"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gold text-ink font-bold px-8 py-3 rounded-full hover:bg-gold/90 transition-colors mb-4"
              >
                Pay $5 via PayPal →
              </a>
              <p className="text-cream/50 text-xs">
                In the payment notes, include your name and "Raffle Ticket"
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-ink/80 border border-gold/20 rounded-2xl p-8 backdrop-blur-sm"
            >
              <h3 className="text-xl font-bold text-gold mb-6 text-center">Your Details</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-cream/70 text-sm mb-1" htmlFor="name">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full bg-ink/60 border border-gold/20 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-cream/70 text-sm mb-1" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-ink/60 border border-gold/20 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-cream/70 text-sm mb-1" htmlFor="phone">
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(555) 000-0000"
                    className="w-full bg-ink/60 border border-gold/20 rounded-lg px-4 py-3 text-cream placeholder-cream/30 focus:outline-none focus:border-gold/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-cream/70 text-sm mb-2">
                    Preferred Contact Method *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preferred_contact"
                        value="email"
                        checked={form.preferred_contact === 'email'}
                        onChange={handleChange}
                        className="accent-gold"
                      />
                      <span className="text-cream/80">Email</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="preferred_contact"
                        value="text"
                        checked={form.preferred_contact === 'text'}
                        onChange={handleChange}
                        className="accent-gold"
                      />
                      <span className="text-cream/80">Text / SMS</span>
                    </label>
                  </div>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
              )}

              <div className="mt-6 p-4 bg-gold/5 border border-gold/20 rounded-lg">
                <p className="text-cream/70 text-sm text-center">
                  🎟️ <span className="text-gold font-semibold">$5 per ticket</span> — payment link provided after submission
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-gold text-ink font-bold py-3 rounded-full hover:bg-gold/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Enter Raffle →'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}