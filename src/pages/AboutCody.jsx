import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import CodyHero from '@/components/about-cody/CodyHero';
import CodyStory from '@/components/about-cody/CodyStory';
import WhatIDo from '@/components/about-cody/WhatIDo';
import BeyondSection from '@/components/about-cody/BeyondSection';
import CodyCTA from '@/components/about-cody/CodyCTA';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';

export default function AboutCody() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />
      <main className="relative z-10">
        <CodyHero />
        <CodyStory />
        <WhatIDo />
        <BeyondSection />
        <CodyCTA />
      </main>
      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}