import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, Loader2 } from 'lucide-react';

export default function StickyCartBar({ cartCount, cartTotal, onOpenCart, onCheckout, loading }) {
  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-ink/95 backdrop-blur-md border-t border-cream/10 px-4 py-3 shadow-2xl shadow-black/50"
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={onOpenCart}
              className="flex items-center gap-3 text-cream hover:text-gold transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-ink text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <div>
                <p className="font-barlow-condensed text-sm tracking-wide">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
                <p className="font-barlow text-cream/40 text-xs">
                  {cartTotal >= 75 ? '🎉 Free shipping!' : `$${(75 - cartTotal).toFixed(0)} away from free shipping`}
                </p>
              </div>
            </button>
            <div className="flex items-center gap-4">
              <p className="font-anton text-gold text-2xl">${cartTotal.toFixed(0)}</p>
              <button
                onClick={onCheckout}
                disabled={loading}
                className="px-6 py-2.5 bg-gold hover:bg-gold-dark disabled:opacity-60 text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20 flex items-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Processing...</> : 'Checkout'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}