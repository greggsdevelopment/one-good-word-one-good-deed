import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import DonateHero from '@/components/donate/DonateHero';
import DonationTiers from '@/components/donate/DonationTiers';
import DonationProgressBar from '@/components/donate/DonationProgressBar';
import WhyWeNeedSupport from '@/components/donate/WhyWeNeedSupport';
import DonorWall from '@/components/donate/DonorWall';

export default function Donate() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === 'true';

  return (
    <div className="min-h-screen bg-ink">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors font-barlow-condensed text-sm tracking-wider uppercase">
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
          <p className="font-anton text-cream text-lg tracking-wider">SUPPORT THE MOVEMENT</p>
          <Link to="/programs" className="px-4 py-2 border border-white/10 hover:border-gold/40 text-cream/70 hover:text-gold font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-all">
            Book a Program
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-3 bg-green-900/30 border-b border-green-500/30 px-6 py-4 text-green-300 font-barlow text-sm"
            >
              <CheckCircle className="w-5 h-5 shrink-0" />
              Thank you for your generous donation! You're helping change lives.
            </motion.div>
          )}
        </AnimatePresence>

        <DonateHero />
        <DonationProgressBar />
        <WhyWeNeedSupport />
        <DonorWall />
        <DonationTiers />
      </main>
    </div>
  );
}