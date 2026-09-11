import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const FAQS = [
  {
    q: 'What grades is this built for?',
    a: 'Kindergarten through twelfth grade. The five steps are the same in every building, but the material is rebuilt for each band: elementary gets a 30 minute assembly with no graphic detail and a playground-level skills lab, middle school gets the version built around social rank and group chats, and high school gets the unedited story plus the adult consequences. The assembly runs for the whole building; the labs run one grade level at a time so the examples fit the room. Flat rates cover buildings up to 900 students. K-8 buildings run both versions on the same visit.'
  },
  {
    q: 'Is this appropriate for public school instructional time?',
    a: 'Yes. This is a secular program. It contains no religious content, and it is designed to run during the school day in a public building. Any student-submitted material used in the Group Chat Check is anonymized, name-scrubbed, and reviewed with your staff in advance.',
  },
  {
    q: 'Do we have to buy the whole program?',
    a: 'No. Schools can start with the assembly alone and add steps later. Most buildings run steps one through three in the fall and carry steps four and five through spring. We will tell you plainly, though, that a single assembly does not change behavior on its own. The Starter and Full Year packages exist because sustained, multi-level work is what the research supports.',
  },
  {
    q: 'What do students walk away with?',
    a: 'Four rehearsed things to say or do when they see it happen, a clear line between reporting and "snitching," language for naming racist behavior without escalating it, a wristband, and a signed pledge. Every student who signs adds their name to a wall in your building and to the public pledge wall at ogwogd.org.',
  },
  {
    q: 'How do you measure whether it worked?',
    a: 'Students complete a short anonymous survey before the assembly and again 60 days later: how often they see it, how safe they feel in hallways and on the bus, and whether they believe stepping in works. You receive a plain-language summary you can put in front of your board. Every option includes the survey and the report.',
  },
  {
    q: 'How do schools pay for this?',
    a: 'Bullying prevention programming, staff training, and family engagement events are commonly funded through Title I and Section 31a at-risk dollars rather than a building\'s general budget. Tell us which fund you are working from and we will format the invoice to match. If budget is the obstacle, ask about sponsor underwriting. We are backed by local businesses across the region and have covered buildings that way before.',
  },
  {
    q: 'Do you charge for travel?',
    a: 'No. Every rate is quoted flat, with no travel or setup charges anywhere in metro Detroit. For buildings outside the region, ask and we will quote it straight.',
  },
  {
    q: 'What does the school need to provide?',
    a: 'Space and a sound system, a staff contact, staff supervision during all sessions, advance review of any student-submitted material, and five minutes at the start to distribute the survey.',
  },
  {
    q: 'How far in advance should we book?',
    a: 'Dates fill first for September, October, and May, so reach out early for those months. A signed agreement and a purchase order hold your date. Send us your enrollment, grade span, and what you are seeing in your building, and we will send back a one-page plan and two available dates.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState(null);
  const [ref, inView] = useInView({ threshold: 0.05 });

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
              transition={{ duration: 0.4, delay: i * 0.05 }}
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