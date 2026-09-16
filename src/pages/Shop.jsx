import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, CheckCircle, AlertCircle, Truck, Eye, Ruler } from 'lucide-react';
import StickyNav from '@/components/home/StickyNav';
import FooterSection from '@/components/home/FooterSection';
import CartDrawer from '@/components/shop/CartDrawer';
import FilterSortBar from '@/components/shop/FilterSortBar';
import SizeGuideModal from '@/components/shop/SizeGuideModal';
import QuickViewModal from '@/components/shop/QuickViewModal';
import StickyCartBar from '@/components/shop/StickyCartBar';
import ShopShowcase from '@/components/shop/ShopShowcase';

const LOGO_URL = 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/1824cf861_IMG_5119.png';
const SERIF = { fontFamily: "'Cormorant Garamond', serif" };

const PRODUCTS = [
  {
    id: 'bw-dove-shirt',
    name: 'Black & White Dove Shirt',
    description: 'One Good Word One Good Deed dove logo design on black shirt. Stand up against bullying and racism.',
    price: 25,
    category: 'T-Shirts',
    featured: true,
    imageZoom: 2.0,
    imageOrigin: 'center 40%',
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
    imageZoom: 2.2,
    imageOrigin: 'center 45%',
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
    imageZoom: 2.2,
    imageOrigin: 'center 35%',
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
    imageZoom: 2.0,
    imageOrigin: 'center 40%',
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
  {
    id: 'ogw-ogd-colorful-shirt',
    name: 'One Good Word One Good Deed T-Shirt',
    description: 'Stop Bullying. Stop Racism. One Good Word, One Good Deed. Colorful tie-dye border design on black shirt.',
    price: 25,
    category: 'T-Shirts',
    featured: true,
    image: 'https://media.base44.com/images/public/6a19e1fc6c5eb736a0763b09/3cd386384_IMG_7343.jpeg',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    imageZoom: 1.5,
    imageOrigin: 'center',
  },
];

export default function Shop() {
  const navigate = useNavigate();
  const gridRef = useRef(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loadingCheckout] = useState(false);
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const success = searchParams.get('success') === 'true';
  const canceled = searchParams.get('canceled') === 'true';

  useEffect(() => {
    document.title = 'Shop | One Good Word One Good Deed';
  }, []);

  const addToCart = (product, size) => {
    setCart((prev) => {
      const key = `${product.id}-${size}`;
      const existing = prev.find((i) => i.key === key);
      if (existing) return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { key, product, size, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (key, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (key) => setCart((prev) => prev.filter((i) => i.key !== key));

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate('/checkout', { state: { cart } });
  };

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const filtered = PRODUCTS.filter(
    (p) => activeCategory === 'All' || p.category === activeCategory
  ).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  const showcaseProducts = PRODUCTS.filter((p) => p.featured);

  return (
    <div className="min-h-screen bg-ink pb-24">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <StickyNav logoUrl={LOGO_URL} />

      <ShopShowcase
        products={showcaseProducts}
        onQuickView={setQuickViewProduct}
        onBrowse={scrollToGrid}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14">
        {/* Order status banners */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 flex items-center gap-3 bg-green-900/30 border border-green-500/30 rounded-sm px-6 py-4 text-green-300 font-barlow"
            >
              <CheckCircle className="w-5 h-5 shrink-0" />
              Thank you for your order! You&apos;ll receive a confirmation email shortly.
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

        {/* Collection header */}
        <div ref={gridRef} className="scroll-mt-24 mb-10">
          <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-gold/15">
            <div>
              <p className="font-barlow-condensed text-gold text-[10px] tracking-[0.35em] uppercase mb-2">
                The Collection
              </p>
              <h2 className="font-anton text-cream text-3xl sm:text-4xl tracking-wide">
                EVERY PIECE
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-barlow text-cream/40 text-sm hidden sm:block">
                {filtered.length} item{filtered.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2.5 border border-gold/30 hover:border-gold/70 rounded-sm text-gold font-barlow-condensed text-sm tracking-wider uppercase transition-colors"
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
          </div>

          {/* Free shipping note */}
          <div className="flex items-center justify-center gap-3 border border-gold/20 bg-gold/[0.06] rounded-sm px-6 py-3 mt-6">
            <Truck className="w-4 h-4 text-gold shrink-0" />
            <p className="font-barlow-condensed text-gold text-sm tracking-wider uppercase">
              Free shipping on orders over $75
            </p>
          </div>
        </div>

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

        {/* Closing note */}
        <div className="mt-20 pt-10 border-t border-gold/15 text-center max-w-2xl mx-auto">
          <p className="text-cream/60 text-lg md:text-xl leading-relaxed italic" style={SERIF}>
            Every order pays for wristbands we hand out for free, and for the next
            assembly in the next gym. Thank you for wearing it out loud.
          </p>
        </div>
      </main>

      <FooterSection logoUrl={LOGO_URL} />

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

      <StickyCartBar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setCartOpen(true)}
        onCheckout={handleCheckout}
        loading={loadingCheckout}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />
    </div>
  );
}

function ProductCard({ product, index, onAddToCart, onQuickView }) {
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
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, delay: Math.min(index * 0.06, 0.4) }}
        className="group relative flex flex-col bg-white/[0.02] border border-gold/15 rounded-sm overflow-hidden transition-all duration-500 hover:border-gold/50 hover:bg-white/[0.04] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
      >
        {/* Image */}
        <button
          type="button"
          onClick={onQuickView}
          aria-label={`Quick view ${product.name}`}
          className="relative block w-full overflow-hidden bg-black/40 aspect-[4/5]"
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-4 transition-transform [transition-duration:1100ms] ease-out group-hover:scale-[1.07]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="font-anton text-cream/20 text-2xl tracking-widest">COMING SOON</p>
            </div>
          )}

          {/* Hover veil */}
          <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500" />
          <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="flex items-center gap-2 border border-gold/50 bg-ink/85 px-4 py-2 rounded-sm text-gold font-barlow-condensed text-xs uppercase tracking-[0.2em]">
              <Eye className="w-3.5 h-3.5" /> Quick View
            </span>
          </span>

          {product.featured && (
            <span className="absolute top-3 left-3 bg-gold text-ink text-[10px] font-barlow-condensed font-bold px-2.5 py-1 rounded-sm tracking-[0.15em] uppercase">
              Featured
            </span>
          )}

          {/* Corner accent, drawn on hover */}
          <span className="absolute bottom-0 right-0 w-0 h-0 border-b-2 border-r-2 border-gold transition-all duration-500 group-hover:w-8 group-hover:h-8" aria-hidden="true" />
        </button>

        {/* Info */}
        <div className="flex flex-col flex-grow p-5">
          <h3 className="font-anton text-cream text-lg leading-tight tracking-wide mb-2 transition-colors duration-300 group-hover:text-gold">
            {product.name}
          </h3>
          <p className="text-cream/50 text-sm leading-relaxed mb-5 flex-grow" style={SERIF}>
            {product.description}
          </p>

          {product.sizes.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-2.5 py-1 text-xs font-barlow-condensed tracking-wider uppercase rounded-sm border transition-all ${
                      selectedSize === size
                        ? 'border-gold bg-gold/15 text-gold'
                        : 'border-cream/10 text-cream/40 hover:border-cream/30 hover:text-cream/70'
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
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gold/10">
            <p className="font-anton text-gold text-3xl leading-none">${product.price}</p>
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

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}