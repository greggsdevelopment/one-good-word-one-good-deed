import StickyNav from '@/components/home/StickyNav';
import ContactSection from '@/components/home/ContactSection';
import FooterSection from '@/components/home/FooterSection';

export default function Contact() {
  return (
    <div className="min-h-screen bg-cream">
      <StickyNav />
      <main className="pt-16">
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}