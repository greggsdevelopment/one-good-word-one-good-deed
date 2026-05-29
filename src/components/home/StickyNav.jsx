import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  const handleNav = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ink/95 backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo + Name */}
          <a href="#hero" onClick={(e) => handleNav(e, '#hero')} className="flex items-center gap-3 shrink-0">
            {logoUrl && (
              <img src={logoUrl} alt="One Good Word One Good Deed" className="h-9 w-9 md:h-10 md:w-10 rounded-full object-cover" />
            )}
            <span className="font-barlow-condensed text-cream text-sm md:text-base font-semibold tracking-wide leading-tight hidden sm:block">
              ONE GOOD WORD...<br className="hidden md:block" />ONE GOOD DEED
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="font-barlow-condensed text-sm text-cream/70 hover:text-gold tracking-wider uppercase transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pledge"
              onClick={(e) => handleNav(e, '#pledge')}
              className="ml-2 px-5 py-2.5 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
            >
              Join the Movement
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-cream p-2"
            aria-label="Toggle menu"
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`block h-0.5 bg-cream transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 bg-cream transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 bg-cream transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-ink/98 backdrop-blur-md border-t border-white/5"
        >
          <div className="px-6 py-6 space-y-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="block font-barlow-condensed text-lg text-cream/80 hover:text-gold tracking-wider uppercase transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#pledge"
              onClick={(e) => handleNav(e, '#pledge')}
              className="block text-center mt-4 px-5 py-3 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold uppercase tracking-wider rounded-sm transition-all"
            >
              Join the Movement
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
}