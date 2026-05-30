import { motion } from 'framer-motion';
import { MapPin, Search, ExternalLink, Phone } from 'lucide-react';
import { useState } from 'react';
import { useInView } from '@/hooks/useInView';

const FINDER_TOOLS = [
  {
    name: 'Find a Therapist Near You',
    description: 'Psychology Today\'s therapist finder — search by zip code, insurance, and specialty.',
    url: 'https://www.psychologytoday.com/us/therapists/teens',
    category: 'Mental Health',
  },
  {
    name: 'SAMHSA Treatment Locator',
    description: 'Find local substance use and mental health treatment facilities.',
    url: 'https://findtreatment.gov',
    category: 'Treatment',
  },
  {
    name: 'Youth Shelter Finder',
    description: '1800Runaway.org — find a safe shelter or crisis center near you.',
    url: 'https://www.1800runaway.org/find-help/local-resources/',
    category: 'Housing & Safety',
  },
  {
    name: 'Food Bank Locator',
    description: 'Feeding America — find free food and pantries in your community.',
    url: 'https://www.feedingamerica.org/find-your-local-foodbank',
    category: 'Food & Basic Needs',
  },
  {
    name: '211 Community Services',
    description: 'Dial 2-1-1 or visit 211.org to find local health & human services.',
    url: 'https://www.211.org',
    category: 'All Services',
  },
  {
    name: 'School Counselor Locator',
    description: 'ASCA school counselor finder to locate support within your school district.',
    url: 'https://www.schoolcounselor.org',
    category: 'School Support',
  },
];

const MICHIGAN_RESOURCES = [
  {
    name: 'YMCA of Metropolitan Detroit',
    description: 'Teen fitness, swim, college prep & after-school programs.',
    url: 'https://ymcadetroit.org',
    phone: '3132675300',
    phoneDisplay: '(313) 267-5300',
    category: 'After-School',
    location: 'Detroit, MI',
  },
  {
    name: 'Lighthouse MI',
    description: 'Counseling, crisis services & youth programs for Oakland County.',
    url: 'https://lighthousemi.org',
    phone: '2489200430',
    phoneDisplay: '(248) 920-0430',
    category: 'Mental Health',
    location: 'Pontiac, MI',
  },
  {
    name: 'Detroit Wayne Mental Health Authority',
    description: 'Behavioral health & crisis services for Wayne County teens.',
    url: 'https://dwmha.com',
    phone: '18002414949',
    phoneDisplay: '1-800-241-4949',
    category: 'Mental Health',
    location: 'Detroit, MI',
  },
  {
    name: 'Common Ground Crisis Center',
    description: 'Oakland County 24/7 mental health crisis support & counseling.',
    url: 'https://commongroundhelps.org',
    phone: '18002311127',
    phoneDisplay: '1-800-231-1127',
    category: 'Crisis',
    location: 'Pontiac, MI',
  },
  {
    name: 'Boys & Girls Club of Troy',
    description: 'Safe after-school programs, sports, arts & homework help for ages 6–18.',
    url: 'https://bgcdetroit.org',
    phone: '2486890400',
    phoneDisplay: '(248) 689-0400',
    category: 'After-School',
    location: 'Troy, MI',
  },
];

const CATEGORY_COLORS = {
  'Mental Health': 'bg-blue-500/20 text-blue-300',
  'Treatment': 'bg-green-500/20 text-green-300',
  'Housing & Safety': 'bg-orange-500/20 text-orange-300',
  'Food & Basic Needs': 'bg-yellow-500/20 text-yellow-300',
  'All Services': 'bg-purple-500/20 text-purple-300',
  'School Support': 'bg-gold/20 text-gold',
  'After-School': 'bg-pink-500/20 text-pink-300',
  'Crisis': 'bg-red-500/20 text-red-300',
};

export default function LocalServices() {
  const [zip, setZip] = useState('');
  const [ref, inView] = useInView({ threshold: 0.1 });

  const handleSearch = (e) => {
    e.preventDefault();
    if (zip.trim()) {
      window.open(`https://www.211.org/about-us/your-local-211?zip=${encodeURIComponent(zip)}`, '_blank');
    }
  };

  return (
    <section ref={ref} className="py-20 px-6 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-2">In Your Community</p>
          <h2 className="font-anton text-cream text-4xl sm:text-5xl tracking-wide">LOCAL SERVICES</h2>
          <p className="font-barlow text-cream/40 mt-3 max-w-xl">
            Help close to home. Use the ZIP code search or browse the tools below to find local support.
          </p>
        </motion.div>

        {/* ZIP search */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex gap-3 mb-14 max-w-md"
        >
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30 pointer-events-none" />
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="Enter your ZIP code..."
              maxLength={10}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-cream/20 rounded-sm text-cream placeholder:text-cream/30 font-barlow text-sm focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            Find Help
          </button>
        </motion.form>

        {/* Finder cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FINDER_TOOLS.map((tool, i) => (
            <motion.a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group bg-white/3 border border-cream/10 hover:border-gold/30 rounded-sm p-6 flex flex-col gap-3 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`text-xs font-barlow-condensed px-2 py-1 rounded-full tracking-wide shrink-0 ${CATEGORY_COLORS[tool.category]}`}>
                  {tool.category}
                </span>
                <ExternalLink className="w-4 h-4 text-cream/20 group-hover:text-gold/60 transition-colors shrink-0 mt-0.5" />
              </div>
              <h3 className="font-barlow-condensed text-cream font-bold text-lg leading-tight group-hover:text-gold transition-colors">
                {tool.name}
              </h3>
              <p className="font-barlow text-cream/40 text-sm leading-relaxed">{tool.description}</p>
            </motion.a>
          ))}
        </div>

        {/* Michigan-specific resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-5">Michigan Resources</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MICHIGAN_RESOURCES.map((resource, i) => (
              <div
                key={resource.name}
                className="bg-white/3 border border-cream/10 rounded-sm p-6 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-xs font-barlow-condensed px-2 py-1 rounded-full tracking-wide shrink-0 ${CATEGORY_COLORS[resource.category]}`}>
                    {resource.category}
                  </span>
                  {resource.location && (
                    <span className="flex items-center gap-1 text-cream/30 text-xs font-barlow shrink-0">
                      <MapPin className="w-3 h-3" />{resource.location}
                    </span>
                  )}
                </div>
                <h3 className="font-barlow-condensed text-cream font-bold text-lg leading-tight">{resource.name}</h3>
                <p className="font-barlow text-cream/40 text-sm leading-relaxed flex-1">{resource.description}</p>
                <div className="flex items-center gap-3 pt-1">
                  {resource.phone && (
                    <a
                      href={`tel:${resource.phone}`}
                      className="flex items-center gap-1.5 text-gold hover:text-gold-dark text-sm font-barlow-condensed tracking-wide transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />{resource.phoneDisplay}
                    </a>
                  )}
                  {resource.url && (
                    <a
                      href={resource.url.startsWith('http') ? resource.url : `https://${resource.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-cream/40 hover:text-cream text-xs font-barlow transition-colors ml-auto"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 border-t border-cream/10 pt-10 text-center"
        >
          <p className="font-barlow-condensed text-gold text-xl sm:text-2xl tracking-wide mb-2">
            Remember: Asking for help is a sign of strength — not weakness.
          </p>
          <p className="font-barlow text-cream/30 text-sm max-w-lg mx-auto">
            You matter. Your life has value. One good word can change everything.
          </p>
        </motion.div>
      </div>
    </section>
  );
}