import { motion } from 'framer-motion';
import { Shield, Brain, Users, BookOpen, Heart, Smile } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const CATEGORIES = [
  {
    icon: Shield,
    title: 'Anti-Bullying',
    description: 'Resources for victims, bystanders, and those who want to stop the cycle.',
    links: [
      { label: 'StopBullying.gov', url: 'https://www.stopbullying.gov' },
      { label: 'Pacer\'s National Bullying Prevention', url: 'https://www.pacer.org/bullying/' },
      { label: 'No Bully', url: 'https://nobully.org' },
    ],
  },
  {
    icon: Brain,
    title: 'Mental Health',
    description: 'Find therapists, support groups, and tools for your mental wellness.',
    links: [
      { label: 'NAMI Teen Resources', url: 'https://www.nami.org/Your-Journey/Teens-Young-Adults' },
      { label: 'Teen Mental Health', url: 'https://teenmentalhealth.org' },
      { label: 'Child Mind Institute', url: 'https://childmind.org/teens' },
    ],
  },
  {
    icon: Users,
    title: 'Racial Justice & Identity',
    description: 'Safe spaces and support for teens navigating racism and identity.',
    links: [
      { label: 'Racism — It Stops With Me', url: 'https://itstopswithme.humanrights.gov.au' },
      { label: 'Teaching Tolerance', url: 'https://www.tolerance.org' },
      { label: 'Race Forward', url: 'https://www.raceforward.org' },
    ],
  },
  {
    icon: BookOpen,
    title: 'School & Academic Support',
    description: 'Tutoring, counseling, and academic help for struggling students.',
    links: [
      { label: 'Khan Academy (Free)', url: 'https://www.khanacademy.org' },
      { label: 'College Board Resources', url: 'https://www.collegeboard.org' },
      { label: 'Teen Life Help', url: 'https://teenlife.com' },
    ],
  },
  {
    icon: Heart,
    title: 'Faith & Spiritual Support',
    description: 'Connect with faith-based communities and spiritual guidance for teens.',
    links: [
      { label: 'Focus on the Family Teen Help', url: 'https://www.focusonthefamily.com/teen-section' },
      { label: 'YouVersion Bible App', url: 'https://www.youversion.com' },
      { label: 'Youth Ministry Resources', url: 'https://youthministry360.com' },
    ],
  },
  {
    icon: Smile,
    title: 'Substance Use & Recovery',
    description: 'Get help for yourself or a friend dealing with substance use.',
    links: [
      { label: 'Teen Challenge', url: 'https://teenchallengeusa.org' },
      { label: 'SAMHSA Treatment Locator', url: 'https://findtreatment.gov' },
      { label: 'Partnership to End Addiction', url: 'https://drugfree.org/teens' },
    ],
  },
];

export default function ResourceCategories() {
  const [ref, inView] = useInView({ threshold: 0.05 });

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-2">By Topic</p>
          <h2 className="font-anton text-cream text-4xl sm:text-5xl tracking-wide">FIND SUPPORT</h2>
          <p className="font-barlow text-cream/40 mt-3 max-w-xl">
            Browse resources by category — whatever you're going through, there's help available.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white/3 border border-cream/10 rounded-sm p-6 hover:border-gold/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-sm bg-gold/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-barlow-condensed text-cream font-bold text-xl tracking-wide">{cat.title}</h3>
                </div>
                <p className="font-barlow text-cream/40 text-sm mb-5 leading-relaxed">{cat.description}</p>
                <div className="flex flex-col gap-2">
                  {cat.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-barlow-condensed text-gold/70 hover:text-gold text-sm tracking-wide uppercase transition-colors flex items-center gap-1 group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                      {link.label}
                    </a>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}