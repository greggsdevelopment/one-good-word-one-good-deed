import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, Lock, Shield } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function FooterSection({ logoUrl }) {
  // Staff access lives down here on purpose. Visitors have no reason to log in,
  // so the link stays small and out of the way instead of sitting in the nav.
  const { user, isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && user?.role === 'admin';

  // The four foundations, mirrored from the main nav.
  const foundationLinks = [
    { label: 'Remember Drayke', to: '/drayke' },
    { label: 'Pledge Wall', to: '/pledge-wall' },
    { label: 'Shop', to: '/shop' },
    { label: 'School Programs', to: '/programs' },
  ];

  const pageLinks = [
    { label: 'About Jason', to: '/about' },
    { label: 'About Cody', to: '/about-cody' },
    { label: 'Our Story', to: '/stories' },
    { label: 'Events', to: '/events' },
    { label: 'Resources', to: '/resources' },
    { label: 'Sponsor Hall of Fame', to: '/hall-of-fame' },
    { label: 'Become a Sponsor', to: '/sponsorship' },
    { label: 'Contact', to: '/contact' },
    { label: 'Donate', to: 'https://www.gofundme.com/f/support-one-good-word-one-good-deeds-mission', external: true },
  ];

  return (
    <footer className="relative bg-ink pt-16 pb-8 px-6 overflow-hidden">
      <div className="grain-overlay" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {logoUrl && (
                <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-full object-cover shrink-0" />
              )}
              <div>
                <p className="font-barlow-condensed text-cream text-sm font-semibold tracking-wide">
                  ONE GOOD WORD...ONE GOOD DEED
                </p>
                <p className="font-barlow text-cream/30 text-xs">LLC</p>
              </div>
            </div>
            <p className="font-barlow-condensed text-gold/80 text-sm tracking-wider uppercase mb-6">
              Stop Bullying. Stop Racism. Through God's Love.
            </p>
            {/* Contact info */}
            <div className="space-y-2">
              <a href="tel:7343833865" className="flex items-center gap-2 text-cream/40 hover:text-gold transition-colors font-barlow text-sm">
                <Phone className="w-4 h-4 shrink-0" />
                (734) 383-3865
              </a>
              <a href="mailto:greggsdevelopment@gmail.com" className="flex items-center gap-2 text-cream/40 hover:text-gold transition-colors font-barlow text-sm">
                <Mail className="w-4 h-4 shrink-0" />
                greggsdevelopment@gmail.com
              </a>
              <div className="flex items-center gap-2 text-cream/40 font-barlow text-sm">
                <MapPin className="w-4 h-4 shrink-0" />
                Troy, MI
              </div>
            </div>
          </div>

          {/* Pages */}
          <div>
            <p className="font-barlow-condensed text-cream/30 text-xs tracking-[0.3em] uppercase mb-4">Pages</p>
            <div className="flex flex-col gap-2">
              {pageLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.to}
                    href={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-barlow-condensed text-cream/50 hover:text-gold text-sm tracking-wider uppercase transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="font-barlow-condensed text-cream/50 hover:text-gold text-sm tracking-wider uppercase transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Quick links + Social */}
          <div>
            <p className="font-barlow-condensed text-cream/30 text-xs tracking-[0.3em] uppercase mb-4">Start Here</p>
            <div className="flex flex-col gap-2 mb-8">
              {foundationLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-barlow-condensed text-cream/70 hover:text-gold text-sm tracking-wider uppercase transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="font-barlow-condensed text-cream/30 text-xs tracking-[0.3em] uppercase mb-3">Follow Us</p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/groups/1332878885346719"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm border border-white/10 hover:border-gold/40 hover:bg-gold/10 flex items-center justify-center text-cream/50 hover:text-gold transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-sm border border-white/10 hover:border-gold/40 hover:bg-gold/10 flex items-center justify-center text-cream/50 hover:text-gold transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="h-px bg-cream/5 mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-barlow text-cream/20 text-xs text-center sm:text-left">
            © 2026 One Good Word...One Good Deed LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="font-barlow-condensed text-gold/30 text-xs tracking-wider uppercase">
              Powered by Kindness
            </p>
            {isAdmin ? (
              <Link
                to="/admin"
                className="flex items-center gap-1 font-barlow-condensed text-gold/50 hover:text-gold text-xs tracking-wider uppercase transition-colors"
              >
                <Shield className="w-3 h-3" />
                Admin
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 font-barlow-condensed text-cream/20 hover:text-gold text-xs tracking-wider uppercase transition-colors"
              >
                <Lock className="w-3 h-3" />
                Staff Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}