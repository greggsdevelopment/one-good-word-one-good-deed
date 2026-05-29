import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from '@/hooks/useInView';

const FEATURED = [
  {
    id: 'bw-dove-shirt',
    name: 'Black & White Dove Shirt',
    price: 25,
    description: 'Iconic dove logo on black. Stand up against bullying and racism.',
    image: 'https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0ODUwLCJwdXIiOiJibG9iX2lkIn19--ea2a89155cd66f708ebe3915fc4218705ad8225c/scaled_1000004465.png',
  },
  {
    id: 'bw-hoodie',
    name: 'Black & White Hoodie',
    price: 60,
    description: 'Premium black hoodie with design on front and back. Make a statement.',
    image: 'https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0ODQ0LCJwdXIiOiJibG9iX2lkIn19--460b2114e575ffd498248e91cffc2d8386f96dc8/scaled_1000005359.png',
  },
  {
    id: 'wristbands',
    name: 'Awareness Wristbands',
    price: 2,
    description: 'Engraved silicone wristbands. Perfect for schools and events.',
    image: 'https://jim-catalog-api.jim.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6Mzk0ODE4LCJwdXIiOiJibG9iX2lkIn19--db123867164ff150d78029c2c77f5a561bcb9bb7/scaled_1000005717.jpg',
  },
];

export default function FeaturedProducts() {
  const [ref, inView] = useInView(0.1);

  return (
    <section className="relative bg-ink py-24 md:py-32 px-6 overflow-hidden" ref={ref}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-barlow-condensed text-gold text-xs tracking-[0.35em] uppercase mb-3"
          >
            Wear the Movement
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-anton text-cream text-5xl sm:text-6xl leading-[0.92] mb-4"
          >
            FEATURED<br /><span className="text-gold">MERCH</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-barlow text-cream/50 text-lg max-w-xl mx-auto"
          >
            Every purchase spreads the message and supports the mission.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {FEATURED.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              className="group bg-white/[0.03] border border-white/[0.07] rounded-sm overflow-hidden hover:border-gold/25 transition-all duration-300"
            >
              <div className="h-52 bg-white/[0.03] flex items-center justify-center overflow-hidden">
                <div className="flex flex-col items-center gap-2">
                  <p className="font-anton text-cream/20 text-2xl tracking-widest uppercase">Coming Soon</p>
                  <div className="w-10 h-px bg-gold/30" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-anton text-cream text-xl leading-tight mb-1">{product.name}</h3>
                <p className="font-barlow text-cream/40 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-anton text-gold text-2xl">${product.price}</span>
                  <Link
                    to="/shop"
                    className="px-4 py-2 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gold/40 text-gold hover:bg-gold hover:text-ink font-barlow-condensed font-bold text-base uppercase tracking-wider rounded-sm transition-all duration-300"
          >
            View All Products
          </Link>
        </motion.div>
      </div>
    </section>
  );
}