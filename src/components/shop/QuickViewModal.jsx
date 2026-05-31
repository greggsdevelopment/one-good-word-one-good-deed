import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Minus, ShoppingCart, Ruler } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import SizeGuideModal from './SizeGuideModal';

export default function QuickViewModal({ product, onClose, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, selectedSize);
    }
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 1200);
  };

  const modalContent = (
    <>
      <AnimatePresence>
        {/* Backdrop */}
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[9998] bg-black/75 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 24 }}
          transition={{ duration: 0.25 }}
          className="fixed z-[9999] bg-[#0f0f12] border border-cream/10 rounded-sm shadow-2xl overflow-y-auto"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'calc(100vw - 2rem)',
            maxWidth: '672px',
            maxHeight: '90vh',
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-cream/40 hover:text-cream transition-colors bg-ink/60 rounded-sm p-1"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="sm:w-1/2 h-64 sm:h-auto bg-white/[0.03] flex items-center justify-center overflow-hidden shrink-0">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain object-center"
                  style={{ maxHeight: '400px' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5">
                  <span className="text-cream/30 text-sm">No image</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 p-6 flex flex-col gap-4">
              <div>
                <p className="font-barlow-condensed text-gold text-xs tracking-widest uppercase mb-1">{product.category}</p>
                <h2 className="font-anton text-cream text-2xl leading-tight">{product.name}</h2>
                <p className="font-anton text-gold text-3xl mt-2">${product.price}</p>
              </div>

              <p className="font-barlow text-cream/50 text-sm leading-relaxed">{product.description}</p>

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-barlow-condensed text-cream/40 text-xs tracking-widest uppercase">Size</span>
                    <button
                      onClick={() => setSizeGuideOpen(true)}
                      className="flex items-center gap-1 text-gold/60 hover:text-gold text-xs font-barlow-condensed tracking-wide transition-colors"
                    >
                      <Ruler className="w-3 h-3" /> Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-barlow-condensed tracking-wider uppercase rounded-sm border transition-all ${
                          selectedSize === size
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-white/10 text-cream/40 hover:border-white/25 hover:text-cream/70'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <p className="font-barlow-condensed text-cream/40 text-xs tracking-widest uppercase mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 border border-white/10 rounded-sm flex items-center justify-center text-cream/50 hover:text-cream hover:border-white/25 transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-barlow-condensed text-cream text-lg w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 border border-white/10 rounded-sm flex items-center justify-center text-cream/50 hover:text-cream hover:border-white/25 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className={`mt-auto w-full py-3.5 font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                    : 'bg-gold hover:bg-gold-dark text-ink hover:shadow-lg hover:shadow-gold/20'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );

  return createPortal(modalContent, document.body);
}