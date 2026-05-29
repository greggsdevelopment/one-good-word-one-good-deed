import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      "Jason's assembly was the most impactful we've had in 10 years of doing these programs. Students were in tears — in the best way. They were hugging each other before he finished. We booked him back immediately.",
    name: 'Principal Michelle Davis',
    school: 'Wayne-Westland Community Schools',
    role: 'Elementary Principal',
  },
  {
    quote:
      "We had a bullying problem we couldn't solve. After Jason's visit, three students came forward the same week to report incidents they'd been afraid to report before. One visit changed the culture of our school.",
    name: 'Mr. Anthony Brooks',
    school: 'Detroit Public Schools',
    role: 'School Counselor',
  },
  {
    quote:
      "My students are still talking about him two months later. Jason speaks their language. He doesn't lecture — he connects. Every middle school in America needs to hear this message.",
    name: 'Ms. Tamara Jenkins',
    school: 'Lincoln Middle School',
    role: '7th Grade Teacher',
  },
  {
    quote:
      "We used Jason's full-day program including the leadership workshop for our student council. Those students left with a real sense of mission. We saw them actively standing up against bullying within days.",
    name: 'Dr. Kevin Stewart',
    school: 'Westland High School',
    role: 'Assistant Superintendent',
  },
];

export default function Testimonials() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-gold/4 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="w-16 h-1 bg-gold mb-10 mx-auto origin-center"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4"
          >
            What Schools Say
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-anton text-cream text-5xl sm:text-6xl leading-[0.92]"
          >
            RESULTS THAT<br />
            <span className="text-gold">SPEAK FOR THEMSELVES.</span>
          </motion.h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-sm p-8 hover:border-gold/20 transition-all"
            >
              <Quote className="w-8 h-8 text-gold/30 mb-6" />
              <p className="font-barlow text-cream/75 text-base leading-relaxed mb-8 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-white/[0.07]">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <span className="font-anton text-gold text-lg">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-barlow-condensed font-bold text-cream text-sm tracking-wide">{t.name}</p>
                  <p className="font-barlow text-cream/40 text-xs">{t.role} · {t.school}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}