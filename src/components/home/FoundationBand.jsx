import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

/**
 * One of the three foundations of the site, as a full-bleed cinematic band.
 * Alternates sides, parallaxes its visual on scroll, and reacts as a whole on hover.
 */
export default function FoundationBand({
  index,
  eyebrow,
  title,
  titleAccent,
  description,
  meta,
  cta,
  to,
  image,
  imageAlt,
  imageStyle,
  visual,
  reverse = false,
  glow = '25% 40%',
}) {
  const sectionRef = useRef(null);
  const [revealRef, inView] = useInView(0.15);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['6%', '-6%']);

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink border-t border-gold/10 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at ${glow}, rgba(230,180,80,0.10) 0%, rgba(11,11,13,0) 58%)`,
        }}
      />

      {/* Oversized index watermark */}
      <p
        aria-hidden="true"
        className={`pointer-events-none absolute top-6 font-anton text-[24vw] leading-none select-none ${
          reverse ? 'right-2' : 'left-2'
        }`}
        style={{
          color: 'transparent',
          WebkitTextStroke: '1px rgba(230,180,80,0.07)',
        }}
      >
        {index}
      </p>

      <div
        ref={revealRef}
        className="group relative max-w-6xl mx-auto px-6 py-20 md:py-28 lg:py-32"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className={`relative w-full max-w-lg mx-auto ${
              reverse ? 'lg:order-2' : 'lg:order-1'
            }`}
          >
            {/* Parallax lives on its own element so it never fights the reveal */}
            <motion.div style={{ y: parallaxY }}>
              <Link to={to} className="block" aria-label={cta}>
                <div className="relative p-2 md:p-2.5 border border-gold/25 rounded-sm transition-colors duration-500 group-hover:border-gold/60">
                  {/* Square frame keeps all three bands the same visual weight,
                      whatever shape the asset inside it happens to be. */}
                  <div className="relative aspect-square overflow-hidden rounded-sm border border-gold/30 bg-black/50">
                    {visual || (
                      <img
                        src={image}
                        alt={imageAlt}
                        className="absolute inset-0 w-full h-full object-contain transition-transform [transition-duration:1200ms] ease-out group-hover:scale-[1.05]"
                        style={imageStyle}
                      />
                    )}
                  </div>

                  {/* Corner accents */}
                  <span className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-gold transition-all duration-500 group-hover:w-10 group-hover:h-10" aria-hidden="true" />
                  <span className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-gold transition-all duration-500 group-hover:w-10 group-hover:h-10" aria-hidden="true" />
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Copy */}
          <div
            className={`text-center lg:text-left ${
              reverse ? 'lg:order-1' : 'lg:order-2'
            }`}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="w-14 h-1 bg-gold mb-7 mx-auto lg:mx-0 origin-center lg:origin-left"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-barlow-condensed text-gold text-[11px] tracking-[0.35em] uppercase mb-5"
            >
              {eyebrow}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="font-anton text-cream text-4xl sm:text-5xl md:text-6xl leading-[0.95] tracking-wide mb-6"
            >
              {title}
              <br />
              <span className="text-gold">{titleAccent}</span>
            </motion.h2>

            {meta && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.38 }}
                className="mb-6"
              >
                {meta}
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.44 }}
              className="text-cream/75 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
              style={SERIF}
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.55 }}
            >
              <Link
                to={to}
                className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-ink font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/25"
              >
                {cta}
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}