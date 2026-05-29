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

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';

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