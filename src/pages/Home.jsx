import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import StickyNav from '@/components/home/StickyNav';
import HeroSection from '@/components/home/HeroSection';
import MissionSection from '@/components/home/MissionSection';
import PillarsSection from '@/components/home/PillarsSection';
import PledgeSection from '@/components/home/PledgeSection';
import GetInvolvedSection from '@/components/home/GetInvolvedSection';
import MomentumBand from '@/components/home/MomentumBand';
import ContactSection from '@/components/home/ContactSection';
import FooterSection from '@/components/home/FooterSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import NewsletterSection from '@/components/home/NewsletterSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BookJasonBanner from '@/components/home/BookJasonBanner';
import FAQSection from '@/components/home/FAQSection';
import VoicesOfChange from '@/components/home/VoicesOfChange';
import BackgroundMusic from '@/components/home/BackgroundMusic';

const LOGO_URL = 'https://storage.googleapis.com/base44-prod-app-files/f95001f6c/9bf3a28b-6e4c-4c4b-9534-a0781c77e54f_ChatGPT Image May 13, 2025, 10_43_21 AM.png';

export default function Home() {
  const [pledgeCount, setPledgeCount] = useState(0);
  const [recentPledges, setRecentPledges] = useState([]);

  const fetchPledges = useCallback(async () => {
    const pledges = await base44.entities.Pledge.list('-created_date', 30);
    setPledgeCount(pledges.length > 0 ? pledges.length : 0);
    setRecentPledges(pledges.slice(0, 20));
  }, []);

  useEffect(() => {
    // Get total count by listing all pledges
    const loadData = async () => {
      const allPledges = await base44.entities.Pledge.list('-created_date', 1000);
      setPledgeCount(allPledges.length);
      setRecentPledges(allPledges.slice(0, 20));
    };
    loadData();
  }, []);

  const handlePledgeCreated = async () => {
    // Refetch pledges after a new one is created
    const allPledges = await base44.entities.Pledge.list('-created_date', 1000);
    setPledgeCount(allPledges.length);
    setRecentPledges(allPledges.slice(0, 20));
  };

  return (
    <div className="bg-ink">
      <BackgroundMusic />
      <StickyNav logoUrl={LOGO_URL} />
      <HeroSection logoUrl={LOGO_URL} pledgeCount={pledgeCount} />
      <MissionSection />
      <PillarsSection />
      <PledgeSection
        pledgeCount={pledgeCount}
        recentPledges={recentPledges}
        onPledgeCreated={handlePledgeCreated}
      />
      <GetInvolvedSection />
      <VoicesOfChange />
      <TestimonialsSection />
      <BookJasonBanner />
      <FeaturedProducts />
      <MomentumBand pledgeCount={pledgeCount} />
      <NewsletterSection />
      <FAQSection />
      <ContactSection />
      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}