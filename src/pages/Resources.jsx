import { useState } from 'react';
import { Search, X, Printer } from 'lucide-react';
import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import ResourcesHero from '@/components/resources/ResourcesHero';
import CrisisHotlines from '@/components/resources/CrisisHotlines';
import LocalServices from '@/components/resources/LocalServices';
import ResourceCategories from '@/components/resources/ResourceCategories';
import SuggestResourceForm from '@/components/resources/SuggestResourceForm';
import PrayerRequestForm from '@/components/resources/PrayerRequestForm';
import BackToTopButton from '@/components/BackToTopButton';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';

const CATEGORY_TABS = ['All', 'Crisis', 'Mental Health', 'After-School', 'Anti-Bullying', 'Faith', 'Substance Abuse'];

export default function Resources() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />
      <ResourcesHero />

      {/* Search + filter controls */}
      <div className="relative z-10 bg-ink border-b border-cream/[0.06] px-6 py-6 sticky top-[64px] backdrop-blur-md bg-ink/95">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">

          {/* Top row: search + last updated + print */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources, hotlines, organizations..."
                className="w-full pl-10 pr-10 py-3 bg-white/[0.04] border border-cream/10 rounded-sm text-cream placeholder:text-cream/25 font-barlow text-sm focus:outline-none focus:border-gold/30 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Last Updated badge */}
            <span className="shrink-0 font-barlow-condensed text-xs tracking-wider uppercase px-3 py-1.5 bg-gold/10 border border-gold/20 text-gold rounded-full">
              Last Updated: May 2026
            </span>

            {/* Print button */}
            <button
              onClick={() => window.print()}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 border border-cream/10 hover:border-cream/25 text-cream/50 hover:text-cream font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-all print:hidden"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-4 py-1.5 font-barlow-condensed text-sm uppercase tracking-wider rounded-full border transition-all ${
                  activeCategory === tab
                    ? 'bg-gold text-ink border-gold font-bold'
                    : 'border-cream/10 text-cream/50 hover:border-cream/25 hover:text-cream'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <CrisisHotlines search={search} activeCategory={activeCategory} />
      <ResourceCategories />
      <LocalServices search={search} activeCategory={activeCategory} />
      <PrayerRequestForm />
      <SuggestResourceForm />
      <FooterSection logoUrl={LOGO_URL} />
      <BackToTopButton />
    </div>
  );
}