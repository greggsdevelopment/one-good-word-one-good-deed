import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Heart } from 'lucide-react';
import DonateHero from '@/components/donate/DonateHero';
import DonationTiers from '@/components/donate/DonationTiers';
import DonationProgressBar from '@/components/donate/DonationProgressBar';
import WhyWeNeedSupport from '@/components/donate/WhyWeNeedSupport';
import DonorWall from '@/components/donate/DonorWall';

export default function Donate() {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success') === 'true';
  const amount = searchParams.get('amount');

  if (success) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6 text-center">
        <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-lg"
        >
          <div className="w-20 h-20 bg-gold/10 border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-gold" />
          </div>
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-3">Donation Received</p>
          <h1 className="font-anton text-cream text-5xl sm:text-6xl leading-tight mb-4">
            THANK YOU!
          </h1>
          {amount && (
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-sm px-6 py-3 mb-6">
              <Heart className="w-4 h-4 text-gold fill-gold" />
              <span className="font-barlow-condensed text-gold text-lg tracking-wider">${amount} donated</span>
            </div>
          )}
          <p className="font-barlow text-cream/60 text-lg leading-relaxed mb-8">
            Your generosity helps Jason reach more students and spread the message that one good word truly changes everything.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
        </motion.div>
      </div>
    );
  }

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
        <DonateHero />
        <DonationProgressBar />
        <WhyWeNeedSupport />
        <DonorWall />
        <DonationTiers />
      </main>
    </div>
  );
}