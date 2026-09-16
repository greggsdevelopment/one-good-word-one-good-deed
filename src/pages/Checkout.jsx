import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Mail, CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { STRIPE_CHECKOUT_ENABLED, ORDER_EMAIL } from '@/lib/shop-config';

// This page never creates an Order record and never decides a price. When card
// payment is on, it sends { id, size, quantity } to the createCheckout function,
// which looks the price up server side, and the stripeWebhook function writes
// the Order after Stripe confirms payment. When card payment is off, it hands
// the shopper a pre-filled email so a real person can send a payment link.
// Do not restore a client-side "Place Order" flow.

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [starting, setStarting] = useState(false);
  const [payError, setPayError] = useState('');

  const outcome = searchParams.get('checkout');
  const cart = location.state?.cart || [];
  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  // Back from Stripe after paying. The cart is gone at this point because this
  // is a fresh page load, so this panel stands on its own.
  if (outcome === 'success') {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-5 px-6 text-center">
        <CheckCircle className="w-14 h-14 text-gold" />
        <h1 className="font-anton text-cream text-3xl tracking-wide">THANK YOU</h1>
        <p className="font-barlow text-cream/60 max-w-md leading-relaxed">
          Your payment went through and your order is recorded. A confirmation is on its way to the
          email address you gave Stripe. We will follow up with shipping details.
        </p>
        <Link
          to="/shop"
          className="font-barlow-condensed text-gold uppercase tracking-wider text-sm hover:underline"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-ink flex flex-col items-center justify-center gap-4 px-6 text-center">
        {outcome === 'canceled' && (
          <p className="font-barlow text-cream/60 max-w-md">
            Checkout was canceled and nothing was charged.
          </p>
        )}
        <p className="font-barlow text-cream/60">Your cart is empty.</p>
        <Link
          to="/shop"
          className="font-barlow-condensed text-gold uppercase tracking-wider text-sm hover:underline"
        >
          Back to Shop
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

  const startCardCheckout = async () => {
    setPayError('');
    setStarting(true);
    try {
      const response = await base44.functions.invoke('createCheckout', {
        items: cart.map((i) => ({
          id: i.product.id,
          size: i.size || '',
          quantity: i.quantity,
        })),
      });
      const data = response?.data ?? response;
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      setPayError(data?.message || 'We could not start checkout. Please order by email below.');
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.data?.message ||
        'We could not start checkout. Please order by email below.';
      setPayError(message);
    } finally {
      setStarting(false);
    }
  };

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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {outcome === 'canceled' && (
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-sm p-4 flex gap-3 items-start">
              <AlertCircle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
              <p className="font-barlow text-cream/70 text-sm">
                Checkout was canceled and nothing was charged. Your cart is still here.
              </p>
            </div>
          )}

          {STRIPE_CHECKOUT_ENABLED ? (
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-sm p-6">
              <h2 className="font-barlow-condensed text-cream/60 text-sm tracking-widest uppercase mb-3">
                Pay securely
              </h2>
              <p className="font-barlow text-cream/70 text-base leading-relaxed mb-4">
                You will be taken to Stripe to pay by card and to enter your shipping address. Prices and
                shipping are calculated on our server, and we never see your card details.
              </p>
              <button
                onClick={startCardCheckout}
                disabled={starting}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gold hover:bg-gold-dark disabled:opacity-60 text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
              >
                {starting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay With Card
                  </>
                )}
              </button>

              {payError && (
                <p className="font-barlow text-red-400/90 text-sm mt-3">{payError}</p>
              )}

              <p className="font-barlow text-cream/40 text-xs mt-4 text-center">
                Prefer not to pay online?{' '}
                <a href={mailto} className="text-gold hover:underline">
                  Send this order by email
                </a>{' '}
                and we will reply with a payment link.
              </p>
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-sm p-6">
              <h2 className="font-barlow-condensed text-cream/60 text-sm tracking-widest uppercase mb-3">
                How ordering works right now
              </h2>
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
                <a href={`mailto:${ORDER_EMAIL}`} className="text-gold hover:underline">
                  {ORDER_EMAIL}
                </a>
                .
              </p>
            </div>
          )}

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
                  {item.product.image && (
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-barlow text-cream/80 text-xs leading-tight truncate">{item.product.name}</p>
                  {item.size && <p className="font-barlow text-cream/30 text-[10px]">Size: {item.size}</p>}
                  <p className="font-barlow text-cream/30 text-[10px]">Qty: {item.quantity}</p>
                </div>
                <p className="font-barlow-condensed text-gold text-sm shrink-0">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.07] pt-4 flex justify-between items-center">
            <p className="font-barlow-condensed text-cream/40 text-xs tracking-wider uppercase">Subtotal</p>
            <p className="font-anton text-gold text-2xl">${total.toFixed(2)}</p>
          </div>
          <p className="font-barlow text-cream/20 text-xs mt-3">
            {STRIPE_CHECKOUT_ENABLED
              ? 'Shipping is added on the Stripe payment page.'
              : 'Shipping is confirmed by email before payment.'}
          </p>
        </div>
      </div>
    </div>
  );
}
