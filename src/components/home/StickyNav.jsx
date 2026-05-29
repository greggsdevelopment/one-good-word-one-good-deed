import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Mission', href: '#mission' },
  { label: 'Pillars', href: '#pillars' },
  { label: 'Take the Pledge', href: '#pledge' },
  { label: 'Get Involved', href: '#involved' },
  { label: 'Contact', href: '#contact' },
];

export default function StickyNav({ logoUrl }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNav = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-ink/95 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo + Name */}
            <a
              href="#hero"
              onClick={(e) => handleNav(e, '#hero')}
              className="flex items-center gap-3 shrink-0 min-h-[44px]"
            >
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="One Good Word One Good Deed"
                  className="h-11 w-11 md:h-12 md:w-12 rounded-full object-cover shrink-0 ring-2 ring-gold/60"
                />
              )}
              <span className="font-barlow-condensed text-cream text-sm md:text-base font-semibold tracking-wide leading-tight hidden sm:block">
                ONE GOOD WORD...<br className="hidden md:block" />ONE GOOD DEED
              </span>
            </a>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNav(e, link.href)}
                  className="font-barlow-condensed text-sm text-cream/70 hover:text-gold tracking-wider uppercase transition-colors duration-300 min-h-[44px] flex items-center"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/shop"
                className="font-barlow-condensed text-sm text-cream/70 hover:text-gold tracking-wider uppercase transition-colors duration-300 min-h-[44px] flex items-center"
              >
                Shop
              </Link>
              <a
                href="#pledge"
                onClick={(e) => handleNav(e, '#pledge')}
                className="ml-2 px-5 py-3 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20 min-h-[44px] flex items-center"
              >
                Join the Movement
              </a>
            </div>

            {/* Mobile hamburger — large tap target */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-cream p-3 -mr-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <div className="w-6 flex flex-col gap-[5px]">
                <span
                  className={`block h-[2px] bg-cream rounded-full transition-all duration-300 origin-center ${
                    menuOpen ? 'rotate-45 translate-y-[7px]' : ''
                  }`}
                />
                <span
                  className={`block h-[2px] bg-cream rounded-full transition-all duration-300 ${
                    menuOpen ? 'opacity-0 scale-x-0' : ''
                  }`}
                />
                <span
                  className={`block h-[2px] bg-cream rounded-full transition-all duration-300 origin-center ${
                    menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-ink/98 backdrop-blur-lg flex flex-col pt-20 pb-10 px-8 lg:hidden"
          >
            <div className="flex flex-col gap-2 flex-1 justify-center">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={(e) => handleNav(e, link.href)}
                  className="font-anton text-cream/80 hover:text-gold text-4xl leading-tight tracking-wide uppercase transition-colors py-2 min-h-[56px] flex items-center"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col gap-3"
            >
              <Link
                to="/shop"
                onClick={() => setMenuOpen(false)}
                className="block text-center px-6 py-4 border-2 border-gold/40 text-gold font-barlow-condensed font-bold text-xl uppercase tracking-wider rounded-sm transition-all min-h-[56px] flex items-center justify-center"
              >
                Shop Merch
              </Link>
              <a
                href="#pledge"
                onClick={(e) => handleNav(e, '#pledge')}
                className="block text-center px-6 py-4 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-xl uppercase tracking-wider rounded-sm transition-all min-h-[56px] flex items-center justify-center"
              >
                Join the Movement
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}