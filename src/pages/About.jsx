import { useEffect } from 'react';
import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import AboutHero from '@/components/about/AboutHero';
import JasonStorySection from '@/components/about/JasonStorySection';
import JasonReality from '@/components/about/JasonReality';
import FamilyCard from '@/components/about/FamilyCard';
import WhatIDoForOGWOGD from '@/components/about/WhatIDoForOGWOGD';
import JasonBeyond from '@/components/about/JasonBeyond';
import JasonCTA from '@/components/about/JasonCTA';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';

export default function About() {
  useEffect(() => {
    document.title = 'About Jason | One Good Word One Good Deed';
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />
      <main className="relative z-10">
        <AboutHero />
        <JasonStorySection />
        <JasonReality />
        <FamilyCard />
        <WhatIDoForOGWOGD />
        <JasonBeyond />
        <JasonCTA />
      </main>
      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}