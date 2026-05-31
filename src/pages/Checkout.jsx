import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Package, Truck } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { format, addDays } from 'date-fns';

const inputClass = "w-full bg-white border border-ink/15 rounded-sm px-4 py-3 text-ink placeholder:text-ash font-barlow text-sm focus:outline-none focus:border-gold-dark/50 focus:ring-1 focus:ring-gold/20 transition-colors";

function generateOrderNumber() {
  return 'OGW-' + Date.now().toString(36).toUpperCase().slice(-6);
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];
  const total = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', state: '', zip: '' });
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  if (cart.length === 0 && !order) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
        <p className="font-barlow text-ink/60">Your cart is empty.</p>
        <Link to="/shop" className="font-barlow-condensed text-gold-dark uppercase tracking-wider text-sm hover:underline">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const orderNumber = generateOrderNumber();
    const record = await base44.entities.Order.create({
      order_number: orderNumber,
      customer_name: form.name,
      email: form.email,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      items: JSON.stringify(cart.map(i => ({ name: i.product.name, size: i.size, qty: i.quantity, price: i.product.price }))),
      total,
      status: 'pending',
    });
    setSubmitting(false);
    setOrder({ ...record, orderNumber, cartSnapshot: cart, total, estimatedDelivery: format(addDays(new Date(), 7), 'MMMM d, yyyy') });
  };

  if (order) {
    return (
      <div className="min-h-screen bg-cream px-4 py-16">
        <div className="max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            {/* Success header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="font-anton text-ink text-4xl mb-1">ORDER CONFIRMED</h1>
              <p className="font-barlow text-ash text-sm">A confirmation will be sent to <strong className="text-ink">{form.email}</strong></p>
            </div>

            {/* Order number */}
            <div className="bg-ink rounded-sm px-6 py-4 text-center mb-6">
              <p className="font-barlow-condensed text-cream/40 text-xs tracking-widest uppercase mb-1">Order Number</p>
              <p className="font-anton text-gold text-2xl tracking-wider">{order.orderNumber}</p>
            </div>

            {/* Items */}
            <div className="bg-white border border-ink/8 rounded-sm p-5 mb-4">
              <p className="font-barlow-condensed text-ash text-xs tracking-widest uppercase mb-4">Items Ordered</p>
              <div className="space-y-3">
                {order.cartSnapshot.map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-barlow font-semibold text-ink text-sm">{item.product.name}</p>
                      <p className="font-barlow text-ash text-xs">{item.size ? `Size: ${item.size} · ` : ''}Qty: {item.quantity}</p>
                    </div>
                    <p className="font-barlow-condensed text-ink font-semibold text-sm shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-ink/8 mt-4 pt-4 flex justify-between">
                <p className="font-barlow-condensed text-ash text-xs tracking-wider uppercase">Total</p>
                <p className="font-anton text-ink text-xl">${order.total.toFixed(2)}</p>
              </div>
            </div>

            {/* Delivery */}
            <div className="flex items-center gap-3 bg-gold/10 border border-gold/20 rounded-sm px-5 py-4 mb-8">
              <Truck className="w-5 h-5 text-gold-dark shrink-0" />
              <div>
                <p className="font-barlow-condensed text-ink text-sm font-semibold">Estimated Delivery</p>
                <p className="font-barlow text-ink/60 text-xs">{order.estimatedDelivery}</p>
              </div>
            </div>

            <Link
              to="/shop"
              className="block text-center w-full py-3.5 bg-ink hover:bg-ink/80 text-cream font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all"
            >
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.04 }} />

      {/* Header */}
      <header className="bg-ink text-cream px-4 sm:px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-cream/50 hover:text-gold transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-anton text-xl tracking-wider">CHECKOUT</h1>
      </header>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10 grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact */}
            <div className="bg-white border border-ink/8 rounded-sm p-6">
              <h2 className="font-barlow-condensed text-ink text-sm tracking-widest uppercase mb-5">Contact Information</h2>
              <div className="space-y-4">
                <input required placeholder="Full Name *" value={form.name} onChange={set('name')} className={inputClass} />
                <input required type="email" placeholder="Email Address *" value={form.email} onChange={set('email')} className={inputClass} />
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white border border-ink/8 rounded-sm p-6">
              <h2 className="font-barlow-condensed text-ink text-sm tracking-widest uppercase mb-5">Shipping Address</h2>
              <div className="space-y-4">
                <input required placeholder="Street Address *" value={form.address} onChange={set('address')} className={inputClass} />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <input required placeholder="City *" value={form.city} onChange={set('city')} className={`${inputClass} col-span-2 sm:col-span-1`} />
                  <input required placeholder="State *" value={form.state} onChange={set('state')} className={inputClass} />
                  <input required placeholder="ZIP *" value={form.zip} onChange={set('zip')} className={inputClass} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-gold hover:bg-gold-dark disabled:opacity-50 text-ink font-barlow-condensed font-bold text-lg uppercase tracking-wider rounded-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
            >
              {submitting ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order summary */}
        <div className="bg-ink rounded-sm border border-cream/10 p-6 h-fit sticky top-6">
          <div className="flex items-center gap-2 mb-5">
            <Package className="w-4 h-4 text-gold" />
            <p className="font-barlow-condensed text-cream/50 text-xs tracking-widest uppercase">Order Summary</p>
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
                <p className="font-barlow-condensed text-gold text-sm shrink-0">${(item.product.price * item.quantity).toFixed(0)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-cream/10 pt-4 flex justify-between items-center">
            <p className="font-barlow-condensed text-cream/40 text-xs tracking-wider uppercase">Total</p>
            <p className="font-anton text-gold text-2xl">${total.toFixed(2)}</p>
          </div>
          <p className="font-barlow text-cream/20 text-xs mt-3">Shipping & taxes included. Estimated delivery: 5–7 business days.</p>
        </div>
      </div>
    </div>
  );
}