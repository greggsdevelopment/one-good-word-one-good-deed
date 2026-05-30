import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const FAQS = [
  {
    q: 'What grades does Jason speak to?',
    a: 'Jason speaks to students in grades 3–12. His messaging is adapted for each age group — elementary presentations focus on kindness and inclusion, while middle and high school sessions go deeper into racism, bullying, identity, and resilience.',
  },
  {
    q: 'How far does Jason travel?',
    a: 'Jason is based in Troy, MI and regularly visits schools throughout Southeast Michigan, including Oakland, Wayne, Macomb, and Washtenaw counties. Travel outside of Michigan is available for select engagements — contact us to discuss.',
  },
  {
    q: 'What topics does he cover?',
    a: 'Jason covers anti-bullying, anti-racism, empathy, the power of words, God\'s love, forgiveness, peer leadership, and personal accountability — all rooted in real-life stories and interactive discussion.',
  },
  {
    q: 'How far in advance should we book?',
    a: 'We recommend booking at least 4–6 weeks in advance to secure your preferred date. For the Full Partnership Package or end-of-year assemblies, 8–10 weeks advance notice is ideal.',
  },
  {
    q: 'Is there a fee waiver for Title I schools?',
    a: 'Yes! Jason is passionate about reaching every student, regardless of budget. Title I schools and under-resourced districts are encouraged to reach out — partial and full fee waivers are available based on need.',
  },
  {
    q: 'What do students receive after the program?',
    a: 'All students receive a digital resource pack including reflection prompts, the One Good Word pledge card, and links to follow-up materials. Full Partnership and Half-Day Workshop programs also include teacher guides and classroom activity sheets.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);
  const [ref, inView] = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 px-6 bg-ink">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-3">Got Questions?</p>
          <h2 className="font-anton text-cream text-4xl sm:text-5xl tracking-wide">FREQUENTLY ASKED</h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="border border-cream/10 rounded-sm overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left bg-white/[0.02] hover:bg-white/[0.04] transition-colors gap-4"
              >
                <span className="font-barlow-condensed text-cream text-base tracking-wide">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gold shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 py-5 font-barlow text-cream/50 text-sm leading-relaxed border-t border-cream/[0.06]">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}