import { useEffect } from 'react';
import AboutHero from '@/components/about/AboutHero';
import FoundingStory from '@/components/about/FoundingStory';
import JasonStory from '@/components/about/JasonStory';
import MilestoneTimeline from '@/components/about/MilestoneTimeline';
import PhotoSection from '@/components/about/PhotoSection';
import BookingCTA from '@/components/about/BookingCTA';
import TeamCard from '@/components/about-cody/TeamCard';
import StickyNav from '@/components/home/StickyNav';
import MissionSection from '@/components/home/MissionSection';
import PillarsSection from '@/components/home/PillarsSection';
import CongressEndorsement from '@/components/home/CongressEndorsement';
import FooterSection from '@/components/home/FooterSection';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';

export default function About() {
  useEffect(() => {
    document.title = 'About Jason | One Good Word One Good Deed';
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />
      <AboutHero />
      <MissionSection />
      <FoundingStory />
      <JasonStory />
      <PillarsSection />
      <MilestoneTimeline />
      <PhotoSection />
      <CongressEndorsement />
      <BookingCTA />
      <TeamCard />
      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}