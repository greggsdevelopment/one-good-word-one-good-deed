import { motion } from 'framer-motion';
import { Heart, Share2, Facebook, Twitter } from 'lucide-react';

const SITE_URL = 'https://1goodword1gooddeed.base44.app';
const SHARE_TEXT = encodeURIComponent(`I just took the One Good Word One Good Deed pledge! Join me at ${SITE_URL}`);

export default function PledgeCard({ pledge, onClose }) {
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${SHARE_TEXT}`, '_blank');
  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${SHARE_TEXT}`, '_blank');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6"
    >
      {/* The shareable card */}
      <div className="relative bg-gradient-to-br from-ink via-[#111108] to-ink border-2 border-gold/40 rounded-sm p-8 text-center overflow-hidden shadow-xl shadow-gold/10">
        {/* Decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-gold/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-8 bg-gold/40" />
            <Heart className="w-4 h-4 text-gold fill-gold/30" />
            <div className="h-px w-8 bg-gold/40" />
          </div>

          <p className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-3">
            One Good Word · One Good Deed
          </p>

          <p className="font-barlow text-cream/80 text-base italic leading-relaxed mb-5">
            "{pledge.pledge_statement}"
          </p>

          <p className="font-barlow-condensed text-cream font-bold text-lg tracking-wide">
            — {pledge.first_name}{pledge.last_initial ? ` ${pledge.last_initial}.` : ''}
            {pledge.city ? `, ${pledge.city}` : ''}
          </p>

          <div className="mt-4 h-px bg-gold/20" />
          <p className="font-barlow text-cream/25 text-xs mt-3 tracking-wider">1goodword1gooddeed.com</p>
        </div>
      </div>

      {/* Share buttons */}
      <div className="mt-4 flex flex-col gap-3">
        <p className="font-barlow-condensed text-cream/40 text-xs tracking-widest uppercase text-center">Share your pledge</p>
        <div className="flex gap-3">
          <button
            onClick={shareTwitter}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1da1f2]/15 hover:bg-[#1da1f2]/25 border border-[#1da1f2]/30 text-[#1da1f2] font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-all"
          >
            <Twitter className="w-4 h-4" /> Twitter
          </button>
          <button
            onClick={shareFacebook}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1877f2]/15 hover:bg-[#1877f2]/25 border border-[#1877f2]/30 text-[#1877f2] font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-all"
          >
            <Facebook className="w-4 h-4" /> Facebook
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 border border-cream/10 hover:border-cream/20 text-cream/40 hover:text-cream font-barlow-condensed text-sm uppercase tracking-wider rounded-sm transition-colors"
        >
          View the Wall
        </button>
      </div>
    </motion.div>
  );
}