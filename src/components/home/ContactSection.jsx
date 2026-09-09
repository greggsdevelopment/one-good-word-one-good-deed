import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { useInView } from '@/hooks/useInView';
import { CheckCircle } from 'lucide-react';

export default function ContactSection() {
  const [ref, inView] = useInView(0.15);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.ContactMessage.create(formData);
    setSubmitting(false);
    setSubmitted(true);
  };

  const inputClass = "w-full bg-white border border-ink/10 rounded-sm px-5 py-4 text-ink placeholder:text-ink/30 font-barlow focus:outline-none focus:border-gold-dark/50 transition-colors";

  return (
    <section id="contact" className="relative bg-cream py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-1 bg-gold mb-10 mx-auto origin-center"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-barlow-condensed text-gold-dark text-xs tracking-[0.3em] uppercase mb-4 text-center"
        >
          Contact
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-anton text-ink text-4xl sm:text-5xl text-center mb-6 leading-[0.95]"
        >
          LET'S CONNECT.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-barlow text-ink/60 text-lg text-center mb-12 max-w-xl mx-auto"
        >
          Want to bring One Good Word...One Good Deed to your school, church, or community? Reach out.
        </motion.p>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="contactForm"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="Your email *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className={inputClass}
                />
              </div>
              <input
                type="text"
                placeholder="Subject *"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className={inputClass}
              />
              <textarea
                placeholder="Your message *"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className={`${inputClass} resize-none`}
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-ink hover:bg-ink/90 disabled:opacity-50 text-cream font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="contactConfirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-gold-dark mx-auto mb-4" />
              <h3 className="font-anton text-ink text-3xl mb-2">MESSAGE SENT.</h3>
              <p className="font-barlow text-ink/60 text-lg mb-6">Thank you! We'll be in touch with you shortly.</p>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                className="px-6 py-3 border border-ink/20 hover:border-gold-dark/50 text-ink/50 hover:text-gold-dark font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-all"
              >
                Send Another Message
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 text-center space-y-2">
          <p className="font-barlow text-ink/40 text-sm">
            Phone: <a href="tel:2488089373" className="text-gold-dark hover:text-gold transition-colors">(248) 808-9373</a>
          </p>
          <p className="font-barlow text-ink/40 text-sm">
            Email: <a href="mailto:greggsdevelopment@gmail.com" className="text-gold-dark hover:text-gold transition-colors">greggsdevelopment@gmail.com</a>
          </p>
          <p className="font-barlow text-ink/40 text-sm">
            Facebook: <a href="https://www.facebook.com/groups/1332878885346719" target="_blank" rel="noopener noreferrer" className="text-gold-dark hover:text-gold transition-colors">Join our community</a>
          </p>
        </div>
      </div>
    </section>
  );
}