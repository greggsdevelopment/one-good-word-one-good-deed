import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Mail } from 'lucide-react';

// Online payment is not wired up yet. Until Stripe checkout is live, this page
// does NOT create Order records or promise a delivery date. It shows the cart
// and hands the shopper a pre-filled email so a real person can send a
// payment link. Do not restore the old "Place Order" flow without payment.
const ORDER_EMAIL = 'greggsdevelopment@gmail.com';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];
  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-4">
        <p className="font-barlow text-cream/60">Your cart is empty.</p>
        <Link to="/shop" className="font-barlow-condensed text-gold uppercase tracking-wider text-sm hover:underline">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const lines = cart.map((i) => {
    const size = i.size ? ` (Size: ${i.size})` : '';
    return `- ${i.product.name}${size} x ${i.quantity} @ $${i.product.price.toFixed(2)}`;
  });
  const body = [
    'Hi, I would like to order the following from the One Good Word...One Good Deed shop:',
    '',
    ...lines,
    '',
    `Total: $${total.toFixed(2)}`,
    '',
    'Name:',
    'Shipping address:',
    'Phone (optional):',
  ].join('\n');
  const mailto = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent('Shop order request')}&body=${encodeURIComponent(body)}`;

  return (
    <div className="min-h-screen bg-ink relative">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center gap-4 h-16">
          <button onClick={() => navigate(-1)} className="text-cream/50 hover:text-gold transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-anton text-cream text-lg tracking-wider">CHECKOUT</h1>
        </div>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Order by email */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-sm p-6">
            <h2 className="font-barlow-condensed text-cream/60 text-sm tracking-widest uppercase mb-3">How ordering works right now</h2>
            <p className="font-barlow text-cream/70 text-base leading-relaxed mb-4">
              Online card payment is being set up. To order, send us your cart by email and we will reply
              with a secure payment link and shipping details. Nothing is charged until you pay that link.
            </p>
            <a
              href={mailto}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
            >
              <Mail className="w-5 h-5" />
              Email This Order
            </a>
            <p className="font-barlow text-cream/40 text-xs mt-3 text-center">
              Opens your email app with the items below filled in. Or write to{' '}
              <a href={`mailto:${ORDER_EMAIL}`} className="text-gold hover:underline">{ORDER_EMAIL}</a>.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 font-barlow-condensed text-cream/50 hover:text-gold uppercase tracking-wider text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Keep Shopping
          </Link>
        </motion.div>

        {/* Order summary */}
        <div className="bg-white/[0.03] rounded-sm border border-white/[0.07] p-6 h-fit lg:sticky lg:top-24">
          <div className="flex items-center gap-2 mb-5">
            <Package className="w-4 h-4 text-gold" />
            <p className="font-barlow-condensed text-cream/50 text-xs tracking-widest uppercase">Your Cart</p>
          </div>
          <div className="space-y-3 mb-5">
            {cart.map((item) => (
              <div key={item.key} className="flex gap-3 items-start">
                <div className="w-10 h-10 bg-white/[0.05] rounded-sm overflow-hidden shrink-0">
                  {item.product.image && <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-barlow text-cream/80 text-xs leading-tight truncate">{item.product.name}</p>
                  {item.size && <p className="font-barlow text-cream/30 text-[10px]">Size: {item.size}</p>}
                  <p className="font-barlow text-cream/30 text-[10px]">Qty: {item.quantity}</p>
                </div>
                <p className="font-barlow-condensed text-gold text-sm shrink-0">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.07] pt-4 flex justify-between items-center">
            <p className="font-barlow-condensed text-cream/40 text-xs tracking-wider uppercase">Total</p>
            <p className="font-anton text-gold text-2xl">${total.toFixed(2)}</p>
          </div>
          <p className="font-barlow text-cream/20 text-xs mt-3">Shipping is confirmed by email before payment.</p>
        </div>
      </div>
    </div>
  );
}
