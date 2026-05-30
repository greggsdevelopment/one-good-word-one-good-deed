import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import ResourcesHero from '@/components/resources/ResourcesHero';
import CrisisHotlines from '@/components/resources/CrisisHotlines';
import LocalServices from '@/components/resources/LocalServices';
import ResourceCategories from '@/components/resources/ResourceCategories';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';

export default function Resources() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />
      <ResourcesHero />
      <CrisisHotlines />
      <ResourceCategories />
      <LocalServices />
      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}