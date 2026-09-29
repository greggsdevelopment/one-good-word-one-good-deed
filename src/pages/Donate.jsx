import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import DonateHero from '@/components/donate/DonateHero';
import WhyWeNeedSupport from '@/components/donate/WhyWeNeedSupport';
import ItemDonationForm from '@/components/donate/ItemDonationForm';
import MoneyDonation from '@/components/donate/MoneyDonation';
import { useDonationNeeds, useDonationSettings } from '@/lib/donations';

export default function Donate() {
  const { settings, isLoading: settingsLoading } = useDonationSettings();
  const { data: needs = [], isLoading: needsLoading } = useDonationNeeds();
  const { hash } = useLocation();
  const isLoading = settingsLoading || needsLoading;

  const itemsOpen = settings.item_donations_enabled;
  const moneyOpen = settings.money_donations_enabled;
  const anyOpen = itemsOpen || moneyOpen;

  // Nav links like /donate#donate-items arrive while the spinner is still up,
  // so scroll once the page has actually rendered.
  useEffect(() => {
    if (isLoading || !hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [isLoading, hash]);

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-3">
          <Link to="/" className="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors font-barlow-condensed text-sm tracking-wider uppercase">
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
          <p className="font-anton text-cream text-lg tracking-wider hidden sm:block">SUPPORT THE MOVEMENT</p>
          <Link to="/programs" className="px-4 py-2 border border-white/10 hover:border-gold/40 text-cream/70 hover:text-gold font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-all">
            Book a Program
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        {isLoading ? (
          <div className="flex justify-center py-40">
            <div className="w-8 h-8 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <DonateHero itemsOpen={itemsOpen} moneyOpen={moneyOpen} />

            {!anyOpen && (
              <section className="px-6 pb-24">
                <div className="max-w-2xl mx-auto bg-white/[0.03] border border-cream/10 rounded-sm p-8 text-center">
                  <p className="font-barlow text-cream/70 text-lg leading-relaxed">{settings.closed_message}</p>
                </div>
              </section>
            )}

            {itemsOpen && <ItemDonationForm settings={settings} needs={needs} />}
            {anyOpen && <WhyWeNeedSupport />}
            {moneyOpen && <MoneyDonation gofundmeUrl={settings.gofundme_url} />}

            <section className="px-6 pb-16 pt-4">
              <p className="max-w-2xl mx-auto font-barlow text-cream/35 text-xs leading-relaxed text-center">
                One Good Word...One Good Deed is a Michigan LLC, not a registered 501(c)(3). Donations of funds or
                items are not tax deductible as charitable contributions.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
