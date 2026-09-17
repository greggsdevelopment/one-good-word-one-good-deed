import { useEffect } from 'react';
import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import OurStoryHero from '@/components/our-story/OurStoryHero';
import StoryTimeline from '@/components/our-story/StoryTimeline';
import StoryCTA from '@/components/our-story/StoryCTA';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';

export default function Stories() {
  useEffect(() => {
    document.title = 'Our Story | One Good Word One Good Deed';
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />
      <OurStoryHero />
      <StoryTimeline />
      <StoryCTA />
      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}