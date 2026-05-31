import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4 text-center">
      <div className="grain-overlay fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.07 }} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <p className="font-anton text-gold text-[8rem] sm:text-[12rem] leading-none">404</p>
        <h1 className="font-barlow-condensed text-cream text-2xl sm:text-3xl tracking-widest uppercase mb-4">
          Page Not Found
        </h1>
        <p className="font-barlow text-cream/50 text-sm mb-10 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
}