import { useEffect } from 'react';
import StickyNav from '@/components/home/StickyNav';
import ContactSection from '@/components/home/ContactSection';
import GetInvolvedSection from '@/components/home/GetInvolvedSection';
import FAQSection from '@/components/home/FAQSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import FooterSection from '@/components/home/FooterSection';

const LOGO_URL = '/brand/logo-512.webp';

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact | One Good Word One Good Deed';
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <StickyNav logoUrl={LOGO_URL} />
      <main className="pt-16">
        <ContactSection />
        <GetInvolvedSection />
        <FAQSection />
        <NewsletterSection />
      </main>
      <FooterSection logoUrl={LOGO_URL} />
    </div>
  );
}