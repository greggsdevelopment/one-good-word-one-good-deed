import { useEffect } from 'react';
import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import DraykeHero from '@/components/drayke/DraykeHero';
import DraykeStory from '@/components/drayke/DraykeStory';
import DraykeCarousel from '@/components/drayke/DraykeCarousel';
import MemorialSong from '@/components/drayke/MemorialSong';
import ButterflySection from '@/components/drayke/ButterflySection';
import WhyWeRemember from '@/components/drayke/WhyWeRemember';
import HelpBand from '@/components/drayke/HelpBand';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';

export default function RememberDrayke() {
  useEffect(() => {
    document.title = 'Remember Drayke | One Good Word One Good Deed';
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />
      <DraykeHero />
      <MemorialSong />
      <DraykeStory />
      <DraykeCarousel />
      <ButterflySection />
      <WhyWeRemember />
      <HelpBand />
      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}