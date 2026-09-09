import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: "What is One Good Word...One Good Deed?",
    a: "One Good Word...One Good Deed is a motivational movement founded by Jason, dedicated to stopping bullying and racism through the power of kindness, positive words, and God's love. We visit schools, host community events, and sell merchandise to spread the message.",
  },
  {
    q: "How do we book Jason for a school visit?",
    a: "Simply head to our Programs page and fill out the booking request form with your school name, contact info, and preferred date. Jason or a team member will follow up within 48 hours to confirm details and discuss pricing.",
  },
  {
    q: "Do you ship merchandise nationwide?",
    a: "Yes! We ship t-shirts, hoodies, wool coats, and wristbands across the United States. Orders are typically processed within 3–5 business days and shipping times vary by location.",
  },
  {
    q: "Can we order bulk wristbands for our school?",
    a: "Absolutely. Bulk orders are available and we offer school discounts for orders of 50+ wristbands. Reach out via our Contact section or email us directly at greggsdevelopment@gmail.com to discuss bulk pricing.",
  },
  {
    q: "How does our purchase help the cause?",
    a: "Every purchase directly funds school visits, outreach programs, and community events. When you buy a shirt or donate, you're helping Jason bring the One Good Word message to more students who need to hear it.",
  },
  {
    q: "Is One Good Word...One Good Deed faith-based?",
    a: "Yes — the movement is rooted in God's love as the foundation for treating others with kindness and dignity. Jason's message is uplifting and inclusive, meeting students exactly where they are regardless of background.",
  },
];

function FAQItem({ item, index, inView }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.07 }}
      className="border-b border-ink/10"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="font-barlow-condensed font-bold text-ink text-lg uppercase tracking-wide">{item.q}</span>
        <span className="shrink-0 w-7 h-7 rounded-full border-2 border-ink/20 flex items-center justify-center">
          {open ? <Minus className="w-3.5 h-3.5 text-ink/60" /> : <Plus className="w-3.5 h-3.5 text-ink/60" />}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="font-barlow text-ink/60 text-base leading-relaxed pb-5">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="relative bg-cream py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="w-16 h-1 bg-gold mb-10 mx-auto origin-center"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-barlow-condensed text-gold-dark text-xs tracking-[0.35em] uppercase mb-3"
          >
            Frequently Asked Questions
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-anton text-ink text-5xl sm:text-6xl leading-[0.92]"
          >
            GOT QUESTIONS?<br /><span className="text-gold-dark">WE GOT ANSWERS.</span>
          </motion.h2>
        </div>

        <div>
          {FAQS.map((item, i) => (
            <FAQItem key={i} item={item} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}