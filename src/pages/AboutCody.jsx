import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import CodyHero from '@/components/about-cody/CodyHero';
import CodyStory from '@/components/about-cody/CodyStory';
import RealityBehindReason from '@/components/about-cody/RealityBehindReason';
import GroundedKingsCard from '@/components/about-cody/GroundedKingsCard';
import WhatIDo from '@/components/about-cody/WhatIDo';
import GreggsDevCard from '@/components/about-cody/GreggsDevCard';
import BeyondSection from '@/components/about-cody/BeyondSection';
import CodyCTA from '@/components/about-cody/CodyCTA';

const LOGO_URL = '/brand/logo-512.webp';

export default function AboutCody() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />
      <main className="relative z-10">
        <CodyHero />
        <CodyStory />
        <RealityBehindReason />
        <GroundedKingsCard />
        <WhatIDo />
        <GreggsDevCard />
        <BeyondSection />
        <CodyCTA />
      </main>
      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}