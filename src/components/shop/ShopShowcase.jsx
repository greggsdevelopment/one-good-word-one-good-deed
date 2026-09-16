import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';

const SERIF = { fontFamily: "'Cormorant Garamond', serif" };
const SCRIPT = { fontFamily: "'Great Vibes', cursive" };
const HOLD_MS = 5200;

/**
 * The shop's opening statement: featured pieces cross-fading inside a single
 * gold frame, the same cinematic language as the pledge wall.
 */
export default function ShopShowcase({ products, onQuickView, onBrowse }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const count = products.length;

  const go = useCallback(
    (step) => setIndex((prev) => (prev + step + count) % count),
    [count]
  );

  useEffect(() => {
    if (paused || count <= 1) return undefined;
    timerRef.current = setInterval(() => go(1), HOLD_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, go, count]);

  if (!count) return null;

  const product = products[index];

  return (
    <section className="relative overflow-hidden border-b border-gold/10">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 40%, rgba(230,180,80,0.12) 0%, rgba(11,11,13,0) 60%)',
        }}
      />

      <div
        className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-16 md:pt-36 md:pb-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Frame */}
        <div className="relative w-full max-w-md mx-auto lg:mx-0">
          <div className="relative p-2 md:p-2.5 border border-gold/25 rounded-sm">
            <div className="relative overflow-hidden rounded-sm border border-gold/40 bg-black/50 aspect-[4/5]">
              <AnimatePresence mode="wait">
                <motion.button
                  key={product.id}
                  type="button"
                  onClick={() => onQuickView(product)}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute inset-0 w-full h-full group cursor-pointer"
                  aria-label={`Quick view ${product.name}`}
                >
                  {/* Contain, with no per-product zoom: the showcase frame is far
                      larger than the old thumbnails those zoom values were tuned
                      for, and here the whole garment should be visible. */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-3"
                  />
                  <span className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="flex items-center gap-2 border border-gold/50 bg-ink/80 px-4 py-2 rounded-sm text-gold font-barlow-condensed text-sm uppercase tracking-wider">
                      <Eye className="w-4 h-4" /> Quick View
                    </span>
                  </span>
                </motion.button>
              </AnimatePresence>
            </div>

            <span className="absolute -top-px -left-px w-7 h-7 border-t-2 border-l-2 border-gold" aria-hidden="true" />
            <span className="absolute -top-px -right-px w-7 h-7 border-t-2 border-r-2 border-gold" aria-hidden="true" />
            <span className="absolute -bottom-px -left-px w-7 h-7 border-b-2 border-l-2 border-gold" aria-hidden="true" />
            <span className="absolute -bottom-px -right-px w-7 h-7 border-b-2 border-r-2 border-gold" aria-hidden="true" />
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2.5 mt-6">
            {products.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setIndex(i)}
                aria-label={`Show ${p.name}`}
                className={`rounded-full transition-all duration-300 ${
                  i === index ? 'w-7 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-cream/25 hover:bg-cream/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Copy */}
        <div className="text-center lg:text-left">
          <p className="text-gold text-4xl md:text-5xl mb-2" style={SCRIPT}>
            Wear the movement
          </p>

          <h1 className="font-anton text-cream text-5xl sm:text-6xl md:text-7xl leading-[0.92] tracking-wide mb-6">
            THE MERCH<br />
            <span className="text-gold">SHOP</span>
          </h1>

          <p
            className="text-cream/70 text-lg md:text-xl leading-relaxed mb-9 max-w-lg mx-auto lg:mx-0"
            style={SERIF}
          >
            Every shirt, hoodie and wristband puts the message somewhere a kid can
            see it, and funds the next school we walk into.
          </p>

          {/* Now showing */}
          <div className="border-t border-gold/15 pt-6 mb-8 min-h-[104px]">
            <p className="font-barlow-condensed text-gold/70 text-[10px] tracking-[0.35em] uppercase mb-2">
              Now Showing
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="flex items-baseline justify-center lg:justify-start gap-4 flex-wrap"
              >
                <span className="font-anton text-cream text-2xl sm:text-3xl tracking-wide">
                  {product.name}
                </span>
                <span className="font-anton text-gold text-2xl sm:text-3xl">
                  ${product.price}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={onBrowse}
            className="group inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-ink font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/25"
          >
            Browse the Full Collection
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </button>
        </div>
      </div>
    </section>
  );
}