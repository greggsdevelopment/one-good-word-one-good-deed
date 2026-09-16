import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, Shield, Menu, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const DONATE_URL =
  'https://www.gofundme.com/f/support-one-good-word-one-good-deeds-mission';

// The four foundations of the movement. Always visible, never buried.
const PRIMARY_LINKS = [
  { label: 'Remember Drayke', to: '/drayke' },
  { label: 'Pledge Wall', to: '/pledge-wall' },
  { label: 'Shop', to: '/shop' },
  { label: 'Programs', to: '/programs' },
];

const NAV_GROUPS = [
  {
    label: 'About',
    links: [
      { label: 'About Jason', to: '/about' },
      { label: 'About Cody', to: '/about-cody' },
      { label: 'Our Stories', to: '/stories' },
      { label: 'Events', to: '/events' },
      { label: 'Gallery', to: '/gallery' },
      { label: 'Resources', to: '/resources' },
    ],
  },
  {
    label: 'Sponsors',
    links: [
      { label: 'Hall of Fame', to: '/hall-of-fame' },
      { label: 'Become a Sponsor', to: '/sponsorship' },
    ],
  },
];

function NavLink({ to, children, active }) {
  return (
    <Link
      to={to}
      className="relative group px-3 py-2 text-sm font-medium uppercase tracking-wider whitespace-nowrap transition-colors text-cream hover:text-gold"
    >
      {children}
      <span
        className={`absolute left-3 right-3 -bottom-0.5 h-px bg-gold origin-left transition-transform duration-300 ${
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />
    </Link>
  );
}

export default function StickyNav({ logoUrl }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [mobileOpenGroup, setMobileOpenGroup] = useState(null);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (authed) {
          const me = await base44.auth.me();
          setUser(me);
        }
      } catch (err) {
        console.error('Auth check error:', err);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenGroup(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close everything whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
    setMobileOpenGroup(null);
    setOpenGroup(null);
  }, [pathname]);

  const toggleGroup = (label) => setOpenGroup((prev) => (prev === label ? null : label));
  const toggleMobileGroup = (label) =>
    setMobileOpenGroup((prev) => (prev === label ? null : label));

  const groupActive = (group) => group.links.some((l) => l.to === pathname);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ink/95 shadow-lg shadow-black/40 backdrop-blur-md border-b border-gold/10'
          : 'bg-ink/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="One Good Word"
                className="h-10 w-10 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            <span className="text-cream font-bold text-sm hidden sm:block leading-tight tracking-wide">
              ONE GOOD WORD
              <br />
              <span className="text-gold text-xs font-normal">ONE GOOD DEED</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center" ref={dropdownRef}>
            {PRIMARY_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} active={pathname === link.to}>
                {link.label}
              </NavLink>
            ))}

            <span className="w-px h-5 bg-cream/15 mx-3" aria-hidden="true" />

            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="relative">
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
                    groupActive(group) || openGroup === group.label
                      ? 'text-gold'
                      : 'text-cream/70 hover:text-gold'
                  }`}
                >
                  {group.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      openGroup === group.label ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openGroup === group.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-52 bg-ink border border-gold/25 rounded-sm shadow-xl shadow-black/60 z-50 py-1.5"
                    >
                      {group.links.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          onClick={() => setOpenGroup(null)}
                          className={`block px-4 py-2 text-sm transition-colors ${
                            pathname === link.to
                              ? 'text-gold bg-gold/10'
                              : 'text-cream/70 hover:bg-gold/10 hover:text-gold'
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <NavLink to="/contact" active={pathname === '/contact'}>
              Contact
            </NavLink>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-1 ml-2 text-gold hover:text-ink hover:bg-gold border border-gold/50 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
              >
                <Shield size={12} />
                Admin
              </Link>
            )}
          </nav>

          {/* Donate (desktop) */}
          <div className="hidden lg:flex items-center flex-shrink-0">
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold hover:bg-gold-dark text-ink font-bold text-sm uppercase tracking-wider px-5 py-2.5 rounded-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/25"
            >
              Donate
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-cream hover:text-gold p-2 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-ink border-t border-gold/20 overflow-hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="px-5 py-5">
              {/* Foundations */}
              {PRIMARY_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block font-anton text-2xl tracking-wide py-3 border-b border-cream/[0.07] transition-colors ${
                    pathname === link.to ? 'text-gold' : 'text-cream hover:text-gold'
                  }`}
                >
                  {link.label.toUpperCase()}
                </Link>
              ))}

              {/* Groups */}
              <div className="mt-5">
                {NAV_GROUPS.map((group) => (
                  <div key={group.label}>
                    <button
                      onClick={() => toggleMobileGroup(group.label)}
                      className="flex items-center justify-between w-full text-cream/70 hover:text-gold font-bold uppercase tracking-wider text-sm py-2.5 transition-colors"
                    >
                      {group.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          mobileOpenGroup === group.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileOpenGroup === group.label && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pl-4 pb-2 space-y-1 overflow-hidden"
                        >
                          {group.links.map((link) => (
                            <Link
                              key={link.to}
                              to={link.to}
                              onClick={() => setMobileOpen(false)}
                              className="block text-cream/60 hover:text-gold py-1.5 text-sm transition-colors"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block text-cream/70 hover:text-gold font-bold uppercase tracking-wider text-sm py-2.5 transition-colors"
                >
                  Contact
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 text-gold font-bold uppercase tracking-wider text-sm py-2.5 border-t border-gold/20 mt-2 pt-3"
                  >
                    <Shield size={14} />
                    Admin Dashboard
                  </Link>
                )}
              </div>

              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="block bg-gold text-ink font-bold text-center uppercase tracking-wider px-4 py-3.5 rounded-sm mt-5"
              >
                Donate
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}