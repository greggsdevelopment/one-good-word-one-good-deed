import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function FooterSection({ logoUrl }) {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const pageLinks = [
    { label: 'About', to: '/about' },
    { label: 'Programs', to: '/programs' },
    { label: 'Stories', to: '/stories' },
    { label: 'Resources', to: '/resources' },
    { label: 'Donate', to: '/donate' },
    { label: 'Pledge Wall', to: '/pledge' },
    { label: 'Shop', to: '/shop' },
    { label: 'Events', to: '/events' },
    { label: 'Gallery', to: '/gallery' },
  ];

  const scrollLinks = [
    { label: 'Mission', href: '#mission' },
    { label: 'Pillars', href: '#pillars' },
    { label: 'Get Involved', href: '#involved' },
    { label: 'Contact', href: '#contact' },
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
              <a href="tel:2488089373" className="flex items-center gap-2 text-cream/40 hover:text-gold transition-colors font-barlow text-sm">
                <Phone className="w-4 h-4 shrink-0" />
                (248) 808-9373
              </a>
              <a href="mailto:1goodword1gooddeedllc@gmail.com" className="flex items-center gap-2 text-cream/40 hover:text-gold transition-colors font-barlow text-sm">
                <Mail className="w-4 h-4 shrink-0" />
                1goodword1gooddeedllc@gmail.com
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
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-barlow-condensed text-cream/50 hover:text-gold text-sm tracking-wider uppercase transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links + Social */}
          <div>
            <p className="font-barlow-condensed text-cream/30 text-xs tracking-[0.3em] uppercase mb-4">On This Page</p>
            <div className="flex flex-col gap-2 mb-8">
              {scrollLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="font-barlow-condensed text-cream/50 hover:text-gold text-sm tracking-wider uppercase transition-colors text-left"
                >
                  {link.label}
                </button>
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
          <p className="font-barlow-condensed text-gold/30 text-xs tracking-wider uppercase">
            Powered by Kindness
          </p>
        </div>
      </div>
    </footer>
  );
}