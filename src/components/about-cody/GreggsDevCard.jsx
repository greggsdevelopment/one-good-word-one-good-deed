import { motion } from 'framer-motion';
import { Code2, ExternalLink } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

/** Cody's web design and AI business, the studio that built this site. */
export default function GreggsDevCard() {
  const [ref, inView] = useInView(0.1);

  return (
    <section ref={ref} className="relative bg-ink px-6 pt-6 pb-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative rounded-sm rainbow-border bg-white/[0.03] p-8 sm:p-12 overflow-hidden"
        >
          {/* Soft glow (a gradient, not a blur, so it costs nothing while scrolling) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(420px 320px at 100% 0%, rgba(74,155,232,0.16), transparent 70%), radial-gradient(360px 280px at 0% 100%, rgba(160,108,213,0.12), transparent 70%)' }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-11 h-11 rounded-sm border border-rb-blue/40 bg-rb-blue/10 flex items-center justify-center shrink-0">
                <Code2 className="w-5 h-5 text-rb-blue" />
              </span>
              <p className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase">
                Built by Cody
              </p>
            </div>

            <h3 className="font-anton text-cream text-3xl sm:text-4xl tracking-wide mb-5">
              Greggs <span className="text-rainbow">Development</span>
            </h3>

            <p className="font-barlow text-cream/70 text-base sm:text-lg leading-relaxed mb-4">
              Cody runs Greggs Development, a web design and AI solutions studio serving businesses
              across metro Detroit and Dearborn. The site you are on right now, from the Pledge Wall
              to the support chat and the school partner portal, was designed and built there.
            </p>
            <p className="font-barlow text-cream/55 text-base leading-relaxed mb-8">
              If your business, school or organization needs a website or AI tools that actually get
              used, that is where to start.
            </p>

            <a
              href="https://greggsdev.com"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 bg-gold text-ink font-barlow-condensed font-semibold text-sm uppercase tracking-wider px-6 py-3 rounded-sm transition-colors"
            >
              Visit greggsdev.com
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
