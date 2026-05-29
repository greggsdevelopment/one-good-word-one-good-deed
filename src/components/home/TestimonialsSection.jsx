import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "Jason's presentation left our entire student body in tears — in the best possible way. The conversations that followed were unlike anything we'd seen in 20 years of school assemblies.",
    name: "Ms. Patricia Williams",
    role: "Principal, Lincoln Middle School",
    location: "Detroit, MI",
  },
  {
    quote: "Our students still quote One Good Word three months later. Jason has a rare gift for connecting with young people on a deeply personal level. We're booking him again for next year.",
    name: "Mr. David Okafor",
    role: "Dean of Students, Westview High School",
    location: "Pontiac, MI",
  },
  {
    quote: "The bullying incidents on our campus dropped noticeably after Jason's visit. His message isn't just inspiring — it creates lasting behavioral change. Every school needs this program.",
    name: "Mrs. Angela Torres",
    role: "Counselor, Jefferson Elementary",
    location: "Flint, MI",
  },
];

export default function TestimonialsSection() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="relative bg-cream py-24 md:py-32 px-6 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: 'repeat', backgroundSize: '256px 256px' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
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
            What Schools Are Saying
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-anton text-ink text-5xl sm:text-6xl leading-[0.92]"
          >
            REAL IMPACT.<br /><span className="text-gold-dark">REAL VOICES.</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              className="bg-white rounded-sm p-8 shadow-sm border border-ink/5 flex flex-col gap-5"
            >
              <Quote className="w-8 h-8 text-gold shrink-0" />
              <p className="font-barlow text-ink/70 text-base leading-relaxed flex-1">"{t.quote}"</p>
              <div>
                <p className="font-barlow-condensed font-bold text-ink text-base uppercase tracking-wide">{t.name}</p>
                <p className="font-barlow text-ink/50 text-sm">{t.role}</p>
                <p className="font-barlow text-gold-dark text-sm">{t.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}