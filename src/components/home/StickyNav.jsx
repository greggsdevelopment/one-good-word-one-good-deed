import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

// Grouped nav sections for desktop dropdown menus
const NAV_GROUPS = [
  {
    label: 'About',
    links: [
      { label: 'About Jason', to: '/about' },
      { label: 'Stories', to: '/stories' },
      { label: 'Gallery', to: '/gallery' },
    ],
  },
  {
    label: 'Programs',
    links: [
      { label: 'School Programs', to: '/programs' },
      { label: 'Events', to: '/events' },
      { label: 'Resources', to: '/resources' },
    ],
  },
  {
    label: 'Get Involved',
    links: [
      { label: 'Take the Pledge', to: '/pledge' },
      { label: 'Donate', to: '/donate' },
      { label: 'Shop Merch', to: '/shop' },
    ],
  },
];

// Flat list for mobile menu
const MOBILE_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About Jason', to: '/about' },
  { label: 'Stories', to: '/stories' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'School Programs', to: '/programs' },
  { label: 'Events', to: '/events' },
  { label: 'Resources', to: '/resources' },
  { label: 'Take the Pledge', to: '/pledge' },
  { label: 'Donate', to: '/donate' },
  { label: 'Shop Merch', to: '/shop' },
];

function DropdownGroup({ group }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 font-barlow-condensed text-sm text-cream/70 hover:text-gold tracking-wider uppercase transition-colors duration-300 min-h-[44px]"
      >
        {group.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-ink/98 backdrop-blur-md border border-cream/10 rounded-sm shadow-xl shadow-black/40 py-1 z-50"
          >
            {group.links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 font-barlow-condensed text-sm text-cream/70 hover:text-gold hover:bg-white/5 tracking-wider uppercase transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StickyNav({ logoUrl }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleScroll = (e, href) => {
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
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 min-h-[44px]">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="One Good Word One Good Deed"
                  className="h-11 w-11 md:h-12 md:w-12 rounded-full object-cover shrink-0 ring-2 ring-gold/60"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <span className="font-barlow-condensed text-cream text-sm md:text-base font-semibold tracking-wide leading-tight hidden sm:block">
                ONE GOOD WORD...<br className="hidden md:block" />ONE GOOD DEED
              </span>
            </Link>

            {/* Desktop grouped nav */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              <Link
                to="/"
                className="font-barlow-condensed text-sm text-cream/70 hover:text-gold tracking-wider uppercase transition-colors duration-300 min-h-[44px] flex items-center"
              >
                Home
              </Link>
              {NAV_GROUPS.map((group) => (
                <DropdownGroup key={group.label} group={group} />
              ))}
              <a
                href="#contact"
                onClick={(e) => handleScroll(e, '#contact')}
                className="font-barlow-condensed text-sm text-cream/70 hover:text-gold tracking-wider uppercase transition-colors duration-300 min-h-[44px] flex items-center"
              >
                Contact
              </a>
              <a
                href="#pledge"
                onClick={(e) => handleScroll(e, '#pledge')}
                className="ml-1 px-5 py-3 bg-gold hover:bg-gold-dark text-ink font-barlow-condensed font-bold text-sm uppercase tracking-wider rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20 min-h-[44px] flex items-center"
              >
                Join the Movement
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-cream p-3 -mr-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <div className="w-6 flex flex-col gap-[5px]">
                <span className={`block h-[2px] bg-cream rounded-full transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block h-[2px] bg-cream rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-[2px] bg-cream rounded-full transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
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
            className="fixed inset-0 z-40 bg-ink/98 backdrop-blur-lg flex flex-col pt-20 pb-10 px-8 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-1 flex-1 justify-center">
              {MOBILE_LINKS.map((link, i) => (
                <motion.div
                  key={link.to + link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="font-anton text-gold text-3xl leading-tight tracking-wide uppercase py-1.5 min-h-[48px] flex items-center"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: MOBILE_LINKS.length * 0.05 }}
              >
                <a
                  href="#contact"
                  onClick={(e) => handleScroll(e, '#contact')}
                  className="font-anton text-gold text-3xl leading-tight tracking-wide uppercase py-1.5 min-h-[48px] flex items-center"
                >
                  Contact
                </a>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-3 mt-6"
            >
              <a
                href="#pledge"
                onClick={(e) => handleScroll(e, '#pledge')}
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