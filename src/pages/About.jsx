import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AboutHero from '@/components/about/AboutHero';
import FoundingStory from '@/components/about/FoundingStory';
import MilestoneTimeline from '@/components/about/MilestoneTimeline';
import PhotoSection from '@/components/about/PhotoSection';
import BookingCTA from '@/components/about/BookingCTA';
import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';

const LOGO_URL = 'https://storage.googleapis.com/base44-prod-app-files/f95001f6c/9bf3a28b-6e4c-4c4b-9534-a0781c77e54f_ChatGPT Image May 13, 2025, 10_43_21 AM.png';

export default function About() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />
      <AboutHero />
      <FoundingStory />
      <MilestoneTimeline />
      <PhotoSection />
      <BookingCTA />
      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}