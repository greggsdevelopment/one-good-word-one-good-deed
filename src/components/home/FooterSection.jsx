export default function FooterSection({ logoUrl }) {
  const scrollTo = (id) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const links = [
    { label: 'Mission', href: '#mission' },
    { label: 'Pillars', href: '#pillars' },
    { label: 'Pledge', href: '#pledge' },
    { label: 'Get Involved', href: '#involved' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="relative bg-ink py-16 px-6 overflow-hidden">
      <div className="grain-overlay" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          {/* Logo & info */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
              {logoUrl && (
                <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded-full object-cover" />
              )}
              <div>
                <p className="font-barlow-condensed text-cream text-sm font-semibold tracking-wide">
                  ONE GOOD WORD...ONE GOOD DEED
                </p>
                <p className="font-barlow text-cream/30 text-xs">LLC</p>
              </div>
            </div>
            <p className="font-barlow-condensed text-gold/80 text-sm tracking-wider uppercase">
              Stop Bullying. Stop Racism. Through God's Love.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="font-barlow-condensed text-cream/40 hover:text-gold text-sm tracking-wider uppercase transition-colors"
              >
                {link.label}
              </button>
            ))}
            <a
              href="https://facebook.com/groups/PLACEHOLDER"
              target="_blank"
              rel="noopener noreferrer"
              className="font-barlow-condensed text-cream/40 hover:text-gold text-sm tracking-wider uppercase transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-cream/5 my-10" />

        <p className="font-barlow text-cream/20 text-xs text-center">
          © 2026 One Good Word...One Good Deed LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}