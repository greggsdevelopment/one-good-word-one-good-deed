import { motion } from 'framer-motion';
import { Phone, MessageSquare, Globe } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const HOTLINES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    description: 'Free, confidential support for people in distress. Call or text 988 anytime.',
    call: '988',
    text: '988',
    available: '24/7',
    color: 'border-red-500/40 bg-red-950/20',
    badge: 'bg-red-500/20 text-red-300',
  },
  {
    name: 'Crisis Text Line',
    description: 'Text HOME to 741741 to connect with a trained crisis counselor.',
    text: '741741',
    textKeyword: 'HOME',
    available: '24/7',
    color: 'border-blue-500/40 bg-blue-950/20',
    badge: 'bg-blue-500/20 text-blue-300',
  },
  {
    name: 'Trevor Project (LGBTQ+)',
    description: 'Crisis intervention for LGBTQ+ young people under 25.',
    call: '1-866-488-7386',
    text: '678-678',
    textKeyword: 'START',
    website: 'https://www.thetrevorproject.org',
    available: '24/7',
    color: 'border-purple-500/40 bg-purple-950/20',
    badge: 'bg-purple-500/20 text-purple-300',
  },
  {
    name: 'SAMHSA National Helpline',
    description: 'Free treatment referrals for mental health and substance use disorders.',
    call: '1-800-662-4357',
    website: 'https://www.samhsa.gov/find-help/national-helpline',
    available: '24/7',
    color: 'border-green-500/40 bg-green-950/20',
    badge: 'bg-green-500/20 text-green-300',
  },
  {
    name: 'Bullying Prevention Hotline',
    description: 'Get support and guidance if you are being bullied or know someone who is.',
    call: '1-800-422-4453',
    website: 'https://www.stopbullying.gov',
    available: 'Mon–Fri 8am–8pm',
    color: 'border-gold/30 bg-gold/5',
    badge: 'bg-gold/20 text-gold',
  },
  {
    name: 'National Domestic Violence Hotline',
    description: 'Safe, confidential support for teens experiencing relationship abuse.',
    call: '1-800-799-7233',
    text: '88788',
    textKeyword: 'START',
    website: 'https://www.thehotline.org',
    available: '24/7',
    color: 'border-pink-500/40 bg-pink-950/20',
    badge: 'bg-pink-500/20 text-pink-300',
  },
];

// Map hotline names to filter categories
const HOTLINE_CATEGORY_MAP = {
  '988 Suicide & Crisis Lifeline': 'Crisis',
  'Crisis Text Line': 'Crisis',
  'Trevor Project (LGBTQ+)': 'Crisis',
  'SAMHSA National Helpline': 'Substance Abuse',
  'Bullying Prevention Hotline': 'Anti-Bullying',
  'National Domestic Violence Hotline': 'Crisis',
};

export default function CrisisHotlines({ search = '', activeCategory = 'All' }) {
  const [ref, inView] = useInView({ threshold: 0.1 });

  const filtered = HOTLINES.filter(line => {
    const matchesSearch = !search.trim() ||
      line.name.toLowerCase().includes(search.toLowerCase()) ||
      line.description.toLowerCase().includes(search.toLowerCase());
    const cat = HOTLINE_CATEGORY_MAP[line.name] || 'Crisis';
    const matchesCategory = activeCategory === 'All' || cat === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section ref={ref} className="py-20 px-6 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-2">Immediate Help</p>
          <h2 className="font-anton text-cream text-4xl sm:text-5xl tracking-wide">CRISIS HOTLINES</h2>
          <p className="font-barlow text-cream/40 mt-3 max-w-xl">
            These lines are free, confidential, and available whenever you need them most.
          </p>
        </motion.div>

        {filtered.length === 0 ? (
          <p className="font-barlow text-cream/30 text-sm py-8">No hotlines match your search.</p>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((line, i) => (
            <motion.div
              key={line.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`rounded-sm border p-6 flex flex-col gap-4 ${line.color}`}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-barlow-condensed text-cream font-bold text-lg leading-tight">{line.name}</h3>
                <span className={`shrink-0 text-xs font-barlow-condensed px-2 py-1 rounded-full tracking-wide ${line.badge}`}>
                  {line.available}
                </span>
              </div>

              <p className="font-barlow text-cream/50 text-sm leading-relaxed flex-1">{line.description}</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {line.call && (
                  <a
                    href={`tel:${line.call.replace(/\D/g, '')}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cream/10 hover:bg-cream/20 border border-cream/20 rounded-sm text-cream font-barlow-condensed text-sm uppercase tracking-wider transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call {line.call}
                  </a>
                )}
                {line.text && (
                  <a
                    href={`sms:${line.text}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cream/10 hover:bg-cream/20 border border-cream/20 rounded-sm text-cream font-barlow-condensed text-sm uppercase tracking-wider transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Text {line.textKeyword || line.text}
                  </a>
                )}
                {line.website && (
                  <a
                    href={line.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-cream/10 hover:bg-cream/20 border border-cream/20 rounded-sm text-cream font-barlow-condensed text-sm uppercase tracking-wider transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Website
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}