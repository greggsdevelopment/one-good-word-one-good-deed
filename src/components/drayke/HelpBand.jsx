import { motion } from 'framer-motion';
import { Phone, MessageSquare, ShieldCheck, ExternalLink } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };
const SCRIPT = { fontFamily: "'Great Vibes', cursive" };

const LINES = [
  {
    icon: Phone,
    name: '988 Suicide & Crisis Lifeline',
    how: 'Call or text 988',
    note: 'Free, confidential, 24/7, for anyone struggling or worried about someone.',
    href: 'tel:988',
  },
  {
    icon: MessageSquare,
    name: 'Crisis Text Line',
    how: 'Text HOME to 741741',
    note: 'Text with a trained crisis counselor, any hour, any day.',
    href: 'sms:741741',
  },
  {
    icon: ShieldCheck,
    name: 'OK2SAY (Michigan Students)',
    how: 'Call 855-565-2729 or text 652729',
    note: 'Confidentially report bullying or threats against any Michigan student, 24/7.',
    href: 'https://www.michigan.gov/ok2say',
    external: true,
  },
];

export default function HelpBand() {
  const [ref, inView] = useInView(0.15);

  return (
    <section className="relative bg-ink py-24 md:py-28 px-6 border-t border-gold/10" ref={ref}>
      <div className="max-w-4xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-gold text-4xl md:text-5xl mb-4"
          style={SCRIPT}
        >
          You are not alone
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-cream/85 text-lg md:text-xl max-w-2xl mx-auto mb-12"
          style={SERIF}
        >
          If you are being bullied, if the weight feels too heavy, or if you are worried about
          someone you love, please reach out right now. Telling someone is not weakness. It is
          the bravest good deed there is.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-5 text-left mb-14">
          {LINES.map((line, i) => (
            <motion.a
              key={line.name}
              href={line.href}
              {...(line.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
              className="block bg-black/40 border border-gold/25 hover:border-gold/60 rounded-sm p-6 transition-colors"
            >
              <line.icon className="text-gold mb-4" size={26} strokeWidth={1.5} />
              <p className="font-barlow-condensed text-white font-semibold text-lg leading-tight mb-1">
                {line.name}
              </p>
              <p className="text-gold font-barlow font-bold mb-2">{line.how}</p>
              <p className="font-barlow text-cream/60 text-sm leading-relaxed">{line.note}</p>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="border-t border-gold/15 pt-10 space-y-4"
        >
          <p className="text-cream/60 text-base md:text-lg italic" style={SERIF}>
            Drayke&rsquo;s story and these photographs are shared with the loving permission of
            his mother. Our hearts remain with the Hardman family, today and always.
          </p>
          <a
            href="https://kutv.com/news/education/a-year-of-bullying-a-child-lost-utah-schools-still-struggle-to-stop-the-cycle"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-cream/40 hover:text-gold text-sm font-barlow transition-colors"
          >
            Read the 2News (KUTV) investigation into Drayke&rsquo;s story
            <ExternalLink size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}