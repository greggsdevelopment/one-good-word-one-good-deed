import { motion } from 'framer-motion';
import { Crown, ExternalLink } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export default function GroundedKingsCard() {
  const [ref, inView] = useInView(0.1);

  return (
    <section ref={ref} className="relative bg-ink px-6 pb-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-sm border border-gold/25 bg-gold/[0.04] p-8 sm:p-12 overflow-hidden"
        >
          {/* Subtle glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gold/8 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-11 h-11 rounded-sm border border-gold/30 bg-gold/10 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 text-gold" />
              </span>
              <p className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase">
                Beyond OGWOGD
              </p>
            </div>

            <h3 className="font-anton text-cream text-3xl sm:text-4xl tracking-wide mb-5">
              Grounded Kings Foundation
            </h3>

            <p className="font-barlow text-cream/70 text-base sm:text-lg leading-relaxed mb-8">
              Cody also founded Grounded Kings Foundation, a community built for men navigating
              fatherhood, hard seasons, and rebuilding without a blueprint. He started it because he
              knows what it&rsquo;s like to look for support and find none, and decided no man should
              have to carry that alone. It&rsquo;s on its way to becoming an officially recognized
              nonprofit.
            </p>

            <a
              href="https://groundedkings.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold text-ink font-barlow-condensed font-semibold text-sm uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-gold-dark transition-colors"
            >
              Visit Grounded Kings
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}