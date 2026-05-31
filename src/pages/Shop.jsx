import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, ArrowLeft, CheckCircle, AlertCircle, Truck, Eye, Ruler } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CartDrawer from '@/components/shop/CartDrawer';
import FilterSortBar from '@/components/shop/FilterSortBar';
import SizeGuideModal from '@/components/shop/SizeGuideModal';
import QuickViewModal from '@/components/shop/QuickViewModal';
import StickyCartBar from '@/components/shop/StickyCartBar';

const PRODUCTS = [
  {
    id: 'bw-dove-shirt',
    name: 'Black & White Dove Shirt',
    description: 'One Good Word One Good Deed dove logo design on black shirt. Stand up against bullying and racism.',
    price: 25,
    category: 'T-Shirts',
    featured: true,
        imageZoom: 2.0, imageOrigin: 'center 40%',
    image: 'https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0ODUwLCJwdXIiOiJibG9iX2lkIn19--ea2a89155cd66f708ebe3915fc4218705ad8225c/scaled_1000004465.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'blue-yellow-logo-shirt',
    name: 'Blue & Yellow T-Shirt Logo',
    description: 'Stop Bullying. Stop Racism. Blue and yellow circular logo design. One Good Word, One Good Deed.',
    price: 25,
    category: 'T-Shirts',
    featured: false,
    image: 'https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0ODQ3LCJwdXIiOiJibG9iX2lkIn19--159e72f4d5de7284389fa53b72e4555d12dc906c/scaled_1000005788.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
        imageZoom: 2.2, imageOrigin: 'center 45%',
  },
  {
    id: 'blue-white-letters-shirt',
    name: 'Blue & White T-Shirt Letters',
    description: 'Blue t-shirt with bold ONE GOOD WORD lettering. Wear the movement.',
    price: 25,
    category: 'T-Shirts',
    featured: false,
    image: 'https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0ODQ1LCJwdXIiOiJibG9iX2lkIn19--8f6aedb7b4692f29d04c938e29e3beaec387bb7b/scaled_1000004624.jpg',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'bw-hoodie',
    name: 'Black & White Hoodie Front & Back',
    description: 'Premium black hoodie with One Good Word design on front and back. Make a statement.',
    price: 60,
    category: 'Hoodies',
    featured: true,
    image: 'https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0ODQ0LCJwdXIiOiJibG9iX2lkIn19--460b2114e575ffd498248e91cffc2d8386f96dc8/scaled_1000005359.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'bw-letters-shirt',
    name: 'Black White ONE GOOD WORD T-Shirt',
    description: 'Bold ONE GOOD WORD ONE GOOD DEED lettering in black and white. Wear the message.',
    price: 25,
    category: 'T-Shirts',
    featured: false,
    image: 'https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0ODQwLCJwdXIiOiJibG9iX2lkIn19--afc8497e7685f986908e121f4db41331ddd1ce30/scaled_1000005645.jpg',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'blue-black-shirt',
    name: 'Blue Black T-Shirt',
    description: 'Stop Bullying. Stop Racism. Blue and black design with the One Good Word movement logo.',
    price: 25,
    category: 'T-Shirts',
    featured: false,
    image: 'https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0ODMzLCJwdXIiOiJibG9iX2lkIn19--e02449b1ccbeeecc3efb8348670af1235b4fd92f/scaled_1000005772.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'wool-coat-silver',
    name: 'Wool Coat – Silver & Black Logo',
    description: 'Premium wool coat with silver and black One Good Word One Good Deed logo. Make a bold statement.',
    price: 120,
    category: 'Coats',
    featured: true,
    image: 'https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0ODMwLCJwdXIiOiJibG9iX2lkIn19--12976cbb61d96214d913fe9d83c9446ca868c0b1/scaled_1000005762.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'wool-coat-varsity',
    name: 'Wool Coat – One Good Word One Good Deed',
    description: 'Varsity-style wool coat with red trim and the One Good Word One Good Deed logo patch. Premium outerwear.',
    price: 120,
    category: 'Coats',
    featured: false,
    image: 'https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0ODI2LCJwdXIiOiJibG9iX2lkIn19--b6b52733bb8a9da1a5821a22ad6868b8036d2d87/scaled_1000005835.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
        imageZoom: 2.0, imageOrigin: 'center 40%',
  },
  {
    id: 'red-black-shirt',
    name: 'Red Black T-Shirt',
    description: 'Stop Bullying. Stop Racism. Red and black circular design. One Good Word, One Good Deed.',
    price: 25,
    category: 'T-Shirts',
    featured: false,
    image: 'https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0ODIyLCJwdXIiOiJibG9iX2lkIn19--7eef1ac795abc37562a086352a299d0693f7efc4/scaled_1000005289.png',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
  },
  {
    id: 'wristbands',
    name: 'Awareness Wristbands',
    description: 'Black silicone wristbands with ONE GOOD WORD and ONE GOOD DEED engraved text. Raise awareness.',
    price: 2,
    category: 'Accessories',
    featured: false,
    image: 'https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0ODE4LCJwdXIiOiJibG9iX2lkIn19--db123867164ff150d78029c2c77f5a561bcb9bb7/scaled_1000005717.jpg',
    sizes: [],
  },
];

export default function Shop() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const success = searchParams.get('success') === 'true';
  const canceled = searchParams.get('canceled') === 'true';

  const addToCart = (product, size) => {
    setCart((prev) => {
      const key = `${product.id}-${size}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => i.key === key ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { key, product, size, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (key, delta) => {
    setCart((prev) => prev.map((i) => i.key === key ? { ...i, quantity: i.quantity + delta } : i).filter((i) => i.quantity > 0));
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
    const items = cart.map((i) => ({ name: i.product.name, price: Math.round(i.product.price * 100), quantity: i.quantity, image: i.product.image }));
    const res = await base44.functions.invoke('createCheckout', {
      items,
      successUrl: `${window.location.origin}/shop?success=true`,
      cancelUrl: `${window.location.origin}/shop?canceled=true`,
    });
    setLoadingCheckout(false);
    if (res.data?.url) window.location.href = res.data.url;
  };

  // Filter + Sort
  const filtered = PRODUCTS
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // featured: featured first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });

  const featuredProducts = PRODUCTS.filter(p => p.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-ink pb-24">
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
        {/* Banners */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-8 flex items-center gap-3 bg-green-900/30 border border-green-500/30 rounded-sm px-6 py-4 text-green-300 font-barlow">
              <CheckCircle className="w-5 h-5 shrink-0" />
              Thank you for your order! You'll receive a confirmation email shortly.
            </motion.div>
          )}
          {canceled && (
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-8 flex items-center gap-3 bg-yellow-900/30 border border-yellow-500/30 rounded-sm px-6 py-4 text-yellow-300 font-barlow">
              <AlertCircle className="w-5 h-5 shrink-0" />
              Checkout was canceled. Your cart is still saved.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero */}
        <div className="text-center mb-8">
          <p className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-4">Wear the Movement</p>
          <h1 className="font-anton text-cream text-5xl sm:text-7xl md:text-8xl leading-[0.92] mb-6">
            MERCH &amp;<br />MOVEMENT
          </h1>
          <p className="font-barlow text-cream/60 text-lg max-w-xl mx-auto">
            Every purchase helps spread the message — one good word, one good deed at a time.
          </p>
        </div>

        {/* Free shipping banner */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 bg-gold/10 border border-gold/20 rounded-sm px-6 py-3 mb-10 text-center"
        >
          <Truck className="w-4 h-4 text-gold shrink-0" />
          <p className="font-barlow-condensed text-gold text-sm tracking-wider uppercase">
            Free shipping on orders over $75
          </p>
        </motion.div>

        {/* Filter + Sort */}
        <FilterSortBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onAddToCart={addToCart}
              onQuickView={() => setQuickViewProduct(product)}
            />
          ))}
        </div>

        {/* Customers Also Love */}
        <div className="mt-24">
          <div className="text-center mb-8">
            <p className="font-barlow-condensed text-gold text-xs tracking-[0.3em] uppercase mb-2">Customers Also Love</p>
            <h2 className="font-anton text-cream text-3xl sm:text-4xl tracking-wide">STAFF PICKS</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard
                key={`featured-${product.id}`}
                product={product}
                index={i}
                onAddToCart={addToCart}
                onQuickView={() => setQuickViewProduct(product)}
                compact
              />
            ))}
          </div>
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

      {/* Sticky Cart Bar */}
      <StickyCartBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setCartOpen(true)}
        onCheckout={handleCheckout}
        loading={loadingCheckout}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
}

function ProductCard({ product, index, onAddToCart, onQuickView, compact }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="group bg-white/[0.03] border border-white/[0.07] rounded-sm overflow-hidden hover:border-gold/25 hover:bg-white/[0.05] transition-all duration-400"
      >
        {/* Image */}
        <div
          className="relative overflow-hidden cursor-pointer"
          style={{ height: compact ? '200px' : '260px' }}
          onClick={onQuickView}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500"                  style={{ transform: `scale(${product.imageZoom || 1})`, transformOrigin: product.imageOrigin || 'center center' }}
            />
          ) : (
            <div className="w-full h-full bg-white/[0.03] flex items-center justify-center">
              <p className="font-anton text-cream/20 text-2xl tracking-widest">COMING SOON</p>
            </div>
          )}
          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-2 bg-ink/80 border border-cream/20 px-4 py-2 rounded-sm text-cream font-barlow-condensed text-sm tracking-wider uppercase">
              <Eye className="w-4 h-4" /> Quick View
            </div>
          </div>
          {product.featured && (
            <div className="absolute top-3 left-3 bg-gold text-ink text-xs font-barlow-condensed font-bold px-2 py-1 rounded-sm tracking-wider uppercase">
              Featured
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="font-anton text-cream text-xl leading-tight mb-1">{product.name}</h3>
          {!compact && <p className="font-barlow text-cream/50 text-sm leading-relaxed mb-4">{product.description}</p>}

          {/* Size selector */}
          {product.sizes.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-2.5 py-1 text-xs font-barlow-condensed tracking-wider uppercase rounded-sm border transition-all ${
                        selectedSize === size
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-white/10 text-cream/40 hover:border-white/25 hover:text-cream/70'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-cream/25 hover:text-gold text-xs font-barlow transition-colors ml-2 shrink-0"
                >
                  <Ruler className="w-3 h-3" /> Guide
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="font-anton text-gold text-3xl">${product.price}</p>
            <button
              onClick={handleAdd}
              className={`px-4 py-2.5 font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 ${
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

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}