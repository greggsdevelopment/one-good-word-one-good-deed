import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProgramsHero from '@/components/programs/ProgramsHero';
import WhatWeDoSection from '@/components/programs/WhatWeDoSection';
import WhatSchoolsGet from '@/components/programs/WhatSchoolsGet';
import SchoolTestimonials from '@/components/programs/SchoolTestimonials';
import BookingForm from '@/components/programs/BookingForm';
import PricingTiers from '@/components/programs/PricingTiers';
import ImpactStatsBanner from '@/components/programs/ImpactStatsBanner';
import FAQSection from '@/components/programs/FAQSection';

export default function Programs() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors font-barlow-condensed text-sm tracking-wider uppercase">
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
          <p className="font-anton text-cream text-lg tracking-wider">SCHOOL PROGRAMS</p>
          <Link to="/donate" className="px-4 py-2 border border-gold/30 hover:border-gold/60 text-gold font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-all">
            Donate
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <ProgramsHero />
        <ImpactStatsBanner />
        <WhatWeDoSection />
        <WhatSchoolsGet />
        <PricingTiers />
        <SchoolTestimonials />
        <FAQSection />
        <BookingForm />
      </main>
    </div>
  );
}