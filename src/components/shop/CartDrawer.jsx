import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';

export default function CartDrawer({ open, onClose, cart, onUpdateQty, onRemove, total, onCheckout, loading }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#0f0f12] border-l border-white/[0.08] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h2 className="font-anton text-cream text-xl tracking-wide">YOUR CART</h2>
                {cart.length > 0 && (
                  <span className="bg-gold text-ink text-xs font-bold px-2 py-0.5 rounded-full font-barlow-condensed">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-cream/40 hover:text-cream transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center pb-20">
                  <ShoppingBag className="w-14 h-14 text-white/10 mb-4" />
                  <p className="font-anton text-cream/30 text-2xl mb-2">CART IS EMPTY</p>
                  <p className="font-barlow text-cream/20 text-sm">Add some items to get started.</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {cart.map((item) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 bg-white/[0.03] border border-white/[0.06] rounded-sm p-4"
                    >
                      <div className="w-14 h-14 bg-white/[0.05] rounded-sm flex items-center justify-center text-3xl shrink-0">
                        {item.product.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-barlow-condensed text-cream font-semibold text-sm tracking-wide truncate">
                          {item.product.name}
                        </p>
                        <p className="font-barlow text-cream/40 text-xs mt-0.5">Size: {item.size}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onUpdateQty(item.key, -1)}
                              className="w-6 h-6 rounded-sm border border-white/10 flex items-center justify-center text-cream/50 hover:text-cream hover:border-white/25 transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-barlow-condensed text-cream text-sm w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQty(item.key, 1)}
                              className="w-6 h-6 rounded-sm border border-white/10 flex items-center justify-center text-cream/50 hover:text-cream hover:border-white/25 transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="font-anton text-gold text-lg">
                              ${(item.product.price * item.quantity).toFixed(0)}
                            </p>
                            <button
                              onClick={() => onRemove(item.key)}
                              className="text-cream/20 hover:text-red-400 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-6 border-t border-white/[0.07] space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-barlow-condensed text-cream/50 text-sm tracking-wider uppercase">Subtotal</p>
                  <p className="font-anton text-cream text-2xl">${total.toFixed(0)}</p>
                </div>
                <p className="font-barlow text-cream/25 text-xs">Shipping & taxes calculated at checkout.</p>
                <button
                  onClick={onCheckout}
                  disabled={loading}
                  className="w-full py-4 bg-gold hover:bg-gold-dark disabled:opacity-60 text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold/25 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}