import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CartDrawer from '@/components/shop/CartDrawer';

const PRODUCTS = [
  {
    id: 'tshirt',
    name: 'Stand Up T-Shirt',
    tagline: '"Stand Up. Speak Love."',
    description: 'Unisex heavyweight cotton tee. Available in S–2XL.',
    price: 28,
    priceId: 'price_1TcVzRK1VNI2XyV9sCa1ItDQ',
    emoji: '👕',
    color: 'Black',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'hoodie',
    name: 'One Good Word Hoodie',
    tagline: 'One Good Word...One Good Deed',
    description: 'Premium pullover hoodie, fleece-lined. Available in S–2XL.',
    price: 45,
    priceId: 'price_1TcVzRK1VNI2XyV9JxqlgsgQ',
    emoji: '🧥',
    color: 'Black',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'hat',
    name: 'Love Over Hate Hat',
    tagline: 'Love Over Hate',
    description: 'Structured snapback with embroidered gold logo. One size fits most.',
    price: 22,
    priceId: 'price_1TcVzRK1VNI2XyV9PNxbbrFn',
    emoji: '🧢',
    color: 'Black / Gold',
    sizes: ['One Size'],
  },
  {
    id: 'tote',
    name: "God's Love Tote Bag",
    tagline: "Carry God's Love",
    description: 'Heavy canvas tote with gold screen print. 15" x 16".',
    price: 15,
    priceId: 'price_1TcVzRK1VNI2XyV91Nrnleey',
    emoji: '👜',
    color: 'Natural / Gold',
    sizes: ['One Size'],
  },
  {
    id: 'wristband',
    name: 'Movement Wristband',
    tagline: 'Wear the Movement',
    description: 'Silicone wristband with debossed text. Pack of 3.',
    price: 5,
    priceId: 'price_1TcVzRK1VNI2XyV99q1Bsmbg',
    emoji: '📿',
    color: 'Gold',
    sizes: ['One Size'],
  },
];

export default function Shop() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [searchParams] = useSearchParams();

  const success = searchParams.get('success') === 'true';
  const canceled = searchParams.get('canceled') === 'true';

  const addToCart = (product, size) => {
    setCart((prev) => {
      const key = `${product.id}-${size}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => i.key === key ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { key, product, size, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((i) => i.key === key ? { ...i, quantity: i.quantity + delta } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (key) => setCart((prev) => prev.filter((i) => i.key !== key));

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (window.self !== window.top) {
      alert('Checkout is only available from the published app. Please open the app in a new tab.');
      return;
    }
    setLoadingCheckout(true);
    const items = cart.map((i) => ({ priceId: i.product.priceId, quantity: i.quantity }));
    const res = await base44.functions.invoke('createCheckout', {
      items,
      successUrl: `${window.location.origin}/shop?success=true`,
      cancelUrl: `${window.location.origin}/shop?canceled=true`,
    });
    setLoadingCheckout(false);
    if (res.data?.url) {
      window.location.href = res.data.url;
    }
  };

  return (
    <div className="min-h-screen bg-ink">
      {/* Grain */}
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-cream/70 hover:text-gold transition-colors font-barlow-condensed text-sm tracking-wider uppercase">
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
          <p className="font-anton text-cream text-lg tracking-wider">MERCH STORE</p>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 border border-white/10 hover:border-gold/40 rounded-sm text-cream hover:text-gold transition-all font-barlow-condensed text-sm tracking-wider uppercase"
          >
            <ShoppingCart className="w-4 h-4" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-ink text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Success / Cancel banners */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 flex items-center gap-3 bg-green-900/30 border border-green-500/30 rounded-sm px-6 py-4 text-green-300 font-barlow"
            >
              <CheckCircle className="w-5 h-5 shrink-0" />
              Thank you for your order! You'll receive a confirmation email shortly.
            </motion.div>
          )}
          {canceled && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 flex items-center gap-3 bg-yellow-900/30 border border-yellow-500/30 rounded-sm px-6 py-4 text-yellow-300 font-barlow"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              Checkout was canceled. Your cart is still saved.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero */}
        <div className="text-center mb-16">
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4">
            Wear the Movement
          </p>
          <h1 className="font-anton text-cream text-5xl sm:text-7xl md:text-8xl leading-[0.92] mb-6">
            MERCH &amp;<br />MOVEMENT
          </h1>
          <p className="font-barlow text-cream/60 text-lg max-w-xl mx-auto">
            Every purchase helps spread the message — one good word, one good deed at a time.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} onAddToCart={addToCart} />
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQty={updateQty}
        onRemove={removeItem}
        total={cartTotal}
        onCheckout={handleCheckout}
        loading={loadingCheckout}
      />
    </div>
  );
}

function ProductCard({ product, index, onAddToCart }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-white/[0.03] border border-white/[0.07] rounded-sm overflow-hidden hover:border-gold/25 hover:bg-white/[0.05] transition-all duration-400"
    >
      {/* Product visual */}
      <div className="relative h-52 bg-gradient-to-br from-white/[0.05] to-transparent flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'radial-gradient(ellipse at center, rgba(230,180,80,0.10) 0%, transparent 70%)' }}
        />
        <span className="text-7xl select-none group-hover:scale-110 transition-transform duration-400">
          {product.emoji}
        </span>
        <div className="absolute bottom-3 right-3">
          <span className="font-barlow-condensed text-xs text-cream/30 tracking-wider uppercase bg-white/[0.06] px-2 py-1 rounded-sm">
            {product.color}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <p className="font-barlow-condensed text-gold text-xs tracking-[0.25em] uppercase mb-1">
          {product.tagline}
        </p>
        <h3 className="font-anton text-cream text-2xl leading-tight mb-2">{product.name}</h3>
        <p className="font-barlow text-cream/50 text-sm leading-relaxed mb-5">{product.description}</p>

        {/* Size selector */}
        {product.sizes.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-5">
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
        )}

        {/* Price + Add */}
        <div className="flex items-center justify-between">
          <p className="font-anton text-gold text-3xl">${product.price}</p>
          <button
            onClick={handleAdd}
            className={`px-5 py-2.5 font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 ${
              added
                ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                : 'bg-gold hover:bg-gold-dark text-ink hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20'
            }`}
          >
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}