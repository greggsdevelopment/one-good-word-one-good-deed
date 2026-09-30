import { useEffect } from 'react';
import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import OurStoryHero from '@/components/our-story/OurStoryHero';
import StoryTimeline from '@/components/our-story/StoryTimeline';
import StoryCommitment from '@/components/our-story/StoryCommitment';
import StoryCTA from '@/components/our-story/StoryCTA';

const LOGO_URL = '/brand/logo-512.webp';

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
      <StoryCommitment />
      <StoryCTA />
      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}